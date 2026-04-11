import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import {
  BUILD_SCORE_LABELS,
  EDITORIAL_TRACK_LABELS,
  type CuratedIdea,
} from "@/lib/curated-ideas";

interface CuratedIdeaCardProps {
  idea: CuratedIdea;
  onOpen: (idea: CuratedIdea) => void;
}

export function CuratedIdeaCard({ idea, onOpen }: CuratedIdeaCardProps) {
  const visibleTracks = idea.editorialTracks.slice(0, 2);

  return (
    <Card className="group flex h-full flex-col rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(27,35,29,0.96),rgba(27,35,29,0.72))] p-6 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-brand-emerald">
            {idea.category}
          </p>

          <h3 className="mt-4 font-heading text-2xl font-semibold leading-tight text-brand-off-white">
            {idea.title}
          </h3>
        </div>

        {idea.featured ? (
          <span className="rounded-full border border-brand-yellow/25 bg-brand-yellow/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-brand-yellow">
            Destaque
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-sm leading-7 text-brand-off-white/68">
        {idea.description}
      </p>

      <div className="mt-5 rounded-2xl border border-brand-green/22 bg-brand-green/8 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
          Usuário-alvo
        </p>
        <p className="mt-2 text-sm leading-7 text-brand-off-white/86">
          {idea.targetUser}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Tag selected tone="emerald" className="cursor-default" disabled>
          {BUILD_SCORE_LABELS[idea.buildScore]}
        </Tag>
        {visibleTracks.map((track) => (
          <Tag key={track} className="cursor-default" disabled>
            {EDITORIAL_TRACK_LABELS[track]}
          </Tag>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-4 pt-5">
        <div className="flex flex-wrap gap-2">
          {idea.tags.slice(0, 3).map((tag, i) => (
            <Tag
              key={tag}
              selected={i === 0}
              tone={i === 0 ? "emerald" : "neutral"}
              className="cursor-default"
              disabled
            >
              {tag}
            </Tag>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onOpen(idea)}
          className="text-left text-xs font-medium text-brand-emerald underline-offset-2 hover:text-brand-off-white hover:underline"
        >
          Ver briefing completo
        </button>
      </div>
    </Card>
  );
}
