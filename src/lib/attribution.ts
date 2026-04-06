import { cookies } from 'next/headers';
import type { User } from '@/types/database';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { UTM_COOKIE_NAME } from '@/lib/attribution-constants';

export interface AttributionData {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

function normalizeUtmValue(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

export async function readAttributionFromCookies(): Promise<AttributionData | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(UTM_COOKIE_NAME)?.value;

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<AttributionData>;
    return {
      utm_source: normalizeUtmValue(parsed.utm_source),
      utm_medium: normalizeUtmValue(parsed.utm_medium),
      utm_campaign: normalizeUtmValue(parsed.utm_campaign),
    };
  } catch {
    return null;
  }
}

export async function persistAttributionForUser(userId: string) {
  const attribution = await readAttributionFromCookies();

  if (!attribution) {
    return;
  }

  const db = await createServiceRoleClient();
  const { data: existingUser } = await db
    .from('users')
    .select('utm_source, utm_medium, utm_campaign')
    .eq('id', userId)
    .maybeSingle<User>();

  if (!existingUser) {
    return;
  }

  const nextValues = {
    utm_source: existingUser.utm_source ?? attribution.utm_source,
    utm_medium: existingUser.utm_medium ?? attribution.utm_medium,
    utm_campaign: existingUser.utm_campaign ?? attribution.utm_campaign,
  };

  const shouldUpdate =
    nextValues.utm_source !== existingUser.utm_source ||
    nextValues.utm_medium !== existingUser.utm_medium ||
    nextValues.utm_campaign !== existingUser.utm_campaign;

  if (!shouldUpdate) {
    return;
  }

  await db.from('users').update(nextValues).eq('id', userId);
}
