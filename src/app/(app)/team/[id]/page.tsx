import { redirect } from 'next/navigation';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { MemberCard } from '@/components/team/member-card';
import { ClaimLeaderButton } from '@/components/team/claim-leader-button';
import { LeaderPanel } from '@/components/team/leader-panel';
import { RequestMemberButton } from '@/components/team/request-member-button';
import Image from 'next/image';
import type { Team } from '@/types/database';
import { resolveAuthenticatedUserState } from '@/lib/user-state';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

interface TeamPageMember {
  id: string;
  is_leader: boolean;
  profiles: {
    name: string;
    phone_number?: string;
    linkedin_url?: string | null;
    github_url?: string | null;
    x_url?: string | null;
    primary_role: string;
    macro_role: string;
    seniority: string;
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: teamId } = await params;
  const resolvedState = await resolveAuthenticatedUserState();
  if (!resolvedState) redirect('/auth');
  // Team page is accessible in both 'matched' (pending_activation) and 'team_active' states
  if ((resolvedState.state !== 'matched' && resolvedState.state !== 'team_active') || !resolvedState.team || !resolvedState.teamMember) {
    redirect(resolvedState.redirectPath);
  }
  if (resolvedState.team.id !== teamId) {
    redirect(resolvedState.redirectPath);
  }

  const db = await createServiceRoleClient();

  // Mark member as active (visited team page)
  await db
    .from('team_members')
    .update({ last_active_at: new Date().toISOString() })
    .eq('team_id', teamId)
    .eq('user_id', resolvedState.userId)
    .eq('status', 'active');

  // Fetch members and profiles separately — the join via user_id doesn't resolve
  // through Supabase's relation inference (team_members.user_id → users, not profiles)
  const { data: rawMembers } = await db
    .from('team_members')
    .select('*')
    .eq('team_id', teamId)
    .eq('status', 'active');

  const memberUserIds = (rawMembers ?? []).map((m) => m.user_id);
  let profiles:
    | Array<{
        user_id: string;
        name: string;
        phone_number?: string | null;
        linkedin_url?: string | null;
        github_url?: string | null;
        x_url?: string | null;
        primary_role: string;
        macro_role: string;
        seniority: string;
      }>
    | null = null;

  const profilesWithSocials = await db
    .from('profiles')
    .select('user_id, name, phone_number, linkedin_url, github_url, x_url, primary_role, macro_role, seniority')
    .in('user_id', memberUserIds);

  if (profilesWithSocials.error) {
    const profilesWithoutSocials = await db
      .from('profiles')
      .select('user_id, name, phone_number, primary_role, macro_role, seniority')
      .in('user_id', memberUserIds);

    profiles = (profilesWithoutSocials.data ?? []).map((profile) => ({
      ...profile,
      linkedin_url: null,
      github_url: null,
      x_url: null,
    }));
  } else {
    profiles = profilesWithSocials.data;
  }

