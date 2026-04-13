import { beforeEach, describe, expect, it, vi } from 'vitest';

const authGetUser = vi.fn();
const claimRpc = vi.fn();
const trackEvent = vi.fn();
const revalidatePath = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: async () => ({
    auth: {
      getUser: authGetUser,
    },
    rpc(fn: string) {
      if (fn === 'claim_team_leadership') {
        return claimRpc();
      }
      throw new Error(`Unexpected rpc ${fn}`);
    },
  }),
  createServiceRoleClient: async () => ({}),
}));

vi.mock('@/lib/analytics.server', () => ({
  trackEvent,
}));

vi.mock('next/cache', () => ({
  revalidatePath,
}));

const { claimLeadership } = await import('@/app/(app)/team/[id]/actions');

describe('claimLeadership', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
        },
      },
    });
  });

  it('rejects users who are not active team members', async () => {
    claimRpc.mockResolvedValue({
      data: { success: false, message: 'not_member' },
      error: null,
    });

    const result = await claimLeadership('team-1');

    expect(result).toEqual({
      success: false,
      message: 'Apenas membros ativos do time podem assumir a liderança.',
    });
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it('lets active team members claim leadership', async () => {
    claimRpc.mockResolvedValue({
      data: { success: true },
      error: null,
    });

    const result = await claimLeadership('team-1');

    expect(result).toEqual({ success: true });
    expect(claimRpc).toHaveBeenCalledOnce();
    expect(trackEvent).toHaveBeenCalledTimes(2);
    expect(revalidatePath).toHaveBeenCalledWith('/team/team-1');
  });

  it('still succeeds when analytics logging fails after the write', async () => {
    claimRpc.mockResolvedValue({
      data: { success: true },
      error: null,
    });
    trackEvent.mockRejectedValueOnce(new Error('analytics offline'));

    const result = await claimLeadership('team-1');

    expect(result).toEqual({ success: true });
    expect(trackEvent).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/team/team-1');
  });
});
