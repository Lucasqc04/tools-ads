'use client';

import { type AppLocale } from '@/lib/i18n/config';
import { formatClockTime } from '@/lib/transcription/timestamps';
import type { TranscriptSegment } from '@/lib/transcription/transcription-types';

type TranscriptSegmentsProps = Readonly<{
  segments: TranscriptSegment[];
  currentTime: number | null;
  onSeek?: (seconds: number) => void;
  locale: AppLocale;
}>;

const jumpToLabel: Record<AppLocale, (time: string) => string> = {
  'pt-br': (time) => `Ir para ${time}`,
  en: (time) => `Jump to ${time}`,
  es: (time) => `Ir a ${time}`,
  zh: (time) => `Jump to ${time}`,
};

export function TranscriptSegments({ segments, currentTime, onSeek, locale }: TranscriptSegmentsProps) {
  return (
    <ol className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
      {segments.map((segment, index) => {
        const isActive =
          currentTime !== null && currentTime >= segment.start && currentTime < segment.end;
        const timeLabel = `${formatClockTime(segment.start)} - ${formatClockTime(segment.end)}`;

        return (
          <li
            key={`${segment.start}-${index}`}
            className={`rounded-lg border p-3 transition ${
              isActive ? 'border-brand-400 bg-brand-50' : 'border-slate-200 bg-white'
            }`}
          >
            <button
              type="button"
              onClick={() => onSeek?.(segment.start)}
              disabled={!onSeek}
              aria-label={jumpToLabel[locale](timeLabel)}
              className="mb-1 font-mono text-xs font-semibold text-brand-700 underline-offset-2 hover:underline disabled:no-underline disabled:text-slate-500"
            >
              {timeLabel}
            </button>
            <p className="text-sm leading-6 text-slate-800">{segment.text}</p>
          </li>
        );
      })}
    </ol>
  );
}
