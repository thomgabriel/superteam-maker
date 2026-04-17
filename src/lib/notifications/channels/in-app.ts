// In-app channel handler.
//
// For in-app notifications, the notification row IS the message. We flip
// status straight from 'pending' to 'sent'; read_at is managed by the bell UI
// when the user opens/clicks.

import type { SupabaseClient } from '@supabase/supabase-js';
import { logError } from '@/lib/monitoring';

export async function markAsSent(
  supabase: SupabaseClient,
  notificationId: string,
): Promise<void> {
  const nowIso = new Date().toISOString();
  const { error } = await supabase
    .from('notifications')
    .update({ status: 'sent', sent_at: nowIso, error: null })
    .eq('id', notificationId);

  if (error) {
    logError('notifications.in_app.mark_sent_failed', error, {
      notification_id: notificationId,
    });
  }
}
