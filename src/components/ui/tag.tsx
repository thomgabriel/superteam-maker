import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface TagProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  tone?: 'emerald' | 'yellow' | 'neutral';
  children: ReactNode;
}

const TONE_CLASSES = {
  emerald: 'border-brand-emerald bg-brand-emerald/20 text-brand-emerald',
  yellow: 'border-brand-yellow bg-brand-yellow/20 text-brand-yellow',
  neutral: 'border-brand-green/40 text-brand-off-white/60 hover:border-brand-green',
};

export function Tag({
  selected = false,
  tone = 'neutral',
  className = '',
  children,
  ...props
}: TagProps) {
  return (
    <button
      type="button"
      className={[
        'rounded-full border px-3 py-1.5 text-xs transition-colors',
        selected ? TONE_CLASSES[tone] : TONE_CLASSES.neutral,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
