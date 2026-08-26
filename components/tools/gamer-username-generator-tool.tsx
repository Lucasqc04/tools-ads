'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy, RefreshCw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trackEvent, TOOL_ID } from '@/lib/analytics';
import { generateUsernameBatch, type UsernameStyle } from '@/lib/gamer-username-generator';
import type { AppLocale } from '@/lib/i18n/config';
import { cn } from '@/lib/cn';
import { nicknameSymbolPlatforms } from '@/lib/nickname-symbol-generator';

type GamerUsernameGeneratorToolProps = Readonly<{
  locale?: AppLocale;
  initialGameId?: string;
}>;

const FAVORITES_KEY = 'gamer-username-generator-favorites-v1';
const HISTORY_KEY = 'gamer-username-generator-history-v1';
const BATCH_SIZE = 6;
const MAX_HISTORY = 24;

type UiCopy = {
  gameLabel: string;
  anyGame: string;
  styleLabel: string;
  classic: string;
  leet: string;
  symbols: string;
  includeNumber: string;
  generate: string;
  copy: string;
  copied: string;
  favorites: string;
  favoritesEmpty: string;
  history: string;
  historyEmpty: string;
  privacy: string;
};

const uiByLocale: Record<AppLocale, UiCopy> = {
  'pt-br': {
    gameLabel: 'Jogo',
    anyGame: 'Genérico (qualquer jogo)',
    styleLabel: 'Estilo',
    classic: 'Clássico',
    leet: 'Leet speak',
    symbols: 'Com símbolos',
    includeNumber: 'Incluir número no final',
    generate: 'Gerar nomes',
    copy: 'Copiar',
    copied: 'Copiado!',
    favorites: 'Favoritos',
    favoritesEmpty: 'Clique na estrela de um nome para favoritá-lo.',
    history: 'Últimos gerados',
    historyEmpty: 'Os nomes gerados aparecem aqui.',
    privacy: '🔒 Tudo acontece localmente no seu navegador. Nada é enviado para um servidor.',
  },
  en: {
    gameLabel: 'Game',
    anyGame: 'Generic (any game)',
    styleLabel: 'Style',
    classic: 'Classic',
    leet: 'Leet speak',
    symbols: 'With symbols',
    includeNumber: 'Include a number at the end',
    generate: 'Generate names',
    copy: 'Copy',
    copied: 'Copied!',
    favorites: 'Favorites',
    favoritesEmpty: 'Click a name\'s star to favorite it.',
    history: 'Recently generated',
    historyEmpty: 'Generated names show up here.',
    privacy: '🔒 Everything runs locally in your browser. Nothing is sent to a server.',
  },
  es: {
    gameLabel: 'Juego',
    anyGame: 'Genérico (cualquier juego)',
    styleLabel: 'Estilo',
    classic: 'Clásico',
    leet: 'Leet speak',
    symbols: 'Con símbolos',
    includeNumber: 'Incluir un número al final',
    generate: 'Generar nombres',
    copy: 'Copiar',
    copied: '¡Copiado!',
    favorites: 'Favoritos',
    favoritesEmpty: 'Haz clic en la estrella de un nombre para marcarlo como favorito.',
    history: 'Generados recientemente',
    historyEmpty: 'Los nombres generados aparecen aquí.',
    privacy: '🔒 Todo ocurre localmente en tu navegador. Nada se envía a un servidor.',
  },
};

const styleOptions: Array<{ value: UsernameStyle; labelKey: keyof UiCopy }> = [
  { value: 'classic', labelKey: 'classic' },
  { value: 'leet', labelKey: 'leet' },
  { value: 'symbols', labelKey: 'symbols' },
];

