import { beforeEach, describe, expect, it, vi } from 'vitest';

const authGetUser = vi.fn();
const teamMaybeSingle = vi.fn();
const teamUpdateEq = vi.fn();
const logError = vi.fn();
const revalidatePath = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: async () => ({
    auth: {
      getUser: authGetUser,
    },
    from(table: string) {
      if (table !== 'teams') {
        throw new Error(`Unexpected table ${table}`);
      }

      return {
        select() {
          return {
            eq() {
              return {
                maybeSingle: teamMaybeSingle,
              };
            },
          };
        },
        update(payload: Record<string, unknown>) {
          return {
            eq() {
              teamUpdateEq(payload);
              return Promise.resolve({ error: null });
            },
          };
        },
      };
    },
  }),
  createServiceRoleClient: async () => ({}),
}));

vi.mock('@/lib/monitoring', () => ({
  logError,
}));

vi.mock('next/cache', () => ({
  revalidatePath,
}));

const { updateTeamProfile } = await import('@/app/(app)/team/[id]/actions');

describe('updateTeamProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'leader-1',
        },
      },
    });
    teamMaybeSingle.mockResolvedValue({
      data: {
        leader_id: 'leader-1',
      },
    });
  });

  it('drops untrusted fields before updating the team row', async () => {
    const result = await updateTeamProfile('team-1', {
      name: '  New Name  ',
      idea_title: '  Wallet  ',
      idea_description: '  Better onboarding.  ',
      project_category: 'DeFi',
      leader_id: 'attacker',
      status: 'inactive',
    } as never);

    expect(result).toEqual({ success: true });
    expect(teamUpdateEq).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New Name',
        idea_title: 'Wallet',
        idea_description: 'Better onboarding.',
        project_category: 'DeFi',
      }),
    );
    expect(teamUpdateEq).toHaveBeenCalledWith(
      expect.not.objectContaining({
        leader_id: 'attacker',
      }),
    );
    expect(teamUpdateEq).toHaveBeenCalledWith(
      expect.not.objectContaining({
        status: 'inactive',
      }),
    );
  });

  it('rejects invalid categories before writing', async () => {
    const result = await updateTeamProfile('team-1', {
      project_category: 'Unknown',
    });

    expect(result).toEqual({
      success: false,
      message: 'Selecione uma categoria válida.',
    });
    expect(teamUpdateEq).not.toHaveBeenCalled();
  });
});
