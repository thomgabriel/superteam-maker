import { describe, expect, it } from 'vitest';
import { getEligibleUsersForTeamAssignment } from '../job';
import type { FormedTeam } from '../engine';
import type { EnrichedPoolUser } from '@/types/database';

function makeUser(id: string): EnrichedPoolUser {
  return {
    user_id: id,
    profile_id: `profile-${id}`,
    name: `User ${id}`,
    primary_role: 'Frontend Developer',
    macro_role: 'engineering',
    seniority: 'mid',
    interests: ['DeFi'],
    waiting_since: new Date().toISOString(),
  };
}

describe('getEligibleUsersForTeamAssignment', () => {
  it('keeps all members when everyone is still waiting and unmatched', () => {
    const team: FormedTeam = {
      name: 'Time 1',
      members: [makeUser('1'), makeUser('2'), makeUser('3')],
    };

    const eligible = getEligibleUsersForTeamAssignment(
      team,
      new Set(['1', '2', '3']),
      new Set(),
    );

    expect(eligible).toHaveLength(3);
  });

  it('drops users who already have an active membership', () => {
    const team: FormedTeam = {
      name: 'Time 2',
      members: [makeUser('1'), makeUser('2'), makeUser('3')],
    };

    const eligible = getEligibleUsersForTeamAssignment(
      team,
      new Set(['1', '2', '3']),
      new Set(['2']),
    );

    expect(eligible.map((member) => member.user_id)).toEqual(['1', '3']);
  });

  it('drops users who are no longer waiting in the pool', () => {
    const team: FormedTeam = {
      name: 'Time 3',
      members: [makeUser('1'), makeUser('2'), makeUser('3')],
    };

    const eligible = getEligibleUsersForTeamAssignment(
      team,
      new Set(['1', '3']),
      new Set(),
    );

    expect(eligible.map((member) => member.user_id)).toEqual(['1', '3']);
  });
});
