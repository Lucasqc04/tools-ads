import { formatClockTime, formatSrtTimestamp, formatVttTimestamp } from './timestamps';
import type { TranscriptResult, TranscriptSegment } from './transcription-types';

/** Escapes characters that both SRT and WebVTT players treat as markup. */
const escapeSubtitleText = (text: string): string =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export const segmentsToPlainText = (segments: TranscriptSegment[]): string =>
  segments
    .map((segment) => segment.text.trim())
    .filter(Boolean)
    .join(' ')
    .replaceAll(/\s+/g, ' ')
    .trim();

export const segmentsToTimestampedText = (segments: TranscriptSegment[]): string =>
  segments
    .map(
      (segment) =>
        `[${formatClockTime(segment.start)} - ${formatClockTime(segment.end)}]\n${segment.text.trim()}`,
    )
    .join('\n\n');

export const segmentsToSrt = (segments: TranscriptSegment[]): string =>
  segments
    .map((segment, index) => {
      const start = formatSrtTimestamp(segment.start);
      const end = formatSrtTimestamp(segment.end);
      const text = escapeSubtitleText(segment.text.trim());

      return `${index + 1}\n${start} --> ${end}\n${text}`;
    })
    .join('\n\n')
    .concat('\n');

export const segmentsToVtt = (segments: TranscriptSegment[]): string => {
  const body = segments
    .map((segment) => {
      const start = formatVttTimestamp(segment.start);
      const end = formatVttTimestamp(segment.end);
      const text = escapeSubtitleText(segment.text.trim());

      return `${start} --> ${end}\n${text}`;
    })
    .join('\n\n');

  return `WEBVTT\n\n${body}\n`;
};

export const buildTranscriptionJson = (result: TranscriptResult): string =>
  JSON.stringify(
    {
      fileName: result.fileName,
      duration: result.duration,
      language: result.language,
      model: result.model,
      text: result.text,
      segments: result.segments,
    },
    null,
    2,
  );

const sanitizeBaseName = (fileName: string): string => {
  const withoutExtension = fileName.replace(/\.[^./\\]+$/, '');
  const normalized = withoutExtension
    .trim()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^a-zA-Z0-9-_]+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

  return normalized || 'transcricao';
};

export type TranscriptExportFormat = 'txt' | 'txt-timestamped' | 'srt' | 'vtt' | 'json';

const EXTENSION_BY_FORMAT: Record<TranscriptExportFormat, string> = {
  txt: 'txt',
  'txt-timestamped': 'txt',
  srt: 'srt',
  vtt: 'vtt',
  json: 'json',
};

export const buildExportFileName = (
  originalFileName: string,
  format: TranscriptExportFormat,
): string => `${sanitizeBaseName(originalFileName)}.${EXTENSION_BY_FORMAT[format]}`;
