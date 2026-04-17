import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const createServiceRoleClient = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createServiceRoleClient: (...args: unknown[]) => createServiceRoleClient(...args),
}));

const TEST_SECRET = 'test-secret-for-hmac-signing-only';

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('NOTIFICATION_TOKEN_SECRET', TEST_SECRET);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

const {
  signConfirmationToken,
  verifyConfirmationToken,
  consumeConfirmationToken,
  peekConfirmationToken,
  buildConfirmationLink,
  ConfirmationTokenError,
} = await import('@/lib/tokens');

describe('signConfirmationToken + verifyConfirmationToken', () => {
  it('roundtrips: verify returns the original payload fields', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    createServiceRoleClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({ insert }),
    });

    const signed = await signConfirmationToken({
      uid: 'user-1',
      tid: 'team-1',
      act: 'confirm',
    });

    const payload = verifyConfirmationToken(signed.token);
    expect(payload.uid).toBe('user-1');
    expect(payload.tid).toBe('team-1');
    expect(payload.act).toBe('confirm');
    expect(payload.nonce).toBe(signed.nonce);
    expect(payload.exp * 1000).toBe(signed.expiresAt.getTime());
  });

  it('inserts a row with the expected fields into confirmation_tokens', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ insert });
    createServiceRoleClient.mockResolvedValue({ from });

    const signed = await signConfirmationToken({
      uid: 'user-42',
      tid: 'team-99',
      act: 'decline',
      expSeconds: 3600,
    });

    expect(from).toHaveBeenCalledWith('confirmation_tokens');
    expect(insert).toHaveBeenCalledTimes(1);
    const row = insert.mock.calls[0][0];
    expect(row.nonce).toBe(signed.nonce);
    expect(row.user_id).toBe('user-42');
    expect(row.team_id).toBe('team-99');
    expect(row.action).toBe('decline');
    expect(row.expires_at).toBe(signed.expiresAt.toISOString());
  });

  it('rejects tokens with a tampered signature', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    createServiceRoleClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({ insert }),
    });

    const signed = await signConfirmationToken({
      uid: 'user-1',
      tid: 'team-1',
      act: 'confirm',
    });

    // Flip a character in the signature segment.
    const parts = signed.token.split('.');
    const sig = parts[2];
    const firstChar = sig[0];
    const swapped = firstChar === 'A' ? 'B' : 'A';
    const tampered = `${parts[0]}.${parts[1]}.${swapped}${sig.slice(1)}`;

    expect(() => verifyConfirmationToken(tampered)).toThrowError(ConfirmationTokenError);
    try {
      verifyConfirmationToken(tampered);
    } catch (err) {
      expect(err).toBeInstanceOf(ConfirmationTokenError);
      expect((err as InstanceType<typeof ConfirmationTokenError>).code).toBe('bad_signature');
    }
  });

  it('rejects expired tokens', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    createServiceRoleClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({ insert }),
    });

    // Sign with a 1-second TTL, then jump Date.now forward past expiry.
    const realNow = Date.now;
    const baseNow = realNow();
    vi.spyOn(Date, 'now').mockImplementation(() => baseNow);

    const signed = await signConfirmationToken({
      uid: 'user-1',
      tid: 'team-1',
      act: 'confirm',
      expSeconds: 1,
    });

    // Jump 10 seconds into the future.
    vi.spyOn(Date, 'now').mockImplementation(() => baseNow + 10_000);

    try {
      verifyConfirmationToken(signed.token);
      throw new Error('expected verifyConfirmationToken to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfirmationTokenError);
      expect((err as InstanceType<typeof ConfirmationTokenError>).code).toBe('expired');
    }
  });

  it('rejects malformed tokens (missing parts, empty string, bad base64)', () => {
    expect(() => verifyConfirmationToken('')).toThrowError(ConfirmationTokenError);
    expect(() => verifyConfirmationToken('onlyone')).toThrowError(ConfirmationTokenError);
    expect(() => verifyConfirmationToken('a.b')).toThrowError(ConfirmationTokenError);
    // Correct 3-parts but the middle is not valid base64url JSON.
    expect(() => verifyConfirmationToken('v1.not-a-valid-payload.sig')).toThrowError(
      ConfirmationTokenError,
    );
  });

  it('rejects tokens with a different version prefix', () => {
    try {
      verifyConfirmationToken('v2.abc.def');
      throw new Error('expected to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfirmationTokenError);
      expect((err as InstanceType<typeof ConfirmationTokenError>).code).toBe('bad_version');
    }
  });

  it('throws when persisting the nonce fails', async () => {
    const insert = vi.fn().mockResolvedValue({ error: { message: 'conflict' } });
    createServiceRoleClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({ insert }),
    });

    await expect(
      signConfirmationToken({
        uid: 'user-1',
        tid: 'team-1',
        act: 'confirm',
      }),
    ).rejects.toThrow(/Failed to persist confirmation token nonce: conflict/);
  });
});

