'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clipboard,
  Copy,
  EyeOff,
  RotateCcw,
  Search,
  ShieldCheck,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  buildInvisibleNickname,
  compatibilityLabelByLocale,
  detectInvisibleCharacters,
  getInvisibleCombinationById,
  invisibleCharacterDefinitions,
  invisibleCombinationDefinitions,
  invisiblePlatforms,
  toUnicodeSequence,
} from '@/lib/invisible-character';
import { cn } from '@/lib/cn';
import { type AppLocale } from '@/lib/i18n/config';

type InvisibleCharacterToolProps = Readonly<{
  locale?: AppLocale;
  initialPlatformId?: string;
}>;

type GenerationMode = 'combination' | 'character';

type NicknamePlacement = 'only' | 'before' | 'after' | 'between' | 'wrap';

type LocaleUi = {
  title: string;
  description: string;
  fortniteBadge: string;
  platformLabel: string;
  platformHint: string;
  modeLabel: string;
  modeCombination: string;
  modeCharacter: string;
  basePickerLabel: string;
  characterTitle: string;
  characterDescription: string;
  characterCodeLabel: string;
  copyCharacter: string;
  useCharacter: string;
  compatibilityLabel: string;
  recommendationLabel: string;
  quickCopyTitle: string;
  quickCopyDescription: string;
  nicknameLabel: string;
  nicknamePlaceholder: string;
  placementLabel: string;
  placementOnly: string;
  placementBefore: string;
  placementAfter: string;
  placementBetween: string;
  placementWrap: string;
  sizeLabel: string;
  sizeHint: string;
  copyInvisible: string;
  generateInvisibleName: string;
  generatedResult: string;
  generatedHint: string;
  previewLabel: string;
  markedPreviewLabel: string;
  unicodeLabel: string;
  visibleLengthLabel: string;
  invisibleCountLabel: string;
  copyGenerated: string;
  copied: string;
  variantsTitle: string;
  variantsDescription: string;
  variantModeLabel: string;
  copyVariant: string;
  combinationsTitle: string;
  combinationsDescription: string;
  copyCombination: string;
  useCombination: string;
  detectorTitle: string;
  detectorDescription: string;
  detectorPlaceholder: string;
  detectorEmpty: string;
  detectorFound: string;
  detectorUnknown: string;
  cleanedLabel: string;
  copyCleaned: string;
  noDetection: string;
  gameGroup: string;
  socialGroup: string;
  localNotice: string;
  genericCopyError: string;
  clear: string;
  trustedTitle: string;
  trustedCopy: string;
  lengthUnit: string;
  bestForEmpty: string;
  selected: string;
};

