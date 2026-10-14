import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: 'default' | 'none';
};

export function Card({ className, padding = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-card',
        padding === 'default' && 'p-4 md:p-5',
        className,
      )}
      {...props}
    />
  );
}
