// --- API response types for Colosseum Copilot ---

export interface CopilotProject {
  slug: string;
  name: string;
  oneLiner: string | null;
  similarity: number;
  hackathon: {
    name: string;
    slug: string;
    startDate: string;
  };
  tracks: { name: string; key: string }[];
  links: {
    github: string | null;
    demo: string | null;
    presentation: string | null;
    technicalDemo: string | null;
    twitter: string | null;
    colosseum: string | null;
  };
  evidence: string[];
  prize: {
    type: string;
    name: string | null;
    placement: number | null;
    amount: number | null;
    trackName: string | null;
  } | null;
  accelerator: {
    companySlug: string | null;
    companyName: string | null;
    batchKey: string;
    batchName: string;
  } | null;
  metrics: {
    likesCount?: number;
    commentsCount?: number;
    updatesCount: number;
  };
  team: { count: number };
  crowdedness: number | null;
  tags: {
    problemTags: string[];
    solutionTags: string[];
    primitives: string[];
    techStack: string[];
    targetUsers: string[];
  } | null;
  cluster: { key: string; label: string } | null;
}

export interface CopilotSearchResponse {
  results: CopilotProject[];
  filtersApplied: Record<string, unknown>;
  totalFound: number;
  hasMore: boolean;
  facets: CopilotFacets | null;
}

export interface CopilotFacetBucket {
  key: string;
  label: string;
  count: number;
  sampleProjectSlugs: string[];
}

export interface CopilotFacets {
  hackathons?: CopilotFacetBucket[];
  tracks?: CopilotFacetBucket[];
  prizes?: CopilotFacetBucket[];
  problemTags?: CopilotFacetBucket[];
  solutionTags?: CopilotFacetBucket[];
  primitives?: CopilotFacetBucket[];
  techStack?: CopilotFacetBucket[];
  clusters?: CopilotFacetBucket[];
}

export interface CopilotSearchParams {
  query?: string;
  hackathons?: string[];
  trackKeys?: string[];
  limit?: number;
  offset?: number;
  includeFacets?: boolean;
  filters?: {
    winnersOnly?: boolean;
    acceleratorOnly?: boolean;
    techStack?: string[];
    primitives?: string[];
    problemTags?: string[];
    solutionTags?: string[];
    targetUsers?: string[];
    clusterKeys?: string[];
  };
}

export interface CopilotFiltersResponse {
  tracks: { key: string; name: string; hackathonSlug: string; projectCount: number }[];
  hackathons: { slug: string; name: string; startDate: string; projectCount: number; winnerCount: number }[];
  problemTags: { tag: string; count: number }[];
  solutionTags: { tag: string; count: number }[];
  primitives: { tag: string; count: number }[];
  techStack: { tag: string; count: number }[];
  clusters: { key: string; label: string; projectCount: number }[];
  targetUsers: { tag: string; count: number }[];
  archiveSources: { key: string; label: string; count: number }[];
}
