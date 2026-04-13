-- UX Phase 1

-- 1. WhatsApp group link for teams
ALTER TABLE teams ADD COLUMN IF NOT EXISTS whatsapp_group_url text;

-- 2. Requeue RPC: atomic member cleanup + pool re-entry
-- Needed because team_members has no UPDATE RLS policy for authenticated users.
CREATE OR REPLACE FUNCTION reenter_matchmaking_pool()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_profile_id uuid;
  v_existing_pool_status text;
BEGIN
  -- 1. Get profile ID (required for pool entry)
  SELECT id INTO v_profile_id FROM profiles WHERE user_id = v_caller;
  IF v_profile_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'code', 'no_profile');
  END IF;

  -- 2. Guard: reject if caller has an active membership on a non-inactive team
  -- Prevents active/matched users from bypassing the app-level state guard
  IF EXISTS(
    SELECT 1 FROM team_members tm
    JOIN teams t ON t.id = tm.team_id
    WHERE tm.user_id = v_caller
      AND tm.status = 'active'
      AND t.status <> 'inactive'
  ) THEN
    RETURN jsonb_build_object('success', false, 'code', 'still_on_team');
  END IF;

  -- 3. Deactivate any active membership on an inactive team
  UPDATE team_members
  SET status = 'inactive'
  WHERE user_id = v_caller
    AND status = 'active'
    AND team_id IN (SELECT id FROM teams WHERE status = 'inactive');

  -- 4. Idempotent pool entry
  SELECT status INTO v_existing_pool_status
  FROM matchmaking_pool WHERE user_id = v_caller;

  IF v_existing_pool_status = 'waiting' THEN
    RETURN jsonb_build_object('success', true, 'code', 'already_waiting');
  ELSIF v_existing_pool_status = 'assigned' THEN
    UPDATE matchmaking_pool
    SET status = 'waiting', updated_at = now()
    WHERE user_id = v_caller;
  ELSE
    INSERT INTO matchmaking_pool (user_id, profile_id, status)
    VALUES (v_caller, v_profile_id, 'waiting');
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION reenter_matchmaking_pool() FROM public;
GRANT EXECUTE ON FUNCTION reenter_matchmaking_pool() TO authenticated, service_role;
