// Notification dispatcher.
//
// Writes an immutable notification_events row and fans out per user × channel
// based on preferences and the KIND_CHANNELS taxonomy. Channels are invoked
// inline (fire-and-forget semantics per-user: one failure does not block
// others) but the call is awaited so the caller can rely on the DB state
// reflecting what was attempted.

import type { SupabaseClient } from '@supabase/supabase-js';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { logError, logInfo } from '@/lib/monitoring';
import { deliverEmail } from './channels/email';
import { markAsSent as markInAppSent } from './channels/in-app';
import { buildConfirmationLink, signConfirmationToken } from '@/lib/tokens';
import type { TemplateContext } from './templates/layout';
import {
  CRITICAL_KINDS,
  DEFAULT_PREFERENCES,
  KIND_CHANNELS,
  isChannelAllowed,
  type EmitArgs,
  type EmitResult,
  type NotificationChannel,
  type NotificationKind,
  type NotificationPreferences,
  type PayloadFor,
} from './types';

// Kinds that render a one-click confirm/decline link in their email body.
// For each such emit, the dispatcher mints a per-user signed token and passes
// it via `TemplateContext.magicLink` to the renderer.
const KINDS_NEEDING_MAGIC_LINK = new Set<NotificationKind>([
  'team_matched',
  'confirmation_reminder',
]);

interface NotificationRow {
  id: string;
  channel: NotificationChannel;
  user_id: string;
}

const THROTTLE_WINDOW_DAYS = 7;

