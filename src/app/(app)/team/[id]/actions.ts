'use server';

import { createServiceRoleClient, createServerSupabaseClient } from '@/lib/supabase/server';
import { trackEvent } from '@/lib/analytics.server';
import { sendMatchNotification } from '@/lib/email';
import { revalidatePath } from 'next/cache';
import { scoreCandidate } from '@/lib/matchmaking/scoring';
import { getFlexMacroRoles } from '@/lib/matchmaking/roles';
import { MATCHMAKING_CONFIG, MIN_EXTRA_MEMBER_SCORE } from '@/lib/matchmaking/config';
import type { EnrichedPoolUser } from '@/types/database';

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

  await trackEvent({
    event: 'leader_claimed',
    userId: user.id,
    route: `/team/${teamId}`,
    properties: { team_id: teamId },
  });
  await trackEvent({
    event: 'team_activated',
    userId: user.id,
    route: `/team/${teamId}`,
    properties: { team_id: teamId },
  });

  revalidatePath(`/team/${teamId}`);
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

  // Use service role — sb_publishable_ anon key doesn't pass RLS context
  const serviceClient = await createServiceRoleClient();

  const { data: team } = await serviceClient
    .from('teams')
    .select('leader_id')
    .eq('id', teamId)
    .single();

  if (team?.leader_id !== user.id) {
    return { success: false, message: 'Apenas o líder pode editar.' };
  }

  const { error } = await serviceClient
    .from('teams')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', teamId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath(`/team/${teamId}`);
  return { success: true };
}

export async function requestExtraMember(teamId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const db = await createServiceRoleClient();

  // Verify caller is leader
  const { data: team } = await db
    .from('teams')
    .select('leader_id, name')
    .eq('id', teamId)
    .single();

  if (team?.leader_id !== user.id) {
    return { success: false, message: 'Apenas o líder pode pedir um membro.' };
  }

  // Check team has exactly 3 active members
  const { data: members } = await db
    .from('team_members')
    .select(`
      user_id,
      specific_role,
      macro_role,
      profiles!inner (
        name,
        primary_role,
        macro_role,
        seniority,
        profile_interests (interest),
        profile_roles (role)
      )
    `)
    .eq('team_id', teamId)
    .eq('status', 'active');

  if (!members || members.length >= 4) {
    return { success: false, message: 'O time já tem 4 membros.' };
  }
  if (members.length < 3) {
    return { success: false, message: 'O time precisa ter pelo menos 3 membros.' };
  }

  // Build enriched team members for scoring
  const teamMembers: EnrichedPoolUser[] = members.map((m) => {
    const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
    const secondaryRoles = profile.profile_roles?.map((r: { role: string }) => r.role) ?? [];
    return {
      user_id: m.user_id,
      profile_id: '',
      name: profile.name,
      primary_role: profile.primary_role,
      macro_role: profile.macro_role,
      seniority: profile.seniority,
      interests: profile.profile_interests?.map((i: { interest: string }) => i.interest) ?? [],
      waiting_since: new Date().toISOString(),
      flex_macro_roles: getFlexMacroRoles(profile.primary_role, secondaryRoles),
    };
  });

  // Fetch waiting pool candidates
  const { data: poolEntries } = await db
    .from('matchmaking_pool')
    .select(`
      user_id,
      profile_id,
      created_at,
      profiles!inner (
        name,
        primary_role,
        macro_role,
        seniority,
        profile_interests (interest),
        profile_roles (role)
      )
    `)
    .eq('status', 'waiting')
    .order('created_at', { ascending: true });

  if (!poolEntries || poolEntries.length === 0) {
    return { success: false, message: 'Ninguém compatível na fila agora. Tente mais tarde.' };
  }

  // Score each candidate and find the best
  const candidates: { enriched: EnrichedPoolUser; score: number }[] = [];

  const maxWaitMs = Math.max(
    ...poolEntries.map((e) => Date.now() - new Date(e.created_at).getTime()),
    1,
  );

  for (const entry of poolEntries) {
    const profile = Array.isArray(entry.profiles) ? entry.profiles[0] : entry.profiles;
    const secondaryRoles = profile.profile_roles?.map((r: { role: string }) => r.role) ?? [];
    const enriched: EnrichedPoolUser = {
      user_id: entry.user_id,
      profile_id: entry.profile_id,
      name: profile.name,
      primary_role: profile.primary_role,
      macro_role: profile.macro_role,
      seniority: profile.seniority,
      interests: profile.profile_interests?.map((i: { interest: string }) => i.interest) ?? [],
      waiting_since: entry.created_at,
      flex_macro_roles: getFlexMacroRoles(profile.primary_role, secondaryRoles),
    };

    const score = scoreCandidate(enriched, teamMembers, maxWaitMs, MATCHMAKING_CONFIG.weights);
    candidates.push({ enriched, score });
  }

  // Sort by score descending, pick best above threshold
  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];

  if (!best || best.score < MIN_EXTRA_MEMBER_SCORE) {
    return { success: false, message: 'Ninguém compatível na fila agora. Tente mais tarde.' };
  }

  // Add to team
  const { error: insertError } = await db
    .from('team_members')
    .insert({
      team_id: teamId,
      user_id: best.enriched.user_id,
      specific_role: best.enriched.primary_role,
      macro_role: best.enriched.macro_role,
      is_leader: false,
      status: 'active',
    });

  if (insertError) {
    return { success: false, message: 'Erro ao adicionar membro. Tente novamente.' };
  }

  // Mark pool entry as assigned
  await db
    .from('matchmaking_pool')
    .update({ status: 'assigned', updated_at: new Date().toISOString() })
    .eq('user_id', best.enriched.user_id)
    .eq('status', 'waiting');

  // Send email notification
  const { data: newUserData } = await db
    .from('users')
    .select('email')
    .eq('id', best.enriched.user_id)
    .single();

  if (newUserData?.email && team?.name) {
    await sendMatchNotification(newUserData.email, team.name);
  }

  await trackEvent({
    event: 'matched_to_team',
    userId: best.enriched.user_id,
    route: `/team/${teamId}`,
    properties: { team_id: teamId, source: 'leader_request' },
  });

  revalidatePath(`/team/${teamId}`);
  return { success: true, memberName: best.enriched.name };
}
