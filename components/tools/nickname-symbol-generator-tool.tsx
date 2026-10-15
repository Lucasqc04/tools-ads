'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Check, Copy, Search, Shuffle, Sparkles, Trash2 } from 'lucide-react';
import { trackEvent, TOOL_ID } from '@/lib/analytics';
import {
  buildNicknameSymbolVariants,
  composeSymbolNickname,
  countNicknameCharacters,
  getNicknameFrameById,
  getNicknameSymbolPlatformById,
  insertNicknameTextAtSelection,
  limitNicknameCharacters,
  nicknameFrameDefinitions,
  nicknameSymbolCategories,
  nicknameSymbolPlatforms,
  nicknameTextStyles,
  type NicknameSymbolCategoryId,
  type NicknameTextStyleId,
} from '@/lib/nickname-symbol-generator';
import type { AppLocale } from '@/lib/i18n/config';

type NicknameSymbolGeneratorToolProps = {
  locale?: AppLocale;
  initialPlatformId?: string;
};

type UiCopy = {
  platformLabel: string;
  nameLabel: string;
  namePlaceholder: string;
  nameHint: string;
  styleLabel: string;
  previewTitle: string;
  previewDescription: string;
  characters: string;
  copyNickname: string;
  copied: string;
  shuffle: string;
  recommendedTitle: string;
  recommendedDescription: string;
  usePreset: string;
  symbolLibraryTitle: string;
  symbolLibraryDescription: string;
  allSymbols: string;
  searchSymbols: string;
  searchPlaceholder: string;
  insertSymbol: string;
  clearName: string;
  noSymbols: string;
  mobileGames: string;
  pcGames: string;
  crossPlatformGames: string;
  copySymbol: string;
  customTitle: string;
  customDescription: string;
  leftLabel: string;
  rightLabel: string;
  variantsTitle: string;
  variantsDescription: string;
  copyAll: string;
  localNotice: string;
  error: string;
};

