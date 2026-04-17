import type { MatchmakingRun, Team } from '@/types/database';

const NON_ACTIONABLE_ORPHAN_EMAILS = new Set([
  'gabriel.thom02@gmail.com',
  'thom@pollum.io',
  'thom@credit.markets',
]);

interface OverviewInput {
  waitingPoolCount: number;
  pendingTeamsCount: number;
  activeTeamsCount: number;
  inactiveTeamsCount: number;
  orphanedUsersCount: number;
  latestRun: MatchmakingRun | null;
}

interface AttentionTeam {
  id: string;
  name: string;
  status: Team['status'];
  activation_deadline_at?: string | null;
  updated_at?: string | null;
}

interface AttentionInput {
  pendingTeamsWithoutLeader: AttentionTeam[];
  recentInactiveTeams: AttentionTeam[];
  recentFailedRuns: MatchmakingRun[];
}

// Narrower than Team — matches the column selection the admin page actually
// makes. Also includes post-F.2 fields (submission_url, submitted_at) which
// aren't in the ambient Team interface yet.
export interface AdminDashboardTeam
  extends Pick<
    Team,
    | "id"
    | "name"
    | "status"
    | "leader_id"
    | "created_at"
    | "updated_at"
    | "activation_deadline_at"
    | "idea_title"
    | "whatsapp_group_url"
  > {
  submission_url: string | null;
  submitted_at: string | null;
}

interface TeamRowsInput {
  teams: AdminDashboardTeam[];
  activeMemberCounts: Record<string, number>;
  leaderNames: Record<string, string>;
  teamMembers: Record<
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
}

function formatDateLabel(value?: string | null) {
  if (!value) {
    return 'sem data';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
}

export function shouldCountTowardRequeueMetric(email: string | null | undefined) {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return true;
  }

  if (normalizedEmail.endsWith('@test.superteam.dev')) {
    return false;
  }

  return !NON_ACTIONABLE_ORPHAN_EMAILS.has(normalizedEmail);
}

export function buildAdminOverview(input: OverviewInput) {
  return [
    {
      label: 'Na fila',
      value: String(input.waitingPoolCount),
      secondary: 'aguardando matchmaking',
      tone: 'text-brand-emerald',
    },
    {
      label: 'Times pendentes',
      value: String(input.pendingTeamsCount),
      secondary: 'aguardando liderança',
      tone: 'text-brand-yellow',
    },
    {
      label: 'Times ativos',
      value: String(input.activeTeamsCount),
      secondary: 'já organizando o grupo',
      tone: 'text-brand-off-white',
    },
    {
      label: 'Times inativos',
      value: String(input.inactiveTeamsCount),
      secondary: 'encerrados recentemente',
      tone: 'text-brand-off-white',
    },
    {
      label: 'Precisam de requeue',
      value: String(input.orphanedUsersCount),
      secondary: 'perfil sem time ativo',
      tone: 'text-brand-yellow',
    },
    {
      label: 'Última rodada',
      value: input.latestRun?.status ?? 'sem rodada',
      secondary: input.latestRun ? formatDateLabel(input.latestRun.started_at) : 'sem data',
      tone: input.latestRun?.status === 'failed' ? 'text-brand-yellow' : 'text-brand-emerald',
    },
  ];
}

export function buildAdminAttention(input: AttentionInput) {
  return {
    pendingTeams: input.pendingTeamsWithoutLeader.map((team) => ({
      id: team.id,
      title: team.name,
      detail: `Prazo: ${formatDateLabel(team.activation_deadline_at)}`,
      href: `#team-${team.id}`,
    })),
    inactiveTeams: input.recentInactiveTeams.map((team) => ({
      id: team.id,
      title: team.name,
      detail: `Atualizado em ${formatDateLabel(team.updated_at)}`,
      href: `#team-${team.id}`,
    })),
    failedRuns: input.recentFailedRuns.map((run) => ({
      id: run.id,
      title: run.trigger_source,
      detail: run.error_message ?? run.notes ?? `Falhou em ${formatDateLabel(run.started_at)}`,
    })),
  };
}

export function buildAdminTeamRows(input: TeamRowsInput) {
  return input.teams.map((team) => ({
    id: team.id,
    name: team.name,
    status: team.status,
    activeMembers: input.activeMemberCounts[team.id] ?? 0,
    leaderLabel: input.leaderNames[team.id] ?? 'Sem líder',
    whatsappLabel: team.whatsapp_group_url ? 'Configurado' : 'Pendente',
    ideaLabel: team.idea_title ? 'Definida' : 'Pendente',
    submissionLabel: team.submission_url ? 'Enviada' : '—',
    updatedAtLabel: formatDateLabel(team.updated_at),
    detail: {
      deadlineLabel: formatDateLabel(team.activation_deadline_at),
      whatsappUrl: team.whatsapp_group_url,
      ideaTitle: team.idea_title,
      submissionUrl: team.submission_url,
      submittedAtLabel: formatDateLabel(team.submitted_at),
      members: (input.teamMembers[team.id] ?? []).map((member) => ({
        id: member.id,
        name: member.name,
        primaryRole: member.primary_role,
        seniority: member.seniority,
        status: member.status,
        isLeader: member.is_leader,
      })),
    },
  }));
}
