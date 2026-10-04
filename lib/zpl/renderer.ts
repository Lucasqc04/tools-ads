import { getZplDimensions } from './inspect';
import type { LabelStyle } from './types';

type RenderField = {
  x: number;
  y: number;
  text: string;
  fontSize: number;
  rotation: string;
  barcode: boolean;
};

type RenderBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  thickness: number;
};

const escapeXml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const decodeFieldData = (value: string): string =>
  value
    .replaceAll('\\&', '\n')
    .replaceAll(/_([0-9A-F]{2})/gi, (_, hex: string) => String.fromCharCode(Number.parseInt(hex, 16)));

const numberParts = (value: string): number[] =>
  value
    .split(',')
    .map((part) => Number.parseInt(part.trim(), 10))
    .map((part) => (Number.isFinite(part) ? part : 0));

const parseZplForPreview = (zpl: string): { fields: RenderField[]; boxes: RenderBox[] } => {
  const fields: RenderField[] = [];
  const boxes: RenderBox[] = [];
  const commandPattern = /\^(FO|FT|A0|A|FD|FS|GB|BC|B3)([^\^~]*)/gi;
  let origin = { x: 0, y: 0 };
  let fontSize = 24;
  let rotation = 'N';
  let barcode = false;
  let match: RegExpExecArray | null;

  while ((match = commandPattern.exec(zpl)) !== null) {
    const command = match[1].toUpperCase();
    const payload = match[2].trim();

    if (command === 'FO' || command === 'FT') {
      const [x, y] = numberParts(payload);
      origin = { x, y };
      continue;
    }

    if (command === 'A0' || command === 'A') {
      const parts = payload.split(',');
      rotation = parts[0]?.charAt(0).toUpperCase() || 'N';
      const parsedSize = Number.parseInt(parts[1] ?? '', 10);
      fontSize = Number.isFinite(parsedSize) ? Math.max(8, parsedSize) : fontSize;
      continue;
    }

    if (command === 'BC' || command === 'B3') {
      barcode = true;
      continue;
    }

    if (command === 'GB') {
      const [width, height, thickness] = numberParts(payload);
      boxes.push({
        x: origin.x,
        y: origin.y,
        width: Math.max(0, width),
        height: Math.max(0, height),
        thickness: Math.max(1, thickness || 1),
      });
      continue;
    }

    if (command === 'FD') {
      fields.push({
        x: origin.x,
        y: origin.y,
        text: decodeFieldData(payload),
        fontSize,
        rotation,
        barcode,
      });
      barcode = false;
    }
  }

  return { fields, boxes };
};

const barcodeBars = (value: string, x: number, y: number, width: number, height: number): string => {
  const bits = Array.from(value || 'ZPL').flatMap((character) => {
    const code = character.charCodeAt(0);
    return Array.from({ length: 8 }, (_, index) => ((code >> index) & 1) === 1);
  });
  const barWidth = Math.max(1, width / Math.max(bits.length, 1));

  return bits
    .map((isBar, index) =>
      isBar
        ? `<rect x="${x + index * barWidth}" y="${y}" width="${Math.max(1, barWidth * 0.82)}" height="${height}" fill="#0f172a" />`
        : '',
    )
    .join('');
};

/**
 * Lightweight, local fallback preview. It deliberately supports the common
 * text, box and barcode layout commands while the provider supplies exact
 * printer-compatible rasterization for complex shipping labels.
 */
export function renderZplToSvg(zpl: string, style: LabelStyle): string {
  const dimensions = getZplDimensions(zpl, style);
  const { fields, boxes } = parseZplForPreview(zpl);
  const width = Math.max(120, dimensions.widthDots);
  const height = Math.max(120, dimensions.heightDots);
  const textMarkup = fields
    .map((field) => {
      if (field.barcode) {
        const barcodeWidth = Math.min(Math.max(120, field.text.length * 8), width - field.x - 12);
        return [
          barcodeBars(field.text, field.x, field.y, barcodeWidth, Math.max(48, field.fontSize * 2.4)),
          `<text x="${field.x}" y="${field.y + Math.max(64, field.fontSize * 3)}" font-family="monospace" font-size="${Math.max(12, field.fontSize * 0.6)}" fill="#0f172a">${escapeXml(field.text)}</text>`,
        ].join('');
      }

      const lines = field.text.split('\n');
      const transform =
        field.rotation === 'R'
          ? ` transform="rotate(90 ${field.x} ${field.y})"`
          : field.rotation === 'I'
            ? ` transform="rotate(180 ${field.x} ${field.y})"`
            : field.rotation === 'B'
              ? ` transform="rotate(270 ${field.x} ${field.y})"`
              : '';

      return `<text x="${field.x}" y="${field.y + field.fontSize}" font-family="Arial, sans-serif" font-size="${field.fontSize}" font-weight="600" fill="#0f172a"${transform}>${lines.map((line, index) => `<tspan x="${field.x}" dy="${index === 0 ? 0 : Math.round(field.fontSize * 1.2)}">${escapeXml(line)}</tspan>`).join('')}</text>`;
    })
    .join('');
  const boxMarkup = boxes
    .map(
      (box) =>
        `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" fill="none" stroke="#0f172a" stroke-width="${box.thickness}" />`,
    )
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="ZPL label preview"><rect width="100%" height="100%" fill="#ffffff" />${boxMarkup}${textMarkup}</svg>`;
}

export async function renderLocalZplPngDataUrl(zpl: string, style: LabelStyle): Promise<string> {
  const svg = renderZplToSvg(zpl, style);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('Não foi possível montar a prévia local.'));
      element.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas indisponível para a exportação.');
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function requestZplProviderPreview(
  zpl: string,
  style: LabelStyle,
): Promise<Blob> {
  const response = await fetch('/api/zpl/render', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      zpl,
      dpi: style.dpi,
      widthMm: style.widthMm,
      heightMm: style.heightMm,
      format: 'png',
    }),
  });

  if (!response.ok) {
    throw new Error(`O renderizador retornou ${response.status}.`);
  }

  return response.blob();
}
