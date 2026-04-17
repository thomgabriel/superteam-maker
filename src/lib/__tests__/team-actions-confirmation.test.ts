import { beforeEach, describe, expect, it, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Shared mocks
// ---------------------------------------------------------------------------
const authGetUser = vi.fn();
const rpc = vi.fn();

// Service-role client: we program its `from(...)` chains per test.
const serviceFromFactory = vi.fn();

const trackEvent = vi.fn();
const revalidatePath = vi.fn();
const logError = vi.fn();
const emit = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: async () => ({
    auth: { getUser: authGetUser },
    rpc,
  }),
  createServiceRoleClient: async () => ({
    from: (table: string) => serviceFromFactory(table),
  }),
}));

vi.mock('@/lib/analytics.server', () => ({
  trackEvent,
}));

vi.mock('@/lib/monitoring', () => ({
  logError,
}));

vi.mock('next/cache', () => ({
  revalidatePath,
}));

vi.mock('@/lib/notifications/dispatcher', () => ({
  emit: (...args: unknown[]) => emit(...args),
}));

const { confirmTeamAction, declineTeamAction, claimLeadership } = await import(
  '@/app/(app)/team/[id]/actions'
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFormData(entries: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    fd.append(key, value);
  }
  return fd;
}

/**
 * Build a programmable service-role `.from(table)` handler.
 * Consumers pass a map of tables to response objects. Each response describes
 * how the chain should resolve for that table.
 */
interface TableMock {
  // For .select(...).eq(...).eq(...).maybeSingle() or variants that end in maybeSingle/single.
  maybeSingle?: unknown;
  // For .select(...).eq(...).eq(...) (no terminal method — awaited directly).
  listResult?: unknown;
}

