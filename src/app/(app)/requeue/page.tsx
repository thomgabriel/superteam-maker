import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { resolveAuthenticatedUserState } from '@/lib/user-state';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RequeueButton } from './requeue-button';

export const dynamic = 'force-dynamic';

const REQUEUE_MESSAGES: Record<string, { title: string; description: string }> = {
  replaced: {
    title: 'Você foi substituído.',
    description: 'Como você não visitou a página do time a tempo, uma nova pessoa entrou no seu lugar.',
  },
  team_inactive: {
    title: 'Seu time foi desativado.',
    description: 'Ninguém assumiu a liderança a tempo e o time foi encerrado.',
  },
  generic: {
    title: 'Seu time não deu certo.',
    description: 'Mas você pode voltar para a fila e encontrar um novo grupo.',
  },
};

export default async function RequeuePage() {
  const resolvedState = await resolveAuthenticatedUserState();
  if (!resolvedState) redirect('/auth');
  if (resolvedState.state !== 'needs_requeue') {
    redirect(resolvedState.redirectPath);
  }

  const reason = resolvedState.requeueReason ?? 'generic';
  const message = REQUEUE_MESSAGES[reason] ?? REQUEUE_MESSAGES.generic;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_top,rgba(255,210,63,0.10),transparent_42%),linear-gradient(180deg,#1b231d_0%,#162018_50%,#1b231d_100%)]" />
        <Image src="/brand/elements/morth-05.svg" alt="" width={280} height={280} className="absolute -left-12 top-24 opacity-10" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center text-center">
        <Image src="/brand/logo/symbol.svg" alt="" width={48} height={48} className="opacity-80" />

        <Card className="mt-8 w-full rounded-[2rem] border-brand-yellow/22 bg-[linear-gradient(180deg,rgba(27,35,29,0.96),rgba(27,35,29,0.80))] p-7">
          <h1 className="font-heading text-3xl font-bold text-brand-off-white">
            {message.title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-brand-off-white/70">
            {message.description}
          </p>
          <p className="mt-2 text-sm leading-7 text-brand-off-white/70">
            Quer tentar de novo? Você pode voltar para a fila ou editar seu perfil antes.
          </p>

          <div className="mt-8 space-y-3">
            <RequeueButton />
            <Link href="/profile" className="block">
              <Button variant="accent" fullWidth>
                Editar perfil antes de voltar
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
