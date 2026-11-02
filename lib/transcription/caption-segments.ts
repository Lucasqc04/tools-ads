import type { TranscriptSegment } from './transcription-types';

export const CAPTION_LINE_LENGTH = 42;

/** Split long Whisper chunks into short, readable cues while retaining their timing range. */
export const buildCaptionSegments = (
  segments: TranscriptSegment[],
  maxCharacters = CAPTION_LINE_LENGTH,
): TranscriptSegment[] =>
  segments.flatMap((segment) => {
    const words = segment.text.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return [];
    }

    const groups: string[] = [];
    let current = '';

    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (current && next.length > maxCharacters) {
        groups.push(current);
        current = word;
      } else {
        current = next;
      }

      if (current.length >= maxCharacters && /[.!?…]$/.test(current)) {
        groups.push(current);
        current = '';
      }
    }

    if (current) {
      groups.push(current);
    }

    if (groups.length === 1) {
      return [{ ...segment, text: groups[0] }];
    }

    const weights = groups.map((group) => Math.max(1, group.replaceAll(/\s+/g, '').length));
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const duration = Math.max(0, segment.end - segment.start);
    let elapsedWeight = 0;

    return groups.map((text, index) => {
      const start = segment.start + (duration * elapsedWeight) / totalWeight;
      elapsedWeight += weights[index];
      const end =
        index === groups.length - 1
          ? segment.end
          : segment.start + (duration * elapsedWeight) / totalWeight;

      return { start, end, text };
    });
  });
