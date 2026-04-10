'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/(app)/actions';

interface AppHeaderProps {
  admin: boolean;
  teamId: string | null;
  statusPath: string | null;
}

function getLinkClassName(active: boolean, tone: 'default' | 'admin' = 'default') {
  if (tone === 'admin') {
    return active
      ? 'rounded-full border border-brand-yellow/30 bg-brand-yellow/16 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-yellow'
      : 'rounded-full border border-brand-yellow/18 bg-brand-yellow/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-yellow/82 transition-colors hover:bg-brand-yellow/14';
  }

  return active
    ? 'rounded-full border border-brand-emerald/35 bg-brand-emerald/16 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-off-white'
    : 'rounded-full border border-brand-green/25 bg-brand-dark-green/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-off-white/62 transition-colors hover:border-brand-green hover:text-brand-off-white';
}

export function AppHeader({ admin, teamId, statusPath }: AppHeaderProps) {
  const pathname = usePathname();
  const teamActive = pathname.startsWith('/team');
  const queueActive = pathname.startsWith('/queue');
  const profileActive = pathname.startsWith('/profile');
  const ideasActive = pathname.startsWith('/ideas');
  const supportActive = pathname.startsWith('/support');
  const adminActive = pathname.startsWith('/admin');

  return (
    <nav className="sticky top-0 z-30 border-b border-brand-green/15 bg-brand-dark-green/78 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="transition-opacity hover:opacity-85">
          <Image
            src="/brand/logo/symbol.svg"
            alt="SuperteamMaker"
            width={30}
            height={30}
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {teamId ? (
            <Link href={`/team/${teamId}`} className={getLinkClassName(teamActive)}>
              Time
            </Link>
          ) : statusPath === '/queue' ? (
            <Link href="/queue" className={getLinkClassName(queueActive)}>
              Fila
            </Link>
          ) : statusPath === '/profile' ? (
            <Link href="/profile" className={getLinkClassName(profileActive)}>
              Perfil
            </Link>
          ) : null}
          <Link href="/ideas" className={getLinkClassName(ideasActive)}>
            Ideias
          </Link>
          <Link href="/support" className={getLinkClassName(supportActive)}>
            Suporte
          </Link>
          {admin && (
            <Link href="/admin" className={getLinkClassName(adminActive, 'admin')}>
              Admin
            </Link>
          )}
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-full border border-brand-green/25 bg-brand-dark-green/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-off-white/62 transition-colors hover:border-brand-green hover:text-brand-off-white"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
