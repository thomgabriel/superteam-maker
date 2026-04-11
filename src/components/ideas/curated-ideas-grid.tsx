"use client";

import { useMemo, useState } from "react";
import {
  filterCuratedIdeas,
  sortCuratedIdeas,
  type CuratedIdea,
  type CuratedIdeaBuildScore,
  type CuratedIdeaCategory,
  type CuratedIdeaEditorialTrack,
  type CuratedIdeaSort,
} from "@/lib/curated-ideas";
import { CuratedIdeaCard } from "./curated-idea-card";
import { CuratedIdeaModal } from "./curated-idea-modal";
import { CuratedIdeasToolbar } from "./curated-ideas-toolbar";

export function CuratedIdeasGrid({ ideas }: { ideas: CuratedIdea[] }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CuratedIdeaCategory | null>(null);
  const [selectedTrack, setSelectedTrack] =
    useState<CuratedIdeaEditorialTrack | null>(null);
  const [selectedBuildScore, setSelectedBuildScore] =
    useState<CuratedIdeaBuildScore | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<CuratedIdeaSort>("featured");
  const [selectedIdea, setSelectedIdea] = useState<CuratedIdea | null>(null);

  const categories = useMemo(
    () => [...new Set(ideas.map((idea) => idea.category))] as CuratedIdeaCategory[],
    [ideas]
  );

  const visibleIdeas = useMemo(() => {
    const filtered = filterCuratedIdeas(ideas, {
      query,
      category: selectedCategory,
      editorialTrack: selectedTrack,
      buildScore: selectedBuildScore,
      featuredOnly,
    });

    return sortCuratedIdeas(filtered, sort);
  }, [
    ideas,
    query,
    selectedCategory,
    selectedTrack,
    selectedBuildScore,
    featuredOnly,
    sort,
  ]);

  return (
    <div>
      <p className="mb-6 max-w-3xl text-sm leading-7 text-brand-off-white/62">
        Estas 200 ideias já passaram por um filtro editorial para times que
        querem dor real, MVP possível e um ângulo cripto que os jurados
        entendam rápido. Use os filtros para achar apostas mais fáceis de
        construir, melhores para creators ou mais fortes na demo.
      </p>

      <CuratedIdeasToolbar
        categories={categories}
        selectedCategory={selectedCategory}
        selectedTrack={selectedTrack}
        selectedBuildScore={selectedBuildScore}
        featuredOnly={featuredOnly}
        sort={sort}
        query={query}
        onCategoryChange={setSelectedCategory}
        onTrackChange={setSelectedTrack}
        onBuildScoreChange={setSelectedBuildScore}
        onFeaturedOnlyChange={setFeaturedOnly}
        onSortChange={setSort}
        onQueryChange={setQuery}
      />

      {visibleIdeas.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleIdeas.map((idea) => (
            <CuratedIdeaCard
              key={idea.id}
              idea={idea}
              onOpen={setSelectedIdea}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-brand-green/20 bg-brand-green/8 px-8 py-12 text-center">
          <p className="text-sm text-brand-off-white/52">
            Nenhuma ideia encontrada com esses filtros.
          </p>
        </div>
      )}

      {selectedIdea && (
        <CuratedIdeaModal
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
        />
      )}
    </div>
  );
}
