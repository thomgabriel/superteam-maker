import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { resolveAuthenticatedUserState } from '@/lib/user-state';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProfileEnhanceForm } from '@/components/profile/profile-enhance-form';
import type { ProfileEnhanceData } from '@/app/(app)/profile/actions';

export const dynamic = 'force-dynamic';

export default async function ProfileEnhancePage() {
  const resolvedState = await resolveAuthenticatedUserState();
  if (!resolvedState) redirect('/auth');

  // Only relevant while user is waiting for a match. If matched/active already, bounce.
  if (resolvedState.state !== 'waiting_match') {
    redirect(resolvedState.redirectPath);
  }

  const profile = resolvedState.profile;
  if (!profile) {
    redirect('/profile');
  }

  const supabase = await createServerSupabaseClient();
  const [{ data: roles }, { data: interests }] = await Promise.all([
    supabase.from('profile_roles').select('role').eq('profile_id', profile.id),
    supabase.from('profile_interests').select('interest').eq('profile_id', profile.id),
  ]);

  const initialData: ProfileEnhanceData = {
    phone_number: profile.phone_number ?? '',
    linkedin_url: profile.linkedin_url ?? '',
    github_url: profile.github_url ?? '',
    x_url: profile.x_url ?? '',
    secondary_roles: (roles ?? []).map((r) => r.role),
    interests: (interests ?? []).map((i) => i.interest),
  };

  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(0,139,76,0.16),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(255,210,63,0.10),transparent_28%)]" />
        <Image
          src="/brand/elements/morth-09.svg"
          alt=""
          width={220}
          height={220}
          className="absolute -right-10 top-12 opacity-12"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col justify-center">
        <div className="mb-5 flex flex-col items-center text-center">
          <Image src="/brand/logo/symbol.svg" alt="Superteam" width={52} height={52} />
          <p className="mt-5 text-sm uppercase tracking-[0.2em] text-brand-emerald/80">
            Etapa 2 de 2
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold">
            Melhore suas chances de match
          </h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-brand-off-white/60">
            Adicione seus interesses e redes para encontrar pessoas mais alinhadas. Você pode
            pular — o matching funciona mesmo assim — mas fica mais certeiro com essas
            informações.
          </p>
        </div>

        <Card className="rounded-[2rem] border-brand-green/30 bg-[linear-gradient(180deg,rgba(48,108,64,0.12),rgba(27,35,29,0.98))] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.22)] sm:p-7">
          <ProfileEnhanceForm initialData={initialData} />
        </Card>
      </div>
    </main>
  );
}
