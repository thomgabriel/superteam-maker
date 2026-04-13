import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { persistAttributionForUser } from '@/lib/attribution';
import { trackEvent } from '@/lib/analytics.server';
import { resolveUserStateWithClient } from '@/lib/user-state';
import { logError } from '@/lib/monitoring';
import { getSafeRedirectPath } from '@/lib/security';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          },
        },
      },
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await persistAttributionForUser(user.id);
        await trackEvent({
          event: 'signup_completed',
          userId: user.id,
          route: '/auth/callback',
        });

        // Reuse the same client that exchanged the auth code so state resolution
        // sees the in-memory session created in this request.
        const resolvedState = await resolveUserStateWithClient(user.id, supabase);
        return NextResponse.redirect(
          `${origin}${getSafeRedirectPath(next, resolvedState.redirectPath)}`,
        );
      }

      return NextResponse.redirect(
        `${origin}${getSafeRedirectPath(next, '/profile')}`,
      );
    }

    logError('auth_callback.exchange_failed', exchangeError);
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
}
