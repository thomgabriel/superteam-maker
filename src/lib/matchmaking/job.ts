import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { MATCHMAKING_CONFIG } from './config';
import { runMatchmaking, type FormedTeam } from './engine';
import type { EnrichedPoolUser } from '@/types/database';
import { trackEvent } from '@/lib/analytics.server';
import { scoreCandidate } from './scoring';
import { generateUniqueTeamName } from './team-names';
import { getFlexMacroRoles } from './roles';
import { logError, logInfo } from '@/lib/monitoring';
import { emit as dispatcherEmit } from '@/lib/notifications/dispatcher';

interface RunMatchmakingJobOptions {
  triggerSource: 'cron' | 'admin';
  supabase?: SupabaseClient;
}

export interface MatchmakingJobResult {
  poolSize: number;
  teamsFormed: number;
  usersMatched: number;
  replacementsPerformed: number;
  roundNumber: number;
  notes: string[];
}

interface MaintenanceResult {
  replacementsPerformed: number;
  notes: string[];
}

interface WaitingPoolRow {
  user_id: string;
  profile_id: string;
  created_at: string;
  profiles:
    | {
        name: string;
        primary_role: string;
        macro_role: EnrichedPoolUser['macro_role'];
        seniority: EnrichedPoolUser['seniority'];
        profile_interests: { interest: string }[];
        profile_roles: { role: string }[];
      }
    | {
        name: string;
        primary_role: string;
        macro_role: EnrichedPoolUser['macro_role'];
        seniority: EnrichedPoolUser['seniority'];
        profile_interests: { interest: string }[];
        profile_roles: { role: string }[];
      }[];
}

interface TeamContextMemberRow {
  user_id: string;
  joined_at: string;
  profiles:
    | {
        name: string;
        primary_role: string;
        macro_role: EnrichedPoolUser['macro_role'];
        seniority: EnrichedPoolUser['seniority'];
        profile_interests: { interest: string }[];
        profile_roles: { role: string }[];
      }
    | {
        name: string;
        primary_role: string;
        macro_role: EnrichedPoolUser['macro_role'];
        seniority: EnrichedPoolUser['seniority'];
        profile_interests: { interest: string }[];
        profile_roles: { role: string }[];
      }[];
}

async function notifyMatchedUsers(
  supabase: SupabaseClient,
  userIds: string[],
  teamName: string,
  teamId: string,
) {
  if (userIds.length === 0) return;

  try {
    await dispatcherEmit(
      'team_matched',
      {
        user_ids: userIds,
        team_id: teamId,
        payload: {
          kind: 'team_matched',
          team_id: teamId,
          team_name: teamName,
        },
      },
      supabase,
    );
  } catch (error) {
    logError('matchmaking.notify_matched.dispatcher_emit_failed', error, {
      team_id: teamId,
    });
  }
}

function normalizeEnrichedUser(
  entry: WaitingPoolRow | TeamContextMemberRow,
  waitingSince: string,
  fallbackProfileId: string,
): EnrichedPoolUser {
  const profile = Array.isArray(entry.profiles) ? entry.profiles[0] : entry.profiles;

  if (!profile) {
    throw new Error(`Missing profile payload for user ${entry.user_id}`);
  }

  const secondaryRoles = ('profile_roles' in profile && Array.isArray(profile.profile_roles))
    ? profile.profile_roles.map((r) => r.role)
    : [];

  return {
    user_id: entry.user_id,
    profile_id: 'profile_id' in entry ? entry.profile_id : fallbackProfileId,
    name: profile.name,
    primary_role: profile.primary_role,
    macro_role: profile.macro_role,
    seniority: profile.seniority,
    interests: profile.profile_interests.map((interest) => interest.interest),
    waiting_since: waitingSince,
    flex_macro_roles: getFlexMacroRoles(profile.primary_role, secondaryRoles),
  };
}

export function getEligibleUsersForTeamAssignment(
  team: FormedTeam,
  waitingUserIds: Set<string>,
  activeMemberUserIds: Set<string>,
) {
  return team.members.filter(
    (member) =>
      waitingUserIds.has(member.user_id) && !activeMemberUserIds.has(member.user_id),
  );
}

async function createMatchmakingRunRecord(
  supabase: SupabaseClient,
  triggerSource: RunMatchmakingJobOptions['triggerSource'],
) {
  const { data } = await supabase
    .from('matchmaking_runs')
    .insert({
      trigger_source: triggerSource,
      status: 'running',
      pool_size: 0,
      teams_formed: 0,
      users_matched: 0,
      replacements_performed: 0,
    })
    .select('id')
    .single();

  return data?.id ?? null;
}