function wireServiceFrom(tables: Record<string, TableMock>) {
  serviceFromFactory.mockImplementation((table: string) => {
    const spec = tables[table];
    if (!spec) {
      throw new Error(`Unexpected service-role read on table: ${table}`);
    }

    const chain: Record<string, unknown> = {
      select: () => chain,
      eq: () => chain,
      maybeSingle: async () => spec.maybeSingle ?? { data: null, error: null },
      then: undefined as unknown,
    };

    // Allow the chain to be awaited directly for list-style reads (no
    // maybeSingle at the end): awaiting a thenable resolves to listResult.
    chain.then = (
      onFulfilled: (v: unknown) => unknown,
    ) => Promise.resolve(spec.listResult ?? { data: [], error: null }).then(onFulfilled);

    return chain;
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  authGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  emit.mockResolvedValue({ event_id: 'evt-1', notifications_created: 0, skipped_throttled: false, errors: [] });
  trackEvent.mockResolvedValue(undefined);
});

// ---------------------------------------------------------------------------
// confirmTeamAction
// ---------------------------------------------------------------------------
describe('confirmTeamAction', () => {
  it('calls the confirm_team RPC with the team id from FormData', async () => {
    rpc.mockResolvedValue({
      data: { success: true, advanced: false },
      error: null,
    });

    const result = await confirmTeamAction(makeFormData({ teamId: 'team-1' }));

    expect(rpc).toHaveBeenCalledWith('confirm_team', { p_team_id: 'team-1' });
    expect(result).toEqual({ success: true, advanced: false });
    expect(emit).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/team/team-1');
  });

  it('emits leader_claim_opened to all active members when the team has advanced', async () => {
    rpc.mockResolvedValue({
      data: { success: true, advanced: true },
      error: null,
    });
    wireServiceFrom({
      team_members: {
        listResult: {
          data: [
            { user_id: 'user-1' },
            { user_id: 'user-2' },
            { user_id: 'user-3' },
            { user_id: 'user-4' },
          ],
          error: null,
        },
      },
      teams: {
        maybeSingle: {
          data: {
            name: 'Alpha',
            activation_deadline_at: '2026-04-20T00:00:00Z',
          },
          error: null,
        },
      },
    });

    const result = await confirmTeamAction(makeFormData({ teamId: 'team-1' }));

    expect(result).toEqual({ success: true, advanced: true });
    expect(emit).toHaveBeenCalledWith(
      'leader_claim_opened',
      expect.objectContaining({
        user_ids: ['user-1', 'user-2', 'user-3', 'user-4'],
        team_id: 'team-1',
        payload: expect.objectContaining({
          kind: 'leader_claim_opened',
          team_id: 'team-1',
          team_name: 'Alpha',
          activation_deadline_at: '2026-04-20T00:00:00Z',
        }),
      }),
    );
  });

  it('does NOT emit leader_claim_opened while the team is still awaiting more confirmations', async () => {
    rpc.mockResolvedValue({
      data: { success: true, advanced: false },
      error: null,
    });

    const result = await confirmTeamAction(makeFormData({ teamId: 'team-1' }));

    expect(result).toEqual({ success: true, advanced: false });
    expect(emit).not.toHaveBeenCalled();
  });

  it('returns session-expired when the user is not authenticated', async () => {
    authGetUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await confirmTeamAction(makeFormData({ teamId: 'team-1' }));

    expect(result).toEqual({
      success: false,
      message: 'Sessão expirada. Entre novamente.',
    });
    expect(rpc).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// declineTeamAction
// ---------------------------------------------------------------------------
describe('declineTeamAction', () => {
  it('forwards the reason to the decline_team RPC (trimmed and truncated)', async () => {
    // Pre-RPC member fetch for memberIdsBefore.
    wireServiceFrom({
      team_members: {
        listResult: { data: [{ user_id: 'user-1' }], error: null },
      },
      teams: {
        maybeSingle: { data: { name: 'Alpha' }, error: null },
      },
    });
    rpc.mockResolvedValue({
      data: { success: true, dissolved: false },
      error: null,
    });

    const result = await declineTeamAction(
      makeFormData({ teamId: 'team-1', reason: '  not a fit  ' }),
    );

    expect(result).toEqual({ success: true, dissolved: false });
    expect(rpc).toHaveBeenCalledWith('decline_team', {
      p_team_id: 'team-1',
      p_reason: 'not a fit',
    });
  });

  it('emits team_dissolved_pre_activation to all pre-dissolution members when dissolved=true', async () => {
    // memberIdsBefore is captured BEFORE the RPC, so this is what the call
    // should use for user_ids in the emit.
    wireServiceFrom({
      team_members: {
        listResult: {
          data: [
            { user_id: 'user-1' },
            { user_id: 'user-2' },
            { user_id: 'user-3' },
          ],
          error: null,
        },
      },
      teams: {
        maybeSingle: { data: { name: 'Alpha' }, error: null },
      },
    });
    rpc.mockResolvedValue({
      data: { success: true, dissolved: true },
      error: null,
    });

    const result = await declineTeamAction(
      makeFormData({ teamId: 'team-1', reason: 'conflict' }),
    );

    expect(result).toEqual({ success: true, dissolved: true });
    expect(emit).toHaveBeenCalledWith(
      'team_dissolved_pre_activation',
      expect.objectContaining({
        team_id: 'team-1',
        user_ids: ['user-1', 'user-2', 'user-3'],
        payload: expect.objectContaining({
          kind: 'team_dissolved_pre_activation',
          team_id: 'team-1',
          team_name: 'Alpha',
          reason: 'confirmation_failed',
        }),
      }),
    );
  });

  it('returns session-expired when the user is not authenticated', async () => {
    authGetUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await declineTeamAction(
      makeFormData({ teamId: 'team-1', reason: '' }),
    );

    expect(result).toEqual({
      success: false,
      message: 'Sessão expirada. Entre novamente.',
    });
    expect(rpc).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// claimLeadership — C.4 integration (leader_claimed emission)
// ---------------------------------------------------------------------------
describe('claimLeadership — C.4 leader_claimed emission', () => {
  it('emits leader_claimed to all active members except the new leader', async () => {
    rpc.mockResolvedValue({ data: { success: true }, error: null });
    wireServiceFrom({
      teams: {
        maybeSingle: {
          data: {
            id: 'team-1',
            name: 'Alpha',
            whatsapp_group_url: 'https://chat.whatsapp.com/abc',
          },
          error: null,
        },
      },
      team_members: {
        listResult: {
          data: [
            { user_id: 'user-1' }, // the claimant — should be excluded
            { user_id: 'user-2' },
            { user_id: 'user-3' },
            { user_id: 'user-4' },
          ],
          error: null,
        },
      },
      profiles: {
        maybeSingle: { data: { name: 'Ada' }, error: null },
      },
    });

    const result = await claimLeadership('team-1');

    expect(result).toEqual({ success: true });
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith(
      'leader_claimed',
      expect.objectContaining({
        team_id: 'team-1',
        user_ids: ['user-2', 'user-3', 'user-4'],
        payload: expect.objectContaining({
          kind: 'leader_claimed',
          team_id: 'team-1',
          team_name: 'Alpha',
          leader_name: 'Ada',
          whatsapp_url: 'https://chat.whatsapp.com/abc',
        }),
      }),
    );
  });
});
