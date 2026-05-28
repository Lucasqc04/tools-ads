'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { type AppLocale } from '@/lib/i18n/config';
import {
  assets,
  convertCryptoAmount,
  getAssetById,
  getDefaultUnitsForAsset,
  resolveUnitSelection,
  type CryptoAssetId,
} from '@/lib/crypto-units';

type CryptoUnitConverterToolProps = Readonly<{
  locale?: AppLocale;
  initialAssetId?: CryptoAssetId;
  initialFromUnitId?: string;
  initialToUnitId?: string;
}>;

const cryptoConverterUi = {
  'pt-br': {
    asset: 'Ativo',
    value: 'Valor',
    valuePlaceholder: 'Ex.: 0.015',
    precision: 'Precisão do ativo:',
    decimalsLabel: 'casas decimais',
    baseUnitSuffix: 'como unidade base',
    sourceUnit: 'Unidade de origem',
    targetUnit: 'Unidade de destino',
    invert: 'Inverter',
    result: 'Resultado',
    copied: 'Copiado',
    copyResult: 'Copiar resultado',
    source: 'Origem:',
    target: 'Destino:',
    conversionMessages: {
      invalidNumber: 'Digite um número válido para converter.',
      invalidUnits: 'Selecione unidades válidas para o ativo escolhido.',
      truncated: 'Resultado muito longo. Exibindo com corte após 18 casas decimais.',
      offchain:
        'Conversão envolve unidade off-chain (Lightning), útil para contexto técnico e não liquidação on-chain direta.',
    },
  },
  en: {
    asset: 'Asset',
    value: 'Amount',
    valuePlaceholder: 'Example: 0.015',
    precision: 'Asset precision:',
    decimalsLabel: 'decimal places',
    baseUnitSuffix: 'as base unit',
    sourceUnit: 'Source unit',
    targetUnit: 'Target unit',
    invert: 'Invert',
    result: 'Result',
    copied: 'Copied',
    copyResult: 'Copy result',
    source: 'Source:',
    target: 'Target:',
    conversionMessages: {
      invalidNumber: 'Enter a valid number to convert.',
      invalidUnits: 'Select valid units for the chosen asset.',
      truncated: 'Result is very long. Display truncated after 18 decimal places.',
      offchain:
        'This conversion includes an off-chain unit (Lightning). Useful for technical context, not direct on-chain settlement.',
    },
  },
  es: {
    asset: 'Activo',
    value: 'Valor',
    valuePlaceholder: 'Ej.: 0.015',
    precision: 'Precisión del activo:',
    decimalsLabel: 'decimales',
    baseUnitSuffix: 'como unidad base',
    sourceUnit: 'Unidad de origen',
    targetUnit: 'Unidad de destino',
    invert: 'Invertir',
    result: 'Resultado',
    copied: 'Copiado',
    copyResult: 'Copiar resultado',
    source: 'Origen:',
    target: 'Destino:',
    conversionMessages: {
      invalidNumber: 'Ingresa un número válido para convertir.',
      invalidUnits: 'Selecciona unidades válidas para el activo elegido.',
      truncated: 'Resultado muy largo. Se muestra truncado después de 18 decimales.',
      offchain:
        'La conversión incluye unidad off-chain (Lightning). Es útil para contexto técnico, no para liquidación on-chain directa.',
    },
  },
} as const;