export async function emit<K extends NotificationKind>(
  kind: K,
  args: EmitArgs<K>,
  client?: SupabaseClient,
): Promise<EmitResult> {
  const result: EmitResult = {
    event_id: null,
    notifications_created: 0,
    skipped_throttled: false,
    errors: [],
  };

  const userIds = Array.from(new Set(args.user_ids.filter(Boolean)));
  if (userIds.length === 0) {
    logInfo('notifications.emit.skipped_no_users', { kind });
    return result;
  }

  const supabase = client ?? (await createServiceRoleClient());
  const throttleScope = args.throttle_scope ?? 'global';

  // Global throttle check — dedup repeated events within the window.
  if (args.throttle_key && throttleScope === 'global') {
    const hit = await findRecentEventByThrottleKey(supabase, args.throttle_key);
    if (hit) {
      result.skipped_throttled = true;
      logInfo('notifications.emit.throttled_global', {
        kind,
        throttle_key: args.throttle_key,
      });
      return result;
    }
  }

  // Insert the event row (immutable log).
  const { data: eventRow, error: eventError } = await supabase
    .from('notification_events')
    .insert({
      kind,
      subject_team_id: args.team_id ?? null,
      payload: args.payload,
      throttle_key: args.throttle_key ?? null,
    })
    .select('id')
    .single();

  if (eventError || !eventRow) {
    logError('notifications.emit.event_insert_failed', eventError, { kind });
    throw new Error(
      `Failed to record notification event (${kind}): ${eventError?.message ?? 'unknown'}`,
    );
  }

  result.event_id = eventRow.id;

  // Load preferences for all users in one query; fall back to defaults when a
  // row is missing (should be rare thanks to the auth.users trigger, but we do
  // NOT want silent failures).
  const prefsByUser = await loadPreferencesMap(supabase, userIds);

  const channels = KIND_CHANNELS[kind];
  const rowsToInsert: Array<{
    event_id: string;
    user_id: string;
    channel: NotificationChannel;
  }> = [];

  const perUserThrottled =
    args.throttle_key && throttleScope === 'per_user'
      ? await findPerUserThrottledRecipients(supabase, args.throttle_key, userIds)
      : new Set<string>();

  for (const userId of userIds) {
    if (perUserThrottled.has(userId)) continue;
    const prefs = prefsByUser.get(userId) ?? { ...DEFAULT_PREFERENCES };
    for (const channel of channels) {
      if (!isChannelAllowed(kind, channel, prefs)) {
        continue;
      }
      rowsToInsert.push({ event_id: eventRow.id, user_id: userId, channel });
    }
  }

  if (rowsToInsert.length === 0) {
    logInfo('notifications.emit.no_recipients', { kind, event_id: eventRow.id });
    return result;
  }

  const { data: insertedRows, error: insertError } = await supabase
    .from('notifications')
    .insert(rowsToInsert)
    .select('id, channel, user_id');

  if (insertError || !insertedRows) {
    logError('notifications.emit.notifications_insert_failed', insertError, {
      kind,
      event_id: eventRow.id,
      planned: rowsToInsert.length,
    });
    throw new Error(
      `Failed to insert notification rows (${kind}): ${insertError?.message ?? 'unknown'}`,
    );
  }

  result.notifications_created = insertedRows.length;

  // Fetch emails for any users who got email rows. Single query; skip if no
  // email channel rows.
  const emailRecipients = insertedRows.filter((r) => r.channel === 'email');
  const emailByUserId = emailRecipients.length
    ? await loadEmailsByUserId(
        supabase,
        emailRecipients.map((r) => r.user_id),
      )
    : new Map<string, string | null>();

  // Mint per-user magic-link tokens for kinds that need them. Per-user
  // failure is logged + falls back to the plain URL (never blocks the send).
  const magicLinkByUserId = await buildMagicLinkMap({
    kind,
    teamId: args.team_id ?? null,
    emailRecipients: emailRecipients.map((r) => r.user_id),
  });

  // Deliver per-row, catching errors individually so one failure doesn't block
  // the others. We await all promises so the caller sees final state.
  const payload = args.payload as PayloadFor<K>;
  await Promise.all(
    (insertedRows as NotificationRow[]).map(async (row) => {
      try {
        if (row.channel === 'email') {
          const magicLink = magicLinkByUserId.get(row.user_id);
          const context: TemplateContext | undefined = magicLink
            ? { magicLink }
            : undefined;
          await deliverEmail({
            supabase,
            notificationId: row.id,
            userEmail: emailByUserId.get(row.user_id) ?? null,
            payload,
            context,
          });
        } else if (row.channel === 'in_app') {
          await markInAppSent(supabase, row.id);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        result.errors.push({ user_id: row.user_id, message });
        logError('notifications.emit.channel_delivery_failed', error, {
          kind,
          channel: row.channel,
          notification_id: row.id,
        });
      }
    }),
  );

  logInfo('notifications.emit.completed', {
    kind,
    event_id: eventRow.id,
    notifications_created: result.notifications_created,
    critical: CRITICAL_KINDS.has(kind),
    errors: result.errors.length,
  });

  return result;
}

/**
 * For kinds that render a one-click magic link, mint a per-user signed
 * confirmation token and return a map of user_id → absolute URL. Individual
 * minting failures are logged but do not abort the batch — affected users
 * get the plain-URL fallback rendered by the template.
 */
async function buildMagicLinkMap(args: {
  kind: NotificationKind;
  teamId: string | null;
  emailRecipients: string[];
}): Promise<Map<string, string>> {
  const map = new Map<string, string>();

  if (!KINDS_NEEDING_MAGIC_LINK.has(args.kind)) return map;
  if (!args.teamId || args.emailRecipients.length === 0) return map;

  if (!process.env.NOTIFICATION_TOKEN_SECRET) {
    logError(
      'notifications.emit.magic_link_secret_missing',
      new Error('NOTIFICATION_TOKEN_SECRET is not configured'),
      {
        kind: args.kind,
        team_id: args.teamId,
        recipient_count: args.emailRecipients.length,
      },
    );
    return map;
  }

  await Promise.all(
    args.emailRecipients.map(async (userId) => {
      try {
        const signed = await signConfirmationToken({
          uid: userId,
          tid: args.teamId!,
          act: 'confirm',
        });
        map.set(userId, buildConfirmationLink(signed.token));
      } catch (error) {
        logError('notifications.emit.magic_link_mint_failed', error, {
          kind: args.kind,
          user_id: userId,
          team_id: args.teamId,
        });
      }
    }),
  );

  return map;
}

async function loadPreferencesMap(
  supabase: SupabaseClient,
  userIds: string[],
): Promise<Map<string, NotificationPreferences>> {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('user_id, email_lifecycle, email_reminders, in_app_enabled')
    .in('user_id', userIds);

  if (error) {
    // Surface the problem but proceed with defaults — losing preferences is
    // preferable to dropping critical notifications.
    logError('notifications.emit.preferences_load_failed', error, {
      user_count: userIds.length,
    });
  }

  const map = new Map<string, NotificationPreferences>();
  for (const row of data ?? []) {
    map.set(row.user_id, {
      email_lifecycle: row.email_lifecycle,
      email_reminders: row.email_reminders,
      in_app_enabled: row.in_app_enabled,
    });
  }
  return map;
}

async function loadEmailsByUserId(
  supabase: SupabaseClient,
  userIds: string[],
): Promise<Map<string, string | null>> {
  const map = new Map<string, string | null>();
  if (userIds.length === 0) return map;

  const { data, error } = await supabase
    .from('users')
    .select('id, email')
    .in('id', userIds);

  if (error) {
    logError('notifications.emit.email_lookup_failed', error, {
      user_count: userIds.length,
    });
    return map;
  }

  for (const row of data ?? []) {
    map.set(row.id, row.email ?? null);
  }
  return map;
}

// Per-user throttle: suppress a recipient if they already received a
// notification for an event with the same throttle_key inside the window.
// The event row carries the raw throttle_key (same as global scope); the
// per-recipient filter happens on notifications.user_id. This keeps "one event
// row per emit" invariant intact.
async function findPerUserThrottledRecipients(
  supabase: SupabaseClient,
  throttleKey: string,
  userIds: string[],
): Promise<Set<string>> {
  const suppressed = new Set<string>();
  if (userIds.length === 0) return suppressed;

  const cutoff = new Date(
    Date.now() - THROTTLE_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data: events, error: eventsError } = await supabase
    .from('notification_events')
    .select('id')
    .eq('throttle_key', throttleKey)
    .gte('emitted_at', cutoff);

  if (eventsError) {
    logError('notifications.emit.per_user_throttle_events_failed', eventsError, {
      throttle_key: throttleKey,
    });
    return suppressed;
  }
  if (!events?.length) return suppressed;

  const eventIds = events.map((e) => e.id);

  const { data: notifs, error: notifsError } = await supabase
    .from('notifications')
    .select('user_id')
    .in('event_id', eventIds)
    .in('user_id', userIds);

  if (notifsError) {
    logError('notifications.emit.per_user_throttle_notifs_failed', notifsError, {
      throttle_key: throttleKey,
    });
    return suppressed;
  }

  for (const row of notifs ?? []) suppressed.add(row.user_id);
  return suppressed;
}

async function findRecentEventByThrottleKey(
  supabase: SupabaseClient,
  throttleKey: string,
): Promise<boolean> {
  const cutoff = new Date(
    Date.now() - THROTTLE_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data, error } = await supabase
    .from('notification_events')
    .select('id')
    .eq('throttle_key', throttleKey)
    .gte('emitted_at', cutoff)
    .limit(1)
    .maybeSingle();

  if (error) {
    logError('notifications.emit.throttle_lookup_failed', error, {
      throttle_key: throttleKey,
    });
    return false;
  }

  return Boolean(data);
}
