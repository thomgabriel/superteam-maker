-- Security follow-up — notification_events needs a SELECT policy so the
-- notification bell can read the joined event payload. Previously RLS was
-- enabled with no policies, which meant authenticated users could see their
-- own `notifications` rows but the embedded `notification_events` select
-- returned NULL, rendering every in-app message as empty.
--
-- Policy: a user may SELECT a notification_event row iff they have at least
-- one matching `notifications` row referencing it. This keeps the audit log
-- isolated (no cross-user visibility of other users' notification history)
-- while unblocking the in-app surface.
--
-- Rollback: DROP POLICY (safe — policy removal reverts to RLS-deny-all
-- behavior, bell goes back to showing empty).

CREATE POLICY notification_events_own_via_notification
  ON notification_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM notifications n
      WHERE n.event_id = notification_events.id
        AND n.user_id = auth.uid()
    )
  );
