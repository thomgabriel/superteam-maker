"use client";

import { useEffect } from "react";
import { Tag } from "@/components/ui/tag";
import type { CuratedIdea } from "@/lib/curated-ideas";

interface CuratedIdeaModalProps {
  idea: CuratedIdea;
  onClose: () => void;
}

export function CuratedIdeaModal({ idea, onClose }: CuratedIdeaModalProps) {
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

  const sections = [
    { label: "Problema real", value: idea.painPoint },
    { label: "Usuário-alvo", value: idea.targetUser },
    { label: "Escopo do MVP", value: idea.mvpScope },
    { label: "Ângulo cripto", value: idea.cryptoAngle },
    { label: "Gancho para jurados", value: idea.judgeHook },
    { label: "Notas editoriais", value: idea.confidenceNote },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-brand-dark-green/82 px-0 pb-0 pt-10 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="curated-idea-modal-title"
        className="h-[calc(100dvh-3rem)] w-full max-w-3xl overflow-y-auto rounded-t-[1.75rem] border border-b-0 border-brand-green/30 bg-brand-dark-green p-5 shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-[1.75rem] sm:border-b sm:p-8"
      >
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-brand-green/40 sm:hidden" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-brand-emerald">
              {idea.category}
            </p>
            <h2
              id="curated-idea-modal-title"
              className="mt-3 font-heading text-2xl font-bold leading-tight text-brand-off-white sm:text-4xl"
            >
              {idea.title}
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

        <p className="mt-5 text-base leading-8 text-brand-off-white/72">
          {idea.description}
        </p>

        <div className="mt-6 grid gap-4">
          {sections.map((section) => (
            <div
              key={section.label}
              className="rounded-[1.25rem] border border-brand-green/22 bg-brand-green/8 px-5 py-5"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
                {section.label}
              </p>
              <p className="mt-3 text-sm leading-8 text-brand-off-white/76">
                {section.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
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
      </div>
    </div>
  );
}
