'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function UtmCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const utm_source = searchParams.get('utm_source');
    const utm_medium = searchParams.get('utm_medium');
    const utm_campaign = searchParams.get('utm_campaign');

    if (utm_source || utm_medium || utm_campaign) {
      localStorage.setItem(
        'utm_params',
        JSON.stringify({ utm_source, utm_medium, utm_campaign }),
      );
    }
  }, [searchParams]);

  return null;
}
