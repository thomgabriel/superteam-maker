import { describe, expect, it } from 'vitest';

import {
  sanitizeTeamProfileUpdate,
  TEAM_DESCRIPTION_MAX_LENGTH,
  TEAM_NAME_MAX_LENGTH,
  TEAM_TITLE_MAX_LENGTH,
} from '../team-profile';

describe('sanitizeTeamProfileUpdate', () => {
  it('keeps only allowed fields and trims string values', () => {
    const result = sanitizeTeamProfileUpdate({
      name: '  Team Rocket  ',
      idea_title: '  Better Wallet  ',
      idea_description: '  Ship safer payments.  ',
      project_category: 'DeFi',
      leader_id: 'attacker',
      status: 'inactive',
    });

    expect(result).toEqual({
      ok: true,
      updates: {
        name: 'Team Rocket',
        idea_title: 'Better Wallet',
        idea_description: 'Ship safer payments.',
        project_category: 'DeFi',
      },
    });
  });

  it('normalizes empty optional fields to null', () => {
    const result = sanitizeTeamProfileUpdate({
      idea_title: '   ',
      idea_description: '',
      project_category: '  ',
    });

    expect(result).toEqual({
      ok: true,
      updates: {
        idea_title: null,
        idea_description: null,
        project_category: null,
      },
    });
  });

  it('rejects blank team names', () => {
    expect(
      sanitizeTeamProfileUpdate({
        name: '   ',
      }),
    ).toEqual({
      ok: false,
      message: 'O nome do time não pode ficar vazio.',
    });
  });

  it('rejects values longer than the configured limits', () => {
    expect(
      sanitizeTeamProfileUpdate({
        name: 'a'.repeat(TEAM_NAME_MAX_LENGTH + 1),
      }),
    ).toEqual({
      ok: false,
      message: `O nome do time pode ter no máximo ${TEAM_NAME_MAX_LENGTH} caracteres.`,
    });

    expect(
      sanitizeTeamProfileUpdate({
        idea_title: 'a'.repeat(TEAM_TITLE_MAX_LENGTH + 1),
      }),
    ).toEqual({
      ok: false,
      message: `O título da ideia pode ter no máximo ${TEAM_TITLE_MAX_LENGTH} caracteres.`,
    });

    expect(
      sanitizeTeamProfileUpdate({
        idea_description: 'a'.repeat(TEAM_DESCRIPTION_MAX_LENGTH + 1),
      }),
    ).toEqual({
      ok: false,
      message: `A descrição pode ter no máximo ${TEAM_DESCRIPTION_MAX_LENGTH} caracteres.`,
    });
  });

  it('rejects categories outside the supported list', () => {
    expect(
      sanitizeTeamProfileUpdate({
        project_category: 'Hacking',
      }),
    ).toEqual({
      ok: false,
      message: 'Selecione uma categoria válida.',
    });
  });
});
