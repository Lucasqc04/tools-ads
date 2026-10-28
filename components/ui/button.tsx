import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'media' | 'mediaActive' | 'mediaDanger' | 'call' | 'callActive' | 'callDanger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  shape?: 'default' | 'circle' | 'icon';
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
  call:
    'border border-ink-700 bg-ink-800 text-white hover:bg-ink-700 focus-visible:ring-accent-400 focus-visible:ring-offset-ink-950',
  callActive:
    'border border-accent-400 bg-accent-500 text-ink-950 hover:bg-accent-400 focus-visible:ring-accent-300 focus-visible:ring-offset-ink-950',
  callDanger:
    'border border-rose-600 bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-300 focus-visible:ring-offset-ink-950',
};

export function Button({
  className,
  variant = 'primary',
  shape = 'default',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        `inline-flex h-10 items-center justify-center ${shape === 'circle' ? 'rounded-full px-0' : shape === 'icon' ? 'rounded-xl px-0' : 'rounded-lg px-4'} text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
