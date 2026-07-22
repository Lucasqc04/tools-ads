'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, Shuffle, Sparkles } from 'lucide-react';
import {
  buildNicknameSymbolVariants,
  composeSymbolNickname,
  countNicknameCharacters,
  getNicknameFrameById,
  getNicknameSymbolPlatformById,
  nicknameFrameDefinitions,
  nicknameSymbolCategories,
  nicknameSymbolPlatforms,
  nicknameTextStyles,
  type NicknameSymbolCategoryId,
  type NicknameTextStyleId,
} from '@/lib/nickname-symbol-generator';
import type { AppLocale } from '@/lib/i18n/config';

type SymbolTarget = 'left' | 'right' | 'both';

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
  targetLeft: string;
  targetRight: string;
  targetBoth: string;
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
    stepGame: 'Escolha o jogo',
    stepStyle: 'Toque em um estilo',
    platformLabel: 'Jogo ou plataforma',
    platformHint: 'A selecao muda a ordem dos presets e as recomendacoes de teste.',
    nameLabel: 'Nickname base',
    namePlaceholder: 'Ex: Shadow',
    styleLabel: 'Estilo das letras (12)',
    previewTitle: 'Preview personalizado',
    previewDescription: 'Combine os dois lados e confira o tamanho antes de copiar.',
    characters: 'caracteres',
    copyNickname: 'Copiar nickname',
    copied: 'Copiado',
    shuffle: 'Surpreenda-me',
    recommendedTitle: '28 molduras e presets',
    recommendedDescription: 'Comece por opcoes curtas e ajuste depois se precisar.',
    usePreset: 'Usar preset',
    symbolLibraryTitle: '224 simbolos para escolher',
    symbolLibraryDescription: 'Escolha onde adicionar e toque em um simbolo para aplicar no preview.',
    addToLabel: 'Adicionar em',
    targetLeft: 'Esquerda',
    targetRight: 'Direita',
    targetBoth: 'Nos dois lados',
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
    stepGame: 'Choose a game',
    stepStyle: 'Tap a style',
    platformLabel: 'Game or platform',
    platformHint: 'Your selection changes preset order and testing guidance.',
    nameLabel: 'Base nickname',
    namePlaceholder: 'Example: Shadow',
    styleLabel: 'Letter style (12)',
    previewTitle: 'Custom preview',
    previewDescription: 'Combine both sides and check the final length before copying.',
    characters: 'characters',
    copyNickname: 'Copy nickname',
    copied: 'Copied',
    shuffle: 'Surprise me',
    recommendedTitle: '28 frames and presets',
    recommendedDescription: 'Start with short options and customize only when needed.',
    usePreset: 'Use preset',
    symbolLibraryTitle: '224 symbols to choose from',
    symbolLibraryDescription: 'Choose a position, then select a symbol to apply it to the preview.',
    addToLabel: 'Add to',
    targetLeft: 'Left',
    targetRight: 'Right',
    targetBoth: 'Both sides',
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
    stepGame: 'Elige el juego',
    stepStyle: 'Toca un estilo',
    platformLabel: 'Juego o plataforma',
    platformHint: 'La seleccion cambia el orden de presets y las recomendaciones.',
    nameLabel: 'Nickname base',
    namePlaceholder: 'Ejemplo: Shadow',
    styleLabel: 'Estilo de letras (12)',
    previewTitle: 'Preview personalizado',
    previewDescription: 'Combina ambos lados y revisa la longitud antes de copiar.',
    characters: 'caracteres',
    copyNickname: 'Copiar nickname',
    copied: 'Copiado',
    shuffle: 'Sorprendeme',
    recommendedTitle: '28 marcos y presets',
    recommendedDescription: 'Empieza con opciones cortas y personaliza solo si hace falta.',
    usePreset: 'Usar preset',
    symbolLibraryTitle: '224 simbolos para elegir',
    symbolLibraryDescription: 'Elige una posicion y toca un simbolo para aplicarlo al preview.',
    addToLabel: 'Agregar en',
    targetLeft: 'Izquierda',
    targetRight: 'Derecha',
    targetBoth: 'Ambos lados',
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
};

const targetOptions: SymbolTarget[] = ['both', 'left', 'right'];
const limitCodePoints = (value: string, limit: number): string =>
  Array.from(value).slice(0, limit).join('');

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
  const [symbolTarget, setSymbolTarget] = useState<SymbolTarget>('both');
  const [selectedSymbol, setSelectedSymbol] = useState(defaultFrame?.left || 'ϟ');
  const [copiedId, setCopiedId] = useState('');
  const [feedback, setFeedback] = useState('');

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
    } catch {
      setFeedback(ui.error);
    }
  };

  const selectPlatform = (nextPlatformId: string) => {
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
  };

  const applyFrame = (frameId: string) => {
    const frame = getNicknameFrameById(frameId);
    if (!frame) {
      return;
    }

    setLeftSymbol(frame.left);
    setRightSymbol(frame.right);
    setSelectedSymbol(frame.left || frame.right || selectedSymbol);
  };

  const applySymbol = (symbol: string) => {
    setSelectedSymbol(symbol);

    if (symbolTarget === 'left' || symbolTarget === 'both') {
      setLeftSymbol(symbol);
    }

    if (symbolTarget === 'right' || symbolTarget === 'both') {
      setRightSymbol(symbol);
    }
  };

  const shufflePreset = () => {
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
              value={baseName}
              onChange={(event) => setBaseName(event.target.value.slice(0, 48))}
              maxLength={48}
              placeholder={ui.namePlaceholder}
              className="min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
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
              onChange={(event) => setStyleId(event.target.value as NicknameTextStyleId)}
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
            <p className="max-w-full break-all text-3xl font-bold tracking-wide text-white md:text-4xl">
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

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
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
                className={`min-h-16 min-w-0 rounded-xl border px-3 py-3 text-left transition ${
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
          <div className="flex flex-wrap gap-2">
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
              onChange={(event) => setLeftSymbol(limitCodePoints(event.target.value, 8))}
              maxLength={8}
              className="min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-lg text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.rightLabel}</span>
            <input
              value={rightSymbol}
              onChange={(event) => setRightSymbol(limitCodePoints(event.target.value, 8))}
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
