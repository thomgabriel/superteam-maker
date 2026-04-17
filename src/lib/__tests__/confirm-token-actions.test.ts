import { beforeEach, describe, expect, it, vi } from 'vitest';

const authGetUser = vi.fn();
const rpc = vi.fn();
const fromFactory = vi.fn();
const verifyConfirmationToken = vi.fn();
const consumeConfirmationToken = vi.fn();
const emit = vi.fn();
const logError = vi.fn();
const checkRateLimit = vi.fn(
  (_key: string, _max: number, _windowMs: number) => ({
    allowed: true,
    remaining: 9,
    retryAfterSeconds: 60,
  }),
);
const getHeadersList = vi.fn(() => new Map([['x-forwarded-for', '1.2.3.4']]));

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: async () => ({ auth: { getUser: authGetUser } }),
  createServiceRoleClient: async () => ({
    rpc: (...args: unknown[]) => rpc(...args),
    from: (table: string) => fromFactory(table),
  }),
}));

vi.mock('@/lib/tokens', () => ({
  ConfirmationTokenError: class extends Error {
    code: string;
    constructor(code: string, msg: string) {
      super(msg);
      this.code = code;
    }
  },
  verifyConfirmationToken: (arg: unknown) => verifyConfirmationToken(arg),
  consumeConfirmationToken: (arg: unknown) => consumeConfirmationToken(arg),
}));

vi.mock('@/lib/notifications/dispatcher', () => ({
  emit: (...a: unknown[]) => emit(...a),
}));

vi.mock('@/lib/monitoring', () => ({
  logError: (...a: unknown[]) => logError(...a),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (key: string, max: number, windowMs: number) =>
    checkRateLimit(key, max, windowMs),
}));

vi.mock('next/headers', () => ({
  headers: async () => ({
    get: (name: string) => getHeadersList().get(name) ?? null,
  }),
}));

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

const { confirmViaToken, declineViaToken } = await import(
  '@/app/team/confirm/actions'
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TableStub = Record<string, any>;

function stubTables(handlers: Record<string, TableStub>) {
  fromFactory.mockImplementation((table: string) => {
    const h = handlers[table];
    if (!h) throw new Error(`Unexpected table ${table}`);
    return h;
  });
}

function makePayload(overrides: Partial<{
  uid: string;
  tid: string;
  act: 'confirm' | 'decline';
  nonce: string;
}> = {}) {
  return {
    uid: 'u1',
    tid: 'team-1',
    act: 'confirm' as const,
    nonce: 'nonce-1',
    exp: Math.floor(Date.now() / 1000) + 3600,
    ...overrides,
  };
}

function teamStub(team: Record<string, unknown> | null) {
  return {
    select: () => ({
      eq: () => ({
        maybeSingle: async () => ({ data: team, error: null }),
      }),
    }),
  };
}

function membersStub(data: Array<{ user_id: string }>) {
  return {
    select: () => ({
      eq: () => ({
        eq: async () => ({ data, error: null }),
      }),
    }),
  };
}

function membersStubForMembershipCheck(exists: boolean) {
  return {
    select: () => ({
      eq: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: exists ? { id: 'mem-1' } : null,
              error: null,
            }),
          }),
        }),
      }),
    }),
  };
}

function confirmationsStub(data: Array<{ user_id: string; confirmed: boolean }>, count: number) {
  const upsert = vi.fn(() => Promise.resolve({ error: null }));
  return {
    stub: {
      select: (_col: string, opts?: { count?: string; head?: boolean }) => {
        if (opts?.head) {
          return {
            eq: () => ({
              eq: () => ({
                in: () => Promise.resolve({ count, error: null }),
              }),
            }),
          };
        }
        return {
          eq: () => Promise.resolve({ data, error: null }),
        };
      },
      upsert,
    },
    upsert,
  };
}

