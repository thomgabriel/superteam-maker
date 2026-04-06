import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/profile/profile-form';
import Image from 'next/image';
import { resolveAuthenticatedUserState } from '@/lib/user-state';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const resolvedState = await resolveAuthenticatedUserState();
  if (!resolvedState) redirect('/auth');
  if (resolvedState.state !== 'needs_profile') {
    redirect(resolvedState.redirectPath);
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/brand/logo/symbol.svg"
            alt="Superteam"
            width={48}
            height={48}
          />
          <h1 className="mt-4 font-heading text-2xl font-bold">
            Crie seu perfil
          </h1>
          <p className="mt-1 text-sm text-brand-off-white/60">
            Leva menos de 1 minuto
          </p>
        </div>

        <ProfileForm />
      </div>
    </main>
  );
}
