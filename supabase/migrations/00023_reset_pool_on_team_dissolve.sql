CREATE OR REPLACE FUNCTION deactivate_team_and_members(p_team_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE teams
  SET status = 'inactive', updated_at = now()
  WHERE id = p_team_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Reset pool BEFORE moving members so the subquery still matches active rows.
  UPDATE matchmaking_pool
  SET status = 'waiting', updated_at = now()
  WHERE user_id IN (
    SELECT user_id FROM team_members
    WHERE team_id = p_team_id AND status = 'active'
  );

  UPDATE team_members
  SET status = 'inactive'
  WHERE team_id = p_team_id AND status = 'active';

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.dissolve_team_pre_activation(
  p_team_id uuid,
  p_reason text DEFAULT 'confirmation_failed'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_current_status text;
BEGIN
  SELECT status INTO v_current_status FROM public.teams WHERE id = p_team_id FOR UPDATE;

  IF v_current_status IS NULL OR v_current_status = 'inactive' THEN
    RETURN false;
  END IF;

  UPDATE public.teams
  SET status = 'inactive',
      dissolution_reason = COALESCE(NULLIF(trim(p_reason), ''), 'confirmation_failed'),
      updated_at = now()
  WHERE id = p_team_id;

  UPDATE public.matchmaking_pool
  SET status = 'waiting', updated_at = now()
  WHERE user_id IN (
    SELECT user_id FROM public.team_members
    WHERE team_id = p_team_id AND status = 'active'
  );

  UPDATE public.team_members
  SET status = 'replaced', replaced_at = now()
  WHERE team_id = p_team_id AND status = 'active';

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION admin_force_dissolve_team(
  p_team_id uuid,
  p_reason text DEFAULT 'manual_admin'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_current_status text;
  v_members_moved int;
BEGIN
  SELECT status INTO v_current_status FROM teams WHERE id = p_team_id;

  IF v_current_status IS NULL THEN
    RETURN jsonb_build_object('success', false, 'code', 'team_not_found');
  END IF;

  IF v_current_status = 'inactive' THEN
    RETURN jsonb_build_object('success', false, 'code', 'already_inactive');
  END IF;

  UPDATE teams
  SET status = 'inactive',
      dissolution_reason = COALESCE(NULLIF(trim(p_reason), ''), 'manual_admin'),
      updated_at = now()
  WHERE id = p_team_id;

  UPDATE matchmaking_pool
  SET status = 'waiting', updated_at = now()
  WHERE user_id IN (
    SELECT user_id FROM team_members
    WHERE team_id = p_team_id AND status = 'active'
  );

  UPDATE team_members
  SET status = 'replaced', replaced_at = now()
  WHERE team_id = p_team_id AND status = 'active';

  GET DIAGNOSTICS v_members_moved = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'members_moved', v_members_moved,
    'dissolution_reason', COALESCE(NULLIF(trim(p_reason), ''), 'manual_admin')
  );
END;
$$;

REVOKE ALL ON FUNCTION deactivate_team_and_members(uuid) FROM public;
GRANT EXECUTE ON FUNCTION deactivate_team_and_members(uuid) TO service_role;

REVOKE ALL ON FUNCTION public.dissolve_team_pre_activation(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.dissolve_team_pre_activation(uuid, text) TO service_role;

REVOKE ALL ON FUNCTION admin_force_dissolve_team(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION admin_force_dissolve_team(uuid, text) TO service_role;
