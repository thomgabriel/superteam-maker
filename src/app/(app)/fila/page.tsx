import { redirect } from 'next/navigation';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { QueueStatus } from '@/components/queue/queue-status';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function QueuePage() {
  // Auth is enforced by middleware; getUser() here is only to obtain user.id.
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth');

  // All DB queries use service role (bypasses RLS, works regardless of anon key format)
  const db = await createServiceRoleClient();

  // Must have a profile to be in the queue
  const { data: profile } = await db
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile) {
    redirect('/perfil');
  }

  // Check if already on a team
  const { data: teamMember } = await db
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (teamMember) {
    redirect(`/equipe/${teamMember.team_id}`);
  }

  // Check if assigned (but no team member yet — edge case)
  const { data: poolEntry } = await db
    .from('matchmaking_pool')
    .select('status')
    .eq('user_id', user.id)
    .maybeSingle();

  if (poolEntry?.status === 'assigned') {
    redirect('/equipe/revelacao');
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-5">
        <Image
          src="/brand/elements/morth-09.svg"
          alt=""
          width={300}
          height={300}
          className="absolute -right-10 top-1/4"
        />
      </div>

      <QueueStatus userId={user.id} />
    </main>
  );
}
