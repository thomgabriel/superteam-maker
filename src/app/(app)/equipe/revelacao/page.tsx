import { redirect } from 'next/navigation';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { MemberCard } from '@/components/team/member-card';
import Image from 'next/image';
import Link from 'next/link';
import { TrackPageView } from '@/components/ui/track-event';

export const dynamic = 'force-dynamic';

export default async function TeamRevealPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const db = await createServiceRoleClient();

  const { data: membership } = await db
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  if (!membership) redirect('/fila');

  const { data: team } = await db
    .from('teams')
    .select('*')
    .eq('id', membership.team_id)
    .single();

  if (!team) redirect('/fila');

  const { data: members } = await db
    .from('team_members')
    .select(`
      *,
      profiles:user_id (name, primary_role, macro_role, seniority)
    `)
    .eq('team_id', team.id)
    .eq('status', 'active');

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
        <p className="mt-6 rounded-lg border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-3 font-heading text-xl font-semibold">{team.name}</p>

        <div className="mt-6 space-y-3">
          {members?.map((member: any) => (
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

        {!team.leader_id && (
          <p className="mt-4 text-sm text-brand-off-white/50">Nenhum líder ainda — qualquer membro pode assumir!</p>
        )}

        <Link href={`/equipe/${team.id}`}
          className="mt-8 inline-flex w-full justify-center rounded-lg bg-brand-emerald px-6 py-4 font-heading text-lg font-semibold text-brand-off-white transition-opacity hover:opacity-90">
          Ver meu time
        </Link>
      </div>
    </main>
  );
}
