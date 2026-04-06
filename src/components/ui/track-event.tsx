'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

type TrackEventOptions = Parameters<typeof trackEvent>[0];

export function TrackPageView({
  event,
  properties,
}: {
  event: TrackEventOptions['event'];
  properties?: TrackEventOptions['properties'];
}) {
  useEffect(() => {
    void trackEvent({
      event,
      properties,
      route: window.location.pathname,
    });
  }, [event, properties]);

  return null;
}