async function updateMatchmakingRunRecord(
  supabase: SupabaseClient,
  runId: string | null,
  values: Record<string, string | number | null>,
) {
  if (!runId) {
    return;
  }

  await supabase
    .from('matchmaking_runs')
    .update(values)
    .eq('id', runId);
}

export async function deactivateTeam(
  supabase: SupabaseClient,
  teamId: string,
  reason:
    | 'confirmation_failed'
    | 'activation_timeout'
    | 'understaffed_grace'
    | 'manual_admin' = 'understaffed_grace',
) {
  // Capture recipients + team name BEFORE the RPC runs — after deactivation
  // the members move to 'inactive' so we can't query them as 'active' anymore.
  const [teamResult, membersResult] = await Promise.all([
    supabase.from('teams').select('name').eq('id', teamId).maybeSingle(),
    supabase
      .from('team_members')
      .select('user_id')
      .eq('team_id', teamId)
      .eq('status', 'active'),
  ]);

  if (teamResult.error) {
    logError('matchmaking.deactivate_team.team_prefetch_failed', teamResult.error, {
      teamId,
    });
  }
  if (membersResult.error) {
    logError('matchmaking.deactivate_team.members_prefetch_failed', membersResult.error, {
      teamId,
    });
  }

  const teamRow = teamResult.data;
  const activeMembers = membersResult.data ?? [];

  const { data, error } = await supabase.rpc('deactivate_team_and_members', {
    p_team_id: teamId,
  });

  if (error) {
    logError('matchmaking.deactivate_team.rpc_failed', error, { teamId });
    throw error;
  }

  if (data !== true) {
    const unexpected = new Error('Team deactivation RPC returned unexpected result');
    logError('matchmaking.deactivate_team.unexpected_result', unexpected, {
      teamId,
      result: data ?? null,
    });
    throw unexpected;
  }

  // Fire-and-forget notification. RPC already succeeded; emit failure should
  // never surface as a deactivation failure. If the pre-fetch errored we still
  // attempt the emit with an empty name rather than skip silently.
  if (activeMembers.length > 0) {
    try {
      await dispatcherEmit('team_deactivated', {
        user_ids: activeMembers.map((m) => m.user_id),
        team_id: teamId,
        payload: {
          kind: 'team_deactivated',
          team_id: teamId,
          team_name: teamRow?.name ?? '',
          reason,
        },
      });
    } catch (error) {
      logError('matchmaking.deactivate_team.notify_failed', error, { teamId });
    }
  } else {
    logError(
      'matchmaking.deactivate_team.no_active_members',
      new Error('deactivateTeam found zero active members for notification fan-out'),
      { teamId },
    );
  }
}

