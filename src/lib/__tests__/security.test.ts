import { describe, expect, it } from 'vitest';

import {
  escapeHtml,
  getSafeRedirectPath,
  hasValidCronAuthorization,
  sanitizeExternalUrl,
  sanitizeProfileUrl,
} from '../security';

describe('getSafeRedirectPath', () => {
  it('keeps safe app-relative redirects', () => {
    expect(getSafeRedirectPath('/queue', '/profile')).toBe('/queue');
    expect(getSafeRedirectPath('/team/abc?tab=members', '/profile')).toBe(
      '/team/abc?tab=members',
    );
  });

  it('falls back for unsafe redirects', () => {
    expect(getSafeRedirectPath(undefined, '/profile')).toBe('/profile');
    expect(getSafeRedirectPath('queue', '/profile')).toBe('/profile');
    expect(getSafeRedirectPath('//evil.com', '/profile')).toBe('/profile');
    expect(getSafeRedirectPath('/%2fevil.com', '/profile')).toBe('/profile');
    expect(getSafeRedirectPath('https://evil.com', '/profile')).toBe('/profile');
    expect(getSafeRedirectPath('/\nadmin', '/profile')).toBe('/profile');
  });
});

describe('sanitizeExternalUrl', () => {
  it('keeps http and https URLs', () => {
    expect(sanitizeExternalUrl('https://github.com/openai')).toBe(
      'https://github.com/openai',
    );
    expect(sanitizeExternalUrl(' http://example.com/demo ')).toBe(
      'http://example.com/demo',
    );
  });

  it('rejects non-http schemes', () => {
    expect(sanitizeExternalUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeExternalUrl('data:text/html,boom')).toBeNull();
    expect(sanitizeExternalUrl('file:///etc/passwd')).toBeNull();
  });
});

describe('sanitizeProfileUrl', () => {
  it('allows the expected social domains', () => {
    expect(
      sanitizeProfileUrl('linkedin', 'https://www.linkedin.com/in/test-user'),
    ).toBe('https://www.linkedin.com/in/test-user');
    expect(sanitizeProfileUrl('github', 'https://github.com/test-user')).toBe(
      'https://github.com/test-user',
    );
    expect(sanitizeProfileUrl('x', 'https://x.com/test-user')).toBe(
      'https://x.com/test-user',
    );
    expect(sanitizeProfileUrl('x', 'https://twitter.com/test-user')).toBe(
      'https://twitter.com/test-user',
    );
  });

  it('rejects mismatched or unsafe social URLs', () => {
    expect(sanitizeProfileUrl('linkedin', 'https://evil.com/in/test-user')).toBeNull();
    expect(sanitizeProfileUrl('github', 'javascript:alert(1)')).toBeNull();
    expect(sanitizeProfileUrl('x', 'https://example.com/test-user')).toBeNull();
  });
});

describe('escapeHtml', () => {
  it('escapes user-controlled html characters', () => {
    expect(escapeHtml('<b>Team & Co</b>"')).toBe(
      '&lt;b&gt;Team &amp; Co&lt;/b&gt;&quot;',
    );
  });
});

describe('hasValidCronAuthorization', () => {
  it('fails closed when the secret is missing', () => {
    expect(hasValidCronAuthorization('Bearer undefined', undefined)).toBe(false);
    expect(hasValidCronAuthorization('Bearer anything', '')).toBe(false);
  });

  it('accepts only the exact configured bearer token', () => {
    expect(hasValidCronAuthorization('Bearer top-secret', 'top-secret')).toBe(true);
    expect(hasValidCronAuthorization('Bearer wrong', 'top-secret')).toBe(false);
    expect(hasValidCronAuthorization(null, 'top-secret')).toBe(false);
  });
});
