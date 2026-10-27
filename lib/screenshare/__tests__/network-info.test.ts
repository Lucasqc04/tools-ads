import { describe, expect, it } from 'vitest';
import { classifyBrowserNetwork } from '../network-info';

describe('screen-share network information', () => {
  it('does not infer a cellular network from the effective connection type', () => {
    const result = classifyBrowserNetwork({ effectiveType: '4g', downlink: 10, rtt: 45, saveData: false });
    expect(result.type).toBe('unknown');
    expect(result.typeWasReported).toBe(false);
    expect(result.effectiveType).toBe('4g');
    expect(result.downlinkMbps).toBe(10);
    expect(result.rttMs).toBe(45);
  });

  it.each(['wifi', 'cellular', 'ethernet'] as const)('uses an explicitly reported %s connection type', (type) => {
    expect(classifyBrowserNetwork({ type }).type).toBe(type);
  });

  it('reports missing browser APIs as unknown instead of guessing', () => {
    expect(classifyBrowserNetwork(undefined)).toEqual({
      type: 'unknown', typeWasReported: false, effectiveType: null, saveData: null,
      downlinkMbps: null, rttMs: null, available: false,
    });
  });
});
