'use client';

import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/cn';

/** Padrão de seleção do projeto: brand para estado ativo, slate para o restante. */
const choiceBase = 'inline-flex min-h-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300';
const choiceOn = 'border-brand-300 bg-brand-50 text-brand-800';
const choiceOff = 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50';

export function SectionCard({ title, hint, children, className }: Readonly<{ title: string; hint?: string; children: ReactNode; className?: string }>) {
  return (
    <Card className={cn('space-y-4', className)}>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {hint ? <p className="text-sm leading-6 text-slate-600">{hint}</p> : null}
      </div>
      {children}
    </Card>
  );
}

export function Hint({ children, id }: Readonly<{ children: ReactNode; id?: string }>) {
  return <p id={id} className="text-xs leading-5 text-slate-600">{children}</p>;
}

export function Notice({ tone, children }: Readonly<{ tone: 'error' | 'info' | 'success'; children: ReactNode }>) {
  const styles = {
    error: 'border-rose-200 bg-rose-50 text-rose-800',
    info: 'border-brand-200 bg-brand-50 text-brand-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  } as const;

  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('rounded-lg border px-3 py-2 text-sm leading-6', styles[tone])}>
      {children}
    </div>
  );
}

type ChoiceOption<T extends string> = { value: T; label: string };

export function ChoiceGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  columns = 'grid-cols-2 sm:grid-cols-4',
}: Readonly<{
  legend: string;
  options: ChoiceOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  columns?: string;
}>) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-semibold text-slate-800">{legend}</legend>
      <div className={cn('grid gap-2', columns)}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(choiceBase, selected ? choiceOn : choiceOff)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function RangeField({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
  disabled = false,
}: Readonly<{
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  disabled?: boolean;
}>) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center justify-between gap-3 text-sm font-medium text-slate-800">
        {label}
        <span className="tabular-nums text-slate-600">{format ? format(value) : value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-brand-600 disabled:opacity-50"
      />
    </label>
  );
}

export function FieldLabel({ label, children }: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      {children}
    </label>
  );
}