const uiByLocale: Record<AppLocale, LocaleUi> = {
  'pt-br': {
    title: 'Gerador de Caractere Invisivel para Jogos e Redes Sociais',
    description:
      'Copie, gere e teste nomes invisiveis com padroes Unicode diferentes. Para Fortnite, teste combinacoes de 2 a 4 caracteres quando um unico invisivel for rejeitado.',
    fortniteBadge: 'Modo Fortnite',
    platformLabel: 'Plataforma alvo',
    platformHint:
      'As validacoes mudam com atualizacoes. Se um padrao falhar, teste as outras combinacoes da lista.',
    modeLabel: 'Base invisivel',
    modeCombination: 'Combinacao recomendada',
    modeCharacter: 'Caractere unico',
    basePickerLabel: 'Escolha o invisivel',
    characterTitle: 'Matriz de caracteres Unicode',
    characterDescription:
      'Compare os caracteres invisiveis, copie um unico codigo ou use no gerador para montar variantes.',
    characterCodeLabel: 'Codigo Unicode',
    copyCharacter: 'Copiar',
    useCharacter: 'Usar',
    compatibilityLabel: 'Compatibilidade',
    recommendationLabel: 'Padrao recomendado',
    quickCopyTitle: 'Copia rapida',
    quickCopyDescription:
      'Use o botao principal para copiar so o invisivel. Use o gerador para montar variantes com um nickname.',
    nicknameLabel: 'Nickname base',
    nicknamePlaceholder: 'Ex: Shadow Player',
    placementLabel: 'Onde inserir',
    placementOnly: 'Somente invisivel',
    placementBefore: 'Antes do nome',
    placementAfter: 'Depois do nome',
    placementBetween: 'Substituir espacos',
    placementWrap: 'Em volta do nome',
    sizeLabel: 'Repeticoes',
    sizeHint: 'Ajuste de 1 a 12 repeticoes do padrao selecionado.',
    copyInvisible: 'Copiar invisivel',
    generateInvisibleName: 'Gerar nome',
    generatedResult: 'Resultado pronto para copiar',
    generatedHint: 'Cole direto no campo de nickname. O preview marcado mostra onde os invisiveis entram.',
    previewLabel: 'Preview real',
    markedPreviewLabel: 'Preview marcado',
    unicodeLabel: 'Sequencia Unicode',
    visibleLengthLabel: 'visiveis',
    invisibleCountLabel: 'invisiveis',
    copyGenerated: 'Copiar resultado',
    copied: 'Copiado',
    variantsTitle: '20 variantes prontas para testar',
    variantsDescription:
      'A lista combina tamanhos e posicoes diferentes para aumentar a chance de passar em filtros de nickname.',
    variantModeLabel: 'Modo',
    copyVariant: 'Copiar variante',
    combinationsTitle: 'Combinacoes invisiveis',
    combinationsDescription:
      'Cada plataforma pode aceitar um padrao diferente. Troque rapido entre combinacoes para aumentar a chance de aprovacao.',
    copyCombination: 'Copiar combinacao',
    useCombination: 'Usar no gerador',
    detectorTitle: 'Detector e removedor de invisiveis',
    detectorDescription:
      'Cole qualquer nickname para identificar caracteres ocultos, ver codigos Unicode e gerar uma versao limpa.',
    detectorPlaceholder: 'Cole aqui o nome/texto para analisar...',
    detectorEmpty: 'Nenhum texto para analisar ainda.',
    detectorFound: 'caractere(s) invisivel(is) detectado(s)',
    detectorUnknown: 'Nao catalogado',
    cleanedLabel: 'Texto sem invisiveis',
    copyCleaned: 'Copiar limpo',
    noDetection: 'Nenhum caractere invisivel encontrado no texto informado.',
    gameGroup: 'Jogos online',
    socialGroup: 'Redes sociais',
    localNotice: 'Processamento local no navegador. Nada e enviado para servidor por padrao.',
    genericCopyError: 'Nao foi possivel copiar agora. Tente novamente.',
    clear: 'Limpar detector',
    trustedTitle: 'Fluxo recomendado',
    trustedCopy:
      'Copie o recomendado, teste no nickname e volte para copiar uma variante se a plataforma normalizar o texto.',
    lengthUnit: 'caracteres',
    bestForEmpty: 'Bom para nick vazio',
    selected: 'Selecionado',
  },
  en: {
    title: 'Invisible Character Generator for Games and Social Platforms',
    description:
      'Copy, generate, and test invisible names with several Unicode patterns. For Fortnite, try 2 to 4-character combinations when a single invisible character is rejected.',
    fortniteBadge: 'Fortnite mode',
    platformLabel: 'Target platform',
    platformHint:
      'Validation changes over time. If one pattern fails, test the other combinations.',
    modeLabel: 'Invisible base',
    modeCombination: 'Recommended combination',
    modeCharacter: 'Single character',
    basePickerLabel: 'Choose invisible value',
    characterTitle: 'Unicode character matrix',
    characterDescription:
      'Compare invisible characters, copy one code point, or load it into the generator to create variants.',
    characterCodeLabel: 'Unicode code',
    copyCharacter: 'Copy',
    useCharacter: 'Use',
    compatibilityLabel: 'Compatibility',
    recommendationLabel: 'Recommended pattern',
    quickCopyTitle: 'Quick copy',
    quickCopyDescription:
      'Use the main button to copy only the invisible sequence. Use the generator to combine it with a nickname.',
    nicknameLabel: 'Base nickname',
    nicknamePlaceholder: 'Example: Shadow Player',
    placementLabel: 'Insert position',
    placementOnly: 'Invisible only',
    placementBefore: 'Before name',
    placementAfter: 'After name',
    placementBetween: 'Replace spaces',
    placementWrap: 'Around name',
    sizeLabel: 'Repetitions',
    sizeHint: 'Adjust from 1 to 12 repetitions of the selected pattern.',
    copyInvisible: 'Copy invisible',
    generateInvisibleName: 'Generate name',
    generatedResult: 'Ready-to-copy result',
    generatedHint: 'Paste directly into the nickname field. The marked preview shows where invisibles are inserted.',
    previewLabel: 'Real preview',
    markedPreviewLabel: 'Marked preview',
    unicodeLabel: 'Unicode sequence',
    visibleLengthLabel: 'visible',
    invisibleCountLabel: 'invisible',
    copyGenerated: 'Copy result',
    copied: 'Copied',
    variantsTitle: '20 ready-to-test variants',
    variantsDescription:
      'The list combines different sizes and positions to improve your chance of passing nickname filters.',
    variantModeLabel: 'Mode',
    copyVariant: 'Copy variant',
    combinationsTitle: 'Invisible combinations',
    combinationsDescription:
      'Different platforms can accept different patterns. Switch quickly to increase validation success rate.',
    copyCombination: 'Copy combination',
    useCombination: 'Use in generator',
    detectorTitle: 'Invisible detector and remover',
    detectorDescription:
      'Paste any nickname to find hidden characters, inspect Unicode codes, and create a cleaned version.',
    detectorPlaceholder: 'Paste text to inspect...',
    detectorEmpty: 'No text to inspect yet.',
    detectorFound: 'invisible character(s) detected',
    detectorUnknown: 'Unknown catalog',
    cleanedLabel: 'Text without invisibles',
    copyCleaned: 'Copy clean',
    noDetection: 'No invisible character found in this text.',
    gameGroup: 'Online games',
    socialGroup: 'Social networks',
    localNotice: 'Local browser processing. No automatic server upload by default.',
    genericCopyError: 'Could not copy now. Please try again.',
    clear: 'Clear detector',
    trustedTitle: 'Recommended flow',
    trustedCopy:
      'Copy the recommended sequence, test it in your nickname, then come back for a variant if the platform normalizes it.',
    lengthUnit: 'characters',
    bestForEmpty: 'Good for blank names',
    selected: 'Selected',
  },
  es: {
    title: 'Generador de Caracter Invisible para Juegos y Redes Sociales',
    description:
      'Copia, genera y prueba nombres invisibles con varios patrones Unicode. Para Fortnite, prueba combinaciones de 2 a 4 caracteres si un solo invisible es rechazado.',
    fortniteBadge: 'Modo Fortnite',
    platformLabel: 'Plataforma objetivo',
    platformHint:
      'Las validaciones cambian con el tiempo. Si un patron falla, prueba otras combinaciones.',
    modeLabel: 'Base invisible',
    modeCombination: 'Combinacion recomendada',
    modeCharacter: 'Caracter unico',
    basePickerLabel: 'Elige el invisible',
    characterTitle: 'Matriz de caracteres Unicode',
    characterDescription:
      'Compara caracteres invisibles, copia un codigo o cargalo en el generador para crear variantes.',
    characterCodeLabel: 'Codigo Unicode',
    copyCharacter: 'Copiar',
    useCharacter: 'Usar',
    compatibilityLabel: 'Compatibilidad',
    recommendationLabel: 'Patron recomendado',
    quickCopyTitle: 'Copia rapida',
    quickCopyDescription:
      'Usa el boton principal para copiar solo la secuencia invisible. Usa el generador para combinarla con un nickname.',
    nicknameLabel: 'Nickname base',
    nicknamePlaceholder: 'Ejemplo: Shadow Player',
    placementLabel: 'Donde insertar',
    placementOnly: 'Solo invisible',
    placementBefore: 'Antes del nombre',
    placementAfter: 'Despues del nombre',
    placementBetween: 'Reemplazar espacios',
    placementWrap: 'Alrededor del nombre',
    sizeLabel: 'Repeticiones',
    sizeHint: 'Ajusta de 1 a 12 repeticiones del patron seleccionado.',
    copyInvisible: 'Copiar invisible',
    generateInvisibleName: 'Generar nombre',
    generatedResult: 'Resultado listo para copiar',
    generatedHint: 'Pegalo directo en el campo de nickname. La vista marcada muestra donde entran los invisibles.',
    previewLabel: 'Vista real',
    markedPreviewLabel: 'Vista marcada',
    unicodeLabel: 'Secuencia Unicode',
    visibleLengthLabel: 'visibles',
    invisibleCountLabel: 'invisibles',
    copyGenerated: 'Copiar resultado',
    copied: 'Copiado',
    variantsTitle: '20 variantes listas para probar',
    variantsDescription:
      'La lista combina tamanos y posiciones diferentes para mejorar la probabilidad de pasar filtros de nickname.',
    variantModeLabel: 'Modo',
    copyVariant: 'Copiar variante',
    combinationsTitle: 'Combinaciones invisibles',
    combinationsDescription:
      'Cada plataforma puede aceptar un patron diferente. Cambia rapido entre combinaciones para mejorar la tasa de exito.',
    copyCombination: 'Copiar combinacion',
    useCombination: 'Usar en el generador',
    detectorTitle: 'Detector y removedor de invisibles',
    detectorDescription:
      'Pega cualquier nickname para encontrar caracteres ocultos, revisar codigos Unicode y crear una version limpia.',
    detectorPlaceholder: 'Pega aqui el texto para analizar...',
    detectorEmpty: 'Todavia no hay texto para analizar.',
    detectorFound: 'caracter(es) invisible(s) detectado(s)',
    detectorUnknown: 'No catalogado',
    cleanedLabel: 'Texto sin invisibles',
    copyCleaned: 'Copiar limpio',
    noDetection: 'No se encontro caracter invisible en el texto.',
    gameGroup: 'Juegos online',
    socialGroup: 'Redes sociales',
    localNotice: 'Procesamiento local en navegador. No se envia al servidor por defecto.',
    genericCopyError: 'No fue posible copiar ahora. Intentalo de nuevo.',
    clear: 'Limpiar detector',
    trustedTitle: 'Flujo recomendado',
    trustedCopy:
      'Copia la secuencia recomendada, pruebala en tu nickname y vuelve por una variante si la plataforma normaliza el texto.',
    lengthUnit: 'caracteres',
    bestForEmpty: 'Bueno para nick vacio',
    selected: 'Seleccionado',
  },
};

