const clampNonNegative = (seconds: number): number =>
  Number.isFinite(seconds) && seconds > 0 ? seconds : 0;

/** "m:ss" or "h:mm:ss", used in the UI segment list. */
export const formatClockTime = (seconds: number): string => {
  const safeSeconds = clampNonNegative(seconds);
  const totalSeconds = Math.floor(safeSeconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${minutes}:${String(secs).padStart(2, '0')}`;
};

const formatTimestamp = (seconds: number, millisecondsSeparator: ',' | '.'): string => {
  const safeSeconds = clampNonNegative(seconds);
  const totalMilliseconds = Math.round(safeSeconds * 1000);
  const hours = Math.floor(totalMilliseconds / 3_600_000);
  const minutes = Math.floor((totalMilliseconds % 3_600_000) / 60_000);
  const secs = Math.floor((totalMilliseconds % 60_000) / 1000);
  const milliseconds = totalMilliseconds % 1000;

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(secs).padStart(2, '0'),
  ].join(':') + millisecondsSeparator + String(milliseconds).padStart(3, '0');
};

/** SRT format: HH:MM:SS,mmm */
export const formatSrtTimestamp = (seconds: number): string => formatTimestamp(seconds, ',');

/** WebVTT format: HH:MM:SS.mmm */
export const formatVttTimestamp = (seconds: number): string => formatTimestamp(seconds, '.');
