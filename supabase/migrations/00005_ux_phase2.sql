-- UX Phase 2

-- 1. Team readiness toggle
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS is_ready boolean DEFAULT false;

-- 2. Toggle readiness RPC
CREATE OR REPLACE FUNCTION toggle_member_ready(p_team_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_new_value boolean;
BEGIN
  UPDATE team_members
  SET is_ready = NOT is_ready
  WHERE team_id = p_team_id
    AND user_id = auth.uid()
    AND status = 'active'
  RETURNING is_ready INTO v_new_value;

  IF v_new_value IS NULL THEN
    RETURN jsonb_build_object('success', false, 'code', 'not_member');
  END IF;

  RETURN jsonb_build_object('success', true, 'is_ready', v_new_value);
END;
$$;

REVOKE ALL ON FUNCTION toggle_member_ready(uuid) FROM public;
GRANT EXECUTE ON FUNCTION toggle_member_ready(uuid) TO authenticated, service_role;

-- 3. Queue context: pool count RPC
CREATE OR REPLACE FUNCTION get_waiting_pool_count()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN (SELECT count(*) FROM matchmaking_pool WHERE status = 'waiting');
END;
$$;

REVOKE ALL ON FUNCTION get_waiting_pool_count() FROM public;
GRANT EXECUTE ON FUNCTION get_waiting_pool_count() TO authenticated, service_role;
