'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { persistAttributionForUser } from '@/lib/attribution';
import { trackEvent } from '@/lib/analytics.server';
import { getMacroRole } from '@/lib/matchmaking/roles';
import { redirect } from 'next/navigation';

export interface ProfileFormData {
  name: string;
  phone_number: string;
  primary_role: string;
  secondary_roles: string[];
  years_experience: number;
  interests: string[];
}

export async function createProfile(data: ProfileFormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const macroRole = getMacroRole(data.primary_role);

  const { error } = await supabase.rpc('create_profile_and_enter_pool', {
    p_user_id: user.id,
    p_name: data.name,
    p_phone_number: data.phone_number,
    p_primary_role: data.primary_role,
    p_macro_role: macroRole,
    p_years_experience: data.years_experience,
    p_secondary_roles: data.secondary_roles,
    p_interests: data.interests,
  });

  if (error) {
    // Profile already exists — just redirect to queue
    if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
      redirect('/fila');
    }
    throw new Error(`Erro ao criar perfil: ${error.message}`);
  }

  await persistAttributionForUser(user.id);
  await trackEvent({
    event: 'profile_completed',
    userId: user.id,
    route: '/perfil',
    properties: { primary_role: data.primary_role },
  });
  await trackEvent({
    event: 'entered_pool',
    userId: user.id,
    route: '/fila',
    properties: { macro_role: macroRole },
  });

  redirect('/fila');
}
