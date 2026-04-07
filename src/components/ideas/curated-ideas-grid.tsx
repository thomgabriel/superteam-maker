"use client";

import { useState, useMemo } from "react";
import { Tag } from "@/components/ui/tag";
import { CuratedIdeaCard } from "./curated-idea-card";
import { CuratedIdeaModal } from "./curated-idea-modal";
import type { CuratedIdea } from "@/lib/curated-ideas";

export function CuratedIdeasGrid({ ideas }: { ideas: CuratedIdea[] }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<CuratedIdea | null>(null);

  const categories = useMemo(
    () => [...new Set(ideas.map((i) => i.category))],
    [ideas]
  );

  const filtered = useMemo(() => {
    let result = ideas;
    if (selectedCategory) {
      result = result.filter((i) => i.category === selectedCategory);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.details.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [ideas, query, selectedCategory]);

  function toggleCategory(cat: string) {
    setSelectedCategory(selectedCategory === cat ? null : cat);
  }

  return (
    <div>
      <p className="mb-6 max-w-2xl text-sm leading-7 text-brand-off-white/62">
        Pontos de partida para o time ganhar tração logo no começo. Adapte,
        simplifique ou misture ideias sem precisar começar do zero.
      </p>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar ideias..."
          className="w-full rounded-xl border border-brand-green/30 bg-brand-dark-green/70 px-5 py-3.5 text-sm text-brand-off-white placeholder:text-brand-off-white/32 focus:border-brand-emerald focus:outline-none"
        />
      </div>

      {/* Category chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Tag
            key={cat}
            selected={selectedCategory === cat}
            tone={selectedCategory === cat ? "emerald" : "neutral"}
            onClick={() => toggleCategory(cat)}
          >
            {cat}
          </Tag>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((idea) => (
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
            Nenhuma ideia encontrada.
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
