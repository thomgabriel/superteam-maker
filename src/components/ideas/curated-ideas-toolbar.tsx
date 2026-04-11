"use client";

import { Tag } from "@/components/ui/tag";
import {
  BUILD_SCORE_LABELS,
  EDITORIAL_TRACK_LABELS,
  type CuratedIdeaBuildScore,
  type CuratedIdeaCategory,
  type CuratedIdeaEditorialTrack,
  type CuratedIdeaSort,
} from "@/lib/curated-ideas";

interface CuratedIdeasToolbarProps {
  categories: CuratedIdeaCategory[];
  selectedCategory: CuratedIdeaCategory | null;
  selectedTrack: CuratedIdeaEditorialTrack | null;
  selectedBuildScore: CuratedIdeaBuildScore | null;
  featuredOnly: boolean;
  sort: CuratedIdeaSort;
  query: string;
  onCategoryChange: (value: CuratedIdeaCategory | null) => void;
  onTrackChange: (value: CuratedIdeaEditorialTrack | null) => void;
  onBuildScoreChange: (value: CuratedIdeaBuildScore | null) => void;
  onFeaturedOnlyChange: (value: boolean) => void;
  onSortChange: (value: CuratedIdeaSort) => void;
  onQueryChange: (value: string) => void;
}

const TRACKS: CuratedIdeaEditorialTrack[] = [
  "beginner-friendly",
  "creator-tools",
  "real-world-payments",
  "community-growth",
  "trust-and-proof",
  "demo-friendly",
];

const BUILD_SCORES: CuratedIdeaBuildScore[] = ["easy", "medium", "stretch"];

export function CuratedIdeasToolbar({
  categories,
  selectedCategory,
  selectedTrack,
  selectedBuildScore,
  featuredOnly,
  sort,
  query,
  onCategoryChange,
  onTrackChange,
  onBuildScoreChange,
  onFeaturedOnlyChange,
  onSortChange,
  onQueryChange,
}: CuratedIdeasToolbarProps) {
  return (
    <div className="mb-6 space-y-4">
      <input
        type="text"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Buscar por dor, usuário, MVP, jurados, pagamentos..."
        className="w-full rounded-xl border border-brand-green/30 bg-brand-dark-green/70 px-5 py-3.5 text-sm text-brand-off-white placeholder:text-brand-off-white/32 focus:border-brand-emerald focus:outline-none"
      />

      <div className="flex flex-wrap gap-2">
        <Tag
          selected={featuredOnly}
          tone={featuredOnly ? "yellow" : "neutral"}
          onClick={() => onFeaturedOnlyChange(!featuredOnly)}
        >
          Só destaques
        </Tag>
        {categories.map((category) => (
          <Tag
            key={category}
            selected={selectedCategory === category}
            tone={selectedCategory === category ? "emerald" : "neutral"}
            onClick={() =>
              onCategoryChange(selectedCategory === category ? null : category)
            }
          >
            {category}
          </Tag>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {TRACKS.map((track) => (
          <Tag
            key={track}
            selected={selectedTrack === track}
            tone={selectedTrack === track ? "emerald" : "neutral"}
            onClick={() => onTrackChange(selectedTrack === track ? null : track)}
          >
            {EDITORIAL_TRACK_LABELS[track]}
          </Tag>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {BUILD_SCORES.map((score) => (
            <Tag
              key={score}
              selected={selectedBuildScore === score}
              tone={selectedBuildScore === score ? "emerald" : "neutral"}
              onClick={() =>
                onBuildScoreChange(selectedBuildScore === score ? null : score)
              }
            >
              {BUILD_SCORE_LABELS[score]}
            </Tag>
          ))}
        </div>

        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as CuratedIdeaSort)}
          className="rounded-full border border-brand-green/30 bg-brand-dark-green/70 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brand-off-white"
        >
          <option value="featured">Destaques primeiro</option>
          <option value="easiest">Mais fáceis primeiro</option>
          <option value="crypto-angle">Ângulo cripto mais forte</option>
          <option value="pain-point">Dor mais clara</option>
        </select>
      </div>
    </div>
  );
}
