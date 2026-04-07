import type {
  CopilotSearchParams,
  CopilotSearchResponse,
  CopilotFiltersResponse,
} from "@/types/colosseum";

const BASE_URL = "https://copilot.colosseum.com/api/v1";

type SearchResult =
  | { ok: true; data: CopilotSearchResponse }
  | { ok: false; error: string };

function headers(): HeadersInit {
  const pat = process.env.COLOSSEUM_COPILOT_PAT;
  if (!pat) throw new Error("COLOSSEUM_COPILOT_PAT is not set");
  return {
    Authorization: `Bearer ${pat}`,
    "Content-Type": "application/json",
  };
}

export async function searchProjects(
  params: CopilotSearchParams
): Promise<SearchResult> {
  try {
    const res = await fetch(`${BASE_URL}/search/projects`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(params),
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return { ok: false, error: `Copilot API ${res.status}` };
    }
    const data: CopilotSearchResponse = await res.json();
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Copilot API unreachable" };
  }
}

export async function getFilters(): Promise<CopilotFiltersResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}/filters`, {
      method: "GET",
      headers: headers(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
