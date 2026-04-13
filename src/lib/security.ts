import { timingSafeEqual } from 'node:crypto';

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;

const PROFILE_HOSTS = {
  linkedin: new Set(['linkedin.com', 'www.linkedin.com']),
  github: new Set(['github.com', 'www.github.com']),
  x: new Set(['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com']),
} as const;

export function getSafeRedirectPath(
  next: string | null | undefined,
  fallback: string,
): string {
  if (!next) {
    return fallback;
  }

  const trimmed = next.trim();
  let decoded = trimmed;

  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return fallback;
  }

  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.includes('\\') ||
    CONTROL_CHARS.test(trimmed) ||
    !decoded.startsWith('/') ||
    decoded.startsWith('//') ||
    decoded.includes('\\') ||
    CONTROL_CHARS.test(decoded)
  ) {
    return fallback;
  }

  return trimmed;
}

export function sanitizeExternalUrl(
  url: string | null | undefined,
): string | null {
  if (!url) {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed || CONTROL_CHARS.test(trimmed)) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

export function sanitizeProfileUrl(
  platform: keyof typeof PROFILE_HOSTS,
  url: string | null | undefined,
): string | null {
  const sanitized = sanitizeExternalUrl(url);
  if (!sanitized) {
    return null;
  }

  const host = new URL(sanitized).hostname.toLowerCase();
  return PROFILE_HOSTS[platform].has(host) ? sanitized : null;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function hasValidCronAuthorization(
  authorizationHeader: string | null,
  secret: string | undefined,
): boolean {
  if (!secret) {
    return false;
  }

  if (!authorizationHeader) {
    return false;
  }

  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(authorizationHeader);

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(expected, received);
}
