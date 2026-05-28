'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { gtaCheats, type GtaCheatCategory, type GtaCheatEntry, type GtaGameId } from '@/data/gta/gta-cheats';
import { getGtaCheatsContent } from '@/data/content/gta-cheat-codes';
import {
  filterGtaCheats,
  getGtaCategories,
  getGtaGames,
  type GtaPlatformFilter,
} from '@/lib/gta/cheats';
import type { AppLocale } from '@/lib/i18n/config';

type GtaCheatCodesToolProps = {
  locale?: AppLocale;
  initialGame?: GtaGameId;
  initialCategory?: GtaCheatCategory;
};

type CodeField = {
  label: string;
  value: string;
};

const categoryOrder: GtaCheatCategory[] = [
  'vida-armadura',
  'armas',
  'policia',
  'spawn-veiculos',
  'veiculos',
  'clima',
  'mundo',
  'movimento',
  'combate',
  'dinheiro',
  'npc',
  'skins',
  'tema',
  'habilidade',
  'equipamento',
  'player',
  'musica',
  'episodes',
];

const platformOrder: GtaPlatformFilter[] = [
  'all',
  'pc',
  'phone',
  'playstation',
  'xbox',
  'switch',
];

const getLocalizedName = (entry: GtaCheatEntry, locale: AppLocale) =>
  locale === 'pt-br' ? entry.names['pt-br'] : locale === 'es' ? entry.names.es : entry.names.en;

const buildCodeFields = (entry: GtaCheatEntry): CodeField[] => {
  const fields: CodeField[] = [];

  if (entry.codes.pc) {
    fields.push({ label: 'PC', value: entry.codes.pc });
  }

  if (entry.codes.pcPhrase) {
    fields.push({ label: 'PC Phrase', value: entry.codes.pcPhrase });
  }

  if (entry.codes.pcCode) {
    fields.push({ label: 'PC Code', value: entry.codes.pcCode });
  }

  if (entry.codes.phone) {
    fields.push({ label: 'Phone', value: entry.codes.phone });
  }

  if (entry.codes.playstation) {
    fields.push({ label: 'PlayStation', value: entry.codes.playstation });
  }

  if (entry.codes.xbox) {
    fields.push({ label: 'Xbox', value: entry.codes.xbox });
  }

  if (entry.codes.switch) {
    fields.push({ label: 'Switch', value: entry.codes.switch });
  }

  return fields;
};

