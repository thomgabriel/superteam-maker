import { beforeEach, describe, expect, it, vi } from 'vitest';

// Dispatcher emit is the fan-out under test — hoisted mock so we can assert
// what was sent per branch without spinning up the real send path.
const emit = vi.fn();
const logError = vi.fn();

vi.mock('@/lib/notifications/dispatcher', () => ({
  emit: (...args: unknown[]) => emit(...args),
}));

vi.mock('@/lib/monitoring', () => ({
  logError: (...args: unknown[]) => logError(...args),
  logInfo: () => {},
}));

import { deactivateTeam, processConfirmationWindowExpiries } from '../matchmaking/job';

// Minimal fake Supabase client. `deactivateTeam` now reads team name + active
// members (for the team_deactivated emit) before calling the RPC, so the mock
// needs to support `from('teams').select().eq().maybeSingle()` and
// `from('team_members').select().eq().eq()`.
function buildFakeClient(overrides: { rpc: ReturnType<typeof vi.fn> }) {
  return {
    rpc: overrides.rpc,
    from: (table: string) => {
      if (table === 'teams') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: { name: 'Alpha' }, error: null }),
            }),
          }),
        };
      }
      if (table === 'team_members') {
        return {
          select: () => ({
            eq: () => ({
              eq: async () => ({ data: [{ user_id: 'u1' }], error: null }),
            }),
          }),
        };
      }
      if (table === 'notification_events' || table === 'notifications' || table === 'notification_preferences' || table === 'users') {
        // Dispatcher-side tables. Return shapes that let emit() short-circuit
        // without actually delivering.
        return {
          insert: () => ({
            select: () => ({
              single: async () => ({ data: { id: 'evt-1' }, error: null }),
            }),
          }),
          select: () => ({
            in: async () => ({ data: [], error: null }),
            eq: () => ({
              maybeSingle: async () => ({ data: null, error: null }),
            }),
          }),
          update: () => ({ eq: async () => ({ data: null, error: null }) }),
        };
      }
      throw new Error(`Unexpected table access in test: ${table}`);
    },
  };
}

describe('deactivateTeam', () => {
  it('uses a single RPC call to deactivate the team and its active members atomically', async () => {
    const rpc = vi.fn().mockImplementation((name: string) => {
      if (name === 'deactivate_team_and_members') {
        return Promise.resolve({ data: true, error: null });
      }
      // Other RPCs (if any) — return innocuous shape.
      return Promise.resolve({ data: null, error: null });
    });

    await deactivateTeam(buildFakeClient({ rpc }) as never, 'team-1');

    expect(rpc).toHaveBeenCalledWith('deactivate_team_and_members', {
      p_team_id: 'team-1',
    });
  });

  it('throws when the deactivation RPC fails', async () => {
    const rpc = vi.fn().mockImplementation((name: string) => {
      if (name === 'deactivate_team_and_members') {
        return Promise.resolve({ data: null, error: new Error('db offline') });
      }
      return Promise.resolve({ data: null, error: null });
    });

    await expect(
      deactivateTeam(buildFakeClient({ rpc }) as never, 'team-1'),
    ).rejects.toThrow('db offline');
  });
});

// ---------------------------------------------------------------------------
// processConfirmationWindowExpiries — the sole path that fans out
// leader_claim_opened / team_dissolved_pre_activation after the 48h window.
// A regression here means users silently don't hear back after they confirm.
// ---------------------------------------------------------------------------

interface ExpiryFixtureOptions {
  rpcResult:
    | { data: unknown; error: unknown }
    | ((name: string) => { data: unknown; error: unknown });
  teamsById?: Record<
    string,
    { name: string; activation_deadline_at?: string } | null
  >;
  activeMembersByTeam?: Record<string, Array<{ user_id: string }>>;
  replacedMembersByTeam?: Record<string, Array<{ user_id: string }>>;
}

function buildExpiryClient(options: ExpiryFixtureOptions) {
  const teamsById = options.teamsById ?? {};
  const activeByTeam = options.activeMembersByTeam ?? {};
  const replacedByTeam = options.replacedMembersByTeam ?? {};

  return {
    rpc: (name: string) => {
      const result =
        typeof options.rpcResult === 'function'
          ? options.rpcResult(name)
          : options.rpcResult;
      return Promise.resolve(result);
    },
    from: (table: string) => {
      if (table === 'teams') {
        return {
          select: () => ({
            eq: (_col: string, teamId: string) => ({
              maybeSingle: async () => ({
                data: teamsById[teamId] ?? null,
                error: null,
              }),
            }),
          }),
        };
      }
      if (table === 'team_members') {
        return {
          select: () => ({
            eq: (_col: string, teamId: string) => ({
              eq: (col2: string, status: string) => {
                if (col2 !== 'status') {
                  throw new Error(`unexpected team_members chain col: ${col2}`);
                }
                const rows =
                  status === 'active'
                    ? activeByTeam[teamId] ?? []
                    : status === 'replaced'
                      ? replacedByTeam[teamId] ?? []
                      : [];
                return Promise.resolve({ data: rows, error: null });
              },
            }),
          }),
        };
      }
      throw new Error(`Unexpected table access: ${table}`);
    },
  };
}

