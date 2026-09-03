import { describe, expect, it } from 'vitest';
import { formatClockTime, formatSrtTimestamp, formatVttTimestamp } from '../timestamps';

describe('formatClockTime', () => {
  it('formats 0 seconds', () => {
    expect(formatClockTime(0)).toBe('0:00');
  });

  it('formats sub-minute values', () => {
    expect(formatClockTime(65.234)).toBe('1:05');
  });

  it('formats values past one hour', () => {
    expect(formatClockTime(3661)).toBe('1:01:01');
  });

  it('clamps negative/invalid values to zero', () => {
    expect(formatClockTime(-5)).toBe('0:00');
    expect(formatClockTime(Number.NaN)).toBe('0:00');
  });
});

describe('formatSrtTimestamp', () => {
  it('formats 0 seconds', () => {
    expect(formatSrtTimestamp(0)).toBe('00:00:00,000');
  });

  it('formats fractional seconds with comma separator', () => {
    expect(formatSrtTimestamp(65.234)).toBe('00:01:05,234');
  });

  it('formats values past one hour', () => {
    expect(formatSrtTimestamp(3661.5)).toBe('01:01:01,500');
  });
});

describe('formatVttTimestamp', () => {
  it('formats 0 seconds', () => {
    expect(formatVttTimestamp(0)).toBe('00:00:00.000');
  });

  it('formats fractional seconds with dot separator', () => {
    expect(formatVttTimestamp(65.234)).toBe('00:01:05.234');
  });

  it('formats values past one hour', () => {
    expect(formatVttTimestamp(3661.5)).toBe('01:01:01.500');
  });
});
