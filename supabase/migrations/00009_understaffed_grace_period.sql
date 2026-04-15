-- Add understaffed_at to teams: tracks when a team first dropped below minTeamSize.
-- The maintenance job sets this on first detection and only deactivates after 24h grace.
-- Cleared when the team recovers (replacement found).

ALTER TABLE teams ADD COLUMN understaffed_at timestamptz DEFAULT NULL;
