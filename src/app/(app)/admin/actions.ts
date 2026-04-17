'use server';

import { revalidatePath } from 'next/cache';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { requireAdmin, NotAdminError } from '@/lib/admin/auth';
import { runMatchmakingJob } from '@/lib/matchmaking/job';
import { emit } from '@/lib/notifications/dispatcher';
import { logError } from '@/lib/monitoring';

// Writes an immutable audit row to notification_events(kind='admin_action')
// for every destructive admin action. No channel fan-out — audit-only.
async function logAdminAction(
  db: Awaited<ReturnType<typeof createServiceRoleClient>>,
  action: string,
  teamId: string | null,
  details: Record<string, unknown>,
): Promise<void> {
  try {
    await db.from('notification_events').insert({
      kind: 'admin_action',
      subject_team_id: teamId,
      payload: { action, ...details },
    });
  } catch (error) {
    logError('admin.audit_log_failed', error, { action, teamId });
  }
}

export async function runMatchmakingNow() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof NotAdminError) {
      return { success: false, message: 'Acesso negado.' };
    }
    throw error;
  }

  const db = await createServiceRoleClient();

  const { data: runIdRaw, error: beginError } = await db.rpc('begin_matchmaking_run', {
    p_trigger_source: 'admin',
  });

  if (beginError) {
    logError('admin.run_matchmaking.begin_failed', beginError);
    return {
      success: false,
      message: 'Não foi possível iniciar matchmaking. Tente novamente.',
    };
  }

  const runId = typeof runIdRaw === 'string' ? runIdRaw : null;
  if (!runId) {
    return {
      success: false,
      message: 'Outro ciclo de matchmaking já está em execução.',
    };
  }

  try {
    const result = await runMatchmakingJob({ triggerSource: 'admin' });

    await db.rpc('end_matchmaking_run', {
      p_run_id: runId,
      p_status: 'completed',
      p_error: null,
      p_teams_formed: result.teamsFormed,
      p_users_matched: result.usersMatched,
      p_replacements_performed: result.replacementsPerformed,
      p_pool_size: result.poolSize,
      p_notes: result.notes.join('; ') || null,
    });

    revalidatePath('/admin');

    return {
      success: true,
      message: `Matchmaking executado: ${result.teamsFormed} times e ${result.usersMatched} pessoas.`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    await db.rpc('end_matchmaking_run', {
      p_run_id: runId,
      p_status: 'failed',
      p_error: message,
    });
    logError('admin.run_matchmaking.failed', error);
    return {
      success: false,
      message: 'Erro ao executar matchmaking.',
    };
  }
}

export async function forceAdvanceTeam(teamId: string) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof NotAdminError) {
      return { success: false, message: 'Acesso negado.' };
    }
    throw error;
  }

  if (!teamId) {
    return { success: false, message: 'ID do time inválido.' };
  }

  const db = await createServiceRoleClient();
  const { data, error } = await db.rpc('admin_force_advance_team', {
    p_team_id: teamId,
  });

  if (error) {
    logError('admin.force_advance_team.rpc_failed', error, { teamId });
    return { success: false, message: 'Não foi possível avançar o time. Tente novamente.' };
  }

  const result = data && typeof data === 'object' && 'success' in data
    ? (data as { success: boolean; code?: string; current_status?: string })
    : null;

  if (!result?.success) {
    const messages: Record<string, string> = {
      team_not_found: 'Time não encontrado.',
      invalid_state: `O time não pode avançar a partir do estado "${result?.current_status ?? 'atual'}".`,
    };
    return {
      success: false,
      message: messages[result?.code ?? ''] ?? 'Não foi possível avançar o time.',
    };
  }

  await logAdminAction(db, 'force_advance_team', teamId, {
    result: 'success',
  });

  revalidatePath('/admin');
  return { success: true, message: 'Time avançado para pending_activation.' };
}

export async function forceDissolveTeam(teamId: string, reason?: string) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof NotAdminError) {
      return { success: false, message: 'Acesso negado.' };
    }
    throw error;
  }

  if (!teamId) {
    return { success: false, message: 'ID do time inválido.' };
  }

  const db = await createServiceRoleClient();

  // Capture the affected members + team name BEFORE the RPC runs so we can
  // notify them after. The RPC flips their team_members.status to 'replaced',
  // so post-hoc we'd lose the ability to query them as active.
  const [{ data: teamRow }, { data: affectedMembers }] = await Promise.all([
    db.from('teams').select('id, name, status').eq('id', teamId).maybeSingle(),
    db
      .from('team_members')
      .select('user_id')
      .eq('team_id', teamId)
      .eq('status', 'active'),
  ]);

  const { data, error } = await db.rpc('admin_force_dissolve_team', {
    p_team_id: teamId,
    p_reason: reason ?? 'manual_admin',
  });

  if (error) {
    logError('admin.force_dissolve_team.rpc_failed', error, { teamId });
    return { success: false, message: 'Não foi possível dissolver o time. Tente novamente.' };
  }

  const result = data && typeof data === 'object' && 'success' in data
    ? (data as { success: boolean; code?: string; members_moved?: number })
    : null;

  if (!result?.success) {
    const messages: Record<string, string> = {
      team_not_found: 'Time não encontrado.',
      already_inactive: 'O time já está inativo.',
    };
    return {
      success: false,
      message: messages[result?.code ?? ''] ?? 'Não foi possível dissolver o time.',
    };
  }

  await logAdminAction(db, 'force_dissolve_team', teamId, {
    result: 'success',
    reason: reason ?? 'manual_admin',
    members_moved: result.members_moved ?? 0,
  });

  // Notify affected members. Pick the right kind based on prior status:
  // pre-activation teams get `team_dissolved_pre_activation` (softer copy);
  // active teams get `team_deactivated` (final copy). Best-effort; emit
  // failure does not undo the dissolution.
  if (teamRow?.name && affectedMembers && affectedMembers.length > 0) {
    const userIds = affectedMembers.map((m) => m.user_id);
    const wasActive = teamRow.status === 'active';
    try {
      if (wasActive) {
        await emit('team_deactivated', {
          user_ids: userIds,
          team_id: teamId,
          payload: {
            kind: 'team_deactivated',
            team_id: teamId,
            team_name: teamRow.name,
            reason: 'manual_admin',
          },
        });
      } else {
        await emit('team_dissolved_pre_activation', {
          user_ids: userIds,
          team_id: teamId,
          payload: {
            kind: 'team_dissolved_pre_activation',
            team_id: teamId,
            team_name: teamRow.name,
            reason: 'manual_admin',
          },
        });
      }
    } catch (notifyError) {
      logError('admin.force_dissolve.notify_failed', notifyError, { teamId });
    }
  }

  revalidatePath('/admin');
  return {
    success: true,
    message: `Time dissolvido. ${result.members_moved ?? 0} membros movidos para replaced.`,
  };
}
