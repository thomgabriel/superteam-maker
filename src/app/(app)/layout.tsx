import { createServerSupabaseClient } from '@/lib/supabase/server';
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

  return (
    <>
      <AppHeader admin={admin} />
      {children}
    </>
  );
}
