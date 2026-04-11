export const CURATED_IDEA_CATEGORIES = [
  "Pagamentos",
  "Consumo",
  "DeFi",
  "DePIN",
  "AI",
  "Infra",
  "Gaming",
  "Governança",
] as const;

export type CuratedIdeaCategory = (typeof CURATED_IDEA_CATEGORIES)[number];

export const CURATED_IDEA_BUILD_SCORES = ["easy", "medium", "stretch"] as const;

export type CuratedIdeaBuildScore =
  (typeof CURATED_IDEA_BUILD_SCORES)[number];

export const CURATED_IDEA_EDITORIAL_TRACKS = [
  "beginner-friendly",
  "creator-tools",
  "real-world-payments",
  "community-growth",
  "trust-and-proof",
  "demo-friendly",
] as const;

export type CuratedIdeaEditorialTrack =
  (typeof CURATED_IDEA_EDITORIAL_TRACKS)[number];

export type CuratedIdeaSort =
  | "featured"
  | "easiest"
  | "crypto-angle"
  | "pain-point";

export interface CuratedIdea {
  id: string;
  category: CuratedIdeaCategory;
  title: string;
  description: string;
  details: string;
  targetUser: string;
  painPoint: string;
  cryptoAngle: string;
  mvpScope: string;
  judgeHook: string;
  buildScore: CuratedIdeaBuildScore;
  painScore: 1 | 2 | 3;
  cryptoScore: 1 | 2 | 3;
  confidenceNote: string;
  featured: boolean;
  editorialTracks: CuratedIdeaEditorialTrack[];
  tags: string[];
}

export interface CuratedIdeasFilters {
  query: string;
  category: CuratedIdeaCategory | null;
  editorialTrack: CuratedIdeaEditorialTrack | null;
  buildScore: CuratedIdeaBuildScore | null;
  featuredOnly: boolean;
}
