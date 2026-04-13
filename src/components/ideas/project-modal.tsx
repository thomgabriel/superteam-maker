"use client";

import { useEffect } from "react";
import { Tag } from "@/components/ui/tag";
import { sanitizeExternalUrl } from "@/lib/security";
import type { CopilotProject } from "@/types/colosseum";

interface ProjectModalProps {
  project: CopilotProject;
  onClose: () => void;
}

function tagList(tags: string[] | undefined) {
  return tags?.filter(Boolean).slice(0, 6) ?? [];
}

function ProjectTagGroup({
  title,
  tags,
}: {
  title: string;
  tags: string[];
}) {
  if (tags.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Tag
            key={tag}
            selected={index === 0}
            tone={index === 0 ? "emerald" : "neutral"}
            className="cursor-default"
            disabled
          >
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  );
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const trackName = project.tracks[0]?.name ?? "Geral";
  const tags = project.tags;
  const links = [
    ["Colosseum", sanitizeExternalUrl(project.links.colosseum)],
    ["GitHub", sanitizeExternalUrl(project.links.github)],
    ["Demo", sanitizeExternalUrl(project.links.demo)],
    ["Apresentação", sanitizeExternalUrl(project.links.presentation)],
    ["Demo técnico", sanitizeExternalUrl(project.links.technicalDemo)],
  ].filter((link): link is [string, string] => Boolean(link[1]));

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleBackdropMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-brand-dark-green/82 px-0 pb-0 pt-10 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="h-[calc(100dvh-3rem)] w-full max-w-3xl overflow-y-auto rounded-t-[1.75rem] border border-b-0 border-brand-green/30 bg-brand-dark-green p-5 shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-[1.75rem] sm:border-b sm:p-8"
      >
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-brand-green/40 sm:hidden" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-brand-yellow/82">
              {project.hackathon.name} / {trackName}
            </p>
            <h2
              id="project-modal-title"
              className="mt-3 font-heading text-2xl font-bold leading-tight text-brand-off-white sm:text-4xl"
            >
              {project.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-brand-green/30 px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-brand-off-white/62 transition-colors hover:border-brand-green hover:text-brand-off-white"
          >
            Fechar
          </button>
        </div>

        {project.oneLiner && (
          <p className="mt-5 text-base leading-8 text-brand-off-white/72">
            {project.oneLiner}
          </p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {project.prize && (
            <div className="rounded-lg border border-brand-yellow/20 bg-brand-yellow/8 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-brand-yellow/82">
                Prêmio
              </p>
              <p className="mt-2 text-sm leading-6 text-brand-off-white/82">
                {project.prize.name ?? project.prize.type}
              </p>
            </div>
          )}
          <div className="rounded-lg border border-brand-green/22 bg-brand-green/8 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
              Time
            </p>
            <p className="mt-2 text-sm leading-6 text-brand-off-white/82">
              {project.team.count} membro{project.team.count !== 1 ? "s" : ""}
            </p>
          </div>
          {project.cluster && (
            <div className="rounded-lg border border-brand-green/22 bg-brand-green/8 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
                Categoria
              </p>
              <p className="mt-2 text-sm leading-6 text-brand-off-white/82">
                {project.cluster.label}
              </p>
            </div>
          )}
        </div>

        {project.evidence.length > 0 && (
          <div className="mt-6 rounded-[1.25rem] border border-brand-green/22 bg-brand-green/8 px-5 py-5">
            <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
              Por que este projeto aparece aqui
            </p>
            <div className="mt-3 grid gap-3">
              {project.evidence.slice(0, 2).map((evidence) => (
                <p
                  key={evidence}
                  className="text-sm leading-7 text-brand-off-white/76"
                >
                  {evidence}
                </p>
              ))}
            </div>
          </div>
        )}

        {tags && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <ProjectTagGroup
              title="Problemas"
              tags={tagList(tags.problemTags)}
            />
            <ProjectTagGroup
              title="Soluções"
              tags={tagList(tags.solutionTags)}
            />
            <ProjectTagGroup
              title="Primitivos"
              tags={tagList(tags.primitives)}
            />
            <ProjectTagGroup
              title="Tecnologias"
              tags={tagList(tags.techStack)}
            />
          </div>
        )}

        {links.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {links.map(([label, href], index) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={
                  index === 0
                    ? "inline-flex items-center justify-center rounded-lg bg-brand-emerald px-5 py-3 text-sm font-semibold text-brand-off-white transition-opacity hover:opacity-90"
                    : "inline-flex items-center justify-center rounded-lg border border-brand-green/30 px-5 py-3 text-sm font-medium text-brand-off-white/74 transition-colors hover:border-brand-green hover:text-brand-off-white"
                }
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
