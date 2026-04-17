// Magic-token landing page (GET). Public route — gated only by signature +
// nonce validity. GET never mutates state so email-scanner prefetches can't
// accidentally confirm. Buttons POST to server actions in ./actions.ts.

import Link from 'next/link';
import Image from 'next/image';
import { createServiceRoleClient } from '@/lib/supabase/server';
import {
  ConfirmationTokenError,
  peekConfirmationToken,
  verifyConfirmationToken,
} from '@/lib/tokens';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { confirmViaToken, declineViaToken } from './actions';

export const dynamic = 'force-dynamic';

interface SearchParams {
  t?: string;
  state?: string;
}

interface TeamPreview {
  id: string;
  name: string;
  status: string;
  confirmation_deadline_at: string | null;
}

interface MemberPreview {
  user_id: string;
  name: string;
  primary_role: string;
  macro_role: string;
}

async function loadTeamPreview(teamId: string): Promise<{
  team: TeamPreview | null;
  members: MemberPreview[];
}> {
  const db = await createServiceRoleClient();
  const [teamResult, membersResult] = await Promise.all([
    db
      .from('teams')
      .select('id, name, status, confirmation_deadline_at')
      .eq('id', teamId)
      .maybeSingle(),
    db
      .from('team_members')
      .select('user_id, profiles:user_id (name, primary_role, macro_role)')
      .eq('team_id', teamId)
      .eq('status', 'active'),
  ]);

  const team = (teamResult.data ?? null) as TeamPreview | null;
  const members: MemberPreview[] = ((membersResult.data ?? []) as Array<{
    user_id: string;
    profiles:
      | { name: string; primary_role: string; macro_role: string }
      | Array<{ name: string; primary_role: string; macro_role: string }>
      | null;
  }>).map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      user_id: row.user_id,
      name: profile?.name ?? 'Membro',
      primary_role: profile?.primary_role ?? '',
      macro_role: profile?.macro_role ?? '',
    };
  });

  return { team, members };
}

const STATE_MESSAGES: Record<string, { title: string; body: string }> = {
  malformed: {
    title: 'Link inválido',
    body: 'Esse link parece estar quebrado. Entre na plataforma para ver o status do seu time.',
  },
  bad_signature: {
    title: 'Link inválido',
    body: 'Não foi possível validar esse link. Entre na plataforma para continuar.',
  },
  bad_version: {
    title: 'Link antigo',
    body: 'Esse link é de uma versão anterior. Peça um novo ou entre na plataforma.',
  },
  invalid_payload: {
    title: 'Link inválido',
    body: 'Não conseguimos ler esse link. Entre na plataforma para continuar.',
  },
  expired: {
    title: 'Link expirou',
    body: 'Esse link já passou da validade. Entre na plataforma para ver o status do seu time.',
  },
  already_used: {
    title: 'Link já utilizado',
    body: 'Esse link só pode ser usado uma vez. Entre na plataforma para ver sua decisão e o status do time.',
  },
  team_not_found: {
    title: 'Time não encontrado',
    body: 'Esse time não existe mais. Entre na plataforma para entrar em outra fila.',
  },
  invalid_state: {
    title: 'Confirmação encerrada',
    body: 'A fase de confirmação desse time já terminou. Entre na plataforma para ver o status atual.',
  },
  deadline_passed: {
    title: 'Prazo encerrado',
    body: 'O prazo para confirmar esse time passou. Entre na plataforma para buscar outro time.',
  },
  not_member: {
    title: 'Você não faz mais parte desse time',
    body: 'Não identificamos sua presença nesse time. Entre na plataforma para continuar.',
  },
  action_mismatch: {
    title: 'Link inválido para essa ação',
    body: 'Esse link não corresponde à ação solicitada. Entre na plataforma para tentar novamente.',
  },
  write_failed: {
    title: 'Algo deu errado',
    body: 'Não conseguimos registrar sua decisão. Entre na plataforma para tentar pelo app.',
  },
  rate_limited: {
    title: 'Muitas tentativas',
    body: 'Você tentou muitas vezes em pouco tempo. Espere alguns minutos e tente novamente pela plataforma.',
  },
};

