import type { SupabaseClient } from '@supabase/supabase-js';

export interface QueueEta {
  medianMinutes: number | null;
  sampleSize: number;
  confidence: 'low' | 'medium' | 'high';
}

/**
 * Compute a rough queue-time estimate from historical matchmaking pool data.
 * Measures elapsed time from pool entry (created_at) to assignment (updated_at where status='assigned').
 * Returns null medianMinutes when sample is too small to be meaningful.
 */
export async function computeQueueEta(client: SupabaseClient): Promise<QueueEta> {
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await client
    .from('matchmaking_pool')
    .select('created_at, updated_at')
    .eq('status', 'assigned')
    .gte('updated_at', fourteenDaysAgo)
    .limit(100);

  if (error || !data || data.length < 5) {
    return { medianMinutes: null, sampleSize: data?.length ?? 0, confidence: 'low' };
  }

  const waitMinutes = data
    .map((row) => {
      const created = new Date(row.created_at).getTime();
      const updated = new Date(row.updated_at).getTime();
      return (updated - created) / 60000;
    })
    .filter((m) => m > 0 && m < 72 * 60) // sanity: drop 0-minute anomalies and absurdly long waits
    .sort((a, b) => a - b);

  if (waitMinutes.length < 5) {
    return { medianMinutes: null, sampleSize: waitMinutes.length, confidence: 'low' };
  }

  const median = waitMinutes[Math.floor(waitMinutes.length / 2)];
  const confidence: QueueEta['confidence'] =
    waitMinutes.length < 10 ? 'low' : waitMinutes.length < 30 ? 'medium' : 'high';

  return {
    medianMinutes: Math.round(median),
    sampleSize: waitMinutes.length,
    confidence,
  };
}

export function formatEtaLabel(eta: QueueEta): string | null {
  if (eta.medianMinutes === null) return null;
  if (eta.medianMinutes < 60) {
    return `~${eta.medianMinutes}min tempo médio`;
  }
  const hours = Math.round(eta.medianMinutes / 60);
  return `~${hours}h tempo médio`;
}
