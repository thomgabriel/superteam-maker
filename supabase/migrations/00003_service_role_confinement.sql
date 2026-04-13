-- ============================================
-- Service-role confinement RPCs
-- All functions use auth.uid() — never trust caller-supplied user IDs.
-- ============================================

-- 1. update_member_last_active
-- Called from team page / reveal page on load.
-- Uses auth.uid() so only the session owner's row is touched.

CREATE OR REPLACE FUNCTION update_member_last_active(p_team_id uuid)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_updated int;
BEGIN
  UPDATE team_members
  SET last_active_at = now()
  WHERE team_id = p_team_id
    AND user_id = auth.uid()
    AND status = 'active';

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated;
END;
$$;

-- 2. claim_team_leadership
-- Atomic: membership check → team update (optimistic lock) → member flag.
-- Uses auth.uid() for both membership check and leader assignment.

CREATE OR REPLACE FUNCTION claim_team_leadership(p_team_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_is_member boolean;
  v_team_updated int;
  v_member_flagged int;
BEGIN
  -- 1. Verify membership
  SELECT EXISTS(
    SELECT 1 FROM team_members
    WHERE team_id = p_team_id
      AND user_id = v_caller
      AND status = 'active'
  ) INTO v_is_member;

  IF NOT v_is_member THEN
    RETURN jsonb_build_object('success', false, 'message', 'not_member');
  END IF;

  -- 2. Optimistic lock on leader_id
  UPDATE teams
  SET leader_id = v_caller,
      leader_claimed_at = now(),
      status = 'active'
  WHERE id = p_team_id
    AND leader_id IS NULL;

  GET DIAGNOSTICS v_team_updated = ROW_COUNT;

  IF v_team_updated = 0 THEN
    RETURN jsonb_build_object('success', false, 'message', 'already_claimed');
  END IF;

  -- 3. Flag member as leader
  UPDATE team_members
  SET is_leader = true
  WHERE team_id = p_team_id
    AND user_id = v_caller;

  GET DIAGNOSTICS v_member_flagged = ROW_COUNT;

  IF v_member_flagged = 0 THEN
    RAISE EXCEPTION 'member_flag_failed'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- 3. assign_pool_candidate_to_team
-- Atomic: leader check → pool claim → team_member insert.
-- Uses auth.uid() for leader verification.
-- Derives role/macro_role from candidate's profile (DB is source of truth).

CREATE OR REPLACE FUNCTION assign_pool_candidate_to_team(
  p_team_id uuid,
  p_candidate_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_is_leader boolean;
  v_pool_claimed int;
  v_role text;
  v_macro_role text;
BEGIN
  -- 1. Verify caller is leader
  SELECT EXISTS(
    SELECT 1 FROM teams
    WHERE id = p_team_id
      AND leader_id = v_caller
  ) INTO v_is_leader;

  IF NOT v_is_leader THEN
    RETURN jsonb_build_object('success', false, 'code', 'not_leader');
  END IF;

  -- 2. Read candidate role from profile (DB as source of truth)
  SELECT p.primary_role, p.macro_role
  INTO v_role, v_macro_role
  FROM profiles p
  WHERE p.user_id = p_candidate_user_id;

  IF v_role IS NULL THEN
    RETURN jsonb_build_object('success', false, 'code', 'no_profile');
  END IF;

  -- 3. Claim pool entry (optimistic lock on status)
  UPDATE matchmaking_pool
  SET status = 'assigned',
      updated_at = now()
  WHERE user_id = p_candidate_user_id
    AND status = 'waiting';

  GET DIAGNOSTICS v_pool_claimed = ROW_COUNT;

  IF v_pool_claimed = 0 THEN
    RETURN jsonb_build_object('success', false, 'code', 'already_claimed');
  END IF;

  -- 4. Insert team member
  BEGIN
    INSERT INTO team_members (team_id, user_id, specific_role, macro_role, is_leader, status)
    VALUES (p_team_id, p_candidate_user_id, v_role, v_macro_role, false, 'active');
  EXCEPTION
    WHEN raise_exception THEN
      -- enforce_max_active_team_members trigger
      UPDATE matchmaking_pool
      SET status = 'waiting', updated_at = now()
      WHERE user_id = p_candidate_user_id AND status = 'assigned';
      RETURN jsonb_build_object('success', false, 'code', 'team_full');
    WHEN unique_violation THEN
      -- uniq_team_members_active_user: candidate already active on another team
      UPDATE matchmaking_pool
      SET status = 'waiting', updated_at = now()
      WHERE user_id = p_candidate_user_id AND status = 'assigned';
      RETURN jsonb_build_object('success', false, 'code', 'already_assigned');
  END;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ============================================
-- Permissions: only authenticated and service_role can call these
-- ============================================

REVOKE ALL ON FUNCTION update_member_last_active(uuid) FROM public;
GRANT EXECUTE ON FUNCTION update_member_last_active(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION claim_team_leadership(uuid) FROM public;
GRANT EXECUTE ON FUNCTION claim_team_leadership(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION assign_pool_candidate_to_team(uuid, uuid) FROM public;
GRANT EXECUTE ON FUNCTION assign_pool_candidate_to_team(uuid, uuid) TO authenticated, service_role;
