import { beforeEach, describe, expect, it, vi } from 'vitest';

const authGetUser = vi.fn();
const rpc = vi.fn();
const logError = vi.fn();
const revalidatePath = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  // User-scoped client — only consulted for auth.getUser().
  createServerSupabaseClient: async () => ({
    auth: {
      getUser: authGetUser,
    },
  }),
  // Service-role client — where the RPC actually runs after flag + auth gates.
  createServiceRoleClient: async () => ({
    rpc,
  }),
}));

vi.mock('@/lib/monitoring', () => ({
  logError,
}));

vi.mock('next/cache', () => ({
  revalidatePath,
}));

const { requestLeaderReclaim } = await import(
  '@/app/(app)/team/[id]/dormant-actions'
);

describe('requestLeaderReclaim', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Tests verify behavior with the reclaim flag on; flag-off covered below.
    vi.stubEnv('LEADER_DORMANT_RECLAIM', 'true');
    authGetUser.mockResolvedValue({
      data: {
        user: { id: 'user-1' },
      },
    });
  });

  it('returns a shaped error when LEADER_DORMANT_RECLAIM is not enabled', async () => {
    vi.stubEnv('LEADER_DORMANT_RECLAIM', 'false');
    const result = await requestLeaderReclaim('team-1');
    expect(result.success).toBe(false);
    expect(result.message).toContain('Fale com um admin');
    expect(rpc).not.toHaveBeenCalled();
  });

  it('throws when the user is not authenticated', async () => {
    authGetUser.mockResolvedValueOnce({ data: { user: null } });

    await expect(requestLeaderReclaim('team-1')).rejects.toThrow(
      'Not authenticated',
    );
    expect(rpc).not.toHaveBeenCalled();
  });

  it('returns success and revalidates the team page when the RPC reports success', async () => {
    rpc.mockResolvedValue({ data: { success: true }, error: null });

    const result = await requestLeaderReclaim('team-1');

    expect(result).toEqual({ success: true });
    expect(rpc).toHaveBeenCalledWith('request_leader_reclaim', {
      p_team_id: 'team-1',
      p_user_id: 'user-1',
    });
    expect(revalidatePath).toHaveBeenCalledWith('/team/team-1');
  });

  it('maps RPC code "not_member" to the Portuguese member-only message', async () => {
    rpc.mockResolvedValue({
      data: { success: false, message: 'not_member' },
      error: null,
    });

    const result = await requestLeaderReclaim('team-1');

    expect(result).toEqual({
      success: false,
      message: 'Apenas membros ativos podem abrir a liderança.',
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('maps RPC code "not_dormant" to the Portuguese dormant-status message', async () => {
    rpc.mockResolvedValue({
      data: { success: false, message: 'not_dormant' },
      error: null,
    });

    const result = await requestLeaderReclaim('team-1');

    expect(result).toEqual({
      success: false,
      message: 'A liderança atual não está marcada como inativa.',
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('returns the generic failure message and logs when the RPC returns an error', async () => {
    rpc.mockResolvedValue({
      data: null,
      error: new Error('db offline'),
    });

    const result = await requestLeaderReclaim('team-1');

    expect(result).toEqual({
      success: false,
      message: 'Não foi possível abrir a liderança agora. Tente novamente.',
    });
    expect(logError).toHaveBeenCalledWith(
      'team.dormant_reclaim.rpc_failed',
      expect.any(Error),
      expect.objectContaining({ teamId: 'team-1', userId: 'user-1' }),
    );
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
