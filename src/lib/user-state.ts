import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { MatchmakingPoolEntry, Profile, Team, TeamMember } from '@/types/database';

export type UserState = 'needs_profile' | 'waiting_match' | 'matched' | 'team_active';

export interface ResolvedUserState {
  userId: string;
  state: UserState;
  redirectPath: string;
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
  return 'waiting_match';
}

export function getRedirectPath(state: UserState, teamId?: string): string {
  switch (state) {
    case 'needs_profile':
      return '/profile';
    case 'waiting_match':
      return '/queue';
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
  const [{ data: profile }, { data: poolEntry }, { data: teamMember }] = await Promise.all([
    db.from('profiles').select('*').eq('user_id', userId).maybeSingle<Profile>(),
    db.from('matchmaking_pool').select('*').eq('user_id', userId).maybeSingle<MatchmakingPoolEntry>(),
    db
      .from('team_members')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle<TeamMember>(),
  ]);

  let team: Team | null = null;
  if (teamMember) {
    const { data } = await db.from('teams').select('*').eq('id', teamMember.team_id).maybeSingle<Team>();
    team = data ?? null;
  }

  const state = getUserState(profile ?? null, poolEntry ?? null, teamMember ?? null, team);

  return {
    userId,
    state,
    redirectPath: getRedirectPath(state, team?.id),
    profile: profile ?? null,
    poolEntry: poolEntry ?? null,
    teamMember: teamMember ?? null,
    team,
  };
}
