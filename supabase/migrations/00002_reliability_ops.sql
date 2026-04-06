-- ============================================
-- SuperTeamMaker — Reliability + Ops
-- ============================================

CREATE TABLE analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL CHECK (
    event_name IN (
      'landing_view',
      'signup_started',
      'signup_completed',
      'profile_completed',
      'entered_pool',
      'matched_to_team',
      'team_reveal_viewed',
      'leader_claimed',
      'team_activated',
      'whatsapp_clicked',
      'user_replaced'
    )
  ),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  anonymous_id text,
  route text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_events_event_name_created_at
  ON analytics_events(event_name, created_at DESC);

CREATE INDEX idx_analytics_events_user_id_created_at
  ON analytics_events(user_id, created_at DESC);

CREATE TABLE matchmaking_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_source text NOT NULL CHECK (trigger_source IN ('cron', 'admin')),
  status text NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  pool_size int NOT NULL DEFAULT 0,
  teams_formed int NOT NULL DEFAULT 0,
  users_matched int NOT NULL DEFAULT 0,
  replacements_performed int NOT NULL DEFAULT 0,
  notes text,
  error_message text,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz
);

CREATE INDEX idx_matchmaking_runs_started_at
  ON matchmaking_runs(started_at DESC);

-- Fix any existing duplicate active memberships before creating the unique index
-- (keeps the most recent membership, marks others as replaced)
UPDATE team_members tm SET status = 'replaced', replaced_at = now()
WHERE tm.id NOT IN (
  SELECT DISTINCT ON (user_id) id FROM team_members
  WHERE status = 'active'
  ORDER BY user_id, joined_at DESC
)
AND tm.status = 'active';

CREATE UNIQUE INDEX uniq_team_members_active_user
  ON team_members(user_id)
  WHERE status = 'active';

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchmaking_runs ENABLE ROW LEVEL SECURITY;

-- All inserts to analytics_events and matchmaking_runs go through service_role client.
-- No authenticated user INSERT policies needed — service_role bypasses RLS.

CREATE POLICY "analytics_events_none" ON analytics_events
  FOR SELECT TO authenticated USING (false);

CREATE POLICY "matchmaking_runs_none" ON matchmaking_runs
  FOR SELECT TO authenticated USING (false);