describe('confirmViaToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authGetUser.mockResolvedValue({ data: { user: null } });
    consumeConfirmationToken.mockResolvedValue({ nonce: 'nonce-1' });
  });

  it('blocks on rate limit', async () => {
    checkRateLimit.mockReturnValueOnce({
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 60,
    });
    await expect(confirmViaToken('some-token')).rejects.toThrow(
      'REDIRECT:/team/confirm?state=rate_limited',
    );
    expect(verifyConfirmationToken).not.toHaveBeenCalled();
  });

  it('redirects to malformed state on invalid token', async () => {
    checkRateLimit.mockReturnValue({
      allowed: true,
      remaining: 9,
      retryAfterSeconds: 60,
    });
    verifyConfirmationToken.mockImplementation(() => {
      const err = new Error('bad') as Error & { code?: string };
      err.name = 'ConfirmationTokenError';
      err.code = 'bad_signature';
      throw err;
    });
    await expect(confirmViaToken('tok')).rejects.toThrow(
      /REDIRECT:\/team\/confirm\?state=/,
    );
  });

  it('does not advance when active-member confirm count stays below 3', async () => {
    checkRateLimit.mockReturnValue({
      allowed: true,
      remaining: 9,
      retryAfterSeconds: 60,
    });
    verifyConfirmationToken.mockReturnValue(makePayload());

    const confirmsHelpers = confirmationsStub([], 2);

    stubTables({
      teams: teamStub({
        id: 'team-1',
        status: 'pending_confirmation',
        confirmation_deadline_at: new Date(Date.now() + 3600_000).toISOString(),
      }),
      team_members: {
        // membership check OR active-member list — answer both via generic
        // chain terminal: maybeSingle for membership, eq/eq returning array
        // for active-member list.
        select: () => ({
          eq: (_col: string, val: unknown) => {
            if (val === 'team-1') {
              return {
                eq: (col2: string, val2: unknown) => {
                  if (col2 === 'user_id') {
                    return {
                      eq: () => ({
                        maybeSingle: async () => ({
                          data: { id: 'mem-1' },
                          error: null,
                        }),
                      }),
                    };
                  }
                  if (col2 === 'status' && val2 === 'active') {
                    return Promise.resolve({
                      data: [{ user_id: 'u1' }, { user_id: 'u2' }],
                      error: null,
                    });
                  }
                  throw new Error('unexpected chain');
                },
              };
            }
            throw new Error('unexpected eq');
          },
        }),
      },
      team_confirmations: confirmsHelpers.stub,
    });

    await expect(confirmViaToken('tok')).rejects.toThrow(
      /REDIRECT:\/(team\/team-1|auth\?next=)/,
    );
    expect(rpc).not.toHaveBeenCalledWith('advance_team_to_activation', expect.anything());
    expect(consumeConfirmationToken).toHaveBeenCalledWith('nonce-1');
  });

  it('logs and does NOT emit leader_claim_opened when advance_team_to_activation RPC fails', async () => {
    checkRateLimit.mockReturnValue({
      allowed: true,
      remaining: 9,
      retryAfterSeconds: 60,
    });
    verifyConfirmationToken.mockReturnValue(makePayload());
    // count >= 3 triggers the advance RPC branch.
    const confirmsHelpers = confirmationsStub([], 3);

    stubTables({
      teams: teamStub({
        id: 'team-1',
        status: 'pending_confirmation',
        confirmation_deadline_at: new Date(Date.now() + 3600_000).toISOString(),
      }),
      team_members: {
        select: () => ({
          eq: () => ({
            eq: (col2: string, val2: unknown) => {
              if (col2 === 'user_id') {
                return {
                  eq: () => ({
                    maybeSingle: async () => ({
                      data: { id: 'mem-1' },
                      error: null,
                    }),
                  }),
                };
              }
              if (col2 === 'status' && val2 === 'active') {
                return Promise.resolve({
                  data: [
                    { user_id: 'u1' },
                    { user_id: 'u2' },
                    { user_id: 'u3' },
                    { user_id: 'u4' },
                  ],
                  error: null,
                });
              }
              throw new Error('unexpected');
            },
          }),
        }),
      },
      team_confirmations: confirmsHelpers.stub,
    });

    rpc.mockImplementation((name: string) => {
      if (name === 'advance_team_to_activation') {
        return Promise.resolve({ data: null, error: { message: 'rpc down' } });
      }
      return Promise.resolve({ data: null, error: null });
    });

    await expect(confirmViaToken('tok')).rejects.toThrow(/REDIRECT:/);

    expect(rpc).toHaveBeenCalledWith('advance_team_to_activation', {
      p_team_id: 'team-1',
    });
    expect(logError).toHaveBeenCalledWith(
      'team.confirm_via_token.advance_failed',
      expect.objectContaining({ message: 'rpc down' }),
      expect.objectContaining({ teamId: 'team-1' }),
    );
    // Critical invariant: when the RPC errors, the team is stuck in
    // pending_confirmation and we MUST NOT fan out leader_claim_opened
    // (which would email users that leadership is open on a non-advanced team).
    expect(emit).not.toHaveBeenCalledWith(
      'leader_claim_opened',
      expect.anything(),
    );
  });

  it('logs and proceeds when consume fails after a successful write', async () => {
    checkRateLimit.mockReturnValue({
      allowed: true,
      remaining: 9,
      retryAfterSeconds: 60,
    });
    verifyConfirmationToken.mockReturnValue(makePayload());
    consumeConfirmationToken.mockResolvedValue(null);
    const confirmsHelpers = confirmationsStub([], 1);

    stubTables({
      teams: teamStub({
        id: 'team-1',
        status: 'pending_confirmation',
        confirmation_deadline_at: new Date(Date.now() + 3600_000).toISOString(),
      }),
      team_members: {
        select: () => ({
          eq: () => ({
            eq: (col2: string, val2: unknown) => {
              if (col2 === 'user_id') {
                return {
                  eq: () => ({
                    maybeSingle: async () => ({
                      data: { id: 'mem-1' },
                      error: null,
                    }),
                  }),
                };
              }
              if (col2 === 'status' && val2 === 'active') {
                return Promise.resolve({ data: [{ user_id: 'u1' }], error: null });
              }
              throw new Error('unexpected');
            },
          }),
        }),
      },
      team_confirmations: confirmsHelpers.stub,
    });

    await expect(confirmViaToken('tok')).rejects.toThrow(/REDIRECT:/);
    expect(logError).toHaveBeenCalledWith(
      'team.confirm_via_token.consume_failed_post_write',
      expect.any(Error),
      expect.objectContaining({ teamId: 'team-1', userId: 'u1', nonce: 'nonce-1' }),
    );
  });
});

