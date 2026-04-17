'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  assets,
  convertCryptoAmount,
  getAssetById,
  getDefaultUnitsForAsset,
  resolveUnitSelection,
  type CryptoAssetId,
} from '@/lib/crypto-units';

type CryptoUnitConverterToolProps = {
  initialAssetId?: CryptoAssetId;
  initialFromUnitId?: string;
  initialToUnitId?: string;
};

export function CryptoUnitConverterTool({
  initialAssetId = 'BTC',
  initialFromUnitId,
  initialToUnitId,
}: CryptoUnitConverterToolProps) {
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
      }),
    [assetId, fromUnitId, toUnitId, value],
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

  return (
    <Card className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">Ativo</span>
          <Select
            value={assetId}
            onChange={(event) => handleAssetChange(event.target.value as CryptoAssetId)}
          >
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
              </option>
            ))}
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">Valor</span>
          <Input
            inputMode="decimal"
            placeholder="Ex.: 0.015"
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
          <strong>Precisão do ativo:</strong> {selectedAsset.decimals} casas decimais
          ({' '}
          {selectedAsset.units.find((unit) => unit.id === selectedAsset.baseUnitId)?.label ??
            selectedAsset.baseUnitId}{' '}
          como unidade base).
        </p>
      </div>

      <div className="grid items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">Unidade de origem</span>
          <Select value={fromUnitId} onChange={(event) => setFromUnitId(event.target.value)}>
            {selectedAsset.units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.label}
              </option>
            ))}
          </Select>
        </label>

        <Button variant="secondary" className="w-full md:w-auto" onClick={handleInvert}>
          Inverter
        </Button>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">Unidade de destino</span>
          <Select value={toUnitId} onChange={(event) => setToUnitId(event.target.value)}>
            {selectedAsset.units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.label}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Resultado</p>
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
            {copied ? 'Copiado' : 'Copiar resultado'}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
        <p>
          <strong>Origem:</strong> {fromUnit?.description}
        </p>
        <p>
          <strong>Destino:</strong> {toUnit?.description}
        </p>
      </div>
    </Card>
  );
}