// Expire teams past confirmation_deadline_at. RPC advances (>=3 confirms) or
// dissolves (sets dissolution_reason='confirmation_failed'). For each
// affected team we emit the appropriate event for email + in-app fan-out.
export async function processConfirmationWindowExpiries(
  supabase: SupabaseClient,
  notes: string[],
) {
  const { data, error } = await supabase.rpc('expire_confirmation_windows');
  if (error) {
    logError('matchmaking.expire_confirmation_windows.failed', error);
    notes.push('expire_confirmation_windows rpc failed');
    return;
  }

  const payload =
    data && typeof data === 'object' && !Array.isArray(data)
      ? (data as {
          advanced_team_ids?: string[];
          dissolved_team_ids?: string[];
        })
      : null;

  const advanced = payload?.advanced_team_ids ?? [];
  const dissolved = payload?.dissolved_team_ids ?? [];

  if (advanced.length) {
    notes.push(`advanced ${advanced.length} teams from pending_confirmation`);
  }
  if (dissolved.length) {
    notes.push(`dissolved ${dissolved.length} teams after confirmation window`);
  }

  for (const teamId of advanced) {
    const [{ data: memberRows }, { data: teamRow }] = await Promise.all([
      supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', teamId)
        .eq('status', 'active'),
      supabase
        .from('teams')
        .select('name, activation_deadline_at')
        .eq('id', teamId)
        .maybeSingle(),
    ]);

    const userIds = (memberRows ?? []).map((row) => row.user_id);
    if (userIds.length === 0) continue;

    try {
      await dispatcherEmit(
        'leader_claim_opened',
        {
          user_ids: userIds,
          team_id: teamId,
          payload: {
            kind: 'leader_claim_opened',
            team_id: teamId,
            team_name: teamRow?.name ?? '',
            activation_deadline_at:
              teamRow?.activation_deadline_at ??
              new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          },
        },
        supabase,
      );
    } catch (emitError) {
      logError(
        'matchmaking.emit_leader_claim_opened_failed',
        emitError,
        { teamId },
      );
    }
  }

  for (const teamId of dissolved) {
    // Members were just flipped to 'replaced' by the RPC — fan out on the
    // historical row so every affected user still gets an email.
    const [{ data: memberRows }, { data: teamRow }] = await Promise.all([
      supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', teamId)
        .eq('status', 'replaced'),
      supabase
        .from('teams')
        .select('name')
        .eq('id', teamId)
        .maybeSingle(),
    ]);

    const userIds = (memberRows ?? []).map((row) => row.user_id);
    if (userIds.length === 0) continue;

    try {
      await dispatcherEmit(
        'team_dissolved_pre_activation',
        {
          user_ids: userIds,
          team_id: teamId,
          payload: {
            kind: 'team_dissolved_pre_activation',
            team_id: teamId,
            team_name: teamRow?.name ?? '',
            reason: 'confirmation_failed',
          },
        },
        supabase,
      );
    } catch (emitError) {
      logError(
        'matchmaking.emit_team_dissolved_failed',
        emitError,
        { teamId },
      );
    }
  }
}

// Cadence-based reminders. Dispatcher dedups via throttle_key so repeated
// cron ticks within the same window don't double-send.
async function emitConfirmationAndLeaderReminders(
  supabase: SupabaseClient,
  notes: string[],
) {
  const nowMs = Date.now();

  // confirmation_reminder at T+24h into pending_confirmation (i.e. 24h left
  // until the 48h deadline). Only notify members who haven't decided yet.
  const twentyFourHoursFromNow = new Date(nowMs + 24 * 60 * 60 * 1000).toISOString();
  const twentyFiveHoursFromNow = new Date(nowMs + 25 * 60 * 60 * 1000).toISOString();

  const { data: reminderCandidates } = await supabase
    .from('teams')
    .select('id, name, confirmation_deadline_at')
    .eq('status', 'pending_confirmation')
    .gte('confirmation_deadline_at', twentyFourHoursFromNow)
    .lt('confirmation_deadline_at', twentyFiveHoursFromNow);

  for (const team of reminderCandidates ?? []) {
    const { data: memberRows } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('team_id', team.id)
      .eq('status', 'active');

    const memberIds = (memberRows ?? []).map((row) => row.user_id);
    if (memberIds.length === 0) continue;

    const { data: decided } = await supabase
      .from('team_confirmations')
      .select('user_id')
      .eq('team_id', team.id)
      .in('user_id', memberIds);

    const decidedIds = new Set((decided ?? []).map((row) => row.user_id));
    const pendingIds = memberIds.filter((id) => !decidedIds.has(id));
    if (pendingIds.length === 0) continue;

    try {
      await dispatcherEmit(
        'confirmation_reminder',
        {
          user_ids: pendingIds,
          team_id: team.id,
          throttle_key: `confirmation_reminder:${team.id}:24h`,
          payload: {
            kind: 'confirmation_reminder',
            team_id: team.id,
            team_name: team.name,
            deadline_at:
              team.confirmation_deadline_at ?? twentyFiveHoursFromNow,
          },
        },
        supabase,
      );
    } catch (error) {
      logError('matchmaking.emit_confirmation_reminder_failed', error, {
        teamId: team.id,
      });
    }
  }

  if ((reminderCandidates ?? []).length) {
    notes.push(
      `queued confirmation_reminder for ${reminderCandidates!.length} teams`,
    );
  }

  // leader_needed_reminder — teams in pending_activation with no leader, at
  // T+12h and T+23h into the activation window. activation_deadline_at is set
  // 24h ahead when the team advances, so we look for teams whose remaining
  // activation time falls into each window.
  const windows: Array<{ key: '12h' | '23h'; minMs: number; maxMs: number }> = [
    { key: '23h', minMs: 0.75 * 60 * 60 * 1000, maxMs: 1.25 * 60 * 60 * 1000 },
    { key: '12h', minMs: 11.5 * 60 * 60 * 1000, maxMs: 12.5 * 60 * 60 * 1000 },
  ];

  for (const w of windows) {
    const minIso = new Date(nowMs + w.minMs).toISOString();
    const maxIso = new Date(nowMs + w.maxMs).toISOString();

    const { data: pendingTeams } = await supabase
      .from('teams')
      .select('id, name, activation_deadline_at')
      .eq('status', 'pending_activation')
      .is('leader_id', null)
      .gte('activation_deadline_at', minIso)
      .lt('activation_deadline_at', maxIso);

    for (const team of pendingTeams ?? []) {
      const { data: memberRows } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', team.id)
        .eq('status', 'active');

      const userIds = (memberRows ?? []).map((row) => row.user_id);
      if (userIds.length === 0) continue;

      const hoursRemaining = w.key === '23h' ? 1 : 12;

      try {
        await dispatcherEmit(
          'leader_needed_reminder',
          {
            user_ids: userIds,
            team_id: team.id,
            throttle_key: `leader_needed_reminder:${team.id}:${w.key}`,
            payload: {
              kind: 'leader_needed_reminder',
              team_id: team.id,
              team_name: team.name,
              activation_deadline_at:
                team.activation_deadline_at ?? maxIso,
              hours_remaining: hoursRemaining,
            },
          },
          supabase,
        );
      } catch (error) {
        logError('matchmaking.emit_leader_needed_reminder_failed', error, {
          teamId: team.id,
          window: w.key,
        });
      }
    }

    if ((pendingTeams ?? []).length) {
      notes.push(
        `queued leader_needed_reminder[${w.key}] for ${pendingTeams!.length} teams`,
      );
    }
  }
}

