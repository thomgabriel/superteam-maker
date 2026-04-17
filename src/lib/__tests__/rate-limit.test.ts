import { afterEach, describe, expect, it, vi } from 'vitest';

// `checkRateLimit` uses a module-scoped Map. Between tests we isolate by
// varying the key namespace; no reset needed unless a test reaches the
// limit on another key.

import { checkRateLimit } from '@/lib/rate-limit';

describe('checkRateLimit', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows the first request and reports remaining as max-1', () => {
    const result = checkRateLimit('key-a', 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.retryAfterSeconds).toBe(60);
  });

  it('denies requests once the max is reached within the window', () => {
    const key = 'key-b';
    for (let i = 0; i < 3; i += 1) {
      expect(checkRateLimit(key, 3, 60_000).allowed).toBe(true);
    }
    const blocked = checkRateLimit(key, 3, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('allows a fresh request after the window elapses', () => {
    const key = 'key-c';
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-17T10:00:00Z'));

    checkRateLimit(key, 2, 60_000);
    checkRateLimit(key, 2, 60_000);
    expect(checkRateLimit(key, 2, 60_000).allowed).toBe(false);

    vi.setSystemTime(new Date('2026-04-17T10:02:00Z'));
    const afterReset = checkRateLimit(key, 2, 60_000);
    expect(afterReset.allowed).toBe(true);
    expect(afterReset.remaining).toBe(1);
  });

  it('counts separately per key', () => {
    for (let i = 0; i < 3; i += 1) {
      checkRateLimit('isolated-key-1', 3, 60_000);
    }
    expect(checkRateLimit('isolated-key-1', 3, 60_000).allowed).toBe(false);
    expect(checkRateLimit('isolated-key-2', 3, 60_000).allowed).toBe(true);
  });

  it('returns allowed=true with remaining=0 on the exact maxth request', () => {
    const key = 'edge-max';
    checkRateLimit(key, 3, 60_000);
    checkRateLimit(key, 3, 60_000);
    const third = checkRateLimit(key, 3, 60_000);
    expect(third.allowed).toBe(true);
    expect(third.remaining).toBe(0);
  });

  it('reports retryAfterSeconds approximately matching the remaining window', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-17T10:00:00Z'));

    const key = 'retry-after';
    for (let i = 0; i < 2; i += 1) checkRateLimit(key, 2, 60_000);

    vi.setSystemTime(new Date('2026-04-17T10:00:40Z'));
    const blocked = checkRateLimit(key, 2, 60_000);
    expect(blocked.allowed).toBe(false);
    // Bucket started at T0 with resetAt T+60s. We're now at T+40s, ~20s remain.
    expect(blocked.retryAfterSeconds).toBeGreaterThanOrEqual(19);
    expect(blocked.retryAfterSeconds).toBeLessThanOrEqual(21);
  });
});
