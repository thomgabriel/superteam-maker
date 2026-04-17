-- C.5 — Operator escape hatch: admin_force_advance_team + admin_force_dissolve_team.
--
-- Both RPCs are granted to service_role only — the TS admin server actions call
-- them via createServiceRoleClient() after verifying isAdminUser() on the caller.
-- This mirrors the pattern of deactivate_team_and_members and keeps all admin
-- authorization in the application layer (env-allowlist based) rather than
-- needing a users.is_admin column.
--
-- admin_force_advance_team:
--   Moves a team from 'pending_confirmation' (post-C.1) OR 'forming' into
--   'pending_activation' and resets the 48h activation window so the leader
--   claim can open again. Safe to call even if the team is already in
--   pending_activation — it just refreshes the deadline.
--
-- admin_force_dissolve_team:
--   Cleanly tears a team down: status='inactive', dissolution_reason=p_reason,
--   moves all active members to status='replaced' (so the uniq_team_members_active_user
--   index releases them back into the pool flow). Accepts a reason string so the
--   admin can distinguish 'manual_admin' from pattern-specific dissolves.
--
-- Dependency note: dissolution_reason and confirmation_deadline_at are added
-- by Agent 3's C.1 migration (20260416120200_mutual_confirmation.sql). This
-- migration's timestamp (120300) is deliberately later so it applies AFTER
-- those columns exist. If you reorder migrations, preserve that ordering.
--
-- rollback notes:
--   - Revert the admin UI buttons + server actions that call these RPCs.
--   - Functions remain on disk (additive, service_role-only — harmless if unused).
--   - Do NOT drop dissolution_reason column (§5 rule #2).

CREATE OR REPLACE FUNCTION admin_force_advance_team(p_team_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_current_status text;
  v_new_deadline timestamptz := now() + interval '24 hours';
BEGIN
  SELECT status INTO v_current_status FROM teams WHERE id = p_team_id;

  IF v_current_status IS NULL THEN
    RETURN jsonb_build_object('success', false, 'code', 'team_not_found');
  END IF;

  IF v_current_status NOT IN ('pending_confirmation', 'pending_activation', 'forming') THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'invalid_state',
      'current_status', v_current_status
    );
  END IF;

  UPDATE teams
  SET status = 'pending_activation',
      activation_deadline_at = v_new_deadline,
      confirmation_deadline_at = NULL,
      updated_at = now()
  WHERE id = p_team_id;

  RETURN jsonb_build_object(
    'success', true,
    'new_status', 'pending_activation',
    'activation_deadline_at', v_new_deadline
  );
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

  UPDATE team_members
  SET status = 'replaced',
      replaced_at = now()
  WHERE team_id = p_team_id
    AND status = 'active';

  GET DIAGNOSTICS v_members_moved = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'members_moved', v_members_moved,
    'dissolution_reason', COALESCE(NULLIF(trim(p_reason), ''), 'manual_admin')
  );
END;
$$;

REVOKE ALL ON FUNCTION admin_force_advance_team(uuid) FROM public;
GRANT EXECUTE ON FUNCTION admin_force_advance_team(uuid) TO service_role;

REVOKE ALL ON FUNCTION admin_force_dissolve_team(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION admin_force_dissolve_team(uuid, text) TO service_role;
