import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/admin';
import { AppHeader } from '@/components/ui/app-header';
import { resolveUserStateWithClient } from '@/lib/user-state';

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
    const resolvedState = await resolveUserStateWithClient(user.id, supabase);
    teamId = resolvedState.team?.id ?? null;
    if (!teamId) {
      statusPath = resolvedState.redirectPath;
    }
  }

  return (
    <>
      <AppHeader admin={admin} teamId={teamId} statusPath={statusPath} showProfileLink={statusPath === '/queue'} />
      {children}
    </>
  );
}
