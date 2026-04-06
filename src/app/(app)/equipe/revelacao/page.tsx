import { redirect } from 'next/navigation';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { MemberCard } from '@/components/team/member-card';
import Image from 'next/image';
import Link from 'next/link';
import { TrackPageView } from '@/components/ui/track-event';
import { resolveAuthenticatedUserState } from '@/lib/user-state';

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
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <TrackPageView event="team_reveal_viewed" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-15">
        <Image src="/brand/elements/morth-27.svg" alt="" width={400} height={400} className="absolute -left-20 -top-20" />
        <Image src="/brand/elements/morth-01.svg" alt="" width={350} height={350} className="absolute -bottom-16 -right-16" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <Image src="/brand/logo/symbol-yellow.svg" alt="" width={56} height={56} className="mx-auto" />
        <h1 className="mt-4 font-heading text-3xl font-bold text-brand-yellow">Você tem um time!</h1>
        <p className="mt-6 rounded-lg border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-3 font-heading text-xl font-semibold">{resolvedState.team.name}</p>

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

        {!resolvedState.team.leader_id && (
          <p className="mt-4 text-sm text-brand-off-white/50">Nenhum líder ainda — qualquer membro pode assumir!</p>
        )}

        <Link href={`/equipe/${resolvedState.team.id}`}
          className="mt-8 inline-flex w-full justify-center rounded-lg bg-brand-emerald px-6 py-4 font-heading text-lg font-semibold text-brand-off-white transition-opacity hover:opacity-90">
          Ver meu time
        </Link>
      </div>
    </main>
  );
}
