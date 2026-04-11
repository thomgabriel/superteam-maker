import type { CuratedIdea } from "@/lib/curated-ideas";

interface CuratedFeaturedIdeasProps {
  ideas: CuratedIdea[];
  onOpen: (idea: CuratedIdea) => void;
}

export function CuratedFeaturedIdeas({
  ideas,
  onOpen,
}: CuratedFeaturedIdeasProps) {
  if (ideas.length === 0) return null;

  return (
    <section className="mb-8 rounded-[1.75rem] border border-brand-yellow/20 bg-[linear-gradient(135deg,rgba(255,210,63,0.08),rgba(27,35,29,0.94)_42%,rgba(0,139,76,0.06))] p-6 sm:p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-brand-yellow/72">
        Melhores apostas agora
      </p>
      <p className="mt-3 max-w-2xl text-base leading-8 text-brand-off-white/70">
        Ideias com dor real, escopo enxuto e um ângulo cripto fácil de mostrar
        na demo.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ideas.map((idea) => (
          <button
            key={idea.id}
            type="button"
            onClick={() => onOpen(idea)}
            className="rounded-[1.25rem] border border-brand-green/22 bg-brand-dark-green/60 px-5 py-5 text-left transition-colors hover:border-brand-emerald/45"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-brand-yellow">
              {idea.category}
            </p>
            <h3 className="mt-3 font-heading text-xl font-semibold text-brand-off-white">
              {idea.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-brand-off-white/68">
              {idea.judgeHook}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
