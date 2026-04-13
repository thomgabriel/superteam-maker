'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { persistAttributionForUser } from '@/lib/attribution';
import { trackEvent } from '@/lib/analytics.server';
import { getMacroRole } from '@/lib/matchmaking/roles';
import { sanitizeProfileUrl } from '@/lib/security';
import { logError } from '@/lib/monitoring';
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
    logError('profile.create.rpc_failed', error, { userId: user.id });
    throw new Error('Não foi possível criar seu perfil. Tente novamente.');
  }

  try {
    await persistAttributionForUser(user.id);
  } catch (error) {
    logError('profile.create.attribution_failed', error, { userId: user.id });
  }

  const analyticsEvents = [
    {
      event: 'profile_completed' as const,
      userId: user.id,
      route: '/profile',
      properties: { primary_role: data.primary_role },
    },
    {
      event: 'entered_pool' as const,
      userId: user.id,
      route: '/queue',
      properties: { macro_role: macroRole },
    },
  ];

  for (const event of analyticsEvents) {
    try {
      await trackEvent(event);
    } catch (error) {
      logError('profile.create.track_failed', error, {
        userId: user.id,
        eventName: event.event,
      });
    }
  }

  redirect('/queue');
}

export async function updateProfile(data: ProfileFormData, redirectTo?: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // State guard: only allow in waiting_match or needs_requeue
  // Reuse the existing supabase client to avoid double auth roundtrip
  const { resolveUserStateWithClient } = await import('@/lib/user-state');
  const state = await resolveUserStateWithClient(user.id, supabase);
  if (state.state !== 'waiting_match' && state.state !== 'needs_requeue') {
    throw new Error('Não é possível editar o perfil neste momento.');
  }

  const macroRole = getMacroRole(data.primary_role);
  const linkedinUrl = sanitizeProfileUrl('linkedin', data.linkedin_url);
  const githubUrl = sanitizeProfileUrl('github', data.github_url);
  const xUrl = sanitizeProfileUrl('x', data.x_url);

  const { data: rpcData, error: rpcError } = await supabase.rpc('update_profile_details', {
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

  if (rpcError) {
    logError('profile.update.rpc_failed', rpcError, { userId: user.id });
    throw new Error('Não foi possível atualizar seu perfil. Tente novamente.');
  }

  const result = rpcData && typeof rpcData === 'object' && 'success' in rpcData
    ? (rpcData as { success: boolean; code?: string })
    : null;

  if (!result) {
    logError('profile.update.unexpected_rpc_shape', new Error('Unexpected RPC response'), {
      userId: user.id,
    });
    throw new Error('Não foi possível atualizar seu perfil. Tente novamente.');
  }

  if (!result.success) {
    if (result.code === 'no_profile') {
      throw new Error('Perfil não encontrado.');
    }
    throw new Error('Não foi possível atualizar seu perfil. Tente novamente.');
  }

  try {
    await trackEvent({
      event: 'profile_completed',
      userId: user.id,
      route: '/profile',
      properties: { mode: 'edit' },
    });
  } catch (err) {
    logError('profile.update.track_failed', err, { userId: user.id });
  }

  redirect(redirectTo ?? '/queue');
}
