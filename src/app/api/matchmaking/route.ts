import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { runMatchmakingJob } from '@/lib/matchmaking/job';
import { logError, logInfo } from '@/lib/monitoring';
import { hasValidCronAuthorization } from '@/lib/security';

// Cron matchmaking entrypoint.
//
// Rotate CRON_SECRET in Vercel env (Project Settings → Environment Variables)
// whenever this route is redeployed with sensitive changes. Do NOT rotate it
// in .env.local via this commit; dev rotation happens out-of-band.
//
// Concurrency model:
//   1. begin_matchmaking_run('cron') reaps stale 'running' rows (>10min old),
//      tries to grab a pg_try_advisory_xact_lock, and creates a new run row.
//      Returns NULL if another begin() is currently executing (busy) — caller
//      responds 409.
//   2. runMatchmakingJob performs the actual matchmaking work.
//   3. end_matchmaking_run(runId, 'completed' | 'failed', ...) finalizes the
//      canonical run row. We finalize even if the job threw, so a crashed run
//      never wedges the scheduler by leaving a 'running' row behind.
//
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!hasValidCronAuthorization(authHeader, process.env.CRON_SECRET)) {
    logInfo('matchmaking.route.unauthorized');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startedAt = Date.now();
  const db = await createServiceRoleClient();

  // 1. Try to begin a run. Null means another run is holding the lock.
  const { data: runIdRaw, error: beginError } = await db.rpc('begin_matchmaking_run', {
    p_trigger_source: 'cron',
  });

  if (beginError) {
    logError('matchmaking.route.begin_failed', beginError, {
      durationMs: Date.now() - startedAt,
    });
    return NextResponse.json(
      { error: 'Failed to begin matchmaking run' },
      { status: 500 },
    );
  }

  const runId = typeof runIdRaw === 'string' ? runIdRaw : null;

  if (!runId) {
    logInfo('matchmaking.route.busy');
    return NextResponse.json(
      { error: 'Another matchmaking run is currently in progress.' },
      { status: 409 },
    );
  }

  // 2. Do the work. Track failures via end_matchmaking_run('failed', ...).
  try {
    const result = await runMatchmakingJob({ triggerSource: 'cron', runId });

    await db.rpc('end_matchmaking_run', {
      p_run_id: runId,
      p_status: 'completed',
      p_error: null,
      p_teams_formed: result.teamsFormed,
      p_users_matched: result.usersMatched,
      p_replacements_performed: result.replacementsPerformed,
      p_pool_size: result.poolSize,
      p_notes: result.notes.join('; ') || null,
    });

    logInfo('matchmaking.route.completed', {
      runId,
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

    // Best-effort finalize so the stale-run reaper doesn't have to clean up.
    const { error: endError } = await db.rpc('end_matchmaking_run', {
      p_run_id: runId,
      p_status: 'failed',
      p_error: message,
    });

    if (endError) {
      logError('matchmaking.route.end_failed', endError, { runId });
    }

    logError('matchmaking.route.failed', error, {
      runId,
      durationMs: Date.now() - startedAt,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
