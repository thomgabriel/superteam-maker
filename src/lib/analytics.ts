import { ANON_ID_COOKIE_NAME } from '@/lib/attribution-constants';
import type { AnalyticsEvent } from '@/types/database';

type EventProperties = Record<string, string | number | boolean | null | undefined>;

export async function trackEvent(input: {
  event: AnalyticsEvent;
  anonymousId?: string | null;
  route?: string | null;
  properties?: EventProperties;
}) {
  const anonymousId =
    input.anonymousId ??
    (typeof window !== 'undefined'
      ? localStorage.getItem(ANON_ID_COOKIE_NAME)
      : null);

  await fetch('/api/analytics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event: input.event,
      anonymousId,
      route: input.route ?? null,
      properties: input.properties,
    }),
  });
}
