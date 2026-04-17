-- A.4 — Matchmaking concurrency guard + crash recovery.
--
-- Two RPCs that bookend every matchmaking run:
--   begin_matchmaking_run(trigger_source) — called first:
--     1. Marks any stale 'running' rows (started_at > 10 min ago) as failed.
--     2. Tries to grab pg_try_advisory_xact_lock(hashtext('matchmaking')).
--        If another run is already holding it, returns NULL (caller must 409).
--     3. Inserts a new matchmaking_runs row with status='running' and returns the id.
--
--   end_matchmaking_run(run_id, p_status, p_error, p_teams_formed, p_users_matched,
--                       p_replacements_performed, p_pool_size, p_notes)
--     Finalizes the run. Called from the success path (status='completed') or
--     the catch path (status='failed').
--
-- Note: because pg_advisory_xact_lock is auto-released at transaction end, and
-- each RPC call is its own transaction, the lock in begin_matchmaking_run is
-- released the moment the function returns. That's intentional — the lock only
-- exists to serialize the *claim* of a new run row. Real in-flight protection
-- comes from (a) the status='running' row the caller just created and
-- (b) the stale-run cleanup at the top of begin.
--
-- rollback notes:
--   - Revert the route handler to call runMatchmakingJob directly (pre-A.4 code path).
--   - Optional: DROP FUNCTION begin_matchmaking_run, end_matchmaking_run (additive — safe).
--   - Per §5 rule #2, prefer leaving functions in place unless explicitly cleaning up.

CREATE OR REPLACE FUNCTION begin_matchmaking_run(p_trigger_source text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_lock_acquired boolean;
  v_run_id uuid;
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

  -- 2. Try to grab the advisory lock. If we can't, a concurrent run is inside
  --    this function right now — caller should 409.
  v_lock_acquired := pg_try_advisory_xact_lock(hashtext('matchmaking'));

  IF NOT v_lock_acquired THEN
    RETURN NULL;
  END IF;

  -- 3. Create the run row.
  INSERT INTO matchmaking_runs (trigger_source, status)
  VALUES (p_trigger_source, 'running')
  RETURNING id INTO v_run_id;

  RETURN v_run_id;
END;
$$;

CREATE OR REPLACE FUNCTION end_matchmaking_run(
  p_run_id uuid,
  p_status text,
  p_error text DEFAULT NULL,
  p_teams_formed int DEFAULT 0,
  p_users_matched int DEFAULT 0,
  p_replacements_performed int DEFAULT 0,
  p_pool_size int DEFAULT 0,
  p_notes text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF p_status NOT IN ('completed', 'failed') THEN
    RAISE EXCEPTION 'invalid_end_status' USING ERRCODE = 'P0001';
  END IF;

  UPDATE matchmaking_runs
  SET status = p_status,
      error_message = p_error,
      teams_formed = COALESCE(p_teams_formed, 0),
      users_matched = COALESCE(p_users_matched, 0),
      replacements_performed = COALESCE(p_replacements_performed, 0),
      pool_size = COALESCE(p_pool_size, 0),
      notes = p_notes,
      finished_at = now()
  WHERE id = p_run_id;

  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION begin_matchmaking_run(text) FROM public;
GRANT EXECUTE ON FUNCTION begin_matchmaking_run(text) TO service_role;

REVOKE ALL ON FUNCTION end_matchmaking_run(uuid, text, text, int, int, int, int, text) FROM public;
GRANT EXECUTE ON FUNCTION end_matchmaking_run(uuid, text, text, int, int, int, int, text) TO service_role;
