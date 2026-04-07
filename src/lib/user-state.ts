import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
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

export async function resolveAuthenticatedUserState(): Promise<ResolvedUserState | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return resolveUserStateForUserId(user.id);
}

export async function resolveUserStateForUserId(userId: string): Promise<ResolvedUserState> {
  const db = await createServiceRoleClient();

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
