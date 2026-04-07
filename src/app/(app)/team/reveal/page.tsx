import { redirect } from 'next/navigation';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { MemberCard } from '@/components/team/member-card';
import Image from 'next/image';
import Link from 'next/link';
import { TrackPageView } from '@/components/ui/track-event';
import { resolveAuthenticatedUserState } from '@/lib/user-state';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface RevealMember {
  id: string;
  is_leader: boolean;
  profiles: {
    name: string;
    primary_role: string;
    macro_role: string;
    seniority: string;
  };
}

export default async function TeamRevealPage() {
  const resolvedState = await resolveAuthenticatedUserState();
  if (!resolvedState) redirect('/auth');
  // Reveal page is accessible in both 'matched' and 'team_active' states
  if ((resolvedState.state !== 'matched' && resolvedState.state !== 'team_active') || !resolvedState.teamMember || !resolvedState.team) {
    redirect(resolvedState.redirectPath);
  }

  const db = await createServiceRoleClient();

  const { data: rawMembers } = await db
    .from('team_members')
    .select('*')
    .eq('team_id', resolvedState.team.id)
    .eq('status', 'active');

  const memberUserIds = (rawMembers ?? []).map((m) => m.user_id);
  const { data: profiles } = await db
    .from('profiles')
    .select('user_id, name, primary_role, macro_role, seniority')
    .in('user_id', memberUserIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]));
  const members = (rawMembers ?? []).map((m) => ({
    ...m,
    profiles: profileMap.get(m.user_id) ?? {
      name: 'Unknown',
      primary_role: m.specific_role,
      macro_role: m.macro_role,
      seniority: 'mid',
    },
  }));

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <TrackPageView event="team_reveal_viewed" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(255,210,63,0.14),transparent_42%),radial-gradient(circle_at_78%_20%,rgba(0,139,76,0.18),transparent_28%),linear-gradient(180deg,#1b231d_0%,#162018_46%,#1b231d_100%)]" />
        <Image src="/brand/elements/morth-27.svg" alt="" width={400} height={400} className="absolute -left-20 -top-20 opacity-14" />
        <Image src="/brand/elements/morth-01.svg" alt="" width={350} height={350} className="absolute -bottom-16 -right-16 opacity-14" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-yellow">
              Match confirmado
            </p>
            <Image src="/brand/logo/symbol-yellow.svg" alt="" width={56} height={56} className="mt-6" />
            <h1 className="mt-5 font-heading text-4xl font-bold leading-[0.96] tracking-tight text-brand-off-white sm:text-5xl lg:text-6xl">
              Você caiu em um
              <span className="block text-brand-yellow">time forte.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-brand-off-white/72 sm:text-lg">
              O grupo já está pronto para se organizar. Agora é abrir a
              conversa, alinhar a direção e começar a construir.
            </p>

            <Card className="mt-8 rounded-[1.75rem] border-brand-yellow/24 bg-brand-yellow/10 px-6 py-5">
              <p className="text-xs uppercase tracking-[0.16em] text-brand-yellow/82">
                Seu time
              </p>
              <p className="mt-3 font-heading text-3xl font-bold text-brand-yellow">
                {resolvedState.team.name}
              </p>
            </Card>

            {!resolvedState.team.leader_id && (
              <p className="mt-5 text-sm leading-7 text-brand-off-white/60">
                Ainda não existe líder definido. Qualquer membro pode assumir
                esse papel assim que entrar na tela do time.
              </p>
            )}

            <div className="mt-8">
              <Link href={`/team/${resolvedState.team.id}`} className="inline-flex w-full sm:w-auto">
                <Button variant="primary" size="lg" fullWidth>
                  Ver meu time
                </Button>
              </Link>
            </div>
          </div>

          <Card className="rounded-[2rem] border-brand-green/30 bg-[linear-gradient(180deg,rgba(27,35,29,0.96),rgba(27,35,29,0.74))] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-brand-off-white/42">
                  Membros confirmados
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-brand-off-white">
                  Quem vai construir com você
                </h2>
              </div>
              <span className="rounded-full border border-brand-emerald/24 bg-brand-emerald/12 px-3 py-1 text-xs uppercase tracking-[0.14em] text-brand-emerald">
                {members.length} membros
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {(members as RevealMember[] | null)?.map((member) => (
                <MemberCard
                  key={member.id}
                  name={member.profiles.name}
                  specificRole={member.profiles.primary_role}
                  macroRole={member.profiles.macro_role}
                  seniority={member.profiles.seniority}
                  isLeader={member.is_leader}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
