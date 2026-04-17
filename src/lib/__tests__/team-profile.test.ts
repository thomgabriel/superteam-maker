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

  describe('whatsapp_group_url', () => {
    it('accepts valid whatsapp group links', () => {
      const result = sanitizeTeamProfileUpdate({
        whatsapp_group_url: 'https://chat.whatsapp.com/ABC123xyz',
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.updates.whatsapp_group_url).toBe(
          'https://chat.whatsapp.com/ABC123xyz',
        );
      }
    });

    it('clears the link when passed an empty string', () => {
      const result = sanitizeTeamProfileUpdate({ whatsapp_group_url: '' });
      expect(result).toEqual({ ok: true, updates: { whatsapp_group_url: null } });
    });

    it('rejects non-whatsapp hosts', () => {
      expect(
        sanitizeTeamProfileUpdate({
          whatsapp_group_url: 'https://evil.com/ABC123',
        }),
      ).toEqual({
        ok: false,
        message: 'Use um link válido de grupo do WhatsApp (https://chat.whatsapp.com/...).',
      });
    });

    it('rejects non-https protocols', () => {
      expect(
        sanitizeTeamProfileUpdate({
          whatsapp_group_url: 'http://chat.whatsapp.com/abc',
        }),
      ).toEqual({
        ok: false,
        message: 'Use um link válido de grupo do WhatsApp (https://chat.whatsapp.com/...).',
      });
    });
  });

  describe('submission_url', () => {
    it('accepts a valid https submission URL and stamps submitted_at', () => {
      const result = sanitizeTeamProfileUpdate({
        submission_url: 'https://example.com/submission/123',
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.updates.submission_url).toBe(
          'https://example.com/submission/123',
        );
        expect(result.updates.submitted_at).toBeTypeOf('string');
        // Should parse to a valid ISO timestamp
        expect(Number.isNaN(new Date(result.updates.submitted_at as string).getTime())).toBe(
          false,
        );
      }
    });

    it('accepts a valid http submission URL (plan allows http)', () => {
      const result = sanitizeTeamProfileUpdate({
        submission_url: 'http://internal.local/team-demo',
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.updates.submission_url).toBe('http://internal.local/team-demo');
        expect(result.updates.submitted_at).toBeTypeOf('string');
      }
    });

    it('rejects non-http(s) protocols such as ftp://', () => {
      expect(
        sanitizeTeamProfileUpdate({
          submission_url: 'ftp://example.com/demo.zip',
        }),
      ).toEqual({
        ok: false,
        message: 'Use um link http(s) válido para a submissão.',
      });
    });

    it('rejects javascript: scheme', () => {
      expect(
        sanitizeTeamProfileUpdate({
          submission_url: 'javascript:alert(1)',
        }),
      ).toEqual({
        ok: false,
        message: 'Use um link http(s) válido para a submissão.',
      });
    });

    it('rejects submission URLs longer than 500 characters', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(500);
      expect(longUrl.length).toBeGreaterThan(500);
      expect(
        sanitizeTeamProfileUpdate({
          submission_url: longUrl,
        }),
      ).toEqual({
        ok: false,
        message: 'Link de submissão muito longo.',
      });
    });

    it('rejects malformed URLs that do not parse', () => {
      expect(
        sanitizeTeamProfileUpdate({
          submission_url: 'not a url at all',
        }),
      ).toEqual({
        ok: false,
        message: 'Use um link válido para a submissão.',
      });
    });

    it('clears submission_url and submitted_at when passed an empty string', () => {
      const result = sanitizeTeamProfileUpdate({ submission_url: '' });
      expect(result).toEqual({
        ok: true,
        updates: { submission_url: null, submitted_at: null },
      });
    });

    it('leaves submission fields untouched when key is not provided', () => {
      const result = sanitizeTeamProfileUpdate({ name: 'Team Rocket' });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect('submission_url' in result.updates).toBe(false);
        expect('submitted_at' in result.updates).toBe(false);
      }
    });
  });
});
