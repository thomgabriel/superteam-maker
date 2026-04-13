import { describe, expect, it } from 'vitest';

import nextConfig from '../../../next.config';

describe('next security headers', () => {
  it('returns baseline hardening headers for all routes', async () => {
    const headers = await nextConfig.headers?.();

    expect(headers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: '/:path*',
          headers: expect.arrayContaining([
            expect.objectContaining({
              key: 'X-Frame-Options',
              value: 'DENY',
            }),
            expect.objectContaining({
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            }),
            expect.objectContaining({
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            }),
          ]),
        }),
      ]),
    );
  });
});
