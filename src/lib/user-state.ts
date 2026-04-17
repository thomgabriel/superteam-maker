import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { MatchmakingPoolEntry, Profile, Team, TeamMember } from '@/types/database';

export type UserState = 'needs_profile' | 'waiting_match' | 'needs_requeue' | 'matched' | 'team_active';

export type RequeueReason = 'replaced' | 'team_inactive' | 'generic';

export interface ResolvedUserState {
  userId: string;
  state: UserState;
  redirectPath: string;
  requeueReason: RequeueReason | null;
  profile: Profile | null;
  poolEntry: MatchmakingPoolEntry | null;
  teamMember: TeamMember | null;
  team: Team | null;
}

export function getUserState(
  profile: Profile | null,
  poolEntry: MatchmakingPoolEntry | null,
  teamMember: TeamMember | null,
  team: Team | null,
): UserState {
  if (!profile) return 'needs_profile';
  if (teamMember && team?.status === 'active') return 'team_active';
  if (teamMember) return 'matched';
  if (poolEntry?.status === 'waiting') return 'waiting_match';
  // No active membership — user needs to (re)enter the pool.
  // Covers: never-entered, pool deleted by neverVisited sweep, and the stuck
  // `assigned`-but-team-dissolved case (team_members flipped to replaced/inactive
  // without matchmaking_pool being reset).
  return 'needs_requeue';
}

export function getRedirectPath(state: UserState, teamId?: string): string {
  switch (state) {
    case 'needs_profile':
      return '/profile';
    case 'waiting_match':
      return '/queue';
    case 'needs_requeue':
      return '/requeue';
    case 'matched':
      return teamId ? `/team/${teamId}` : '/team/reveal';
    case 'team_active':
      return teamId ? `/team/${teamId}` : '/team/reveal';
  }
}

/**
 * Authenticated request path — uses the user-scoped Supabase client (RLS enforced).
 * Call from server components and actions where a user session exists.
 */
export async function resolveAuthenticatedUserState(): Promise<ResolvedUserState | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return resolveUserStateWithClient(user.id, supabase);
}

/**
 * Privileged path — caller provides a specific Supabase client.
 * Use from cron jobs / background tasks that pass a service-role client.
 */
export async function resolveUserStateWithClient(
  userId: string,
  db: SupabaseClient,
): Promise<ResolvedUserState> {
  const [
    { data: profile, error: profileError },
    { data: poolEntry, error: poolEntryError },
    { data: teamMember, error: teamMemberError },
  ] = await Promise.all([
    db.from('profiles').select('*').eq('user_id', userId).maybeSingle<Profile>(),
    db.from('matchmaking_pool').select('*').eq('user_id', userId).maybeSingle<MatchmakingPoolEntry>(),
    db
      .from('team_members')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle<TeamMember>(),
  ]);

  if (profileError) throw profileError;
  if (poolEntryError) throw poolEntryError;
  if (teamMemberError) throw teamMemberError;

  let team: Team | null = null;
  if (teamMember) {
    const { data, error } = await db.from('teams').select('*').eq('id', teamMember.team_id).maybeSingle<Team>();
    if (error) throw error;
    team = data ?? null;
  }

  const state = getUserState(profile ?? null, poolEntry ?? null, teamMember ?? null, team);

  // Compute requeueReason when in needs_requeue state.
  // NOTE: On the authenticated path (user-scoped client), the team_members_read RLS policy
  // only exposes rows from teams where the user has an active membership. After deactivation
  // or replacement, the user has no active membership, so historical rows (inactive/replaced)
  // are not visible. These queries will return empty and fall through to 'generic'.
  // This is acceptable for MVP — the user still reaches /requeue and can re-enter the pool.
  // For specific messaging, a SECURITY DEFINER RPC would be needed.
  let requeueReason: RequeueReason | null = null;
  if (state === 'needs_requeue' && profile) {
    const { data: inactiveMember } = await db
      .from('team_members')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'inactive')
      .limit(1);

    if (inactiveMember && inactiveMember.length > 0) {
      requeueReason = 'team_inactive';
    } else {
      const { data: replacedRows } = await db
        .from('team_members')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'replaced')
        .limit(1);
      requeueReason = replacedRows && replacedRows.length > 0 ? 'replaced' : 'generic';
    }
  }

  return {
    userId,
    state,
    redirectPath: getRedirectPath(state, team?.id),
    requeueReason,
    profile: profile ?? null,
    poolEntry: poolEntry ?? null,
    teamMember: teamMember ?? null,
    team,
  };
}
