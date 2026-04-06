import { redirect } from 'next/navigation';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { ProfileForm } from '@/components/profile/profile-form';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  // Auth is enforced by middleware; getUser() here is only to obtain user.id.
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth');

  // Check if profile exists using service role (bypasses RLS)
  const db = await createServiceRoleClient();

  const { data: profile } = await db
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profile) {
    redirect('/fila');
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
