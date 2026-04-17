'use server';

// Magic-token POST actions. GET (page.tsx) is read-only — only these server
// actions mutate state. Token is consumed last so a partial write failure
// leaves the token usable for retry (idempotent upsert on team_id,user_id).

import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import {
  ConfirmationTokenError,
  consumeConfirmationToken,
  verifyConfirmationToken,
} from '@/lib/tokens';
import { emit } from '@/lib/notifications/dispatcher';
import { logError } from '@/lib/monitoring';
import { checkRateLimit } from '@/lib/rate-limit';

const MAX_REQUESTS_PER_WINDOW = 10;
const WINDOW_MS = 60_000;

async function enforceRateLimit(): Promise<void> {
  const headerList = await headers();
  const forwardedFor = headerList.get('x-forwarded-for');
  const realIp = headerList.get('x-real-ip');
  const ip =
    forwardedFor?.split(',')[0]?.trim() ?? realIp?.trim() ?? 'unknown';
  const result = checkRateLimit(
    `team-confirm:${ip}`,
    MAX_REQUESTS_PER_WINDOW,
    WINDOW_MS,
  );
  if (!result.allowed) {
    redirect(`/team/confirm?state=rate_limited`);
  }
}

function errorRedirect(reason: string): never {
  redirect(`/team/confirm?state=${encodeURIComponent(reason)}`);
}

async function targetTeamPath(teamId: string): Promise<string> {
  const db = await createServerSupabaseClient();
  const {
    data: { user },
  } = await db.auth.getUser();

  const next = `/team/${teamId}`;
  if (!user) {
    return `/auth?next=${encodeURIComponent(next)}`;
  }
  return next;
}

