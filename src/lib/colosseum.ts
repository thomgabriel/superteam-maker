import type {
  CopilotSearchParams,
  CopilotSearchResponse,
  CopilotFiltersResponse,
} from "@/types/colosseum";

const BASE_URL = "https://copilot.colosseum.com/api/v1";
const SEARCH_CACHE_TTL_MS = 5 * 60_000;
const FILTERS_CACHE_TTL_MS = 60 * 60_000;

type SearchResult =
  | { ok: true; data: CopilotSearchResponse }
  | { ok: false; error: string };

interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

const searchCache = new Map<string, CacheEntry<CopilotSearchResponse>>();
const filtersCache = new Map<string, CacheEntry<CopilotFiltersResponse>>();

function headers(): HeadersInit {
  const pat = process.env.COLOSSEUM_COPILOT_PAT;
  if (!pat) throw new Error("COLOSSEUM_COPILOT_PAT is not set");
  return {
    Authorization: `Bearer ${pat}`,
    "Content-Type": "application/json",
  };
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item !== undefined)
      .sort(([a], [b]) => a.localeCompare(b));

    return `{${entries
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function getFreshCacheValue<T>(
  cache: Map<string, CacheEntry<T>>,
  key: string
): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt > Date.now()) return entry.value;
  return null;
}

function getStaleCacheValue<T>(
  cache: Map<string, CacheEntry<T>>,
  key: string
): T | null {
  return cache.get(key)?.value ?? null;
}

function setCacheValue<T>(
  cache: Map<string, CacheEntry<T>>,
  key: string,
  value: T,
  ttlMs: number
) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function resetColosseumCacheForTests() {
  searchCache.clear();
  filtersCache.clear();
}

export async function searchProjects(
  params: CopilotSearchParams
): Promise<SearchResult> {
  const cacheKey = stableStringify(params);
  const cached = getFreshCacheValue(searchCache, cacheKey);
  if (cached) {
    return { ok: true, data: cached };
  }

  try {
    const res = await fetch(`${BASE_URL}/search/projects`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(params),
      cache: "no-store",
    });
    if (!res.ok) {
      const stale = getStaleCacheValue(searchCache, cacheKey);
      if (stale) {
        return { ok: true, data: stale };
      }
      return { ok: false, error: `Copilot API ${res.status}` };
    }
    const data: CopilotSearchResponse = await res.json();
    setCacheValue(searchCache, cacheKey, data, SEARCH_CACHE_TTL_MS);
    return { ok: true, data };
  } catch {
    const stale = getStaleCacheValue(searchCache, cacheKey);
    if (stale) {
      return { ok: true, data: stale };
    }
    return { ok: false, error: "Copilot API unreachable" };
  }
}

export async function getFilters(): Promise<CopilotFiltersResponse | null> {
  const cacheKey = "filters";
  const cached = getFreshCacheValue(filtersCache, cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const res = await fetch(`${BASE_URL}/filters`, {
      method: "GET",
      headers: headers(),
      cache: "no-store",
    });
    if (!res.ok) {
      return getStaleCacheValue(filtersCache, cacheKey);
    }
    const data: CopilotFiltersResponse = await res.json();
    setCacheValue(filtersCache, cacheKey, data, FILTERS_CACHE_TTL_MS);
    return data;
  } catch {
    return getStaleCacheValue(filtersCache, cacheKey);
  }
}
