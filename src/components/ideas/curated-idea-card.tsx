import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import type { CuratedIdea } from "@/lib/curated-ideas";

interface CuratedIdeaCardProps {
  idea: CuratedIdea;
  onOpen: (idea: CuratedIdea) => void;
}

export function CuratedIdeaCard({ idea, onOpen }: CuratedIdeaCardProps) {
  return (
    <Card className="group flex flex-col rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(27,35,29,0.96),rgba(27,35,29,0.72))] p-6 transition-transform duration-200 hover:-translate-y-1">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-brand-emerald">
        {idea.category}
      </p>

      <h3 className="mt-4 font-heading text-2xl font-semibold leading-tight text-brand-off-white">
        {idea.title}
      </h3>

      <p className="mt-4 text-sm leading-7 text-brand-off-white/68">
        {idea.description}
      </p>

      <div className="mt-auto flex flex-col gap-4 pt-5">
        <div className="flex flex-wrap gap-2">
          {idea.tags.map((tag, i) => (
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
          Ver detalhes
        </button>
      </div>
    </Card>
  );
}