async function emitLeaderClaimOpenedForTeam(teamId: string): Promise<void> {
  try {
    const db = await createServiceRoleClient();
    const [{ data: team }, { data: members }] = await Promise.all([
      db
        .from('teams')
        .select('id, name, activation_deadline_at')
        .eq('id', teamId)
        .maybeSingle(),
      db
        .from('team_members')
        .select('user_id')
        .eq('team_id', teamId)
        .eq('status', 'active'),
    ]);

    if (!team || !members || members.length === 0) return;

    await emit('leader_claim_opened', {
      user_ids: members.map((m) => m.user_id),
      team_id: team.id,
      payload: {
        kind: 'leader_claim_opened',
        team_id: team.id,
        team_name: team.name,
        activation_deadline_at:
          team.activation_deadline_at ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      throttle_key: `leader_claim_opened:${team.id}`,
    });
  } catch (error) {
    logError('team.confirm_via_token.emit_leader_claim_opened_failed', error, {
      teamId,
    });
  }
}

async function emitTeamDissolvedForTeam(teamId: string): Promise<void> {
  try {
    const db = await createServiceRoleClient();
    const [{ data: team }, { data: members }] = await Promise.all([
      db.from('teams').select('id, name').eq('id', teamId).maybeSingle(),
      // Scope to active + replaced members of THIS team cycle — excludes
      // historical inactive rows from previous cycles if the row was ever
      // reused (belt-and-suspenders: the confirmation window is 48h, so
      // normally no inactive rows exist, but this keeps the blast radius
      // contained if ever called on an older team).
      db
        .from('team_members')
        .select('user_id')
        .eq('team_id', teamId)
        .in('status', ['active', 'replaced']),
    ]);

    if (!team || !members || members.length === 0) return;

    const userIds = Array.from(new Set(members.map((m) => m.user_id)));

    await emit('team_dissolved_pre_activation', {
      user_ids: userIds,
      team_id: team.id,
      payload: {
        kind: 'team_dissolved_pre_activation',
        team_id: team.id,
        team_name: team.name,
        reason: 'confirmation_failed',
      },
    });
  } catch (error) {
    logError('team.confirm_via_token.emit_dissolved_failed', error, { teamId });
  }
}

export async function confirmViaToken(token: string): Promise<{ success: boolean; message?: string }> {
  await enforceRateLimit();
  if (!token) return { success: false, message: 'missing_token' };

  let payload;
  try {
    payload = verifyConfirmationToken(token);
  } catch (error) {
    const code = error instanceof ConfirmationTokenError ? error.code : 'malformed';
    errorRedirect(code);
  }

  if (payload.act !== 'confirm') {
    errorRedirect('action_mismatch');
  }

  const db = await createServiceRoleClient();

  // Pre-checks (read-only).
  const { data: team } = await db
    .from('teams')
    .select('id, status, confirmation_deadline_at')
    .eq('id', payload.tid)
    .maybeSingle();

  if (!team) errorRedirect('team_not_found');
  if (team.status !== 'pending_confirmation') errorRedirect('invalid_state');
  if (
    team.confirmation_deadline_at &&
    new Date(team.confirmation_deadline_at) < new Date()
  ) {
    errorRedirect('deadline_passed');
  }

  const { data: membership } = await db
    .from('team_members')
    .select('id')
    .eq('team_id', payload.tid)
    .eq('user_id', payload.uid)
    .eq('status', 'active')
    .maybeSingle();

  if (!membership) errorRedirect('not_member');

  // Idempotent write. If this fails, the token stays unconsumed.
  const { error: upsertError } = await db.from('team_confirmations').upsert(
    {
      team_id: payload.tid,
      user_id: payload.uid,
      confirmed: true,
      reason: null,
      decided_at: new Date().toISOString(),
    },
    { onConflict: 'team_id,user_id' },
  );

  if (upsertError) {
    logError('team.confirm_via_token.upsert_failed', upsertError, {
      teamId: payload.tid,
      userId: payload.uid,
    });
    errorRedirect('write_failed');
  }

  // Count only confirmations from users who are still active members — a
  // confirmation row from a later-replaced user should not count toward the
  // 3-confirm threshold.
  const { data: activeMemberIds } = await db
    .from('team_members')
    .select('user_id')
    .eq('team_id', payload.tid)
    .eq('status', 'active');

  const activeIds = (activeMemberIds ?? []).map((m) => m.user_id);
  let count = 0;
  if (activeIds.length > 0) {
    const { count: confirmedCount } = await db
      .from('team_confirmations')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', payload.tid)
      .eq('confirmed', true)
      .in('user_id', activeIds);
    count = confirmedCount ?? 0;
  }

  let teamAdvanced = false;
  if (count >= 3) {
    const { error: advanceError } = await db.rpc('advance_team_to_activation', {
      p_team_id: payload.tid,
    });
    if (advanceError) {
      logError('team.confirm_via_token.advance_failed', advanceError, {
        teamId: payload.tid,
      });
    } else {
      teamAdvanced = true;
    }
  }

  // Consume the token LAST. If this fails, the decision is already recorded
  // (idempotent), so we log-and-proceed rather than redirecting to an error.
  const consumed = await consumeConfirmationToken(payload.nonce);
  if (!consumed) {
    logError(
      'team.confirm_via_token.consume_failed_post_write',
      new Error('Token consume failed after successful confirmation upsert'),
      { teamId: payload.tid, userId: payload.uid, nonce: payload.nonce },
    );
    // Fall through: user's decision is persisted; the only downside of a
    // double-POST is a no-op idempotent upsert.
  }

  if (teamAdvanced) {
    await emitLeaderClaimOpenedForTeam(payload.tid);
  }

  const next = await targetTeamPath(payload.tid);
  redirect(next);
}

export async function declineViaToken(
  token: string,
  reason: string | null,
): Promise<{ success: boolean; message?: string }> {
  await enforceRateLimit();
  if (!token) return { success: false, message: 'missing_token' };

  let payload;
  try {
    payload = verifyConfirmationToken(token);
  } catch (error) {
    const code = error instanceof ConfirmationTokenError ? error.code : 'malformed';
    errorRedirect(code);
  }

  if (payload.act !== 'confirm' && payload.act !== 'decline') {
    errorRedirect('action_mismatch');
  }

  const db = await createServiceRoleClient();

  const { data: team } = await db
    .from('teams')
    .select('id, status, confirmation_deadline_at')
    .eq('id', payload.tid)
    .maybeSingle();

  if (!team) errorRedirect('team_not_found');
  if (team.status !== 'pending_confirmation') errorRedirect('invalid_state');
  if (
    team.confirmation_deadline_at &&
    new Date(team.confirmation_deadline_at) < new Date()
  ) {
    errorRedirect('deadline_passed');
  }

  const { data: membership } = await db
    .from('team_members')
    .select('id')
    .eq('team_id', payload.tid)
    .eq('user_id', payload.uid)
    .eq('status', 'active')
    .maybeSingle();

  if (!membership) errorRedirect('not_member');

  const cleanReason =
    reason && reason.trim().length > 0 ? reason.trim().slice(0, 500) : null;

  const { error: upsertError } = await db.from('team_confirmations').upsert(
    {
      team_id: payload.tid,
      user_id: payload.uid,
      confirmed: false,
      reason: cleanReason,
      decided_at: new Date().toISOString(),
    },
    { onConflict: 'team_id,user_id' },
  );

  if (upsertError) {
    logError('team.decline_via_token.upsert_failed', upsertError, {
      teamId: payload.tid,
      userId: payload.uid,
    });
    errorRedirect('write_failed');
  }

  // Match the decline_team RPC's dissolve logic exactly: only count decline rows
  // from users who are still active members (a replaced user's stale decline
  // must not count). Dissolve when declineCount >= 2 OR declineCount >=
  // memberCount - 2 (the team can no longer reach the 3-confirm threshold from
  // the remaining undecided members).
  const { data: activeMemberIds } = await db
    .from('team_members')
    .select('user_id')
    .eq('team_id', payload.tid)
    .eq('status', 'active');

  const activeIds = (activeMemberIds ?? []).map((m) => m.user_id);
  const members = activeIds.length;

  let declines = 0;
  if (activeIds.length > 0) {
    const { count: declineCount } = await db
      .from('team_confirmations')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', payload.tid)
      .eq('confirmed', false)
      .in('user_id', activeIds);
    declines = declineCount ?? 0;
  }
  const shouldDissolve = declines >= 2 || (members > 0 && declines >= members - 2);

  let teamDissolved = false;
  if (shouldDissolve) {
    const { error: dissolveError } = await db.rpc('dissolve_team_pre_activation', {
      p_team_id: payload.tid,
      p_reason: 'confirmation_failed',
    });
    if (dissolveError) {
      logError('team.decline_via_token.dissolve_failed', dissolveError, {
        teamId: payload.tid,
      });
    } else {
      teamDissolved = true;
    }
  }

  // Consume the token LAST (C.3 fix).
  const consumed = await consumeConfirmationToken(payload.nonce);
  if (!consumed) {
    logError(
      'team.decline_via_token.consume_failed_post_write',
      new Error('Token consume failed after successful decline upsert'),
      { teamId: payload.tid, userId: payload.uid, nonce: payload.nonce },
    );
  }

  if (teamDissolved) {
    await emitTeamDissolvedForTeam(payload.tid);
  }

  const next = await targetTeamPath(payload.tid);
  redirect(next);
}
