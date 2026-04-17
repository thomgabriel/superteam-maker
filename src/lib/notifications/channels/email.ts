// Email channel handler.
//
// The dispatcher is the single email path. `deliverEmail(notification_id,
// payload, email)` renders the per-kind template, calls Resend via
// `sendEmail`, and updates the notifications row to sent/suppressed/failed.
// A future worker-based `sendPendingEmails()` is easy to add — everything is
// persisted in the `notifications` table.

import type { SupabaseClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';
import { renderTemplate, type TemplateContext } from '../templates';
import type { NotificationEventPayload } from '../types';
import { logError, logInfo } from '@/lib/monitoring';

export interface DeliverEmailArgs {
  supabase: SupabaseClient;
  notificationId: string;
  userEmail: string | null;
  payload: NotificationEventPayload;
  context?: TemplateContext;
}

export async function deliverEmail(args: DeliverEmailArgs): Promise<void> {
  const { supabase, notificationId, userEmail, payload } = args;
  const nowIso = new Date().toISOString();

  if (!userEmail) {
    await markFailed(supabase, notificationId, 'missing_email', nowIso);
    return;
  }

  try {
    const { subject, html } = renderTemplate(payload, args.context);
    const outcome = await sendEmail({ to: userEmail, subject, html });

    if (outcome.status === 'sent') {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ status: 'sent', sent_at: nowIso, error: null })
        .eq('id', notificationId);
      if (updateError) {
        logError('notifications.email.mark_sent_failed', updateError, {
          notification_id: notificationId,
          kind: payload.kind,
        });
      }
      logInfo('notifications.email.sent', {
        notification_id: notificationId,
        kind: payload.kind,
      });
      return;
    }

    if (outcome.status === 'skipped') {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({
          status: 'suppressed',
          sent_at: nowIso,
          error: outcome.reason ?? 'skipped',
        })
        .eq('id', notificationId);
      if (updateError) {
        logError('notifications.email.mark_suppressed_failed', updateError, {
          notification_id: notificationId,
        });
      }
      logInfo('notifications.email.suppressed', {
        notification_id: notificationId,
        reason: outcome.reason ?? null,
      });
      return;
    }

    await markFailed(
      supabase,
      notificationId,
      outcome.reason ?? 'send_failed',
      nowIso,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logError('notifications.email.delivery_failed', error, {
      notification_id: notificationId,
      kind: payload.kind,
    });
    await markFailed(supabase, notificationId, message, nowIso);
  }
}

async function markFailed(
  supabase: SupabaseClient,
  notificationId: string,
  reason: string,
  nowIso: string,
) {
  const { error: updateError } = await supabase
    .from('notifications')
    .update({ status: 'failed', error: reason, sent_at: nowIso })
    .eq('id', notificationId);
  if (updateError) {
    logError('notifications.email.mark_failed_failed', updateError, {
      notification_id: notificationId,
      reason,
    });
  }
}
