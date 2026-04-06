import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { trackEvent } from '@/lib/analytics.server';
import type { AnalyticsEvent } from '@/types/database';
import { ANON_ID_COOKIE_NAME } from '@/lib/attribution-constants';

const VALID_EVENTS: AnalyticsEvent[] = [
  'landing_view',
  'signup_started',
  'team_reveal_viewed',
];

export async function POST(request: Request) {
  // Basic origin check — only accept requests from our app
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  if (!origin?.startsWith(appUrl) && !referer?.startsWith(appUrl)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Cap request body size
  const rawBody = await request.text();
  if (rawBody.length > 2048) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  const body = JSON.parse(rawBody) as {
    event?: string;
    anonymousId?: string | null;
    route?: string | null;
    properties?: Record<string, string | number | boolean | null | undefined>;
  };

  if (!body.event) {
    return NextResponse.json({ error: 'Missing event' }, { status: 400 });
  }

  if (!VALID_EVENTS.includes(body.event as AnalyticsEvent)) {
    return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const anonymousCookie = cookieStore.get(ANON_ID_COOKIE_NAME)?.value ?? null;

  if (!anonymousCookie || body.anonymousId !== anonymousCookie) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (body.route && !body.route.startsWith('/')) {
    return NextResponse.json({ error: 'Invalid route' }, { status: 400 });
  }

  await trackEvent({
    event: body.event as AnalyticsEvent,
    anonymousId: anonymousCookie,
    route: body.route ?? null,
    properties: body.properties,
  });

  return NextResponse.json({ ok: true });
}
