import { redirect } from 'next/navigation';
import Image from 'next/image';
import { ProfileForm } from '@/components/profile/profile-form';
import { Card } from '@/components/ui/card';
import { resolveAuthenticatedUserState } from '@/lib/user-state';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const resolvedState = await resolveAuthenticatedUserState();
  if (!resolvedState) redirect('/auth');
  if (resolvedState.state !== 'needs_profile') {
    redirect(resolvedState.redirectPath);
  }

  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(255,210,63,0.12),transparent_42%),radial-gradient(circle_at_15%_25%,rgba(0,139,76,0.16),transparent_28%)]" />
        <Image
          src="/brand/elements/morth-14.svg"
          alt=""
          width={180}
          height={180}
          className="absolute -left-8 top-16 opacity-12"
        />
        <Image
          src="/brand/elements/morth-05.svg"
          alt=""
          width={220}
          height={220}
          className="absolute right-[-3rem] top-10 opacity-12"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col justify-center">
        <div className="mb-5 flex flex-col items-center text-center">
          <Image
            src="/brand/logo/symbol.svg"
            alt="Superteam"
            width={52}
            height={52}
          />
          <p className="mt-5 text-sm uppercase tracking-[0.2em] text-brand-emerald/80">
            Etapa 1
          </p>
        </div>

        <Card className="rounded-[2rem] border-brand-green/30 bg-[linear-gradient(180deg,rgba(48,108,64,0.12),rgba(27,35,29,0.98))] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.22)] sm:p-7">
          <ProfileForm />
        </Card>
      </div>
    </main>
  );
}
