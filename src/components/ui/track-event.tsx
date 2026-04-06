'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export function TrackPageView({
  event,
  properties,
}: {
  event: Parameters<typeof trackEvent>[0];
  properties?: Parameters<typeof trackEvent>[1];
}) {
  useEffect(() => {
    trackEvent(event, properties);
  }, [event, properties]);

  return null;
}
