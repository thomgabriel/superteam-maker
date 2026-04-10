"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { FaqItem } from "@/lib/support-content";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <Card
          key={index}
          className="rounded-[1.25rem] border-brand-green/20 bg-brand-dark-green/45 transition-colors hover:border-brand-green/30"
        >
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="flex w-full items-start justify-between gap-4 p-5 text-left"
          >
            <span className="text-sm font-medium leading-7 text-brand-off-white">
              {item.question}
            </span>
            <span className="mt-1 shrink-0 text-xs text-brand-emerald">
              {openIndex === index ? "−" : "+"}
            </span>
          </button>
          {openIndex === index && (
            <div className="border-t border-brand-green/15 px-5 pb-5 pt-4">
              <p className="text-sm leading-7 text-brand-off-white/68">
                {item.answer}
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
