import { redirect } from 'next/navigation';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { MemberCard } from '@/components/team/member-card';
import { ClaimLeaderButton } from '@/components/team/claim-leader-button';
import { LeaderPanel } from '@/components/team/leader-panel';
import Image from 'next/image';
import type { Team } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: teamId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const db = await createServiceRoleClient();

  const { data: membership } = await db
    .from('team_members')
    .select('*')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  if (!membership) redirect('/fila');

  const { data: team } = await db.from('teams').select('*').eq('id', teamId).single();
  if (!team) redirect('/fila');

  const { data: members } = await db
    .from('team_members')
    .select(`*, profiles:user_id (name, phone_number, primary_role, macro_role, seniority)`)
    .eq('team_id', teamId)
    .eq('status', 'active');

  const isLeader = team.leader_id === user.id;
  const hasLeader = !!team.leader_id;

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
          <h1 className="mt-3 font-heading text-2xl font-bold">{team.name}</h1>
          <span className="mt-1 inline-block rounded-full bg-brand-green/20 px-3 py-0.5 text-xs text-brand-off-white/60">
            {STATUS_LABELS[team.status] ?? team.status}
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="font-heading text-sm font-semibold text-brand-off-white/60">Membros</h2>
          {members?.map((member: any) => (
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
        {isLeader && <LeaderPanel team={team as Team} />}

        {team.idea_title && !isLeader && (
          <div className="rounded-lg border border-brand-green/30 p-4">
            <h3 className="font-heading text-sm font-semibold text-brand-off-white/60">Ideia do projeto</h3>
            <p className="mt-1 font-heading font-semibold">{team.idea_title}</p>
            {team.idea_description && <p className="mt-1 text-sm text-brand-off-white/70">{team.idea_description}</p>}
          </div>
        )}
      </div>
    </main>
  );
}
