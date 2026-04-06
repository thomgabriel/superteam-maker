-- ============================================
-- SuperTeamMaker — Initial Schema
-- ============================================

-- ============================================
-- 1. TABLES
-- ============================================

CREATE TABLE campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_name text NOT NULL,
  slug text UNIQUE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  phone text,
  campaign_id uuid REFERENCES campaigns(id),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone_number text NOT NULL,
  primary_role text NOT NULL,
  macro_role text NOT NULL CHECK (macro_role IN ('engineering', 'design', 'business_gtm')),
  years_experience int NOT NULL CHECK (years_experience >= 0),
  seniority text GENERATED ALWAYS AS (
    CASE
      WHEN years_experience <= 1 THEN 'beginner'
      WHEN years_experience <= 3 THEN 'junior'
      WHEN years_experience <= 5 THEN 'mid'
      ELSE 'senior'
    END
  ) STORED,
  bio text,
  language text DEFAULT 'pt-BR',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE profile_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL,
  UNIQUE(profile_id, role)
);

CREATE TABLE profile_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interest text NOT NULL,
  UNIQUE(profile_id, interest)
);

CREATE TABLE matchmaking_pool (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id),
  profile_id uuid NOT NULL REFERENCES profiles(id),
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'assigned')),
  round_number int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_pool_status_created ON matchmaking_pool(status, created_at);

CREATE TABLE teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  leader_id uuid REFERENCES users(id),
  status text NOT NULL DEFAULT 'forming'
    CHECK (status IN ('forming', 'pending_activation', 'active', 'inactive')),
  round_number int,
  leader_claimed_at timestamptz,
  activation_deadline_at timestamptz,
  idea_title text,
  idea_description text,
  project_category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id),
  specific_role text NOT NULL,
  macro_role text NOT NULL,
  is_leader boolean DEFAULT false,
  joined_at timestamptz DEFAULT now(),
  last_active_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'replaced')),
  replaced_at timestamptz,
  UNIQUE(team_id, user_id)
);

-- ============================================
-- 2. TRIGGER: Auto-create users row on auth signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 3. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchmaking_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaigns_read" ON campaigns
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "users_own" ON users
  FOR ALL TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_own" ON profiles
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "profiles_teammate_read" ON profiles
  FOR SELECT TO authenticated
  USING (
    user_id IN (
      SELECT tm.user_id FROM team_members tm
      WHERE tm.team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'
      )
      AND tm.status = 'active'
    )
  );

CREATE POLICY "profile_roles_own" ON profile_roles
  FOR ALL TO authenticated
  USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "profile_interests_own" ON profile_interests
  FOR ALL TO authenticated
  USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "pool_own" ON matchmaking_pool
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "teams_member_read" ON teams
  FOR SELECT TO authenticated
  USING (id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "teams_leader_update" ON teams
  FOR UPDATE TO authenticated USING (leader_id = auth.uid());

CREATE POLICY "team_members_read" ON team_members
  FOR SELECT TO authenticated
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

-- ============================================
-- 4. DIAGNOSTIC VIEWS
-- ============================================

CREATE VIEW v_pool_status AS
  SELECT status, count(*) as total FROM matchmaking_pool GROUP BY status;

CREATE VIEW v_round_summary AS
  SELECT round_number, count(*) as teams_formed,
         min(created_at) as round_start, max(created_at) as round_end
  FROM teams WHERE round_number IS NOT NULL GROUP BY round_number;

CREATE VIEW v_unmatched AS
  SELECT mp.id, mp.created_at as waiting_since,
         p.name, p.primary_role, p.macro_role, p.seniority
  FROM matchmaking_pool mp
  JOIN profiles p ON p.id = mp.profile_id
  WHERE mp.status = 'waiting';

-- ============================================
-- 5. REALTIME PUBLICATION
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE matchmaking_pool;
ALTER PUBLICATION supabase_realtime ADD TABLE team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE teams;

-- ============================================
-- 6. RPC: Atomic profile creation + pool entry
-- ============================================

CREATE OR REPLACE FUNCTION create_profile_and_enter_pool(
  p_user_id uuid,
  p_name text,
  p_phone_number text,
  p_primary_role text,
  p_macro_role text,
  p_years_experience int,
  p_secondary_roles text[],
  p_interests text[]
) RETURNS uuid AS $$
DECLARE
  v_profile_id uuid;
BEGIN
  INSERT INTO profiles (user_id, name, phone_number, primary_role, macro_role, years_experience)
  VALUES (p_user_id, p_name, p_phone_number, p_primary_role, p_macro_role, p_years_experience)
  RETURNING id INTO v_profile_id;

  IF array_length(p_secondary_roles, 1) > 0 THEN
    INSERT INTO profile_roles (profile_id, role)
    SELECT v_profile_id, unnest(p_secondary_roles);
  END IF;

  IF array_length(p_interests, 1) > 0 THEN
    INSERT INTO profile_interests (profile_id, interest)
    SELECT v_profile_id, unnest(p_interests);
  END IF;

  INSERT INTO matchmaking_pool (user_id, profile_id, status)
  VALUES (p_user_id, v_profile_id, 'waiting');

  RETURN v_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
