'use client';

import { useMemo, useRef, useState } from 'react';
import { Check, Copy, Shuffle, Sparkles } from 'lucide-react';
import { trackEvent, TOOL_ID } from '@/lib/analytics';
import {
  buildNicknameSymbolVariants,
  composeSymbolNickname,
  countNicknameCharacters,
  deleteNicknameTextAtSelection,
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

type SymbolTarget = 'cursor' | 'left' | 'right' | 'both';

type NicknameSymbolGeneratorToolProps = {
  locale?: AppLocale;
  initialPlatformId?: string;
};

type UiCopy = {
  quickStartLabel: string;
  stepName: string;
  stepGame: string;
  stepStyle: string;
  platformLabel: string;
  platformHint: string;
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
  addToLabel: string;
  targetCursor: string;
  targetLeft: string;
  targetRight: string;
  targetBoth: string;
  keyboardBackspace: string;
  keyboardClearAll: string;
  selectedSymbol: string;
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
    quickStartLabel: 'Pronto em 3 passos',
    stepName: 'Digite seu nome',
    stepGame: 'Use o teclado',
    stepStyle: 'Copie e teste',
    platformLabel: 'Jogo ou plataforma',
    platformHint: 'A selecao muda a ordem dos presets e as recomendacoes de teste.',
    nameLabel: 'Nickname em edicao',
    namePlaceholder: 'Ex: Shadow',
    nameHint: 'Toque no ponto do nome onde deseja inserir o proximo simbolo.',
    styleLabel: 'Estilo das letras (12)',
    previewTitle: 'Preview personalizado',
    previewDescription: 'Veja a montagem completa e confira o tamanho antes de copiar.',
    characters: 'caracteres',
    copyNickname: 'Copiar nickname',
    copied: 'Copiado',
    shuffle: 'Surpreenda-me',
    recommendedTitle: '28 molduras e presets',
    recommendedDescription: 'Comece por opcoes curtas e ajuste depois se precisar.',
    usePreset: 'Usar preset',
    symbolLibraryTitle: 'Teclado com 224 simbolos',
    symbolLibraryDescription:
      'Deixe No cursor marcado e toque nos simbolos para montar o nickname do seu jeito.',
    addToLabel: 'Inserir simbolo em',
    targetCursor: 'No cursor',
    targetLeft: 'Esquerda',
    targetRight: 'Direita',
    targetBoth: 'Nos dois lados',
    keyboardBackspace: 'Apagar',
    keyboardClearAll: 'Limpar tudo',
    selectedSymbol: 'Simbolo selecionado',
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
    quickStartLabel: 'Ready in 3 steps',
    stepName: 'Type your name',
    stepGame: 'Use the keyboard',
    stepStyle: 'Copy and test',
    platformLabel: 'Game or platform',
    platformHint: 'Your selection changes preset order and testing guidance.',
    nameLabel: 'Nickname editor',
    namePlaceholder: 'Example: Shadow',
    nameHint: 'Tap the exact point in the name where the next symbol should go.',
    styleLabel: 'Letter style (12)',
    previewTitle: 'Custom preview',
    previewDescription: 'Review the complete name and its length before copying.',
    characters: 'characters',
    copyNickname: 'Copy nickname',
    copied: 'Copied',
    shuffle: 'Surprise me',
    recommendedTitle: '28 frames and presets',
    recommendedDescription: 'Start with short options and customize only when needed.',
    usePreset: 'Use preset',
    symbolLibraryTitle: 'Keyboard with 224 symbols',
    symbolLibraryDescription:
      'Keep At cursor selected and tap symbols to build the gaming name your way.',
    addToLabel: 'Insert symbol at',
    targetCursor: 'At cursor',
    targetLeft: 'Left',
    targetRight: 'Right',
    targetBoth: 'Both sides',
    keyboardBackspace: 'Backspace',
    keyboardClearAll: 'Clear all',
    selectedSymbol: 'Selected symbol',
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
    quickStartLabel: 'Listo en 3 pasos',
    stepName: 'Escribe tu nombre',
    stepGame: 'Usa el teclado',
    stepStyle: 'Copia y prueba',
    platformLabel: 'Juego o plataforma',
    platformHint: 'La seleccion cambia el orden de presets y las recomendaciones.',
    nameLabel: 'Nickname en edicion',
    namePlaceholder: 'Ejemplo: Shadow',
    nameHint: 'Toca el punto exacto del nombre donde quieres insertar el proximo simbolo.',
    styleLabel: 'Estilo de letras (12)',
    previewTitle: 'Preview personalizado',
    previewDescription: 'Revisa el nombre completo y su longitud antes de copiar.',
    characters: 'caracteres',
    copyNickname: 'Copiar nickname',
    copied: 'Copiado',
    shuffle: 'Sorprendeme',
    recommendedTitle: '28 marcos y presets',
    recommendedDescription: 'Empieza con opciones cortas y personaliza solo si hace falta.',
    usePreset: 'Usar preset',
    symbolLibraryTitle: 'Teclado con 224 simbolos',
    symbolLibraryDescription:
      'Deja En el cursor seleccionado y toca simbolos para montar el nickname a tu manera.',
    addToLabel: 'Insertar simbolo en',
    targetCursor: 'En el cursor',
    targetLeft: 'Izquierda',
    targetRight: 'Derecha',
    targetBoth: 'Ambos lados',
    keyboardBackspace: 'Borrar',
    keyboardClearAll: 'Limpiar todo',
    selectedSymbol: 'Simbolo seleccionado',
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
    quickStartLabel: '三步搞定',
    stepName: '输入你的名字',
    stepGame: '使用键盘',
    stepStyle: '复制并测试',
    platformLabel: '游戏或平台',
    platformHint: '选择会改变预设顺序和测试建议。',
    nameLabel: '正在编辑的昵称',
    namePlaceholder: '例如:Shadow',
    nameHint: '点击名字中你想插入下一个符号的具体位置。',
    styleLabel: '字体风格(12种)',
    previewTitle: '自定义预览',
    previewDescription: '复制前查看完整组合结果和字符长度。',
    characters: '个字符',
    copyNickname: '复制昵称',
    copied: '已复制',
    shuffle: '给我惊喜',
    recommendedTitle: '28种边框与预设',
    recommendedDescription: '先从简短的选项开始,有需要时再调整。',
    usePreset: '使用预设',
    symbolLibraryTitle: '224个符号键盘',
    symbolLibraryDescription: '保持勾选"在光标处",点击符号即可按自己的方式组合昵称。',
    addToLabel: '插入符号到',
    targetCursor: '光标处',
    targetLeft: '左侧',
    targetRight: '右侧',
    targetBoth: '两侧',
    keyboardBackspace: '退格',
    keyboardClearAll: '清空全部',
    selectedSymbol: '已选符号',
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

const targetOptions: SymbolTarget[] = ['cursor', 'both', 'left', 'right'];
const limitCodePoints = (value: string, limit: number): string =>
  Array.from(value).slice(0, limit).join('');

/** Categorical (never PII) description of what a copy action produced, for analytics. */
const copyFieldByActionId: Record<string, string> = {
  preview: 'nickname',
  symbol: 'symbol_text',
  all: 'variant_list',
};

export function NicknameSymbolGeneratorTool({
  locale = 'pt-br',
  initialPlatformId,
}: Readonly<NicknameSymbolGeneratorToolProps>) {
  const ui = uiByLocale[locale];
  const defaultPlatform =
    getNicknameSymbolPlatformById(initialPlatformId ?? '') ?? nicknameSymbolPlatforms[0];
  const defaultFrame = getNicknameFrameById(defaultPlatform?.recommendedFrameIds[0] ?? 'plain');

  const [platformId, setPlatformId] = useState(defaultPlatform?.id ?? 'fortnite');
  const [baseName, setBaseName] = useState('Shadow');
  const [styleId, setStyleId] = useState<NicknameTextStyleId>(
    defaultPlatform?.recommendedStyleId ?? 'original',
  );
  const [leftSymbol, setLeftSymbol] = useState(defaultFrame?.left ?? 'ϟ');
  const [rightSymbol, setRightSymbol] = useState(defaultFrame?.right ?? 'ϟ');
  const [categoryId, setCategoryId] = useState<NicknameSymbolCategoryId>('popular');
  const [symbolTarget, setSymbolTarget] = useState<SymbolTarget>('cursor');
  const [selectedSymbol, setSelectedSymbol] = useState(defaultFrame?.left || 'ϟ');
  const [copiedId, setCopiedId] = useState('');
  const [feedback, setFeedback] = useState('');
  const baseNameInputRef = useRef<HTMLInputElement>(null);
  const activeBaseNameInputRef = useRef<HTMLInputElement | null>(null);
  const baseNameSelectionRef = useRef({ start: 6, end: 6 });
  const hasStartedRef = useRef(false);

  const trackStarted = () => {
    if (hasStartedRef.current) {
      return;
    }
    hasStartedRef.current = true;
    trackEvent('tool_started', { tool: TOOL_ID.nicknameSymbolGenerator, locale });
  };

  const selectedPlatform =
    getNicknameSymbolPlatformById(platformId) ?? nicknameSymbolPlatforms[0];
  const selectedCategory =
    nicknameSymbolCategories.find((category) => category.id === categoryId) ??
    nicknameSymbolCategories[0];

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
        trackEvent('tool_completed', { tool: TOOL_ID.nicknameSymbolGenerator, locale, field });
      }
    } catch {
      setFeedback(ui.error);
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

  const handleKeyboardBackspace = () => {
    const selection = baseNameSelectionRef.current;
    const edit = deleteNicknameTextAtSelection(
      baseName,
      selection.start,
      selection.end,
    );

    setBaseName(edit.value);
    baseNameSelectionRef.current = { start: edit.cursor, end: edit.cursor };
    restoreBaseNameCursor(edit.cursor);
  };

  const clearComposer = () => {
    setBaseName('');
    setLeftSymbol('');
    setRightSymbol('');
    setStyleId('original');
    baseNameSelectionRef.current = { start: 0, end: 0 };
    restoreBaseNameCursor(0);
  };

  const selectPlatform = (nextPlatformId: string) => {
    trackStarted();

    const platform = getNicknameSymbolPlatformById(nextPlatformId);
    if (!platform) {
      return;
    }

    const frame = getNicknameFrameById(platform.recommendedFrameIds[0] ?? 'plain');
    setPlatformId(platform.id);
    setStyleId(platform.recommendedStyleId);
    setLeftSymbol(frame?.left ?? '');
    setRightSymbol(frame?.right ?? '');
    setSelectedSymbol(frame?.left || frame?.right || '★');
    trackEvent('mode_selected', {
      tool: TOOL_ID.nicknameSymbolGenerator,
      locale,
      mode: platform.id,
    });
  };

  const applyFrame = (frameId: string) => {
    trackStarted();

    const frame = getNicknameFrameById(frameId);
    if (!frame) {
      return;
    }

    setLeftSymbol(frame.left);
    setRightSymbol(frame.right);
    setSelectedSymbol(frame.left || frame.right || selectedSymbol);
  };

  const applySymbol = (symbol: string) => {
    trackStarted();
    setSelectedSymbol(symbol);

    if (symbolTarget === 'cursor') {
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
      return;
    }

    if (symbolTarget === 'left' || symbolTarget === 'both') {
      setLeftSymbol(symbol);
    }

    if (symbolTarget === 'right' || symbolTarget === 'both') {
      setRightSymbol(symbol);
    }
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

  const targetLabel = (target: SymbolTarget): string => {
    if (target === 'cursor') {
      return ui.targetCursor;
    }

    if (target === 'left') {
      return ui.targetLeft;
    }

    if (target === 'right') {
      return ui.targetRight;
    }

    return ui.targetBoth;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-200 p-5 md:p-6">
        <p className="text-sm font-semibold text-slate-900">{ui.quickStartLabel}</p>
        <ol className="mt-3 grid grid-cols-3 gap-2">
          {[ui.stepName, ui.stepGame, ui.stepStyle].map((step, index) => (
            <li
              key={step}
              className="flex min-w-0 flex-col items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2.5 text-center sm:flex-row sm:text-left"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="text-[11px] font-semibold leading-4 text-slate-700 sm:text-xs">
                {step}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.nameLabel}</span>
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
              className="min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
            <span id="nickname-editor-hint" className="block text-xs leading-5 text-slate-500">
              {ui.nameHint}
            </span>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.platformLabel}</span>
            <select
              value={platformId}
              onChange={(event) => selectPlatform(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            >
              {nicknameSymbolPlatforms.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
            <span className="block text-xs leading-5 text-slate-500">{ui.platformHint}</span>
          </label>

          <label className="space-y-2">
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
        </div>
      </div>

      <section className="border-b border-slate-200 bg-slate-950 px-5 py-7 text-white md:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
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
              {preview}
            </p>
            <p className="text-xs text-slate-400">
              {countNicknameCharacters(preview)} {ui.characters}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={shufflePreset}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
            >
              <Shuffle className="h-4 w-4" aria-hidden="true" />
              {ui.shuffle}
            </button>
            <button
              type="button"
              onClick={() => copyText(preview, 'preview')}
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
      </section>

      <section className="space-y-4 border-b border-slate-200 p-5 md:p-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{ui.recommendedTitle}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{ui.recommendedDescription}</p>
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0">
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
                className={`min-h-16 min-w-48 shrink-0 rounded-xl border px-3 py-3 text-left transition lg:min-w-0 ${
                  selected
                    ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100'
                    : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                }`}
              >
                <span className="block truncate text-base font-semibold text-slate-900">{value}</span>
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

      <section className="space-y-5 border-b border-slate-200 p-5 md:p-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{ui.symbolLibraryTitle}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{ui.symbolLibraryDescription}</p>
        </div>

        <label className="space-y-2 md:hidden">
          <span className="text-sm font-semibold text-slate-800">{ui.nameLabel}</span>
          <input
            value={baseName}
            onChange={(event) => updateBaseName(event.currentTarget)}
            onFocus={(event) => rememberBaseNameSelection(event.currentTarget)}
            onSelect={(event) => rememberBaseNameSelection(event.currentTarget)}
            onKeyUp={(event) => rememberBaseNameSelection(event.currentTarget)}
            onBlur={(event) => rememberBaseNameSelection(event.currentTarget)}
            placeholder={ui.namePlaceholder}
            aria-describedby="nickname-keyboard-editor-hint"
            autoComplete="off"
            spellCheck={false}
            className="min-h-12 w-full rounded-xl border-2 border-slate-300 px-3 py-2.5 text-lg font-semibold text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
          <span
            id="nickname-keyboard-editor-hint"
            className="block text-xs leading-5 text-slate-500"
          >
            {ui.nameHint}
          </span>
        </label>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {nicknameSymbolCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryId(category.id)}
              aria-pressed={categoryId === category.id}
              className={`min-h-10 shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                categoryId === category.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category.labelByLocale[locale]}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {ui.addToLabel}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {targetOptions.map((target) => (
              <button
                key={target}
                type="button"
                onClick={() => setSymbolTarget(target)}
                aria-pressed={symbolTarget === target}
                className={`min-h-11 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  symbolTarget === target
                    ? 'border-brand-500 bg-brand-50 text-brand-800'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {targetLabel(target)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleKeyboardBackspace}
            className="min-h-11 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
          >
            <span className="mr-2 text-base" aria-hidden="true">
              ⌫
            </span>
            {ui.keyboardBackspace}
          </button>
          <button
            type="button"
            onClick={clearComposer}
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
          >
            {ui.keyboardClearAll}
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-12">
          {selectedCategory?.symbols.map((symbol) => (
            <button
              key={symbol}
              type="button"
              onClick={() => applySymbol(symbol)}
              aria-label={`${ui.addToLabel}: ${symbol}`}
              aria-pressed={selectedSymbol === symbol}
              className={`flex aspect-square min-w-0 items-center justify-center rounded-xl border text-xl transition ${
                selectedSymbol === symbol
                  ? 'border-brand-500 bg-brand-50 text-brand-800 ring-2 ring-brand-100'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-brand-300 hover:bg-slate-50'
              }`}
            >
              {symbol}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-sm text-slate-600">
            {ui.selectedSymbol}: <strong className="ml-1 text-lg text-slate-900">{selectedSymbol}</strong>
          </p>
          <button
            type="button"
            onClick={() => copyText(selectedSymbol, 'symbol')}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            {copiedId === 'symbol' ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
            {copiedId === 'symbol' ? ui.copied : ui.copySymbol}
          </button>
        </div>
      </section>

      <details className="group border-b border-slate-200">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 marker:content-none md:p-6 [&::-webkit-details-marker]:hidden">
          <span>
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
        <div className="grid gap-4 px-5 pb-5 sm:grid-cols-2 md:px-6 md:pb-6">
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

      <section className="space-y-4 p-5 md:p-6">
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

        {feedback ? <p className="text-sm font-medium text-red-600">{feedback}</p> : null}

        <p className="flex items-start gap-2 rounded-xl bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900">
          <Sparkles className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{ui.localNotice}</span>
        </p>
      </section>
    </div>
  );
}
