'use server';

import { createServiceRoleClient, createServerSupabaseClient } from '@/lib/supabase/server';
import { trackEvent } from '@/lib/analytics.server';
import { sendMatchNotification } from '@/lib/email';
import { logError } from '@/lib/monitoring';
import { revalidatePath } from 'next/cache';
import { scoreCandidate } from '@/lib/matchmaking/scoring';
import { getFlexMacroRoles } from '@/lib/matchmaking/roles';
import { MATCHMAKING_CONFIG, MIN_EXTRA_MEMBER_SCORE } from '@/lib/matchmaking/config';
import { sanitizeTeamProfileUpdate } from '@/lib/team-profile';
import type { EnrichedPoolUser } from '@/types/database';

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

  let assignedCandidate: EnrichedPoolUser | null = null;

  // Assignment loop — RPC uses auth.uid() for leader check, derives role from profile
  for (const candidate of eligibleCandidates) {
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      'assign_pool_candidate_to_team',
      {
        p_team_id: teamId,
        p_candidate_user_id: candidate.enriched.user_id,
      },
    );

    if (rpcError) {
      logError('team.request_extra_member.assign_rpc_failed', rpcError, {
        teamId,
        userId: candidate.enriched.user_id,
      });
      continue;
    }

    const result = rpcResult && typeof rpcResult === 'object' && 'success' in rpcResult
      ? (rpcResult as { success: boolean; code?: string })
      : null;

    if (!result) {
      logError('team.request_extra_member.unexpected_rpc_shape', new Error('Unexpected RPC response'), {
        teamId, userId: candidate.enriched.user_id,
      });
      continue;
    }

    if (result.success) {
      assignedCandidate = candidate.enriched;
      break;
    }

    if (result.code === 'team_full') {
      return { success: false, message: 'O time já tem 4 membros.' };
    }

    // already_claimed, already_assigned, no_profile — try next
    continue;
  }

  if (!assignedCandidate) {
    return { success: false, message: 'Ninguém compatível na fila agora. Tente mais tarde.' };
  }

  // Email — read new user email via service role (cross-user access)
  const { data: newUserData } = await db
    .from('users')
    .select('email')
    .eq('id', assignedCandidate.user_id)
    .maybeSingle();

  if (newUserData?.email && team?.name) {
    await sendMatchNotification(newUserData.email, team.name);
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
