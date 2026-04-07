import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/admin';
import { AppHeader } from '@/components/ui/app-header';

export const dynamic = 'force-dynamic';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = isAdminUser(user);

  let teamId: string | null = null;
  let statusPath: string | null = null;
  if (user) {
    const db = await createServiceRoleClient();
    const [{ data: membership }, { data: pool }] = await Promise.all([
      db.from('team_members').select('team_id').eq('user_id', user.id).eq('status', 'active').maybeSingle(),
      db.from('matchmaking_pool').select('status').eq('user_id', user.id).maybeSingle(),
    ]);
    teamId = membership?.team_id ?? null;
    if (!teamId) {
      statusPath = pool?.status === 'waiting' ? '/queue' : '/profile';
    }
  }

  return (
    <>
      <AppHeader admin={admin} teamId={teamId} statusPath={statusPath} />
      {children}
    </>
  );
}
