'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { resolveAuthenticatedUserState } from '@/lib/user-state';
import { logError } from '@/lib/monitoring';
import { redirect } from 'next/navigation';

export async function reenterPool() {
  const resolvedState = await resolveAuthenticatedUserState();
  if (!resolvedState) throw new Error('Not authenticated');

  // State guard: only allow from needs_requeue
  if (resolvedState.state !== 'needs_requeue') {
    redirect(resolvedState.redirectPath);
  }

  const supabase = await createServerSupabaseClient();

  // RPC handles everything atomically:
  // 1. Deactivates any active membership on inactive teams
  // 2. Idempotent pool entry (insert or flip back to waiting)
  // Uses auth.uid() internally — no user ID passed
  const { data, error } = await supabase.rpc('reenter_matchmaking_pool');

  if (error) {
    logError('requeue.rpc_failed', error, { userId: resolvedState.userId });
    throw new Error('Não foi possível voltar para a fila. Tente novamente.');
  }

  const result = data && typeof data === 'object' && 'success' in data
    ? (data as { success: boolean; code?: string })
    : null;

  if (!result) {
    logError('requeue.unexpected_rpc_shape', new Error('Unexpected RPC response'), {
      userId: resolvedState.userId,
    });
    throw new Error('Não foi possível voltar para a fila. Tente novamente.');
  }

  if (!result.success) {
    if (result.code === 'no_profile') {
      throw new Error('Perfil não encontrado.');
    }
    if (result.code === 'still_on_team') {
      throw new Error('Você ainda faz parte de um time ativo. Abra seu time para continuar.');
    }
    throw new Error('Não foi possível voltar para a fila. Tente novamente.');
  }

  redirect('/queue');
}
