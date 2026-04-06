import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { runMatchmaking, type FormedTeam } from '@/lib/matchmaking/engine';
import { sendMatchNotification } from '@/lib/email';
import type { EnrichedPoolUser } from '@/types/database';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // --- REPLACEMENT LOGIC (runs before new matching) ---

  // 1. Leader reclaim: reset leader if claimed >24h ago and team still pending
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  await supabase
    .from('teams')
    .update({
      leader_id: null,
      leader_claimed_at: null,
      status: 'pending_activation',
      updated_at: new Date().toISOString(),
    })
    .eq('status', 'pending_activation')
    .lt('leader_claimed_at', twentyFourHoursAgo);

  // 2. Deactivate teams past activation deadline with no leader
  await supabase
    .from('teams')
    .update({ status: 'inactive', updated_at: new Date().toISOString() })
    .eq('status', 'pending_activation')
    .is('leader_id', null)
    .lt('activation_deadline_at', new Date().toISOString());

  // 3. Replace inactive members (last_active_at > 48h)
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { data: inactiveMembers } = await supabase
    .from('team_members')
    .select('id, team_id, user_id, specific_role, macro_role')
    .eq('status', 'active')
    .lt('last_active_at', fortyEightHoursAgo);

  if (inactiveMembers && inactiveMembers.length > 0) {
    for (const member of inactiveMembers) {
      await supabase
        .from('team_members')
        .update({ status: 'replaced', replaced_at: new Date().toISOString() })
        .eq('id', member.id);

      await supabase
        .from('matchmaking_pool')
        .delete()
        .eq('user_id', member.user_id);

      const { data: replacement } = await supabase
        .from('matchmaking_pool')
        .select('user_id, profile_id')
        .eq('status', 'waiting')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (replacement) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('primary_role, macro_role')
          .eq('user_id', replacement.user_id)
          .single();

        if (profile) {
          await supabase.from('team_members').insert({
            team_id: member.team_id,
            user_id: replacement.user_id,
            specific_role: profile.primary_role,
            macro_role: profile.macro_role,
          });

          await supabase
            .from('matchmaking_pool')
            .update({ status: 'assigned', updated_at: new Date().toISOString() })
            .eq('user_id', replacement.user_id);
        }
      }
    }

    const affectedTeamIds = [...new Set(inactiveMembers.map((m) => m.team_id))];
    for (const teamId of affectedTeamIds) {
      const { count } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId)
        .eq('status', 'active');

      if ((count ?? 0) < 3) {
        await supabase
          .from('teams')
          .update({ status: 'inactive', updated_at: new Date().toISOString() })
          .eq('id', teamId);
      }
    }
  }

  // --- END REPLACEMENT LOGIC ---

  const { data: poolEntries, error: poolError } = await supabase
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
        profile_interests (interest)
      )
    `)
    .eq('status', 'waiting')
    .order('created_at', { ascending: true });

  if (poolError || !poolEntries) {
    return NextResponse.json({ error: poolError?.message }, { status: 500 });
  }

  if (poolEntries.length < 3) {
    return NextResponse.json({ message: 'Pool too small', size: poolEntries.length });
  }

  const enrichedPool: EnrichedPoolUser[] = poolEntries.map((entry: any) => ({
    user_id: entry.user_id,
    profile_id: entry.profile_id,
    name: entry.profiles.name,
    primary_role: entry.profiles.primary_role,
    macro_role: entry.profiles.macro_role,
    seniority: entry.profiles.seniority,
    interests: entry.profiles.profile_interests.map((pi: any) => pi.interest),
    waiting_since: entry.created_at,
  }));

  const { count } = await supabase
    .from('teams')
    .select('*', { count: 'exact', head: true });
  const roundNumber = Math.floor((count ?? 0) / 10);

  const teams: FormedTeam[] = runMatchmaking(enrichedPool, roundNumber);

  if (teams.length === 0) {
    return NextResponse.json({ message: 'No teams formed', pool: enrichedPool.length });
  }

  for (const team of teams) {
    const { data: teamRow, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: team.name,
        status: 'pending_activation',
        round_number: roundNumber,
        activation_deadline_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (teamError || !teamRow) continue;

    await supabase.from('team_members').insert(
      team.members.map((member) => ({
        team_id: teamRow.id,
        user_id: member.user_id,
        specific_role: member.primary_role,
        macro_role: member.macro_role,
      })),
    );

    await supabase
      .from('matchmaking_pool')
      .update({
        status: 'assigned',
        round_number: roundNumber,
        updated_at: new Date().toISOString(),
      })
      .in('user_id', team.members.map((m) => m.user_id));

    // Send email notifications to all matched users (fire-and-forget)
    const { data: matchedUsers } = await supabase
      .from('users')
      .select('email')
      .in('id', team.members.map((m) => m.user_id));

    if (matchedUsers) {
      await Promise.allSettled(
        matchedUsers.map((u) => sendMatchNotification(u.email, team.name)),
      );
    }
  }

  return NextResponse.json({
    teams_formed: teams.length,
    users_matched: teams.reduce((sum, t) => sum + t.members.length, 0),
    round: roundNumber,
  });
}
