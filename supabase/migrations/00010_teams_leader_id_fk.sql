-- A.1 — teams.leader_id FK to auth.users + orphan reconcile.
--
-- Adds an explicit FK from teams.leader_id to auth.users with ON DELETE SET NULL,
-- and resets any existing orphaned rows (leader_id pointing at a deleted auth user)
-- back to pending_activation with leader_id = NULL so the leader claim flow reopens.
--
-- rollback notes (per §5 rule #2 of the v2 plan — do NOT drop columns during campaign):
--   - Revert the application code that relies on the FK's ON DELETE SET NULL guarantee.
--   - If the FK itself needs to go: ALTER TABLE teams DROP CONSTRAINT teams_leader_id_auth_fkey;
--     The orphan reset is not reverted (the data was already inconsistent).
--   - Schema cleanup (dropping the constraint for good) deferred to post-campaign.

-- NOT VALID lets us add the constraint without scanning the table (safe on live DB).
ALTER TABLE teams
  ADD CONSTRAINT teams_leader_id_auth_fkey
  FOREIGN KEY (leader_id) REFERENCES auth.users(id) ON DELETE SET NULL NOT VALID;

-- Reconcile any orphaned rows (leader_id points at a user that no longer exists).
UPDATE teams
SET leader_id = NULL,
    status = 'pending_activation',
    updated_at = now()
WHERE leader_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = teams.leader_id);

-- Now validate — all remaining rows are either NULL or point at a real auth.users row.
ALTER TABLE teams VALIDATE CONSTRAINT teams_leader_id_auth_fkey;
