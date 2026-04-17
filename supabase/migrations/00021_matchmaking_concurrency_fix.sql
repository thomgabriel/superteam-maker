-- A.4 follow-up — close the concurrency gap flagged in review.
--
-- The earlier version only held the advisory lock through begin_matchmaking_run()
-- itself. Because the lock is xact-scoped, it was released the moment the RPC
-- returned — leaving the actual matchmaking work outside the lock. Two cron
-- hits 100ms apart could both pass begin(), each get a run_id, and execute
-- runMatchmakingJob concurrently.
--
-- Fix: inside the critical section (while we hold the lock), also reject if
-- there's an existing fresh 'running' row. Combined with the stale reaper at
-- the top, this ensures at most one non-stale run can exist at any time. The
-- lock serializes the check-and-insert; the status='running' row that the
-- winner just wrote blocks any subsequent begin() until end_matchmaking_run
-- marks it completed/failed (or the stale reaper cleans it up after 10 min).
--
-- Rollback notes: revert route handler to tolerate overlap (not recommended)
-- or re-apply original function body. No schema changes here — function only.

CREATE OR REPLACE FUNCTION begin_matchmaking_run(p_trigger_source text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_lock_acquired boolean;
  v_run_id uuid;
  v_active_count int;
BEGIN
  IF p_trigger_source IS NULL OR p_trigger_source NOT IN ('cron', 'admin') THEN
    RAISE EXCEPTION 'invalid_trigger_source' USING ERRCODE = 'P0001';
  END IF;

  -- 1. Reap stale 'running' rows (crashed runs that never wrote a terminal status).
  UPDATE matchmaking_runs
  SET status = 'failed',
      error_message = COALESCE(error_message, 'stale: presumed crashed'),
      finished_at = now()
  WHERE status = 'running'
    AND started_at < now() - interval '10 minutes';

  -- 2. Try to grab the advisory lock. If we can't, another call to begin() is
  --    currently in its critical section — caller should 409.
  v_lock_acquired := pg_try_advisory_xact_lock(hashtext('matchmaking'));

  IF NOT v_lock_acquired THEN
    RETURN NULL;
  END IF;

  -- 3. While holding the lock, reject if a fresh 'running' row already exists.
  --    That row belongs to another in-flight job that passed begin() earlier
  --    and is currently running outside the lock. Letting this caller proceed
  --    would produce two concurrent matchmaking jobs.
  SELECT count(*) INTO v_active_count
  FROM matchmaking_runs
  WHERE status = 'running';

  IF v_active_count > 0 THEN
    RETURN NULL;
  END IF;

  -- 4. Safe to create the run row. Any concurrent begin() after this point
  --    will see the fresh 'running' row and bail out at step 3.
  INSERT INTO matchmaking_runs (trigger_source, status)
  VALUES (p_trigger_source, 'running')
  RETURNING id INTO v_run_id;

  RETURN v_run_id;
END;
$$;

REVOKE ALL ON FUNCTION begin_matchmaking_run(text) FROM public;
GRANT EXECUTE ON FUNCTION begin_matchmaking_run(text) TO service_role;
