import { redirect } from 'next/navigation';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { MemberCard } from '@/components/team/member-card';
import { ClaimLeaderButton } from '@/components/team/claim-leader-button';
import { LeaderPanel } from '@/components/team/leader-panel';
import Image from 'next/image';
import type { Team } from '@/types/database';
import { resolveAuthenticatedUserState } from '@/lib/user-state';

export const dynamic = 'force-dynamic';

interface TeamPageMember {
  id: string;
  is_leader: boolean;
  profiles: {
    name: string;
    phone_number?: string;
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

  // Fetch members and profiles separately — the join via user_id doesn't resolve
  // through Supabase's relation inference (team_members.user_id → users, not profiles)
  const { data: rawMembers } = await db
    .from('team_members')
    .select('*')
    .eq('team_id', teamId)
    .eq('status', 'active');

  const memberUserIds = (rawMembers ?? []).map((m) => m.user_id);
  const { data: profiles } = await db
    .from('profiles')
    .select('user_id, name, phone_number, primary_role, macro_role, seniority')
    .in('user_id', memberUserIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]));
  const members = (rawMembers ?? []).map((m) => ({
    ...m,
    profiles: profileMap.get(m.user_id) ?? {
      name: 'Unknown',
      phone_number: null,
      primary_role: m.specific_role,
      macro_role: m.macro_role,
      seniority: 'mid',
    },
  }));

  const isLeader = resolvedState.team.leader_id === resolvedState.userId;
  const hasLeader = !!resolvedState.team.leader_id;

  const STATUS_LABELS: Record<string, string> = {
    forming: 'Formando',
    pending_activation: 'Aguardando ativação',
    active: 'Ativo',
    inactive: 'Inativo',
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Image src="/brand/logo/symbol.svg" alt="" width={40} height={40} className="mx-auto" />
          <h1 className="mt-3 font-heading text-2xl font-bold">{resolvedState.team.name}</h1>
          <span className="mt-1 inline-block rounded-full bg-brand-green/20 px-3 py-0.5 text-xs text-brand-off-white/60">
            {STATUS_LABELS[resolvedState.team.status] ?? resolvedState.team.status}
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="font-heading text-sm font-semibold text-brand-off-white/60">Membros</h2>
          {(members as TeamPageMember[] | null)?.map((member) => (
            <MemberCard key={member.id}
              name={member.profiles.name}
              specificRole={member.profiles.primary_role}
              macroRole={member.profiles.macro_role}
              seniority={member.profiles.seniority}
              isLeader={member.is_leader}
              phoneNumber={member.profiles.phone_number}
              showPhone />
          ))}
        </div>

        {!hasLeader && <ClaimLeaderButton teamId={teamId} />}
        {isLeader && <LeaderPanel team={resolvedState.team as Team} />}

        {resolvedState.team.idea_title && !isLeader && (
          <div className="rounded-lg border border-brand-green/30 p-4">
            <h3 className="font-heading text-sm font-semibold text-brand-off-white/60">Ideia do projeto</h3>
            <p className="mt-1 font-heading font-semibold">{resolvedState.team.idea_title}</p>
            {resolvedState.team.idea_description && <p className="mt-1 text-sm text-brand-off-white/70">{resolvedState.team.idea_description}</p>}
          </div>
        )}
      </div>
    </main>
  );
}
