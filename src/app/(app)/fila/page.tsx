import { redirect } from 'next/navigation';
import { QueueStatus } from '@/components/queue/queue-status';
import Image from 'next/image';
import { resolveAuthenticatedUserState } from '@/lib/user-state';

export const dynamic = 'force-dynamic';

export default async function QueuePage() {
  const resolvedState = await resolveAuthenticatedUserState();
  if (!resolvedState) redirect('/auth');
  if (resolvedState.state !== 'waiting_match') {
    redirect(resolvedState.redirectPath);
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

      <QueueStatus userId={resolvedState.userId} />
    </main>
  );
}