export function CryptoUnitConverterTool({
  locale = 'pt-br',
  initialAssetId = 'BTC',
  initialFromUnitId,
  initialToUnitId,
}: CryptoUnitConverterToolProps) {
  const ui = cryptoConverterUi[locale];

  const initialSelection = resolveUnitSelection(
    initialAssetId,
    initialFromUnitId,
    initialToUnitId,
  );

  const [assetId, setAssetId] = useState<CryptoAssetId>(initialSelection.assetId);
  const [fromUnitId, setFromUnitId] = useState<string>(initialSelection.from);
  const [toUnitId, setToUnitId] = useState<string>(initialSelection.to);
  const [value, setValue] = useState('1');
  const [copied, setCopied] = useState(false);

  const selectedAsset = useMemo(() => getAssetById(assetId), [assetId]);

  const conversion = useMemo(
    () =>
      convertCryptoAmount({
        value,
        assetId,
        fromUnitId,
        toUnitId,
      }, ui.conversionMessages),
    [assetId, fromUnitId, toUnitId, ui.conversionMessages, value],
  );

  const handleAssetChange = (nextAsset: CryptoAssetId) => {
    const nextDefaults = getDefaultUnitsForAsset(nextAsset);
    setAssetId(nextAsset);
    setFromUnitId(nextDefaults.from);
    setToUnitId(nextDefaults.to);
    setCopied(false);
  };

  const handleInvert = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!conversion.ok) {
      return;
    }

    try {
      await navigator.clipboard.writeText(conversion.raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const fromUnit = selectedAsset.units.find((unit) => unit.id === fromUnitId);
  const toUnit = selectedAsset.units.find((unit) => unit.id === toUnitId);

  const assetOptions = useMemo(
    () =>
      assets.map((asset) => ({
        value: asset.id,
        label: asset.name,
        keywords: [asset.id],
      })),
    [],
  );

  const unitOptions = useMemo(
    () =>
      selectedAsset.units.map((unit) => ({
        value: unit.id,
        label: unit.label,
        keywords: [unit.id, unit.description],
      })),
    [selectedAsset.units],
  );

  return (
    <Card className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.asset}</span>
          <SearchableSelect
            value={assetId}
            onValueChange={(nextValue) => handleAssetChange(nextValue as CryptoAssetId)}
            options={assetOptions}
            searchPlaceholder="Buscar ativo..."
            noResultsText="Nenhum ativo encontrado."
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.value}</span>
          <Input
            inputMode="decimal"
            placeholder={ui.valuePlaceholder}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setCopied(false);
            }}
          />
        </label>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        <p>
          <strong>{ui.precision}</strong> {selectedAsset.decimals} {ui.decimalsLabel}
          ({' '}
          {selectedAsset.units.find((unit) => unit.id === selectedAsset.baseUnitId)?.label ??
            selectedAsset.baseUnitId}{' '}
          {ui.baseUnitSuffix}).
        </p>
      </div>

      <div className="grid items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.sourceUnit}</span>
          <SearchableSelect
            value={fromUnitId}
            onValueChange={setFromUnitId}
            options={unitOptions}
            searchPlaceholder="Buscar unidade de origem..."
            noResultsText="Nenhuma unidade encontrada."
          />
        </label>

        <Button variant="secondary" className="w-full md:w-auto" onClick={handleInvert}>
          {ui.invert}
        </Button>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.targetUnit}</span>
          <SearchableSelect
            value={toUnitId}
            onValueChange={setToUnitId}
            options={unitOptions}
            searchPlaceholder="Buscar unidade de destino..."
            noResultsText="Nenhuma unidade encontrada."
          />
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.result}</p>
        {conversion.ok ? (
          <p className="mt-2 break-all text-2xl font-bold text-slate-900">
            {conversion.display} {toUnit?.label}
          </p>
        ) : (
          <p className="mt-2 text-sm font-medium text-red-700">{conversion.error}</p>
        )}

        {conversion.warning ? (
          <p className="mt-2 text-xs text-amber-700">{conversion.warning}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleCopy} disabled={!conversion.ok}>
            {copied ? ui.copied : ui.copyResult}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
        <p>
          <strong>{ui.source}</strong>{' '}
          {locale === 'pt-br' ? fromUnit?.description : fromUnit?.label}
        </p>
        <p>
          <strong>{ui.target}</strong>{' '}
          {locale === 'pt-br' ? toUnit?.description : toUnit?.label}
        </p>
      </div>
    </Card>
  );
}
