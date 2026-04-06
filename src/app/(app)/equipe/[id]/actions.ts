'use server';

import { createServiceRoleClient, createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function claimLeadership(teamId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const serviceClient = await createServiceRoleClient();

  const { data, error } = await serviceClient
    .from('teams')
    .update({
      leader_id: user.id,
      leader_claimed_at: new Date().toISOString(),
      status: 'active',
    })
    .eq('id', teamId)
    .is('leader_id', null)
    .select()
    .single();

  if (error || !data) {
    return { success: false, message: 'Outro membro já assumiu a liderança.' };
  }

  await serviceClient
    .from('team_members')
    .update({ is_leader: true })
    .eq('team_id', teamId)
    .eq('user_id', user.id);

  revalidatePath(`/equipe/${teamId}`);
  return { success: true };
}

export async function updateTeamProfile(
  teamId: string,
  data: {
    name?: string;
    idea_title?: string;
    idea_description?: string;
    project_category?: string;
  },
) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: team } = await supabase
    .from('teams')
    .select('leader_id')
    .eq('id', teamId)
    .single();

  if (team?.leader_id !== user.id) {
    return { success: false, message: 'Apenas o líder pode editar.' };
  }

  const { error } = await supabase
    .from('teams')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', teamId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath(`/equipe/${teamId}`);
  return { success: true };
}
