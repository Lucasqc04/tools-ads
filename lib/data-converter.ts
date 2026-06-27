import {
  detectCsvDelimiter,
  parseCsvText,
  serializeCsvRows,
  type CsvDelimiter,
} from '@/lib/csv-viewer';

export type DataConverterFormat = 'auto' | 'json' | 'sql' | 'csv' | 'tsv' | 'xlsx';

export type DataCell = string | number | boolean | null;

export type ParsedDataTable = {
  rows: DataCell[][];
  columnCount: number;
  detectedFormat: Exclude<DataConverterFormat, 'auto'>;
  detectedDelimiter?: CsvDelimiter;
  tableName?: string;
  warnings: string[];
};

export type TextParseOptions = {
  format?: DataConverterFormat;
  filename?: string;
};

export type SerializeOptions = {
  useHeaderRow: boolean;
  tableName?: string;
};

const EMPTY_TABLE: ParsedDataTable = {
  rows: [],
  columnCount: 0,
  detectedFormat: 'csv',
  warnings: [],
};

const sqlIdentifierPattern = /^[a-z_][a-z0-9_]*$/i;

const normalizeTextInput = (input: string): string =>
  input
    .replace(/^\ufeff/, '')
    .replaceAll('\r\n', '\n')
    .replaceAll('\r', '\n');

const getExtension = (filename: string | undefined): string => {
  if (!filename) {
    return '';
  }

  return filename.split('.').pop()?.toLowerCase() ?? '';
};

export const formatFromFilename = (
  filename: string | undefined,
): Exclude<DataConverterFormat, 'auto'> | undefined => {
  const extension = getExtension(filename);

  if (extension === 'json') return 'json';
  if (extension === 'sql') return 'sql';
  if (extension === 'csv') return 'csv';
  if (extension === 'tsv' || extension === 'tab') return 'tsv';
  if (extension === 'xlsx' || extension === 'xls') return 'xlsx';

  return undefined;
};

const toCell = (value: unknown): DataCell => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return JSON.stringify(value);
};

const toDisplayString = (value: DataCell): string => {
  if (value === null) {
    return '';
  }

  return String(value);
};

const normalizeRows = (rows: DataCell[][]): { rows: DataCell[][]; columnCount: number } => {
  const withoutTrailingEmptyRows = [...rows];

  while (withoutTrailingEmptyRows.length > 0) {
    const lastRow = withoutTrailingEmptyRows[withoutTrailingEmptyRows.length - 1];
    if (lastRow.some((cell) => toDisplayString(cell).trim().length > 0)) {
      break;
    }

    withoutTrailingEmptyRows.pop();
  }

  const columnCount = withoutTrailingEmptyRows.reduce(
    (max, row) => Math.max(max, row.length),
    0,
  );

  return {
    rows: withoutTrailingEmptyRows.map((row) => [
      ...row,
      ...Array.from({ length: columnCount - row.length }, () => null),
    ]),
    columnCount,
  };
};

export const createParsedTableFromRows = (
  rows: unknown[][],
  detectedFormat: Exclude<DataConverterFormat, 'auto'>,
  options: Pick<ParsedDataTable, 'detectedDelimiter' | 'tableName'> = {},
): ParsedDataTable => {
  const normalized = normalizeRows(rows.map((row) => row.map(toCell)));

  return {
    rows: normalized.rows,
    columnCount: normalized.columnCount,
    detectedFormat,
    detectedDelimiter: options.detectedDelimiter,
    tableName: options.tableName,
    warnings: [],
  };
};

