'use server';

import { createServiceRoleClient, createServerSupabaseClient } from '@/lib/supabase/server';
import { trackEvent } from '@/lib/analytics.server';
import { logError } from '@/lib/monitoring';
import { revalidatePath } from 'next/cache';
import { scoreCandidate } from '@/lib/matchmaking/scoring';
import { getFlexMacroRoles } from '@/lib/matchmaking/roles';
import { MATCHMAKING_CONFIG, MIN_EXTRA_MEMBER_SCORE } from '@/lib/matchmaking/config';
import { sanitizeTeamProfileUpdate } from '@/lib/team-profile';
import type { EnrichedPoolUser } from '@/types/database';
// Notification dispatcher — used by C.1 confirm/decline actions and C.4
// leader-claimed fan-out.
import { emit } from '@/lib/notifications/dispatcher';

const REQUEST_EXTRA_MEMBER_RATE_LIMIT_MAX = 3;
const REQUEST_EXTRA_MEMBER_RATE_LIMIT_WINDOW_SECONDS = 60;

async function trackTeamActionEvent(
  event: Parameters<typeof trackEvent>[0],
  logEvent: string,
) {
  try {
    await trackEvent(event);
  } catch (error) {
    logError(logEvent, error, {
      eventName: event.event,
      route: event.route ?? undefined,
      userId: event.userId ?? undefined,
    });
  }
}

async function checkActionRateLimit(
  db: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  key: string,
  maxRequests: number,
  windowSeconds: number,
) {
  const { data, error } = await db.rpc('consume_action_rate_limit', {
    p_key: key,
    p_max_requests: maxRequests,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    logError('action_rate_limit.consume_failed', error, { key });
    return { allowed: false, remaining: 0, retryAfterSeconds: windowSeconds };
  }

  const payload =
    data && typeof data === 'object' && !Array.isArray(data)
      ? (data as {
          allowed?: boolean;
          remaining?: number;
          retry_after_seconds?: number;
        })
      : {};

  return {
    allowed: payload.allowed !== false,
    remaining:
      typeof payload.remaining === 'number' ? payload.remaining : maxRequests,
    retryAfterSeconds:
      typeof payload.retry_after_seconds === 'number'
        ? payload.retry_after_seconds
        : windowSeconds,
  };
}

export async function claimLeadership(teamId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // RPC uses auth.uid() internally — no user ID passed
  const { data, error } = await supabase.rpc('claim_team_leadership', {
    p_team_id: teamId,
  });

  if (error) {
    logError('team.claim_leadership.rpc_failed', error, { teamId, userId: user.id });
    return { success: false, message: 'Não foi possível concluir a liderança agora. Tente novamente.' };
  }

  const result = data && typeof data === 'object' && 'success' in data
    ? (data as { success: boolean; message?: string })
    : null;

  if (!result) {
    logError('team.claim_leadership.unexpected_rpc_shape', new Error('Unexpected RPC response'), {
      teamId, userId: user.id,
    });
    return { success: false, message: 'Não foi possível concluir a liderança agora. Tente novamente.' };
  }

  if (!result.success) {
    const messages: Record<string, string> = {
      not_member: 'Apenas membros ativos do time podem assumir a liderança.',
      already_claimed: 'Outro membro já assumiu a liderança.',
    };
    return {
      success: false,
      message: messages[result.message ?? ''] ?? 'Outro membro já assumiu a liderança.',
    };
  }

  await trackTeamActionEvent({
    event: 'leader_claimed',
    userId: user.id,
    route: `/team/${teamId}`,
    properties: { team_id: teamId },
  }, 'team.claim_leadership.track_failed');
  await trackTeamActionEvent({
    event: 'team_activated',
    userId: user.id,
    route: `/team/${teamId}`,
    properties: { team_id: teamId },
  }, 'team.activate.track_failed');

  // Notify other members. Best-effort — failure does not fail the claim.
  try {
    const service = await createServiceRoleClient();
    const [{ data: teamRow }, { data: members }, { data: leaderProfile }] = await Promise.all([
      service.from('teams').select('id, name, whatsapp_group_url').eq('id', teamId).maybeSingle(),
      service.from('team_members').select('user_id').eq('team_id', teamId).eq('status', 'active'),
      service.from('profiles').select('name').eq('user_id', user.id).maybeSingle(),
    ]);

    if (teamRow && members) {
      const otherMemberIds = members
        .map((m) => m.user_id)
        .filter((id) => id !== user.id);

      if (otherMemberIds.length > 0) {
        await emit('leader_claimed', {
          user_ids: otherMemberIds,
          team_id: teamRow.id,
          payload: {
            kind: 'leader_claimed',
            team_id: teamRow.id,
            team_name: teamRow.name,
            leader_name: leaderProfile?.name ?? 'Um colega',
            whatsapp_url: teamRow.whatsapp_group_url ?? null,
          },
        });
      }
    }
  } catch (error) {
    logError('team.claim_leadership.notify_failed', error, { teamId, userId: user.id });
  }

  revalidatePath(`/team/${teamId}`);
  revalidatePath('/team/reveal');
  return { success: true };
}

export async function updateTeamProfile(
  teamId: string,
  data: {
    name?: string;
    idea_title?: string;
    idea_description?: string;
    project_category?: string;
  } & Record<string, unknown>,
) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const sanitized = sanitizeTeamProfileUpdate(data);
  if (!sanitized.ok) {
    return { success: false, message: sanitized.message };
  }

  // Pre-check for UX (RLS teams_leader_update is the real enforcement)
  const { data: team } = await supabase
    .from('teams')
    .select('leader_id')
    .eq('id', teamId)
    .maybeSingle();

  if (team?.leader_id !== user.id) {
    return { success: false, message: 'Apenas o líder pode editar.' };
  }

  // RLS teams_leader_update policy enforces leader_id = auth.uid()
  const { error } = await supabase
    .from('teams')
    .update({ ...sanitized.updates, updated_at: new Date().toISOString() })
    .eq('id', teamId);

  if (error) {
    logError('team.update_profile.failed', error, { teamId, userId: user.id });
    return { success: false, message: 'Não foi possível salvar as alterações. Tente novamente.' };
  }

  revalidatePath(`/team/${teamId}`);
  return { success: true };
}

