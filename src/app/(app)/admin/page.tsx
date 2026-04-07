import Link from "next/link";
import { redirect } from "next/navigation";
import {
  createServerSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { RunMatchmakingButton } from "@/components/admin/run-matchmaking-button";
import { getUserState } from "@/lib/user-state";
import type { MatchmakingRun, Team } from "@/types/database";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

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
  status: Team["status"];
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

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "sem data";
  }

  return new Date(value).toLocaleString("pt-BR");
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
      .from("matchmaking_pool")
      .select("*", { count: "exact", head: true })
      .eq("status", "waiting"),
    db
      .from("matchmaking_pool")
      .select(
        `
        created_at,
        user_id,
        profiles!inner (name, primary_role, seniority)
      `,
      )
      .eq("status", "waiting")
      .order("created_at", { ascending: true })
      .limit(5),
    db
      .from("teams")
      .select("id, name, status, created_at, leader_id")
      .order("created_at", { ascending: false })
      .limit(8),
    db
      .from("teams")
      .select("id, name, activation_deadline_at")
      .eq("status", "pending_activation")
      .is("leader_id", null)
      .order("activation_deadline_at", { ascending: true })
      .limit(8),
    db
      .from("teams")
      .select("id, name, updated_at")
      .eq("status", "inactive")
      .order("updated_at", { ascending: false })
      .limit(8),
    db
      .from("matchmaking_runs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(8),
  ]);

  return {
    waitingPoolCount: waitingPoolCount ?? 0,
    oldestWaitingUsers: (oldestWaitingUsers ??
      []) as unknown as WaitingUserRow[],
    recentTeams: (recentTeams ?? []) as TeamSummaryRow[],
    pendingTeams: (pendingTeams ?? []) as TeamSummaryRow[],
    inactiveTeams: (inactiveTeams ?? []) as TeamSummaryRow[],
    recentRuns: (recentRuns ?? []) as MatchmakingRun[],
  };
}

async function inspectUser(userId: string) {
  const db = await createServiceRoleClient();
  const [{ data: profile }, { data: poolEntry }, { data: teamMember }] =
    await Promise.all([
      db.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
      db
        .from("matchmaking_pool")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(),
      db
        .from("team_members")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle(),
    ]);

  const team = teamMember
    ? await db
        .from("teams")
        .select("*")
        .eq("id", teamMember.team_id)
        .maybeSingle()
    : { data: null };

  return {
    profile,
    poolEntry,
    teamMember,
    team: team.data,
    state: getUserState(
      profile ?? null,
      poolEntry ?? null,
      teamMember ?? null,
      team.data ?? null,
    ),
  };
}

