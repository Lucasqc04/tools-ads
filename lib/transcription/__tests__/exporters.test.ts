import { describe, expect, it } from 'vitest';
import {
  buildExportFileName,
  buildTranscriptionJson,
  segmentsToPlainText,
  segmentsToSrt,
  segmentsToTimestampedText,
  segmentsToVtt,
} from '../exporters';
import type { TranscriptResult, TranscriptSegment } from '../transcription-types';

const segments: TranscriptSegment[] = [
  { start: 0, end: 4.5, text: 'Hello there.' },
  { start: 4.5, end: 8, text: 'Second segment.' },
];

describe('segmentsToPlainText', () => {
  it('joins segments into a single continuous string', () => {
    expect(segmentsToPlainText(segments)).toBe('Hello there. Second segment.');
  });

  it('filters out empty segments', () => {
    expect(segmentsToPlainText([{ start: 0, end: 1, text: '   ' }, ...segments])).toBe(
      'Hello there. Second segment.',
    );
  });
});

describe('segmentsToTimestampedText', () => {
  it('renders each segment with a clock-time range header', () => {
    expect(segmentsToTimestampedText(segments)).toBe(
      '[0:00 - 0:04]\nHello there.\n\n[0:04 - 0:08]\nSecond segment.',
    );
  });
});

describe('segmentsToSrt', () => {
  it('formats sequential SRT cues', () => {
    const srt = segmentsToSrt(segments);
    expect(srt).toBe(
      '1\n00:00:00,000 --> 00:00:04,500\nHello there.\n\n2\n00:00:04,500 --> 00:00:08,000\nSecond segment.\n',
    );
  });

  it('escapes markup-like characters', () => {
    const srt = segmentsToSrt([{ start: 0, end: 1, text: 'A <tag> & more' }]);
    expect(srt).toContain('A &lt;tag&gt; &amp; more');
  });
});

describe('segmentsToVtt', () => {
  it('starts with the WEBVTT header and dot-separated timestamps', () => {
    const vtt = segmentsToVtt(segments);
    expect(vtt.startsWith('WEBVTT\n\n')).toBe(true);
    expect(vtt).toContain('00:00:00.000 --> 00:00:04.500');
    expect(vtt).toContain('00:00:04.500 --> 00:00:08.000');
  });
});

describe('buildTranscriptionJson', () => {
  it('serializes only the documented fields', () => {
    const result: TranscriptResult = {
      fileName: 'meeting.mp4',
      duration: 8,
      language: 'en',
      model: 'Xenova/whisper-base',
      text: 'Hello there. Second segment.',
      segments,
    };

    const parsed = JSON.parse(buildTranscriptionJson(result));
    expect(parsed).toEqual({
      fileName: 'meeting.mp4',
      duration: 8,
      language: 'en',
      model: 'Xenova/whisper-base',
      text: 'Hello there. Second segment.',
      segments,
    });
  });
});

describe('buildExportFileName', () => {
  it('strips the original extension and applies the export extension', () => {
    expect(buildExportFileName('reuniao-equipe.mp4', 'srt')).toBe('reuniao-equipe.srt');
    expect(buildExportFileName('reuniao-equipe.mp4', 'vtt')).toBe('reuniao-equipe.vtt');
    expect(buildExportFileName('reuniao-equipe.mp4', 'json')).toBe('reuniao-equipe.json');
    expect(buildExportFileName('reuniao-equipe.mp4', 'txt')).toBe('reuniao-equipe.txt');
    expect(buildExportFileName('reuniao-equipe.mp4', 'txt-timestamped')).toBe('reuniao-equipe.txt');
  });

  it('sanitizes accents and unsafe characters', () => {
    expect(buildExportFileName('reunião de equipe #1.wav', 'txt')).toBe('reuniao-de-equipe-1.txt');
  });

  it('falls back to a default name when nothing survives sanitization', () => {
    expect(buildExportFileName('***.wav', 'txt')).toBe('transcricao.txt');
  });
});