const parseJsonToRows = (input: string): DataCell[][] => {
  const parsed = JSON.parse(input) as unknown;

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return [];
    }

    if (parsed.every(Array.isArray)) {
      return parsed.map((row) => row.map(toCell));
    }

    if (parsed.every((item) => item && typeof item === 'object' && !Array.isArray(item))) {
      const objectItems = parsed as Array<Record<string, unknown>>;
      const keys = Array.from(
        objectItems.reduce<Set<string>>((set, item) => {
          Object.keys(item).forEach((key) => set.add(key));
          return set;
        }, new Set<string>()),
      );

      return [
        keys,
        ...objectItems.map((item) => keys.map((key) => toCell(item[key]))),
      ];
    }

    return [['value'], ...parsed.map((item) => [toCell(item)])];
  }

  if (parsed && typeof parsed === 'object') {
    const entries = Object.entries(parsed as Record<string, unknown>);
    const objectValues = entries
      .map(([, value]) => value)
      .filter(
        (value): value is Record<string, unknown> =>
          Boolean(value) && typeof value === 'object' && !Array.isArray(value),
      );

    if (objectValues.length === entries.length && entries.length > 0) {
      const keys = Array.from(
        objectValues.reduce<Set<string>>((set, item) => {
          Object.keys(item).forEach((key) => set.add(key));
          return set;
        }, new Set<string>()),
      );

      return [
        ['key', ...keys],
        ...entries.map(([entryKey, value]) => [
          entryKey,
          ...keys.map((key) => toCell((value as Record<string, unknown>)[key])),
        ]),
      ];
    }

    return [['key', 'value'], ...entries.map(([key, value]) => [key, toCell(value)])];
  }

  return [['value'], [toCell(parsed)]];
};