function ErrorState({ state }: { state: string }) {
  const content = STATE_MESSAGES[state] ?? {
    title: 'Link inválido',
    body: 'Entre na plataforma para continuar.',
  };

  return (
    <Card className="rounded-[1.75rem] border-brand-yellow/28 bg-[linear-gradient(135deg,rgba(255,210,63,0.12),rgba(27,35,29,0.94))] p-6 sm:p-7">
      <p className="text-xs uppercase tracking-[0.18em] text-brand-yellow/82">
        Confirmação
      </p>
      <h1 className="mt-4 font-heading text-3xl font-semibold text-brand-off-white">
        {content.title}
      </h1>
      <p className="mt-3 text-sm leading-7 text-brand-off-white/72">
        {content.body}
      </p>
      <div className="mt-5">
        <Link
          href="/auth"
          className="inline-flex items-center justify-center rounded-lg bg-brand-emerald px-5 py-3 text-sm font-semibold text-brand-off-white transition-opacity hover:opacity-90"
        >
          Entrar na plataforma
        </Link>
      </div>
    </Card>
  );
}

export default async function ConfirmTokenPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { t: token, state } = await searchParams;

  // POST actions redirect to /team/confirm/status?state=... on errors; reuse
  // the same page component so we keep a single entry point.
  if (state) {
    return (
      <main className="relative min-h-screen overflow-hidden px-4 py-16 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,139,76,0.18),transparent_42%),linear-gradient(180deg,#1b231d_0%,#162018_50%,#1b231d_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <ErrorState state={state} />
        </div>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="relative min-h-screen overflow-hidden px-4 py-16 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,139,76,0.18),transparent_42%),linear-gradient(180deg,#1b231d_0%,#162018_50%,#1b231d_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <ErrorState state="malformed" />
        </div>
      </main>
    );
  }

  // Signature + expiry check — no mutation.
  let payload;
  try {
    payload = verifyConfirmationToken(token);
  } catch (error) {
    const code =
      error instanceof ConfirmationTokenError ? error.code : 'malformed';
    return (
      <main className="relative min-h-screen overflow-hidden px-4 py-16 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,139,76,0.18),transparent_42%),linear-gradient(180deg,#1b231d_0%,#162018_50%,#1b231d_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <ErrorState state={code} />
        </div>
      </main>
    );
  }

  // Read-only nonce check — we DO NOT consume here.
  const nonceRow = await peekConfirmationToken(payload.nonce);
  if (!nonceRow) {
    return (
      <main className="relative min-h-screen overflow-hidden px-4 py-16 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,139,76,0.18),transparent_42%),linear-gradient(180deg,#1b231d_0%,#162018_50%,#1b231d_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <ErrorState state="malformed" />
        </div>
      </main>
    );
  }
  if (nonceRow.consumed_at) {
    return (
      <main className="relative min-h-screen overflow-hidden px-4 py-16 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,139,76,0.18),transparent_42%),linear-gradient(180deg,#1b231d_0%,#162018_50%,#1b231d_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <ErrorState state="already_used" />
        </div>
      </main>
    );
  }

  const { team, members } = await loadTeamPreview(payload.tid);
  if (!team) {
    return (
      <main className="relative min-h-screen overflow-hidden px-4 py-16 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,139,76,0.18),transparent_42%),linear-gradient(180deg,#1b231d_0%,#162018_50%,#1b231d_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <ErrorState state="team_not_found" />
        </div>
      </main>
    );
  }

  if (team.status !== 'pending_confirmation') {
    return (
      <main className="relative min-h-screen overflow-hidden px-4 py-16 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,139,76,0.18),transparent_42%),linear-gradient(180deg,#1b231d_0%,#162018_50%,#1b231d_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <ErrorState state="invalid_state" />
        </div>
      </main>
    );
  }

  if (
    team.confirmation_deadline_at &&
    new Date(team.confirmation_deadline_at) < new Date()
  ) {
    return (
      <main className="relative min-h-screen overflow-hidden px-4 py-16 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,139,76,0.18),transparent_42%),linear-gradient(180deg,#1b231d_0%,#162018_50%,#1b231d_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <ErrorState state="deadline_passed" />
        </div>
      </main>
    );
  }

  async function handleConfirm() {
    'use server';
    await confirmViaToken(token!);
  }

  async function handleDecline(formData: FormData) {
    'use server';
    const reason = formData.get('reason');
    await declineViaToken(token!, typeof reason === 'string' ? reason : null);
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-12 sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_top,rgba(0,139,76,0.18),transparent_42%),radial-gradient(circle_at_80%_18%,rgba(255,210,63,0.10),transparent_26%),linear-gradient(180deg,#1b231d_0%,#162018_50%,#1b231d_100%)]" />
        <Image
          src="/brand/elements/morth-05.svg"
          alt=""
          width={320}
          height={320}
          className="absolute -left-12 top-24 opacity-12"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl space-y-6">
        <Card className="rounded-[2rem] border-brand-emerald/30 bg-[linear-gradient(180deg,rgba(0,139,76,0.14),rgba(27,35,29,0.92))] p-6 sm:p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-emerald/82">
            Seu time foi formado
          </p>
          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-brand-off-white sm:text-4xl">
            {team.name}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-off-white/72">
            Você foi sugerido(a) para este time. Confirme seu lugar para que a
            gente possa abrir a próxima etapa assim que 3 membros confirmarem.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {members.map((m) => (
              <div
                key={m.user_id}
                className="rounded-[1.25rem] border border-brand-green/24 bg-brand-dark-green/70 px-4 py-3"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
                  Membro
                </p>
                <p className="mt-2 font-heading text-lg font-semibold text-brand-off-white">
                  {m.name}
                </p>
                <p className="mt-1 text-sm text-brand-off-white/62">
                  {m.primary_role}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[1.75rem] border-brand-green/28 bg-brand-dark-green/82 p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-emerald/82">
            Sua decisão
          </p>
          <h2 className="mt-3 font-heading text-2xl font-semibold text-brand-off-white">
            Quer seguir com esse time?
          </h2>
          <p className="mt-3 text-sm leading-7 text-brand-off-white/72">
            Confirme se o perfil, a combinação de papéis e o momento fazem
            sentido para você. Se preferir, você pode recusar e entrar na fila
            de novo.
          </p>

          <form action={handleConfirm} className="mt-5">
            <Button type="submit" variant="primary" size="lg" fullWidth>
              Confirmar meu lugar
            </Button>
          </form>

          <form action={handleDecline} className="mt-4 space-y-3">
            <label
              htmlFor="reason"
              className="text-xs uppercase tracking-[0.18em] text-brand-off-white/54"
            >
              Motivo (opcional)
            </label>
            <select
              id="reason"
              name="reason"
              defaultValue="not_aligned"
              className="w-full rounded-lg border border-brand-green/30 bg-brand-dark-green/70 px-3 py-2 text-sm text-brand-off-white focus:border-brand-emerald focus:outline-none"
            >
              <option value="Não combina com meu objetivo">
                Não combina com meu objetivo
              </option>
              <option value="Problema de fuso horário">
                Problema de fuso horário
              </option>
              <option value="Não senti conexão">Não senti conexão</option>
              <option value="Outro">Outro</option>
            </select>
            <Button type="submit" variant="accent" fullWidth>
              Prefiro tentar outro time
            </Button>
          </form>

          <p className="mt-4 text-xs text-brand-off-white/42">
            O link só pode ser usado uma vez. Após decidir, você pode
            acompanhar o status do time diretamente na plataforma.
          </p>
        </Card>
      </div>
    </main>
  );
}