async function inspectTeam(teamId: string) {
  const db = await createServiceRoleClient();
  const [{ data: team }, { data: members }] = await Promise.all([
    db.from("teams").select("*").eq("id", teamId).maybeSingle(),
    db
      .from("team_members")
      .select(
        `id, is_leader, status, profiles:user_id (name, primary_role, seniority)`,
      )
      .eq("team_id", teamId)
      .order("joined_at", { ascending: true }),
  ]);

  return {
    team,
    members: (members ?? []) as unknown as TeamInspectionMember[],
  };
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
    redirect("/auth");
  }

  if (!isAdminUser(user)) {
    redirect("/queue");
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
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_top,rgba(255,210,63,0.10),transparent_40%),radial-gradient(circle_at_18%_20%,rgba(0,139,76,0.18),transparent_28%),linear-gradient(180deg,#1b231d_0%,#162018_48%,#1b231d_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Card className="rounded-[2rem] border-brand-green/30 bg-[linear-gradient(180deg,rgba(27,35,29,0.96),rgba(27,35,29,0.74))] p-6 sm:p-7">
            <p className="inline-flex rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-yellow">
              Operações internas
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-[0.96] tracking-tight sm:text-5xl">
              Painel para acompanhar
              <span className="block text-brand-emerald">fila, times e rodadas</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-brand-off-white/70">
              Aqui a leitura precisa ser rápida: quantas pessoas estão esperando,
              como os times estão saindo e o que aconteceu nas últimas execuções
              de matchmaking.
            </p>
          </Card>

          <Card className="rounded-[2rem] border-brand-yellow/24 bg-[linear-gradient(135deg,rgba(255,210,63,0.10),rgba(27,35,29,0.96))] p-6 sm:p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-brand-yellow/82">
              Ações
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold">
              Disparar rodada e recarregar leitura.
            </h2>
            <p className="mt-3 text-sm leading-7 text-brand-off-white/68">
              Use o disparo manual quando você quiser forçar uma nova rodada e
              depois atualize o painel para conferir o efeito.
            </p>
            <div className="mt-6 space-y-4">
              <RunMatchmakingButton />
              <Link
                href="/admin"
                className="inline-flex rounded-full border border-brand-green/24 bg-brand-dark-green/62 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-off-white/70 transition-colors hover:border-brand-green hover:text-brand-off-white"
              >
                Atualizar painel
              </Link>
            </div>
          </Card>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Pessoas na fila",
              value: dashboard.waitingPoolCount,
              tone: "text-brand-emerald",
            },
            {
              label: "Times pendentes",
              value: dashboard.pendingTeams.length,
              tone: "text-brand-yellow",
            },
            {
              label: "Times inativos",
              value: dashboard.inactiveTeams.length,
              tone: "text-brand-off-white",
            },
            {
              label: "Execuções registradas",
              value: dashboard.recentRuns.length,
              tone: "text-brand-off-white",
            },
          ].map((item) => (
            <Card
              key={item.label}
              className="rounded-[1.5rem] border-brand-green/24 bg-brand-dark-green/72 p-5"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/46">
                {item.label}
              </p>
              <p className={`mt-3 font-heading text-4xl font-bold ${item.tone}`}>
                {item.value}
              </p>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Card className="space-y-5 rounded-[2rem] p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-brand-off-white/42">
                Fila
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold">
                Quem está esperando há mais tempo
              </h2>
            </div>
            <div className="space-y-3">
              {normalizedWaitingUsers.length > 0 ? (
                normalizedWaitingUsers.map((entry) => (
                  <Card
                    key={entry.user_id}
                    className="rounded-[1.25rem] border-brand-green/22 bg-brand-green/8 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-heading text-lg font-semibold">
                          {entry.profile.name}
                        </p>
                        <p className="mt-1 text-sm text-brand-off-white/64">
                          {entry.profile.primary_role} · {entry.profile.seniority}
                        </p>
                      </div>
                      <Link
                        href={`/admin?userId=${entry.user_id}`}
                        className="text-xs uppercase tracking-[0.14em] text-brand-emerald hover:text-brand-off-white"
                      >
                        Inspecionar
                      </Link>
                    </div>
                    <p className="mt-3 text-xs text-brand-off-white/46">
                      Entrou em {formatDateTime(entry.created_at)}
                    </p>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-brand-off-white/60">
                  Ninguém aguardando no momento.
                </p>
              )}
            </div>
          </Card>

          <Card className="space-y-5 rounded-[2rem] p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-brand-off-white/42">
                Matchmaking
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold">
                Execuções recentes
              </h2>
            </div>
            <div className="space-y-3">
              {dashboard.recentRuns.length > 0 ? (
                dashboard.recentRuns.map((run) => (
                  <Card
                    key={run.id}
                    className="rounded-[1.25rem] border-brand-green/22 bg-brand-green/8 p-4 text-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium capitalize">
                          {run.trigger_source} · {run.status}
                        </p>
                        <p className="mt-1 text-brand-off-white/62">
                          Pool {run.pool_size} · Times {run.teams_formed} · Matches{" "}
                          {run.users_matched}
                        </p>
                      </div>
                      <span className="text-xs text-brand-off-white/42">
                        {formatDateTime(run.started_at)}
                      </span>
                    </div>
                    {run.notes && (
                      <p className="mt-3 leading-6 text-brand-off-white/54">
                        {run.notes}
                      </p>
                    )}
                  </Card>
                ))
              ) : (
                <p className="text-sm text-brand-off-white/60">
                  Ainda não existem execuções registradas.
                </p>
              )}
            </div>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <Card className="space-y-5 rounded-[2rem] p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-brand-off-white/42">
                Times
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold">
                Recortes operacionais
              </h2>
            </div>

            <div className="space-y-3">
              {dashboard.recentTeams.map((team) => (
                <Card
                  key={team.id}
                  className="rounded-[1.25rem] border-brand-green/22 bg-brand-green/8 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-heading text-lg font-semibold">
                        {team.name}
                      </p>
                      <p className="mt-1 text-sm text-brand-off-white/62">
                        {team.status} · {formatDateTime(team.created_at)}
                      </p>
                    </div>
                    <Link
                      href={`/admin?teamId=${team.id}`}
                      className="text-xs uppercase tracking-[0.14em] text-brand-emerald hover:text-brand-off-white"
                    >
                      Inspecionar
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 border-t border-brand-green/18 pt-4 lg:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-heading text-lg font-semibold text-brand-off-white">
                  Pendentes sem líder
                </h3>
                {dashboard.pendingTeams.length > 0 ? (
                  dashboard.pendingTeams.map((team) => (
                    <Card
                      key={team.id}
                      className="rounded-[1.25rem] border-brand-yellow/22 bg-brand-yellow/8 p-4"
                    >
                      <p className="font-medium">{team.name}</p>
                      <p className="mt-1 text-sm text-brand-off-white/62">
                        Prazo: {formatDateTime(team.activation_deadline_at)}
                      </p>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-brand-off-white/60">
                    Nenhum time pendente sem líder.
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-heading text-lg font-semibold text-brand-off-white">
                  Inativos
                </h3>
                {dashboard.inactiveTeams.length > 0 ? (
                  dashboard.inactiveTeams.map((team) => (
                    <Card
                      key={team.id}
                      className="rounded-[1.25rem] border-brand-green/22 bg-brand-green/8 p-4"
                    >
                      <p className="font-medium">{team.name}</p>
                      <p className="mt-1 text-sm text-brand-off-white/62">
                        Atualizado em {formatDateTime(team.updated_at)}
                      </p>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-brand-off-white/60">
                    Nenhum time inativo no momento.
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="space-y-5 rounded-[2rem] p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-brand-off-white/42">
                Inspeção
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold">
                Buscar usuário ou time
              </h2>
            </div>

            <form action="/admin" className="space-y-3">
              <label className="block text-sm text-brand-off-white/62">
                Usuário por ID
                <Input
                  type="text"
                  name="userId"
                  defaultValue={userId}
                  className="mt-2 px-4 py-3 text-sm"
                />
              </label>
              <Button size="sm" variant="primary">
                Inspecionar usuário
              </Button>
            </form>

            <form action="/admin" className="space-y-3 border-t border-brand-green/18 pt-4">
              <label className="block text-sm text-brand-off-white/62">
                Time por ID
                <Input
                  type="text"
                  name="teamId"
                  defaultValue={teamId}
                  className="mt-2 px-4 py-3 text-sm"
                />
              </label>
              <Button size="sm" variant="primary">
                Inspecionar time
              </Button>
            </form>

            {userInspection && (
              <Card className="rounded-[1.25rem] border-brand-green/22 bg-brand-green/8 p-4 text-sm">
                <p className="font-heading text-lg font-semibold">
                  Estado do usuário
                </p>
                <p className="mt-3 text-brand-off-white/64">
                  Estado: {userInspection.state}
                </p>
                <p className="text-brand-off-white/64">
                  Perfil: {userInspection.profile ? "sim" : "não"} · Pool:{" "}
                  {userInspection.poolEntry?.status ?? "nenhum"}
                </p>
                <p className="text-brand-off-white/64">
                  Time: {userInspection.team?.name ?? "nenhum"}
                </p>
              </Card>
            )}

            {teamInspection && teamInspection.team && (
              <Card className="rounded-[1.25rem] border-brand-green/22 bg-brand-green/8 p-4 text-sm">
                <p className="font-heading text-lg font-semibold">
                  {teamInspection.team.name}
                </p>
                <p className="mt-2 text-brand-off-white/64">
                  Status: {teamInspection.team.status}
                </p>
                <div className="mt-4 space-y-3">
                  {normalizedTeamInspectionMembers.map((member) => (
                    <div key={member.id} className="rounded-xl border border-brand-green/18 bg-brand-dark-green/60 px-3 py-3">
                      <p className="font-medium">
                        {member.profile.name}
                        {member.is_leader ? " · líder" : ""}
                      </p>
                      <p className="mt-1 text-brand-off-white/50">
                        {member.profile.primary_role} · {member.status}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}
