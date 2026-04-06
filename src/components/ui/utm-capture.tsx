'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ANON_ID_COOKIE_NAME, UTM_COOKIE_NAME } from '@/lib/attribution-constants';

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

export function UtmCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const existingAnonId = localStorage.getItem(ANON_ID_COOKIE_NAME);
    if (!existingAnonId) {
      const nextAnonId = crypto.randomUUID();
      localStorage.setItem(ANON_ID_COOKIE_NAME, nextAnonId);
      writeCookie(ANON_ID_COOKIE_NAME, nextAnonId, 60 * 60 * 24 * 30);
    } else {
      writeCookie(ANON_ID_COOKIE_NAME, existingAnonId, 60 * 60 * 24 * 30);
    }

    const utm_source = searchParams.get('utm_source');
    const utm_medium = searchParams.get('utm_medium');
    const utm_campaign = searchParams.get('utm_campaign');

    if (utm_source || utm_medium || utm_campaign) {
      const payload = { utm_source, utm_medium, utm_campaign };
      localStorage.setItem(
        UTM_COOKIE_NAME,
        JSON.stringify(payload),
      );
      writeCookie(UTM_COOKIE_NAME, JSON.stringify(payload), 60 * 60 * 24 * 30);
    }
  }, [searchParams]);

  return null;
}
