import { beforeEach, describe, expect, it, vi } from 'vitest';

const authGetUser = vi.fn();
const rpc = vi.fn();
const from = vi.fn();
const persistAttributionForUser = vi.fn();
const trackEvent = vi.fn();
const logError = vi.fn();
const resolveUserStateWithClient = vi.fn();
const redirect = vi.fn((path: string) => {
  throw new Error(`REDIRECT:${path}`);
});

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: async () => ({
    auth: {
      getUser: authGetUser,
    },
    rpc,
    from,
  }),
}));

vi.mock('@/lib/attribution', () => ({
  persistAttributionForUser,
}));

vi.mock('@/lib/analytics.server', () => ({
  trackEvent,
}));

vi.mock('@/lib/monitoring', () => ({
  logError,
}));

vi.mock('@/lib/user-state', () => ({
  resolveUserStateWithClient,
}));

vi.mock('next/navigation', () => ({
  redirect,
}));

const { createProfile, updateProfile } = await import('@/app/(app)/profile/actions');

describe('createProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
        },
      },
    });
    rpc.mockResolvedValue({ error: null });
    persistAttributionForUser.mockResolvedValue(undefined);
    trackEvent.mockResolvedValue(undefined);
    resolveUserStateWithClient.mockResolvedValue({ state: 'waiting_match' });
    from.mockReset();
  });

  it('still redirects to the queue when attribution logging fails after the profile is created', async () => {
    persistAttributionForUser.mockRejectedValue(new Error('attribution offline'));

    await expect(
      createProfile({
        name: 'Ada',
        phone_number: '+55 11 99999-9999',
        linkedin_url: '',
        github_url: '',
        x_url: '',
        primary_role: 'Desenvolvimento de Software',
        secondary_roles: [],
        years_experience: 4,
        interests: ['DeFi'],
      }),
    ).rejects.toThrow('REDIRECT:/queue');

    expect(logError).toHaveBeenCalledWith(
      'profile.create.attribution_failed',
      expect.any(Error),
      { userId: 'user-1' },
    );
  });

  it('still redirects to the queue when analytics logging fails after the profile is created', async () => {
    trackEvent.mockRejectedValueOnce(new Error('analytics offline'));

    await expect(
      createProfile({
        name: 'Ada',
        phone_number: '+55 11 99999-9999',
        linkedin_url: '',
        github_url: '',
        x_url: '',
        primary_role: 'Desenvolvimento de Software',
        secondary_roles: [],
        years_experience: 4,
        interests: ['DeFi'],
      }),
    ).rejects.toThrow('REDIRECT:/queue');

    expect(logError).toHaveBeenCalledWith(
      'profile.create.track_failed',
      expect.any(Error),
      expect.objectContaining({ userId: 'user-1' }),
    );
  });
});

describe('updateProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
        },
      },
    });
    resolveUserStateWithClient.mockResolvedValue({ state: 'waiting_match' });
    rpc.mockResolvedValue({ data: { success: true }, error: null });
    trackEvent.mockResolvedValue(undefined);

    from.mockImplementation((table: string) => {
      if (table === 'profiles') {
        return {
          update: () => ({
            eq: async () => ({ error: null }),
          }),
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: { id: 'profile-1' },
                error: null,
              }),
            }),
          }),
        };
      }

      if (table === 'profile_roles' || table === 'profile_interests') {
        return {
          delete: () => ({
            eq: async () => ({ error: null }),
          }),
          insert: async () => ({ error: null }),
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });
  });

  it('uses a single RPC for atomic profile updates', async () => {
    await expect(
      updateProfile({
        name: 'Ada',
        phone_number: '+55 11 99999-9999',
        linkedin_url: '',
        github_url: '',
        x_url: '',
        primary_role: 'Desenvolvimento de Software',
        secondary_roles: ['Design'],
        years_experience: 4,
        interests: ['DeFi'],
      }, '/queue'),
    ).rejects.toThrow('REDIRECT:/queue');

    expect(rpc).toHaveBeenCalledWith(
      'update_profile_details',
      expect.objectContaining({
        p_name: 'Ada',
        p_phone_number: '+55 11 99999-9999',
        p_primary_role: 'Desenvolvimento de Software',
        p_years_experience: 4,
        p_secondary_roles: ['Design'],
        p_interests: ['DeFi'],
      }),
    );
  });
});
