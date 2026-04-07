"use client";

import { useState, type ReactNode } from "react";

interface IdeasTabsProps {
  curatedContent: ReactNode;
  colosseumContent: ReactNode;
}

export function IdeasTabs({ curatedContent, colosseumContent }: IdeasTabsProps) {
  const [tab, setTab] = useState<"curated" | "colosseum">("curated");

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab("curated")}
          className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
            tab === "curated"
              ? "border-brand-emerald/35 bg-brand-emerald/16 text-brand-off-white"
              : "border-brand-green/25 bg-brand-dark-green/55 text-brand-off-white/62 hover:border-brand-green hover:text-brand-off-white"
          }`}
        >
          Novas Ideias
        </button>
        <button
          onClick={() => setTab("colosseum")}
          className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
            tab === "colosseum"
              ? "border-brand-emerald/35 bg-brand-emerald/16 text-brand-off-white"
              : "border-brand-green/25 bg-brand-dark-green/55 text-brand-off-white/62 hover:border-brand-green hover:text-brand-off-white"
          }`}
        >
          Acervo Colosseum
        </button>
      </div>

      {tab === "curated" ? curatedContent : colosseumContent}
    </div>
  );
}
