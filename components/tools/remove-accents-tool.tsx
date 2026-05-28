'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { AppLocale } from '@/lib/i18n/config';
import { removeAccentsText, type RemoveAccentsOptions } from '@/lib/remove-accents';

type RemoveAccentsToolProps = Readonly<{ locale?: AppLocale }>;

const sampleText = 'ação, coração, João, São Paulo, número, ç, á, à, â, ã, é, ê, í, ó, ô, õ, ú, ü';

const downloadTextFile = (filename: string, content: string, mimeType = 'text/plain;charset=utf-8') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export function RemoveAccentsTool({ locale = 'pt-br' }: RemoveAccentsToolProps) {
  const isPt = locale === 'pt-br';
  const isEs = locale === 'es';

  const [source, setSource] = useState('');
  const [mode, setMode] = useState<RemoveAccentsOptions['mode']>('keep-case');
  const [removeSymbols, setRemoveSymbols] = useState(false);
  const [removePunct, setRemovePunct] = useState(false);
  const [removeEmojis, setRemoveEmojis] = useState(true);
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [spaceReplacement, setSpaceReplacement] = useState<RemoveAccentsOptions['spaceReplacement']>('none');
  const [toSlug, setToSlug] = useState(false);
  const [copied, setCopied] = useState(false);

  const output = useMemo(
    () =>
      removeAccentsText(source, {
        mode,
        removeSymbols,
        removePunct,
        removeEmojis,
        collapseSpaces,
        spaceReplacement,
        toSlug,
      }),
    [source, mode, removeSymbols, removePunct, removeEmojis, collapseSpaces, spaceReplacement, toSlug],
  );

  const copyResult = async () => {
    if (!output.value) return;

    try {
      await navigator.clipboard.writeText(output.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Card className="space-y-5">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        {isPt
          ? 'Processamento local no navegador. Texto nao precisa ser enviado para servidor.'
          : isEs
            ? 'Procesamiento local en navegador. El texto no necesita enviarse al servidor.'
            : 'Local browser processing. Text does not need to be sent to a server.'}
      </section>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">{isPt ? 'Texto original' : isEs ? 'Texto original' : 'Original text'}</span>
        <Textarea value={source} onChange={(event) => setSource(event.target.value)} className="min-h-[170px]" />
      </label>

      <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-2">
        <label className="inline-flex items-center gap-2"><input type="radio" checked={mode === 'keep-case'} onChange={() => setMode('keep-case')} />keep case</label>
        <label className="inline-flex items-center gap-2"><input type="radio" checked={mode === 'lowercase'} onChange={() => setMode('lowercase')} />lowercase</label>
        <label className="inline-flex items-center gap-2"><input type="radio" checked={mode === 'uppercase'} onChange={() => setMode('uppercase')} />UPPERCASE</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={removePunct} onChange={(event) => setRemovePunct(event.target.checked)} />remove punctuation</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={removeSymbols} onChange={(event) => setRemoveSymbols(event.target.checked)} />remove symbols</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={removeEmojis} onChange={(event) => setRemoveEmojis(event.target.checked)} />remove emojis</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={collapseSpaces} onChange={(event) => setCollapseSpaces(event.target.checked)} />collapse spaces</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={toSlug} onChange={(event) => setToSlug(event.target.checked)} />slug mode</label>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <Button variant={spaceReplacement === 'none' ? 'secondary' : 'ghost'} onClick={() => setSpaceReplacement('none')}>space none</Button>
        <Button variant={spaceReplacement === '-' ? 'secondary' : 'ghost'} onClick={() => setSpaceReplacement('-')}>space {'->'} -</Button>
        <Button variant={spaceReplacement === '_' ? 'secondary' : 'ghost'} onClick={() => setSpaceReplacement('_')}>space {'->'} _</Button>
      </div>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">{isPt ? 'Texto sem acentos' : isEs ? 'Texto sin acentos' : 'Accent-free text'}</h3>
        <Textarea value={output.value} onChange={(event) => setSource(event.target.value)} className="min-h-[150px]" />
        <div className="flex flex-wrap gap-3 text-xs text-slate-700">
          <span>{isPt ? 'Caracteres alterados' : isEs ? 'Caracteres alterados' : 'Changed chars'}: {output.changedCount}</span>
          <span>{isPt ? 'Ja estava limpo' : isEs ? 'Ya estaba limpio' : 'Already clean'}: {output.alreadyClean ? 'sim' : 'nao'}</span>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={copyResult}>{copied ? (isPt ? 'Copiado' : isEs ? 'Copiado' : 'Copied') : (isPt ? 'Copiar resultado' : isEs ? 'Copiar resultado' : 'Copy result')}</Button>
        <Button variant="secondary" onClick={() => setSource(output.value)}>{isPt ? 'Substituir original' : isEs ? 'Reemplazar original' : 'Replace original'}</Button>
        <Button variant="secondary" onClick={() => downloadTextFile('texto-sem-acentos.txt', output.value)}>{isPt ? 'Baixar TXT' : isEs ? 'Descargar TXT' : 'Download TXT'}</Button>
        <Button
          variant="ghost"
          onClick={() => {
            setSource('');
            setCopied(false);
          }}
        >
          {isPt ? 'Limpar' : isEs ? 'Limpiar' : 'Clear'}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => setSource(sampleText)}>
          {isPt ? 'Carregar exemplo' : isEs ? 'Cargar ejemplo' : 'Load example'}
        </Button>
      </div>
    </Card>
  );
}
