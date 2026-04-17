import { beforeEach, describe, expect, it, vi } from 'vitest';

const requireAdmin = vi.fn();
const rpc = vi.fn();
const fromFactory = vi.fn();
const emit = vi.fn();
const logError = vi.fn();
const revalidatePath = vi.fn();
const runMatchmakingJob = vi.fn();

class MockNotAdminError extends Error {
  constructor() {
    super('not admin');
    this.name = 'NotAdminError';
  }
}

vi.mock('@/lib/admin/auth', () => ({
  requireAdmin: () => requireAdmin(),
  NotAdminError: MockNotAdminError,
}));

vi.mock('@/lib/supabase/server', () => ({
  createServiceRoleClient: async () => ({
    rpc: (...args: unknown[]) => rpc(...args),
    from: (table: string) => fromFactory(table),
  }),
}));

vi.mock('@/lib/matchmaking/job', () => ({
  runMatchmakingJob: (...args: unknown[]) => runMatchmakingJob(...args),
}));

vi.mock('@/lib/notifications/dispatcher', () => ({
  emit: (...args: unknown[]) => emit(...args),
}));

vi.mock('@/lib/monitoring', () => ({
  logError: (...args: unknown[]) => logError(...args),
}));

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

const { forceAdvanceTeam, forceDissolveTeam, runMatchmakingNow } = await import(
  '@/app/(app)/admin/actions'
);

function stubTeamsAndMembers(team: {
  id: string;
  name: string;
  status: string;
} | null, members: Array<{ user_id: string }>) {
  fromFactory.mockImplementation((table: string) => {
    if (table === 'teams') {
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: team, error: null }),
          }),
        }),
      };
    }
    if (table === 'team_members') {
      return {
        select: () => ({
          eq: () => ({
            eq: async () => ({ data: members, error: null }),
          }),
        }),
      };
    }
    if (table === 'notification_events') {
      return {
        insert: async () => ({ data: null, error: null }),
      };
    }
    throw new Error(`Unexpected table: ${table}`);
  });
}