  const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]));
  const members = (rawMembers ?? []).map((m) => ({
    ...m,
    profiles: profileMap.get(m.user_id) ?? {
      name: 'Unknown',
      phone_number: null,
      linkedin_url: null,
      github_url: null,
      x_url: null,
      primary_role: m.specific_role,
      macro_role: m.macro_role,
      seniority: 'mid',
    },
  }));

  const isLeader = resolvedState.team.leader_id === resolvedState.userId;
  const hasLeader = !!resolvedState.team.leader_id;

  const STATUS_LABELS: Record<string, string> = {
    forming: 'Preparando',
    pending_activation: 'Primeiros passos',
    active: 'Ativo',
    inactive: 'Inativo',
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_top,rgba(0,139,76,0.18),transparent_42%),radial-gradient(circle_at_80%_18%,rgba(255,210,63,0.10),transparent_26%),linear-gradient(180deg,#1b231d_0%,#162018_50%,#1b231d_100%)]" />
        <Image src="/brand/elements/morth-05.svg" alt="" width={320} height={320} className="absolute -left-12 top-24 opacity-12" />
        <Image src="/brand/elements/morth-14.svg" alt="" width={220} height={220} className="absolute bottom-8 right-6 opacity-10" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl space-y-8">
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <Card className="rounded-[2rem] border-brand-green/30 bg-[linear-gradient(180deg,rgba(27,35,29,0.96),rgba(27,35,29,0.72))] p-6 sm:p-7">
            <Image src="/brand/logo/symbol.svg" alt="" width={42} height={42} className="opacity-90" />
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-brand-emerald/22 bg-brand-emerald/12 px-3 py-1 text-xs uppercase tracking-[0.16em] text-brand-emerald">
                {STATUS_LABELS[resolvedState.team.status] ?? resolvedState.team.status}
              </span>
              <span className="rounded-full border border-brand-green/24 bg-brand-green/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-brand-off-white/62">
                {members.length} membros
              </span>
            </div>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-[0.96] tracking-tight text-brand-off-white sm:text-5xl">
              {resolvedState.team.name}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-brand-off-white/70">
              Aqui o time se organiza, define a ideia e começa a construir.
            </p>
          </Card>

          <Card className="rounded-[2rem] border-brand-yellow/22 bg-[linear-gradient(135deg,rgba(255,210,63,0.08),rgba(27,35,29,0.96))] p-6 sm:p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-brand-yellow/82">
              Ideia do time
            </p>
            {resolvedState.team.idea_title ? (
              <>
                <h2 className="mt-4 font-heading text-2xl font-semibold text-brand-off-white">
                  {resolvedState.team.idea_title}
                </h2>
                {resolvedState.team.idea_description && (
                  <p className="mt-3 text-sm leading-7 text-brand-off-white/72">
                    {resolvedState.team.idea_description}
                  </p>
                )}
                {resolvedState.team.project_category && (
                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-brand-yellow/76">
                    Categoria: {resolvedState.team.project_category}
                  </p>
                )}
              </>
            ) : (
              <>
                <h2 className="mt-4 font-heading text-2xl font-semibold text-brand-off-white">
                  A ideia ainda não foi definida.
                </h2>
                <p className="mt-3 text-sm leading-7 text-brand-off-white/70">
                  Usem esse momento para alinhar o problema e definir o que
                  vão construir.
                </p>
              </>
            )}
          </Card>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-brand-off-white/42">
                Time
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold text-brand-off-white">
                Quem está no time
              </h2>
            </div>

            <div className="grid gap-3">
              {(members as TeamPageMember[] | null)?.map((member) => (
                <MemberCard
                  key={member.id}
                  name={member.profiles.name}
                  specificRole={member.profiles.primary_role}
                  macroRole={member.profiles.macro_role}
                  seniority={member.profiles.seniority}
                  isLeader={member.is_leader}
                  phoneNumber={member.profiles.phone_number}
                  linkedinUrl={member.profiles.linkedin_url}
                  githubUrl={member.profiles.github_url}
                  xUrl={member.profiles.x_url}
                  showPhone
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {!hasLeader && <ClaimLeaderButton teamId={teamId} />}
            {isLeader && <LeaderPanel team={resolvedState.team as Team} />}
            {isLeader && members.length === 3 && <RequestMemberButton teamId={teamId} />}

            {!isLeader && resolvedState.team.idea_title && (
              <Card className="rounded-[1.75rem] border-brand-green/24 bg-brand-dark-green/72 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-brand-off-white/42">
                  Direção atual
                </p>
                <h3 className="mt-3 font-heading text-2xl font-semibold text-brand-off-white">
                  {resolvedState.team.idea_title}
                </h3>
                {resolvedState.team.idea_description && (
                  <p className="mt-3 text-sm leading-7 text-brand-off-white/70">
                    {resolvedState.team.idea_description}
                  </p>
                )}
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
