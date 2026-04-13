'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { persistAttributionForUser } from '@/lib/attribution';
import { trackEvent } from '@/lib/analytics.server';
import { getMacroRole } from '@/lib/matchmaking/roles';
import { sanitizeProfileUrl } from '@/lib/security';
import { redirect } from 'next/navigation';

export interface ProfileFormData {
  name: string;
  phone_number: string;
  linkedin_url: string;
  github_url: string;
  x_url: string;
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
  const linkedinUrl = sanitizeProfileUrl('linkedin', data.linkedin_url);
  const githubUrl = sanitizeProfileUrl('github', data.github_url);
  const xUrl = sanitizeProfileUrl('x', data.x_url);

  const { error } = await supabase.rpc('create_profile_and_enter_pool', {
    p_user_id: user.id,
    p_name: data.name,
    p_phone_number: data.phone_number,
    p_primary_role: data.primary_role,
    p_macro_role: macroRole,
    p_years_experience: data.years_experience,
    p_secondary_roles: data.secondary_roles,
    p_interests: data.interests,
    p_linkedin_url: linkedinUrl,
    p_github_url: githubUrl,
    p_x_url: xUrl,
  });

  if (error) {
    // Profile already exists — just redirect to queue
    if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
      redirect('/queue');
    }
    throw new Error(`Erro ao criar perfil: ${error.message}`);
  }

  await persistAttributionForUser(user.id);
  await trackEvent({
    event: 'profile_completed',
    userId: user.id,
    route: '/profile',
    properties: { primary_role: data.primary_role },
  });
  await trackEvent({
    event: 'entered_pool',
    userId: user.id,
    route: '/queue',
    properties: { macro_role: macroRole },
  });

  redirect('/queue');
}
