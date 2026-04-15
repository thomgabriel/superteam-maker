export const MATCHMAKING_CONFIG = {
  targetTeamSize: 4,
  minTeamSize: 3,
  minPoolSizeByRound: [20, 12, 6, 3],
  maxWaitMinutes: 60,
  understaffedGraceHours: 24,
  weights: {
    roleBalance: 0.4,
    seniorityProximity: 0.3,
    interestOverlap: 0.2,
    waitTime: 0.1,
  },
  fallbackWeights: {
    roleBalance: 0.3,
    seniorityProximity: 0.2,
    interestOverlap: 0.2,
    waitTime: 0.3,
  },
};

export type ScoringWeights = typeof MATCHMAKING_CONFIG.weights;

export const FLEX_DISCOUNT = 0.7;

export const MIN_EXTRA_MEMBER_SCORE = 25;
