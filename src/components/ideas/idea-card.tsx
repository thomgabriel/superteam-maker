import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import type { CopilotProject } from "@/types/colosseum";

interface IdeaCardProps {
  project: CopilotProject;
  onOpen: (project: CopilotProject) => void;
}

export function IdeaCard({ project, onOpen }: IdeaCardProps) {
  const trackName = project.tracks[0]?.name ?? "General";
  const tags = project.tags;
  const primaryTags = tags
    ? [...new Set([trackName, ...tags.primitives.slice(0, 2)])]
    : [trackName];

  return (
    <Card className="group flex flex-col rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(27,35,29,0.96),rgba(27,35,29,0.72))] p-6 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-brand-off-white/42">
            {project.hackathon.name}
          </p>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-brand-emerald">
            {trackName}
          </p>
        </div>
        {project.prize && (
          <span className="rounded-full border border-brand-yellow/25 bg-brand-yellow/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-brand-yellow">
            {project.prize.type === "GRAND_PRIZE"
              ? "Grand Prize"
              : project.prize.type === "TRACK_PRIZE"
                ? "Track Prize"
                : "Winner"}
          </span>
        )}
      </div>

      <h3 className="mt-5 font-heading text-2xl font-semibold leading-tight text-brand-off-white">
        {project.name}
      </h3>

      {project.oneLiner && (
        <p className="mt-4 text-sm leading-7 text-brand-off-white/68">
          {project.oneLiner}
        </p>
      )}

      {tags && tags.problemTags.length > 0 && (
        <div className="mt-5 rounded-2xl border border-brand-green/22 bg-brand-green/8 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
            Problema
          </p>
          <p className="mt-2 text-sm leading-7 text-brand-off-white/86">
            {tags.problemTags.slice(0, 2).join(", ")}
          </p>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-4 pt-5">
        <div className="flex flex-wrap gap-2">
          {primaryTags.map((tag, i) => (
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

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="text-xs font-medium text-brand-emerald underline-offset-2 hover:text-brand-off-white hover:underline"
          >
            Ver detalhes
          </button>
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-brand-off-white/42 underline-offset-2 hover:text-brand-off-white/70 hover:underline"
            >
              GitHub
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-brand-off-white/42 underline-offset-2 hover:text-brand-off-white/70 hover:underline"
            >
              Demo
            </a>
          )}
          {project.links.colosseum && (
            <a
              href={project.links.colosseum}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-brand-off-white/42 underline-offset-2 hover:text-brand-off-white/70 hover:underline"
            >
              Colosseum
            </a>
          )}
          {project.team.count > 0 && (
            <span className="text-xs text-brand-off-white/32 sm:ml-auto">
              {project.team.count} builder{project.team.count !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
