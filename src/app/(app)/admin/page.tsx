import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/admin';
import { RunMatchmakingButton } from '@/components/admin/run-matchmaking-button';
import { getUserState } from '@/lib/user-state';
import type { MatchmakingRun, Team } from '@/types/database';

export const dynamic = 'force-dynamic';

interface WaitingUserRow {
  created_at: string;
  user_id: string;
  profiles:
    | {
        name: string;
        primary_role: string;
        seniority: string;
      }
    | {
        name: string;
        primary_role: string;
        seniority: string;
      }[];
}

interface TeamSummaryRow {
  id: string;
  name: string;
  status: Team['status'];
  created_at?: string;
  updated_at?: string;
  activation_deadline_at?: string | null;
}

interface TeamInspectionMember {
  id: string;
  is_leader: boolean;
  status: string;
  profiles:
    | {
        name: string;
        primary_role: string;
        seniority: string;
      }
    | {
        name: string;
        primary_role: string;
        seniority: string;
      }[];
}

interface NormalizedWaitingUser {
  user_id: string;
  created_at: string;
  profile: {
    name: string;
    primary_role: string;
    seniority: string;
  };
}

interface NormalizedTeamInspectionMember {
  id: string;
  is_leader: boolean;
  status: string;
  profile: {
    name: string;
    primary_role: string;
    seniority: string;
  };
}

function firstItem<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? value[0] ?? null : value;
}

async function getDashboardData() {
  const db = await createServiceRoleClient();

  const [
    { count: waitingPoolCount },
    { data: oldestWaitingUsers },
    { data: recentTeams },
    { data: pendingTeams },
    { data: inactiveTeams },
    { data: recentRuns },
  ] = await Promise.all([
    db
      .from('matchmaking_pool')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'waiting'),
    db
      .from('matchmaking_pool')
      .select(`
        created_at,
        user_id,
        profiles!inner (name, primary_role, seniority)
      `)
      .eq('status', 'waiting')
      .order('created_at', { ascending: true })
      .limit(5),
    db
      .from('teams')
      .select('id, name, status, created_at, leader_id')
      .order('created_at', { ascending: false })
      .limit(8),
    db
      .from('teams')
      .select('id, name, activation_deadline_at')
      .eq('status', 'pending_activation')
      .is('leader_id', null)
      .order('activation_deadline_at', { ascending: true })
      .limit(8),
    db
      .from('teams')
      .select('id, name, updated_at')
      .eq('status', 'inactive')
      .order('updated_at', { ascending: false })
      .limit(8),
    db
      .from('matchmaking_runs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(8),
  ]);

  return {
    waitingPoolCount: waitingPoolCount ?? 0,
    oldestWaitingUsers: (oldestWaitingUsers ?? []) as unknown as WaitingUserRow[],
    recentTeams: (recentTeams ?? []) as TeamSummaryRow[],
    pendingTeams: (pendingTeams ?? []) as TeamSummaryRow[],
    inactiveTeams: (inactiveTeams ?? []) as TeamSummaryRow[],
    recentRuns: (recentRuns ?? []) as MatchmakingRun[],
  };
}

async function inspectUser(userId: string) {
  const db = await createServiceRoleClient();
  const [{ data: profile }, { data: poolEntry }, { data: teamMember }] = await Promise.all([
    db.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
    db.from('matchmaking_pool').select('*').eq('user_id', userId).maybeSingle(),
    db.from('team_members').select('*').eq('user_id', userId).eq('status', 'active').maybeSingle(),
  ]);

  const team = teamMember
    ? await db.from('teams').select('*').eq('id', teamMember.team_id).maybeSingle()
    : { data: null };

  return {
    profile,
    poolEntry,
    teamMember,
    team: team.data,
    state: getUserState(profile ?? null, poolEntry ?? null, teamMember ?? null, team.data ?? null),
  };
}

