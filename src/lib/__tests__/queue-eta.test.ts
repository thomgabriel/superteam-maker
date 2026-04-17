import { describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';

import { computeQueueEta, formatEtaLabel } from '../queue-eta';

interface Row {
  created_at: string;
  updated_at: string;
}

function buildClient(data: Row[] | null, error: unknown = null): SupabaseClient {
  const limit = vi.fn().mockResolvedValue({ data, error });
  const gte = vi.fn().mockReturnValue({ limit });
  const eq = vi.fn().mockReturnValue({ gte });
  const select = vi.fn().mockReturnValue({ eq });
  const from = vi.fn().mockReturnValue({ select });
  return { from } as unknown as SupabaseClient;
}

function makeRow(waitMinutes: number): Row {
  const now = Date.now();
  return {
    created_at: new Date(now - waitMinutes * 60_000).toISOString(),
    updated_at: new Date(now).toISOString(),
  };
}

describe('computeQueueEta', () => {
  it('returns null median and low confidence for an empty data array', async () => {
    const client = buildClient([]);
    const result = await computeQueueEta(client);
    expect(result).toEqual({ medianMinutes: null, sampleSize: 0, confidence: 'low' });
  });

  it('returns null median when fewer than 5 samples are available', async () => {
    const rows = Array.from({ length: 4 }, () => makeRow(15));
    const client = buildClient(rows);
    const result = await computeQueueEta(client);
    expect(result.medianMinutes).toBeNull();
    expect(result.confidence).toBe('low');
  });

  it('returns low confidence for 5-9 samples', async () => {
    const rows = Array.from({ length: 7 }, () => makeRow(20));
    const client = buildClient(rows);
    const result = await computeQueueEta(client);
    expect(result.medianMinutes).toBe(20);
    expect(result.sampleSize).toBe(7);
    expect(result.confidence).toBe('low');
  });

  it('returns medium confidence for 10-29 samples', async () => {
    const rows = Array.from({ length: 15 }, () => makeRow(30));
    const client = buildClient(rows);
    const result = await computeQueueEta(client);
    expect(result.confidence).toBe('medium');
    expect(result.sampleSize).toBe(15);
  });

  it('returns high confidence for 30+ samples', async () => {
    const rows = Array.from({ length: 40 }, () => makeRow(45));
    const client = buildClient(rows);
    const result = await computeQueueEta(client);
    expect(result.confidence).toBe('high');
    expect(result.sampleSize).toBe(40);
  });

  it('drops 0-minute anomalies and waits longer than 72h', async () => {
    const rows: Row[] = [
      // 0-minute entry: created_at == updated_at
      (() => {
        const t = new Date().toISOString();
        return { created_at: t, updated_at: t };
      })(),
      // 80h entry: 4800 minutes > 72 * 60 = 4320
      makeRow(80 * 60),
      // valid samples
      makeRow(10),
      makeRow(20),
      makeRow(30),
      makeRow(40),
      makeRow(50),
    ];
    const client = buildClient(rows);
    const result = await computeQueueEta(client);
    // 5 valid samples remain after sanity filter
    expect(result.sampleSize).toBe(5);
    // median of [10,20,30,40,50] = 30
    expect(result.medianMinutes).toBe(30);
    expect(result.confidence).toBe('low');
  });

  it('computes the median correctly for an odd sample count', async () => {
    const rows = [makeRow(5), makeRow(10), makeRow(15), makeRow(20), makeRow(25)];
    const client = buildClient(rows);
    const result = await computeQueueEta(client);
    expect(result.medianMinutes).toBe(15);
  });

  it('computes the median for an even sample count (picks upper-middle)', async () => {
    const rows = [makeRow(10), makeRow(20), makeRow(30), makeRow(40), makeRow(50), makeRow(60)];
    const client = buildClient(rows);
    const result = await computeQueueEta(client);
    // Floor(6/2) = index 3 -> 40
    expect(result.medianMinutes).toBe(40);
  });

  it('returns low confidence null when the supabase query errors', async () => {
    const client = buildClient(null, new Error('db offline'));
    const result = await computeQueueEta(client);
    expect(result).toEqual({ medianMinutes: null, sampleSize: 0, confidence: 'low' });
  });

  it('queries the matchmaking_pool table with the expected filters', async () => {
    const rows = Array.from({ length: 5 }, () => makeRow(12));
    const limit = vi.fn().mockResolvedValue({ data: rows, error: null });
    const gte = vi.fn().mockReturnValue({ limit });
    const eq = vi.fn().mockReturnValue({ gte });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient;

    await computeQueueEta(client);

    expect(from).toHaveBeenCalledWith('matchmaking_pool');
    expect(select).toHaveBeenCalledWith('created_at, updated_at');
    expect(eq).toHaveBeenCalledWith('status', 'assigned');
    expect(limit).toHaveBeenCalledWith(100);
    // gte argument is a dynamic ISO timestamp but should be called once
    expect(gte).toHaveBeenCalledTimes(1);
    expect(gte.mock.calls[0][0]).toBe('updated_at');
    expect(typeof gte.mock.calls[0][1]).toBe('string');
  });
});

describe('formatEtaLabel', () => {
  it('returns a minutes label for ETAs below an hour', () => {
    expect(formatEtaLabel({ medianMinutes: 15, sampleSize: 10, confidence: 'medium' })).toBe(
      '~15min tempo médio',
    );
    expect(formatEtaLabel({ medianMinutes: 59, sampleSize: 10, confidence: 'medium' })).toBe(
      '~59min tempo médio',
    );
  });

  it('returns an hours label for ETAs at or above an hour', () => {
    expect(formatEtaLabel({ medianMinutes: 60, sampleSize: 10, confidence: 'medium' })).toBe(
      '~1h tempo médio',
    );
    expect(formatEtaLabel({ medianMinutes: 150, sampleSize: 10, confidence: 'medium' })).toBe(
      '~3h tempo médio',
    );
  });

  it('returns null when medianMinutes is null', () => {
    expect(formatEtaLabel({ medianMinutes: null, sampleSize: 0, confidence: 'low' })).toBeNull();
  });
});