async function performMaintenance(supabase: SupabaseClient): Promise<MaintenanceResult> {
  const notes: string[] = [];
  let replacementsPerformed = 0;
  const nowIso = new Date().toISOString();

  // C.1 + C.2 — run confirmation-window expiries and cadence reminders first
  // so the downstream replacement scan sees up-to-date team statuses.
  await processConfirmationWindowExpiries(supabase, notes);
  await emitConfirmationAndLeaderReminders(supabase, notes);

  // D.4 integration fix — standalone sweep: any team flagged understaffed
  // beyond the grace window must be deactivated, even if no new member has
  // gone inactive on this cron tick. Previously the only path to
  // deactivation was inside the neverVisited loop, which meant teams with no
  // new inactivity sat in expired-grace limbo indefinitely.
  try {
    const graceMs =
      MATCHMAKING_CONFIG.understaffedGraceHours * 60 * 60 * 1000;
    const graceCutoffIso = new Date(Date.now() - graceMs).toISOString();
    const { data: expiredGraceTeams } = await supabase
      .from('teams')
      .select('id')
      .eq('status', 'active')
      .not('understaffed_at', 'is', null)
      .lt('understaffed_at', graceCutoffIso);

    for (const team of expiredGraceTeams ?? []) {
      try {
        await deactivateTeam(supabase, team.id);
        notes.push(`deactivated expired-grace team ${team.id}`);
      } catch (error) {
        logError('matchmaking.maintenance.expired_grace_deactivate_failed', error, {
          teamId: team.id,
        });
        notes.push(`failed to deactivate expired-grace team ${team.id}`);
      }
    }
  } catch (error) {
    logError('matchmaking.maintenance.expired_grace_sweep_failed', error);
    notes.push('expired-grace sweep failed');
  }

  // C.7 + M6 — detect dormant leaders (read-only flag set). The reclaim UI
  // is separately gated behind LEADER_DORMANT_RECLAIM; detection runs
  // unconditionally so we accumulate FP-rate data.
  try {
    const { data: dormantTeams } = await supabase.rpc('detect_dormant_leaders');
    const rows = (dormantTeams ?? []) as Array<{ team_id: string; leader_id: string }>;
    for (const row of rows) {
      try {
        const [{ data: team }, { data: members }, { data: leaderProfile }, { data: leaderMember }] =
          await Promise.all([
            supabase.from('teams').select('id, name').eq('id', row.team_id).maybeSingle(),
            supabase
              .from('team_members')
              .select('user_id')
              .eq('team_id', row.team_id)
              .eq('status', 'active'),
            supabase.from('profiles').select('name').eq('user_id', row.leader_id).maybeSingle(),
            supabase
              .from('team_members')
              .select('last_active_at')
              .eq('team_id', row.team_id)
              .eq('user_id', row.leader_id)
              .maybeSingle(),
          ]);
        if (team && members && members.length > 0) {
          const hoursSilent = leaderMember?.last_active_at
            ? Math.max(
                0,
                Math.floor(
                  (Date.now() - new Date(leaderMember.last_active_at).getTime()) /
                    (60 * 60 * 1000),
                ),
              )
            : 72;
          await dispatcherEmit('leader_dormant_detected', {
            user_ids: members.map((m) => m.user_id),
            team_id: team.id,
            payload: {
              kind: 'leader_dormant_detected',
              team_id: team.id,
              team_name: team.name,
              leader_name: leaderProfile?.name ?? 'O líder',
              hours_silent: hoursSilent,
            },
            throttle_key: `leader_dormant_detected:${team.id}`,
          });
        }
      } catch (error) {
        logError('matchmaking.maintenance.dormant_emit_failed', error, {
          teamId: row.team_id,
        });
        notes.push(`failed emit leader_dormant_detected for ${row.team_id}`);
      }
    }
    if (rows.length > 0) {
      notes.push(`flagged ${rows.length} dormant leaders`);
    }
  } catch (error) {
    logError('matchmaking.maintenance.dormant_detection_failed', error);
    notes.push('dormant leader detection failed');
  }

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: reclaimedTeams } = await supabase
    .from('teams')
    .update({
      leader_id: null,
      leader_claimed_at: null,
      status: 'pending_activation',
      updated_at: nowIso,
    })
    .eq('status', 'pending_activation')
    .lt('leader_claimed_at', twentyFourHoursAgo)
    .select('id');

  if (reclaimedTeams?.length) {
    // Keep team_members.is_leader in lockstep with teams.leader_id — the two
    // are dual source-of-truth for leadership.
    const teamIds = reclaimedTeams.map((t) => t.id);
    await supabase
      .from('team_members')
      .update({ is_leader: false })
      .in('team_id', teamIds)
      .eq('is_leader', true);

    notes.push(`reset ${reclaimedTeams.length} stale leader claims`);
  }

  const { data: expiredTeams } = await supabase
    .from('teams')
    .select('id')
    .eq('status', 'pending_activation')
    .is('leader_id', null)
    .lt('activation_deadline_at', nowIso);

  if (expiredTeams?.length) {
    for (const team of expiredTeams) {
      try {
        await deactivateTeam(supabase, team.id, 'activation_timeout');
      } catch (error) {
        logError('matchmaking.maintenance.unclaimed_deactivate_failed', error, {
          teamId: team.id,
        });
        notes.push(`failed to deactivate team ${team.id}`);
        continue;
      }
    }
    notes.push(`deactivated ${expiredTeams.length} unclaimed teams`);
  }

  // Only replace members who never visited the team page (last_active_at was never
  // updated beyond its default value set at join time) AND joined 48h+ ago.
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { data: inactiveMembers } = await supabase
    .from('team_members')
    .select('id, team_id, user_id, joined_at, last_active_at')
    .eq('status', 'active')
    .lt('joined_at', fortyEightHoursAgo);

  // Filter to only members who never visited (last_active_at within 5s of joined_at)
  const neverVisited = (inactiveMembers ?? []).filter((m) => {
    const joined = new Date(m.joined_at).getTime();
    const lastActive = new Date(m.last_active_at).getTime();
    return Math.abs(lastActive - joined) < 5000;
  });

  for (const member of neverVisited) {
    const { data: markedMember } = await supabase
      .from('team_members')
      .update({ status: 'replaced', replaced_at: nowIso })
      .eq('id', member.id)
      .eq('status', 'active')
      .select('id')
      .maybeSingle();

    if (!markedMember) {
      continue;
    }

    await supabase.from('matchmaking_pool').delete().eq('user_id', member.user_id);
    await trackEvent({
      event: 'user_replaced',
      userId: member.user_id,
      properties: { team_id: member.team_id },
    });

    // Fire-and-forget: notify the user that they've been replaced so they
    // get the requeue prompt by email instead of only on next app load.
    try {
      const { data: teamForReplaced } = await supabase
        .from('teams')
        .select('name')
        .eq('id', member.team_id)
        .maybeSingle();
      if (teamForReplaced?.name) {
        await dispatcherEmit('you_were_replaced', {
          user_ids: [member.user_id],
          team_id: member.team_id,
          payload: {
            kind: 'you_were_replaced',
            team_id: member.team_id,
            team_name: teamForReplaced.name,
          },
        });
      }
    } catch (error) {
      notes.push(`failed emit you_were_replaced for ${member.user_id}`);
    }

    const [{ data: replacementRows }, { data: teamRows }] = await Promise.all([
      supabase
        .from('matchmaking_pool')
        .select(`
          user_id,
          profile_id,
          created_at,
          profiles!inner (
            name,
            primary_role,
            macro_role,
            seniority,
            profile_interests (interest),
            profile_roles (role)
          )
        `)
        .eq('status', 'waiting')
        .order('created_at', { ascending: true })
        .limit(25),
      supabase
        .from('team_members')
        .select(`
          user_id,
          joined_at,
          profiles:user_id (
            name,
            primary_role,
            macro_role,
            seniority,
            profile_interests (interest),
            profile_roles (role)
          )
        `)
        .eq('team_id', member.team_id)
        .eq('status', 'active'),
    ]);

    const teamContext = ((teamRows ?? []) as unknown as TeamContextMemberRow[]).map((row) =>
      normalizeEnrichedUser(row, row.joined_at, `team-context-${row.user_id}`),
    );

    const replacementCandidates = ((replacementRows ?? []) as unknown as WaitingPoolRow[]).map((row) =>
      normalizeEnrichedUser(row, row.created_at, row.profile_id),
    );

    const maxWaitMs = Math.max(
      ...replacementCandidates.map((candidate) => Date.now() - new Date(candidate.waiting_since).getTime()),
      1,
    );

    let replacement: EnrichedPoolUser | null = null;
    let replacementScore = -1;

    for (const candidate of replacementCandidates) {
      const score = scoreCandidate(candidate, teamContext, maxWaitMs, MATCHMAKING_CONFIG.weights);
      if (score > replacementScore) {
        replacement = candidate;
        replacementScore = score;
      }
    }

    if (replacement) {
      const { error: insertError } = await supabase.from('team_members').insert({
        team_id: member.team_id,
        user_id: replacement.user_id,
        specific_role: replacement.primary_role,
        macro_role: replacement.macro_role,
      });

      if (!insertError) {
        replacementsPerformed += 1;
        await supabase
          .from('matchmaking_pool')
          .update({ status: 'assigned', updated_at: nowIso })
          .eq('user_id', replacement.user_id)
          .eq('status', 'waiting');

        await trackEvent({
          event: 'matched_to_team',
          userId: replacement.user_id,
          properties: { source: 'replacement' },
        });

        const { data: team } = await supabase
          .from('teams')
          .select('name')
          .eq('id', member.team_id)
          .maybeSingle();

        if (team?.name) {
          await notifyMatchedUsers(supabase, [replacement.user_id], team.name, member.team_id);
        }

        // Notify the remaining active members that a new teammate joined.
        // Excludes the new replacement (they just got team_matched) and the
        // replaced user (they just got you_were_replaced).
        try {
          const { data: remainingMembers } = await supabase
            .from('team_members')
            .select('user_id')
            .eq('team_id', member.team_id)
            .eq('status', 'active')
            .neq('user_id', replacement.user_id);

          if (team?.name && remainingMembers && remainingMembers.length > 0) {
            await dispatcherEmit('member_replaced', {
              user_ids: remainingMembers.map((m) => m.user_id),
              team_id: member.team_id,
              payload: {
                kind: 'member_replaced',
                team_id: member.team_id,
                team_name: team.name,
                replacement_name: replacement.name,
                replacement_role: replacement.primary_role,
              },
            });
          }
        } catch (error) {
          notes.push(`failed emit member_replaced for ${member.team_id}`);
        }
      }
    }

    const { count } = await supabase
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', member.team_id)
      .eq('status', 'active');

    if ((count ?? 0) < MATCHMAKING_CONFIG.minTeamSize) {
      // Check if already marked as understaffed
      const { data: teamRow } = await supabase
        .from('teams')
        .select('understaffed_at')
        .eq('id', member.team_id)
        .maybeSingle();

      if (!teamRow?.understaffed_at) {
        // First time below min — mark and give 24h grace period
        await supabase
          .from('teams')
          .update({ understaffed_at: nowIso, updated_at: nowIso })
          .eq('id', member.team_id);
        notes.push(`team ${member.team_id} understaffed, 24h grace started`);

        try {
          const [{ data: team }, { data: activeMembers }] = await Promise.all([
            supabase
              .from('teams')
              .select('id, name')
              .eq('id', member.team_id)
              .maybeSingle(),
            supabase
              .from('team_members')
              .select('user_id')
              .eq('team_id', member.team_id)
              .eq('status', 'active'),
          ]);

          if (team && activeMembers && activeMembers.length > 0) {
            const graceDeadline = new Date(
              Date.now() + MATCHMAKING_CONFIG.understaffedGraceHours * 60 * 60 * 1000,
            ).toISOString();
            await dispatcherEmit('team_understaffed', {
              user_ids: activeMembers.map((m) => m.user_id),
              team_id: team.id,
              payload: {
                kind: 'team_understaffed',
                team_id: team.id,
                team_name: team.name,
                grace_deadline_at: graceDeadline,
                current_member_count: count ?? 0,
              },
              throttle_key: `team_understaffed:${team.id}`,
            });
          }
        } catch (error) {
          notes.push(`failed to emit team_understaffed for ${member.team_id}`);
        }
      } else {
        const understaffedSince = new Date(teamRow.understaffed_at).getTime();
        const gracePeriodMs = MATCHMAKING_CONFIG.understaffedGraceHours * 60 * 60 * 1000;
        if (Date.now() - understaffedSince >= gracePeriodMs) {
          try {
            await deactivateTeam(supabase, member.team_id);
          } catch {
            notes.push(`failed to deactivate team ${member.team_id}`);
          }
        }
      }
    } else {
      // Team recovered — clear understaffed marker
      await supabase
        .from('teams')
        .update({ understaffed_at: null })
        .eq('id', member.team_id)
        .not('understaffed_at', 'is', null);
    }
  }

  if (replacementsPerformed > 0) {
    notes.push(`replaced ${replacementsPerformed} inactive members`);
  }

  return { replacementsPerformed, notes };
}

