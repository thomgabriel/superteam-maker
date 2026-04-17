'use server';

import {
  createServerSupabaseClient,
  createServiceRoleClient,
} from '@/lib/supabase/server';
import { logError } from '@/lib/monitoring';
import { revalidatePath } from 'next/cache';
import { LEADER_DORMANT_RECLAIM } from '@/lib/feature-flags';
import { emit } from '@/lib/notifications/dispatcher';

export async function requestLeaderReclaim(teamId: string) {
  if (!LEADER_DORMANT_RECLAIM()) {
    return {
      success: false,
      message:
        'Abertura de liderança não está liberada ainda. Fale com um admin se for urgente.',
    };
  }

  const userClient = await createServerSupabaseClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const service = await createServiceRoleClient();
  const { data, error } = await service.rpc('request_leader_reclaim', {
    p_team_id: teamId,
    p_user_id: user.id,
  });

  if (error) {
    logError('team.dormant_reclaim.rpc_failed', error, { teamId, userId: user.id });
    return {
      success: false,
      message: 'Não foi possível abrir a liderança agora. Tente novamente.',
    };
  }

  const result =
    data && typeof data === 'object' && 'success' in data
      ? (data as {
          success: boolean;
          message?: string;
          previous_leader_id?: string;
        })
      : null;

  if (!result || !result.success) {
    const messages: Record<string, string> = {
      missing_user_id: 'Sessão expirada. Entre de novo.',
      not_member: 'Apenas membros ativos podem abrir a liderança.',
      not_dormant: 'A liderança atual não está marcada como inativa.',
    };
    return {
      success: false,
      message:
        messages[result?.message ?? ''] ?? 'Não foi possível abrir a liderança.',
    };
  }

  if (result.previous_leader_id) {
    try {
      const { data: team } = await service
        .from('teams')
        .select('name')
        .eq('id', teamId)
        .maybeSingle();
      if (team?.name) {
        await emit('leader_demoted', {
          user_ids: [result.previous_leader_id],
          team_id: teamId,
          payload: {
            kind: 'leader_demoted',
            team_id: teamId,
            team_name: team.name,
          },
        });
      }
    } catch (notifyError) {
      logError('team.dormant_reclaim.notify_failed', notifyError, {
        teamId,
        previousLeaderId: result.previous_leader_id,
      });
    }
  }

  revalidatePath(`/team/${teamId}`);
  return { success: true };
}
