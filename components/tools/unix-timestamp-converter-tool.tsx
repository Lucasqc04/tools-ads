'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { AppLocale } from '@/lib/i18n/config';
import {
  getNowTimestamp,
  parseTimestampInput,
  toUnixFromDateTime,
} from '@/lib/unix-timestamp';

type UnixTimestampConverterToolProps = Readonly<{ locale?: AppLocale }>;

type UnixUi = {
  localNote: string;
  forwardTitle: string;
  forwardPlaceholder: string;
  localLabel: string;
  relativeLabel: string;
  statusLabel: string;
  futureLabel: string;
  pastLabel: string;
  copied: string;
  copySeconds: string;
  copyMilliseconds: string;
  reverseTitle: string;
  secondsLabel: string;
  millisecondsLabel: string;
  useNow: string;
  clear: string;
  liveNowLabel: string;
};

const uiByLocale: Record<AppLocale, UnixUi> = {
  'pt-br': {
    localNote: 'Conversao local no navegador. Ideal para logs, API, JWT e banco de dados.',
    forwardTitle: 'Timestamp -> Data',
    forwardPlaceholder: 'Ex.: 1716890240 ou 1716890240000',
    localLabel: 'Local',
    relativeLabel: 'Relativo',
    statusLabel: 'Status',
    futureLabel: 'Futuro',
    pastLabel: 'Passado',
    copied: 'Copiado',
    copySeconds: 'Copiar segundos',
    copyMilliseconds: 'Copiar milissegundos',
    reverseTitle: 'Data -> Timestamp',
    secondsLabel: 'Segundos',
    millisecondsLabel: 'Milissegundos',
    useNow: 'Usar agora',
    clear: 'Limpar',
    liveNowLabel: 'Timestamp atual (tempo real):',
  },
  en: {
    localNote: 'Local conversion in browser. Useful for logs, APIs, JWT, and databases.',
    forwardTitle: 'Timestamp -> Date',
    forwardPlaceholder: 'e.g. 1716890240 or 1716890240000',
    localLabel: 'Local',
    relativeLabel: 'Relative',
    statusLabel: 'Status',
    futureLabel: 'Future',
    pastLabel: 'Past',
    copied: 'Copied',
    copySeconds: 'Copy seconds',
    copyMilliseconds: 'Copy milliseconds',
    reverseTitle: 'Date -> Timestamp',
    secondsLabel: 'Seconds',
    millisecondsLabel: 'Milliseconds',
    useNow: 'Use now',
    clear: 'Clear',
    liveNowLabel: 'Current timestamp (real-time):',
  },
  es: {
    localNote: 'Conversion local en el navegador. Ideal para logs, API, JWT y base de datos.',
    forwardTitle: 'Timestamp -> Fecha',
    forwardPlaceholder: 'Ej.: 1716890240 o 1716890240000',
    localLabel: 'Local',
    relativeLabel: 'Relativo',
    statusLabel: 'Estado',
    futureLabel: 'Futuro',
    pastLabel: 'Pasado',
    copied: 'Copiado',
    copySeconds: 'Copiar segundos',
    copyMilliseconds: 'Copiar milisegundos',
    reverseTitle: 'Fecha -> Timestamp',
    secondsLabel: 'Segundos',
    millisecondsLabel: 'Milisegundos',
    useNow: 'Usar ahora',
    clear: 'Limpiar',
    liveNowLabel: 'Timestamp actual (tiempo real):',
  },
};

export function UnixTimestampConverterTool({ locale = 'pt-br' }: UnixTimestampConverterToolProps) {
  const ui = uiByLocale[locale];

  const [timestampInput, setTimestampInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [liveNow, setLiveNow] = useState(getNowTimestamp());
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const id = setInterval(() => setLiveNow(getNowTimestamp()), 1000);
    return () => clearInterval(id);
  }, []);

  const forward = useMemo(() => parseTimestampInput(timestampInput), [timestampInput]);
  const reverse = useMemo(() => toUnixFromDateTime(dateInput, timeInput), [dateInput, timeInput]);
  const forwardStatusLabel = forward.isFuture ? ui.futureLabel : ui.pastLabel;
  const copySecondsLabel = copied === 's' ? ui.copied : ui.copySeconds;
  const copyMsLabel = copied === 'ms' ? ui.copied : ui.copyMilliseconds;

  const copyValue = async (key: string, value?: string | number) => {
    if (value === undefined) return;

    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(key);
      setTimeout(() => setCopied(''), 1300);
    } catch {
      setCopied('');
    }
  };

  return (
    <Card className="space-y-6">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        {ui.localNote}
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-slate-900">{ui.forwardTitle}</h3>
        <Input
          value={timestampInput}
          onChange={(event) => setTimestampInput(event.target.value)}
          placeholder={ui.forwardPlaceholder}
        />

        {forward.ok ? (
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
            <p>UTC: {forward.isoUtc}</p>
            <p>{ui.localLabel}: {forward.localDateTime}</p>
            <p>Timezone: {forward.timezone}</p>
            <p>{ui.relativeLabel}: {forward.relative}</p>
            <p>{ui.statusLabel}: {forwardStatusLabel}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => copyValue('s', forward.seconds)}>
                {copySecondsLabel}
              </Button>
              <Button variant="secondary" onClick={() => copyValue('ms', forward.ms)}>
                {copyMsLabel}
              </Button>
            </div>
          </div>
        ) : (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{forward.error}</p>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-slate-900">{ui.reverseTitle}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Input type="date" value={dateInput} onChange={(event) => setDateInput(event.target.value)} />
          <Input type="time" value={timeInput} onChange={(event) => setTimeInput(event.target.value)} />
        </div>

        {reverse.ok ? (
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
            <p>UTC: {reverse.isoUtc}</p>
            <p>{ui.localLabel}: {reverse.localDateTime}</p>
            <p>{ui.secondsLabel}: {reverse.seconds}</p>
            <p>{ui.millisecondsLabel}: {reverse.ms}</p>
          </div>
        ) : (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{reverse.error}</p>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => setTimestampInput(String(Date.now()))}>
          {ui.useNow}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setTimestampInput('');
            setDateInput('');
            setTimeInput('');
          }}
        >
          {ui.clear}
        </Button>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p>
          {ui.liveNowLabel}
          {' '}
          {liveNow.seconds} / {liveNow.ms}
        </p>
      </section>
    </Card>
  );
}
