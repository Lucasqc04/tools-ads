'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trackEvent, TOOL_ID } from '@/lib/analytics';
import type { AppLocale } from '@/lib/i18n/config';
import { cn } from '@/lib/cn';
import {
  formatSymbol,
  formatSymbolSequence,
  getSymbolCategoryById,
  pushRecentSymbol,
  searchSymbolCategories,
  symbolCategories,
  type CopyFormat,
} from '@/lib/symbols-to-copy';

type SymbolsToCopyToolProps = Readonly<{
  locale?: AppLocale;
  initialCategoryId?: string;
}>;

const FAVORITES_KEY = 'symbols-to-copy-favorites-v1';
const RECENT_KEY = 'symbols-to-copy-recent-v1';

type UiCopy = {
  searchPlaceholder: string;
  format: string;
  formatRaw: string;
  formatHtml: string;
  formatCodepoint: string;
  sequenceMode: string;
  sequenceModeOn: string;
  sequenceModeOff: string;
  sequencePlaceholder: string;
  copySequence: string;
  clearSequence: string;
  copied: string;
  favorites: string;
  favoritesEmpty: string;
  recent: string;
  recentEmpty: string;
  noResults: string;
  privacy: string;
};

const uiByLocale: Record<AppLocale, UiCopy> = {
  'pt-br': {
    searchPlaceholder: 'Buscar categoria (ex: seta, coração, matemática)',
    format: 'Formato ao copiar',
    formatRaw: 'Texto',
    formatHtml: 'HTML',
    formatCodepoint: 'Codepoint',
    sequenceMode: 'Montar sequência',
    sequenceModeOn: 'Ativado',
    sequenceModeOff: 'Desativado',
    sequencePlaceholder: 'Clique nos símbolos para montar sua sequência aqui',
    copySequence: 'Copiar sequência',
    clearSequence: 'Limpar',
    copied: 'Copiado!',
    favorites: 'Favoritos',
    favoritesEmpty: 'Clique na estrela de um símbolo para favoritá-lo.',
    recent: 'Copiados recentemente',
    recentEmpty: 'Seus últimos símbolos copiados aparecem aqui.',
    noResults: 'Nenhuma categoria encontrada para essa busca.',
    privacy: '🔒 Tudo acontece localmente no seu navegador. Nada é enviado para um servidor.',
  },
  en: {
    searchPlaceholder: 'Search category (e.g. arrow, heart, math)',
    format: 'Copy format',
    formatRaw: 'Text',
    formatHtml: 'HTML',
    formatCodepoint: 'Codepoint',
    sequenceMode: 'Build sequence',
    sequenceModeOn: 'On',
    sequenceModeOff: 'Off',
    sequencePlaceholder: 'Click symbols to build your sequence here',
    copySequence: 'Copy sequence',
    clearSequence: 'Clear',
    copied: 'Copied!',
    favorites: 'Favorites',
    favoritesEmpty: 'Click a symbol\'s star to favorite it.',
    recent: 'Recently copied',
    recentEmpty: 'Your last copied symbols show up here.',
    noResults: 'No category matches that search.',
    privacy: '🔒 Everything runs locally in your browser. Nothing is sent to a server.',
  },
  es: {
    searchPlaceholder: 'Buscar categoría (ej: flecha, corazón, matemática)',
    format: 'Formato al copiar',
    formatRaw: 'Texto',
    formatHtml: 'HTML',
    formatCodepoint: 'Codepoint',
    sequenceMode: 'Armar secuencia',
    sequenceModeOn: 'Activado',
    sequenceModeOff: 'Desactivado',
    sequencePlaceholder: 'Haz clic en los símbolos para armar tu secuencia aquí',
    copySequence: 'Copiar secuencia',
    clearSequence: 'Limpiar',
    copied: '¡Copiado!',
    favorites: 'Favoritos',
    favoritesEmpty: 'Haz clic en la estrella de un símbolo para marcarlo como favorito.',
    recent: 'Copiados recientemente',
    recentEmpty: 'Tus últimos símbolos copiados aparecen aquí.',
    noResults: 'No hay categorías para esa búsqueda.',
    privacy: '🔒 Todo ocurre localmente en tu navegador. Nada se envía a un servidor.',
  },
  zh: {
    searchPlaceholder: '搜索分类(例如:箭头、爱心、数学)',
    format: '复制格式',
    formatRaw: '文本',
    formatHtml: 'HTML',
    formatCodepoint: '编码点',
    sequenceMode: '组合序列',
    sequenceModeOn: '已开启',
    sequenceModeOff: '已关闭',
    sequencePlaceholder: '点击符号,在此组合你的序列',
    copySequence: '复制序列',
    clearSequence: '清空',
    copied: '已复制!',
    favorites: '收藏',
    favoritesEmpty: '点击符号上的星标即可收藏。',
    recent: '最近复制',
    recentEmpty: '你最近复制的符号会显示在这里。',
    noResults: '没有找到匹配该搜索的分类。',
    privacy: '🔒 所有操作都在你的浏览器本地完成,不会发送到服务器。',
  },
};

