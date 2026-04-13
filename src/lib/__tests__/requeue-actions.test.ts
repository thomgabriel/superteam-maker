import { beforeEach, describe, expect, it, vi } from 'vitest';

const resolveAuthenticatedUserState = vi.fn();
const rpc = vi.fn();
const logError = vi.fn();
const redirect = vi.fn((path: string) => {
  throw new Error(`REDIRECT:${path}`);
});

vi.mock('@/lib/user-state', () => ({
  resolveAuthenticatedUserState,
}));

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: async () => ({
    rpc,
  }),
}));

vi.mock('@/lib/monitoring', () => ({
  logError,
}));

vi.mock('next/navigation', () => ({
  redirect,
}));

const { reenterPool } = await import('@/app/(app)/requeue/actions');

describe('reenterPool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resolveAuthenticatedUserState.mockResolvedValue({
      userId: 'user-1',
      state: 'needs_requeue',
      redirectPath: '/requeue',
    });
  });

  it('shows a specific message when the RPC rejects users who are still on a team', async () => {
    rpc.mockResolvedValue({
      data: { success: false, code: 'still_on_team' },
      error: null,
    });

    await expect(reenterPool()).rejects.toThrow(
      'Você ainda faz parte de um time ativo. Abra seu time para continuar.',
    );
  });
});
