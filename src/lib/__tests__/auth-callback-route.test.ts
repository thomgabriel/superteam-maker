import { beforeEach, describe, expect, it, vi } from 'vitest';

const cookieStore = {
  getAll: vi.fn(() => []),
  set: vi.fn(),
};

const exchangeCodeForSession = vi.fn();
const getUser = vi.fn();
const createServerClient = vi.fn();
const resolveUserStateWithClient = vi.fn();
const persistAttributionForUser = vi.fn();
const trackEvent = vi.fn();
const getSafeRedirectPath = vi.fn();
const redirect = vi.fn((url: string) => ({ url }));

vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
}));

vi.mock('@supabase/ssr', () => ({
  createServerClient,
}));

vi.mock('next/server', () => ({
  NextResponse: {
    redirect,
  },
}));

vi.mock('@/lib/user-state', () => ({
  resolveUserStateWithClient,
}));

vi.mock('@/lib/attribution', () => ({
  persistAttributionForUser,
}));

vi.mock('@/lib/analytics.server', () => ({
  trackEvent,
}));

vi.mock('@/lib/monitoring', () => ({
  logError: vi.fn(),
}));

vi.mock('@/lib/security', () => ({
  getSafeRedirectPath,
}));

const mockedSupabaseClient = {
  auth: {
    exchangeCodeForSession,
    getUser,
  },
};

const { GET } = await import('@/app/auth/callback/route');

describe('auth callback route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createServerClient.mockReturnValue(mockedSupabaseClient);
    exchangeCodeForSession.mockResolvedValue({ error: null });
    getUser.mockResolvedValue({
      data: {
        user: { id: 'user-1' },
      },
    });
    resolveUserStateWithClient.mockResolvedValue({
      redirectPath: '/requeue',
    });
    persistAttributionForUser.mockResolvedValue(undefined);
    trackEvent.mockResolvedValue(undefined);
    getSafeRedirectPath.mockImplementation((_next: string | null, fallback: string) => fallback);
  });

  it('resolves state using the same Supabase client that exchanged the auth code', async () => {
    await GET(new Request('https://example.com/auth/callback?code=test-code'));

    expect(resolveUserStateWithClient).toHaveBeenCalledWith('user-1', mockedSupabaseClient);
  });
});
