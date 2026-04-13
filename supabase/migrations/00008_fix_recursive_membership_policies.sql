-- Replace recursive membership policies with SECURITY DEFINER helpers.

CREATE OR REPLACE FUNCTION is_active_team_member(p_team_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM team_members
    WHERE user_id = auth.uid()
      AND team_id = p_team_id
      AND status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION shares_active_team_with_user(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM team_members me
    JOIN team_members teammate
      ON teammate.team_id = me.team_id
    WHERE me.user_id = auth.uid()
      AND me.status = 'active'
      AND teammate.user_id = p_user_id
      AND teammate.status = 'active'
  );
$$;

REVOKE ALL ON FUNCTION is_active_team_member(uuid) FROM public;
GRANT EXECUTE ON FUNCTION is_active_team_member(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION shares_active_team_with_user(uuid) FROM public;
GRANT EXECUTE ON FUNCTION shares_active_team_with_user(uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "profiles_teammate_read" ON profiles;
CREATE POLICY "profiles_teammate_read" ON profiles
  FOR SELECT TO authenticated
  USING (shares_active_team_with_user(user_id));

DROP POLICY IF EXISTS "teams_member_read" ON teams;
CREATE POLICY "teams_member_read" ON teams
  FOR SELECT TO authenticated
  USING (is_active_team_member(id));

DROP POLICY IF EXISTS "team_members_read" ON team_members;
CREATE POLICY "team_members_read" ON team_members
  FOR SELECT TO authenticated
  USING (is_active_team_member(team_id));
