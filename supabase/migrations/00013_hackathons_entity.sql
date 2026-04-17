-- F.1 — Hackathons entity + teams.hackathon_id.
--
-- Adds a hackathons table (slug, name, starts/ends) and a nullable FK column
-- teams.hackathon_id. Seeds the current campaign (Solana Brasil 2026) and
-- backfills all existing teams onto it so downstream code can always rely on
-- a non-null hackathon_id for in-flight teams.
--
-- rollback notes (§5 rule #2 — no DROP TABLE/COLUMN during campaign):
--   - Revert application code that reads teams.hackathon_id / hackathons.
--   - Table and column remain dormant. Schema cleanup post-campaign only.

CREATE TABLE hackathons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teams ADD COLUMN hackathon_id uuid REFERENCES hackathons(id);

-- Seed the current Solana Brasil 2026 campaign so backfill has something to
-- point existing teams at.
INSERT INTO hackathons (slug, name, starts_at, ends_at)
VALUES (
  'solana-brasil-2026',
  'Solana Brasil 2026',
  '2026-04-01'::timestamptz,
  '2026-05-31'::timestamptz
)
ON CONFLICT (slug) DO NOTHING;

-- Backfill every existing team onto the current hackathon.
UPDATE teams
SET hackathon_id = (SELECT id FROM hackathons WHERE slug = 'solana-brasil-2026')
WHERE hackathon_id IS NULL;

-- Readable by authenticated users — teams join hackathons for display purposes
-- and there's no sensitive data in the row.
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hackathons_read" ON hackathons
  FOR SELECT TO authenticated USING (true);
