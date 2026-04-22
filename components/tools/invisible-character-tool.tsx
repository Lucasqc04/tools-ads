'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { type AppLocale } from '@/lib/i18n/config';

type InvisibleCharacterToolProps = Readonly<{
  locale?: AppLocale;
  initialPlatformId?: string;
}>;

type GenerationMode = 'combination' | 'character';

type LocaleUi = {
  title: string;
  description: string;
  platformLabel: string;
  platformHint: string;
  modeLabel: string;
  modeCombination: string;
  modeCharacter: string;
  characterTitle: string;
  characterDescription: string;
  characterCodeLabel: string;
  copyCharacter: string;
  useCharacter: string;
  compatibilityLabel: string;
  recommendationLabel: string;
  sizeLabel: string;
  sizeHint: string;
  copyInvisible: string;
  generateInvisibleName: string;
  generatedResult: string;
  generatedHint: string;
  copyGenerated: string;
  copied: string;
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
  gameGroup: string;
  socialGroup: string;
  localNotice: string;
  genericCopyError: string;
  noDetection: string;
};

const uiByLocale: Record<AppLocale, LocaleUi> = {
  'pt-br': {
    title: 'Gerador de Caractere Invisivel para Jogos e Redes Sociais',
    description:
      'Copie, gere e teste nome invisivel com multiplos padroes Unicode. Alguns jogos bloqueiam 1 caractere e aceitam combinacoes com 2, 3 ou 4 invisiveis.',
    platformLabel: 'Plataforma alvo',
    platformHint:
      'As validacoes mudam com atualizacoes. Se um padrao falhar, teste as outras combinacoes da lista.',
    modeLabel: 'Modo do gerador',
    modeCombination: 'Usar combinacao',
    modeCharacter: 'Usar caractere unico',
    characterTitle: 'Caracteres invisiveis individuais',
    characterDescription:
      'Se apenas um tipo especifico passar na sua plataforma, selecione o caractere direto e gere variacoes de tamanho.',
    characterCodeLabel: 'Codigo Unicode',
    copyCharacter: 'Copiar caractere',
    useCharacter: 'Usar este',
    compatibilityLabel: 'Compatibilidade',
    recommendationLabel: 'Padrao recomendado',
    sizeLabel: 'Tamanho do nome invisivel',
    sizeHint: 'Ajuste de 1 a 12 repeticoes do padrao selecionado.',
    copyInvisible: 'Copiar invisivel',
    generateInvisibleName: 'Gerar nome invisivel',
    generatedResult: 'Resultado gerado',
    generatedHint: 'Use copiar e colar direto no campo de nickname da plataforma.',
    copyGenerated: 'Copiar resultado',
    copied: 'Copiado',
    combinationsTitle: 'Combinacoes invisiveis para testar',
    combinationsDescription:
      'Cada plataforma pode aceitar um padrao diferente. Troque rapido entre combinacoes para aumentar a chance de aprovacao.',
    copyCombination: 'Copiar combinacao',
    useCombination: 'Usar no gerador',
    detectorTitle: 'Detector de caracteres invisiveis',
    detectorDescription:
      'Cole um texto para identificar quais caracteres invisiveis estao presentes e seus codigos Unicode.',
    detectorPlaceholder: 'Cole aqui o nome/texto para analisar...',
    detectorEmpty: 'Nenhum texto para analisar ainda.',
    detectorFound: 'caractere(s) invisivel(is) detectado(s)',
    detectorUnknown: 'Nao catalogado',
    gameGroup: 'Jogos online',
    socialGroup: 'Redes sociais',
    localNotice: 'Processamento local no navegador. Nada e enviado para servidor por padrao.',
    genericCopyError: 'Nao foi possivel copiar agora. Tente novamente.',
    noDetection: 'Nenhum caractere invisivel encontrado no texto informado.',
  },
  en: {
    title: 'Invisible Character Generator for Games and Social Platforms',
    description:
      'Copy, generate, and test invisible names with multiple Unicode patterns. Some validators block one character but accept 2, 3, or 4-character combinations.',
    platformLabel: 'Target platform',
    platformHint:
      'Validation changes over time. If one pattern fails, test the other combinations.',
    modeLabel: 'Generator mode',
    modeCombination: 'Use combination',
    modeCharacter: 'Use single character',
    characterTitle: 'Single invisible characters',
    characterDescription:
      'If one specific character works better on your platform, pick it directly and generate size variants.',
    characterCodeLabel: 'Unicode code',
    copyCharacter: 'Copy character',
    useCharacter: 'Use this one',
    compatibilityLabel: 'Compatibility',
    recommendationLabel: 'Recommended pattern',
    sizeLabel: 'Invisible name length',
    sizeHint: 'Adjust from 1 to 12 repetitions of the selected pattern.',
    copyInvisible: 'Copy invisible',
    generateInvisibleName: 'Generate invisible name',
    generatedResult: 'Generated result',
    generatedHint: 'Copy and paste directly into your platform nickname field.',
    copyGenerated: 'Copy result',
    copied: 'Copied',
    combinationsTitle: 'Invisible combinations to test',
    combinationsDescription:
      'Different platforms can accept different patterns. Switch quickly to increase validation success rate.',
    copyCombination: 'Copy combination',
    useCombination: 'Use in generator',
    detectorTitle: 'Invisible character detector',
    detectorDescription:
      'Paste text to identify hidden Unicode characters and inspect their code points.',
    detectorPlaceholder: 'Paste text to inspect...',
    detectorEmpty: 'No text to inspect yet.',
    detectorFound: 'invisible character(s) detected',
    detectorUnknown: 'Unknown catalog',
    gameGroup: 'Online games',
    socialGroup: 'Social networks',
    localNotice: 'Local browser processing. No automatic server upload by default.',
    genericCopyError: 'Could not copy now. Please try again.',
    noDetection: 'No invisible character found in this text.',
  },
  es: {
    title: 'Generador de Caracter Invisible para Juegos y Redes Sociales',
    description:
      'Copia, genera y prueba nombres invisibles con multiples patrones Unicode. Algunas validaciones bloquean 1 caracter y aceptan combinaciones de 2, 3 o 4.',
    platformLabel: 'Plataforma objetivo',
    platformHint:
      'Las validaciones cambian con el tiempo. Si un patron falla, prueba otras combinaciones.',
    modeLabel: 'Modo del generador',
    modeCombination: 'Usar combinacion',
    modeCharacter: 'Usar caracter unico',
    characterTitle: 'Caracteres invisibles individuales',
    characterDescription:
      'Si un caracter especifico pasa mejor en tu plataforma, elige ese y genera variaciones de tamano.',
    characterCodeLabel: 'Codigo Unicode',
    copyCharacter: 'Copiar caracter',
    useCharacter: 'Usar este',
    compatibilityLabel: 'Compatibilidad',
    recommendationLabel: 'Patron recomendado',
    sizeLabel: 'Tamano del nombre invisible',
    sizeHint: 'Ajusta de 1 a 12 repeticiones del patron seleccionado.',
    copyInvisible: 'Copiar invisible',
    generateInvisibleName: 'Generar nombre invisible',
    generatedResult: 'Resultado generado',
    generatedHint: 'Copia y pega directo en el campo de nickname de la plataforma.',
    copyGenerated: 'Copiar resultado',
    copied: 'Copiado',
    combinationsTitle: 'Combinaciones invisibles para probar',
    combinationsDescription:
      'Cada plataforma puede aceptar un patron diferente. Cambia rapido entre combinaciones para mejorar la tasa de exito.',
    copyCombination: 'Copiar combinacion',
    useCombination: 'Usar en el generador',
    detectorTitle: 'Detector de caracteres invisibles',
    detectorDescription:
      'Pega un texto para identificar caracteres invisibles y revisar sus codigos Unicode.',
    detectorPlaceholder: 'Pega aqui el texto para analizar...',
    detectorEmpty: 'Todavia no hay texto para analizar.',
    detectorFound: 'caracter(es) invisible(s) detectado(s)',
    detectorUnknown: 'No catalogado',
    gameGroup: 'Juegos online',
    socialGroup: 'Redes sociales',
    localNotice: 'Procesamiento local en navegador. No se envia al servidor por defecto.',
    genericCopyError: 'No fue posible copiar ahora. Intentalo de nuevo.',
    noDetection: 'No se encontro caracter invisible en el texto.',
  },
};