describe('runMatchmakingNow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns "Acesso negado" when caller is not admin', async () => {
    requireAdmin.mockRejectedValue(new MockNotAdminError());
    const result = await runMatchmakingNow();
    expect(result.success).toBe(false);
    expect(result.message).toBe('Acesso negado.');
    expect(runMatchmakingJob).not.toHaveBeenCalled();
  });

  it('returns busy message when begin_matchmaking_run reports another run in flight', async () => {
    requireAdmin.mockResolvedValue(undefined);
    rpc.mockImplementation(async (fn: string) => {
      if (fn === 'begin_matchmaking_run') {
        return { data: null, error: null };
      }
      throw new Error(`Unexpected rpc: ${fn}`);
    });

    const result = await runMatchmakingNow();
    expect(result.success).toBe(false);
    expect(result.message).toBe('Outro ciclo de matchmaking já está em execução.');
    expect(runMatchmakingJob).not.toHaveBeenCalled();
  });

  it('returns a friendly error when begin_matchmaking_run errors', async () => {
    requireAdmin.mockResolvedValue(undefined);
    rpc.mockImplementation(async (fn: string) => {
      if (fn === 'begin_matchmaking_run') {
        return { data: null, error: { message: 'db down' } };
      }
      throw new Error(`Unexpected rpc: ${fn}`);
    });

    const result = await runMatchmakingNow();
    expect(result.success).toBe(false);
    expect(result.message).toContain('Não foi possível iniciar matchmaking');
    expect(runMatchmakingJob).not.toHaveBeenCalled();
  });

  it('runs matchmaking under begin/end guard on success and revalidates', async () => {
    requireAdmin.mockResolvedValue(undefined);
    const rpcCalls: Array<{ fn: string; args: unknown }> = [];
    rpc.mockImplementation(async (fn: string, args: unknown) => {
      rpcCalls.push({ fn, args });
      if (fn === 'begin_matchmaking_run') {
        return { data: 'run-42', error: null };
      }
      if (fn === 'end_matchmaking_run') {
        return { data: true, error: null };
      }
      throw new Error(`Unexpected rpc: ${fn}`);
    });
    runMatchmakingJob.mockResolvedValue({
      teamsFormed: 2,
      usersMatched: 6,
      poolSize: 10,
      replacementsPerformed: 0,
      roundNumber: 1,
      notes: ['note-a'],
    });

    const result = await runMatchmakingNow();
    expect(result.success).toBe(true);
    expect(runMatchmakingJob).toHaveBeenCalledWith({ triggerSource: 'admin' });
    expect(revalidatePath).toHaveBeenCalledWith('/admin');

    expect(rpcCalls[0]).toEqual({
      fn: 'begin_matchmaking_run',
      args: { p_trigger_source: 'admin' },
    });
    expect(rpcCalls[1]?.fn).toBe('end_matchmaking_run');
    expect(rpcCalls[1]?.args).toMatchObject({
      p_run_id: 'run-42',
      p_status: 'completed',
      p_teams_formed: 2,
      p_users_matched: 6,
      p_pool_size: 10,
      p_replacements_performed: 0,
      p_notes: 'note-a',
    });
  });

  it('finalizes the run as failed when runMatchmakingJob throws', async () => {
    requireAdmin.mockResolvedValue(undefined);
    const rpcCalls: Array<{ fn: string; args: unknown }> = [];
    rpc.mockImplementation(async (fn: string, args: unknown) => {
      rpcCalls.push({ fn, args });
      if (fn === 'begin_matchmaking_run') {
        return { data: 'run-99', error: null };
      }
      if (fn === 'end_matchmaking_run') {
        return { data: true, error: null };
      }
      throw new Error(`Unexpected rpc: ${fn}`);
    });
    runMatchmakingJob.mockRejectedValue(new Error('engine exploded'));

    const result = await runMatchmakingNow();
    expect(result.success).toBe(false);
    expect(rpcCalls[1]?.fn).toBe('end_matchmaking_run');
    expect(rpcCalls[1]?.args).toMatchObject({
      p_run_id: 'run-99',
      p_status: 'failed',
      p_error: 'engine exploded',
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe('forceAdvanceTeam', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects non-admin callers', async () => {
    requireAdmin.mockRejectedValue(new MockNotAdminError());
    const result = await forceAdvanceTeam('team-1');
    expect(result.success).toBe(false);
    expect(result.message).toBe('Acesso negado.');
    expect(rpc).not.toHaveBeenCalled();
  });

  it('validates missing teamId', async () => {
    requireAdmin.mockResolvedValue(undefined);
    const result = await forceAdvanceTeam('');
    expect(result.success).toBe(false);
    expect(result.message).toBe('ID do time inválido.');
  });

  it('maps RPC code "team_not_found" to Portuguese', async () => {
    requireAdmin.mockResolvedValue(undefined);
    rpc.mockResolvedValue({
      data: { success: false, code: 'team_not_found' },
      error: null,
    });
    const result = await forceAdvanceTeam('team-1');
    expect(result.success).toBe(false);
    expect(result.message).toBe('Time não encontrado.');
  });

  it('writes an audit row on success', async () => {
    requireAdmin.mockResolvedValue(undefined);
    rpc.mockResolvedValue({ data: { success: true }, error: null });
    let auditInsert: Record<string, unknown> | null = null;
    fromFactory.mockImplementation((table: string) => {
      if (table === 'notification_events') {
        return {
          insert: async (row: Record<string, unknown>) => {
            auditInsert = row;
            return { data: null, error: null };
          },
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    const result = await forceAdvanceTeam('team-1');
    expect(result.success).toBe(true);
    expect(auditInsert).toBeTruthy();
    expect(auditInsert).toMatchObject({
      kind: 'admin_action',
      subject_team_id: 'team-1',
      payload: expect.objectContaining({
        action: 'force_advance_team',
        result: 'success',
      }),
    });
    expect(revalidatePath).toHaveBeenCalledWith('/admin');
  });
});

describe('forceDissolveTeam', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects non-admin callers', async () => {
    requireAdmin.mockRejectedValue(new MockNotAdminError());
    const result = await forceDissolveTeam('team-1');
    expect(result.success).toBe(false);
    expect(result.message).toBe('Acesso negado.');
    expect(rpc).not.toHaveBeenCalled();
  });

  it('emits team_deactivated when dissolving an active team', async () => {
    requireAdmin.mockResolvedValue(undefined);
    rpc.mockResolvedValue({
      data: { success: true, members_moved: 3 },
      error: null,
    });
    stubTeamsAndMembers(
      { id: 'team-1', name: 'Alpha', status: 'active' },
      [{ user_id: 'u1' }, { user_id: 'u2' }, { user_id: 'u3' }],
    );

    const result = await forceDissolveTeam('team-1');
    expect(result.success).toBe(true);
    expect(emit).toHaveBeenCalledWith(
      'team_deactivated',
      expect.objectContaining({
        user_ids: ['u1', 'u2', 'u3'],
        team_id: 'team-1',
        payload: expect.objectContaining({
          kind: 'team_deactivated',
          team_name: 'Alpha',
          reason: 'manual_admin',
        }),
      }),
    );
  });

  it('emits team_dissolved_pre_activation when dissolving a pending team', async () => {
    requireAdmin.mockResolvedValue(undefined);
    rpc.mockResolvedValue({
      data: { success: true, members_moved: 4 },
      error: null,
    });
    stubTeamsAndMembers(
      { id: 'team-1', name: 'Alpha', status: 'pending_confirmation' },
      [{ user_id: 'u1' }, { user_id: 'u2' }],
    );

    await forceDissolveTeam('team-1');
    expect(emit).toHaveBeenCalledWith(
      'team_dissolved_pre_activation',
      expect.objectContaining({
        payload: expect.objectContaining({
          kind: 'team_dissolved_pre_activation',
          reason: 'manual_admin',
        }),
      }),
    );
  });

  it('maps "already_inactive" code to Portuguese message', async () => {
    requireAdmin.mockResolvedValue(undefined);
    rpc.mockResolvedValue({
      data: { success: false, code: 'already_inactive' },
      error: null,
    });
    const result = await forceDissolveTeam('team-1');
    expect(result.success).toBe(false);
    expect(result.message).toBe('O time já está inativo.');
    expect(emit).not.toHaveBeenCalled();
  });

  it('does not emit when the team has no active members', async () => {
    requireAdmin.mockResolvedValue(undefined);
    rpc.mockResolvedValue({
      data: { success: true, members_moved: 0 },
      error: null,
    });
    stubTeamsAndMembers(
      { id: 'team-1', name: 'Alpha', status: 'active' },
      [],
    );
    await forceDissolveTeam('team-1');
    expect(emit).not.toHaveBeenCalled();
  });

  it('survives emit failure (logs + still succeeds)', async () => {
    requireAdmin.mockResolvedValue(undefined);
    rpc.mockResolvedValue({
      data: { success: true, members_moved: 2 },
      error: null,
    });
    stubTeamsAndMembers(
      { id: 'team-1', name: 'Alpha', status: 'active' },
      [{ user_id: 'u1' }],
    );
    emit.mockRejectedValue(new Error('resend down'));

    const result = await forceDissolveTeam('team-1');
    expect(result.success).toBe(true);
    expect(logError).toHaveBeenCalledWith(
      'admin.force_dissolve.notify_failed',
      expect.any(Error),
      { teamId: 'team-1' },
    );
  });
});
