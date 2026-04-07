import { NextResponse } from "next/server";
import { searchProjects } from "@/lib/colosseum";
import type { CopilotSearchParams } from "@/types/colosseum";

const MAX_BODY = 2048;

function capArray(val: unknown, max: number): string[] | undefined {
  if (!Array.isArray(val)) return undefined;
  return val.filter((v): v is string => typeof v === "string").slice(0, max);
}

export async function POST(request: Request) {
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = JSON.parse(text);

    const filters: CopilotSearchParams["filters"] = {};
    if (body.filters && typeof body.filters === "object") {
      if (typeof body.filters.winnersOnly === "boolean") filters.winnersOnly = body.filters.winnersOnly;
      if (typeof body.filters.acceleratorOnly === "boolean") filters.acceleratorOnly = body.filters.acceleratorOnly;
      const capped = (k: string) => capArray(body.filters[k], 10);
      filters.techStack = capped("techStack");
      filters.primitives = capped("primitives");
      filters.problemTags = capped("problemTags");
      filters.solutionTags = capped("solutionTags");
      filters.targetUsers = capped("targetUsers");
      filters.clusterKeys = capped("clusterKeys");
    }

    const params: CopilotSearchParams = {
      query: typeof body.query === "string" ? body.query.slice(0, 500) : undefined,
      limit: Number.isFinite(Number(body.limit))
        ? Math.min(Math.max(Number(body.limit), 1), 25)
        : 10,
      offset: Number.isFinite(Number(body.offset))
        ? Math.max(Number(body.offset), 0)
        : 0,
      includeFacets: Boolean(body.includeFacets),
      hackathons: capArray(body.hackathons, 10),
      trackKeys: capArray(body.trackKeys, 10),
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    };

    const result = await searchProjects(params);

    if (!result.ok) {
      return NextResponse.json({ error: "Search unavailable" }, { status: 502 });
    }

    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
