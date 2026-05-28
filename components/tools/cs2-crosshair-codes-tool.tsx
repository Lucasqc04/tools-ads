'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cs2CrosshairPlayers, type Cs2PlayerRole } from '@/data/cs2/crosshair-players';
import { getCs2CrosshairCodesContent } from '@/data/content/cs2-crosshair-codes';
import type { AppLocale } from '@/lib/i18n/config';
import {
  filterCs2Players,
  getCountryOptions,
  getRoleOptions,
  getTeamOptions,
  type Cs2CrosshairFilters,
} from '@/lib/cs2/crosshair';

const localeTagByAppLocale: Record<AppLocale, string> = {
  'pt-br': 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

type Cs2CrosshairCodesToolProps = {
  locale?: AppLocale;
};

const defaultFilters: Cs2CrosshairFilters = {
  query: '',
  country: '',
  team: '',
  role: '',
  withCodeOnly: false,
};

export function Cs2CrosshairCodesTool({ locale = 'pt-br' }: Cs2CrosshairCodesToolProps) {
  const [filters, setFilters] = useState<Cs2CrosshairFilters>(defaultFilters);
  const [copiedSlug, setCopiedSlug] = useState<string>('');

  const content = getCs2CrosshairCodesContent(locale);

  const countries = useMemo(() => getCountryOptions(cs2CrosshairPlayers), []);
  const teams = useMemo(() => getTeamOptions(cs2CrosshairPlayers), []);
  const roles = useMemo(() => getRoleOptions(cs2CrosshairPlayers), []);

  const filteredPlayers = useMemo(
    () => filterCs2Players(cs2CrosshairPlayers, filters),
    [filters],
  );

  const handleCopy = async (slug: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedSlug(slug);
      window.setTimeout(() => {
        setCopiedSlug((current) => (current === slug ? '' : current));
      }, 1600);
    } catch {
      setCopiedSlug('');
    }
  };

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(localeTagByAppLocale[locale], {
        dateStyle: 'medium',
      }),
    [locale],
  );

  return (
    <Card className="space-y-6">
      <section className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h3 className="text-base font-semibold text-amber-900">{content.ui.cautionTitle}</h3>
        <p className="text-sm leading-6 text-amber-900">{content.ui.cautionText}</p>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="space-y-2 xl:col-span-2">
          <span className="text-sm font-semibold text-slate-800">{content.ui.searchLabel}</span>
          <Input
            value={filters.query}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                query: event.target.value,
              }))
            }
            placeholder={content.ui.searchPlaceholder}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{content.ui.countryLabel}</span>
          <Select
            value={filters.country}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                country: event.target.value,
              }))
            }
          >
            <option value="">{content.ui.countryAll}</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{content.ui.teamLabel}</span>
          <Select
            value={filters.team}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                team: event.target.value,
              }))
            }
          >
            <option value="">{content.ui.teamAll}</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{content.ui.roleLabel}</span>
          <Select
            value={filters.role}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                role: event.target.value as '' | Cs2PlayerRole,
              }))
            }
          >
            <option value="">{content.ui.roleAll}</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
        </label>
      </section>

      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={filters.withCodeOnly}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              withCodeOnly: event.target.checked,
            }))
          }
        />
        <span>{content.ui.withCodeOnly}</span>
      </label>

      <p className="text-sm text-slate-600">
        <strong className="text-slate-900">{filteredPlayers.length}</strong> {content.ui.resultCount}
      </p>

      <section className="space-y-4" aria-live="polite">
        {filteredPlayers.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {content.ui.emptyState}
          </p>
        ) : null}

        {filteredPlayers.map((player) => {
          const hasCode = Boolean(player.crosshairCode);
          const confidenceCopy = content.ui.confidenceValues[player.confidence];

          return (
            <article
              key={player.id}
              className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
            >
              <header className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-lg font-semibold text-slate-900">{player.displayName}</h4>
                <div className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700">
                  {content.ui.confidenceLabel}: {confidenceCopy}
                </div>
              </header>

              <div className="flex flex-wrap gap-2 text-xs">
                {player.team ? (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{player.team}</span>
                ) : null}
                {player.country ? (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{player.country}</span>
                ) : null}
                {player.role ? (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{player.role}</span>
                ) : null}
              </div>

              {hasCode ? (
                <div className="space-y-2 rounded-xl border border-brand-200 bg-brand-50 p-3">
                  <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg border border-brand-100 bg-white p-3 font-mono text-xs text-slate-900">
                    {player.crosshairCode}
                  </pre>
                  <Button
                    variant="secondary"
                    onClick={() => handleCopy(player.slug, player.crosshairCode ?? '')}
                  >
                    {copiedSlug === player.slug ? content.ui.copiedCode : content.ui.copyCode}
                  </Button>
                </div>
              ) : (
                <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {content.ui.noCode}
                </p>
              )}

              <section className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <h5 className="font-semibold text-slate-900">{content.ui.importTitle}</h5>
                <ol className="list-decimal space-y-1 pl-5">
                  {content.ui.importSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </section>

              <footer className="space-y-1 text-xs text-slate-600">
                <p>
                  {content.ui.updatedLabel}: {dateFormatter.format(new Date(player.lastCheckedAt))}
                </p>
                {player.sourceName ? (
                  <p>
                    {content.ui.sourceLabel}: {player.sourceName}
                  </p>
                ) : null}
                {player.warnings?.[0] ? <p>{player.warnings[0]}</p> : null}
              </footer>
            </article>
          );
        })}
      </section>
    </Card>
  );
}
