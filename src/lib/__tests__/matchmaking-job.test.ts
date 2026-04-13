import { describe, expect, it, vi } from 'vitest';

import { deactivateTeam } from '../matchmaking/job';

describe('deactivateTeam', () => {
  it('uses a single RPC call to deactivate the team and its active members atomically', async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: true,
      error: null,
    });

    await deactivateTeam({ rpc } as never, 'team-1');

    expect(rpc).toHaveBeenCalledWith('deactivate_team_and_members', {
      p_team_id: 'team-1',
    });
  });

  it('throws when the deactivation RPC fails', async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: null,
      error: new Error('db offline'),
    });

    await expect(deactivateTeam({ rpc } as never, 'team-1')).rejects.toThrow(
      'db offline',
    );
  });
});