const getFirstInvisibleUnit = (value: string): string => Array.from(value)[0] ?? value;

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

  const detectorMatches = useMemo(
    () => detectInvisibleCharacters(detectorInput),
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
  }, [selectedPlatform?.id]);

  useEffect(() => {
    if (!generatorUnit) {
      setGeneratedValue('');
      return;
    }

    setGeneratedValue(buildInvisibleNickname(generatorUnit, repeatCount));
  }, [generatorUnit, repeatCount]);

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
    await copyText(getFirstInvisibleUnit(generatorUnit), 'copy-main');
  };

  const handleGenerateFromControls = () => {
    setGeneratedValue(buildInvisibleNickname(generatorUnit, repeatCount));
    setFeedbackMessage('');
  };

  const handleUseCombination = (nextPatternId: string) => {
    const nextPattern = getInvisibleCombinationById(nextPatternId);

    if (!nextPattern) {
      return;
    }

    setPatternId(nextPattern.id);
    setGenerationMode('combination');
    setGeneratedValue(buildInvisibleNickname(nextPattern.value, repeatCount));
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
    setGeneratedValue(buildInvisibleNickname(nextCharacter.value, repeatCount));
    setFeedbackMessage('');
  };

  const compatibilityText = selectedPlatform
    ? compatibilityLabelByLocale[locale][selectedPlatform.compatibility]
    : '';

  let detectorContent = (
    <p className="text-xs text-slate-500">{ui.detectorEmpty}</p>
  );

  if (detectorInput.length > 0 && detectorMatches.length === 0) {
    detectorContent = <p className="text-xs text-slate-600">{ui.noDetection}</p>;
  }

  if (detectorInput.length > 0 && detectorMatches.length > 0) {
    detectorContent = (
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-700">
          {detectorMatches.length} {ui.detectorFound}
        </p>
        <div className="max-h-48 overflow-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[280px] text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-2 py-2 font-semibold">#</th>
                <th className="px-2 py-2 font-semibold">Unicode</th>
                <th className="px-2 py-2 font-semibold">Label</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <Card className="space-y-6 overflow-hidden">
      <div className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-emerald-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.description}</p>
      </div>

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

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {ui.compatibilityLabel}
          </p>
          <p className="text-sm font-medium text-slate-900">{compatibilityText}</p>
          <p className="text-sm text-slate-700">{selectedPlatform?.validationHint[locale]}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {ui.recommendationLabel}
          </p>
          <p className="text-sm font-medium text-slate-900">{selectedPattern?.label}</p>
          <p className="text-xs text-slate-600">{selectedPattern?.description}</p>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-800">{ui.modeLabel}</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={generationMode === 'combination' ? 'primary' : 'secondary'}
            onClick={() => setGenerationMode('combination')}
          >
            {ui.modeCombination}
          </Button>
          <Button
            variant={generationMode === 'character' ? 'primary' : 'secondary'}
            onClick={() => setGenerationMode('character')}
          >
            {ui.modeCharacter}
          </Button>
        </div>
      </div>

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
          {copiedActionId === 'copy-main' ? ui.copied : ui.copyInvisible}
        </Button>
        <Button onClick={handleGenerateFromControls}>{ui.generateInvisibleName}</Button>
      </div>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-semibold text-slate-800">{ui.generatedResult}</h4>
        <p className="min-h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-lg tracking-widest text-slate-900">
          {generatedValue || ' '}
        </p>
        <p className="break-all text-xs text-slate-500">{toUnicodeSequence(generatedValue)}</p>
        <p className="text-xs text-slate-600">{ui.generatedHint}</p>
        <Button
          variant="secondary"
          onClick={() => copyText(generatedValue, 'copy-generated')}
          disabled={!generatedValue}
        >
          {copiedActionId === 'copy-generated' ? ui.copied : ui.copyGenerated}
        </Button>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-800">{ui.characterTitle}</h4>
        <p className="text-xs text-slate-600">{ui.characterDescription}</p>

        <div className="grid gap-3 md:grid-cols-2">
          {invisibleCharacterDefinitions.map((character) => (
            <article
              key={character.id}
              className="space-y-2 rounded-lg border border-slate-200 bg-white p-3"
            >
              <p className="text-sm font-semibold text-slate-900">{character.label}</p>
              <p className="text-xs text-slate-600">
                {ui.characterCodeLabel}: {character.unicode}
              </p>
              <p className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-sm tracking-widest text-slate-800">
                {character.value || ' '}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="h-9 px-3 text-xs"
                  onClick={() => copyText(character.value, `copy-char-${character.id}`)}
                >
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
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-800">{ui.combinationsTitle}</h4>
        <p className="text-xs text-slate-600">{ui.combinationsDescription}</p>

        <div className="grid gap-3 md:grid-cols-2">
          {invisibleCombinationDefinitions.map((combination) => (
            <article
              key={combination.id}
              className="space-y-2 rounded-lg border border-slate-200 bg-white p-3"
            >
              <p className="text-sm font-semibold text-slate-900">{combination.label}</p>
              <p className="text-xs text-slate-600">{combination.description}</p>
              <p className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-sm tracking-widest text-slate-800">
                {combination.value || ' '}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="h-9 px-3 text-xs"
                  onClick={() => copyText(combination.value, `copy-comb-${combination.id}`)}
                >
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
          ))}
        </div>
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-800">{ui.detectorTitle}</h4>
        <p className="text-xs text-slate-600">{ui.detectorDescription}</p>
        <Textarea
          value={detectorInput}
          onChange={(event) => setDetectorInput(event.target.value)}
          placeholder={ui.detectorPlaceholder}
          className="min-h-[110px]"
        />

        {detectorContent}
      </section>

      <p className="text-xs text-slate-600">{ui.localNotice}</p>

      {feedbackMessage ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {feedbackMessage}
        </p>
      ) : null}
    </Card>
  );
}
