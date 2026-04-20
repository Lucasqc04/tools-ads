'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { generateValidCpfList, type GenerateCpfOptions } from '@/lib/cpf';
import { type AppLocale } from '@/lib/i18n/config';

type CpfGeneratorToolProps = Readonly<{
  locale?: AppLocale;
}>;

type CpfUi = {
  title: string;
  intro: string;
  quantityLabel: string;
  quantityHint: string;
  formatLabel: string;
  formatWith: string;
  formatWithout: string;
  generate: string;
  regenerate: string;
  copyAll: string;
  copiedAll: string;
  clear: string;
  resultTitle: string;
  emptyState: string;
  copiedItem: string;
  copyItem: string;
  generatedCount: (count: number) => string;
  invalidQuantity: string;
  copyError: string;
  localProcessingNote: string;
};

const uiByLocale: Record<AppLocale, CpfUi> = {
  'pt-br': {
    title: 'Criador de CPF válido',
    intro:
      'Gere números de CPF válidos para testes com opção de saída com ou sem pontuação.',
    quantityLabel: 'Quantidade de CPFs',
    quantityHint: 'Escolha de 1 a 100 números por geração.',
    formatLabel: 'Formato da saída',
    formatWith: 'Com pontuação',
    formatWithout: 'Sem pontuação',
    generate: 'Gerar CPFs válidos',
    regenerate: 'Gerar novamente',
    copyAll: 'Copiar todos',
    copiedAll: 'Todos copiados',
    clear: 'Limpar',
    resultTitle: 'Resultado',
    emptyState: 'Nenhum CPF gerado ainda. Clique em gerar para criar uma lista válida.',
    copiedItem: 'Copiado',
    copyItem: 'Copiar',
    generatedCount: (count) => `${count} CPF(s) válido(s) gerado(s).`,
    invalidQuantity: 'Informe uma quantidade entre 1 e 100.',
    copyError: 'Não foi possível copiar agora. Tente novamente.',
    localProcessingNote:
      'A geração acontece localmente no navegador. Nenhum CPF é enviado para servidor.',
  },
  en: {
    title: 'Valid CPF generator',
    intro: 'Generate valid CPF numbers for testing, with or without punctuation output.',
    quantityLabel: 'CPF amount',
    quantityHint: 'Choose from 1 to 100 numbers per generation.',
    formatLabel: 'Output format',
    formatWith: 'With punctuation',
    formatWithout: 'Without punctuation',
    generate: 'Generate valid CPFs',
    regenerate: 'Generate again',
    copyAll: 'Copy all',
    copiedAll: 'All copied',
    clear: 'Clear',
    resultTitle: 'Output',
    emptyState: 'No CPF generated yet. Click generate to create a valid list.',
    copiedItem: 'Copied',
    copyItem: 'Copy',
    generatedCount: (count) => `${count} valid CPF(s) generated.`,
    invalidQuantity: 'Enter a quantity between 1 and 100.',
    copyError: 'Could not copy right now. Please try again.',
    localProcessingNote:
      'Generation runs locally in your browser. No CPF value is sent to a server.',
  },
  es: {
    title: 'Generador de CPF válido',
    intro:
      'Genera números de CPF válidos para pruebas, con salida con o sin puntuación.',
    quantityLabel: 'Cantidad de CPF',
    quantityHint: 'Elige de 1 a 100 números por generación.',
    formatLabel: 'Formato de salida',
    formatWith: 'Con puntuación',
    formatWithout: 'Sin puntuación',
    generate: 'Generar CPF válidos',
    regenerate: 'Generar de nuevo',
    copyAll: 'Copiar todos',
    copiedAll: 'Todos copiados',
    clear: 'Limpiar',
    resultTitle: 'Resultado',
    emptyState: 'Aún no se generó ningún CPF. Haz clic en generar para crear una lista válida.',
    copiedItem: 'Copiado',
    copyItem: 'Copiar',
    generatedCount: (count) => `${count} CPF válido(s) generado(s).`,
    invalidQuantity: 'Ingresa una cantidad entre 1 y 100.',
    copyError: 'No fue posible copiar ahora. Inténtalo de nuevo.',
    localProcessingNote:
      'La generación se realiza localmente en tu navegador. Ningún CPF se envía al servidor.',
  },
};