export function GamerUsernameGeneratorTool({
  locale = 'pt-br',
  initialGameId,
}: GamerUsernameGeneratorToolProps) {
  const ui = uiByLocale[locale];

  const [gameId, setGameId] = useState(initialGameId ?? '');
  const [style, setStyle] = useState<UsernameStyle>('classic');
  const [includeNumber, setIncludeNumber] = useState(true);
  const [results, setResults] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }

      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch {
      // ignore malformed/unavailable storage
    }
  }, []);

  const markStarted = useCallback(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackEvent('tool_started', { tool: TOOL_ID.gamerUsernameGenerator, locale });
    }
  }, [locale]);

  const persistHistory = useCallback((names: string[]) => {
    setHistory((prev) => {
      const next = [...names, ...prev.filter((item) => !names.includes(item))].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const rollBatch = useCallback(() => {
    const batch = generateUsernameBatch(BATCH_SIZE, {
      gameId: gameId || undefined,
      style,
      includeNumber,
    });

    setResults(batch);
    persistHistory(batch);

    return batch;
  }, [gameId, includeNumber, persistHistory, style]);

  const handleGenerate = useCallback(() => {
    markStarted();
    rollBatch();

    trackEvent('generation_started', {
      tool: TOOL_ID.gamerUsernameGenerator,
      locale,
      style,
      game: gameId || 'generic',
    });

    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      trackEvent('tool_completed', { tool: TOOL_ID.gamerUsernameGenerator, locale });
    }
  }, [gameId, locale, markStarted, rollBatch, style]);

  useEffect(() => {
    // Seed an initial batch on mount without counting it as a tracked
    // user action (see markStarted/handleGenerate for the real trigger).
    rollBatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFavorite = useCallback((name: string) => {
    setFavorites((prev) => {
      const next = prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const copyName = useCallback(
    async (name: string) => {
      markStarted();

      try {
        await navigator.clipboard.writeText(name);
        setCopiedName(name);
        window.setTimeout(() => {
          setCopiedName((prev) => (prev === name ? null : prev));
        }, 1500);
        trackEvent('result_copied', { tool: TOOL_ID.gamerUsernameGenerator, locale });
      } catch {
        trackEvent('tool_error', {
          tool: TOOL_ID.gamerUsernameGenerator,
          locale,
          error_type: 'clipboard_write_failed',
        });
      }
    },
    [locale, markStarted],
  );

  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">{ui.gameLabel}</label>
            <select
              value={gameId}
              onChange={(event) => {
                markStarted();
                setGameId(event.target.value);
              }}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            >
              <option value="">{ui.anyGame}</option>
              {nicknameSymbolPlatforms.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">{ui.styleLabel}</label>
            <div className="flex overflow-hidden rounded-lg border border-slate-300">
              {styleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={style === option.value}
                  onClick={() => {
                    markStarted();
                    setStyle(option.value);
                  }}
                  className={cn(
                    'flex-1 px-2 py-2.5 text-xs font-semibold transition',
                    style === option.value
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100',
                  )}
                >
                  {ui[option.labelKey]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={includeNumber}
            onChange={(event) => setIncludeNumber(event.target.checked)}
          />
          {ui.includeNumber}
        </label>

        <Button variant="primary" onClick={handleGenerate}>
          <RefreshCw className="mr-1.5 h-4 w-4" /> {ui.generate}
        </Button>
      </Card>

      {results.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {results.map((name, index) => (
            <UsernameRow
              key={`${name}-${index}`}
              name={name}
              isFavorite={favorites.includes(name)}
              isCopied={copiedName === name}
              copyLabel={ui.copy}
              copiedLabel={ui.copied}
              onCopy={() => void copyName(name)}
              onToggleFavorite={() => toggleFavorite(name)}
            />
          ))}
        </div>
      ) : null}

      {favorites.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-700">{ui.favorites}</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {favorites.map((name) => (
              <UsernameRow
                key={name}
                name={name}
                isFavorite
                isCopied={copiedName === name}
                copyLabel={ui.copy}
                copiedLabel={ui.copied}
                onCopy={() => void copyName(name)}
                onToggleFavorite={() => toggleFavorite(name)}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400">{ui.favoritesEmpty}</p>
      )}

      {history.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-700">{ui.history}</h3>
          <div className="flex flex-wrap gap-2">
            {history.slice(0, 16).map((name, index) => (
              <button
                key={`${name}-${index}`}
                type="button"
                onClick={() => void copyName(name)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-xs text-slate-700 transition hover:border-brand-300 hover:bg-brand-50"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <p className="text-xs text-slate-400">{ui.privacy}</p>
    </div>
  );
}

type UsernameRowProps = Readonly<{
  name: string;
  isFavorite: boolean;
  isCopied: boolean;
  copyLabel: string;
  copiedLabel: string;
  onCopy: () => void;
  onToggleFavorite: () => void;
}>;

function UsernameRow({
  name,
  isFavorite,
  isCopied,
  copyLabel,
  copiedLabel,
  onCopy,
  onToggleFavorite,
}: UsernameRowProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
      <span className="truncate font-mono text-sm text-slate-800">{name}</span>
      <span className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-full border transition',
            isFavorite ? 'border-amber-400 text-amber-500' : 'border-slate-200 text-slate-300 hover:text-amber-400',
          )}
        >
          <Star className="h-3.5 w-3.5" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <Button variant="secondary" className="h-7 px-2 text-xs" onClick={onCopy}>
          {isCopied ? (
            <>
              <Check className="mr-1 h-3 w-3" /> {copiedLabel}
            </>
          ) : (
            <>
              <Copy className="mr-1 h-3 w-3" /> {copyLabel}
            </>
          )}
        </Button>
      </span>
    </div>
  );
}