const uiByLocale: Record<AppLocale, UiCopy> = {
  'pt-br': {
    platformLabel: 'Jogo ou plataforma',
    nameLabel: 'Nickname em edicao',
    namePlaceholder: 'Ex: Shadow',
    nameHint: 'Digite seu nome. Clique em um simbolo para inserir onde esta o cursor.',
    styleLabel: 'Estilo das letras (12)',
    previewTitle: 'Preview personalizado',
    previewDescription: 'Veja a montagem completa e confira o tamanho antes de copiar.',
    characters: 'caracteres',
    copyNickname: 'Copiar nickname',
    copied: 'Copiado',
    shuffle: 'Surpreenda-me',
    recommendedTitle: 'Molduras recomendadas',
    recommendedDescription: 'Comece por opcoes curtas e ajuste depois se precisar.',
    usePreset: 'Usar preset',
    symbolLibraryTitle: 'Catalogo de simbolos',
    symbolLibraryDescription: 'Deslize a grade para os lados para trocar de categoria; role para explorar simbolos e emojis. Toque para inserir ou copie.',
    allSymbols: 'Todos',
    searchSymbols: 'Buscar simbolos',
    searchPlaceholder: 'Buscar por simbolo ou categoria',
    insertSymbol: 'Inserir simbolo',
    clearName: 'Limpar nome',
    noSymbols: 'Nenhum simbolo encontrado.',
    mobileGames: 'Jogos mobile',
    pcGames: 'Jogos para PC',
    crossPlatformGames: 'Mobile e PC',
    copySymbol: 'Copiar simbolo',
    customTitle: 'Ajuste manual',
    customDescription: 'Voce pode colar qualquer simbolo Unicode nos campos abaixo.',
    leftLabel: 'Prefixo esquerdo',
    rightLabel: 'Sufixo direito',
    variantsTitle: 'Nicknames prontos para copiar',
    variantsDescription: 'Variacoes ordenadas pelo jogo selecionado e pelo estilo atual.',
    copyAll: 'Copiar todos',
    localNotice: 'Geracao local no navegador. Teste o resultado dentro do jogo antes de salvar.',
    error: 'Nao foi possivel copiar agora.',
  },
  en: {
    platformLabel: 'Game or platform',
    nameLabel: 'Nickname editor',
    namePlaceholder: 'Example: Shadow',
    nameHint: 'Type your name. Select a symbol to insert it where your cursor is.',
    styleLabel: 'Letter style (12)',
    previewTitle: 'Custom preview',
    previewDescription: 'Review the complete name and its length before copying.',
    characters: 'characters',
    copyNickname: 'Copy nickname',
    copied: 'Copied',
    shuffle: 'Surprise me',
    recommendedTitle: 'Recommended frames',
    recommendedDescription: 'Start with short options and customize only when needed.',
    usePreset: 'Use preset',
    symbolLibraryTitle: 'Symbol catalog',
    symbolLibraryDescription: 'Swipe the grid sideways to switch categories, then scroll to explore symbols and emojis. Tap to insert or copy.',
    allSymbols: 'All',
    searchSymbols: 'Search symbols',
    searchPlaceholder: 'Search by symbol or category',
    insertSymbol: 'Insert symbol',
    clearName: 'Clear name',
    noSymbols: 'No symbols found.',
    mobileGames: 'Mobile games',
    pcGames: 'PC games',
    crossPlatformGames: 'Mobile and PC',
    copySymbol: 'Copy symbol',
    customTitle: 'Manual adjustment',
    customDescription: 'You can paste any Unicode symbol into the fields below.',
    leftLabel: 'Left prefix',
    rightLabel: 'Right suffix',
    variantsTitle: 'Copy-ready gaming names',
    variantsDescription: 'Variations ordered for the selected game and current letter style.',
    copyAll: 'Copy all',
    localNotice: 'Local browser generation. Test the result inside the game before saving.',
    error: 'Could not copy right now.',
  },
  es: {
    platformLabel: 'Juego o plataforma',
    nameLabel: 'Nickname en edicion',
    namePlaceholder: 'Ejemplo: Shadow',
    nameHint: 'Escribe tu nombre. Elige un simbolo para insertarlo donde esta el cursor.',
    styleLabel: 'Estilo de letras (12)',
    previewTitle: 'Preview personalizado',
    previewDescription: 'Revisa el nombre completo y su longitud antes de copiar.',
    characters: 'caracteres',
    copyNickname: 'Copiar nickname',
    copied: 'Copiado',
    shuffle: 'Sorprendeme',
    recommendedTitle: 'Marcos recomendados',
    recommendedDescription: 'Empieza con opciones cortas y personaliza solo si hace falta.',
    usePreset: 'Usar preset',
    symbolLibraryTitle: 'Catalogo de simbolos',
    symbolLibraryDescription: 'Desliza la cuadrícula hacia los lados para cambiar de categoría y baja para explorar símbolos y emojis. Toca para insertar o copiar.',
    allSymbols: 'Todos',
    searchSymbols: 'Buscar simbolos',
    searchPlaceholder: 'Buscar por simbolo o categoria',
    insertSymbol: 'Insertar simbolo',
    clearName: 'Borrar nombre',
    noSymbols: 'No se encontraron simbolos.',
    mobileGames: 'Juegos mobile',
    pcGames: 'Juegos para PC',
    crossPlatformGames: 'Mobile y PC',
    copySymbol: 'Copiar simbolo',
    customTitle: 'Ajuste manual',
    customDescription: 'Puedes pegar cualquier simbolo Unicode en los campos.',
    leftLabel: 'Prefijo izquierdo',
    rightLabel: 'Sufijo derecho',
    variantsTitle: 'Nicknames listos para copiar',
    variantsDescription: 'Variaciones ordenadas para el juego y el estilo seleccionados.',
    copyAll: 'Copiar todos',
    localNotice: 'Generacion local. Prueba el resultado dentro del juego antes de guardarlo.',
    error: 'No fue posible copiar ahora.',
  },
  zh: {
    platformLabel: '游戏或平台',
    nameLabel: '正在编辑的昵称',
    namePlaceholder: '例如:Shadow',
    nameHint: '输入昵称。选择一个符号,它会插入到光标所在的位置。',
    styleLabel: '字体风格(12种)',
    previewTitle: '自定义预览',
    previewDescription: '复制前查看完整组合结果和字符长度。',
    characters: '个字符',
    copyNickname: '复制昵称',
    copied: '已复制',
    shuffle: '给我惊喜',
    recommendedTitle: '推荐边框',
    recommendedDescription: '先从简短的选项开始,有需要时再调整。',
    usePreset: '使用预设',
    symbolLibraryTitle: '符号目录',
    symbolLibraryDescription: '左右滑动网格切换分类,向下滚动浏览符号和表情。点击即可插入或复制。',
    allSymbols: '全部',
    searchSymbols: '搜索符号',
    searchPlaceholder: '按符号或分类搜索',
    insertSymbol: '插入符号',
    clearName: '清除昵称',
    noSymbols: '没有找到符号。',
    mobileGames: '手机游戏',
    pcGames: 'PC 游戏',
    crossPlatformGames: '手机和 PC',
    copySymbol: '复制符号',
    customTitle: '手动调整',
    customDescription: '你可以在下方字段中粘贴任意 Unicode 符号。',
    leftLabel: '左侧前缀',
    rightLabel: '右侧后缀',
    variantsTitle: '可直接复制的昵称',
    variantsDescription: '根据所选游戏和当前字体风格排序的变体。',
    copyAll: '全部复制',
    localNotice: '在浏览器本地生成。保存前请先在游戏内测试结果。',
    error: '暂时无法复制。',
  },
};

