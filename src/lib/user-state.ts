import type { Profile, MatchmakingPoolEntry, TeamMember, Team } from '@/types/database';

export type UserState = 'needs_profile' | 'waiting_match' | 'matched' | 'team_active';

export function getUserState(
  profile: Profile | null,
  poolEntry: MatchmakingPoolEntry | null,
  teamMember: TeamMember | null,
  team: Team | null,
): UserState {
  if (!profile) return 'needs_profile';
  if (poolEntry?.status === 'waiting') return 'waiting_match';
  if (teamMember && team?.status === 'active') return 'team_active';
  if (teamMember) return 'matched';
  return 'waiting_match';
}

export function getRedirectPath(state: UserState, teamId?: string): string {
  switch (state) {
    case 'needs_profile':
      return '/perfil';
    case 'waiting_match':
      return '/fila';
    case 'matched':
      return '/equipe/revelacao';
    case 'team_active':
      return teamId ? `/equipe/${teamId}` : '/equipe/revelacao';
  }
}
