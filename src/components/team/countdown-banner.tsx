"use client";

// Live-updating countdown banner (1s tick). Auto color tiers: >12h neutral,
// 2-12h yellow, <2h red. `variant` prop forces a color when semantic differs
// from raw time-left (e.g. yellow while team is understaffed).

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";

export type CountdownVariant = "neutral" | "yellow" | "red";

interface CountdownBannerProps {
  deadline: Date | string;
  label: string;
  /**
   * Optional lead-in copy shown above the timer. Portuguese.
   */
  description?: string;
  /**
   * Override auto-computed variant. When omitted, color is picked from
   * remaining time.
   */
  variant?: CountdownVariant;
  /**
   * Short text shown when the deadline has passed. Default: "Prazo encerrado".
   */
  expiredLabel?: string;
  /**
   * Optional icon element rendered at the left of the banner.
   */
  icon?: React.ReactNode;
  className?: string;
}

interface TimeParts {
  totalMs: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function computeTimeLeft(deadlineMs: number): TimeParts {
  const totalMs = deadlineMs - Date.now();
  if (totalMs <= 0) {
    return { totalMs: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const totalSeconds = Math.floor(totalMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { totalMs, hours, minutes, seconds, expired: false };
}

function formatTime(parts: TimeParts): string {
  // `expired` is rendered with `expiredLabel` upstream; this branch is defensive
  // for callers that bypass the variant logic.
  if (parts.expired) return "0min restantes";
  if (parts.hours >= 1) {
    return `${parts.hours}h ${parts.minutes.toString().padStart(2, "0")}min restantes`;
  }
  if (parts.minutes >= 1) {
    return `${parts.minutes}min restantes`;
  }
  return `${parts.seconds}s restantes`;
}

function autoVariant(parts: TimeParts): CountdownVariant {
  if (parts.expired) return "red";
  const hoursLeft = parts.totalMs / (1000 * 60 * 60);
  if (hoursLeft < 2) return "red";
  if (hoursLeft < 12) return "yellow";
  return "neutral";
}

const VARIANT_CLASSES: Record<CountdownVariant, { shell: string; label: string; timer: string }> = {
  neutral: {
    shell:
      "border-brand-emerald/30 bg-[linear-gradient(135deg,rgba(0,139,76,0.14),rgba(27,35,29,0.94))]",
    label: "text-brand-emerald",
    timer: "text-brand-off-white",
  },
  yellow: {
    shell:
      "border-brand-yellow/34 bg-[linear-gradient(135deg,rgba(255,210,63,0.14),rgba(27,35,29,0.94))]",
    label: "text-brand-yellow",
    timer: "text-brand-yellow",
  },
  red: {
    shell:
      "border-red-400/45 bg-[linear-gradient(135deg,rgba(239,68,68,0.18),rgba(27,35,29,0.94))]",
    label: "text-red-200",
    timer: "text-red-100",
  },
};

export function CountdownBanner({
  deadline,
  label,
  description,
  variant,
  expiredLabel = "Prazo encerrado",
  icon,
  className = "",
}: CountdownBannerProps) {
  const deadlineMs = useMemo(() => {
    const d = typeof deadline === "string" ? new Date(deadline) : deadline;
    return d.getTime();
  }, [deadline]);

  const [parts, setParts] = useState<TimeParts>(() => computeTimeLeft(deadlineMs));

  useEffect(() => {
    setParts(computeTimeLeft(deadlineMs));
    const interval = setInterval(() => {
      setParts(computeTimeLeft(deadlineMs));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadlineMs]);

  const resolvedVariant: CountdownVariant = variant ?? autoVariant(parts);
  const styles = VARIANT_CLASSES[resolvedVariant];

  return (
    <Card
      className={[
        "rounded-[1.5rem] px-5 py-4",
        styles.shell,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="timer"
      aria-atomic="true"
      // Deliberately aria-live="off": the timer text changes every 1s which
      // would spam screen readers. Users who need the countdown can inspect
      // the role="timer" element directly.
      aria-live="off"
    >
      <div className="flex items-start gap-3">
        {icon && <div className="mt-1 shrink-0">{icon}</div>}
        <div className="min-w-0">
          <p
            className={[
              "text-[11px] uppercase tracking-[0.2em]",
              styles.label,
            ].join(" ")}
          >
            {label}
          </p>
          <p className={["mt-2 font-heading text-2xl font-semibold", styles.timer].join(" ")}>
            {parts.expired ? expiredLabel : formatTime(parts)}
          </p>
          {description && (
            <p className="mt-2 text-sm leading-6 text-brand-off-white/68">
              {description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
