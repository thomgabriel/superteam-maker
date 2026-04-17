// Notification dispatcher types. Keep the union, CRITICAL_KINDS, and
// KIND_CHANNELS in lockstep when new kinds are added.

export type NotificationKind =
  | 'team_matched'
  | 'confirmation_reminder'
  | 'leader_claim_opened'
  | 'team_dissolved_pre_activation'
  | 'leader_needed_reminder'
  | 'leader_claimed'
  | 'team_understaffed'
  | 'member_replaced'
  | 'you_were_replaced'
  | 'team_deactivated'
  | 'leader_dormant_detected'
  | 'leader_demoted';

export type NotificationChannel = 'email' | 'in_app';

export type NotificationStatus =
  | 'pending'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'suppressed';

// --- Per-kind payload shapes --------------------------------------------------
// All payloads include enough denormalized context for templates + in-app
// rendering without joining back to the DB at render time.

export interface BaseTeamPayload {
  team_id: string;
  team_name: string;
}

export interface TeamMatchedPayload extends BaseTeamPayload {
  kind: 'team_matched';
}

export interface ConfirmationReminderPayload extends BaseTeamPayload {
  kind: 'confirmation_reminder';
  deadline_at: string; // ISO timestamp
}

export interface LeaderClaimOpenedPayload extends BaseTeamPayload {
  kind: 'leader_claim_opened';
  activation_deadline_at: string;
}

export interface TeamDissolvedPreActivationPayload extends BaseTeamPayload {
  kind: 'team_dissolved_pre_activation';
  reason: 'confirmation_failed' | 'activation_timeout' | 'understaffed_grace' | 'manual_admin';
}

export interface LeaderNeededReminderPayload extends BaseTeamPayload {
  kind: 'leader_needed_reminder';
  activation_deadline_at: string;
  hours_remaining: number;
}

export interface LeaderClaimedPayload extends BaseTeamPayload {
  kind: 'leader_claimed';
  leader_name: string;
  whatsapp_url?: string | null;
}

export interface TeamUnderstaffedPayload extends BaseTeamPayload {
  kind: 'team_understaffed';
  grace_deadline_at: string;
  current_member_count: number;
}

export interface MemberReplacedPayload extends BaseTeamPayload {
  kind: 'member_replaced';
  replacement_name: string;
  replacement_role: string;
}

export interface YouWereReplacedPayload {
  kind: 'you_were_replaced';
  team_id: string;
  team_name: string;
}

export interface TeamDeactivatedPayload extends BaseTeamPayload {
  kind: 'team_deactivated';
  reason: 'confirmation_failed' | 'activation_timeout' | 'understaffed_grace' | 'manual_admin';
}

export interface LeaderDormantDetectedPayload extends BaseTeamPayload {
  kind: 'leader_dormant_detected';
  leader_name: string;
  hours_silent: number;
}

export interface LeaderDemotedPayload extends BaseTeamPayload {
  kind: 'leader_demoted';
}

export type NotificationEventPayload =
  | TeamMatchedPayload
  | ConfirmationReminderPayload
  | LeaderClaimOpenedPayload
  | TeamDissolvedPreActivationPayload
  | LeaderNeededReminderPayload
  | LeaderClaimedPayload
  | TeamUnderstaffedPayload
  | MemberReplacedPayload
  | YouWereReplacedPayload
  | TeamDeactivatedPayload
  | LeaderDormantDetectedPayload
  | LeaderDemotedPayload;

export type PayloadFor<K extends NotificationKind> = Extract<
  NotificationEventPayload,
  { kind: K }
>;

// --- Taxonomy ----------------------------------------------------------------
// CRITICAL_KINDS bypass user preferences — email_lifecycle is locked on.
export const CRITICAL_KINDS: ReadonlySet<NotificationKind> = new Set<NotificationKind>([
  'team_matched',
  'confirmation_reminder',
  'leader_claim_opened',
  'team_dissolved_pre_activation',
  'leader_needed_reminder',
  'team_understaffed',
  'you_were_replaced',
  'team_deactivated',
  'leader_demoted',
]);

// Channel fan-out per kind.
export const KIND_CHANNELS: Record<NotificationKind, readonly NotificationChannel[]> = {
  team_matched: ['email', 'in_app'],
  confirmation_reminder: ['email', 'in_app'],
  leader_claim_opened: ['email', 'in_app'],
  team_dissolved_pre_activation: ['email'],
  leader_needed_reminder: ['email', 'in_app'],
  leader_claimed: ['email', 'in_app'],
  team_understaffed: ['email', 'in_app'],
  member_replaced: ['email'],
  you_were_replaced: ['email'],
  team_deactivated: ['email'],
  leader_dormant_detected: ['in_app'],
  leader_demoted: ['email'],
};

// Preference defaults used when a user has no preferences row yet (fallback only —
// trigger should cover this in production).
export const DEFAULT_PREFERENCES = {
  email_lifecycle: true,
  email_reminders: true,
  in_app_enabled: true,
} as const;

export interface NotificationPreferences {
  email_lifecycle: boolean;
  email_reminders: boolean;
  in_app_enabled: boolean;
}

// Non-critical email kinds are governed by email_reminders.
// Critical email kinds are governed by email_lifecycle BUT the UI locks that
// on, so in practice critical always passes; we still gate here as belt-and-
// suspenders in case someone toggles via SQL or future UI extends controls.
export function isChannelAllowed(
  kind: NotificationKind,
  channel: NotificationChannel,
  prefs: NotificationPreferences,
): boolean {
  if (CRITICAL_KINDS.has(kind)) {
    // Critical events are exempt from all preference gates.
    return true;
  }

  if (channel === 'email') {
    return prefs.email_reminders;
  }

  if (channel === 'in_app') {
    return prefs.in_app_enabled;
  }

  return false;
}

export interface EmitArgs<K extends NotificationKind> {
  user_ids: string[];
  team_id?: string | null;
  payload: PayloadFor<K>;
  throttle_key?: string | null;
  // When passed, throttle_key lookup is scoped per-user (e.g. silence nudges).
  // Set to 'global' (default) to dedupe across all users.
  throttle_scope?: 'per_user' | 'global';
}

export interface EmitResult {
  event_id: string | null;
  notifications_created: number;
  skipped_throttled: boolean;
  errors: Array<{ user_id: string; message: string }>;
}
