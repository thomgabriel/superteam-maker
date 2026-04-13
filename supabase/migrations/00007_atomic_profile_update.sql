-- Atomic profile update to keep profile, roles, and interests consistent.

CREATE OR REPLACE FUNCTION update_profile_details(
  p_name text,
  p_phone_number text,
  p_primary_role text,
  p_macro_role text,
  p_years_experience int,
  p_secondary_roles text[],
  p_interests text[],
  p_linkedin_url text DEFAULT NULL,
  p_github_url text DEFAULT NULL,
  p_x_url text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_profile_id uuid;
BEGIN
  SELECT id
  INTO v_profile_id
  FROM profiles
  WHERE user_id = auth.uid();

  IF v_profile_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'code', 'no_profile');
  END IF;

  UPDATE profiles
  SET
    name = p_name,
    phone_number = p_phone_number,
    primary_role = p_primary_role,
    macro_role = p_macro_role,
    years_experience = p_years_experience,
    linkedin_url = NULLIF(trim(p_linkedin_url), ''),
    github_url = NULLIF(trim(p_github_url), ''),
    x_url = NULLIF(trim(p_x_url), '')
  WHERE id = v_profile_id;

  DELETE FROM profile_roles
  WHERE profile_id = v_profile_id;

  IF array_length(p_secondary_roles, 1) > 0 THEN
    INSERT INTO profile_roles (profile_id, role)
    SELECT v_profile_id, unnest(p_secondary_roles);
  END IF;

  DELETE FROM profile_interests
  WHERE profile_id = v_profile_id;

  IF array_length(p_interests, 1) > 0 THEN
    INSERT INTO profile_interests (profile_id, interest)
    SELECT v_profile_id, unnest(p_interests);
  END IF;

  RETURN jsonb_build_object('success', true, 'profile_id', v_profile_id);
END;
$$;

REVOKE ALL ON FUNCTION update_profile_details(text, text, text, text, int, text[], text[], text, text, text) FROM public;
GRANT EXECUTE ON FUNCTION update_profile_details(text, text, text, text, int, text[], text[], text, text, text) TO authenticated, service_role;
