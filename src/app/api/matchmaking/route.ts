import { NextResponse } from 'next/server';
import { runMatchmakingJob } from '@/lib/matchmaking/job';
import { logError, logInfo } from '@/lib/monitoring';
import { hasValidCronAuthorization } from '@/lib/security';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!hasValidCronAuthorization(authHeader, process.env.CRON_SECRET)) {
    logInfo('matchmaking.route.unauthorized');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startedAt = Date.now();

  try {
    const result = await runMatchmakingJob({ triggerSource: 'cron' });
    logInfo('matchmaking.route.completed', {
      durationMs: Date.now() - startedAt,
      poolSize: result.poolSize,
      teamsFormed: result.teamsFormed,
      usersMatched: result.usersMatched,
      replacementsPerformed: result.replacementsPerformed,
      roundNumber: result.roundNumber,
    });
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
    logError('matchmaking.route.failed', error, {
      durationMs: Date.now() - startedAt,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
