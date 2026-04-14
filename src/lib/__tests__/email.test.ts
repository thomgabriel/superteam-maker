import { describe, expect, it } from 'vitest';

import { buildMatchNotificationUrl } from '@/lib/email';

describe('buildMatchNotificationUrl', () => {
  it('links directly to the team page when a team id is available', () => {
    expect(
      buildMatchNotificationUrl('https://ideiadosonhos.com/', 'team-123'),
    ).toBe('https://ideiadosonhos.com/team/team-123');
  });

  it('falls back to the compatibility reveal route when team id is not available', () => {
    expect(buildMatchNotificationUrl('https://ideiadosonhos.com/')).toBe(
      'https://ideiadosonhos.com/team/reveal',
    );
  });
});
