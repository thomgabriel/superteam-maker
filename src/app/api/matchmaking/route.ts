import { NextResponse } from 'next/server';
import { runMatchmakingJob } from '@/lib/matchmaking/job';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runMatchmakingJob({ triggerSource: 'cron' });
    return NextResponse.json({
      pool_size: result.poolSize,
      teams_formed: result.teamsFormed,
      users_matched: result.usersMatched,
      replacements_performed: result.replacementsPerformed,
      round: result.roundNumber,
      notes: result.notes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown matchmaking error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
