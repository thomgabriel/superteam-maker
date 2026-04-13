-- Atomic team deactivation for maintenance jobs
-- Keeps teams and team_members in sync in a single database transaction.

CREATE OR REPLACE FUNCTION deactivate_team_and_members(p_team_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE teams
  SET status = 'inactive',
      updated_at = now()
  WHERE id = p_team_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  UPDATE team_members
  SET status = 'inactive'
  WHERE team_id = p_team_id
    AND status = 'active';

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION deactivate_team_and_members(uuid) FROM public;
GRANT EXECUTE ON FUNCTION deactivate_team_and_members(uuid) TO service_role;
