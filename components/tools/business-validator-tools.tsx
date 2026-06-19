'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatCnpj, generateValidCnpjList, isValidCnpj, stripCnpjFormatting } from '@/lib/cnpj';
import { parseBoleto, type BoletoParseResult } from '@/lib/boleto';
import type { AppLocale } from '@/lib/i18n/config';

type CopyState = 'idle' | 'copied' | 'error';

const copyText = async (value: string, setState: (state: CopyState) => void) => {
  try {
    await navigator.clipboard.writeText(value);
    setState('copied');
    setTimeout(() => setState('idle'), 1600);
  } catch {
    setState('error');
    setTimeout(() => setState('idle'), 2200);
  }
};

const downloadText = (content: string, fileName: string, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

function ToolHeader({ title, intro }: Readonly<{ title: string; intro: string }>) {
  return (
    <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-700">{intro}</p>
    </header>
  );
}

function ResultBox({ children }: Readonly<{ children: ReactNode }>) {
  return <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">{children}</section>;
}

const cnpjUi = {
  'pt-br': {
    title: 'Validador e gerador de CNPJ',
    intro: 'Valide CNPJ, gere listas para testes e exporte TXT, CSV ou JSON.',
    validatorTitle: 'Validar CNPJ',
    validatorPlaceholder: '00.000.000/0001-00',
    validate: 'Validar',
    valid: 'CNPJ valido',
    invalid: 'CNPJ invalido',
    formatted: 'Formatado',
    digits: 'Somente numeros',
    generatorTitle: 'Gerar CNPJs',
    quantity: 'Quantidade',
    branch: 'Filial',
    branchHint: 'Use 0001 para matriz ou informe outro codigo de filial.',
    withMask: 'Com pontuacao',
    withoutMask: 'Sem pontuacao',
    generate: 'Gerar',
    copy: 'Copiar',
    copyAll: 'Copiar todos',
    copyItem: 'Copiar',
    copied: 'Copiado',
    copiedAll: 'Tudo copiado',
    copiedItem: 'Copiado',
    exportTxt: 'TXT',
    exportCsv: 'CSV',
    exportJson: 'JSON',
    clear: 'Limpar',
    resultTitle: 'Resultado',
    generatedCount: 'CNPJ(s) valido(s) gerado(s).',
    invalidQuantity: 'Informe uma quantidade entre 1 e 200.',
    copyError: 'Nao foi possivel copiar.',
    localProcessingNote: 'A geracao acontece localmente no navegador. Nenhum CNPJ e enviado para servidor.',
    empty: 'Gere CNPJs para visualizar a lista.',
  },
  en: {
    title: 'CNPJ validator and generator',
    intro: 'Validate Brazilian CNPJ numbers, generate test lists, and export TXT, CSV, or JSON.',
    validatorTitle: 'Validate CNPJ',
    validatorPlaceholder: '00.000.000/0001-00',
    validate: 'Validate',
    valid: 'Valid CNPJ',
    invalid: 'Invalid CNPJ',
    formatted: 'Formatted',
    digits: 'Digits only',
    generatorTitle: 'Generate CNPJs',
    quantity: 'Amount',
    branch: 'Branch',
    branchHint: 'Use 0001 for headquarters or enter another branch code.',
    withMask: 'With punctuation',
    withoutMask: 'Without punctuation',
    generate: 'Generate',
    copy: 'Copy',
    copyAll: 'Copy all',
    copyItem: 'Copy',
    copied: 'Copied',
    copiedAll: 'All copied',
    copiedItem: 'Copied',
    exportTxt: 'TXT',
    exportCsv: 'CSV',
    exportJson: 'JSON',
    clear: 'Clear',
    resultTitle: 'Result',
    generatedCount: 'valid CNPJ(s) generated.',
    invalidQuantity: 'Enter an amount between 1 and 200.',
    copyError: 'Could not copy.',
    localProcessingNote: 'Generation runs locally in your browser. No CNPJ is sent to a server.',
    empty: 'Generate CNPJs to view the list.',
  },
  es: {
    title: 'Validador y generador de CNPJ',
    intro: 'Valida CNPJ brasileños, genera listas de prueba y exporta TXT, CSV o JSON.',
    validatorTitle: 'Validar CNPJ',
    validatorPlaceholder: '00.000.000/0001-00',
    validate: 'Validar',
    valid: 'CNPJ valido',
    invalid: 'CNPJ invalido',
    formatted: 'Formateado',
    digits: 'Solo numeros',
    generatorTitle: 'Generar CNPJ',
    quantity: 'Cantidad',
    branch: 'Sucursal',
    branchHint: 'Usa 0001 para matriz o informa otro codigo de sucursal.',
    withMask: 'Con puntuacion',
    withoutMask: 'Sin puntuacion',
    generate: 'Generar',
    copy: 'Copiar',
    copyAll: 'Copiar todos',
    copyItem: 'Copiar',
    copied: 'Copiado',
    copiedAll: 'Todo copiado',
    copiedItem: 'Copiado',
    exportTxt: 'TXT',
    exportCsv: 'CSV',
    exportJson: 'JSON',
    clear: 'Limpiar',
    resultTitle: 'Resultado',
    generatedCount: 'CNPJ valido(s) generado(s).',
    invalidQuantity: 'Informa una cantidad entre 1 y 200.',
    copyError: 'No fue posible copiar.',
    localProcessingNote: 'La generacion se realiza localmente en tu navegador. Ningun CNPJ se envia al servidor.',
    empty: 'Genera CNPJ para ver la lista.',
  },
} satisfies Record<AppLocale, Record<string, string>>;

export function CnpjValidatorGeneratorTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = cnpjUi[locale];
  const [value, setValue] = useState('');
  const [quantity, setQuantity] = useState('10');
  const [branch, setBranch] = useState('0001');
  const [withPunctuation, setWithPunctuation] = useState(true);
  const [generated, setGenerated] = useState<string[]>([]);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const clean = stripCnpjFormatting(value);
  const hasValidation = clean.length > 0;
  const valid = isValidCnpj(value);
  const generatedText = generated.join('\n');

  const handleGenerate = () => {
    const parsedQuantity = Number.parseInt(quantity, 10);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 200) {
      setErrorMessage(ui.invalidQuantity);
      setGenerated([]);
      setCopyState('idle');
      setCopiedIndex(null);
      return;
    }

    const amount = Math.max(1, Math.min(200, parsedQuantity));
    setGenerated(generateValidCnpjList(amount, { withPunctuation, branchCode: branch }));
    setCopyState('idle');
    setCopiedIndex(null);
    setErrorMessage('');
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopyState('copied');
      setCopiedIndex(null);
      setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setErrorMessage(ui.copyError);
    }
  };

  const handleCopyItem = async (item: string, index: number) => {
    try {
      await navigator.clipboard.writeText(item);
      setCopyState('idle');
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1800);
    } catch {
      setErrorMessage(ui.copyError);
    }
  };

  const csv = useMemo(
    () => ['cnpj', ...generated.map((item) => `"${item}"`)].join('\n'),
    [generated],
  );

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-base font-semibold text-slate-900">{ui.validatorTitle}</h4>
          <Input
            inputMode="numeric"
            value={value}
            placeholder={ui.validatorPlaceholder}
            onChange={(event) => setValue(event.target.value)}
          />
          <div
            className={`rounded-lg border px-3 py-2 text-sm ${
              !hasValidation
                ? 'border-slate-200 bg-white text-slate-600'
                : valid
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {hasValidation ? (valid ? ui.valid : ui.invalid) : ui.validatorPlaceholder}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultBox>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.formatted}</p>
              <p className="mt-1 break-all font-mono text-sm text-slate-900">{formatCnpj(clean) || '-'}</p>
            </ResultBox>
            <ResultBox>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.digits}</p>
              <p className="mt-1 break-all font-mono text-sm text-slate-900">{clean || '-'}</p>
            </ResultBox>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-base font-semibold text-slate-900">{ui.generatorTitle}</h4>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.quantity}</span>
              <Input type="number" min={1} max={200} value={quantity} onChange={(event) => setQuantity(event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.branch}</span>
              <Input inputMode="numeric" maxLength={4} value={branch} onChange={(event) => setBranch(event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.formatted}</span>
              <Select value={withPunctuation ? 'with' : 'without'} onChange={(event) => setWithPunctuation(event.target.value === 'with')}>
                <option value="with">{ui.withMask}</option>
                <option value="without">{ui.withoutMask}</option>
              </Select>
            </label>
          </div>
          <p className="text-xs text-slate-500">{ui.branchHint}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleGenerate}>{generated.length ? ui.generate : ui.generate}</Button>
            <Button variant="secondary" disabled={!generated.length} onClick={() => void handleCopyAll()}>
              {copyState === 'copied' ? ui.copiedAll : ui.copyAll}
            </Button>
            <Button variant="secondary" disabled={!generated.length} onClick={() => downloadText(generatedText, 'cnpjs.txt')}>{ui.exportTxt}</Button>
            <Button variant="secondary" disabled={!generated.length} onClick={() => downloadText(csv, 'cnpjs.csv', 'text/csv')}>{ui.exportCsv}</Button>
            <Button variant="secondary" disabled={!generated.length} onClick={() => downloadText(JSON.stringify(generated, null, 2), 'cnpjs.json', 'application/json')}>{ui.exportJson}</Button>
            <Button
              variant="ghost"
              onClick={() => {
                setQuantity('10');
                setBranch('0001');
                setWithPunctuation(true);
                setGenerated([]);
                setErrorMessage('');
                setCopyState('idle');
                setCopiedIndex(null);
              }}
            >
              {ui.clear}
            </Button>
          </div>
        </section>
      </div>

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <header className="space-y-1">
          <h4 className="text-sm font-semibold text-slate-800">{ui.resultTitle}</h4>
          <p className="text-xs text-slate-600">
            {generated.length ? `${generated.length} ${ui.generatedCount}` : ui.empty}
          </p>
        </header>

        {generated.length ? (
          <ul className="space-y-2">
            {generated.map((cnpj, index) => (
              <li
                key={`${cnpj}-${index}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
              >
                <span className="font-mono text-sm text-slate-900">{cnpj}</span>
                <Button variant="ghost" className="h-8 px-3 text-xs" onClick={() => void handleCopyItem(cnpj, index)}>
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

const boletoUi = {
  'pt-br': {
    title: 'Validador de boleto e linha digitavel',
    intro: 'Cole linha digitavel ou codigo de barras para validar DACs, converter formatos e extrair vencimento, valor e campo livre.',
    input: 'Linha digitavel ou codigo de barras',
    placeholder: '34191.09008 72564.898723 32408.290008 1 10010000082831',
    validate: 'Validar boleto',
    startCamera: 'Abrir camera',
    stopCamera: 'Parar camera',
    cameraTitle: 'Scanner por camera',
    cameraHint: 'Aponte a camera para o codigo de barras. Se o navegador nao liberar a camera, cole a linha digitavel no campo acima.',
    cameraFound: 'Codigo lido pela camera.',
    copyBarcode: 'Copiar codigo de barras',
    copyLine: 'Copiar linha digitavel',
    exportJson: 'Exportar JSON',
    copied: 'Copiado',
    valid: 'Boleto valido',
    invalid: 'Boleto com divergencias',
    kind: 'Tipo',
    amount: 'Valor',
    bank: 'Banco',
    due: 'Vencimento',
    barcode: 'Codigo de barras',
    freeField: 'Campo livre',
    issues: 'Inconsistencias',
    noIssues: 'Nenhuma divergencia encontrada.',
    bankBoleto: 'Boleto bancario',
    collectionBoleto: 'Arrecadacao/concessionaria',
    partsTitle: 'Partes explicadas',
    segmentedLine: 'Linha digitavel segmentada',
  },
  en: {
    title: 'Boleto and digitable line validator',
    intro: 'Paste a Brazilian boleto line or barcode to validate check digits, convert formats, and extract due date, amount, and free field.',
    input: 'Digitable line or barcode',
    placeholder: '34191.09008 72564.898723 32408.290008 1 10010000082831',
    validate: 'Validate boleto',
    startCamera: 'Open camera',
    stopCamera: 'Stop camera',
    cameraTitle: 'Camera scanner',
    cameraHint: 'Point the camera at the barcode. If the browser blocks camera access, paste the digitable line above.',
    cameraFound: 'Code read from camera.',
    copyBarcode: 'Copy barcode',
    copyLine: 'Copy line',
    exportJson: 'Export JSON',
    copied: 'Copied',
    valid: 'Valid boleto',
    invalid: 'Boleto has issues',
    kind: 'Type',
    amount: 'Amount',
    bank: 'Bank',
    due: 'Due date',
    barcode: 'Barcode',
    freeField: 'Free field',
    issues: 'Issues',
    noIssues: 'No issue found.',
    bankBoleto: 'Bank boleto',
    collectionBoleto: 'Collection/utilities',
    partsTitle: 'Explained parts',
    segmentedLine: 'Segmented digitable line',
  },
  es: {
    title: 'Validador de boleto y linea digitável',
    intro: 'Pega una linea o codigo de barras para validar digitos, convertir formatos y extraer vencimiento, valor y campo libre.',
    input: 'Linea digitavel o codigo de barras',
    placeholder: '34191.09008 72564.898723 32408.290008 1 10010000082831',
    validate: 'Validar boleto',
    startCamera: 'Abrir camara',
    stopCamera: 'Parar camara',
    cameraTitle: 'Scanner por camara',
    cameraHint: 'Apunta la camara al codigo de barras. Si el navegador bloquea la camara, pega la linea digitavel arriba.',
    cameraFound: 'Codigo leido por camara.',
    copyBarcode: 'Copiar codigo de barras',
    copyLine: 'Copiar linea',
    exportJson: 'Exportar JSON',
    copied: 'Copiado',
    valid: 'Boleto valido',
    invalid: 'Boleto con divergencias',
    kind: 'Tipo',
    amount: 'Valor',
    bank: 'Banco',
    due: 'Vencimiento',
    barcode: 'Codigo de barras',
    freeField: 'Campo libre',
    issues: 'Inconsistencias',
    noIssues: 'Ninguna divergencia encontrada.',
    bankBoleto: 'Boleto bancario',
    collectionBoleto: 'Recaudacion/servicios',
    partsTitle: 'Partes explicadas',
    segmentedLine: 'Linea digitavel segmentada',
  },
} satisfies Record<AppLocale, Record<string, string>>;

type BoletoVisualSegment = {
  label: string;
  value: string;
  description: string;
  className: string;
};

const boletoSegmentText = {
  'pt-br': {
    bankCode: 'Banco',
    bankCodeDesc: 'Os 3 primeiros digitos identificam a instituicao emissora.',
    currency: 'Moeda',
    currencyDesc: 'Codigo da moeda. Em boletos comuns, 9 representa Real.',
    generalDac: 'DAC geral',
    generalDacDesc: 'Digito verificador do codigo de barras inteiro.',
    dueFactor: 'Vencimento',
    dueFactorDesc: 'Fator que aponta a data de vencimento do boleto.',
    amount: 'Valor',
    amountDesc: 'Valor codificado em centavos dentro do codigo de barras.',
    freeField: 'Campo livre',
    freeFieldDesc: 'Area usada pelo banco ou convenio para dados internos.',
    field: 'Campo',
    fieldDesc: 'Bloco da linha digitavel com digito verificador proprio.',
    collectionType: 'Tipo de arrecadacao',
    collectionTypeDesc: 'Indica convenio, concessionaria ou formato de arrecadacao.',
  },
  en: {
    bankCode: 'Bank',
    bankCodeDesc: 'The first 3 digits identify the issuing institution.',
    currency: 'Currency',
    currencyDesc: 'Currency code. In common boletos, 9 means BRL.',
    generalDac: 'Main check digit',
    generalDacDesc: 'Check digit for the whole barcode.',
    dueFactor: 'Due factor',
    dueFactorDesc: 'Factor that maps to the boleto due date.',
    amount: 'Amount',
    amountDesc: 'Amount encoded in cents inside the barcode.',
    freeField: 'Free field',
    freeFieldDesc: 'Area used by the bank or agreement for internal data.',
    field: 'Field',
    fieldDesc: 'Digitable-line block with its own check digit.',
    collectionType: 'Collection type',
    collectionTypeDesc: 'Indicates utility, agreement, or collection format.',
  },
  es: {
    bankCode: 'Banco',
    bankCodeDesc: 'Los primeros 3 digitos identifican la institucion emisora.',
    currency: 'Moneda',
    currencyDesc: 'Codigo de moneda. En boletos comunes, 9 representa Real.',
    generalDac: 'Digito general',
    generalDacDesc: 'Digito verificador de todo el codigo de barras.',
    dueFactor: 'Vencimiento',
    dueFactorDesc: 'Factor que apunta a la fecha de vencimiento.',
    amount: 'Valor',
    amountDesc: 'Valor codificado en centavos dentro del codigo de barras.',
    freeField: 'Campo libre',
    freeFieldDesc: 'Area usada por banco o convenio para datos internos.',
    field: 'Campo',
    fieldDesc: 'Bloque de la linea digitavel con su propio digito verificador.',
    collectionType: 'Tipo de recaudacion',
    collectionTypeDesc: 'Indica convenio, servicio o formato de recaudacion.',
  },
} satisfies Record<AppLocale, Record<string, string>>;

const boletoSegmentClasses = [
  'border-cyan-200 bg-cyan-50 text-cyan-900',
  'border-emerald-200 bg-emerald-50 text-emerald-900',
  'border-amber-200 bg-amber-50 text-amber-900',
  'border-violet-200 bg-violet-50 text-violet-900',
  'border-rose-200 bg-rose-50 text-rose-900',
  'border-slate-200 bg-slate-50 text-slate-900',
];

const getBoletoVisualSegments = (result: BoletoParseResult, locale: AppLocale): BoletoVisualSegment[] => {
  const text = boletoSegmentText[locale];
  const barcode = result.barcode ?? '';

  if (result.kind === 'bank' && barcode.length === 44) {
    return [
      { label: text.bankCode, value: barcode.slice(0, 3), description: `${text.bankCodeDesc} ${result.bankName ?? ''}`.trim(), className: boletoSegmentClasses[0] },
      { label: text.currency, value: barcode.slice(3, 4), description: text.currencyDesc, className: boletoSegmentClasses[1] },
      { label: text.generalDac, value: barcode.slice(4, 5), description: text.generalDacDesc, className: boletoSegmentClasses[2] },
      { label: text.dueFactor, value: barcode.slice(5, 9), description: text.dueFactorDesc, className: boletoSegmentClasses[3] },
      { label: text.amount, value: barcode.slice(9, 19), description: `${text.amountDesc} ${result.amountDisplay ?? ''}`.trim(), className: boletoSegmentClasses[4] },
      { label: text.freeField, value: barcode.slice(19), description: text.freeFieldDesc, className: boletoSegmentClasses[5] },
    ];
  }

  if (result.kind === 'collection' && barcode.length === 44) {
    return [
      { label: text.collectionType, value: barcode.slice(0, 4), description: text.collectionTypeDesc, className: boletoSegmentClasses[0] },
      { label: text.currency, value: barcode.slice(2, 3), description: text.currencyDesc, className: boletoSegmentClasses[1] },
      { label: text.generalDac, value: barcode.slice(3, 4), description: text.generalDacDesc, className: boletoSegmentClasses[2] },
      { label: text.amount, value: barcode.slice(4, 15), description: `${text.amountDesc} ${result.amountDisplay ?? ''}`.trim(), className: boletoSegmentClasses[4] },
      { label: text.freeField, value: barcode.slice(15), description: text.freeFieldDesc, className: boletoSegmentClasses[5] },
    ];
  }

  return [];
};

const getBoletoLineSegments = (result: BoletoParseResult, locale: AppLocale): BoletoVisualSegment[] => {
  const text = boletoSegmentText[locale];
  const line = result.lineDigits ?? '';

  if (result.kind === 'bank' && line.length === 47) {
    return [
      { label: `${text.field} 1`, value: `${line.slice(0, 9)}-${line[9]}`, description: text.fieldDesc, className: boletoSegmentClasses[0] },
      { label: `${text.field} 2`, value: `${line.slice(10, 20)}-${line[20]}`, description: text.fieldDesc, className: boletoSegmentClasses[1] },
      { label: `${text.field} 3`, value: `${line.slice(21, 31)}-${line[31]}`, description: text.fieldDesc, className: boletoSegmentClasses[2] },
      { label: text.generalDac, value: line[32], description: text.generalDacDesc, className: boletoSegmentClasses[3] },
      { label: `${text.dueFactor} + ${text.amount}`, value: line.slice(33), description: `${text.dueFactorDesc} ${text.amountDesc}`, className: boletoSegmentClasses[4] },
    ];
  }

  if (result.kind === 'collection' && line.length === 48) {
    return [0, 1, 2, 3].map((index) => ({
      label: `${text.field} ${index + 1}`,
      value: `${line.slice(index * 12, index * 12 + 11)}-${line[index * 12 + 11]}`,
      description: text.fieldDesc,
      className: boletoSegmentClasses[index % boletoSegmentClasses.length],
    }));
  }

  return [];
};

const getKindLabel = (result: BoletoParseResult, ui: Record<string, string>) => {
  if (result.kind === 'bank') return ui.bankBoleto;
  if (result.kind === 'collection') return ui.collectionBoleto;
  return '-';
};

export function BoletoValidatorTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = boletoUi[locale];
  const [input, setInput] = useState('');
  const [result, setResult] = useState<BoletoParseResult | null>(null);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMessage, setCameraMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  const analyze = () => setResult(parseBoleto(input));
  const outputJson = result ? JSON.stringify(result, null, 2) : '';
  const visualSegments = result ? getBoletoVisualSegments(result, locale) : [];
  const lineSegments = result ? getBoletoLineSegments(result, locale) : [];

  useEffect(() => () => controlsRef.current?.stop(), []);

  const stopCamera = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setCameraActive(false);
  };

  const startCamera = async () => {
    if (!videoRef.current) return;
    const { BrowserMultiFormatReader } = await import('@zxing/browser');
    const reader = new BrowserMultiFormatReader();

    try {
      controlsRef.current = await reader.decodeFromVideoDevice(undefined, videoRef.current, (decoded) => {
        if (!decoded) return;
        const text = decoded.getText();
        const parsed = parseBoleto(text);
        setInput(text);
        setResult(parsed);
        setCameraMessage(ui.cameraFound);
        if (parsed.kind !== 'unknown') {
          stopCamera();
        }
      });
      setCameraActive(true);
      setCameraMessage('');
    } catch (error) {
      setCameraMessage(error instanceof Error ? error.message : 'Falha ao abrir camera.');
      setCameraActive(false);
    }
  };

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">{ui.input}</span>
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={ui.placeholder}
          className="min-h-[120px] font-mono text-sm"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={analyze}>{ui.validate}</Button>
        <Button variant="secondary" onClick={() => (cameraActive ? stopCamera() : void startCamera())}>
          {cameraActive ? ui.stopCamera : ui.startCamera}
        </Button>
        <Button variant="secondary" disabled={!result?.barcode} onClick={() => void copyText(result?.barcode ?? '', setCopyState)}>
          {copyState === 'copied' ? ui.copied : ui.copyBarcode}
        </Button>
        <Button variant="secondary" disabled={!result?.formattedLine} onClick={() => void copyText(result?.formattedLine ?? '', setCopyState)}>
          {ui.copyLine}
        </Button>
        <Button variant="secondary" disabled={!result} onClick={() => downloadText(outputJson, 'boleto.json', 'application/json')}>
          {ui.exportJson}
        </Button>
      </div>

      <section className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-slate-900">{ui.cameraTitle}</h4>
          <p className="text-xs text-slate-600">{ui.cameraHint}</p>
          {cameraMessage ? <p className="text-xs font-semibold text-brand-700">{cameraMessage}</p> : null}
        </div>
        <video ref={videoRef} className="aspect-video w-full rounded-xl border border-slate-200 bg-slate-950 object-cover" muted playsInline />
      </section>

      {result ? (
        <section className="space-y-4">
          <div
            className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
              result.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {result.ok ? ui.valid : ui.invalid}
          </div>

          {visualSegments.length || lineSegments.length ? (
            <ResultBox>
              <h4 className="text-sm font-semibold text-slate-900">{ui.partsTitle}</h4>
              {lineSegments.length ? (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.segmentedLine}</p>
                  <div className="flex flex-wrap gap-2">
                    {lineSegments.map((segment) => (
                      <span key={`${segment.label}-${segment.value}`} className={`rounded-lg border px-2.5 py-1.5 font-mono text-xs ${segment.className}`}>
                        <strong className="mr-1 font-sans">{segment.label}:</strong>{segment.value}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {visualSegments.length ? (
                <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {visualSegments.map((segment) => (
                    <div key={`${segment.label}-${segment.value}`} className={`rounded-lg border p-3 ${segment.className}`}>
                      <p className="text-xs font-semibold uppercase tracking-wide opacity-75">{segment.label}</p>
                      <p className="mt-1 break-all font-mono text-sm font-semibold">{segment.value}</p>
                      <p className="mt-2 text-xs leading-relaxed opacity-80">{segment.description}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </ResultBox>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <ResultBox>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.kind}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{getKindLabel(result, ui)}</p>
            </ResultBox>
            <ResultBox>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.amount}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{result.amountDisplay ?? '-'}</p>
            </ResultBox>
            <ResultBox>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.bank}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{result.bankName ?? '-'}</p>
            </ResultBox>
            <ResultBox>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.due}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {result.dueDateCandidates?.length
                  ? result.dueDateCandidates.map((item) => `${item.displayDate} (${item.label})`).join(' / ')
                  : '-'}
              </p>
            </ResultBox>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <ResultBox>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.barcode}</p>
              <p className="mt-1 break-all font-mono text-xs text-slate-900">{result.barcode ?? '-'}</p>
            </ResultBox>
            <ResultBox>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.freeField}</p>
              <p className="mt-1 break-all font-mono text-xs text-slate-900">{result.freeField ?? '-'}</p>
            </ResultBox>
          </div>

          <ResultBox>
            <h4 className="text-sm font-semibold text-slate-900">{ui.issues}</h4>
            {result.issues.length ? (
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                {result.issues.map((issue, index) => (
                  <li key={`${issue.field}-${index}`} className="rounded-lg border border-red-100 bg-white p-2">
                    <strong>{issue.field}:</strong> {issue.message}{' '}
                    {issue.expected ? `(${issue.actual} -> ${issue.expected})` : ''}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-600">{ui.noIssues}</p>
            )}
          </ResultBox>
        </section>
      ) : null}
    </Card>
  );
}
