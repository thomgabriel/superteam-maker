import type { Seniority, EnrichedPoolUser } from '@/types/database';
import type { ScoringWeights } from './config';
import { FLEX_DISCOUNT } from './config';

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

function computeRoleScore(
  candidateMacro: string,
  teamRoles: Set<string>,
  teamSize: number,
): number {
  const withCandidate = new Set([...teamRoles, candidateMacro]);

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

  if (!teamRoles.has(candidateMacro) && teamSize > 0) {
    roleScore = Math.min(100, roleScore + 20);
  }

  return roleScore;
}

export function scoreCandidate(
  candidate: EnrichedPoolUser,
  currentTeam: EnrichedPoolUser[],
  maxWaitMs: number,
  weights: ScoringWeights,
): number {
  // Primary roles only — used for scoring primary candidates
  const teamPrimaryRoles = new Set(currentTeam.map((m) => m.macro_role));

  // Full coverage (primary + flex) — used to skip redundant flex bonuses
  const teamCoverageRoles = new Set<string>();
  for (const m of currentTeam) {
    teamCoverageRoles.add(m.macro_role);
    for (const flex of m.flex_macro_roles) {
      teamCoverageRoles.add(flex);
    }
  }

  // Primary role score (uses primary roles only)
  const primaryScore = computeRoleScore(candidate.macro_role, teamPrimaryRoles, currentTeam.length);

  // Flex role score: try each flex macro against coverage, take the best delta
  let roleScore = primaryScore;
  for (const flexMacro of candidate.flex_macro_roles) {
    if (teamCoverageRoles.has(flexMacro)) continue;
    const simulatedScore = computeRoleScore(flexMacro, teamCoverageRoles, currentTeam.length);
    if (simulatedScore > primaryScore) {
      const flexAdjusted = primaryScore + (simulatedScore - primaryScore) * FLEX_DISCOUNT;
      roleScore = Math.max(roleScore, flexAdjusted);
    }
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