const placementOrder: NicknamePlacement[] = ['only', 'before', 'after', 'between', 'wrap'];

const getPlacementLabel = (ui: LocaleUi, placement: NicknamePlacement): string => {
  const labels: Record<NicknamePlacement, string> = {
    only: ui.placementOnly,
    before: ui.placementBefore,
    after: ui.placementAfter,
    between: ui.placementBetween,
    wrap: ui.placementWrap,
  };

  return labels[placement];
};

const insertInMiddle = (value: string, insert: string): string => {
  const chars = Array.from(value);
  const index = Math.max(1, Math.floor(chars.length / 2));

  return `${chars.slice(0, index).join('')}${insert}${chars.slice(index).join('')}`;
};

const composeNickname = (
  nickname: string,
  invisibleValue: string,
  placement: NicknamePlacement,
): string => {
  const trimmed = nickname.trim();

  if (placement === 'only' || !trimmed) {
    return invisibleValue;
  }

  if (placement === 'before') {
    return `${invisibleValue}${trimmed}`;
  }

  if (placement === 'after') {
    return `${trimmed}${invisibleValue}`;
  }

  if (placement === 'wrap') {
    return `${invisibleValue}${trimmed}${invisibleValue}`;
  }

  if (/\s/.test(trimmed)) {
    return trimmed.replace(/\s+/g, invisibleValue);
  }

  return insertInMiddle(trimmed, invisibleValue);
};

