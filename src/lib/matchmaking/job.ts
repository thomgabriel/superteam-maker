import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { MATCHMAKING_CONFIG } from './config';
import { runMatchmaking, type FormedTeam } from './engine';
import type { EnrichedPoolUser } from '@/types/database';
import { trackEvent } from '@/lib/analytics.server';
import { sendMatchNotification } from '@/lib/email';
import { scoreCandidate } from './scoring';
import { generateUniqueTeamName } from './team-names';
import { getFlexMacroRoles } from './roles';
import { logError, logInfo } from '@/lib/monitoring';

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
) {
  if (userIds.length === 0) {
    return;
  }

  const { data: matchedUsers } = await supabase
    .from('users')
    .select('email')
    .in('id', userIds);

  if (!matchedUsers?.length) {
    return;
  }

  await Promise.allSettled(
    matchedUsers
      .map((user) => user.email)
      .filter((email): email is string => Boolean(email))
      .map((email) => sendMatchNotification(email, teamName)),
  );
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

async function performMaintenance(supabase: SupabaseClient): Promise<MaintenanceResult> {
  const notes: string[] = [];
  let replacementsPerformed = 0;
  const nowIso = new Date().toISOString();

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
    notes.push(`reset ${reclaimedTeams.length} stale leader claims`);
  }

  const { data: deactivatedTeams } = await supabase
    .from('teams')
    .update({ status: 'inactive', updated_at: nowIso })
    .eq('status', 'pending_activation')
    .is('leader_id', null)
    .lt('activation_deadline_at', nowIso)
    .select('id');

  if (deactivatedTeams?.length) {
    notes.push(`deactivated ${deactivatedTeams.length} unclaimed teams`);
  }

  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { data: inactiveMembers } = await supabase
    .from('team_members')
    .select('id, team_id, user_id')
    .eq('status', 'active')
    .lt('last_active_at', fortyEightHoursAgo);

  for (const member of inactiveMembers ?? []) {
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
          await notifyMatchedUsers(supabase, [replacement.user_id], team.name);
        }
      }
    }

    const { count } = await supabase
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', member.team_id)
      .eq('status', 'active');

    if ((count ?? 0) < MATCHMAKING_CONFIG.minTeamSize) {
      await supabase
        .from('teams')
        .update({ status: 'inactive', updated_at: nowIso })
        .eq('id', member.team_id);
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

      const { data: teamRow, error: teamInsertError } = await supabase
        .from('teams')
        .insert({
          name: uniqueTeamName,
          status: 'pending_activation',
          round_number: roundNumber,
          activation_deadline_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
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
