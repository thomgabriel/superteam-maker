-- F.2 — teams.submission_url + teams.submitted_at.
--
-- Captures each team's final submission link + timestamp for admin visibility
-- and post-event retention loops. Leader-facing input UI ships in a separate
-- change owned by the team/leader-panel agent; this migration just adds the
-- columns so the admin dashboard can render the status column immediately.
--
-- rollback notes:
--   - Revert code that reads submission_url / submitted_at.
--   - Columns remain (§5 rule #2 — additive). Post-campaign cleanup may drop them.

ALTER TABLE teams ADD COLUMN submission_url text;
ALTER TABLE teams ADD COLUMN submitted_at timestamptz;