async function inspectTeam(teamId: string) {
  const db = await createServiceRoleClient();
  const [{ data: team }, { data: members }] = await Promise.all([
    db.from('teams').select('*').eq('id', teamId).maybeSingle(),
    db
      .from('team_members')
      .select(`id, is_leader, status, profiles:user_id (name, primary_role, seniority)`)
      .eq('team_id', teamId)
      .order('joined_at', { ascending: true }),
  ]);

  return { team, members: (members ?? []) as unknown as TeamInspectionMember[] };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string; teamId?: string }>;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  if (!isAdminUser(user)) {
    redirect('/fila');
  }

  const [{ userId, teamId }, dashboard] = await Promise.all([
    searchParams,
    getDashboardData(),
  ]);

  const [userInspection, teamInspection] = await Promise.all([
    userId ? inspectUser(userId) : Promise.resolve(null),
    teamId ? inspectTeam(teamId) : Promise.resolve(null),
  ]);

  const normalizedWaitingUsers: NormalizedWaitingUser[] = [];
  for (const entry of dashboard.oldestWaitingUsers) {
    const profile = firstItem(entry.profiles);
    if (profile) {
      normalizedWaitingUsers.push({ ...entry, profile });
    }
  }

  const normalizedTeamInspectionMembers: NormalizedTeamInspectionMember[] = [];
  for (const member of teamInspection?.members ?? []) {
    const profile = firstItem(member.profiles);
    if (profile) {
      normalizedTeamInspectionMembers.push({ ...member, profile });
    }
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-brand-green/30 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold">Operações</h1>
            <p className="mt-1 text-sm text-brand-off-white/60">
              Painel interno para acompanhar pool, times e execuções de matchmaking.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <RunMatchmakingButton />
            <Link href="/admin" className="text-sm text-brand-emerald hover:underline">
              Atualizar painel
            </Link>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-brand-green/30 p-4">
            <p className="text-sm text-brand-off-white/60">Pessoas na fila</p>
            <p className="mt-2 font-heading text-3xl font-bold">{dashboard.waitingPoolCount}</p>
          </div>
          <div className="rounded-xl border border-brand-green/30 p-4">
            <p className="text-sm text-brand-off-white/60">Times pendentes</p>
            <p className="mt-2 font-heading text-3xl font-bold">{dashboard.pendingTeams.length}</p>
          </div>
          <div className="rounded-xl border border-brand-green/30 p-4">
            <p className="text-sm text-brand-off-white/60">Times inativos</p>
            <p className="mt-2 font-heading text-3xl font-bold">{dashboard.inactiveTeams.length}</p>
          </div>
          <div className="rounded-xl border border-brand-green/30 p-4">
            <p className="text-sm text-brand-off-white/60">Execuções registradas</p>
            <p className="mt-2 font-heading text-3xl font-bold">{dashboard.recentRuns.length}</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-brand-green/30 p-6">
            <div>
              <h2 className="font-heading text-xl font-semibold">Fila</h2>
              <p className="text-sm text-brand-off-white/60">Usuários aguardando há mais tempo.</p>
            </div>
            <div className="space-y-3">
              {normalizedWaitingUsers.map((entry) => (
                <div key={entry.user_id} className="rounded-lg bg-brand-green/10 p-3">
                  <p className="font-medium">{entry.profile.name}</p>
                  <p className="text-sm text-brand-off-white/60">
                    {entry.profile.primary_role} · {entry.profile.seniority}
                  </p>
                  <p className="text-xs text-brand-off-white/50">
                    Entrou em {new Date(entry.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-brand-green/30 p-6">
            <div>
              <h2 className="font-heading text-xl font-semibold">Execuções recentes</h2>
              <p className="text-sm text-brand-off-white/60">Resumo das últimas rodadas.</p>
            </div>
            <div className="space-y-3">
              {dashboard.recentRuns.map((run) => (
                <div key={run.id} className="rounded-lg bg-brand-green/10 p-3 text-sm">
                  <p className="font-medium">
                    {run.trigger_source} · {run.status}
                  </p>
                  <p className="text-brand-off-white/60">
                    Pool {run.pool_size} · Times {run.teams_formed} · Matches {run.users_matched}
                  </p>
                  {run.notes && <p className="text-brand-off-white/50">{run.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-brand-green/30 p-6">
            <h2 className="font-heading text-xl font-semibold">Times</h2>
            <div className="space-y-3">
              {dashboard.recentTeams.map((team) => (
                <div key={team.id} className="rounded-lg bg-brand-green/10 p-3">
                  <p className="font-medium">{team.name}</p>
                  <p className="text-sm text-brand-off-white/60">
                    {team.status} · {team.created_at ? new Date(team.created_at).toLocaleString('pt-BR') : 'sem data'}
                  </p>
                  <Link href={`/admin?teamId=${team.id}`} className="text-sm text-brand-emerald hover:underline">
                    Inspecionar time
                  </Link>
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t border-brand-green/20 pt-4">
              <h3 className="font-heading text-sm font-semibold">Pendentes sem líder</h3>
              {dashboard.pendingTeams.map((team) => (
                <div key={team.id} className="rounded-lg bg-brand-green/10 p-3">
                  <p className="font-medium">{team.name}</p>
                  <p className="text-sm text-brand-off-white/60">
                    Prazo: {team.activation_deadline_at ? new Date(team.activation_deadline_at).toLocaleString('pt-BR') : 'sem prazo'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-brand-green/30 p-6">
            <h2 className="font-heading text-xl font-semibold">Inspeção</h2>
            <form action="/admin" className="space-y-3">
              <label className="block text-sm text-brand-off-white/60">
                Usuário por ID
                <input
                  type="text"
                  name="userId"
                  defaultValue={userId}
                  className="mt-1 w-full rounded-lg border border-brand-green bg-brand-dark-green px-3 py-2 text-sm"
                />
              </label>
              <button className="rounded-lg bg-brand-emerald px-4 py-2 text-sm font-medium text-brand-off-white">
                Inspecionar usuário
              </button>
            </form>
            <form action="/admin" className="space-y-3">
              <label className="block text-sm text-brand-off-white/60">
                Time por ID
                <input
                  type="text"
                  name="teamId"
                  defaultValue={teamId}
                  className="mt-1 w-full rounded-lg border border-brand-green bg-brand-dark-green px-3 py-2 text-sm"
                />
              </label>
              <button className="rounded-lg bg-brand-emerald px-4 py-2 text-sm font-medium text-brand-off-white">
                Inspecionar time
              </button>
            </form>

            {userInspection && (
              <div className="rounded-lg bg-brand-green/10 p-4 text-sm">
                <p className="font-medium">Estado do usuário: {userInspection.state}</p>
                <p className="text-brand-off-white/60">
                  Perfil: {userInspection.profile ? 'sim' : 'não'} · Pool: {userInspection.poolEntry?.status ?? 'nenhum'}
                </p>
                <p className="text-brand-off-white/60">
                  Time: {userInspection.team?.name ?? 'nenhum'}
                </p>
              </div>
            )}

            {teamInspection && teamInspection.team && (
              <div className="rounded-lg bg-brand-green/10 p-4 text-sm">
                <p className="font-medium">{teamInspection.team.name}</p>
                <p className="text-brand-off-white/60">Status: {teamInspection.team.status}</p>
                <div className="mt-3 space-y-2">
                  {normalizedTeamInspectionMembers.map((member) => (
                    <div key={member.id}>
                      <p>
                        {member.profile.name}
                        {member.is_leader ? ' · líder' : ''}
                      </p>
                      <p className="text-brand-off-white/50">
                        {member.profile.primary_role} · {member.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
