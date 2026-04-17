-- C.7 Leader-dormant detection + member-initiated re-claim.
--
-- When a team leader has been inactive >72h, maintenance flags the team
-- (leader_dormant_at = now()). Members see a "convocar nova liderança" button
-- that opens re-claim. This is member-initiated on purpose — we never silently
-- demote an active-but-quiet leader.
--
-- Rollback notes: revert code that reads/writes leader_dormant_at; do NOT drop
-- the column (§5 rule #2).

ALTER TABLE teams ADD COLUMN IF NOT EXISTS leader_dormant_at timestamptz;
CREATE INDEX IF NOT EXISTS teams_leader_dormant ON teams(leader_dormant_at)
  WHERE leader_dormant_at IS NOT NULL;

-- request_leader_reclaim
-- RPC is service-role only. Caller is verified in the TS server action;
-- p_user_id is the already-authenticated requester passed in explicitly
-- (service-role client has auth.uid()=NULL).
-- Atomic: captures previous leader for audit, clears leader_id +
-- is_leader flag, transitions team back to pending_activation with a fresh
-- 24h claim deadline, writes an audit row to notification_events.
CREATE OR REPLACE FUNCTION request_leader_reclaim(p_team_id uuid, p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_previous_leader_id uuid;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'missing_user_id');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM team_members
    WHERE team_id = p_team_id
      AND user_id = p_user_id
      AND status = 'active'
  ) THEN
    RETURN jsonb_build_object('success', false, 'message', 'not_member');
  END IF;

  SELECT leader_id INTO v_previous_leader_id
  FROM teams
  WHERE id = p_team_id
    AND leader_dormant_at IS NOT NULL
    AND status = 'active'
    AND submitted_at IS NULL;

  IF v_previous_leader_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'not_dormant');
  END IF;

  UPDATE teams
  SET leader_id = NULL,
      leader_claimed_at = NULL,
      leader_dormant_at = NULL,
      status = 'pending_activation',
      activation_deadline_at = now() + interval '24 hours',
      updated_at = now()
  WHERE id = p_team_id
    AND leader_dormant_at IS NOT NULL
    AND status = 'active'
    AND submitted_at IS NULL;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'not_dormant');
  END IF;

  UPDATE team_members
  SET is_leader = false
  WHERE team_id = p_team_id AND is_leader = true;

  INSERT INTO notification_events (kind, subject_team_id, subject_user_id, payload)
  VALUES (
    'admin_action',
    p_team_id,
    v_previous_leader_id,
    jsonb_build_object(
      'action', 'leader_reclaim_requested',
      'requested_by_user_id', p_user_id,
      'previous_leader_id', v_previous_leader_id
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'previous_leader_id', v_previous_leader_id
  );
END;
$$;

-- RPC is service-role only. The flag gate lives in the TS server action
-- (src/app/(app)/team/[id]/dormant-actions.ts), which calls this via a
-- service-role client only after verifying LEADER_DORMANT_RECLAIM=true AND
-- that the caller is an authenticated member of the team. Granting this
-- directly to `authenticated` would let clients bypass the flag by calling
-- the RPC over PostgREST.
REVOKE ALL ON FUNCTION request_leader_reclaim(uuid, uuid) FROM public;
GRANT EXECUTE ON FUNCTION request_leader_reclaim(uuid, uuid) TO service_role;

-- detect_dormant_leaders
-- Maintenance function called from the matchmaking cron. Flags teams whose
-- leader has been inactive for 72+ hours. Emits in-app notifications to all
-- members (handled in application layer; this just sets the flag).
CREATE OR REPLACE FUNCTION detect_dormant_leaders()
RETURNS TABLE (team_id uuid, leader_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Auto-clear: a leader who was flagged dormant but has visited the team
  -- page within the last 72h gets un-flagged. Prevents stale
  -- `leader_dormant_at` from showing a misleading banner once the leader is
  -- active again.
  UPDATE teams t
  SET leader_dormant_at = NULL,
      updated_at = now()
  FROM team_members tm
  WHERE t.leader_id = tm.user_id
    AND tm.status = 'active'
    AND t.leader_dormant_at IS NOT NULL
    AND tm.last_active_at >= now() - interval '72 hours';

  RETURN QUERY
  UPDATE teams t
  SET leader_dormant_at = now(),
      updated_at = now()
  FROM team_members tm
  WHERE t.leader_id = tm.user_id
    AND tm.status = 'active'
    AND t.status = 'active'
    AND t.leader_dormant_at IS NULL
    AND tm.last_active_at < now() - interval '72 hours'
  RETURNING t.id AS team_id, t.leader_id;
END;
$$;