export function GtaCheatCodesTool({
  locale = 'pt-br',
  initialGame,
  initialCategory,
}: GtaCheatCodesToolProps) {
  const content = getGtaCheatsContent(locale);

  const [game, setGame] = useState<GtaGameId | 'all'>(initialGame ?? 'all');
  const [category, setCategory] = useState<GtaCheatCategory | 'all'>(initialCategory ?? 'all');
  const [platform, setPlatform] = useState<GtaPlatformFilter>('all');
  const [query, setQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  const games = useMemo(() => getGtaGames(), []);
  const categories = useMemo(() => {
    const found = new Set(getGtaCategories());
    return categoryOrder.filter((value) => found.has(value));
  }, []);

  const filtered = useMemo(
    () =>
      filterGtaCheats(gtaCheats, {
        game,
        category,
        platform,
        query,
      }),
    [game, category, platform, query],
  );

  const copyValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? '' : current));
      }, 1400);
    } catch {
      setCopiedKey('');
    }
  };

  return (
    <Card className="space-y-6">
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
        <h3 className="text-base font-semibold">{content.ui.warningTitle}</h3>
        <p className="mt-1 text-sm leading-6">{content.ui.warningBody}</p>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2 xl:col-span-2">
          <span className="text-sm font-semibold text-slate-800">{content.ui.searchLabel}</span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={content.ui.searchPlaceholder}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{content.ui.gameLabel}</span>
          <Select value={game} onChange={(event) => setGame(event.target.value as GtaGameId | 'all')}>
            <option value="all">{content.ui.gameAll}</option>
            {games.map((item) => (
              <option key={item} value={item}>
                {content.ui.gameValues[item]}
              </option>
            ))}
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{content.ui.categoryLabel}</span>
          <Select
            value={category}
            onChange={(event) => setCategory(event.target.value as GtaCheatCategory | 'all')}
          >
            <option value="all">{content.ui.categoryAll}</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {content.ui.categoryValues[item]}
              </option>
            ))}
          </Select>
        </label>

        <label className="space-y-2 xl:col-span-4 md:max-w-xs">
          <span className="text-sm font-semibold text-slate-800">{content.ui.platformLabel}</span>
          <Select
            value={platform}
            onChange={(event) => setPlatform(event.target.value as GtaPlatformFilter)}
          >
            {platformOrder.map((item) => (
              <option key={item} value={item}>
                {content.ui.platformValues[item]}
              </option>
            ))}
          </Select>
        </label>
      </section>

      <p className="text-sm text-slate-700">
        <strong className="text-slate-900">{filtered.length}</strong> {content.ui.resultCount}
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {content.ui.noResults}
        </p>
      ) : null}

      <div className="space-y-4 md:hidden" aria-live="polite">
        {filtered.map((entry) => {
          const codes = buildCodeFields(entry);

          return (
            <article key={entry.id} className="rounded-xl border border-slate-200 p-4">
              <h4 className="text-base font-semibold text-slate-900">{getLocalizedName(entry, locale)}</h4>
              <p className="mt-1 text-xs text-slate-600">
                {content.ui.gameValues[entry.game]} • {content.ui.categoryValues[entry.category]}
              </p>

              <div className="mt-3 space-y-2">
                {codes.map((code, index) => {
                  const copyKey = `${entry.id}-${index}`;
                  return (
                    <div key={copyKey} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                        {code.label}
                      </p>
                      <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all rounded bg-white p-2 font-mono text-xs text-slate-900">
                        {code.value}
                      </pre>
                      <Button
                        variant="secondary"
                        className="mt-2 w-full"
                        onClick={() => copyValue(copyKey, code.value)}
                      >
                        {copiedKey === copyKey ? content.ui.copiedButton : content.ui.copyButton}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {entry.note ? (
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
                  <strong>{content.ui.noteLabel}:</strong> {entry.note}
                </p>
              ) : null}

              {entry.needsValidation ? (
                <p className="mt-2 text-xs font-semibold text-rose-700">{content.ui.needsValidationLabel}</p>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full bg-white text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Cheat</th>
                <th className="px-4 py-3">Jogo</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Codigos</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const codes = buildCodeFields(entry);

                return (
                  <tr key={entry.id} className="border-t border-slate-200 align-top">
                    <td className="px-4 py-3 font-semibold text-slate-900">{getLocalizedName(entry, locale)}</td>
                    <td className="px-4 py-3 text-slate-700">{content.ui.gameValues[entry.game]}</td>
                    <td className="px-4 py-3 text-slate-700">{content.ui.categoryValues[entry.category]}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        {codes.map((code, index) => {
                          const copyKey = `${entry.id}-${index}`;

                          return (
                            <div key={copyKey} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                                {code.label}
                              </p>
                              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all rounded bg-white p-2 font-mono text-xs text-slate-900">
                                {code.value}
                              </pre>
                              <Button
                                variant="secondary"
                                className="mt-2"
                                onClick={() => copyValue(copyKey, code.value)}
                              >
                                {copiedKey === copyKey ? content.ui.copiedButton : content.ui.copyButton}
                              </Button>
                            </div>
                          );
                        })}

                        {entry.note ? (
                          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
                            <strong>{content.ui.noteLabel}:</strong> {entry.note}
                          </p>
                        ) : null}

                        {entry.needsValidation ? (
                          <p className="text-xs font-semibold text-rose-700">{content.ui.needsValidationLabel}</p>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
