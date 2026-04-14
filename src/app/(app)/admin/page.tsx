import Link from "next/link";
import { redirect } from "next/navigation";
import {
  createServerSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { RunMatchmakingButton } from "@/components/admin/run-matchmaking-button";
import type { MatchmakingRun, Team } from "@/types/database";
import { Card } from "@/components/ui/card";
import {
  buildAdminOverview,
  buildAdminTeamRows,
  shouldCountTowardRequeueMetric,
} from "./dashboard";

export const dynamic = "force-dynamic";

type AdminDb = Awaited<ReturnType<typeof createServiceRoleClient>>;

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
  leader_id: string | null;
  created_at: string;
  updated_at: string;
  activation_deadline_at: string | null;
  idea_title: string | null;
  whatsapp_group_url: string | null;
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

function statusLabel(status: Team["status"] | MatchmakingRun["status"]) {
  switch (status) {
    case "active":
      return "Ativo";
    case "pending_activation":
      return "Pendente";
    case "inactive":
      return "Inativo";
    case "forming":
      return "Formando";
    case "completed":
      return "Concluída";
    case "failed":
      return "Falhou";
    case "running":
      return "Rodando";
  }
}

function statusClass(status: string) {
  if (status === "active" || status === "completed") {
    return "border-brand-emerald/30 bg-brand-emerald/12 text-brand-emerald";
  }

  if (status === "pending_activation" || status === "failed") {
    return "border-brand-yellow/30 bg-brand-yellow/10 text-brand-yellow";
  }

  return "border-brand-off-white/14 bg-brand-off-white/6 text-brand-off-white/68";
}

const TEAM_GRID_COLS =
  "lg:grid-cols-[minmax(14rem,1.5fr)_minmax(7rem,0.8fr)_minmax(5rem,0.5fr)_minmax(8rem,0.9fr)_minmax(8rem,0.8fr)_minmax(7rem,0.7fr)_minmax(7rem,0.7fr)_minmax(8rem,0.8fr)]";

async function getOrphanedUsersCount(db: AdminDb) {
  const [
    { data: profiles },
    { data: users },
    { data: activeMembers },
    { data: waitingPool },
  ] = await Promise.all([
    db.from("profiles").select("user_id"),
    db.from("users").select("id, email"),
    db.from("team_members").select("user_id").eq("status", "active"),
    db.from("matchmaking_pool").select("user_id").eq("status", "waiting"),
  ]);

  const userEmailById = new Map(
    (users ?? []).map((user) => [user.id, user.email]),
  );
  const activeUserIds = new Set(
    (activeMembers ?? []).map((row) => row.user_id),
  );
  const waitingUserIds = new Set((waitingPool ?? []).map((row) => row.user_id));

  return (profiles ?? []).filter(
    (profile) =>
      !activeUserIds.has(profile.user_id) &&
      !waitingUserIds.has(profile.user_id) &&
      shouldCountTowardRequeueMetric(userEmailById.get(profile.user_id)),
  ).length;
}

async function getDashboardData(statusFilter: Team["status"] | "all") {
  const db = await createServiceRoleClient();

  const [
    { count: waitingPoolCount },
    { count: pendingTeamsCount },
    { count: activeTeamsCount },
    { count: inactiveTeamsCount },
    { data: oldestWaitingUsers },
    { data: recentRuns },
  ] = await Promise.all([
    db
      .from("matchmaking_pool")
      .select("*", { count: "exact", head: true })
      .eq("status", "waiting"),
    db
      .from("teams")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_activation"),
    db
      .from("teams")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    db
      .from("teams")
      .select("*", { count: "exact", head: true })
      .eq("status", "inactive"),
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
      .limit(8),
    db
      .from("matchmaking_runs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(8),
  ]);

  const orphanedUsersCount = await getOrphanedUsersCount(db);

  let teamsQuery = db
    .from("teams")
    .select(
      "id, name, status, leader_id, created_at, updated_at, activation_deadline_at, idea_title, whatsapp_group_url",
    )
    .order("updated_at", { ascending: false })
    .limit(18);

  if (statusFilter !== "all") {
    teamsQuery = teamsQuery.eq("status", statusFilter);
  }

  const { data: teams } = await teamsQuery;
  const recentTeams = (teams ?? []) as TeamSummaryRow[];

  const teamIds = recentTeams.map((team) => team.id);
  const leaderIds = recentTeams
    .map((team) => team.leader_id)
    .filter((leaderId): leaderId is string => Boolean(leaderId));

  const [{ data: teamMembers }, { data: leaderProfiles }] = await Promise.all([
    teamIds.length > 0
      ? db
          .from("team_members")
          .select("team_id, id, user_id, is_leader, status")
          .in("team_id", teamIds)
      : Promise.resolve({ data: [] }),
    leaderIds.length > 0
      ? db.from("profiles").select("user_id, name").in("user_id", leaderIds)
      : Promise.resolve({ data: [] }),
  ]);

  const memberUserIds = (teamMembers ?? []).map(
    (m: { user_id: string }) => m.user_id,
  );
  const { data: memberProfiles } =
    memberUserIds.length > 0
      ? await db
          .from("profiles")
          .select("user_id, name, primary_role, seniority")
          .in("user_id", memberUserIds)
      : { data: [] };

  const profileByUserId = new Map(
    (memberProfiles ?? []).map((p) => [p.user_id, p]),
  );

  const activeMemberCounts = Object.create(null) as Record<string, number>;
  const teamMembersByTeamId = Object.create(null) as Record<
    string,
    {
      id: string;
      name: string;
      primary_role: string;
      seniority: string;
      status: string;
      is_leader: boolean;
    }[]
  >;

  for (const member of teamMembers ?? []) {
    const m = member as {
      team_id: string;
      id: string;
      user_id: string;
      is_leader: boolean;
      status: string;
    };
    const profile = profileByUserId.get(m.user_id);
    if (!profile) {
      continue;
    }

    if (m.status !== "active") {
      continue;
    }

    activeMemberCounts[m.team_id] =
      (activeMemberCounts[m.team_id] ?? 0) + 1;

    if (!teamMembersByTeamId[m.team_id]) {
      teamMembersByTeamId[m.team_id] = [];
    }

    teamMembersByTeamId[m.team_id].push({
      id: m.id,
      name: profile.name,
      primary_role: profile.primary_role,
      seniority: profile.seniority,
      status: m.status,
      is_leader: m.is_leader,
    });
  }

  const leaderNameByTeamId = Object.create(null) as Record<string, string>;
  const profileNameByUserId = new Map(
    (leaderProfiles ?? []).map((profile) => [profile.user_id, profile.name]),
  );

  for (const team of recentTeams) {
    if (team.leader_id) {
      leaderNameByTeamId[team.id] =
        profileNameByUserId.get(team.leader_id) ?? "Líder definido";
    }
  }

  return {
    waitingPoolCount: waitingPoolCount ?? 0,
    oldestWaitingUsers: (oldestWaitingUsers ??
      []) as unknown as WaitingUserRow[],
    recentRuns: (recentRuns ?? []) as MatchmakingRun[],
    teamRows: buildAdminTeamRows({
      teams: recentTeams as Team[],
      activeMemberCounts,
      leaderNames: leaderNameByTeamId,
      teamMembers: teamMembersByTeamId,
    }),
    overviewCards: buildAdminOverview({
      waitingPoolCount: waitingPoolCount ?? 0,
      pendingTeamsCount: pendingTeamsCount ?? 0,
      activeTeamsCount: activeTeamsCount ?? 0,
      inactiveTeamsCount: inactiveTeamsCount ?? 0,
      orphanedUsersCount,
      latestRun: (recentRuns ?? [])[0] ?? null,
    }),
  };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: Team["status"] | "all" }>;
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

  const { status = "all" } = await searchParams;
  const statusFilter: Team["status"] | "all" =
    status === "active" ||
    status === "pending_activation" ||
    status === "inactive" ||
    status === "forming"
      ? status
      : "all";

  const dashboard = await getDashboardData(statusFilter);

  const normalizedWaitingUsers: NormalizedWaitingUser[] = [];
  for (const entry of dashboard.oldestWaitingUsers) {
    const profile = firstItem(entry.profiles);
    if (profile) {
      normalizedWaitingUsers.push({ ...entry, profile });
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_top,rgba(255,210,63,0.10),transparent_40%),radial-gradient(circle_at_18%_20%,rgba(0,139,76,0.18),transparent_28%),linear-gradient(180deg,#1b231d_0%,#162018_48%,#1b231d_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <Card className="rounded-[2rem] border-brand-green/30 bg-[linear-gradient(180deg,rgba(27,35,29,0.96),rgba(27,35,29,0.74))] p-6 sm:p-7">
            <p className="inline-flex rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-yellow">
              Operações internas
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-[0.96] tracking-tight sm:text-5xl">
              Panorama rápido do sistema
              <span className="block text-brand-emerald">
                e inspeção sem atrito
              </span>
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-brand-off-white/70">
              O objetivo daqui é simples: bater o olho, entender a saúde do
              funil e cair rápido no time ou usuário que precisa de atenção.
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
              Use o disparo manual quando quiser forçar uma nova rodada e depois
              atualize o painel para conferir o efeito nas métricas e nos times.
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

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {dashboard.overviewCards.map((card) => (
            <Card
              key={card.label}
              className="rounded-[1.5rem] border-brand-green/24 bg-brand-dark-green/72 p-5"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/46">
                {card.label}
              </p>
              <p
                className={`mt-3 font-heading text-3xl font-bold capitalize ${card.tone}`}
              >
                {card.value}
              </p>
              <p className="mt-2 text-xs text-brand-off-white/48">
                {card.secondary}
              </p>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="space-y-5 rounded-[2rem] p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-brand-off-white/42">
                  Fila
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold">
                  Quem está esperando há mais tempo
                </h2>
              </div>
              <p className="text-sm text-brand-off-white/52">
                {dashboard.waitingPoolCount} pessoas aguardando
              </p>
            </div>
            <div className="space-y-3">
              {normalizedWaitingUsers.length > 0 ? (
                normalizedWaitingUsers.map((entry) => (
                  <Card
                    key={entry.user_id}
                    className="rounded-[1.25rem] border-brand-green/22 bg-brand-green/8 p-4"
                  >
                    <p className="font-heading text-lg font-semibold">
                      {entry.profile.name}
                    </p>
                    <p className="mt-1 text-sm text-brand-off-white/64">
                      {entry.profile.primary_role} · {entry.profile.seniority}
                    </p>
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
                Rodadas
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold">
                Execuções recentes de matchmaking
              </h2>
            </div>
            <div className="space-y-3">
              {dashboard.recentRuns.length > 0 ? (
                dashboard.recentRuns.map((run) => (
                  <Card
                    key={run.id}
                    className="rounded-[1.25rem] border-brand-green/22 bg-brand-green/8 p-4 text-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium capitalize">
                            {run.trigger_source}
                          </p>
                          <span
                            className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClass(run.status)}`}
                          >
                            {statusLabel(run.status)}
                          </span>
                        </div>
                        <p className="mt-2 text-brand-off-white/62">
                          Pool {run.pool_size} · Times {run.teams_formed} ·
                          Matches {run.users_matched} · Replacements{" "}
                          {run.replacements_performed}
                        </p>
                      </div>
                      <span className="text-xs text-brand-off-white/42">
                        {formatDateTime(run.started_at)}
                      </span>
                    </div>
                    {(run.error_message || run.notes) && (
                      <p className="mt-3 leading-6 text-brand-off-white/54">
                        {run.error_message ?? run.notes}
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

        <section className="space-y-5 rounded-[2rem] border border-brand-green/20 bg-brand-dark-green/70 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-brand-off-white/42">
                Times
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold">
                Acompanhe o estado dos times sem abrir um por um
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "Todos"],
                  ["pending_activation", "Pendentes"],
                  ["active", "Ativos"],
                  ["inactive", "Inativos"],
                ] as const
              ).map(([filterValue, label]) => {
                const active = statusFilter === filterValue;
                return (
                  <Link
                    key={filterValue}
                    href={
                      filterValue === "all"
                        ? "/admin"
                        : `/admin?status=${filterValue}`
                    }
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                      active
                        ? "border-brand-yellow/40 bg-brand-yellow/10 text-brand-yellow"
                        : "border-brand-green/24 bg-brand-dark-green/62 text-brand-off-white/68 hover:border-brand-green hover:text-brand-off-white"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className={`hidden px-4 pb-2 text-left text-xs uppercase tracking-[0.16em] text-brand-off-white/42 lg:grid ${TEAM_GRID_COLS} lg:gap-3`}>
              <div>Time</div>
              <div>Status</div>
              <div>Membros</div>
              <div>Líder</div>
              <div>WhatsApp</div>
              <div>Ideia</div>
              <div>Atualizado</div>
              <div className="text-right">Ação</div>
            </div>
            <div className="space-y-3">
              {dashboard.teamRows.map((team) => (
                <details
                  key={team.id}
                  id={`team-${team.id}`}
                  className="group overflow-hidden rounded-[1rem] border border-brand-green/16 bg-brand-green/8 text-sm"
                >
                  <summary className={`grid cursor-pointer list-none gap-3 px-4 py-4 ${TEAM_GRID_COLS} lg:items-center`}>
                          <div>
                            <p className="font-heading text-lg font-semibold text-brand-off-white">
                              {team.name}
                            </p>
                            <p className="mt-1 text-xs text-brand-off-white/38">
                              ID {team.id.slice(0, 8)}
                            </p>
                          </div>
                          <div>
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClass(team.status)}`}
                            >
                              {statusLabel(team.status)}
                            </span>
                          </div>
                          <div className="text-brand-off-white/74">
                            {team.activeMembers}
                          </div>
                          <div className="text-brand-off-white/74">
                            {team.leaderLabel}
                          </div>
                          <div className="text-brand-off-white/74">
                            {team.whatsappLabel}
                          </div>
                          <div className="text-brand-off-white/74">
                            {team.ideaLabel}
                          </div>
                          <div className="text-brand-off-white/56">
                            {team.updatedAtLabel}
                          </div>
                          <div className="flex items-center justify-between gap-3 text-brand-emerald lg:justify-end">
                            <span className="text-xs uppercase tracking-[0.14em]">
                              Abrir detalhes
                            </span>
                            <span className="text-lg transition-transform duration-200 group-open:rotate-180">
                              ↓
                            </span>
                          </div>
                        </summary>

                        <div className="border-t border-brand-green/16 px-4 py-5">
                          <div className="grid gap-4 lg:grid-cols-3">
                            <Card className="rounded-[1.25rem] border-brand-green/16 bg-brand-dark-green/56 p-4">
                              <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
                                Deadline
                              </p>
                              <p className="mt-2 text-sm text-brand-off-white/72">
                                {team.detail.deadlineLabel}
                              </p>
                            </Card>
                            <Card className="rounded-[1.25rem] border-brand-green/16 bg-brand-dark-green/56 p-4">
                              <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
                                WhatsApp
                              </p>
                              {team.detail.whatsappUrl ? (
                                <a
                                  href={team.detail.whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-flex text-sm text-brand-emerald hover:text-brand-off-white"
                                >
                                  Abrir grupo
                                </a>
                              ) : (
                                <p className="mt-2 text-sm text-brand-off-white/72">
                                  Ainda não configurado
                                </p>
                              )}
                            </Card>
                            <Card className="rounded-[1.25rem] border-brand-green/16 bg-brand-dark-green/56 p-4">
                              <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
                                Ideia
                              </p>
                              <p className="mt-2 text-sm text-brand-off-white/72">
                                {team.detail.ideaTitle ??
                                  "Ainda sem ideia definida"}
                              </p>
                            </Card>
                          </div>

                          <div className="mt-5">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
                                  Membros
                                </p>
                                <h3 className="mt-2 font-heading text-xl font-semibold text-brand-off-white">
                                  Estado atual do time
                                </h3>
                              </div>
                              <p className="text-sm text-brand-off-white/46">
                                {team.detail.members.length} pessoa
                                {team.detail.members.length === 1 ? "" : "s"}
                              </p>
                            </div>

                            <div className="mt-4 overflow-x-auto">
                              <table className="min-w-full border-separate border-spacing-y-2">
                                <thead>
                                  <tr className="text-left text-[11px] uppercase tracking-[0.16em] text-brand-off-white/38">
                                    <th className="px-3 pb-1">Nome</th>
                                    <th className="px-3 pb-1">Função</th>
                                    <th className="px-3 pb-1">Senioridade</th>
                                    <th className="px-3 pb-1">Estado</th>
                                    <th className="px-3 pb-1">Papel</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {team.detail.members.length > 0 ? (
                                    team.detail.members.map((member) => (
                                      <tr
                                        key={member.id}
                                        className="bg-brand-dark-green/48"
                                      >
                                        <td className="rounded-l-[0.9rem] border border-r-0 border-brand-green/14 px-3 py-3 text-brand-off-white">
                                          {member.name}
                                        </td>
                                        <td className="border-y border-brand-green/14 px-3 py-3 text-brand-off-white/68">
                                          {member.primaryRole}
                                        </td>
                                        <td className="border-y border-brand-green/14 px-3 py-3 text-brand-off-white/68">
                                          {member.seniority}
                                        </td>
                                        <td className="border-y border-brand-green/14 px-3 py-3 text-brand-off-white/68">
                                          {member.status}
                                        </td>
                                        <td className="rounded-r-[0.9rem] border border-l-0 border-brand-green/14 px-3 py-3 text-brand-off-white/68">
                                          {member.isLeader ? "Líder" : "Membro"}
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td
                                        colSpan={5}
                                        className="rounded-[0.9rem] border border-brand-green/14 bg-brand-dark-green/48 px-3 py-4 text-sm text-brand-off-white/56"
                                      >
                                        Nenhum membro carregado para este time.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                  </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
