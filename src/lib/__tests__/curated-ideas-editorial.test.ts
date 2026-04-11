import { describe, expect, it } from "vitest";
import {
  BUILD_SCORE_LABELS,
  EDITORIAL_TRACK_LABELS,
  filterCuratedIdeas,
  getFeaturedIdeas,
  sortCuratedIdeas,
} from "../curated-ideas/editorial";
import type { CuratedIdea } from "../curated-ideas/types";

function makeIdea(overrides: Partial<CuratedIdea> = {}): CuratedIdea {
  return {
    id: overrides.id ?? "idea-001",
    category: overrides.category ?? "Pagamentos",
    title: overrides.title ?? "Checkout simples para creators",
    description:
      overrides.description ?? "Venda um produto digital com checkout claro.",
    details:
      overrides.details ?? "Fluxo enxuto com link de pagamento e comprovante.",
    targetUser: overrides.targetUser ?? "Creators brasileiros",
    painPoint:
      overrides.painPoint ?? "Cobrança e prova de pagamento geram atrito.",
    cryptoAngle:
      overrides.cryptoAngle ??
      "USDC simplifica recebimento global com recibo onchain.",
    mvpScope:
      overrides.mvpScope ?? "Landing, checkout, status do pagamento e recibo.",
    judgeHook:
      overrides.judgeHook ??
      "Mostra um problema real com crypto visível e fácil de demo.",
    buildScore: overrides.buildScore ?? "easy",
    painScore: overrides.painScore ?? 3,
    cryptoScore: overrides.cryptoScore ?? 3,
    confidenceNote:
      overrides.confidenceNote ??
      "Bom para times iniciantes com foco em UX.",
    featured: overrides.featured ?? false,
    editorialTracks: overrides.editorialTracks ?? [
      "beginner-friendly",
      "real-world-payments",
    ],
    tags: overrides.tags ?? ["Pagamentos", "Brasil", "Creators"],
  };
}

describe("curated ideas editorial helpers", () => {
  it("exposes stable labels for build score and editorial tracks", () => {
    expect(BUILD_SCORE_LABELS.easy).toBe("Fácil de construir");
    expect(EDITORIAL_TRACK_LABELS["beginner-friendly"]).toBe(
      "Para iniciantes"
    );
  });

  it("returns featured ideas first and caps the featured strip", () => {
    const ideas = [
      makeIdea({ id: "idea-001", featured: true }),
      makeIdea({ id: "idea-002", featured: true }),
      makeIdea({ id: "idea-003", featured: false }),
    ];

    const featured = getFeaturedIdeas(ideas, 2);

    expect(featured).toHaveLength(2);
    expect(featured.every((idea) => idea.featured)).toBe(true);
  });

  it("filters by query, track, build score, and featured flag", () => {
    const ideas = [
      makeIdea({ id: "idea-001", title: "Checkout creator", featured: true }),
      makeIdea({
        id: "idea-002",
        title: "Mapa de enchentes",
        category: "DePIN",
        buildScore: "stretch",
        editorialTracks: ["trust-and-proof"],
      }),
    ];

    const filtered = filterCuratedIdeas(ideas, {
      query: "creator",
      editorialTrack: "beginner-friendly",
      buildScore: "easy",
      featuredOnly: true,
      category: null,
    });

    expect(filtered.map((idea) => idea.id)).toEqual(["idea-001"]);
  });

  it("sorts featured ideas first by default", () => {
    const ideas = [
      makeIdea({ id: "idea-002", featured: false, buildScore: "easy" }),
      makeIdea({ id: "idea-001", featured: true, buildScore: "medium" }),
    ];

    const sorted = sortCuratedIdeas(ideas, "featured");

    expect(sorted.map((idea) => idea.id)).toEqual(["idea-001", "idea-002"]);
  });
});
