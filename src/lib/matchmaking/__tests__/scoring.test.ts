import { describe, it, expect } from 'vitest';
import { scoreCandidate } from '../scoring';
import type { EnrichedPoolUser } from '@/types/database';
import { MATCHMAKING_CONFIG } from '../config';

const now = Date.now();

function makeUser(overrides: Partial<EnrichedPoolUser> = {}): EnrichedPoolUser {
  return {
    user_id: 'u-' + Math.random().toString(36).slice(2),
    profile_id: 'p-' + Math.random().toString(36).slice(2),
    name: 'Test User',
    primary_role: 'Frontend Developer',
    macro_role: 'engineering',
    seniority: 'mid',
    interests: ['DeFi'],
    waiting_since: new Date(now - 10 * 60_000).toISOString(),
    flex_macro_roles: [],
    ...overrides,
  };
}

describe('scoreCandidate', () => {
  const weights = MATCHMAKING_CONFIG.weights;
  const maxWait = 60 * 60_000;

  it('scores higher when candidate fills a missing macro role', () => {
    const team = [makeUser({ macro_role: 'engineering' })];
    const bizCandidate = makeUser({ macro_role: 'business_gtm' });
    const engCandidate = makeUser({ macro_role: 'engineering' });
    const bizScore = scoreCandidate(bizCandidate, team, maxWait, weights);
    const engScore = scoreCandidate(engCandidate, team, maxWait, weights);
    expect(bizScore).toBeGreaterThan(engScore);
  });

  it('scores higher for same seniority', () => {
    const team = [makeUser({ seniority: 'mid' })];
    const midCandidate = makeUser({ seniority: 'mid' });
    const beginnerCandidate = makeUser({ seniority: 'beginner' });
    const midScore = scoreCandidate(midCandidate, team, maxWait, weights);
    const beginnerScore = scoreCandidate(beginnerCandidate, team, maxWait, weights);
    expect(midScore).toBeGreaterThan(beginnerScore);
  });

  it('scores higher for overlapping interests', () => {
    const team = [makeUser({ interests: ['DeFi', 'Gaming'] })];
    const overlapCandidate = makeUser({ interests: ['DeFi', 'Gaming'] });
    const noOverlapCandidate = makeUser({ interests: ['DePIN'] });
    const overlapScore = scoreCandidate(overlapCandidate, team, maxWait, weights);
    const noOverlapScore = scoreCandidate(noOverlapCandidate, team, maxWait, weights);
    expect(overlapScore).toBeGreaterThan(noOverlapScore);
  });

  it('gives wait bonus to longer-waiting users', () => {
    const team = [makeUser()];
    const longWait = makeUser({ waiting_since: new Date(now - 55 * 60_000).toISOString() });
    const shortWait = makeUser({ waiting_since: new Date(now - 5 * 60_000).toISOString() });
    const longScore = scoreCandidate(longWait, team, maxWait, weights);
    const shortScore = scoreCandidate(shortWait, team, maxWait, weights);
    expect(longScore).toBeGreaterThan(shortScore);
  });

  it('works with empty team (first member)', () => {
    const candidate = makeUser();
    const score = scoreCandidate(candidate, [], maxWait, weights);
    expect(score).toBeGreaterThan(0);
  });

  it('flex role improves score when it adds diversity beyond primary', () => {
    const team = [makeUser({ macro_role: 'business_gtm' })];
    const flexCandidate = makeUser({
      macro_role: 'business_gtm',
      flex_macro_roles: ['engineering'],
    });
    const pureCandidate = makeUser({
      macro_role: 'business_gtm',
      flex_macro_roles: [],
    });
    const flexScore = scoreCandidate(flexCandidate, team, maxWait, weights);
    const pureScore = scoreCandidate(pureCandidate, team, maxWait, weights);
    expect(flexScore).toBeGreaterThan(pureScore);
  });

  it('real primary scores higher than flex for same diversity', () => {
    const team = [makeUser({ macro_role: 'business_gtm' })];
    const realEngineer = makeUser({
      macro_role: 'engineering',
      flex_macro_roles: [],
    });
    const flexEngineer = makeUser({
      macro_role: 'business_gtm',
      flex_macro_roles: ['engineering'],
    });
    const realScore = scoreCandidate(realEngineer, team, maxWait, weights);
    const flexScore = scoreCandidate(flexEngineer, team, maxWait, weights);
    expect(realScore).toBeGreaterThan(flexScore);
  });

  it('second flex-engineer gets no bonus when first flex already covers engineering', () => {
    const teamMember = makeUser({
      macro_role: 'business_gtm',
      flex_macro_roles: ['engineering'],
    });
    const team = [teamMember];
    const secondFlex = makeUser({
      macro_role: 'business_gtm',
      flex_macro_roles: ['engineering'],
    });
    const noFlex = makeUser({
      macro_role: 'business_gtm',
      flex_macro_roles: [],
    });
    const secondFlexScore = scoreCandidate(secondFlex, team, maxWait, weights);
    const noFlexScore = scoreCandidate(noFlex, team, maxWait, weights);
    expect(secondFlexScore).toBe(noFlexScore);
  });

  it('real engineer still gets new-role bonus even when flex covers engineering', () => {
    const teamMember = makeUser({
      macro_role: 'business_gtm',
      flex_macro_roles: ['engineering'],
    });
    const team = [teamMember];
    const realEngineer = makeUser({
      macro_role: 'engineering',
      flex_macro_roles: [],
    });
    const pureBusinessCandidate = makeUser({
      macro_role: 'business_gtm',
      flex_macro_roles: [],
    });
    const realScore = scoreCandidate(realEngineer, team, maxWait, weights);
    const pureScore = scoreCandidate(pureBusinessCandidate, team, maxWait, weights);
    expect(realScore).toBeGreaterThan(pureScore);
  });
});
