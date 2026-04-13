import { describe, it, expect } from 'vitest';
import { getUserState, getRedirectPath } from '../user-state';
import type { Profile, MatchmakingPoolEntry, TeamMember, Team } from '@/types/database';

const mockProfile = { id: '1', user_id: 'u1' } as Profile;
const mockPoolWaiting = { status: 'waiting' } as MatchmakingPoolEntry;
const mockPoolAssigned = { status: 'assigned' } as MatchmakingPoolEntry;
const mockMember = { team_id: 't1', user_id: 'u1', status: 'active' } as TeamMember;
const mockTeamActive = { id: 't1', status: 'active' } as Team;
const mockTeamPending = { id: 't1', status: 'pending_activation' } as Team;

describe('getUserState', () => {
  it('returns needs_profile when no profile', () => {
    expect(getUserState(null, null, null, null)).toBe('needs_profile');
  });

  it('returns waiting_match when in pool and waiting', () => {
    expect(getUserState(mockProfile, mockPoolWaiting, null, null)).toBe('waiting_match');
  });

  it('returns matched when has team member but team not active', () => {
    expect(getUserState(mockProfile, mockPoolAssigned, mockMember, mockTeamPending)).toBe('matched');
  });

  it('returns team_active when team is active', () => {
    expect(getUserState(mockProfile, mockPoolAssigned, mockMember, mockTeamActive)).toBe('team_active');
  });

  it('returns needs_requeue when profile exists but no pool entry and no team', () => {
    expect(getUserState(mockProfile, null, null, null)).toBe('needs_requeue');
  });

  it('keeps assigned users without team membership in waiting_match', () => {
    expect(getUserState(mockProfile, mockPoolAssigned, null, null)).toBe('waiting_match');
  });

  it('prioritizes team membership over waiting pool status', () => {
    // User has both a waiting pool entry AND a team membership
    // Team membership should take priority (they're already matched)
    expect(getUserState(mockProfile, mockPoolWaiting, mockMember, mockTeamPending)).toBe('matched');
    expect(getUserState(mockProfile, mockPoolWaiting, mockMember, mockTeamActive)).toBe('team_active');
  });
});

describe('getRedirectPath', () => {
  it('maps states to correct paths', () => {
    expect(getRedirectPath('needs_profile')).toBe('/profile');
    expect(getRedirectPath('waiting_match')).toBe('/queue');
    expect(getRedirectPath('needs_requeue')).toBe('/requeue');
    expect(getRedirectPath('matched')).toBe('/team/reveal');
    expect(getRedirectPath('matched', 'team-123')).toBe('/team/team-123');
    expect(getRedirectPath('team_active', 'team-123')).toBe('/team/team-123');
  });
});