const limitCodePoints = (value: string, limit: number): string =>
  Array.from(value).slice(0, limit).join('');

/** Categorical (never PII) description of what a copy action produced, for analytics. */
const copyFieldByActionId: Record<string, string> = {
  preview: 'nickname',
  symbol: 'symbol_text',
  all: 'variant_list',
};

const catalogCategoryIds: Array<NicknameSymbolCategoryId | 'all'> = [
  'all',
  ...nicknameSymbolCategories.map(({ id }) => id),
];

export function NicknameSymbolGeneratorTool({
  locale = 'pt-br',
  initialPlatformId,
}: Readonly<NicknameSymbolGeneratorToolProps>) {
  const ui = uiByLocale[locale];
  const defaultPlatform =
    getNicknameSymbolPlatformById(initialPlatformId ?? 'cod-mobile') ?? nicknameSymbolPlatforms[0];

  const [platformId, setPlatformId] = useState(defaultPlatform?.id ?? 'fortnite');
  const [baseName, setBaseName] = useState('Shadow');
  const [styleId, setStyleId] = useState<NicknameTextStyleId>('original');
  const [leftSymbol, setLeftSymbol] = useState('');
  const [rightSymbol, setRightSymbol] = useState('');
  const [categoryId, setCategoryId] = useState<NicknameSymbolCategoryId | 'all'>('popular');
  const [symbolSearch, setSymbolSearch] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [copiedId, setCopiedId] = useState('');
  const [feedback, setFeedback] = useState('');
  const baseNameInputRef = useRef<HTMLInputElement>(null);
  const activeBaseNameInputRef = useRef<HTMLInputElement | null>(null);
  const categoryNavigationRef = useRef<HTMLDivElement>(null);
  const catalogSwipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const suppressCatalogClickRef = useRef(false);
  const baseNameSelectionRef = useRef({ start: 6, end: 6 });
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    categoryNavigationRef.current
      ?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [categoryId]);

  const trackStarted = () => {
    if (hasStartedRef.current) {
      return;
    }
    hasStartedRef.current = true;
    trackEvent('tool_started', { tool: TOOL_ID.nicknameSymbolGenerator, locale });
  };

  const trackCompleted = (field: string) => {
    if (hasCompletedRef.current) {
      return;
    }

    hasCompletedRef.current = true;
    trackEvent('tool_completed', { tool: TOOL_ID.nicknameSymbolGenerator, locale, field });
  };

  const selectedPlatform =
    getNicknameSymbolPlatformById(platformId) ?? nicknameSymbolPlatforms[0];

  const symbolEntries = useMemo(() => {
    const query = symbolSearch.trim().toLocaleLowerCase(locale);
    const categories = categoryId === 'all'
      ? nicknameSymbolCategories
      : nicknameSymbolCategories.filter((category) => category.id === categoryId);
    const uniqueSymbols = new Map<string, { symbol: string; categoryName: string }>();

    categories.forEach((category) => {
      category.symbols.forEach((symbol) => {
        if (!uniqueSymbols.has(symbol)) {
          uniqueSymbols.set(symbol, {
            symbol,
            categoryName: category.labelByLocale[locale],
          });
        }
      });
    });

    return Array.from(uniqueSymbols.values()).filter(({ symbol, categoryName }) => {
      if (!query) {
        return true;
      }

      return (
        symbol.toLocaleLowerCase(locale).includes(query) ||
        categoryName.toLocaleLowerCase(locale).includes(query)
      );
    });
  }, [categoryId, locale, symbolSearch]);

  const platformGroups = [
    {
      category: 'mobile' as const,
      label: ui.mobileGames,
      platforms: nicknameSymbolPlatforms.filter((platform) => platform.deviceCategory === 'mobile'),
    },
    {
      category: 'pc' as const,
      label: ui.pcGames,
      platforms: nicknameSymbolPlatforms.filter((platform) => platform.deviceCategory === 'pc'),
    },
    {
      category: 'cross-platform' as const,
      label: ui.crossPlatformGames,
      platforms: nicknameSymbolPlatforms.filter(
        (platform) => platform.deviceCategory === 'cross-platform',
      ),
    },
  ];

  const preview = useMemo(
    () => composeSymbolNickname(baseName, leftSymbol, rightSymbol, styleId),
    [baseName, leftSymbol, rightSymbol, styleId],
  );

  const variants = useMemo(
    () =>
      buildNicknameSymbolVariants(
        baseName,
        platformId,
        styleId,
        nicknameFrameDefinitions.length,
      ),
    [baseName, platformId, styleId],
  );

  const copyText = async (value: string, actionId: string) => {
    trackStarted();

    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(actionId);
      setFeedback('');
      window.setTimeout(() => setCopiedId(''), 1800);

      const field = copyFieldByActionId[actionId] ?? 'variant';

      trackEvent('result_copied', { tool: TOOL_ID.nicknameSymbolGenerator, locale, field });

      // No explicit "generate" button in this live-preview tool: copying the
      // composed nickname or a ready-made variant is the real completion
      // signal (a bare symbol copy is a minor pick, not a full completion).
      if (actionId !== 'symbol') {
        trackCompleted(field);
      }
    } catch {
      setFeedback(ui.error);
      trackEvent('tool_error', {
        tool: TOOL_ID.nicknameSymbolGenerator,
        locale,
        error_type: 'processing_failed',
        action: 'copy',
      });
    }
  };

  const rememberBaseNameSelection = (input: HTMLInputElement) => {
    activeBaseNameInputRef.current = input;
    const start = Math.min(input.selectionStart ?? input.value.length, input.value.length);
    const end = Math.min(input.selectionEnd ?? start, input.value.length);
    baseNameSelectionRef.current = { start, end };
  };

  const restoreBaseNameCursor = (cursor: number) => {
    window.requestAnimationFrame(() => {
      const input = activeBaseNameInputRef.current ?? baseNameInputRef.current;
      input?.setSelectionRange(cursor, cursor);
    });
  };

  const updateBaseName = (input: HTMLInputElement) => {
    trackStarted();
    activeBaseNameInputRef.current = input;
    const nextValue = limitNicknameCharacters(input.value);
    setBaseName(nextValue);

    const start = Math.min(input.selectionStart ?? nextValue.length, nextValue.length);
    const end = Math.min(input.selectionEnd ?? start, nextValue.length);
    baseNameSelectionRef.current = { start, end };
  };

  const clearName = () => {
    trackStarted();
    setBaseName('');
    baseNameSelectionRef.current = { start: 0, end: 0 };
    restoreBaseNameCursor(0);
  };

  const selectPlatform = (nextPlatformId: string) => {
    const platform = getNicknameSymbolPlatformById(nextPlatformId);
    if (!platform || platform.id === platformId) {
      return;
    }

    trackStarted();
    setPlatformId(platform.id);
    trackEvent('mode_selected', {
      tool: TOOL_ID.nicknameSymbolGenerator,
      locale,
      mode: platform.id,
    });
  };

  const handleCatalogPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    catalogSwipeStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleCatalogPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = catalogSwipeStartRef.current;
    catalogSwipeStartRef.current = null;

    if (!start || symbolSearch.trim()) {
      return;
    }

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) {
      return;
    }

    const currentIndex = catalogCategoryIds.indexOf(categoryId);
    const nextIndex = currentIndex + (deltaX < 0 ? 1 : -1);
    const nextCategoryId = catalogCategoryIds[nextIndex];

    suppressCatalogClickRef.current = true;
    window.setTimeout(() => {
      suppressCatalogClickRef.current = false;
    }, 350);

    if (nextCategoryId) {
      setCategoryId(nextCategoryId);
    }
  };

  const applyFrame = (frameId: string) => {
    const frame = getNicknameFrameById(frameId);
    if (
      !frame ||
      (frame.left === leftSymbol && frame.right === rightSymbol)
    ) {
      return;
    }

    trackStarted();

    trackEvent('format_selected', {
      tool: TOOL_ID.nicknameSymbolGenerator,
      locale,
      format: frame.id,
    });
    setLeftSymbol(frame.left);
    setRightSymbol(frame.right);
    setSelectedSymbol(frame.left || frame.right || selectedSymbol);
  };

  const applySymbol = (symbol: string) => {
    trackStarted();
    setSelectedSymbol(symbol);
    const selection = baseNameSelectionRef.current;
    const edit = insertNicknameTextAtSelection(
      baseName,
      symbol,
      selection.start,
      selection.end,
    );

    setBaseName(edit.value);
    baseNameSelectionRef.current = { start: edit.cursor, end: edit.cursor };
    restoreBaseNameCursor(edit.cursor);
  };

  const shufflePreset = () => {
    trackStarted();

    const frame = nicknameFrameDefinitions[
      Math.floor(Math.random() * nicknameFrameDefinitions.length)
    ];
    const style = nicknameTextStyles[Math.floor(Math.random() * nicknameTextStyles.length)];

    if (frame) {
      applyFrame(frame.id);
    }

    if (style) {
      setStyleId(style.id);
    }
  };


  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <section className="border-b border-slate-200 p-4 sm:p-5 md:p-6">
        <label className="block min-w-0 space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.nameLabel}</span>
          <div className="flex gap-2">
            <input
              ref={baseNameInputRef}
              value={baseName}
              onChange={(event) => updateBaseName(event.currentTarget)}
              onFocus={(event) => rememberBaseNameSelection(event.currentTarget)}
              onSelect={(event) => rememberBaseNameSelection(event.currentTarget)}
              onKeyUp={(event) => rememberBaseNameSelection(event.currentTarget)}
              onBlur={(event) => rememberBaseNameSelection(event.currentTarget)}
              placeholder={ui.namePlaceholder}
              aria-describedby="nickname-editor-hint"
              autoComplete="off"
              spellCheck={false}
              className="min-h-12 min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
            <button
              type="button"
              onClick={clearName}
              aria-label={ui.clearName}
              title={ui.clearName}
              className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <span id="nickname-editor-hint" className="block text-xs leading-5 text-slate-500">
            {ui.nameHint}
          </span>
        </label>
      </section>

      <section className="border-b border-slate-200 bg-slate-950 px-4 py-6 text-white sm:px-5 md:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                {selectedPlatform?.name}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{ui.previewTitle}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-300">{ui.previewDescription}</p>
            </div>
            <p
              className="max-w-full break-all text-3xl font-bold tracking-wide text-white md:text-4xl"
              aria-live="polite"
            >
              {preview || baseName}
            </p>
            <p className="text-xs text-slate-400">
              {countNicknameCharacters(preview)} {ui.characters}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copyText(preview, 'preview')}
              aria-live="polite"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400"
            >
              {copiedId === 'preview' ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              {copiedId === 'preview' ? ui.copied : ui.copyNickname}
            </button>
          </div>
        </div>
        {feedback ? (
          <p role="status" aria-live="polite" className="mt-3 text-sm font-medium text-red-200">
            {feedback}
          </p>
        ) : null}
      </section>

      <section className="space-y-4 border-b border-slate-200 p-4 sm:p-5 md:p-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{ui.symbolLibraryTitle}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{ui.symbolLibraryDescription}</p>
        </div>

        <label className="relative block">
          <span className="sr-only">{ui.searchSymbols}</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            value={symbolSearch}
            onChange={(event) => setSymbolSearch(event.target.value)}
            placeholder={ui.searchPlaceholder}
            autoComplete="off"
            className="min-h-11 w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
        </label>

        <div
          ref={categoryNavigationRef}
          role="group"
          aria-label={ui.symbolLibraryTitle}
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2"
        >
          <button
            type="button"
            onClick={() => setCategoryId('all')}
            aria-pressed={categoryId === 'all'}
            className={
              'min-h-10 shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold transition ' +
              (categoryId === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
            }
          >
            <span className="mr-1" aria-hidden="true">✦</span>
            {ui.allSymbols}
          </button>
          {nicknameSymbolCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryId(category.id)}
              aria-pressed={categoryId === category.id}
              className={
                'min-h-10 shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold transition ' +
                (categoryId === category.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
              }
            >
              <span className="mr-1" aria-hidden="true">{category.symbols[0]}</span>
              {category.labelByLocale[locale]}
            </button>
          ))}
        </div>

        {symbolEntries.length ? (
          <div
            onPointerDown={handleCatalogPointerDown}
            onPointerUp={handleCatalogPointerUp}
            onPointerCancel={() => {
              catalogSwipeStartRef.current = null;
            }}
            className="grid max-h-[min(60vh,28rem)] touch-pan-y select-none grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10"
          >
            {symbolEntries.map(({ symbol }) => (
              <div
                key={symbol}
                className="flex min-w-0 items-stretch overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-brand-300"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (suppressCatalogClickRef.current) {
                      suppressCatalogClickRef.current = false;
                      return;
                    }
                    applySymbol(symbol);
                  }}
                  aria-label={ui.insertSymbol + ': ' + symbol}
                  aria-pressed={selectedSymbol === symbol}
                  className={
                    'flex min-h-12 min-w-0 flex-1 items-center justify-center text-2xl text-slate-900 transition hover:bg-brand-50 ' +
                    (selectedSymbol === symbol ? 'bg-brand-50 text-brand-800' : '')
                  }
                >
                  {symbol}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (suppressCatalogClickRef.current) {
                      suppressCatalogClickRef.current = false;
                      return;
                    }
                    void copyText(symbol, 'symbol');
                  }}
                  aria-label={ui.copySymbol + ': ' + symbol}
                  title={ui.copySymbol}
                  className="inline-flex min-h-12 w-10 shrink-0 items-center justify-center border-l border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-brand-700"
                >
                  {copiedId === 'symbol' ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
            {ui.noSymbols}
          </p>
        )}
      </section>

      <section className="space-y-4 border-b border-slate-200 p-4 sm:p-5 md:p-6">
        <label className="block max-w-xl space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.platformLabel}</span>
          <select
            value={platformId}
            onChange={(event) => selectPlatform(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          >
            {platformGroups.map((group) => (
              <optgroup key={group.category} label={group.label}>
                {group.platforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{ui.recommendedTitle}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{ui.recommendedDescription}</p>
          </div>
          <button
            type="button"
            onClick={shufflePreset}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 sm:self-auto"
          >
            <Shuffle className="h-4 w-4" aria-hidden="true" />
            {ui.shuffle}
          </button>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {selectedPlatform?.recommendedFrameIds.map((frameId) => {
            const frame = getNicknameFrameById(frameId);
            if (!frame) {
              return null;
            }

            const value = composeSymbolNickname(baseName, frame.left, frame.right, styleId);
            const selected = leftSymbol === frame.left && rightSymbol === frame.right;

            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => applyFrame(frame.id)}
                aria-pressed={selected}
                className={
                  'min-h-16 min-w-0 rounded-xl border px-3 py-3 text-left transition ' +
                  (selected
                    ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100'
                    : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50')
                }
              >
                <span className="block break-all text-base font-semibold text-slate-900">
                  {value}
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  {frame.labelByLocale[locale]} · {ui.usePreset}
                </span>
              </button>
            );
          })}
        </div>
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {selectedPlatform?.guidanceByLocale[locale]}
        </p>
      </section>

      <details className="group border-b border-slate-200">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 marker:content-none sm:px-5 md:px-6 [&::-webkit-details-marker]:hidden">
          <span className="min-w-0">
            <span className="block text-lg font-semibold text-slate-900">{ui.customTitle}</span>
            <span className="mt-1 block text-sm leading-6 text-slate-600">
              {ui.customDescription}
            </span>
          </span>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-medium text-slate-700 transition group-open:rotate-45"
            aria-hidden="true"
          >
            +
          </span>
        </summary>
        <div className="grid gap-4 px-4 pb-5 sm:grid-cols-2 sm:px-5 md:px-6 md:pb-6">
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-semibold text-slate-800">{ui.styleLabel}</span>
            <select
              value={styleId}
              onChange={(event) => {
                trackStarted();
                setStyleId(event.target.value as NicknameTextStyleId);
              }}
              className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            >
              {nicknameTextStyles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.labelByLocale[locale]}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.leftLabel}</span>
            <input
              value={leftSymbol}
              onChange={(event) => {
                trackStarted();
                setLeftSymbol(limitCodePoints(event.target.value, 8));
              }}
              maxLength={8}
              className="min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-lg text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.rightLabel}</span>
            <input
              value={rightSymbol}
              onChange={(event) => {
                trackStarted();
                setRightSymbol(limitCodePoints(event.target.value, 8));
              }}
              maxLength={8}
              className="min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-lg text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </label>
        </div>
      </details>

      <section className="space-y-4 p-4 sm:p-5 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{ui.variantsTitle}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{ui.variantsDescription}</p>
          </div>
          <button
            type="button"
            onClick={() => copyText(variants.map((variant) => variant.value).join('\n'), 'all')}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
          >
            {copiedId === 'all' ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
            {copiedId === 'all' ? ui.copied : ui.copyAll}
          </button>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {variants.map((variant) => {
            const frame = getNicknameFrameById(variant.frameId);

            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => copyText(variant.value, variant.id)}
                className="group min-h-14 min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-brand-300 hover:bg-brand-50/40"
              >
                <span className="flex min-w-0 items-center justify-between gap-3">
                  <span className="min-w-0 break-all text-base font-semibold text-slate-900">
                    {variant.value}
                  </span>
                  {copiedId === variant.id ? (
                    <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <Copy
                      className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-brand-600"
                      aria-hidden="true"
                    />
                  )}
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  {frame?.labelByLocale[locale]} · {countNicknameCharacters(variant.value)}{' '}
                  {ui.characters}
                </span>
              </button>
            );
          })}
        </div>

        <p className="flex items-start gap-2 rounded-xl bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900">
          <Sparkles className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{ui.localNotice}</span>
        </p>
      </section>
    </div>
  );

}