describe('consumeConfirmationToken', () => {
  it('returns the row on first consume and null on the second', async () => {
    const row = {
      nonce: 'nonce-1',
      user_id: 'user-1',
      team_id: 'team-1',
      action: 'confirm',
      expires_at: new Date().toISOString(),
      consumed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    // First invocation: returns the row (simulating WHERE consumed_at IS NULL match).
    const maybeSingleFirst = vi.fn().mockResolvedValue({ data: row, error: null });
    const selectFirst = vi.fn().mockReturnValue({ maybeSingle: maybeSingleFirst });
    const isFirst = vi.fn().mockReturnValue({ select: selectFirst });
    const eqFirst = vi.fn().mockReturnValue({ is: isFirst });
    const updateFirst = vi.fn().mockReturnValue({ eq: eqFirst });
    const fromFirst = vi.fn().mockReturnValue({ update: updateFirst });

    createServiceRoleClient.mockResolvedValueOnce({ from: fromFirst });
    const first = await consumeConfirmationToken('nonce-1');
    expect(first).toEqual(row);
    expect(fromFirst).toHaveBeenCalledWith('confirmation_tokens');
    expect(eqFirst).toHaveBeenCalledWith('nonce', 'nonce-1');
    expect(isFirst).toHaveBeenCalledWith('consumed_at', null);
    // update payload contains consumed_at ISO timestamp
    const updatePayload = updateFirst.mock.calls[0][0];
    expect(typeof updatePayload.consumed_at).toBe('string');

    // Second invocation: already consumed -> the filter returns no row.
    const maybeSingleSecond = vi.fn().mockResolvedValue({ data: null, error: null });
    const selectSecond = vi.fn().mockReturnValue({ maybeSingle: maybeSingleSecond });
    const isSecond = vi.fn().mockReturnValue({ select: selectSecond });
    const eqSecond = vi.fn().mockReturnValue({ is: isSecond });
    const updateSecond = vi.fn().mockReturnValue({ eq: eqSecond });
    const fromSecond = vi.fn().mockReturnValue({ update: updateSecond });

    createServiceRoleClient.mockResolvedValueOnce({ from: fromSecond });
    const second = await consumeConfirmationToken('nonce-1');
    expect(second).toBeNull();
  });

  it('returns null for empty nonce without querying the database', async () => {
    const result = await consumeConfirmationToken('');
    expect(result).toBeNull();
    expect(createServiceRoleClient).not.toHaveBeenCalled();
  });

  it('throws when the update query errors', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'boom' } });
    const select = vi.fn().mockReturnValue({ maybeSingle });
    const is = vi.fn().mockReturnValue({ select });
    const eq = vi.fn().mockReturnValue({ is });
    const update = vi.fn().mockReturnValue({ eq });
    createServiceRoleClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({ update }),
    });

    await expect(consumeConfirmationToken('nonce-1')).rejects.toThrow(
      /Failed to consume confirmation token: boom/,
    );
  });
});

describe('peekConfirmationToken', () => {
  it('returns the row without consuming (no update call)', async () => {
    const row = {
      nonce: 'nonce-1',
      user_id: 'user-1',
      team_id: 'team-1',
      action: 'confirm',
      expires_at: new Date().toISOString(),
      consumed_at: null as unknown as string,
      created_at: new Date().toISOString(),
    };

    const maybeSingle = vi.fn().mockResolvedValue({ data: row, error: null });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const update = vi.fn(); // must never be called
    const from = vi.fn().mockReturnValue({ select, update });
    createServiceRoleClient.mockResolvedValue({ from });

    const result = await peekConfirmationToken('nonce-1');
    expect(result).toEqual(row);
    expect(from).toHaveBeenCalledWith('confirmation_tokens');
    expect(select).toHaveBeenCalledWith('*');
    expect(eq).toHaveBeenCalledWith('nonce', 'nonce-1');
    expect(update).not.toHaveBeenCalled();
  });

  it('returns null for empty nonce without querying', async () => {
    const result = await peekConfirmationToken('');
    expect(result).toBeNull();
    expect(createServiceRoleClient).not.toHaveBeenCalled();
  });

  it('returns null when no row is found', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    createServiceRoleClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({ select }),
    });

    expect(await peekConfirmationToken('nonce-missing')).toBeNull();
  });
});

describe('buildConfirmationLink', () => {
  it('builds a URL using NEXT_PUBLIC_APP_URL when no baseUrl is passed', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://ideiadosonhos.com');
    expect(buildConfirmationLink('v1.payload.sig')).toBe(
      'https://ideiadosonhos.com/team/confirm?t=v1.payload.sig',
    );
  });

  it('strips a trailing slash from the base URL', () => {
    expect(buildConfirmationLink('abc', 'https://ideiadosonhos.com/')).toBe(
      'https://ideiadosonhos.com/team/confirm?t=abc',
    );
    expect(buildConfirmationLink('abc', 'https://ideiadosonhos.com///')).toBe(
      'https://ideiadosonhos.com/team/confirm?t=abc',
    );
  });

  it('URL-encodes the token query parameter', () => {
    const link = buildConfirmationLink('token with/chars?&', 'https://example.com');
    expect(link).toBe(
      'https://example.com/team/confirm?t=token%20with%2Fchars%3F%26',
    );
  });

  it('falls back to localhost when no env var and no baseUrl are provided', () => {
    // Delete the env var entirely (not empty string) so ?? falls through.
    delete process.env.NEXT_PUBLIC_APP_URL;
    expect(buildConfirmationLink('abc')).toBe('http://localhost:3000/team/confirm?t=abc');
  });
});
