'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

export type SearchableSelectOption = {
  value: string;
  label: string;
  keywords?: string[];
};

type SearchableSelectProps = Readonly<{
  value: string;
  onValueChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
  panelClassName?: string;
}>;

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Selecione',
  searchPlaceholder = 'Buscar...',
  noResultsText = 'Nenhum resultado encontrado.',
  name,
  disabled,
  className,
  panelClassName,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return options;
    }

    const terms = normalizeText(trimmed)
      .split(/\s+/)
      .filter(Boolean);

    return options.filter((option) => {
      const haystack = normalizeText(
        [option.label, option.value, ...(option.keywords ?? [])].join(' '),
      );
      return terms.every((term) => haystack.includes(term));
    });
  }, [options, query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    searchInputRef.current?.focus();
  }, [open]);

  const handleSelect = (nextValue: string) => {
    onValueChange(nextValue);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      {name ? <input type="hidden" name={name} value={value} /> : null}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-left text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 disabled:cursor-not-allowed disabled:opacity-60',
          'inline-flex items-center justify-between gap-2',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn('truncate', selectedOption ? '' : 'text-slate-400')}>
          {selectedOption?.label ?? placeholder}
        </span>
        <span className="text-slate-500" aria-hidden="true">
          v
        </span>
      </button>

      {open ? (
        <div
          className={cn(
            'absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-xl',
            panelClassName,
          )}
        >
          <input
            ref={searchInputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setOpen(false);
              }
            }}
            placeholder={searchPlaceholder}
            className="mb-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />

          <div className="max-h-64 space-y-1 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'w-full rounded-md px-3 py-2 text-left text-sm transition',
                      isSelected ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100',
                    )}
                  >
                    {option.label}
                  </button>
                );
              })
            ) : (
              <p className="px-2 py-3 text-sm text-slate-500">{noResultsText}</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}