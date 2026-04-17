# SuperTeamMaker

Team-formation platform for hackathons. Matches solo participants into balanced teams by role, seniority, and interest overlap — then walks each team through a mutual-confirmation → leader-claim → active lifecycle, with email + in-app notifications at every step.

Used in production for Solana Brasil 2026.

## Quick start

```bash
npm install
cp .env.local.example .env.local   # fill values
npm run dev
```

App runs at `http://localhost:3000`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build (catches type errors) |
| `npm test` | Run vitest once |
| `npm run test:watch` | Watch mode |
| `npm run lint` | ESLint |

## Tech stack

- Next.js 16 App Router + React 19 + TypeScript
- Supabase (Postgres, Auth, RLS, Realtime)
- Tailwind CSS v4 with the Superteam Brasil palette
- Resend for transactional email
- Vitest

## Environment variables

Required in `.env.local` and in Vercel production:

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | User-scoped client key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin key |
| `NEXT_PUBLIC_APP_URL` | Canonical app URL used in email links |
| `NOTIFICATION_TOKEN_SECRET` | HMAC key for magic-link tokens (`openssl rand -base64 48`) |
| `RESEND_API_KEY` | Resend API key |
| `CRON_SECRET` | Auth bearer for `/api/matchmaking` |
| `ADMIN_EMAIL_ALLOWLIST` | Comma-separated admin emails |
| `ADMIN_USER_ID_ALLOWLIST` | Comma-separated admin user IDs |

