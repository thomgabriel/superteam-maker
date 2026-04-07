import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/auth/auth-form';
import { resolveAuthenticatedUserState } from '@/lib/user-state';

export const dynamic = 'force-dynamic';

export default async function AuthPage() {
  const resolvedState = await resolveAuthenticatedUserState();
  if (resolvedState) redirect(resolvedState.redirectPath);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(255,210,63,0.12),transparent_42%),radial-gradient(circle_at_18%_22%,rgba(0,139,76,0.18),transparent_28%),linear-gradient(180deg,#1b231d_0%,#162018_48%,#1b231d_100%)]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/elements/morth-05.svg"
          alt=""
          className="absolute -left-10 top-24 opacity-12"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/elements/morth-21.svg"
          alt=""
          className="absolute right-[-2rem] top-10 opacity-12"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <AuthForm />
      </div>
    </main>
  );
}
