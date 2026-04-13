import type { Team } from '@/types/database';

export interface LeaderChecklistStep {
  label: string;
  done: boolean;
}

export interface LeaderChecklistState {
  nextStepMessage: string | null;
  steps: LeaderChecklistStep[];
}

export function getLeaderChecklistState(
  team: Team,
  readyCount: number,
  readyTarget: number,
  allReady: boolean,
): LeaderChecklistState {
  const clampedReadyTarget = Math.max(readyTarget, 0);
  const steps: LeaderChecklistStep[] = [
    { label: 'Líder definido', done: true },
    { label: 'Ideia definida', done: !!team.idea_title },
    {
      label: `Todos prontos (${readyCount}/${clampedReadyTarget})`,
      done: clampedReadyTarget > 0 ? allReady : false,
    },
  ];

  if (!team.idea_title) {
    return {
      nextStepMessage: 'Defina a ideia do time.',
      steps,
    };
  }

  if (!(clampedReadyTarget > 0 && allReady)) {
    return {
      nextStepMessage: 'Peça para o time marcar que está pronto para começar.',
      steps,
    };
  }

  return {
    nextStepMessage: null,
    steps,
  };
}
