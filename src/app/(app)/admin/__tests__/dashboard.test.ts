import { describe, expect, it } from 'vitest';

import {
  buildAdminAttention,
  buildAdminOverview,
  buildAdminTeamRows,
  shouldCountTowardRequeueMetric,
  type AdminDashboardTeam,
} from '@/app/(app)/admin/dashboard';
import type { MatchmakingRun } from '@/types/database';

describe('buildAdminOverview', () => {
  it('returns the operational headline metrics admins need first', () => {
    const cards = buildAdminOverview({
      waitingPoolCount: 80,
      pendingTeamsCount: 6,
      activeTeamsCount: 12,
      inactiveTeamsCount: 3,
      orphanedUsersCount: 9,
      latestRun: {
        id: 'run-1',
        trigger_source: 'manual',
        status: 'completed',
        pool_size: 80,
        teams_formed: 4,
        users_matched: 12,
        replacements_performed: 1,
        notes: null,
        error_message: null,
        started_at: '2026-04-13T12:00:00.000Z',
        finished_at: '2026-04-13T12:04:00.000Z',
      } satisfies MatchmakingRun,
    });

    expect(cards.map((card) => card.label)).toEqual([
      'Na fila',
      'Times pendentes',
      'Times ativos',
      'Times inativos',
      'Precisam de requeue',
      'Última rodada',
    ]);
    expect(cards[5]).toMatchObject({
      value: 'completed',
      secondary: '13/04/2026',
    });
  });
});

describe('buildAdminAttention', () => {
  it('surfaces urgent signals in separate buckets', () => {
    const attention = buildAdminAttention({
      pendingTeamsWithoutLeader: [
        {
          id: 'team-1',
          name: 'Orbit',
          status: 'pending_activation',
          activation_deadline_at: '2026-04-13T13:00:00.000Z',
        },
      ],
      recentInactiveTeams: [
        {
          id: 'team-2',
          name: 'Sunset',
          status: 'inactive',
          updated_at: '2026-04-13T14:00:00.000Z',
        },
      ],
      recentFailedRuns: [
        {
          id: 'run-1',
          trigger_source: 'cron',
          status: 'failed',
          pool_size: 44,
          teams_formed: 0,
          users_matched: 0,
          replacements_performed: 0,
          notes: null,
          error_message: 'timeout',
          started_at: '2026-04-13T11:00:00.000Z',
          finished_at: '2026-04-13T11:01:00.000Z',
        },
      ] satisfies MatchmakingRun[],
    });

    expect(attention.pendingTeams[0]).toMatchObject({
      title: 'Orbit',
      detail: 'Prazo: 13/04/2026',
    });
    expect(attention.inactiveTeams[0]).toMatchObject({
      title: 'Sunset',
    });
    expect(attention.failedRuns[0]).toMatchObject({
      title: 'cron',
      detail: 'timeout',
    });
  });
});

describe('buildAdminTeamRows', () => {
  it('turns raw team data into a practical table row with inline detail content', () => {
    const rows = buildAdminTeamRows({
      teams: [
        {
          id: 'team-1',
          name: 'Orbit',
          status: 'active',
          leader_id: 'leader-1',
          activation_deadline_at: null,
          idea_title: 'Agent wallet',
          whatsapp_group_url: 'https://chat.whatsapp.com/example',
          submission_url: null,
          submitted_at: null,
          created_at: '2026-04-13T11:00:00.000Z',
          updated_at: '2026-04-13T12:00:00.000Z',
        } satisfies AdminDashboardTeam,
      ],
      activeMemberCounts: {
        'team-1': 3,
      },
      leaderNames: {
        'team-1': 'Ada',
      },
      teamMembers: {
        'team-1': [
          {
            id: 'member-1',
            name: 'Ada',
            primary_role: 'Engineering',
            seniority: 'senior',
            status: 'active',
            is_leader: true,
          },
          {
            id: 'member-2',
            name: 'Bia',
            primary_role: 'Design',
            seniority: 'mid',
            status: 'active',
            is_leader: false,
          },
        ],
      },
    });

    expect(rows).toEqual([
      {
        id: 'team-1',
        name: 'Orbit',
        status: 'active',
        activeMembers: 3,
        leaderLabel: 'Ada',
        whatsappLabel: 'Configurado',
        ideaLabel: 'Definida',
        submissionLabel: '—',
        updatedAtLabel: '13/04/2026',
        detail: {
          deadlineLabel: 'sem data',
          whatsappUrl: 'https://chat.whatsapp.com/example',
          ideaTitle: 'Agent wallet',
          submissionUrl: null,
          submittedAtLabel: 'sem data',
          members: [
            {
              id: 'member-1',
              name: 'Ada',
              primaryRole: 'Engineering',
              seniority: 'senior',
              status: 'active',
              isLeader: true,
            },
            {
              id: 'member-2',
              name: 'Bia',
              primaryRole: 'Design',
              seniority: 'mid',
              status: 'active',
              isLeader: false,
            },
          ],
        },
      },
    ]);
  });
});

describe('shouldCountTowardRequeueMetric', () => {
  it('excludes test accounts and intentionally sidelined aliases from the admin metric', () => {
    expect(shouldCountTowardRequeueMetric('ana.silva@test.superteam.dev')).toBe(false);
    expect(shouldCountTowardRequeueMetric('gabriel.thom02@gmail.com')).toBe(false);
    expect(shouldCountTowardRequeueMetric('thom@pollum.io')).toBe(false);
    expect(shouldCountTowardRequeueMetric('thom@credit.markets')).toBe(false);
    expect(shouldCountTowardRequeueMetric('real.user@gmail.com')).toBe(true);
  });
});
