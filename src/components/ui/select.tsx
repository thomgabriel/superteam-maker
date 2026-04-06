import type { ReactNode, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  fullWidth?: boolean;
  children: ReactNode;
}

export const selectClassName =
  'rounded-lg border border-brand-green bg-brand-dark-green px-4 py-3 text-brand-off-white focus:border-brand-emerald focus:outline-none';

export function Select({
  fullWidth = true,
  className = '',
  children,
  ...props
}: SelectProps) {
  return (
    <select
      className={[selectClassName, fullWidth ? 'w-full' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </select>
  );
}
