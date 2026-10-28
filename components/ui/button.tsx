import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'media' | 'mediaActive' | 'mediaDanger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500',
  secondary:
    'bg-white text-slate-900 border border-slate-300 hover:bg-slate-100 focus-visible:ring-slate-400',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-300',
  media:
    'border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 focus-visible:ring-slate-300 focus-visible:ring-offset-slate-950',
  mediaActive:
    'border border-brand-500 bg-brand-700 text-white hover:bg-brand-600 focus-visible:ring-brand-300 focus-visible:ring-offset-slate-950',
  mediaDanger:
    'border border-rose-700 bg-rose-700 text-white hover:bg-rose-600 focus-visible:ring-rose-300 focus-visible:ring-offset-slate-950',
};

export function Button({
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
