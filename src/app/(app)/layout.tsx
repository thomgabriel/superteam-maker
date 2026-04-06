import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/admin';
import Link from 'next/link';
import Image from 'next/image';

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
      <nav className="flex items-center justify-between px-4 py-3">
        <Link href="/">
          <Image
            src="/brand/logo/symbol.svg"
            alt="SuperTeamMaker"
            width={28}
            height={28}
          />
        </Link>
        <div className="flex items-center gap-4">
          {admin && (
            <Link
              href="/admin"
              className="rounded-md bg-brand-yellow/10 px-3 py-1 text-xs font-medium text-brand-yellow hover:bg-brand-yellow/20"
            >
              Admin
            </Link>
          )}
          <Link
            href="/ideias"
            className="text-xs text-brand-off-white/50 hover:text-brand-off-white/80"
          >
            Ideias
          </Link>
        </div>
      </nav>
      {children}
    </>
  );
}
