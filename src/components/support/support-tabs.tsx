"use client";

import { useState, type ReactNode } from "react";

interface Tab {
  key: string;
  label: string;
  content: ReactNode;
}

export function SupportTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.key ?? "");

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
              active === tab.key
                ? "border-brand-emerald/35 bg-brand-emerald/16 text-brand-off-white"
                : "border-brand-green/25 bg-brand-dark-green/55 text-brand-off-white/62 hover:border-brand-green hover:text-brand-off-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.find((t) => t.key === active)?.content}
    </div>
  );
}