const removeDetectedInvisibleCharacters = (value: string): string => {
  const matchIndexes = new Set(detectInvisibleCharacters(value).map((match) => match.index));

  return Array.from(value)
    .filter((_, index) => !matchIndexes.has(index))
    .join('');
};

const countVisibleCharacters = (value: string): number =>
  Math.max(0, Array.from(value).length - detectInvisibleCharacters(value).length);

const renderMarkedPreview = (value: string) => {
  const invisibleByIndex = new Map(
    detectInvisibleCharacters(value).map((match) => [match.index, match]),
  );
  const chars = Array.from(value);

  if (!chars.length) {
    return ' ';
  }

  return chars.map((char, index) => {
    const invisible = invisibleByIndex.get(index);

    if (invisible) {
      return (
        <span
          key={`${invisible.unicode}-${index}`}
          className="mx-0.5 inline-flex items-center rounded border border-amber-300 bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-800"
          title={invisible.label}
        >
          {invisible.unicode}
        </span>
      );
    }

    if (char === ' ') {
      return (
        <span
          key={`space-${index}`}
          className="mx-0.5 inline-flex items-center rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600"
        >
          space
        </span>
      );
    }

    return <span key={`${char}-${index}`}>{char}</span>;
  });
};

export function InvisibleCharacterTool({
  locale = 'pt-br',
  initialPlatformId,
}: InvisibleCharacterToolProps) {
  const ui = uiByLocale[locale];

  const defaultPlatformId =
    initialPlatformId && invisiblePlatforms.some((platform) => platform.id === initialPlatformId)
      ? initialPlatformId
      : invisiblePlatforms[0]?.id;

  const [platformId, setPlatformId] = useState(defaultPlatformId ?? 'free-fire');
  const [generationMode, setGenerationMode] = useState<GenerationMode>('combination');
  const [patternId, setPatternId] = useState(invisibleCombinationDefinitions[0]?.id ?? '');
  const [characterId, setCharacterId] = useState(invisibleCharacterDefinitions[0]?.id ?? '');
  const [repeatCount, setRepeatCount] = useState(2);
  const [nicknameInput, setNicknameInput] = useState('');
  const [placement, setPlacement] = useState<NicknamePlacement>('only');
  const [generatedValue, setGeneratedValue] = useState('');
  const [detectorInput, setDetectorInput] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [copiedActionId, setCopiedActionId] = useState('');

  const selectedPlatform = useMemo(
    () => invisiblePlatforms.find((platform) => platform.id === platformId) ?? invisiblePlatforms[0],
    [platformId],
  );

  const selectedPattern = useMemo(
    () => invisibleCombinationDefinitions.find((pattern) => pattern.id === patternId),
    [patternId],
  );

  const selectedCharacter = useMemo(
    () => invisibleCharacterDefinitions.find((character) => character.id === characterId),
    [characterId],
  );

  const generatorUnit = useMemo(() => {
    if (generationMode === 'character') {
      return selectedCharacter?.value ?? '';
    }

    return selectedPattern?.value ?? '';
  }, [generationMode, selectedCharacter?.value, selectedPattern?.value]);

  const invisibleBase = useMemo(
    () => buildInvisibleNickname(generatorUnit, repeatCount),
    [generatorUnit, repeatCount],
  );

  const computedGeneratedValue = useMemo(
    () => composeNickname(nicknameInput, invisibleBase, placement),
    [invisibleBase, nicknameInput, placement],
  );

  const detectorMatches = useMemo(
    () => detectInvisibleCharacters(detectorInput),
    [detectorInput],
  );

  const cleanedDetectorInput = useMemo(
    () => removeDetectedInvisibleCharacters(detectorInput),
    [detectorInput],
  );

  const gamePlatforms = useMemo(
    () => invisiblePlatforms.filter((platform) => platform.category === 'game'),
    [],
  );

  const socialPlatforms = useMemo(
    () => invisiblePlatforms.filter((platform) => platform.category === 'social'),
    [],
  );

  const variantBaseName = nicknameInput.trim() || selectedPlatform?.name || 'Player';

  const generatedVariants = useMemo(() => {
    const combinations = invisibleCombinationDefinitions.slice(0, 4);

    return combinations.flatMap((combination) =>
      placementOrder.map((variantPlacement, placementIndex) => {
        const repeat = (placementIndex % 4) + 1;
        const invisibleValue = buildInvisibleNickname(combination.value, repeat);

        return {
          id: `${combination.id}-${variantPlacement}-${repeat}`,
          value: composeNickname(variantBaseName, invisibleValue, variantPlacement),
          unicode: toUnicodeSequence(invisibleValue),
          label: combination.label,
          placement: variantPlacement,
          repeat,
        };
      }),
    );
  }, [variantBaseName]);

  useEffect(() => {
    if (!selectedPlatform) {
      return;
    }

    const recommended = getInvisibleCombinationById(selectedPlatform.recommendedCombinationId);
    const fallback = invisibleCombinationDefinitions[0];
    const nextPattern = recommended ?? fallback;

    if (!nextPattern) {
      return;
    }

    setPatternId(nextPattern.id);
    setCharacterId(nextPattern.characterIds[0] ?? invisibleCharacterDefinitions[0]?.id ?? '');
    setFeedbackMessage('');
  }, [selectedPlatform]);

  useEffect(() => {
    setGeneratedValue(computedGeneratedValue);
  }, [computedGeneratedValue]);

  useEffect(() => {
    if (!initialPlatformId) {
      return;
    }

    if (!invisiblePlatforms.some((platform) => platform.id === initialPlatformId)) {
      return;
    }

    setPlatformId(initialPlatformId);
  }, [initialPlatformId]);

  const copyText = async (value: string, actionId: string) => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setFeedbackMessage('');
      setCopiedActionId(actionId);
      globalThis.setTimeout(() => {
        setCopiedActionId((current) => (current === actionId ? '' : current));
      }, 1600);
    } catch {
      setFeedbackMessage(ui.genericCopyError);
    }
  };

  const handleCopySingleInvisible = async () => {
    await copyText(invisibleBase, 'copy-main');
  };

  const handleGenerateFromControls = () => {
    setGeneratedValue(computedGeneratedValue);
    setFeedbackMessage('');
  };

  const handleUseCombination = (nextPatternId: string) => {
    const nextPattern = getInvisibleCombinationById(nextPatternId);

    if (!nextPattern) {
      return;
    }

    setPatternId(nextPattern.id);
    setGenerationMode('combination');
    setGeneratedValue(composeNickname(nicknameInput, buildInvisibleNickname(nextPattern.value, repeatCount), placement));
    setFeedbackMessage('');
  };

  const handleUseCharacter = (nextCharacterId: string) => {
    const nextCharacter = invisibleCharacterDefinitions.find(
      (character) => character.id === nextCharacterId,
    );

    if (!nextCharacter) {
      return;
    }

    setCharacterId(nextCharacter.id);
    setGenerationMode('character');
    setGeneratedValue(composeNickname(nicknameInput, buildInvisibleNickname(nextCharacter.value, repeatCount), placement));
    setFeedbackMessage('');
  };

  const compatibilityText = selectedPlatform
    ? compatibilityLabelByLocale[locale][selectedPlatform.compatibility]
    : '';

  const generatedInvisibleCount = detectInvisibleCharacters(generatedValue).length;
  const generatedVisibleCount = countVisibleCharacters(generatedValue);
  const isFortnite = selectedPlatform?.id === 'fortnite';

  let detectorContent = (
    <p className="text-xs text-slate-500">{ui.detectorEmpty}</p>
  );

  if (detectorInput.length > 0 && detectorMatches.length === 0) {
    detectorContent = <p className="text-xs text-slate-600">{ui.noDetection}</p>;
  }

  if (detectorInput.length > 0 && detectorMatches.length > 0) {
    detectorContent = (
      <div className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-[11px] font-semibold uppercase text-slate-500">{ui.invisibleCountLabel}</p>
            <p className="text-lg font-bold text-slate-900">{detectorMatches.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-[11px] font-semibold uppercase text-slate-500">{ui.visibleLengthLabel}</p>
            <p className="text-lg font-bold text-slate-900">{countVisibleCharacters(detectorInput)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-[11px] font-semibold uppercase text-slate-500">{ui.lengthUnit}</p>
            <p className="text-lg font-bold text-slate-900">{Array.from(detectorInput).length}</p>
          </div>
        </div>

        <p className="text-xs font-medium text-slate-700">
          {detectorMatches.length} {ui.detectorFound}
        </p>
        <div className="max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[360px] text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-2 py-2 font-semibold">#</th>
                <th className="px-2 py-2 font-semibold">Unicode</th>
                <th className="px-2 py-2 font-semibold">Label</th>
                <th className="px-2 py-2 font-semibold">Group</th>
              </tr>
            </thead>
            <tbody>
              {detectorMatches.map((match) => (
                <tr key={`${match.index}-${match.unicode}`} className="border-t border-slate-100">
                  <td className="px-2 py-1 text-slate-700">{match.index}</td>
                  <td className="px-2 py-1 font-mono text-slate-800">{match.unicode}</td>
                  <td className="px-2 py-1 text-slate-700">
                    {match.group === 'unknown' ? ui.detectorUnknown : match.label}
                  </td>
                  <td className="px-2 py-1 text-slate-500">{match.group}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800">{ui.cleanedLabel}</p>
            <Button
              variant="secondary"
              className="h-8 px-3 text-xs"
              onClick={() => copyText(cleanedDetectorInput, 'copy-cleaned')}
            >
              <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              {copiedActionId === 'copy-cleaned' ? ui.copied : ui.copyCleaned}
            </Button>
          </div>
          <p className="mt-2 min-h-9 break-all rounded border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm text-slate-800">
            {cleanedDetectorInput || ' '}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="space-y-6 overflow-hidden">
      <div className="rounded-xl border border-slate-200 bg-slate-950 p-4 text-white">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-200">
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            {isFortnite ? ui.fortniteBadge : selectedPlatform?.name}
          </span>
          <span className="inline-flex items-center rounded-full bg-sky-400/15 px-2.5 py-1 text-xs font-semibold text-sky-200">
            <EyeOff className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            {compatibilityText}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-white">{ui.title}</h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">{ui.description}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="space-y-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.platformLabel}</span>
            <Select
              value={platformId}
              onChange={(event) => setPlatformId(event.target.value)}
            >
              <optgroup label={ui.gameGroup}>
                {gamePlatforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label={ui.socialGroup}>
                {socialPlatforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </optgroup>
            </Select>
            <p className="text-xs text-slate-600">{ui.platformHint}</p>
          </label>

          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase text-slate-500">
                {ui.compatibilityLabel}
              </p>
              <p className="text-sm font-semibold text-slate-900">{compatibilityText}</p>
              <p className="text-sm text-slate-700">{selectedPlatform?.validationHint[locale]}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase text-slate-500">
                {ui.recommendationLabel}
              </p>
              <p className="text-sm font-semibold text-slate-900">{selectedPattern?.label}</p>
              <p className="text-xs text-slate-600">{selectedPattern?.description}</p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-emerald-950">{ui.trustedTitle}</p>
                <p className="mt-1 text-sm leading-5 text-emerald-900">{ui.trustedCopy}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <div>
            <p className="text-base font-semibold text-slate-900">{ui.quickCopyTitle}</p>
            <p className="mt-1 text-sm text-slate-600">{ui.quickCopyDescription}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.modeLabel}</span>
              <Select
                value={generationMode}
                onChange={(event) => setGenerationMode(event.target.value as GenerationMode)}
              >
                <option value="combination">{ui.modeCombination}</option>
                <option value="character">{ui.modeCharacter}</option>
              </Select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.placementLabel}</span>
              <Select
                value={placement}
                onChange={(event) => setPlacement(event.target.value as NicknamePlacement)}
              >
                {placementOrder.map((item) => (
                  <option key={item} value={item}>
                    {getPlacementLabel(ui, item)}
                  </option>
                ))}
              </Select>
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.basePickerLabel}</span>
            {generationMode === 'combination' ? (
              <Select
                value={patternId}
                onChange={(event) => handleUseCombination(event.target.value)}
              >
                {invisibleCombinationDefinitions.map((combination) => (
                  <option key={combination.id} value={combination.id}>
                    {combination.label} - {toUnicodeSequence(combination.value)}
                  </option>
                ))}
              </Select>
            ) : (
              <Select
                value={characterId}
                onChange={(event) => handleUseCharacter(event.target.value)}
              >
                {invisibleCharacterDefinitions.map((character) => (
                  <option key={character.id} value={character.id}>
                    {character.label} - {character.unicode}
                  </option>
                ))}
              </Select>
            )}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.nicknameLabel}</span>
            <Input
              value={nicknameInput}
              onChange={(event) => setNicknameInput(event.target.value)}
              placeholder={ui.nicknamePlaceholder}
              maxLength={40}
            />
          </label>

          <label className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-800">{ui.sizeLabel}</span>
              <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                {repeatCount}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={repeatCount}
              onChange={(event) => setRepeatCount(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
            />
            <span className="text-xs text-slate-500">{ui.sizeHint}</span>
          </label>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleCopySingleInvisible}>
              <Clipboard className="mr-2 h-4 w-4" aria-hidden="true" />
              {copiedActionId === 'copy-main' ? ui.copied : ui.copyInvisible}
            </Button>
            <Button onClick={handleGenerateFromControls}>
              <Wand2 className="mr-2 h-4 w-4" aria-hidden="true" />
              {ui.generateInvisibleName}
            </Button>
          </div>
        </section>
      </div>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-800">{ui.generatedResult}</h4>
            <p className="mt-1 text-xs text-slate-600">{ui.generatedHint}</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => copyText(generatedValue, 'copy-generated')}
            disabled={!generatedValue}
          >
            <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
            {copiedActionId === 'copy-generated' ? ui.copied : ui.copyGenerated}
          </Button>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-[11px] font-semibold uppercase text-slate-500">{ui.previewLabel}</p>
            <p className="mt-2 min-h-12 break-all rounded-md bg-slate-50 px-3 py-2 text-xl tracking-widest text-slate-950">
              {generatedValue || ' '}
            </p>
            <p className="mt-3 text-[11px] font-semibold uppercase text-slate-500">{ui.markedPreviewLabel}</p>
            <div className="mt-2 min-h-12 break-all rounded-md border border-dashed border-amber-200 bg-amber-50/40 px-3 py-2 text-lg text-slate-950">
              {renderMarkedPreview(generatedValue)}
            </div>
            <p className="mt-2 break-all font-mono text-xs text-slate-500">
              {ui.unicodeLabel}: {toUnicodeSequence(generatedValue)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] font-semibold uppercase text-slate-500">{ui.visibleLengthLabel}</p>
              <p className="text-xl font-bold text-slate-900">{generatedVisibleCount}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] font-semibold uppercase text-slate-500">{ui.invisibleCountLabel}</p>
              <p className="text-xl font-bold text-slate-900">{generatedInvisibleCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">{ui.variantsTitle}</h4>
          <p className="mt-1 text-xs text-slate-600">{ui.variantsDescription}</p>
        </div>

        <div className="grid gap-2 lg:grid-cols-2">
          {generatedVariants.map((variant) => (
            <article
              key={variant.id}
              className="rounded-lg border border-slate-200 bg-white p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{variant.label}</p>
                  <p className="text-xs text-slate-500">
                    {ui.variantModeLabel}: {getPlacementLabel(ui, variant.placement)} · {variant.repeat}x
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="h-8 px-3 text-xs"
                  onClick={() => copyText(variant.value, `copy-variant-${variant.id}`)}
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  {copiedActionId === `copy-variant-${variant.id}` ? ui.copied : ui.copyVariant}
                </Button>
              </div>
              <div className="mt-2 min-h-9 break-all rounded border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm tracking-wide text-slate-900">
                {renderMarkedPreview(variant.value)}
              </div>
              <p className="mt-1 break-all font-mono text-[11px] text-slate-500">{variant.unicode}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-800">{ui.characterTitle}</h4>
        <p className="text-xs text-slate-600">{ui.characterDescription}</p>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {invisibleCharacterDefinitions.map((character) => {
            const isSelected = generationMode === 'character' && character.id === characterId;

            return (
              <article
                key={character.id}
                className={cn(
                  'space-y-2 rounded-lg border bg-white p-3',
                  isSelected ? 'border-brand-300 ring-2 ring-brand-100' : 'border-slate-200',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{character.label}</p>
                    <p className="text-xs text-slate-600">
                      {ui.characterCodeLabel}: {character.unicode}
                    </p>
                  </div>
                  {isSelected ? (
                    <span className="rounded-full bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-700">
                      {ui.selected}
                    </span>
                  ) : null}
                </div>
                <p className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-sm tracking-widest text-slate-800">
                  {character.value || ' '}
                </p>
                <p className="text-xs text-slate-500">
                  {character.bestForEmptyNick ? ui.bestForEmpty : character.group}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    className="h-9 px-3 text-xs"
                    onClick={() => copyText(character.value, `copy-char-${character.id}`)}
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    {copiedActionId === `copy-char-${character.id}` ? ui.copied : ui.copyCharacter}
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-9 px-3 text-xs"
                    onClick={() => handleUseCharacter(character.id)}
                  >
                    {ui.useCharacter}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-800">{ui.combinationsTitle}</h4>
        <p className="text-xs text-slate-600">{ui.combinationsDescription}</p>

        <div className="grid gap-3 md:grid-cols-2">
          {invisibleCombinationDefinitions.map((combination) => {
            const isSelected = generationMode === 'combination' && combination.id === patternId;

            return (
              <article
                key={combination.id}
                className={cn(
                  'space-y-2 rounded-lg border bg-white p-3',
                  isSelected ? 'border-brand-300 ring-2 ring-brand-100' : 'border-slate-200',
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{combination.label}</p>
                    <p className="text-xs text-slate-600">{combination.description}</p>
                  </div>
                  {isSelected ? (
                    <span className="rounded-full bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-700">
                      {ui.selected}
                    </span>
                  ) : null}
                </div>
                <p className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-sm tracking-widest text-slate-800">
                  {combination.value || ' '}
                </p>
                <p className="break-all font-mono text-[11px] text-slate-500">
                  {toUnicodeSequence(combination.value)}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    className="h-9 px-3 text-xs"
                    onClick={() => copyText(combination.value, `copy-comb-${combination.id}`)}
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    {copiedActionId === `copy-comb-${combination.id}`
                      ? ui.copied
                      : ui.copyCombination}
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-9 px-3 text-xs"
                    onClick={() => handleUseCombination(combination.id)}
                  >
                    {ui.useCombination}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-2">
          <Search className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
          <div>
            <h4 className="text-sm font-semibold text-slate-800">{ui.detectorTitle}</h4>
            <p className="mt-1 text-xs text-slate-600">{ui.detectorDescription}</p>
          </div>
        </div>
        <Textarea
          value={detectorInput}
          onChange={(event) => setDetectorInput(event.target.value)}
          placeholder={ui.detectorPlaceholder}
          className="min-h-[110px]"
        />

        {detectorContent}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <p className="text-xs text-slate-600">{ui.localNotice}</p>
        <Button
          variant="ghost"
          className="h-8 px-3 text-xs"
          onClick={() => {
            setDetectorInput('');
            setFeedbackMessage('');
          }}
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
          {ui.clear}
        </Button>
      </div>

      {feedbackMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {feedbackMessage}
        </p>
      ) : null}
    </Card>
  );
}
