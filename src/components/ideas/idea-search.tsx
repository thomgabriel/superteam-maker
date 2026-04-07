"use client";

import { useState, useCallback, useRef } from "react";
import { Tag } from "@/components/ui/tag";
import { IdeaCard } from "./idea-card";
import { ProjectModal } from "./project-modal";
import type {
  CopilotProject,
  CopilotFacetBucket,
} from "@/types/colosseum";

interface IdeaSearchProps {
  initialProjects: CopilotProject[];
  initialTotal: number;
  hackathonFacets: CopilotFacetBucket[];
  clusterFacets: CopilotFacetBucket[];
}

export function IdeaSearch({
  initialProjects,
  initialTotal,
  hackathonFacets,
  clusterFacets,
}: IdeaSearchProps) {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState(initialProjects);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);
  const [winnersOnly, setWinnersOnly] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState<string | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<CopilotProject | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const doSearch = useCallback(
    async (
      searchQuery: string,
      hackathon: string | null,
      cluster: string | null,
      winners: boolean
    ) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(false);
      setSelectedProject(null);
      try {
        const body: Record<string, unknown> = {
          limit: 12,
          includeFacets: false,
        };
        if (searchQuery.trim()) body.query = searchQuery.trim();
        if (hackathon) body.hackathons = [hackathon];

        const filters: Record<string, unknown> = {};
        if (cluster) filters.clusterKeys = [cluster];
        if (winners) filters.winnersOnly = true;
        if (Object.keys(filters).length > 0) body.filters = filters;

        const res = await fetch("/api/copilot/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!res.ok) {
          setError(true);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data.results)) {
          setProjects(data.results);
          setTotal(data.totalFound ?? 0);
          setSearched(true);
        } else {
          setError(true);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    []
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    doSearch(query, selectedHackathon, selectedCluster, winnersOnly);
  }

  function toggleHackathon(key: string) {
    const next = selectedHackathon === key ? null : key;
    setSelectedHackathon(next);
    doSearch(query, next, selectedCluster, winnersOnly);
  }

  function toggleCluster(key: string) {
    const next = selectedCluster === key ? null : key;
    setSelectedCluster(next);
    doSearch(query, selectedHackathon, next, winnersOnly);
  }

  function toggleWinners() {
    const next = !winnersOnly;
    setWinnersOnly(next);
    doSearch(query, selectedHackathon, selectedCluster, next);
  }

  function handleReset() {
    abortRef.current?.abort();
    setQuery("");
    setSelectedHackathon(null);
    setSelectedCluster(null);
    setWinnersOnly(false);
    setError(false);
    setSelectedProject(null);
    setProjects(initialProjects);
    setTotal(initialTotal);
    setSearched(false);
  }

  return (
    <div>
      {/* Search bar */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar projetos... ex: payments, DePIN, gaming"
            className="flex-1 rounded-xl border border-brand-green/30 bg-brand-dark-green/70 px-5 py-3.5 text-sm text-brand-off-white placeholder:text-brand-off-white/32 focus:border-brand-emerald focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-brand-emerald px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </form>

      {/* Winners toggle + hackathon chips */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          onClick={toggleWinners}
          className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors ${
            winnersOnly
              ? "border-brand-yellow/40 bg-brand-yellow/15 text-brand-yellow"
              : "border-brand-green/30 text-brand-off-white/52 hover:border-brand-green/50"
          }`}
        >
          Apenas vencedores
        </button>

        <span className="h-4 w-px bg-brand-green/20" />

        {hackathonFacets.map((h) => (
          <Tag
            key={h.key}
            selected={selectedHackathon === h.key}
            tone={selectedHackathon === h.key ? "emerald" : "neutral"}
            onClick={() => toggleHackathon(h.key)}
          >
            {h.label}
          </Tag>
        ))}
      </div>

      {/* Cluster chips (top 8) */}
      {clusterFacets.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
            Categoria
          </p>
          <div className="flex flex-wrap gap-2">
            {clusterFacets.slice(0, 8).map((c) => (
              <Tag
                key={c.key}
                selected={selectedCluster === c.key}
                tone={selectedCluster === c.key ? "yellow" : "neutral"}
                onClick={() => toggleCluster(c.key)}
              >
                {c.label.replace("Solana ", "")}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {/* Results header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-brand-off-white/52">
          {error
            ? "Nao foi possivel carregar projetos agora."
            : searched
              ? `${total} projeto${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`
              : `${total} projetos no acervo`}
        </p>
        {searched && (
          <button
            onClick={handleReset}
            className="text-xs text-brand-emerald hover:underline"
          >
            Limpar busca
          </button>
        )}
      </div>

      {/* Results grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-[1.75rem] bg-brand-green/8"
            />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <IdeaCard
              key={project.slug}
              project={project}
              onOpen={setSelectedProject}
            />
          ))}
        </div>
      ) : !error ? (
        <div className="rounded-2xl border border-brand-green/20 bg-brand-green/8 px-8 py-12 text-center">
          <p className="text-sm text-brand-off-white/52">
            Nenhum projeto encontrado. Tente outra busca.
          </p>
        </div>
      ) : null}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
