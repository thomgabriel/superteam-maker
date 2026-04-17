-- A.2 — Serialize leader-triggered extra-member assignment per team with a
-- transaction-scoped advisory lock. Concurrent calls for the same team will
-- bail out instead of racing on the pool scan + assign loop.
--
-- The RPC accepts a pre-ranked list of candidate user ids (TS side does scoring
-- with service-role data). Inside the lock it calls assign_pool_candidate_to_team
-- in order until one succeeds or the list is exhausted.
--
-- rollback notes:
--   - Revert the TS caller to loop assign_pool_candidate_to_team directly (pre-A.2 behavior).
--   - Optional: DROP FUNCTION rpc_request_extra_member_locked; (safe — additive function).
--   - Per §5 rule #2, we leave the function in place post-rollback unless explicitly cleaning up.

CREATE OR REPLACE FUNCTION rpc_request_extra_member_locked(
  p_team_id uuid,
  p_candidate_user_ids uuid[]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_is_leader boolean;
  v_lock_acquired boolean;
  v_candidate_id uuid;
  v_assignment jsonb;
  v_last_code text;
BEGIN
  IF v_caller IS NULL THEN
    RETURN jsonb_build_object('success', false, 'code', 'not_authenticated');
  END IF;

  -- 1. Verify caller is leader of the target team (mirrors the check inside
  --    assign_pool_candidate_to_team but fails fast before we touch the lock).
  SELECT EXISTS(
    SELECT 1 FROM teams
    WHERE id = p_team_id
      AND leader_id = v_caller
  ) INTO v_is_leader;

  IF NOT v_is_leader THEN
    RETURN jsonb_build_object('success', false, 'code', 'not_leader');
  END IF;

  -- 2. Try to acquire a transaction-scoped advisory lock keyed on the team id.
  --    If another concurrent request is already running for the same team we
  --    return a clean busy code instead of queueing.
  v_lock_acquired := pg_try_advisory_xact_lock(hashtext('team:' || p_team_id::text));

  IF NOT v_lock_acquired THEN
    RETURN jsonb_build_object('success', false, 'code', 'concurrent_request');
  END IF;

  -- 3. Walk the candidate list in order; first successful assignment wins.
  IF p_candidate_user_ids IS NULL OR array_length(p_candidate_user_ids, 1) IS NULL THEN
    RETURN jsonb_build_object('success', false, 'code', 'no_candidates');
  END IF;

  FOREACH v_candidate_id IN ARRAY p_candidate_user_ids LOOP
    v_assignment := assign_pool_candidate_to_team(p_team_id, v_candidate_id);

    IF (v_assignment ->> 'success')::boolean THEN
      RETURN jsonb_build_object(
        'success', true,
        'assigned_user_id', v_candidate_id
      );
    END IF;

    v_last_code := v_assignment ->> 'code';

    -- team_full is terminal — no point trying further candidates.
    IF v_last_code = 'team_full' THEN
      RETURN jsonb_build_object('success', false, 'code', 'team_full');
    END IF;

    -- Otherwise: already_claimed / already_assigned / no_profile / not_leader — try next.
  END LOOP;

  RETURN jsonb_build_object(
    'success', false,
    'code', COALESCE(v_last_code, 'no_candidates')
  );
END;
$$;

REVOKE ALL ON FUNCTION rpc_request_extra_member_locked(uuid, uuid[]) FROM public;
GRANT EXECUTE ON FUNCTION rpc_request_extra_member_locked(uuid, uuid[]) TO authenticated, service_role;
