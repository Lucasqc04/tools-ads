export type BoletoKind = 'bank' | 'collection' | 'unknown';

export type BoletoValidationIssue = {
  field: string;
  expected?: string;
  actual?: string;
  message: string;
};

export type BoletoDueDateCandidate = {
  label: 'cycle-1997' | 'cycle-2025';
  isoDate: string;
  displayDate: string;
};

export type BoletoParseResult = {
  ok: boolean;
  kind: BoletoKind;
  inputDigits: string;
  lineDigits?: string;
  barcode?: string;
  formattedLine?: string;
  bankCode?: string;
  bankName?: string;
  currencyCode?: string;
  amountCents?: number;
  amountDisplay?: string;
  dueFactor?: string;
  dueDateCandidates?: BoletoDueDateCandidate[];
  freeField?: string;
  issues: BoletoValidationIssue[];
};

const BANK_NAMES: Record<string, string> = {
  '001': 'Banco do Brasil',
  '033': 'Santander',
  '104': 'Caixa Economica Federal',
  '237': 'Bradesco',
  '260': 'Nu Pagamentos',
  '290': 'PagSeguro',
  '323': 'Mercado Pago',
  '336': 'C6 Bank',
  '341': 'Itau',
  '380': 'PicPay',
  '422': 'Safra',
  '633': 'Rendimento',
  '655': 'Votorantim',
  '756': 'Sicoob',
};

const onlyDigits = (value: string): string => value.replaceAll(/\D+/g, '');

const addDays = (date: Date, days: number): Date => {
  const next = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const formatDate = (date: Date): BoletoDueDateCandidate['displayDate'] =>
  new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);

const toIsoDate = (date: Date): string => date.toISOString().slice(0, 10);

const formatCurrency = (amountCents: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amountCents / 100);

const modulo10 = (digits: string): string => {
  let sum = 0;
  let multiplier = 2;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    const product = Number(digits[index]) * multiplier;
    sum += product > 9 ? Math.floor(product / 10) + (product % 10) : product;
    multiplier = multiplier === 2 ? 1 : 2;
  }

  return String((10 - (sum % 10)) % 10);
};

const modulo11Boleto = (digits: string): string => {
  let sum = 0;
  let weight = 2;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    sum += Number(digits[index]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }

  const digit = 11 - (sum % 11);
  return digit === 0 || digit === 10 || digit === 11 ? '1' : String(digit);
};

const modulo11Collection = (digits: string): string => {
  let sum = 0;
  let weight = 2;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    sum += Number(digits[index]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }

  const digit = 11 - (sum % 11);
  return digit === 10 || digit === 11 ? '0' : String(digit);
};

const buildIssue = (
  field: string,
  expected: string,
  actual: string,
  message: string,
): BoletoValidationIssue => ({
  field,
  expected,
  actual,
  message,
});

const formatBankLine = (digits: string): string =>
  `${digits.slice(0, 5)}.${digits.slice(5, 10)} ${digits.slice(10, 15)}.${digits.slice(
    15,
    21,
  )} ${digits.slice(21, 26)}.${digits.slice(26, 32)} ${digits.slice(32, 33)} ${digits.slice(33)}`;

const formatCollectionLine = (digits: string): string =>
  `${digits.slice(0, 12)} ${digits.slice(12, 24)} ${digits.slice(24, 36)} ${digits.slice(36)}`;

const barcodeToBankLine = (barcode: string): string => {
  const field1 = `${barcode.slice(0, 4)}${barcode.slice(19, 24)}`;
  const field2 = barcode.slice(24, 34);
  const field3 = barcode.slice(34, 44);
  return `${field1}${modulo10(field1)}${field2}${modulo10(field2)}${field3}${modulo10(field3)}${barcode[4]}${barcode.slice(5, 19)}`;
};

const bankLineToBarcode = (line: string): string =>
  `${line.slice(0, 4)}${line[32]}${line.slice(33, 47)}${line.slice(4, 9)}${line.slice(10, 20)}${line.slice(21, 31)}`;

const barcodeToCollectionLine = (barcode: string): string => {
  const algorithm = ['6', '7'].includes(barcode[2]) ? modulo10 : modulo11Collection;
  const groups = [barcode.slice(0, 11), barcode.slice(11, 22), barcode.slice(22, 33), barcode.slice(33, 44)];
  return groups.map((group) => `${group}${algorithm(group)}`).join('');
};

const collectionLineToBarcode = (line: string): string =>
  `${line.slice(0, 11)}${line.slice(12, 23)}${line.slice(24, 35)}${line.slice(36, 47)}`;