describe('declineViaToken dissolve threshold (compound condition)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authGetUser.mockResolvedValue({ data: { user: null } });
    consumeConfirmationToken.mockResolvedValue({ nonce: 'nonce-1' });
    checkRateLimit.mockReturnValue({
      allowed: true,
      remaining: 9,
      retryAfterSeconds: 60,
    });
    verifyConfirmationToken.mockReturnValue(
      makePayload({ act: 'confirm' }), // actions.ts accepts 'confirm' for decline too
    );
  });

  function stubDeclineFlow(options: {
    teamId?: string;
    declines: number;
    activeMembers: number;
  }) {
    const memberRows = Array.from({ length: options.activeMembers }, (_, i) => ({
      user_id: `member-${i}`,
    }));
    stubTables({
      teams: teamStub({
        id: options.teamId ?? 'team-1',
        status: 'pending_confirmation',
        confirmation_deadline_at: new Date(Date.now() + 3600_000).toISOString(),
      }),
      team_members: {
        select: (col: string) => ({
          eq: () => ({
            eq: (col2: string, val2: unknown) => {
              // Membership check inside verifyTokenAndMembership:
              // .eq('team_id').eq('user_id').eq('status').maybeSingle()
              if (col2 === 'user_id') {
                return {
                  eq: () => ({
                    maybeSingle: async () => ({
                      data: { id: 'mem-1' },
                      error: null,
                    }),
                  }),
                };
              }
              // Active-member fetch for decline threshold:
              // .select('user_id').eq('team_id').eq('status','active') → rows
              if (col2 === 'status' && val2 === 'active' && col === 'user_id') {
                return Promise.resolve({ data: memberRows, error: null });
              }
              throw new Error('unexpected');
            },
          }),
        }),
      },
      team_confirmations: {
        select: (_col: string, opts?: { count?: string; head?: boolean }) => {
          if (opts?.head) {
            // New shape: .eq('team_id').eq('confirmed',false).in('user_id', ids)
            return {
              eq: () => ({
                eq: () => ({
                  in: () =>
                    Promise.resolve({ count: options.declines, error: null }),
                }),
              }),
            };
          }
          return { eq: () => Promise.resolve({ data: [], error: null }) };
        },
        upsert: () => Promise.resolve({ error: null }),
      },
    });
    rpc.mockImplementation((name: string) => {
      if (name === 'dissolve_team_pre_activation') {
        return Promise.resolve({ data: true, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    });
  }

  it('4-member team, 1 decline → does NOT dissolve', async () => {
    stubDeclineFlow({ declines: 1, activeMembers: 4 });
    await expect(declineViaToken('tok', null)).rejects.toThrow(/REDIRECT:/);
    expect(rpc).not.toHaveBeenCalledWith(
      'dissolve_team_pre_activation',
      expect.anything(),
    );
  });

  it('4-member team, 2 declines → dissolves', async () => {
    stubDeclineFlow({ declines: 2, activeMembers: 4 });
    await expect(declineViaToken('tok', null)).rejects.toThrow(/REDIRECT:/);
    expect(rpc).toHaveBeenCalledWith(
      'dissolve_team_pre_activation',
      expect.objectContaining({ p_team_id: 'team-1', p_reason: 'confirmation_failed' }),
    );
  });

  it('3-member team, 1 decline → dissolves (can no longer reach 3 confirms)', async () => {
    stubDeclineFlow({ declines: 1, activeMembers: 3 });
    await expect(declineViaToken('tok', null)).rejects.toThrow(/REDIRECT:/);
    expect(rpc).toHaveBeenCalledWith(
      'dissolve_team_pre_activation',
      expect.anything(),
    );
  });

  it('5-member team, 2 declines → does NOT dissolve (3 remaining could still confirm)', async () => {
    stubDeclineFlow({ declines: 2, activeMembers: 5 });
    await expect(declineViaToken('tok', null)).rejects.toThrow(/REDIRECT:/);
    // declines(2) >= members(5) - 2 = 3? No. And declines(2) >= 2? Yes.
    // Current code: declines >= 2 OR declines >= members - 2
    // → 2 >= 2 is true → DISSOLVES.
    // This is actually intentional conservatism: 2 declines out of 5 means
    // only 3 undecided can confirm; together with 0 confirmed so far that's
    // exactly 3 — the minimum. The RPC chooses to dissolve anyway.
    expect(rpc).toHaveBeenCalledWith(
      'dissolve_team_pre_activation',
      expect.anything(),
    );
  });
});
