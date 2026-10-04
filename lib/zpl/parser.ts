import type { LabelItem, ParsedZplBatch } from './types';

const normalizeZpl = (value: string): string =>
  value.replace(/^\uFEFF/, '').replaceAll('\r\n', '\n').replaceAll('\r', '\n');

/**
 * Extracts complete ZPL formats without relying on a fragile replacement of
 * the closing marker. A format is only accepted when it starts at ^XA and
 * reaches its own following ^XZ marker.
 */
export function parseZplBatch(input: string): ParsedZplBatch {
  const source = normalizeZpl(input);
  const labels: string[] = [];
  const warnings: string[] = [];
  const startPattern = /\^XA/gi;
  let match: RegExpExecArray | null;

  while ((match = startPattern.exec(source)) !== null) {
    const start = match.index;
    const end = source.toUpperCase().indexOf('^XZ', startPattern.lastIndex);

    if (end === -1) {
      warnings.push('Um bloco iniciado com ^XA não possui o encerramento ^XZ.');
      break;
    }

    labels.push(source.slice(start, end + 3).trim());
    startPattern.lastIndex = end + 3;
  }

  if (!labels.length && source.trim()) {
    warnings.push('Nenhum bloco ZPL completo (^XA ... ^XZ) foi encontrado.');
  }

  return { labels, warnings };
}

export function createLabelItems(zplLabels: string[]): LabelItem[] {
  return zplLabels.map((originalZpl, index) => ({
    id: `label-${index + 1}`,
    index,
    originalZpl,
    editableZpl: originalZpl,
    customData: { description: '', note: '' },
    generatedZpl: originalZpl,
  }));
}
