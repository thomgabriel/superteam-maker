import type { MacroRole, Seniority, EnrichedPoolUser } from '@/types/database';
import type { ScoringWeights } from './config';

const SENIORITY_ORDER: Seniority[] = ['beginner', 'junior', 'mid', 'senior'];

function seniorityDistance(a: Seniority, b: Seniority): number {
  return Math.abs(SENIORITY_ORDER.indexOf(a) - SENIORITY_ORDER.indexOf(b));
}

function averageSeniority(members: EnrichedPoolUser[]): Seniority {
  if (members.length === 0) return 'junior';
  const avg =
    members.reduce((sum, m) => sum + SENIORITY_ORDER.indexOf(m.seniority), 0) /
    members.length;
  return SENIORITY_ORDER[Math.round(avg)];
}

export function scoreCandidate(
  candidate: EnrichedPoolUser,
  currentTeam: EnrichedPoolUser[],
  maxWaitMs: number,
  weights: ScoringWeights,
): number {
  const teamMacroRoles = new Set(currentTeam.map((m) => m.macro_role));
  const withCandidate = new Set([...teamMacroRoles, candidate.macro_role]);

  let roleScore: number;
  const hasEngineering = withCandidate.has('engineering');
  const hasBusiness = withCandidate.has('business_gtm');

  if (hasEngineering && hasBusiness) {
    roleScore = 100;
  } else if (hasEngineering || hasBusiness) {
    roleScore = 60;
  } else {
    roleScore = 20;
  }

  if (!teamMacroRoles.has(candidate.macro_role) && currentTeam.length > 0) {
    roleScore = Math.min(100, roleScore + 20);
  }

  const teamAvgSeniority = averageSeniority(currentTeam);
  const dist = seniorityDistance(candidate.seniority, teamAvgSeniority);
  let seniorityScore: number;
  if (dist === 0) seniorityScore = 100;
  else if (dist === 1) seniorityScore = 70;
  else seniorityScore = 30;

  const teamInterests = new Set(currentTeam.flatMap((m) => m.interests));
  const candidateInterests = new Set(candidate.interests);
  const shared = [...candidateInterests].filter((i) => teamInterests.has(i)).length;
  const totalUnique = new Set([...teamInterests, ...candidateInterests]).size;
  const interestScore = totalUnique > 0 ? (shared / totalUnique) * 100 : 50;

  const waitMs = Date.now() - new Date(candidate.waiting_since).getTime();
  const waitScore = maxWaitMs > 0 ? (waitMs / maxWaitMs) * 50 : 0;

  return (
    roleScore * weights.roleBalance +
    seniorityScore * weights.seniorityProximity +
    interestScore * weights.interestOverlap +
    waitScore * weights.waitTime
  );
}
