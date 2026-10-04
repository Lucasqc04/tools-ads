import { describe, expect, it } from 'vitest';
import {
  buildBatchZpl,
  buildLabelZpl,
  createLabelItems,
  defaultLabelStyle,
  escapeZplFieldData,
  parseZplBatch,
} from '@/lib/zpl';

const label = (value: string): string => `^XA\n^PW800\n^LL1200\n^FO40,50^FD${value}^FS\n^XZ`;

describe('ZPL batch parsing and generation', () => {
  it.each([1, 5, 30, 100])('detects %s complete labels', (count) => {
    const source = Array.from({ length: count }, (_, index) => label(`Pedido ${index + 1}`)).join('\n');
    const result = parseZplBatch(source);

    expect(result.labels).toHaveLength(count);
    expect(createLabelItems(result.labels).map((item) => item.id)).toEqual(
      Array.from({ length: count }, (_, index) => `label-${index + 1}`),
    );
  });

  it('does not accept incomplete ZPL blocks', () => {
    const result = parseZplBatch('^XA\n^FO30,30^FDSem fechamento');
    expect(result.labels).toHaveLength(0);
    expect(result.warnings[0]).toContain('^XZ');
  });

  it('escapes ZPL delimiters and builds a non-destructive generated label', () => {
    const [item] = createLabelItems([label('Envio original')]);
    const customized = {
      ...item,
      customData: { description: 'Tênis ^ azul ~ 39_40', note: 'Separar\nurgente' },
    };
    const generated = buildLabelZpl(customized, defaultLabelStyle);

    expect(item.originalZpl).not.toContain('TOOLS-ZPL-CUSTOM');
    expect(generated).toContain('^FXTOOLS-ZPL-CUSTOM-START');
    expect(generated).toContain('_5E');
    expect(generated).toContain('_7E');
    expect(generated).toContain('_5F');
    expect(generated).toContain('^XZ');
  });

  it('replaces its own generated description instead of accumulating blocks', () => {
    const [item] = createLabelItems([label('Original')]);
    const once = buildLabelZpl({ ...item, customData: { description: 'Primeiro', note: '' } }, defaultLabelStyle);
    const twice = buildLabelZpl({ ...item, editableZpl: once, customData: { description: 'Segundo', note: '' } }, defaultLabelStyle);

    expect(twice.match(/\^FXTOOLS-ZPL-CUSTOM-START/g)).toHaveLength(1);
    expect(twice).toContain('Segundo');
    expect(twice).not.toContain('Primeiro');
  });

  it('builds an exportable batch with one complete label per item', () => {
    const items = createLabelItems([label('A'), label('B')]).map((item, index) => ({
      ...item,
      customData: { description: `Produto ${index + 1}`, note: '' },
    }));
    const generated = buildBatchZpl(items, defaultLabelStyle);

    expect(generated.match(/\^XA/g)).toHaveLength(2);
    expect(generated.match(/\^XZ/g)).toHaveLength(2);
  });

  it('normalizes a line break without exposing a ZPL command prefix', () => {
    expect(escapeZplFieldData('Linha 1\n^FO150,200')).toBe('Linha 1\\&_5EFO150,200');
  });
});