Missing `NOTIFICATION_TOKEN_SECRET` degrades magic-link emails to plain URLs (users can't one-click confirm from email, but in-app confirm still works).

## Architecture

### Route groups

- `(public)/` — landing + auth pages
- `(app)/` — auth-gated user and admin app
- `team/confirm/` — public magic-link route (no login required, token-authenticated)

Middleware at [src/lib/supabase/middleware.ts](src/lib/supabase/middleware.ts) gates auth. Do not add auth checks in `(app)/layout.tsx` — causes redirect loops.

### Database access

- `createServerSupabaseClient()` — user-scoped, RLS-enforced. Default choice for reads/writes where the user's own policies cover access.
- `createServiceRoleClient()` — bypasses RLS. Use only for cross-user ops (pool scans, admin dashboards, cron jobs).
- Cross-table mutations go through `SECURITY DEFINER` RPCs with explicit `auth.uid()` checks: `claim_team_leadership`, `confirm_team`, `decline_team`, `assign_pool_candidate_to_team`, etc.

### Team lifecycle

```
matchmaking_pool (waiting)
        ↓  engine matches 4 users
    forming
        ↓  pool-to-team assign RPC
    pending_confirmation   ← members click magic link to confirm (48h window)
        ↓  ≥3 confirms
    pending_activation     ← one member claims leadership (24h window)
        ↓  claim_team_leadership RPC
    active                 ← team works on idea + submits
        ↓  admin force-dissolve / leader timeout / grace expired
    inactive
```

Natural exits:
- Confirmation window expires with <3 confirms → dissolved, members re-pool
- Activation window expires without leader claim → dissolved
- Team understaffed → 24h grace → dissolved if not recovered
- Leader inactive 72h → team members can collectively request reclaim

### Matchmaking engine

Batch engine in [src/lib/matchmaking/](src/lib/matchmaking/). Triggered by Vercel Cron → `/api/matchmaking` every 10 minutes.

- Config at [matchmaking/config.ts](src/lib/matchmaking/config.ts): team size, grace hours, scoring weights
- Scoring: role balance (0.4), seniority proximity (0.3), interest overlap (0.2), wait time (0.1)
- Concurrency serialized by `begin_matchmaking_run` RPC + Postgres advisory lock. Only one run can be in-flight at a time (cron or admin-triggered).
- Same tick performs maintenance sweeps: confirmation expiries, dormant-leader detection, understaffed grace, unclaimed-team deactivation, never-visited member replacement

### Notifications

Single dispatcher at [src/lib/notifications/dispatcher.ts](src/lib/notifications/dispatcher.ts).

- Immutable event log (`notification_events`) + per-user outbox (`notifications`)
- Email (Resend) + in-app (header bell) channels
- Per-user preferences in `notification_preferences` (three toggles)
- Global + per-user throttling via `throttle_key`
- Magic-link confirm/decline: HMAC-SHA256 + nonce, single-use atomic consume, rate-limited per IP

12 notification kinds cover every transition — templates in [src/lib/notifications/templates/](src/lib/notifications/templates/).

## Admin access

Add the email or user ID to either allowlist env var:

```
ADMIN_EMAIL_ALLOWLIST=alice@example.com,bob@example.com
ADMIN_USER_ID_ALLOWLIST=00000000-...,11111111-...
```

Checked in [src/lib/admin/index.ts](src/lib/admin/index.ts). Admin dashboard at `/admin` supports:

- Manual matchmaking trigger (wrapped in the same concurrency guard as cron)
- Force-advance a stuck team to the leader-claim stage
- Force-dissolve any team with a custom reason
- Per-team view of status, members, lifecycle timers, submission state

Destructive admin actions are recorded in `notification_events(kind='admin_action')` as an audit trail.

## Deploying

### Vercel

Connect the repo, set the env vars above, register the cron:

```
/api/matchmaking — every 10 minutes
```

### Supabase migrations

Migrations live in [supabase/migrations/](supabase/migrations/) with sequential prefixes (`00001_...sql` → `00022_...sql`). Apply in order.

For sensitive pre-apply checks on 00010 (teams FK to auth.users):

```sql
SELECT count(*) FROM teams
WHERE leader_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = teams.leader_id);
```

Expect 0 — if non-zero the migration will flip those teams back to `pending_activation`.

### Migration safety rules

- Additive only (no DROP on hot tables during a live campaign)
- FK additions use `NOT VALID` + `VALIDATE CONSTRAINT` two-step
- Code rollback never requires a schema rollback

### Deploy sequence for schema+code PRs

1. Set new env vars in Vercel
2. Apply new migrations via SQL editor or the Supabase MCP
3. Merge PR → Vercel auto-deploys
4. Smoke-test magic-link + team confirmation end-to-end
5. Watch Sentry for new `logError` tags (silence = healthy)

## Conventions

- **Copy** in Portuguese (pt-BR). **Code + routes** in English (`/profile`, `/queue`, `/team`).
- Brand palette: Dark Green `#1b231d`, Emerald `#008b4c`, Yellow `#ffd23f`, Off-White `#f5e8ca`.
- Typography: Archivo Semi Expanded for headings, Inter for body.
- `.maybeSingle()` over `.single()` when the row may not exist.
- `(app)/` pages declare `export const dynamic = 'force-dynamic'` to avoid stale redirects.
- Default to no code comments. If one is needed, explain WHY, not WHAT.

## Project structure

```
src/
├── app/
│   ├── (public)/           — landing + auth
│   ├── (app)/              — auth-gated app
│   │   ├── admin/          — dashboard + lifecycle actions
│   │   ├── profile/        — profile + enhance
│   │   ├── queue/          — pool status
│   │   ├── settings/       — notification prefs
│   │   └── team/           — team page, confirmation, leader panel
│   ├── api/
│   │   ├── matchmaking/    — cron endpoint
│   │   ├── notifications/  — in-app bell feed
│   │   └── analytics/      — event tracking
│   └── team/confirm/       — public magic-link route
├── components/             — UI pieces
├── lib/
│   ├── admin/              — admin auth helpers
│   ├── matchmaking/        — engine, scoring, config
│   ├── notifications/      — dispatcher, templates, channels
│   ├── supabase/           — client factories
│   ├── tokens.ts           — HMAC sign/verify/consume
│   └── rate-limit.ts
└── types/                  — shared types
supabase/migrations/        — sequential SQL files (00001–00022)
docs/runbooks/              — operator references
```

## Testing

```bash
npm test            # run once
npm run test:watch  # watch mode
```

Tests live in `src/**/__tests__/`. Coverage focuses on notification dispatcher, matchmaking maintenance, confirmation flow, token lifecycle, rate limiting, and admin actions.

No DB integration tests — RPCs are exercised indirectly through server-action tests that mock the Supabase client.

## Further reading

- [CLAUDE.md](CLAUDE.md) — project conventions, gotchas, and architecture notes for contributors
- [AGENTS.md](AGENTS.md) — Next.js-specific warnings for this codebase
- [docs/runbooks/team-lifecycle-sql.md](docs/runbooks/team-lifecycle-sql.md) — operator reference for team lifecycle SQL