const getDueDateCandidates = (factor: string): BoletoDueDateCandidate[] => {
  if (!factor || factor === '0000') {
    return [];
  }

  const value = Number(factor);
  if (!Number.isFinite(value) || value <= 0) {
    return [];
  }

  const oldCycle = addDays(new Date(Date.UTC(1997, 9, 7)), value);
  const candidates: BoletoDueDateCandidate[] = [
    {
      label: 'cycle-1997',
      isoDate: toIsoDate(oldCycle),
      displayDate: formatDate(oldCycle),
    },
  ];

  if (value >= 1000) {
    const newCycle = addDays(new Date(Date.UTC(2025, 1, 22)), value - 1000);
    candidates.push({
      label: 'cycle-2025',
      isoDate: toIsoDate(newCycle),
      displayDate: formatDate(newCycle),
    });
  }

  return candidates;
};

const parseBankBarcode = (barcode: string, inputDigits: string): BoletoParseResult => {
  const lineDigits = inputDigits.length === 47 ? inputDigits : barcodeToBankLine(barcode);
  const issues: BoletoValidationIssue[] = [];

  const fields = [
    { name: 'campo 1', body: lineDigits.slice(0, 9), digit: lineDigits[9] },
    { name: 'campo 2', body: lineDigits.slice(10, 20), digit: lineDigits[20] },
    { name: 'campo 3', body: lineDigits.slice(21, 31), digit: lineDigits[31] },
  ];

  fields.forEach((field) => {
    const expected = modulo10(field.body);
    if (expected !== field.digit) {
      issues.push(buildIssue(field.name, expected, field.digit, 'Digito verificador do campo nao confere.'));
    }
  });

  const expectedGeneral = modulo11Boleto(`${barcode.slice(0, 4)}${barcode.slice(5)}`);
  if (expectedGeneral !== barcode[4]) {
    issues.push(buildIssue('codigo de barras', expectedGeneral, barcode[4], 'DAC geral do boleto nao confere.'));
  }

  const amountCents = Number(barcode.slice(9, 19));
  const dueFactor = barcode.slice(5, 9);

  return {
    ok: issues.length === 0,
    kind: 'bank',
    inputDigits,
    lineDigits,
    barcode,
    formattedLine: formatBankLine(lineDigits),
    bankCode: barcode.slice(0, 3),
    bankName: BANK_NAMES[barcode.slice(0, 3)] ?? 'Banco nao identificado',
    currencyCode: barcode[3],
    amountCents,
    amountDisplay: formatCurrency(amountCents),
    dueFactor,
    dueDateCandidates: getDueDateCandidates(dueFactor),
    freeField: barcode.slice(19),
    issues,
  };
};

const parseCollectionBarcode = (barcode: string, inputDigits: string): BoletoParseResult => {
  const lineDigits = inputDigits.length === 48 ? inputDigits : barcodeToCollectionLine(barcode);
  const algorithm = ['6', '7'].includes(barcode[2]) ? modulo10 : modulo11Collection;
  const issues: BoletoValidationIssue[] = [];

  for (let groupIndex = 0; groupIndex < 4; groupIndex += 1) {
    const start = groupIndex * 12;
    const body = lineDigits.slice(start, start + 11);
    const actual = lineDigits[start + 11];
    const expected = algorithm(body);

    if (expected !== actual) {
      issues.push(buildIssue(`campo ${groupIndex + 1}`, expected, actual, 'Digito verificador do campo nao confere.'));
    }
  }

  const amountCents = ['6', '8'].includes(barcode[2]) ? Number(barcode.slice(4, 15)) : undefined;

  return {
    ok: issues.length === 0,
    kind: 'collection',
    inputDigits,
    lineDigits,
    barcode,
    formattedLine: formatCollectionLine(lineDigits),
    currencyCode: barcode[2],
    amountCents,
    amountDisplay: typeof amountCents === 'number' ? formatCurrency(amountCents) : undefined,
    freeField: barcode.slice(15),
    issues,
  };
};

export const parseBoleto = (value: string): BoletoParseResult => {
  const inputDigits = onlyDigits(value);

  if (![44, 47, 48].includes(inputDigits.length)) {
    return {
      ok: false,
      kind: 'unknown',
      inputDigits,
      issues: [
        {
          field: 'tamanho',
          actual: String(inputDigits.length),
          message: 'Informe uma linha digitavel de 47/48 digitos ou codigo de barras de 44 digitos.',
        },
      ],
    };
  }

  if (inputDigits.length === 47) {
    return parseBankBarcode(bankLineToBarcode(inputDigits), inputDigits);
  }

  if (inputDigits.length === 48) {
    return parseCollectionBarcode(collectionLineToBarcode(inputDigits), inputDigits);
  }

  return inputDigits.startsWith('8')
    ? parseCollectionBarcode(inputDigits, inputDigits)
    : parseBankBarcode(inputDigits, inputDigits);
};

