import type {
  CuratedIdea,
  CuratedIdeaBuildScore,
  CuratedIdeaEditorialTrack,
  CuratedIdeasFilters,
  CuratedIdeaSort,
} from "./types";

export const BUILD_SCORE_LABELS: Record<CuratedIdeaBuildScore, string> = {
  easy: "Fácil de construir",
  medium: "Médio",
  stretch: "Mais ambicioso",
};

export const EDITORIAL_TRACK_LABELS: Record<CuratedIdeaEditorialTrack, string> =
  {
    "beginner-friendly": "Para iniciantes",
    "creator-tools": "Ferramentas para creators",
    "real-world-payments": "Pagamentos reais",
    "community-growth": "Comunidade e crescimento",
    "trust-and-proof": "Confiança e prova",
    "demo-friendly": "Demo forte",
  };

export function getFeaturedIdeas(
  ideas: CuratedIdea[],
  limit = 6
): CuratedIdea[] {
  return ideas.filter((idea) => idea.featured).slice(0, limit);
}

export function filterCuratedIdeas(
  ideas: CuratedIdea[],
  filters: CuratedIdeasFilters
): CuratedIdea[] {
  const query = filters.query.trim().toLowerCase();

  return ideas.filter((idea) => {
    if (filters.category && idea.category !== filters.category) return false;

    if (
      filters.editorialTrack &&
      !idea.editorialTracks.includes(filters.editorialTrack)
    ) {
      return false;
    }

    if (filters.buildScore && idea.buildScore !== filters.buildScore) {
      return false;
    }

    if (filters.featuredOnly && !idea.featured) return false;
    if (!query) return true;

    const haystack = [
      idea.title,
      idea.description,
      idea.details,
      idea.targetUser,
      idea.painPoint,
      idea.cryptoAngle,
      idea.mvpScope,
      idea.judgeHook,
      idea.confidenceNote,
      ...idea.tags,
      ...idea.editorialTracks,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function sortCuratedIdeas(
  ideas: CuratedIdea[],
  sort: CuratedIdeaSort
): CuratedIdea[] {
  const next = [...ideas];

  if (sort === "featured") {
    return next.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  if (sort === "easiest") {
    const weight = { easy: 0, medium: 1, stretch: 2 };
    return next.sort((a, b) => weight[a.buildScore] - weight[b.buildScore]);
  }

  if (sort === "crypto-angle") {
    return next.sort((a, b) => b.cryptoScore - a.cryptoScore);
  }

  return next.sort((a, b) => b.painScore - a.painScore);
}
