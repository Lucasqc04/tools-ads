import type { LabelStyle, ZplDimensions } from './types';

const getCommandNumber = (zpl: string, command: 'PW' | 'LL'): number | null => {
  const match = new RegExp(`\\^${command}(\\d+)`, 'i').exec(zpl);
  const value = match ? Number(match[1]) : Number.NaN;
  return Number.isFinite(value) && value > 0 ? value : null;
};

export function getZplDimensions(zpl: string, style: LabelStyle): ZplDimensions {
  const dotsPerMm = style.dpi / 25.4;
  return {
    widthDots: getCommandNumber(zpl, 'PW') ?? Math.round(style.widthMm * dotsPerMm),
    heightDots: getCommandNumber(zpl, 'LL') ?? Math.round(style.heightMm * dotsPerMm),
  };
}

export function getZplWarnings(zpl: string): string[] {
  const warnings: string[] = [];
  const starts = zpl.match(/\^XA/gi)?.length ?? 0;
  const ends = zpl.match(/\^XZ/gi)?.length ?? 0;

  if (starts !== 1 || ends !== 1) {
    warnings.push('A etiqueta deve conter exatamente um bloco ^XA ... ^XZ.');
  }

  if (!/\^FD/i.test(zpl)) {
    warnings.push('Nenhum campo de dados (^FD) foi identificado.');
  }

  if (/\^FO\s*[^\d,]/i.test(zpl)) {
    warnings.push('Há uma coordenada ^FO que pode estar inválida.');
  }

  return warnings;
}
