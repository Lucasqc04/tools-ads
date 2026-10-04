import type { LabelCustomData, LabelItem, LabelStyle } from './types';

const customBlockPattern = /\^FXTOOLS-ZPL-CUSTOM-START[\s\S]*?\^FXTOOLS-ZPL-CUSTOM-END\s*/g;

const clampInteger = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, Math.round(value)));

const rotationToZpl: Record<LabelStyle['rotation'], 'N' | 'R' | 'I' | 'B'> = {
  0: 'N',
  90: 'R',
  180: 'I',
  270: 'B',
};

const alignmentToZpl: Record<LabelStyle['alignment'], 'L' | 'C' | 'R'> = {
  left: 'L',
  center: 'C',
  right: 'R',
};

const normalizeFieldText = (value: string): string =>
  value
    .replaceAll('\r\n', '\n')
    .replaceAll('\r', '\n')
    .replaceAll(/[\u0000-\u001F\u007F]/g, (character) =>
      character === '\n' ? '\n' : ' ',
    )
    .trim();

/**
 * Escapes control prefixes for ^FH. Printable Unicode remains intact under
 * ^CI28, while ZPL's command delimiters never become executable commands.
 */
export function escapeZplFieldData(value: string): string {
  return normalizeFieldText(value)
    .replaceAll('_', '_5F')
    .replaceAll('^', '_5E')
    .replaceAll('~', '_7E')
    .replaceAll('\n', '\\&');
}

export function removeInjectedDescription(zpl: string): string {
  return zpl.replace(customBlockPattern, '').trim();
}

function buildField(
  text: string,
  style: LabelStyle,
  y: number,
  fontSize: number,
  maxLines: number,
): string {
  const value = escapeZplFieldData(text);

  if (!value) {
    return '';
  }

  const x = clampInteger(style.x, 0, 32000);
  const safeY = clampInteger(y, 0, 32000);
  const width = clampInteger(style.width, 20, 32000);
  const size = clampInteger(fontSize, 8, 600);
  const lines = clampInteger(maxLines, 1, 12);
  const lineGap = Math.max(0, Math.round(size * 0.2));

  return [
    `^FO${x},${safeY}`,
    `^A0${rotationToZpl[style.rotation]},${size},${size}`,
    `^FB${width},${lines},${lineGap},${alignmentToZpl[style.alignment]},0`,
    '^FH_',
    `^FD${value}`,
    '^FS',
  ].join('\n');
}

export function injectCustomDescription(
  sourceZpl: string,
  customData: LabelCustomData,
  style: LabelStyle,
): string {
  const cleanSource = removeInjectedDescription(sourceZpl);
  const closeIndex = cleanSource.toUpperCase().lastIndexOf('^XZ');

  if (closeIndex === -1) {
    return cleanSource;
  }

  const description = buildField(
    customData.description,
    style,
    style.y,
    style.fontSize,
    style.maxLines,
  );
  const note = buildField(
    customData.note,
    style,
    style.y + style.fontSize * (style.maxLines + 1),
    Math.max(12, Math.round(style.fontSize * 0.72)),
    1,
  );

  if (!description && !note) {
    return cleanSource;
  }

  const block = [
    '^FXTOOLS-ZPL-CUSTOM-START',
    '^CI28',
    description,
    note,
    '^FXTOOLS-ZPL-CUSTOM-END',
  ]
    .filter(Boolean)
    .join('\n');

  return `${cleanSource.slice(0, closeIndex).trimEnd()}\n${block}\n${cleanSource.slice(closeIndex)}`;
}

export function buildLabelZpl(label: LabelItem, style: LabelStyle): string {
  return injectCustomDescription(label.editableZpl, label.customData, style);
}

export function buildBatchZpl(labels: LabelItem[], style: LabelStyle): string {
  return labels.map((label) => buildLabelZpl(label, style)).join('\n\n');
}
