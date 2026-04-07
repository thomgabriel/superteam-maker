import { describe, it, expect } from 'vitest';
import { runMatchmaking } from '../engine';
import type { EnrichedPoolUser } from '@/types/database';

const now = Date.now();
let counter = 0;

function makePoolUser(overrides: Partial<EnrichedPoolUser> = {}): EnrichedPoolUser {
  counter++;
  return {
    user_id: `u-${counter}`,
    profile_id: `p-${counter}`,
    name: `User ${counter}`,
    primary_role: 'Frontend Developer',
    macro_role: 'engineering',
    seniority: 'mid',
    interests: ['DeFi'],
    waiting_since: new Date(now - counter * 60_000).toISOString(),
    flex_macro_roles: [],
    ...overrides,
  };
}

describe('runMatchmaking', () => {
  it('forms a team of 4 from a pool of 4', () => {
    const pool = [
      makePoolUser({ macro_role: 'engineering', seniority: 'mid' }),
      makePoolUser({ macro_role: 'business_gtm', seniority: 'mid' }),
      makePoolUser({ macro_role: 'design', seniority: 'mid' }),
      makePoolUser({ macro_role: 'engineering', seniority: 'mid' }),
    ];
    const teams = runMatchmaking(pool, 3);
    expect(teams).toHaveLength(1);
    expect(teams[0].members).toHaveLength(4);
    expect(teams[0].name).toBeTruthy();
  });

  it('forms no teams from a pool of 2', () => {
    const pool = [makePoolUser(), makePoolUser()];
    const teams = runMatchmaking(pool, 3);
    expect(teams).toHaveLength(0);
  });

  it('forms 2 teams from a pool of 8', () => {
    const pool = Array.from({ length: 8 }, (_, i) =>
      makePoolUser({
        macro_role: i % 2 === 0 ? 'engineering' : 'business_gtm',
        seniority: 'mid',
      }),
    );
    const teams = runMatchmaking(pool, 3);
    expect(teams).toHaveLength(2);
    expect(teams[0].members).toHaveLength(4);
    expect(teams[1].members).toHaveLength(4);
  });

  it('does not assign any user to multiple teams', () => {
    const pool = Array.from({ length: 12 }, () => makePoolUser());
    const teams = runMatchmaking(pool, 3);
    const allUserIds = teams.flatMap((t) => t.members.map((m) => m.user_id));
    const uniqueIds = new Set(allUserIds);
    expect(uniqueIds.size).toBe(allUserIds.length);
  });

  it('handles mixed seniority pool', () => {
    const pool = [
      makePoolUser({ seniority: 'beginner' }),
      makePoolUser({ seniority: 'beginner' }),
      makePoolUser({ seniority: 'beginner' }),
      makePoolUser({ seniority: 'senior' }),
      makePoolUser({ seniority: 'senior' }),
      makePoolUser({ seniority: 'senior' }),
    ];
    const teams = runMatchmaking(pool, 3);
    expect(teams.length).toBeGreaterThanOrEqual(1);
  });
});
