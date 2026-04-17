-- C.1 — Mutual confirmation window
--
-- Adds the 'pending_confirmation' state in front of 'pending_activation', together with
-- the team_confirmations table that records per-member confirm/decline decisions and
-- the teams columns that track the confirmation deadline + why a team was dissolved.
--
-- NOTE: teams.status is implemented as a text CHECK constraint in 00001_schema.sql
-- (not a Postgres ENUM), so we simply swap the CHECK constraint to allow the new
-- state. This keeps the migration transactional — no ALTER TYPE ADD VALUE required.
--
-- Additive per §5 rule #1: the CHECK replacement only widens the allowed set.
-- Existing rows are untouched. Grandfathering: all teams currently in
-- 'pending_activation'/'active'/'inactive' stay there.
--
-- Rollback:
--   - Flip MUTUAL_CONFIRMATION_ENABLED off (new teams go back into pending_activation).
--   - For any teams stuck in 'pending_confirmation':
--       UPDATE teams SET status='pending_activation', confirmation_deadline_at=NULL
--       WHERE status='pending_confirmation';
--   - Per §5 rule #2, do NOT drop team_confirmations or the new columns.

-- 1. Widen teams.status CHECK to include 'pending_confirmation'.
ALTER TABLE public.teams DROP CONSTRAINT IF EXISTS teams_status_check;
ALTER TABLE public.teams
  ADD CONSTRAINT teams_status_check
  CHECK (status IN ('forming', 'pending_confirmation', 'pending_activation', 'active', 'inactive'));

-- 2. New team columns.
ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS confirmation_deadline_at timestamptz;

ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS dissolution_reason text;

COMMENT ON COLUMN public.teams.dissolution_reason IS
  'Why a team was moved to inactive. One of: confirmation_failed | activation_timeout | understaffed_grace | manual_admin. NULL for non-dissolved teams.';

-- 3. team_confirmations — per-member decisions within the confirmation window.
CREATE TABLE IF NOT EXISTS public.team_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  confirmed boolean NOT NULL,
  reason text,
  decided_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (team_id, user_id)
);

CREATE INDEX IF NOT EXISTS team_confirmations_team ON public.team_confirmations(team_id);

ALTER TABLE public.team_confirmations ENABLE ROW LEVEL SECURITY;

-- Teammates can see each other's confirmations for the team (to render the live count).
DROP POLICY IF EXISTS team_confirmations_visible_to_teammates ON public.team_confirmations;
CREATE POLICY team_confirmations_visible_to_teammates ON public.team_confirmations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_confirmations.team_id
        AND tm.user_id = auth.uid()
        AND tm.status = 'active'
    )
  );

