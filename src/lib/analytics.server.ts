import { cookies } from 'next/headers';
import type { AnalyticsEvent } from '@/types/database';
import { ANON_ID_COOKIE_NAME } from '@/lib/attribution-constants';
import { createServiceRoleClient } from '@/lib/supabase/server';

type EventProperties = Record<string, string | number | boolean | null | undefined>;

export interface TrackEventInput {
  event: AnalyticsEvent;
  userId?: string | null;
  anonymousId?: string | null;
  route?: string | null;
  properties?: EventProperties;
}

function sanitizeProperties(properties: EventProperties | undefined) {
  if (!properties) {
    return null;
  }

  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  );
}

export async function trackEvent(input: TrackEventInput) {
  const db = await createServiceRoleClient();

  let anonymousId = input.anonymousId ?? null;
  if (!anonymousId) {
    try {
      const cookieStore = await cookies();
      anonymousId = cookieStore.get(ANON_ID_COOKIE_NAME)?.value ?? null;
    } catch {
      // Called outside request context (cron job, background task) — no cookies available
    }
  }

  await db.from('analytics_events').insert({
    event_name: input.event,
    user_id: input.userId ?? null,
    anonymous_id: anonymousId,
    route: input.route ?? null,
    metadata: sanitizeProperties(input.properties),
  });
}