async function fetchWaitingPool(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('matchmaking_pool')
    .select(`
      user_id,
      profile_id,
      created_at,
      profiles!inner (
        name,
        primary_role,
        macro_role,
        seniority,
        profile_interests (interest),
        profile_roles (role)
      )
    `)
    .eq('status', 'waiting')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as unknown as WaitingPoolRow[]).map((entry) =>
    normalizeEnrichedUser(entry, entry.created_at, entry.profile_id),
  ) as EnrichedPoolUser[];
}

async function loadUsedTeamNames(supabase: SupabaseClient) {
  const { data, error } = await supabase.from('teams').select('name');

  if (error) {
    throw new Error(error.message);
  }

  return new Set((data ?? []).map((team) => team.name));
}

function createSupabaseServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function runMatchmakingJob(
  options: RunMatchmakingJobOptions,
): Promise<MatchmakingJobResult> {
  const startedAt = Date.now();
  const supabase = options.supabase ?? createSupabaseServiceClient();
  const runId = await createMatchmakingRunRecord(supabase, options.triggerSource);
  const notes: string[] = [];

  logInfo('matchmaking.job.started', {
    triggerSource: options.triggerSource,
    runId,
  });

  try {
    const maintenance = await performMaintenance(supabase);
    notes.push(...maintenance.notes);

    const pool = await fetchWaitingPool(supabase);
    const poolSize = pool.length;

    if (pool.length < MATCHMAKING_CONFIG.minTeamSize) {
      const result = {
        poolSize,
        teamsFormed: 0,
        usersMatched: 0,
        replacementsPerformed: maintenance.replacementsPerformed,
        roundNumber: 0,
        notes: [...notes, 'pool too small'],
      };

      await updateMatchmakingRunRecord(supabase, runId, {
        status: 'completed',
        pool_size: result.poolSize,
        teams_formed: result.teamsFormed,
        users_matched: result.usersMatched,
        replacements_performed: result.replacementsPerformed,
        notes: result.notes.join('; '),
        finished_at: new Date().toISOString(),
      });

      logInfo('matchmaking.job.completed', {
        triggerSource: options.triggerSource,
        runId,
        durationMs: Date.now() - startedAt,
        poolSize: result.poolSize,
        teamsFormed: result.teamsFormed,
        usersMatched: result.usersMatched,
        replacementsPerformed: result.replacementsPerformed,
        roundNumber: result.roundNumber,
        notesCount: result.notes.length,
      });

      return result;
    }

    const { count } = await supabase
      .from('teams')
      .select('*', { count: 'exact', head: true });

    const roundNumber = Math.floor((count ?? 0) / 10);
    const candidateTeams = runMatchmaking(pool, roundNumber);
    const usedTeamNames = await loadUsedTeamNames(supabase);
    let teamsFormed = 0;
    let usersMatched = 0;

    for (const team of candidateTeams) {
      const selectedUserIds = team.members.map((member) => member.user_id);
      const [{ data: waitingRows }, { data: activeMemberships }] = await Promise.all([
        supabase
          .from('matchmaking_pool')
          .select('user_id')
          .in('user_id', selectedUserIds)
          .eq('status', 'waiting'),
        supabase
          .from('team_members')
          .select('user_id')
          .in('user_id', selectedUserIds)
          .eq('status', 'active'),
      ]);

      const eligibleMembers = getEligibleUsersForTeamAssignment(
        team,
        new Set((waitingRows ?? []).map((row) => row.user_id)),
        new Set((activeMemberships ?? []).map((row) => row.user_id)),
      );

      if (eligibleMembers.length !== team.members.length) {
        notes.push('skipped a candidate team because at least one user was no longer eligible');
        continue;
      }

      const uniqueTeamName = generateUniqueTeamName(usedTeamNames);

      // Teams enter pending_confirmation first (48h). Advance to
      // pending_activation (24h) happens inside confirm_team /
      // expire_confirmation_windows RPCs once the 3-confirm threshold is hit.
      const { data: teamRow, error: teamInsertError } = await supabase
        .from('teams')
        .insert({
          name: uniqueTeamName,
          status: 'pending_confirmation',
          round_number: roundNumber,
          confirmation_deadline_at: new Date(
            Date.now() + 48 * 60 * 60 * 1000,
          ).toISOString(),
        })
        .select()
        .single();

      if (teamInsertError || !teamRow) {
        notes.push(`failed to create team ${uniqueTeamName}`);
        continue;
      }

      const { error: memberInsertError } = await supabase.from('team_members').insert(
        eligibleMembers.map((member) => ({
          team_id: teamRow.id,
          user_id: member.user_id,
          specific_role: member.primary_role,
          macro_role: member.macro_role,
        })),
      );

      if (memberInsertError) {
        notes.push(`failed to attach members to team ${uniqueTeamName}`);
        await supabase.from('teams').delete().eq('id', teamRow.id);
        continue;
      }

      await supabase
        .from('matchmaking_pool')
        .update({
          status: 'assigned',
          round_number: roundNumber,
          updated_at: new Date().toISOString(),
        })
        .in('user_id', eligibleMembers.map((member) => member.user_id))
        .eq('status', 'waiting');

      for (const member of eligibleMembers) {
        await trackEvent({
          event: 'matched_to_team',
          userId: member.user_id,
          properties: { source: 'cron', team_id: teamRow.id },
        });
      }

      await notifyMatchedUsers(
        supabase,
        eligibleMembers.map((member) => member.user_id),
        teamRow.name,
        teamRow.id,
      );

      teamsFormed += 1;
      usersMatched += eligibleMembers.length;
    }

    const result = {
      poolSize,
      teamsFormed,
      usersMatched,
      replacementsPerformed: maintenance.replacementsPerformed,
      roundNumber,
      notes,
    };

    await updateMatchmakingRunRecord(supabase, runId, {
      status: 'completed',
      pool_size: result.poolSize,
      teams_formed: result.teamsFormed,
      users_matched: result.usersMatched,
      replacements_performed: result.replacementsPerformed,
      notes: result.notes.join('; ') || null,
      finished_at: new Date().toISOString(),
    });

    logInfo('matchmaking.job.completed', {
      triggerSource: options.triggerSource,
      runId,
      durationMs: Date.now() - startedAt,
      poolSize: result.poolSize,
      teamsFormed: result.teamsFormed,
      usersMatched: result.usersMatched,
      replacementsPerformed: result.replacementsPerformed,
      roundNumber: result.roundNumber,
      notesCount: result.notes.length,
    });

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown matchmaking error';
    await updateMatchmakingRunRecord(supabase, runId, {
      status: 'failed',
      error_message: message,
      finished_at: new Date().toISOString(),
    });
    logError('matchmaking.job.failed', error, {
      triggerSource: options.triggerSource,
      runId,
      durationMs: Date.now() - startedAt,
    });
    throw error;
  }
}