const splitSqlList = (input: string): string[] => {
  const values: string[] = [];
  let current = '';
  let quote: '"' | "'" | '`' | null = null;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (quote) {
      current += char;

      if (char === quote) {
        if (quote === "'" && next === "'") {
          current += next;
          index += 1;
          continue;
        }

        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      current += char;
      continue;
    }

    if (char === ',') {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
};

const normalizeSqlIdentifier = (value: string): string =>
  value.trim().replace(/^["'`\[]|["'`\]]$/g, '').trim();

const parseSqlValue = (value: string): DataCell => {
  const trimmed = value.trim();
  const upper = trimmed.toUpperCase();

  if (!trimmed || upper === 'NULL') {
    return null;
  }

  if (upper === 'TRUE') {
    return true;
  }

  if (upper === 'FALSE') {
    return false;
  }

  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1).replaceAll("''", "'").replaceAll('\\"', '"');
  }

  return trimmed;
};

const extractSqlTuples = (valuesInput: string): string[][] => {
  const tuples: string[][] = [];
  let current = '';
  let depth = 0;
  let quote: '"' | "'" | null = null;

  for (let index = 0; index < valuesInput.length; index += 1) {
    const char = valuesInput[index];
    const next = valuesInput[index + 1];

    if (quote) {
      current += char;

      if (char === quote) {
        if (quote === "'" && next === "'") {
          current += next;
          index += 1;
          continue;
        }

        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }

    if (char === '(') {
      if (depth > 0) {
        current += char;
      }

      depth += 1;
      continue;
    }

    if (char === ')') {
      depth -= 1;

      if (depth === 0) {
        tuples.push(splitSqlList(current));
        current = '';
        continue;
      }

      current += char;
      continue;
    }

    if (depth > 0) {
      current += char;
    }
  }

  return tuples;
};

const parseSqlToTable = (input: string): ParsedDataTable => {
  const insertPattern =
    /insert\s+into\s+([`"\[]?[a-z0-9_.-]+[`"\]]?)\s*(?:\(([\s\S]*?)\))?\s+values\s+([\s\S]*?)(?=;\s*insert\s+into|;\s*$|$)/gi;
  const rows: DataCell[][] = [];
  let headers: string[] | null = null;
  let tableName = '';
  let match: RegExpExecArray | null;

  while ((match = insertPattern.exec(input)) !== null) {
    tableName = tableName || normalizeSqlIdentifier(match[1] ?? '');
    const columnInput = match[2] ?? '';
    const valuesInput = match[3] ?? '';
    const statementHeaders = columnInput
      ? splitSqlList(columnInput).map(normalizeSqlIdentifier)
      : null;
    const tuples = extractSqlTuples(valuesInput);

    if (!headers) {
      const firstTupleWidth = tuples[0]?.length ?? 0;
      headers =
        statementHeaders && statementHeaders.length
          ? statementHeaders
          : Array.from({ length: firstTupleWidth }, (_, index) => `column_${index + 1}`);
      rows.push(headers);
    }

    tuples.forEach((tuple) => {
      rows.push(tuple.map(parseSqlValue));
    });
  }

  if (!rows.length) {
    throw new Error('Unsupported SQL input. Paste INSERT INTO ... VALUES statements.');
  }

  const normalized = normalizeRows(rows);

  return {
    rows: normalized.rows,
    columnCount: normalized.columnCount,
    detectedFormat: 'sql',
    tableName,
    warnings: [],
  };
};

const parseDelimitedToTable = (
  input: string,
  delimiter: CsvDelimiter,
  detectedFormat: 'csv' | 'tsv',
): ParsedDataTable => {
  const parsed = parseCsvText(input, delimiter);

  return {
    rows: parsed.rows,
    columnCount: parsed.columnCount,
    detectedFormat,
    detectedDelimiter: delimiter,
    warnings: [],
  };
};

export const detectDataTextFormat = (
  input: string,
  filename?: string,
): Exclude<DataConverterFormat, 'auto'> => {
  const extensionFormat = formatFromFilename(filename);
  if (extensionFormat && extensionFormat !== 'xlsx') {
    return extensionFormat;
  }

  const normalized = normalizeTextInput(input).trim();
  if (!normalized) {
    return 'csv';
  }

  if (normalized.startsWith('{') || normalized.startsWith('[')) {
    try {
      JSON.parse(normalized);
      return 'json';
    } catch {
      // Continue detection for pasted text that only looks like JSON.
    }
  }

  if (/insert\s+into\s+[\s\S]+?\s+values\s*\(/i.test(normalized)) {
    return 'sql';
  }

  const detected = detectCsvDelimiter(normalized);
  return detected.delimiter === '\t' ? 'tsv' : 'csv';
};

export const parseDataText = (
  input: string,
  options: TextParseOptions = {},
): ParsedDataTable => {
  const normalized = normalizeTextInput(input);
  if (!normalized.trim()) {
    return EMPTY_TABLE;
  }

  const requestedFormat =
    options.format && options.format !== 'auto'
      ? options.format
      : detectDataTextFormat(normalized, options.filename);

  if (requestedFormat === 'xlsx') {
    return {
      ...EMPTY_TABLE,
      detectedFormat: 'xlsx',
      warnings: ['XLSX input must be loaded from file upload.'],
    };
  }

  if (requestedFormat === 'json') {
    const normalizedRows = normalizeRows(parseJsonToRows(normalized));

    return {
      rows: normalizedRows.rows,
      columnCount: normalizedRows.columnCount,
      detectedFormat: 'json',
      warnings: [],
    };
  }

  if (requestedFormat === 'sql') {
    return parseSqlToTable(normalized);
  }

  if (requestedFormat === 'tsv') {
    return parseDelimitedToTable(normalized, '\t', 'tsv');
  }

  if (requestedFormat === 'csv') {
    const delimiter = detectCsvDelimiter(normalized, [',', ';', '|']).delimiter;
    return parseDelimitedToTable(normalized, delimiter, 'csv');
  }

  const delimiter = detectCsvDelimiter(normalized).delimiter;
  return parseDelimitedToTable(normalized, delimiter, delimiter === '\t' ? 'tsv' : 'csv');
};

const getHeaderNames = (rows: DataCell[][], useHeaderRow: boolean): string[] => {
  const columnCount = rows.reduce((max, row) => Math.max(max, row.length), 0);
  const rawHeaders = useHeaderRow && rows[0]?.length
    ? rows[0].map((cell, index) => toDisplayString(cell).trim() || `column_${index + 1}`)
    : Array.from({ length: columnCount }, (_, index) => `column_${index + 1}`);
  const seen = new Map<string, number>();

  return rawHeaders.map((header, index) => {
    const base = header || `column_${index + 1}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}_${count + 1}`;
  });
};

const getBodyRows = (rows: DataCell[][], useHeaderRow: boolean): DataCell[][] =>
  useHeaderRow ? rows.slice(1) : rows;

export const serializeDataTableToJson = (
  rows: DataCell[][],
  options: SerializeOptions,
): string => {
  if (!rows.length) {
    return '[]';
  }

  if (!options.useHeaderRow) {
    return JSON.stringify(rows, null, 2);
  }

  const headers = getHeaderNames(rows, true);
  const bodyRows = getBodyRows(rows, true);
  const objects = bodyRows.map((row) =>
    headers.reduce<Record<string, DataCell>>((acc, header, index) => {
      acc[header] = row[index] ?? null;
      return acc;
    }, {}),
  );

  return JSON.stringify(objects, null, 2);
};

export const serializeDataTableToDelimited = (
  rows: DataCell[][],
  delimiter: CsvDelimiter,
): string => serializeCsvRows(rows.map((row) => row.map(toDisplayString)), delimiter);

const sanitizeSqlIdentifier = (value: string, fallback: string): string => {
  const normalized = value
    .trim()
    .replaceAll(/[^a-z0-9_]+/gi, '_')
    .replaceAll(/^_+|_+$/g, '')
    .toLowerCase();
  const withFallback = normalized || fallback;
  const prefixed = /^[0-9]/.test(withFallback) ? `data_${withFallback}` : withFallback;

  return sqlIdentifierPattern.test(prefixed) ? prefixed : fallback;
};

const serializeSqlValue = (value: DataCell): string => {
  if (value === null) {
    return 'NULL';
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }

  return `'${String(value).replaceAll("'", "''")}'`;
};

export const serializeDataTableToSql = (
  rows: DataCell[][],
  options: SerializeOptions,
): string => {
  if (!rows.length) {
    return '';
  }

  const tableName = sanitizeSqlIdentifier(options.tableName ?? '', 'converted_data');
  const headers = getHeaderNames(rows, options.useHeaderRow).map((header, index) =>
    sanitizeSqlIdentifier(header, `column_${index + 1}`),
  );
  const bodyRows = getBodyRows(rows, options.useHeaderRow);

  if (!bodyRows.length) {
    return '';
  }

  const columns = headers.join(', ');
  const values = bodyRows
    .map((row) => {
      const padded = headers.map((_, index) => row[index] ?? null);
      return `  (${padded.map(serializeSqlValue).join(', ')})`;
    })
    .join(',\n');

  return `INSERT INTO ${tableName} (${columns}) VALUES\n${values};`;
};

export const serializeDataTable = (
  rows: DataCell[][],
  format: Exclude<DataConverterFormat, 'auto' | 'xlsx'>,
  options: SerializeOptions,
): string => {
  if (format === 'json') {
    return serializeDataTableToJson(rows, options);
  }

  if (format === 'sql') {
    return serializeDataTableToSql(rows, options);
  }

  return serializeDataTableToDelimited(rows, format === 'tsv' ? '\t' : ',');
};

export const buildDataConverterFilename = (
  originalName: string | undefined,
  outputFormat: Exclude<DataConverterFormat, 'auto'>,
): string => {
  const base = (originalName || 'converted-data')
    .replace(/\.[^.]+$/, '')
    .replaceAll(/[^a-z0-9_-]+/gi, '-')
    .replaceAll(/^-+|-+$/g, '')
    .toLowerCase() || 'converted-data';

  return `${base}.${outputFormat}`;
};

export const getPreviewRows = (
  rows: DataCell[][],
  limit = 50,
): string[][] => rows.slice(0, limit).map((row) => row.map(toDisplayString));
