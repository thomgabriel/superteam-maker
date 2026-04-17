# Team lifecycle — copy-paste SQL runbook

Support ops for mid-campaign team incidents. Every snippet is a single SQL
statement (or tight block) meant to be pasted directly into the Supabase SQL
editor against prod. Placeholders use the form `:team_id`, `:user_id`,
`:new_name` — replace before running.

> Before using any of these, prefer the admin dashboard buttons. Use these
> snippets only when the dashboard can't express the exact change.

---

## View full team state

Dump everything relevant for a single team in one shot.

```sql
SELECT
  t.id,
  t.name,
  t.status,
  t.leader_id,
  t.activation_deadline_at,
  t.confirmation_deadline_at,
  t.understaffed_at,
  t.dissolution_reason,
  t.idea_title,
  t.whatsapp_group_url,
  t.submission_url,
  t.submitted_at,
  t.hackathon_id,
  t.created_at,
  t.updated_at
FROM teams t
WHERE t.id = ':team_id';

SELECT
  tm.id,
  tm.user_id,
  tm.specific_role,
  tm.macro_role,
  tm.is_leader,
  tm.status,
  tm.joined_at,
  tm.last_active_at,
  tm.replaced_at,
  p.name,
  p.seniority
FROM team_members tm
LEFT JOIN profiles p ON p.user_id = tm.user_id
WHERE tm.team_id = ':team_id'
ORDER BY tm.joined_at ASC;
```

---

## Reset leader_id (reopen leader claim)

Use when the current leader needs to be un-assigned so another member can
claim. Clears `leader_id` + `leader_claimed_at` and resets the member's
`is_leader` flag. Does NOT change team status — the dashboard's "Avançar time"
button is preferred when you also want to reopen the 24h activation window.

```sql
UPDATE teams
SET leader_id = NULL,
    leader_claimed_at = NULL,
    status = 'pending_activation',
    updated_at = now()
WHERE id = ':team_id';

UPDATE team_members
SET is_leader = false
WHERE team_id = ':team_id'
  AND is_leader = true;
```

---

## Extend activation deadline

Pushes `activation_deadline_at` N hours into the future without touching any
other state. Use when a team is about to expire but the leader asked for more
time.

```sql
-- Postgres cannot interpolate :hours directly into an interval literal.
-- Multiply a 1-hour base by the scalar instead.
UPDATE teams
SET activation_deadline_at = now() + (interval '1 hour' * :hours),
    updated_at = now()
WHERE id = ':team_id';
```

---

## Extend confirmation deadline (post-C.1)

Same idea for teams stuck in `pending_confirmation`.

```sql
UPDATE teams
SET confirmation_deadline_at = now() + (interval '1 hour' * :hours),
    updated_at = now()
WHERE id = ':team_id'
  AND status = 'pending_confirmation';
```

---

## Change team name

Validates name doesn't collide first. If the second statement fails with a
unique violation, pick another name.

```sql
SELECT id, name FROM teams WHERE name = ':new_name';

UPDATE teams
SET name = ':new_name',
    updated_at = now()
WHERE id = ':team_id';
```

---

## Manually record a confirmation (post-C.1)

Use when a user reports they can't access their confirmation link but you've
verified their identity through support channels. Inserts a row into
`team_confirmations` on their behalf.

```sql
INSERT INTO team_confirmations (team_id, user_id, confirmed, reason, decided_at)
VALUES (':team_id', ':user_id', true, 'admin_manual_confirmation', now())
ON CONFLICT (team_id, user_id) DO UPDATE
  SET confirmed = EXCLUDED.confirmed,
      reason = EXCLUDED.reason,
      decided_at = EXCLUDED.decided_at;
```

---

## Clear understaffed flag

If a team has been marked understaffed but you've manually patched the roster
and want to reset the 24h grace clock.

```sql
UPDATE teams
SET understaffed_at = NULL,
    updated_at = now()
WHERE id = ':team_id';
```

---

## Requeue a user (move from replaced back into pool)

Use when a user was marked `replaced` but actually wants to return.

```sql
-- 1. Confirm the user has no active membership.
SELECT * FROM team_members WHERE user_id = ':user_id' AND status = 'active';

-- 2. Insert into pool (safe — unique constraint on user_id will fail if already there).
INSERT INTO matchmaking_pool (user_id, profile_id, status)
SELECT p.user_id, p.id, 'waiting'
FROM profiles p
WHERE p.user_id = ':user_id'
ON CONFLICT (user_id) DO UPDATE
  SET status = 'waiting',
      updated_at = now();
```

---

## Force-advance or force-dissolve (prefer dashboard)

The admin dashboard has "Avançar time" and "Dissolver time" buttons for these.
Only use the SQL versions if the UI is unavailable.

```sql
-- Force advance (pending_confirmation OR forming → pending_activation, 24h deadline)
SELECT admin_force_advance_team(':team_id'::uuid);

-- Force dissolve (any non-inactive status → inactive, members to replaced)
SELECT admin_force_dissolve_team(':team_id'::uuid, 'manual_admin');
```

---

## Audit: teams with orphaned leaders (should always be 0 post-A.1)

```sql
SELECT t.id, t.name, t.leader_id
FROM teams t
WHERE t.leader_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = t.leader_id);
```

---

## Audit: stuck matchmaking runs

```sql
SELECT id, trigger_source, status, started_at, finished_at, error_message
FROM matchmaking_runs
WHERE status = 'running'
  AND started_at < now() - interval '10 minutes'
ORDER BY started_at DESC;
```

If any rows show up, the next cron invocation will clean them up via
`begin_matchmaking_run`. If you need to clear them manually:

```sql
UPDATE matchmaking_runs
SET status = 'failed',
    error_message = 'manually reaped',
    finished_at = now()
WHERE status = 'running'
  AND started_at < now() - interval '10 minutes';
```
