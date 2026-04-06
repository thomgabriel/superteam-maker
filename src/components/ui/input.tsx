import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export const inputClassName =
  'rounded-lg border border-brand-green bg-brand-dark-green px-4 py-3 text-brand-off-white placeholder:text-brand-off-white/40 focus:border-brand-emerald focus:outline-none';

export function Input({
  fullWidth = true,
  className = '',
  ...props
}: InputProps) {
  return (
    <input
      className={[inputClassName, fullWidth ? 'w-full' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
