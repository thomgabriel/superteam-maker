type AnalyticsEvent =
  | 'landing_view'
  | 'signup_started'
  | 'signup_completed'
  | 'profile_completed'
  | 'entered_pool'
  | 'matched_to_team'
  | 'team_reveal_viewed'
  | 'leader_claimed'
  | 'whatsapp_clicked'
  | 'team_activated'
  | 'user_replaced';

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(event: AnalyticsEvent, properties?: EventProperties) {
  console.log(`[analytics] ${event}`, properties ?? {});
}
