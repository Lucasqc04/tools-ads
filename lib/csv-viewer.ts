export type CsvDelimiter = ',' | ';' | '\t' | '|';

export type CsvDelimiterCandidate = {
  delimiter: CsvDelimiter;
  score: number;
};

export type CsvParseResult = {
  rows: string[][];
  columnCount: number;
};

const DEFAULT_DELIMITERS: CsvDelimiter[] = [',', ';', '\t', '|'];

const normalizeCsvInput = (input: string): string =>
  input
    .replace(/^\ufeff/, '')
    .replaceAll('\r\n', '\n')
    .replaceAll('\r', '\n');

const padRowsToColumnCount = (rows: string[][], columnCount: number): string[][] =>
  rows.map((row) => {
    if (row.length >= columnCount) {
      return row;
    }

    return [...row, ...Array.from({ length: columnCount - row.length }, () => '')];
  });

const pruneTrailingEmptyRows = (rows: string[][]): string[][] => {
  const output = [...rows];

  while (output.length > 0) {
    const row = output[output.length - 1];
    const hasVisibleValue = row.some((cell) => cell.trim().length > 0);

    if (hasVisibleValue) {
      break;
    }

    output.pop();
  }

  return output;
};

export const parseCsvText = (input: string, delimiter: CsvDelimiter): CsvParseResult => {
  const normalized = normalizeCsvInput(input);

  if (!normalized.trim()) {
    return { rows: [], columnCount: 0 };
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let index = 0; index < normalized.length; index += 1) {
    const currentChar = normalized[index];
    const nextChar = normalized[index + 1];

    if (currentChar === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        index += 1;
        continue;
      }

      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && currentChar === delimiter) {
      currentRow.push(currentCell);
      currentCell = '';
      continue;
    }

    if (!inQuotes && currentChar === '\n') {
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
      continue;
    }

    currentCell += currentChar;
  }

  currentRow.push(currentCell);
  rows.push(currentRow);

  const trimmedRows = pruneTrailingEmptyRows(rows);
  const columnCount = trimmedRows.reduce((max, row) => Math.max(max, row.length), 0);

  if (columnCount === 0) {
    return { rows: [], columnCount: 0 };
  }

  return {
    rows: padRowsToColumnCount(trimmedRows, columnCount),
    columnCount,
  };
};

const computeDelimiterScore = (rows: string[][]): number => {
  if (rows.length < 2) {
    return -10;
  }

  const relevantRows = rows
    .filter((row) => row.some((cell) => cell.trim().length > 0))
    .slice(0, 30);

  if (relevantRows.length < 2) {
    return -10;
  }

  const columnSizes = relevantRows.map((row) => row.length);
  const average = columnSizes.reduce((sum, size) => sum + size, 0) / columnSizes.length;

  if (average <= 1) {
    return -8;
  }

  const firstRowSize = columnSizes[0];
  const consistencyPoints = columnSizes.filter((size) => size === firstRowSize).length;
  const variancePenalty = columnSizes.reduce((acc, size) => acc + Math.abs(size - average), 0);

  return average * 4 + consistencyPoints * 2 - variancePenalty;
};

export const detectCsvDelimiter = (
  input: string,
  allowedDelimiters: CsvDelimiter[] = DEFAULT_DELIMITERS,
): { delimiter: CsvDelimiter; candidates: CsvDelimiterCandidate[] } => {
  const normalized = normalizeCsvInput(input);

  if (!normalized.trim()) {
    return {
      delimiter: ',',
      candidates: allowedDelimiters.map((item) => ({ delimiter: item, score: 0 })),
    };
  }

  const candidates = allowedDelimiters.map((delimiter) => {
    const parsed = parseCsvText(normalized, delimiter);
    return {
      delimiter,
      score: computeDelimiterScore(parsed.rows),
    };
  });

  const sorted = [...candidates].sort((a, b) => b.score - a.score);

  return {
    delimiter: sorted[0]?.delimiter ?? ',',
    candidates: sorted,
  };
};

const shouldEscapeCsvCell = (value: string, delimiter: CsvDelimiter): boolean =>
  value.includes('"') || value.includes('\n') || value.includes(delimiter);

const escapeCsvCell = (value: string, delimiter: CsvDelimiter): string => {
  if (!shouldEscapeCsvCell(value, delimiter)) {
    return value;
  }

  return `"${value.replaceAll('"', '""')}"`;
};

export const serializeCsvRows = (rows: string[][], delimiter: CsvDelimiter): string =>
  rows.map((row) => row.map((cell) => escapeCsvCell(cell, delimiter)).join(delimiter)).join('\n');

export const convertCsvDelimiter = (
  input: string,
  sourceDelimiter: CsvDelimiter,
  targetDelimiter: CsvDelimiter,
): string => {
  const parsed = parseCsvText(input, sourceDelimiter);

  if (!parsed.rows.length) {
    return '';
  }

  return serializeCsvRows(parsed.rows, targetDelimiter);
};
