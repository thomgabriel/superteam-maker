-- ============================================
-- Team action guardrails
-- ============================================

CREATE TABLE IF NOT EXISTS action_rate_limits (
  key text PRIMARY KEY,
  count int NOT NULL,
  reset_at timestamptz NOT NULL
);

CREATE OR REPLACE FUNCTION consume_action_rate_limit(
  p_key text,
  p_max_requests int,
  p_window_seconds int
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_now timestamptz := now();
  v_count int;
  v_reset_at timestamptz;
BEGIN
  LOOP
    UPDATE action_rate_limits
    SET
      count = CASE
        WHEN reset_at <= v_now THEN 1
        ELSE count + 1
      END,
      reset_at = CASE
        WHEN reset_at <= v_now THEN v_now + make_interval(secs => p_window_seconds)
        ELSE reset_at
      END
    WHERE key = p_key
    RETURNING count, reset_at INTO v_count, v_reset_at;

    EXIT WHEN FOUND;

    BEGIN
      INSERT INTO action_rate_limits (key, count, reset_at)
      VALUES (p_key, 1, v_now + make_interval(secs => p_window_seconds))
      RETURNING count, reset_at INTO v_count, v_reset_at;
      EXIT;
    EXCEPTION
      WHEN unique_violation THEN
        -- Another concurrent request inserted first; retry the update path.
    END;
  END LOOP;

  RETURN jsonb_build_object(
    'allowed', v_count <= p_max_requests,
    'remaining', GREATEST(p_max_requests - LEAST(v_count, p_max_requests), 0),
    'retry_after_seconds', GREATEST(1, CEIL(EXTRACT(EPOCH FROM (v_reset_at - v_now)))::int)
  );
END;
$$;

-- RLS + permissions for rate-limit table and function
ALTER TABLE action_rate_limits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON FUNCTION consume_action_rate_limit(text, int, int) FROM public;
GRANT EXECUTE ON FUNCTION consume_action_rate_limit(text, int, int) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION enforce_max_active_team_members()
RETURNS trigger AS $$
DECLARE
  v_active_count int;
BEGIN
  IF NEW.status <> 'active' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE'
     AND OLD.status = 'active'
     AND OLD.team_id = NEW.team_id THEN
    RETURN NEW;
  END IF;

  SELECT count(*)
  INTO v_active_count
  FROM team_members
  WHERE team_id = NEW.team_id
    AND status = 'active'
    AND id <> COALESCE(NEW.id, gen_random_uuid());

  IF v_active_count >= 4 THEN
    RAISE EXCEPTION 'team_full' USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_max_active_team_members ON team_members;

CREATE TRIGGER trg_enforce_max_active_team_members
  BEFORE INSERT OR UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION enforce_max_active_team_members();