const formatOptions: Array<{ value: CopyFormat; labelKey: keyof UiCopy }> = [
  { value: 'raw', labelKey: 'formatRaw' },
  { value: 'html-entity', labelKey: 'formatHtml' },
  { value: 'codepoint', labelKey: 'formatCodepoint' },
];

export function SymbolsToCopyTool({
  locale = 'pt-br',
  initialCategoryId,
}: SymbolsToCopyToolProps) {
  const ui = uiByLocale[locale];
  const defaultCategoryId = initialCategoryId ?? symbolCategories[0]?.id ?? '';

  const [query, setQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(defaultCategoryId);
  const [format, setFormat] = useState<CopyFormat>('raw');
  const [sequenceMode, setSequenceMode] = useState(false);
  const [sequence, setSequence] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);
  const [copiedSequence, setCopiedSequence] = useState(false);

  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }

      const storedRecent = localStorage.getItem(RECENT_KEY);
      if (storedRecent) {
        setRecent(JSON.parse(storedRecent));
      }
    } catch {
      // ignore malformed/unavailable storage
    }
  }, []);

  const markStarted = useCallback(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackEvent('tool_started', { tool: TOOL_ID.symbolsToCopy, locale });
    }
  }, [locale]);

  const filteredCategories = useMemo(
    () => searchSymbolCategories(query, locale),
    [query, locale],
  );

  useEffect(() => {
    if (filteredCategories.length === 0) {
      return;
    }

    if (!filteredCategories.some((category) => category.id === activeCategoryId)) {
      setActiveCategoryId(filteredCategories[0].id);
    }
  }, [filteredCategories, activeCategoryId]);

  const activeCategory = getSymbolCategoryById(activeCategoryId) ?? filteredCategories[0];

  const persistFavorites = useCallback((next: string[]) => {
    setFavorites(next);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {
      // ignore write failure (private mode, quota, etc.)
    }
  }, []);

  const persistRecent = useCallback((symbol: string) => {
    setRecent((prev) => {
      const next = pushRecentSymbol(prev, symbol);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        // ignore write failure
      }
      return next;
    });
  }, []);

  const toggleFavorite = useCallback(
    (symbol: string) => {
      const next = favorites.includes(symbol)
        ? favorites.filter((item) => item !== symbol)
        : [...favorites, symbol];
      persistFavorites(next);
    },
    [favorites, persistFavorites],
  );

  const copySymbolValue = useCallback(
    async (symbol: string) => {
      markStarted();

      try {
        await navigator.clipboard.writeText(formatSymbol(symbol, format));
        setCopiedSymbol(symbol);
        window.setTimeout(() => {
          setCopiedSymbol((prev) => (prev === symbol ? null : prev));
        }, 1500);

        trackEvent('result_copied', { tool: TOOL_ID.symbolsToCopy, locale, format });

        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          trackEvent('tool_completed', { tool: TOOL_ID.symbolsToCopy, locale });
        }

        persistRecent(symbol);
      } catch {
        trackEvent('tool_error', {
          tool: TOOL_ID.symbolsToCopy,
          locale,
          error_type: 'clipboard_write_failed',
        });
      }
    },
    [format, locale, markStarted, persistRecent],
  );

  const handleSymbolClick = useCallback(
    (symbol: string) => {
      markStarted();

      if (sequenceMode) {
        setSequence((prev) => prev + symbol);
        return;
      }

      void copySymbolValue(symbol);
    },
    [copySymbolValue, markStarted, sequenceMode],
  );

  const copySequenceValue = useCallback(async () => {
    if (!sequence) {
      return;
    }

    try {
      await navigator.clipboard.writeText(formatSymbolSequence(sequence, format));
      setCopiedSequence(true);
      window.setTimeout(() => setCopiedSequence(false), 1500);
      trackEvent('result_copied', { tool: TOOL_ID.symbolsToCopy, locale, format, mode: 'sequence' });

      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        trackEvent('tool_completed', { tool: TOOL_ID.symbolsToCopy, locale });
      }
    } catch {
      trackEvent('tool_error', {
        tool: TOOL_ID.symbolsToCopy,
        locale,
        error_type: 'clipboard_write_failed',
      });
    }
  }, [format, locale, sequence]);

  const toggleSequenceMode = useCallback(() => {
    markStarted();
    setSequenceMode((prev) => {
      const next = !prev;
      trackEvent('mode_selected', {
        tool: TOOL_ID.symbolsToCopy,
        locale,
        mode: next ? 'sequence' : 'instant',
      });
      return next;
    });
  }, [locale, markStarted]);

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 md:p-6">
        <Input
          type="text"
          value={query}
          onChange={(event) => {
            markStarted();
            setQuery(event.target.value);
          }}
          placeholder={ui.searchPlaceholder}
        />

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">{ui.format}</span>
            <div className="flex overflow-hidden rounded-lg border border-slate-300">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={format === option.value}
                  onClick={() => {
                    markStarted();
                    setFormat(option.value);
                    trackEvent('format_selected', {
                      tool: TOOL_ID.symbolsToCopy,
                      locale,
                      format: option.value,
                    });
                  }}
                  className={cn(
                    'px-3 py-1.5 text-xs font-semibold transition',
                    format === option.value
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100',
                  )}
                >
                  {ui[option.labelKey]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">{ui.sequenceMode}</span>
            <button
              type="button"
              aria-pressed={sequenceMode}
              onClick={toggleSequenceMode}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                sequenceMode
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              )}
            >
              {sequenceMode ? ui.sequenceModeOn : ui.sequenceModeOff}
            </button>
          </div>
        </div>

        {sequenceMode ? (
          <div className="space-y-2 rounded-lg border border-brand-200 bg-brand-50 p-3">
            <p className="min-h-[2.5rem] break-all rounded-md border border-dashed border-brand-300 bg-white px-3 py-2 text-lg">
              {sequence || <span className="text-sm text-slate-400">{ui.sequencePlaceholder}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                className="h-8 px-3 text-xs"
                disabled={!sequence}
                onClick={() => void copySequenceValue()}
              >
                {copiedSequence ? (
                  <>
                    <Check className="mr-1 h-3.5 w-3.5" /> {ui.copied}
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3.5 w-3.5" /> {ui.copySequence}
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                className="h-8 px-3 text-xs"
                disabled={!sequence}
                onClick={() => setSequence('')}
              >
                {ui.clearSequence}
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {favorites.length > 0 ? (
        <SymbolStrip
          title={ui.favorites}
          symbols={favorites}
          copiedSymbol={copiedSymbol}
          favorites={favorites}
          onSymbolClick={handleSymbolClick}
          onToggleFavorite={toggleFavorite}
        />
      ) : null}

      {recent.length > 0 ? (
        <SymbolStrip
          title={ui.recent}
          symbols={recent}
          copiedSymbol={copiedSymbol}
          favorites={favorites}
          onSymbolClick={handleSymbolClick}
          onToggleFavorite={toggleFavorite}
        />
      ) : null}

      <div className="space-y-3">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {filteredCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={activeCategory?.id === category.id}
              onClick={() => {
                markStarted();
                setActiveCategoryId(category.id);
              }}
              className={cn(
                'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition',
                activeCategory?.id === category.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              )}
            >
              {category.labelByLocale[locale]}
            </button>
          ))}
        </div>

        {activeCategory ? (
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
            {activeCategory.symbols.map((symbol, index) => (
              <SymbolTile
                key={`${activeCategory.id}-${index}-${symbol}`}
                symbol={symbol}
                isCopied={copiedSymbol === symbol}
                isFavorite={favorites.includes(symbol)}
                onClick={() => handleSymbolClick(symbol)}
                onToggleFavorite={() => toggleFavorite(symbol)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">{ui.noResults}</p>
        )}
      </div>

      <p className="text-xs text-slate-400">{ui.privacy}</p>
    </div>
  );
}

type SymbolTileProps = Readonly<{
  symbol: string;
  isCopied: boolean;
  isFavorite: boolean;
  onClick: () => void;
  onToggleFavorite: () => void;
}>;

function SymbolTile({ symbol, isCopied, isFavorite, onClick, onToggleFavorite }: SymbolTileProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex aspect-square w-full items-center justify-center rounded-lg border text-xl transition',
          isCopied
            ? 'border-brand-500 bg-brand-50 text-brand-800'
            : 'border-slate-200 bg-white text-slate-800 hover:border-brand-300 hover:bg-brand-50',
        )}
      >
        {isCopied ? <Check className="h-4 w-4" /> : symbol}
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite();
        }}
        aria-pressed={isFavorite}
        className={cn(
          'absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border bg-white transition',
          isFavorite ? 'border-amber-400 text-amber-500' : 'border-slate-200 text-slate-300 hover:text-amber-400',
        )}
      >
        <Star className="h-2.5 w-2.5" fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}

type SymbolStripProps = Readonly<{
  title: string;
  symbols: string[];
  copiedSymbol: string | null;
  favorites: string[];
  onSymbolClick: (symbol: string) => void;
  onToggleFavorite: (symbol: string) => void;
}>;

function SymbolStrip({
  title,
  symbols,
  copiedSymbol,
  favorites,
  onSymbolClick,
  onToggleFavorite,
}: SymbolStripProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-10 md:grid-cols-12">
        {symbols.map((symbol, index) => (
          <SymbolTile
            key={`${title}-${index}-${symbol}`}
            symbol={symbol}
            isCopied={copiedSymbol === symbol}
            isFavorite={favorites.includes(symbol)}
            onClick={() => onSymbolClick(symbol)}
            onToggleFavorite={() => onToggleFavorite(symbol)}
          />
        ))}
      </div>
    </div>
  );
}