-- Users can only INSERT rows for themselves. (RPCs below use SECURITY DEFINER so
-- they bypass this; direct inserts are limited to the caller's own user_id.)
DROP POLICY IF EXISTS team_confirmations_own_insert ON public.team_confirmations;
CREATE POLICY team_confirmations_own_insert ON public.team_confirmations
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------

-- advance_team_to_activation: internal helper. Flips a team from
-- pending_confirmation -> pending_activation and arms the 24h activation deadline.
-- Returns the team_id if transitioned, NULL otherwise.
CREATE OR REPLACE FUNCTION public.advance_team_to_activation(p_team_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_new_deadline timestamptz := now() + interval '24 hours';
  v_updated uuid;
BEGIN
  UPDATE public.teams
  SET status = 'pending_activation',
      activation_deadline_at = v_new_deadline,
      confirmation_deadline_at = NULL,
      updated_at = now()
  WHERE id = p_team_id
    AND status = 'pending_confirmation'
  RETURNING id INTO v_updated;

  RETURN v_updated;
END;
$$;

REVOKE ALL ON FUNCTION public.advance_team_to_activation(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.advance_team_to_activation(uuid) TO service_role;

-- dissolve_team_pre_activation: internal helper. Dissolves a team that failed
-- the confirmation window. Moves members to 'replaced' so they re-enter pool flow.
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

  UPDATE public.team_members
  SET status = 'replaced',
      replaced_at = now()
  WHERE team_id = p_team_id
    AND status = 'active';

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.dissolve_team_pre_activation(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.dissolve_team_pre_activation(uuid, text) TO service_role;

-- confirm_team: caller asserts their seat on the team. Advances the team
-- automatically once >=3 members confirm.
--
-- Edge-case rules implemented here (per plan §6 C.1):
--   - 4 confirms -> advance.
--   - 3 confirms + 1 decline -> advance with 3 members (cron refills via existing
--     understaffed flow).
--   - Deadline expired -> caller gets 'deadline_passed'.
--   - Caller not an active member or team not in pending_confirmation -> error codes.
CREATE OR REPLACE FUNCTION public.confirm_team(p_team_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_team RECORD;
  v_confirm_count int;
  v_advanced uuid;
BEGIN
  IF v_caller IS NULL THEN
    RETURN jsonb_build_object('success', false, 'code', 'not_authenticated');
  END IF;

  SELECT id, status, confirmation_deadline_at
    INTO v_team
    FROM public.teams
    WHERE id = p_team_id
    FOR UPDATE;

  IF v_team.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'code', 'team_not_found');
  END IF;

  IF v_team.status <> 'pending_confirmation' THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'invalid_state',
      'current_status', v_team.status
    );
  END IF;

  IF v_team.confirmation_deadline_at IS NOT NULL AND v_team.confirmation_deadline_at < now() THEN
    RETURN jsonb_build_object('success', false, 'code', 'deadline_passed');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = p_team_id
      AND user_id = v_caller
      AND status = 'active'
  ) THEN
    RETURN jsonb_build_object('success', false, 'code', 'not_member');
  END IF;

  INSERT INTO public.team_confirmations (team_id, user_id, confirmed, reason)
  VALUES (p_team_id, v_caller, true, NULL)
  ON CONFLICT (team_id, user_id) DO UPDATE
    SET confirmed = EXCLUDED.confirmed,
        reason = NULL,
        decided_at = now();

  SELECT count(*)::int
    INTO v_confirm_count
    FROM public.team_confirmations tc
    JOIN public.team_members tm
      ON tm.team_id = tc.team_id AND tm.user_id = tc.user_id
    WHERE tc.team_id = p_team_id
      AND tc.confirmed = true
      AND tm.status = 'active';

  IF v_confirm_count >= 3 THEN
    v_advanced := public.advance_team_to_activation(p_team_id);
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'confirm_count', v_confirm_count,
    'advanced', v_advanced IS NOT NULL
  );
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_team(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.confirm_team(uuid) TO authenticated, service_role;

-- decline_team: caller declines their seat. Dissolves the team if >=2 decline
-- (can't recover to 3 confirms with 4 members, 3 decline is worse, etc.).
CREATE OR REPLACE FUNCTION public.decline_team(
  p_team_id uuid,
  p_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_team RECORD;
  v_decline_count int;
  v_member_count int;
  v_dissolved boolean := false;
BEGIN
  IF v_caller IS NULL THEN
    RETURN jsonb_build_object('success', false, 'code', 'not_authenticated');
  END IF;

  SELECT id, status, confirmation_deadline_at
    INTO v_team
    FROM public.teams
    WHERE id = p_team_id
    FOR UPDATE;

  IF v_team.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'code', 'team_not_found');
  END IF;

  IF v_team.status <> 'pending_confirmation' THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'invalid_state',
      'current_status', v_team.status
    );
  END IF;

  IF v_team.confirmation_deadline_at IS NOT NULL AND v_team.confirmation_deadline_at < now() THEN
    RETURN jsonb_build_object('success', false, 'code', 'deadline_passed');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = p_team_id
      AND user_id = v_caller
      AND status = 'active'
  ) THEN
    RETURN jsonb_build_object('success', false, 'code', 'not_member');
  END IF;

  INSERT INTO public.team_confirmations (team_id, user_id, confirmed, reason)
  VALUES (p_team_id, v_caller, false, p_reason)
  ON CONFLICT (team_id, user_id) DO UPDATE
    SET confirmed = EXCLUDED.confirmed,
        reason = EXCLUDED.reason,
        decided_at = now();

  SELECT count(*)::int
    INTO v_decline_count
    FROM public.team_confirmations tc
    JOIN public.team_members tm
      ON tm.team_id = tc.team_id AND tm.user_id = tc.user_id
    WHERE tc.team_id = p_team_id
      AND tc.confirmed = false
      AND tm.status = 'active';

  SELECT count(*)::int
    INTO v_member_count
    FROM public.team_members
    WHERE team_id = p_team_id
      AND status = 'active';

  -- With 4 active members, 2+ declines means the team can't reach the 3-confirm
  -- threshold anymore. Dissolve immediately.
  IF v_decline_count >= 2 OR v_decline_count >= v_member_count - 2 THEN
    IF public.dissolve_team_pre_activation(p_team_id, 'confirmation_failed') THEN
      v_dissolved := true;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'decline_count', v_decline_count,
    'dissolved', v_dissolved
  );
END;
$$;

REVOKE ALL ON FUNCTION public.decline_team(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.decline_team(uuid, text) TO authenticated, service_role;

-- expire_confirmation_windows: cron-invoked. Closes out any teams past their
-- confirmation deadline. If >=3 confirmed at deadline -> advance. Else dissolve.
-- Returns a summary jsonb the caller can use to emit per-team events.
CREATE OR REPLACE FUNCTION public.expire_confirmation_windows()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_team RECORD;
  v_confirm_count int;
  v_advanced_ids uuid[] := ARRAY[]::uuid[];
  v_dissolved_ids uuid[] := ARRAY[]::uuid[];
BEGIN
  FOR v_team IN
    SELECT id
      FROM public.teams
      WHERE status = 'pending_confirmation'
        AND confirmation_deadline_at IS NOT NULL
        AND confirmation_deadline_at < now()
      FOR UPDATE SKIP LOCKED
  LOOP
    SELECT count(*)::int
      INTO v_confirm_count
      FROM public.team_confirmations tc
      JOIN public.team_members tm
        ON tm.team_id = tc.team_id AND tm.user_id = tc.user_id
      WHERE tc.team_id = v_team.id
        AND tc.confirmed = true
        AND tm.status = 'active';

    IF v_confirm_count >= 3 THEN
      IF public.advance_team_to_activation(v_team.id) IS NOT NULL THEN
        v_advanced_ids := v_advanced_ids || v_team.id;
      END IF;
    ELSE
      IF public.dissolve_team_pre_activation(v_team.id, 'confirmation_failed') THEN
        v_dissolved_ids := v_dissolved_ids || v_team.id;
      END IF;
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'advanced_team_ids', v_advanced_ids,
    'dissolved_team_ids', v_dissolved_ids,
    'advanced_count', coalesce(array_length(v_advanced_ids, 1), 0),
    'dissolved_count', coalesce(array_length(v_dissolved_ids, 1), 0)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.expire_confirmation_windows() FROM public;
GRANT EXECUTE ON FUNCTION public.expire_confirmation_windows() TO service_role;
