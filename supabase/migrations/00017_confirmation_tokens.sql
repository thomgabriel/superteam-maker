-- C.3 — Magic-token confirmation links
--
-- Stores the nonces backing HMAC-signed magic links in confirmation emails.
-- The signed token is verified on GET (no mutation) and consumed atomically on
-- POST via `UPDATE confirmation_tokens SET consumed_at=now() WHERE nonce=$1 AND
-- consumed_at IS NULL RETURNING *`. If 0 rows return, the token is already
-- consumed or was never issued.
--
-- Additive. Rollback = revert code; table remains dormant.
--
-- RLS: writes are restricted to service_role. The UI never queries this table
-- directly — the token library (src/lib/tokens.ts) uses the service-role client.

CREATE TABLE IF NOT EXISTS public.confirmation_tokens (
  nonce text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('confirm', 'decline')),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS confirmation_tokens_user_team
  ON public.confirmation_tokens (user_id, team_id);

CREATE INDEX IF NOT EXISTS confirmation_tokens_expiry
  ON public.confirmation_tokens (expires_at)
  WHERE consumed_at IS NULL;

-- RLS on. No policies — service_role is the only intended writer/reader. Keeps
-- token material unreadable from the user-scoped anon/auth client even if a
-- SELECT ever slips into a query.
ALTER TABLE public.confirmation_tokens ENABLE ROW LEVEL SECURITY;
