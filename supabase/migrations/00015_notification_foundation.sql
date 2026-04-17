-- Batch B.1 — Notification foundation schema
-- Additive only: new tables, indexes, a function + trigger for auto-creating preferences,
-- and a backfill for existing auth.users rows.
--
-- Rollback: revert any code that references these tables; the schema itself remains dormant.
-- Per §5 rule #2 we do NOT drop notification_preferences during the campaign window.

CREATE TABLE IF NOT EXISTS public.notification_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  subject_team_id uuid,
  subject_user_id uuid,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  throttle_key text,
  emitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notification_events_kind_emitted
  ON public.notification_events (kind, emitted_at DESC);

CREATE INDEX IF NOT EXISTS notification_events_throttle
  ON public.notification_events (throttle_key)
  WHERE throttle_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.notification_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel text NOT NULL CHECK (channel IN ('email', 'in_app')),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'suppressed')),
  sent_at timestamptz,
  read_at timestamptz,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_status
  ON public.notifications (user_id, status);

CREATE INDEX IF NOT EXISTS notifications_user_unread
  ON public.notifications (user_id, read_at)
  WHERE channel = 'in_app' AND read_at IS NULL;

CREATE INDEX IF NOT EXISTS notifications_event
  ON public.notifications (event_id);

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_lifecycle boolean NOT NULL DEFAULT true,
  email_reminders boolean NOT NULL DEFAULT true,
  in_app_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS ----------------------------------------------------------------------

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS notifications_own_select ON public.notifications;
CREATE POLICY notifications_own_select ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS notifications_own_update ON public.notifications;
CREATE POLICY notifications_own_update ON public.notifications
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS notification_prefs_own_select ON public.notification_preferences;
CREATE POLICY notification_prefs_own_select ON public.notification_preferences
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS notification_prefs_own_update ON public.notification_preferences;
CREATE POLICY notification_prefs_own_update ON public.notification_preferences
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- INSERT is intentionally omitted — preference rows are created by the trigger
-- below (and the backfill). Direct inserts from user context are not allowed.

-- notification_events is internal-only; RLS enabled with no policies so
-- service-role remains the only writer/reader path.
ALTER TABLE public.notification_events ENABLE ROW LEVEL SECURITY;

-- Trigger: auto-create a preferences row for every new auth.users signup.
-- Critical because the campaign is live — new users sign up continuously.
CREATE OR REPLACE FUNCTION public.handle_new_user_notification_prefs()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_notification_prefs ON auth.users;
CREATE TRIGGER on_auth_user_created_notification_prefs
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_notification_prefs();

-- updated_at maintenance
CREATE OR REPLACE FUNCTION public.touch_notification_preferences_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notification_preferences_set_updated_at ON public.notification_preferences;
CREATE TRIGGER notification_preferences_set_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_notification_preferences_updated_at();

-- Backfill existing users with default preferences.
INSERT INTO public.notification_preferences (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
