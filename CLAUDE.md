# SuperTeamMaker

Hackathon team formation platform. Next.js 15+ App Router, TypeScript, Tailwind CSS, Supabase.

## Quick Reference

- `npm run dev` — start dev server
- `npm test` — run vitest tests
- `npm run build` — production build (catches type errors)
- Design spec: `docs/superpowers/specs/2026-04-06-superteam-maker-design.md`
- Implementation plan: `docs/superpowers/plans/2026-04-06-superteam-maker-plan.md`

## Architecture

- **Route groups:** `(public)/` = no auth, `(app)/` = auth required
- **Auth:** Middleware handles all auth gating. Do NOT add auth checks in `(app)/layout.tsx` — causes redirect loops.
- **DB queries in server components:** Always use `createServiceRoleClient()` — the `sb_publishable_` anon key doesn't pass RLS context server-side. Auth is verified via `getUser()`, DB access via service role with manual `user_id` filtering.
- **Middleware cookie handling:** When redirecting from middleware, always copy cookies from `supabaseResponse` to the redirect response. Token refreshes store new cookies on `supabaseResponse`.
- **Matchmaking:** Batch engine in `src/lib/matchmaking/`. Triggered by Vercel Cron → `/api/matchmaking`. Config is in `config.ts`, not hardcoded.
- **Atomic operations:** Profile creation uses Postgres RPC `create_profile_and_enter_pool`. Leader claim uses `WHERE leader_id IS NULL` optimistic lock.

## Conventions

- **Language:** UI copy in Portuguese (pt-BR). Routes and code internals in English (`/profile`, `/queue`, `/team`, `/ideas`). Legacy Portuguese URLs redirect to the English routes.
- **Brand:** Superteam Brasil palette — Dark Green `#1b231d` base, Emerald `#008b4c` CTAs, Yellow `#ffd23f` highlights, Off-White `#f5e8ca` text. Archivo Semi Expanded headings, Inter body.
- **Supabase queries:** Use `.maybeSingle()` not `.single()` when row may not exist. `.single()` throws on 0 rows.
- **Dynamic pages:** All `(app)/` pages need `export const dynamic = 'force-dynamic'` to prevent stale redirects.

## Gotchas

- `create-next-app` fails in non-empty dirs — use temp dir + rsync approach
- Supabase auth triggers don't backfill — after applying migrations to a DB with existing `auth.users`, run: `INSERT INTO public.users (id, email) SELECT id, email FROM auth.users au WHERE NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = au.id)`
- The Edge Function at `supabase/functions/` is a placeholder — MVP uses Vercel Cron
- `supabase/functions/` is excluded from `tsconfig.json` (Deno imports)

@AGENTS.md
