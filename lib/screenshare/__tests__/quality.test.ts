import { describe, expect, it } from 'vitest';
import { chooseAutomaticCaptureLevel, classifyConnection, computeConnectionMetrics, getPeerBitrateCeiling, type ConnectionMetrics } from '../quality';

const blankMetrics = (overrides: Partial<ConnectionMetrics> = {}): ConnectionMetrics => ({
  bitrateBps: null, roundTripMs: null, packetLossPercent: null, framesPerSecond: null,
  width: null, height: null, framesDropped: null, candidateType: null, connection: null,
  ...overrides,
});

describe('WebRTC connection quality', () => {
  it('uses reported counters for bitrate, RTT, resolution, frames, and ICE route', () => {
    const first = computeConnectionMetrics([
      { id: 'out-video', type: 'outbound-rtp', kind: 'video', timestamp: 1_000, bytesSent: 1_000, framesSent: 60, frameWidth: 1280, frameHeight: 720 },
      { id: 'pair', type: 'candidate-pair', state: 'succeeded', nominated: true, currentRoundTripTime: 0.08, localCandidateId: 'local', remoteCandidateId: 'remote' },
      { id: 'local', type: 'local-candidate', candidateType: 'host' },
      { id: 'remote', type: 'remote-candidate', candidateType: 'srflx' },
    ], 'outbound', null, 1_000);
    const second = computeConnectionMetrics([
      { id: 'out-video', type: 'outbound-rtp', kind: 'video', timestamp: 3_000, bytesSent: 251_000, framesSent: 120, frameWidth: 1280, frameHeight: 720 },
      { id: 'pair', type: 'candidate-pair', state: 'succeeded', nominated: true, currentRoundTripTime: 0.08, localCandidateId: 'local', remoteCandidateId: 'remote' },
      { id: 'local', type: 'local-candidate', candidateType: 'host' },
      { id: 'remote', type: 'remote-candidate', candidateType: 'srflx' },
    ], 'outbound', first.baseline, 3_000);

    expect(second.metrics.bitrateBps).toBe(1_000_000);
    expect(second.metrics.roundTripMs).toBe(80);
    expect(second.metrics.framesPerSecond).toBe(30);
    expect(second.metrics.width).toBe(1280);
    expect(second.metrics.height).toBe(720);
    expect(second.metrics.connection).toBe('direct');
  });

  it('does not invent connection metrics when the browser provides none', () => {
    expect(classifyConnection(blankMetrics())).toBe('unknown');
    expect(getPeerBitrateCeiling('automatic', blankMetrics(), 1_000_000, 60)).toBe(1_000_000);
  });

  it('uses documented thresholds and waits before changing shared capture quality', () => {
    expect(classifyConnection(blankMetrics({ roundTripMs: 100, packetLossPercent: 0.5, bitrateBps: 1_500_000 }))).toBe('excellent');
    expect(classifyConnection(blankMetrics({ roundTripMs: 400 }))).toBe('unstable');
    const congested = [blankMetrics({ roundTripMs: 400 }), blankMetrics({ roundTripMs: 420 }), blankMetrics({ roundTripMs: 100 })];
    expect(chooseAutomaticCaptureLevel({ metrics: congested, current: 'high', currentSince: 1_000, now: 9_000 })).toBe('high');
    expect(chooseAutomaticCaptureLevel({ metrics: congested, current: 'high', currentSince: 1_000, now: 12_000 })).toBe('balanced');
  });
});
