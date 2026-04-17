import { describe, expect, it } from 'vitest';
import { getLeaderChecklistState } from '../team-leader-checklist';
import type { Team } from '@/types/database';

const baseTeam = {
  id: 'team-1',
  name: 'Turbine Forge',
  leader_id: 'leader-1',
  status: 'pending_activation',
  round_number: 1,
  leader_claimed_at: null,
  activation_deadline_at: null,
  confirmation_deadline_at: null,
  dissolution_reason: null,
  idea_title: null,
  idea_description: null,
  project_category: null,
  whatsapp_group_url: null,
  understaffed_at: null,
  leader_dormant_at: null,
  hackathon_id: null,
  submission_url: null,
  submitted_at: null,
  created_at: '2026-04-13T00:00:00.000Z',
  updated_at: '2026-04-13T00:00:00.000Z',
} satisfies Team;

describe('getLeaderChecklistState', () => {
  it('keeps checklist focused on idea and readiness only', () => {
    const result = getLeaderChecklistState(baseTeam, 0, 2, false);

    expect(result.steps.map((step) => step.label)).toEqual([
      'Líder definido',
      'Ideia definida',
      'Todos prontos (0/2)',
    ]);
    expect(result.nextStepMessage).toBe('Defina a ideia do time.');
  });

  it('advances to readiness after the idea is defined', () => {
    const result = getLeaderChecklistState(
      { ...baseTeam, idea_title: 'Agent wallet copilot' },
      1,
      2,
      false,
    );

    expect(result.nextStepMessage).toBe('Peça para o time marcar que está pronto para começar.');
  });

  it('marks the checklist complete when everyone is ready', () => {
    const result = getLeaderChecklistState(
      { ...baseTeam, idea_title: 'Agent wallet copilot' },
      2,
      2,
      true,
    );

    expect(result.nextStepMessage).toBeNull();
    expect(result.steps.every((step) => step.done)).toBe(true);
  });
});