const parseQuantity = (value: string): number | null => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  const rounded = Math.floor(parsed);

  if (rounded < 1 || rounded > 100) {
    return null;
  }

  return rounded;
};

export function CpfGeneratorTool({ locale = 'pt-br' }: CpfGeneratorToolProps) {
  const ui = uiByLocale[locale];

  const [quantityInput, setQuantityInput] = useState('10');
  const [withPunctuation, setWithPunctuation] = useState(true);
  const [cpfs, setCpfs] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const canCopyAll = cpfs.length > 0;
  const countLabel = useMemo(() => ui.generatedCount(cpfs.length), [cpfs.length, ui]);

  const generateCpfs = () => {
    const quantity = parseQuantity(quantityInput);

    if (quantity === null) {
      setErrorMessage(ui.invalidQuantity);
      setCpfs([]);
      setCopiedAll(false);
      setCopiedIndex(null);
      return;
    }

    const options: GenerateCpfOptions = {
      withPunctuation,
    };

    const generatedList = generateValidCpfList(quantity, options);

    setCpfs(generatedList);
    setErrorMessage('');
    setCopiedAll(false);
    setCopiedIndex(null);
  };

  const handleCopyAll = async () => {
    if (!canCopyAll) {
      return;
    }

    try {
      await navigator.clipboard.writeText(cpfs.join('\n'));
      setCopiedAll(true);
      setCopiedIndex(null);
      setTimeout(() => setCopiedAll(false), 1800);
    } catch {
      setErrorMessage(ui.copyError);
    }
  };

  const handleCopyItem = async (value: string, index: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedAll(false);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1800);
    } catch {
      setErrorMessage(ui.copyError);
    }
  };

  return (
    <Card className="space-y-5">
      <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.quantityLabel}</span>
          <Input
            inputMode="numeric"
            type="number"
            min={1}
            max={100}
            value={quantityInput}
            onChange={(event) => {
              setQuantityInput(event.target.value);
              setErrorMessage('');
            }}
          />
          <span className="text-xs text-slate-500">{ui.quantityHint}</span>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.formatLabel}</span>
          <Select
            value={withPunctuation ? 'with' : 'without'}
            onChange={(event) => {
              setWithPunctuation(event.target.value === 'with');
              setCopiedAll(false);
              setCopiedIndex(null);
            }}
          >
            <option value="with">{ui.formatWith}</option>
            <option value="without">{ui.formatWithout}</option>
          </Select>
        </label>
      </div>

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={generateCpfs}>
          {cpfs.length > 0 ? ui.regenerate : ui.generate}
        </Button>
        <Button variant="secondary" onClick={handleCopyAll} disabled={!canCopyAll}>
          {copiedAll ? ui.copiedAll : ui.copyAll}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setQuantityInput('10');
            setWithPunctuation(true);
            setCpfs([]);
            setErrorMessage('');
            setCopiedAll(false);
            setCopiedIndex(null);
          }}
        >
          {ui.clear}
        </Button>
      </div>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <header className="space-y-1">
          <h4 className="text-sm font-semibold text-slate-800">{ui.resultTitle}</h4>
          <p className="text-xs text-slate-600">{cpfs.length > 0 ? countLabel : ui.emptyState}</p>
        </header>

        {cpfs.length > 0 ? (
          <ul className="space-y-2">
            {cpfs.map((cpf, index) => (
              <li
                key={`${cpf}-${index}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
              >
                <span className="font-mono text-sm text-slate-900">{cpf}</span>
                <Button variant="ghost" className="h-8 px-3 text-xs" onClick={() => handleCopyItem(cpf, index)}>
                  {copiedIndex === index ? ui.copiedItem : ui.copyItem}
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <p className="text-xs text-slate-600">{ui.localProcessingNote}</p>
    </Card>
  );
}
