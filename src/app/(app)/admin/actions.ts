'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/admin';
import { runMatchmakingJob } from '@/lib/matchmaking/job';

export async function runMatchmakingNow() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminUser(user)) {
    return { success: false, message: 'Acesso negado.' };
  }

  const result = await runMatchmakingJob({ triggerSource: 'admin' });
  revalidatePath('/admin');

  return {
    success: true,
    message: `Matchmaking executado: ${result.teamsFormed} times e ${result.usersMatched} pessoas.`,
  };
}