describe('processConfirmationWindowExpiries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    emit.mockResolvedValue({
      event_id: 'evt-1',
      notifications_created: 0,
      skipped_throttled: false,
      errors: [],
    });
  });

  it('records a note and skips emit when the RPC errors', async () => {
    const client = buildExpiryClient({
      rpcResult: { data: null, error: { message: 'pg down' } },
    });
    const notes: string[] = [];
    await processConfirmationWindowExpiries(client as never, notes);
    expect(notes).toContain('expire_confirmation_windows rpc failed');
    expect(emit).not.toHaveBeenCalled();
    expect(logError).toHaveBeenCalledWith(
      'matchmaking.expire_confirmation_windows.failed',
      expect.objectContaining({ message: 'pg down' }),
    );
  });

  it('is a no-op when RPC returns no advanced or dissolved teams', async () => {
    const client = buildExpiryClient({
      rpcResult: {
        data: { advanced_team_ids: [], dissolved_team_ids: [] },
        error: null,
      },
    });
    await processConfirmationWindowExpiries(client as never, []);
    expect(emit).not.toHaveBeenCalled();
  });

  it('emits leader_claim_opened per advanced team using active members + the DB activation_deadline_at', async () => {
    const deadline = '2026-04-20T00:00:00Z';
    const client = buildExpiryClient({
      rpcResult: {
        data: { advanced_team_ids: ['team-A'], dissolved_team_ids: [] },
        error: null,
      },
      teamsById: {
        'team-A': { name: 'Alpha', activation_deadline_at: deadline },
      },
      activeMembersByTeam: {
        'team-A': [
          { user_id: 'u1' },
          { user_id: 'u2' },
          { user_id: 'u3' },
          { user_id: 'u4' },
        ],
      },
    });

    await processConfirmationWindowExpiries(client as never, []);

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith(
      'leader_claim_opened',
      expect.objectContaining({
        team_id: 'team-A',
        user_ids: ['u1', 'u2', 'u3', 'u4'],
        payload: expect.objectContaining({
          kind: 'leader_claim_opened',
          team_id: 'team-A',
          team_name: 'Alpha',
          activation_deadline_at: deadline,
        }),
      }),
      client,
    );
  });

  it('emits team_dissolved_pre_activation per dissolved team using REPLACED members (post-RPC state)', async () => {
    const client = buildExpiryClient({
      rpcResult: {
        data: { advanced_team_ids: [], dissolved_team_ids: ['team-D'] },
        error: null,
      },
      teamsById: {
        'team-D': { name: 'Delta' },
      },
      replacedMembersByTeam: {
        'team-D': [{ user_id: 'd1' }, { user_id: 'd2' }, { user_id: 'd3' }],
      },
      // Intentionally empty active list — the RPC has just flipped them to
      // 'replaced', so fan-out must query `status='replaced'` not 'active'.
      activeMembersByTeam: { 'team-D': [] },
    });

    await processConfirmationWindowExpiries(client as never, []);

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith(
      'team_dissolved_pre_activation',
      expect.objectContaining({
        team_id: 'team-D',
        user_ids: ['d1', 'd2', 'd3'],
        payload: expect.objectContaining({
          kind: 'team_dissolved_pre_activation',
          team_id: 'team-D',
          team_name: 'Delta',
          reason: 'confirmation_failed',
        }),
      }),
      client,
    );
  });

  it('fans out both advanced and dissolved teams in the same call, independently', async () => {
    const client = buildExpiryClient({
      rpcResult: {
        data: {
          advanced_team_ids: ['team-A'],
          dissolved_team_ids: ['team-D'],
        },
        error: null,
      },
      teamsById: {
        'team-A': { name: 'Alpha', activation_deadline_at: '2026-04-20T00:00:00Z' },
        'team-D': { name: 'Delta' },
      },
      activeMembersByTeam: {
        'team-A': [{ user_id: 'a1' }, { user_id: 'a2' }],
        'team-D': [],
      },
      replacedMembersByTeam: {
        'team-D': [{ user_id: 'd1' }, { user_id: 'd2' }],
      },
    });

    await processConfirmationWindowExpiries(client as never, []);

    expect(emit).toHaveBeenCalledTimes(2);
    const kinds = emit.mock.calls.map((call) => call[0]);
    expect(kinds).toContain('leader_claim_opened');
    expect(kinds).toContain('team_dissolved_pre_activation');
  });

  it('continues the loop when a per-team emit fails (logs but does not abort)', async () => {
    emit.mockImplementation((kind: string) => {
      if (kind === 'leader_claim_opened') {
        return Promise.reject(new Error('resend down'));
      }
      return Promise.resolve({});
    });

    const client = buildExpiryClient({
      rpcResult: {
        data: {
          advanced_team_ids: ['team-A'],
          dissolved_team_ids: ['team-D'],
        },
        error: null,
      },
      teamsById: {
        'team-A': { name: 'Alpha', activation_deadline_at: '2026-04-20T00:00:00Z' },
        'team-D': { name: 'Delta' },
      },
      activeMembersByTeam: { 'team-A': [{ user_id: 'a1' }], 'team-D': [] },
      replacedMembersByTeam: { 'team-D': [{ user_id: 'd1' }] },
    });

    await processConfirmationWindowExpiries(client as never, []);

    // Dissolved fan-out still runs after the advanced one throws.
    expect(emit).toHaveBeenCalledTimes(2);
    expect(logError).toHaveBeenCalledWith(
      'matchmaking.emit_leader_claim_opened_failed',
      expect.any(Error),
      { teamId: 'team-A' },
    );
  });

  it('skips a team silently when it has zero members to notify', async () => {
    const client = buildExpiryClient({
      rpcResult: {
        data: { advanced_team_ids: ['team-A'], dissolved_team_ids: [] },
        error: null,
      },
      teamsById: { 'team-A': { name: 'Alpha' } },
      activeMembersByTeam: { 'team-A': [] },
    });
    await processConfirmationWindowExpiries(client as never, []);
    expect(emit).not.toHaveBeenCalled();
  });
});
