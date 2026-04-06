import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'light' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand-emerald text-brand-off-white hover:opacity-90',
  secondary: 'bg-brand-yellow text-brand-dark-green hover:opacity-90',
  light: 'bg-brand-off-white text-brand-dark-green hover:opacity-90',
  accent: 'bg-brand-green/10 text-brand-off-white border border-brand-green/30 hover:border-brand-green',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm font-medium',
  md: 'px-4 py-3 text-sm font-medium',
  lg: 'px-6 py-4 text-lg font-semibold',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'rounded-lg transition-opacity disabled:opacity-50',
        variant === 'primary' || variant === 'secondary' ? 'font-heading' : 'font-body',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? 'w-full' : '',
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