export async function requestExtraMember(teamId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Rate limiting via SECURITY DEFINER RPC — works with user-scoped client
  const rateLimit = await checkActionRateLimit(
    supabase,
    `request-extra-member:${user.id}:${teamId}`,
    REQUEST_EXTRA_MEMBER_RATE_LIMIT_MAX,
    REQUEST_EXTRA_MEMBER_RATE_LIMIT_WINDOW_SECONDS,
  );

  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Muitas tentativas em pouco tempo. Tente novamente em ${rateLimit.retryAfterSeconds}s.`,
    };
  }

  // Leader verification via user-scoped client (teams_member_read RLS)
  const { data: team } = await supabase
    .from('teams')
    .select('leader_id, name')
    .eq('id', teamId)
    .maybeSingle();

  if (team?.leader_id !== user.id) {
    return { success: false, message: 'Apenas o líder pode pedir um membro.' };
  }

  // Service role needed: profile_roles and profile_interests RLS only allows
  // reading own data, but scoring needs all teammates' secondary roles/interests.
  const db = await createServiceRoleClient();

  // Count members separately (don't rely on !inner join which excludes broken profiles)
  const { count: memberCount } = await db
    .from('team_members')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', teamId)
    .eq('status', 'active');

  if ((memberCount ?? 0) >= 4) {
    return { success: false, message: 'O time já tem 4 membros.' };
  }
  if ((memberCount ?? 0) < 2) {
    return { success: false, message: 'O time precisa ter pelo menos 2 membros.' };
  }

  // Fetch enriched member data for scoring (inner join is fine here — only used for scoring)
  const { data: members } = await db
    .from('team_members')
    .select(`
      user_id,
      specific_role,
      macro_role,
      profiles!inner (
        name,
        primary_role,
        macro_role,
        seniority,
        profile_interests (interest),
        profile_roles (role)
      )
    `)
    .eq('team_id', teamId)
    .eq('status', 'active');

  const teamMembers: EnrichedPoolUser[] = (members ?? []).map((m) => {
    const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
    const secondaryRoles = profile.profile_roles?.map((r: { role: string }) => r.role) ?? [];
    return {
      user_id: m.user_id,
      profile_id: '',
      name: profile.name,
      primary_role: profile.primary_role,
      macro_role: profile.macro_role,
      seniority: profile.seniority,
      interests: profile.profile_interests?.map((i: { interest: string }) => i.interest) ?? [],
      waiting_since: new Date().toISOString(),
      flex_macro_roles: getFlexMacroRoles(profile.primary_role, secondaryRoles),
    };
  });

  // Pool scan — same service-role client (reads all waiting entries across users)
  const { data: poolEntries } = await db
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

  if (!poolEntries || poolEntries.length === 0) {
    return { success: false, message: 'Ninguém compatível na fila agora. Tente mais tarde.' };
  }

  const candidates: { enriched: EnrichedPoolUser; score: number }[] = [];
  const maxWaitMs = Math.max(
    ...poolEntries.map((e) => Date.now() - new Date(e.created_at).getTime()),
    1,
  );

  for (const entry of poolEntries) {
    const profile = Array.isArray(entry.profiles) ? entry.profiles[0] : entry.profiles;
    const secondaryRoles = profile.profile_roles?.map((r: { role: string }) => r.role) ?? [];
    const enriched: EnrichedPoolUser = {
      user_id: entry.user_id,
      profile_id: entry.profile_id,
      name: profile.name,
      primary_role: profile.primary_role,
      macro_role: profile.macro_role,
      seniority: profile.seniority,
      interests: profile.profile_interests?.map((i: { interest: string }) => i.interest) ?? [],
      waiting_since: entry.created_at,
      flex_macro_roles: getFlexMacroRoles(profile.primary_role, secondaryRoles),
    };
    const score = scoreCandidate(enriched, teamMembers, maxWaitMs, MATCHMAKING_CONFIG.weights);
    candidates.push({ enriched, score });
  }

  candidates.sort((a, b) => b.score - a.score);
  const eligibleCandidates = candidates.filter((c) => c.score >= MIN_EXTRA_MEMBER_SCORE);

  if (eligibleCandidates.length === 0) {
    return { success: false, message: 'Ninguém compatível na fila agora. Tente mais tarde.' };
  }

  // rpc_request_extra_member_locked serializes the per-team assignment loop
  // via pg_try_advisory_xact_lock so concurrent clicks can't double-assign.
  const rankedIds = eligibleCandidates.map((c) => c.enriched.user_id);
  const candidateById = new Map<string, EnrichedPoolUser>(
    eligibleCandidates.map((c) => [c.enriched.user_id, c.enriched]),
  );

  const { data: lockedResult, error: lockedError } = await supabase.rpc(
    'rpc_request_extra_member_locked',
    {
      p_team_id: teamId,
      p_candidate_user_ids: rankedIds,
    },
  );

  if (lockedError) {
    logError('team.request_extra_member.locked_rpc_failed', lockedError, { teamId });
    return {
      success: false,
      message: 'Não foi possível processar a solicitação agora. Tente novamente.',
    };
  }

  const lockedPayload =
    lockedResult && typeof lockedResult === 'object' && 'success' in lockedResult
      ? (lockedResult as {
          success: boolean;
          code?: string;
          assigned_user_id?: string;
        })
      : null;

  if (!lockedPayload) {
    logError(
      'team.request_extra_member.unexpected_rpc_shape',
      new Error('Unexpected RPC response'),
      { teamId },
    );
    return {
      success: false,
      message: 'Não foi possível processar a solicitação agora. Tente novamente.',
    };
  }

  if (!lockedPayload.success) {
    if (lockedPayload.code === 'team_full') {
      return { success: false, message: 'O time já tem 4 membros.' };
    }
    if (lockedPayload.code === 'not_leader') {
      return { success: false, message: 'Apenas o líder pode pedir um membro.' };
    }
    if (lockedPayload.code === 'concurrent_request') {
      return {
        success: false,
        message:
          'Outra solicitação está em andamento. Aguarde alguns segundos e tente novamente.',
      };
    }
    // already_claimed / already_assigned / no_profile / no_candidates
    return { success: false, message: 'Ninguém compatível na fila agora. Tente mais tarde.' };
  }

  const assignedCandidate: EnrichedPoolUser | null =
    (lockedPayload.assigned_user_id &&
      candidateById.get(lockedPayload.assigned_user_id)) ||
    null;

  if (!assignedCandidate) {
    return { success: false, message: 'Ninguém compatível na fila agora. Tente mais tarde.' };
  }

  // Notify new member via the dispatcher (single path post-cleanup).
  if (team?.name) {
    try {
      await emit('team_matched', {
        user_ids: [assignedCandidate.user_id],
        team_id: teamId,
        payload: {
          kind: 'team_matched',
          team_id: teamId,
          team_name: team.name,
        },
      });
    } catch (error) {
      logError('team.request_extra_member.notify_failed', error, {
        teamId,
        userId: assignedCandidate.user_id,
      });
    }
  }

  await trackTeamActionEvent({
    event: 'matched_to_team',
    userId: assignedCandidate.user_id,
    route: `/team/${teamId}`,
    properties: { team_id: teamId, source: 'leader_request' },
  }, 'team.request_extra_member.track_failed');

  revalidatePath(`/team/${teamId}`);
  return { success: true, memberName: assignedCandidate.name };
}

// ---------------------------------------------------------------------------
// Confirmation window actions (confirm / decline)
// ---------------------------------------------------------------------------

interface TeamActionResult {
  success: boolean;
  message?: string;
  advanced?: boolean;
  dissolved?: boolean;
}

async function fetchActiveMemberUserIds(
  teamId: string,
): Promise<string[]> {
  const db = await createServiceRoleClient();
  const { data } = await db
    .from('team_members')
    .select('user_id')
    .eq('team_id', teamId)
    .eq('status', 'active');
  return (data ?? []).map((row) => row.user_id);
}

async function emitLeaderClaimOpened(
  teamId: string,
  teamName: string,
  activationDeadlineAt: string,
  userIds: string[],
) {
  if (userIds.length === 0) return;
  try {
    await emit('leader_claim_opened', {
      user_ids: userIds,
      team_id: teamId,
      payload: {
        kind: 'leader_claim_opened',
        team_id: teamId,
        team_name: teamName,
        activation_deadline_at: activationDeadlineAt,
      },
      throttle_key: `leader_claim_opened:${teamId}`,
    });
  } catch (error) {
    logError('team.confirm.emit_leader_claim_opened_failed', error, { teamId });
  }
}

async function emitTeamDissolvedPreActivation(
  teamId: string,
  teamName: string,
  userIds: string[],
) {
  if (userIds.length === 0) return;
  try {
    await emit('team_dissolved_pre_activation', {
      user_ids: userIds,
      team_id: teamId,
      payload: {
        kind: 'team_dissolved_pre_activation',
        team_id: teamId,
        team_name: teamName,
        reason: 'confirmation_failed',
      },
    });
  } catch (error) {
    logError('team.decline.emit_team_dissolved_failed', error, { teamId });
  }
}

export async function confirmTeamAction(
  formData: FormData,
): Promise<TeamActionResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'Sessão expirada. Entre novamente.' };
  }

  const teamId = String(formData.get('teamId') ?? '');
  if (!teamId) {
    return { success: false, message: 'Time inválido.' };
  }

  const { data, error } = await supabase.rpc('confirm_team', { p_team_id: teamId });

  if (error) {
    logError('team.confirm.rpc_failed', error, { teamId, userId: user.id });
    return {
      success: false,
      message: 'Não foi possível confirmar agora. Tente novamente.',
    };
  }

  const result = (data && typeof data === 'object' && !Array.isArray(data)
    ? (data as { success?: boolean; code?: string; advanced?: boolean })
    : null) ?? null;

  if (!result?.success) {
    const messages: Record<string, string> = {
      not_authenticated: 'Sessão expirada. Entre novamente.',
      team_not_found: 'Time não encontrado.',
      invalid_state: 'Esse time não está mais em fase de confirmação.',
      deadline_passed: 'O prazo para confirmar já passou.',
      not_member: 'Você não está mais nesse time.',
    };
    return {
      success: false,
      message: messages[result?.code ?? ''] ?? 'Não foi possível confirmar.',
    };
  }

  await trackTeamActionEvent(
    {
      event: 'matched_to_team',
      userId: user.id,
      route: `/team/${teamId}`,
      properties: { team_id: teamId, source: 'mutual_confirm' },
    },
    'team.confirm.track_failed',
  );

  if (result.advanced) {
    const memberIds = await fetchActiveMemberUserIds(teamId);
    // advance_team_to_activation set activation_deadline_at = now() + 24h.
    const service = await createServiceRoleClient();
    const { data: teamRow } = await service
      .from('teams')
      .select('name, activation_deadline_at')
      .eq('id', teamId)
      .maybeSingle();
    const deadline = teamRow?.activation_deadline_at ?? new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ).toISOString();
    await emitLeaderClaimOpened(
      teamId,
      teamRow?.name ?? '',
      deadline,
      memberIds,
    );
  }

  revalidatePath(`/team/${teamId}`);
  return { success: true, advanced: result.advanced ?? false };
}

export async function declineTeamAction(
  formData: FormData,
): Promise<TeamActionResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'Sessão expirada. Entre novamente.' };
  }

  const teamId = String(formData.get('teamId') ?? '');
  const reasonRaw = String(formData.get('reason') ?? '').trim();
  const reason = reasonRaw.length > 0 ? reasonRaw.slice(0, 500) : null;

  if (!teamId) {
    return { success: false, message: 'Time inválido.' };
  }

  // Capture members BEFORE the RPC — if decline triggers dissolution, the
  // team_members rows flip to 'replaced' and the list becomes empty.
  const memberIdsBefore = await fetchActiveMemberUserIds(teamId);

  const { data, error } = await supabase.rpc('decline_team', {
    p_team_id: teamId,
    p_reason: reason,
  });

  if (error) {
    logError('team.decline.rpc_failed', error, { teamId, userId: user.id });
    return {
      success: false,
      message: 'Não foi possível recusar agora. Tente novamente.',
    };
  }

  const result = (data && typeof data === 'object' && !Array.isArray(data)
    ? (data as { success?: boolean; code?: string; dissolved?: boolean })
    : null) ?? null;

  if (!result?.success) {
    const messages: Record<string, string> = {
      not_authenticated: 'Sessão expirada. Entre novamente.',
      team_not_found: 'Time não encontrado.',
      invalid_state: 'Esse time não está mais em fase de confirmação.',
      deadline_passed: 'O prazo para confirmar já passou.',
      not_member: 'Você não está mais nesse time.',
    };
    return {
      success: false,
      message: messages[result?.code ?? ''] ?? 'Não foi possível recusar.',
    };
  }

  if (result.dissolved) {
    const service = await createServiceRoleClient();
    const { data: teamRow } = await service
      .from('teams')
      .select('name')
      .eq('id', teamId)
      .maybeSingle();
    await emitTeamDissolvedPreActivation(
      teamId,
      teamRow?.name ?? '',
      memberIdsBefore,
    );
  }

  revalidatePath(`/team/${teamId}`);
  revalidatePath('/requeue');
  return { success: true, dissolved: result.dissolved ?? false };
}

export async function toggleReady(teamId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase.rpc('toggle_member_ready', {
    p_team_id: teamId,
  });

  if (error) {
    logError('team.toggle_ready.rpc_failed', error, { teamId, userId: user.id });
    return { success: false };
  }

  const result = data && typeof data === 'object' && 'success' in data
    ? (data as { success: boolean; is_ready?: boolean })
    : null;

  if (!result) {
    logError('team.toggle_ready.unexpected_rpc_shape', new Error('Unexpected RPC response'), {
      teamId, userId: user.id,
    });
    return { success: false };
  }

  if (!result.success) {
    return { success: false };
  }

  revalidatePath(`/team/${teamId}`);
  return { success: true, isReady: result.is_ready ?? false };
}
