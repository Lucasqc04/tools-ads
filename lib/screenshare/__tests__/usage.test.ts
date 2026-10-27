import { describe, expect, it } from 'vitest';
import {
  allocatePeerBitrate,
  estimateUploadTraffic,
  formatDataAmount,
  getNominalVideoBitrate,
  getConsumptionPercent,
  getConsumptionThresholds,
  getProjectedHourlyBytes,
  measureInboundMediaDelta,
  measureOutboundMediaDelta,
} from '../usage';
import { loadShareScreenPreferences, defaultShareScreenPreferences } from '../preferences';

describe('screen-share traffic calculations', () => {
  it('converts 5 Mbps into decimal GB per hour and keeps network overhead separate', () => {
    const oneViewer = estimateUploadTraffic(5_000_000, 1);
    const twoViewers = estimateUploadTraffic(5_000_000, 2);

    expect(oneViewer.mediaGBPerHour).toBeCloseTo(2.25, 8);
    expect(oneViewer.overheadGBPerHour).toBeCloseTo(0.18, 8);
    expect(oneViewer.totalGBPerHour).toBeCloseTo(2.43, 8);
    expect(twoViewers.mediaMbps).toBe(10);
    expect(twoViewers.mediaGBPerHour).toBeCloseTo(4.5, 8);
    expect(estimateUploadTraffic(5_000_000, 1, undefined, 128_000).mediaGBPerHour).toBeCloseTo(2.3076, 4);
    expect(estimateUploadTraffic(5_000_000, 5).mediaGBPerHour).toBeCloseTo(11.25, 8);
    expect(estimateUploadTraffic(5_000_000, 10).mediaGBPerHour).toBeCloseTo(22.5, 8);
    expect(getNominalVideoBitrate('automatic')).toBe(7_000_000);
  });

  it('splits the total upload target per viewer and reports a minimum-quality shortfall', () => {
    const normal = allocatePeerBitrate({ budgetMbps: 10, activeViewers: 2, profileCeilingBps: 5_000_000, audioPerViewerBps: 128_000 });
    const saver = allocatePeerBitrate({ budgetMbps: 10, activeViewers: 2, profileCeilingBps: 5_000_000, viewerPrefersEconomy: true });
    const insufficient = allocatePeerBitrate({ budgetMbps: 1, activeViewers: 5, profileCeilingBps: 5_000_000 });

    expect(normal.bitrateBps).toBeGreaterThan(4_000_000);
    expect(normal.budgetShortfall).toBe(false);
    expect(saver.bitrateBps).toBe(1_200_000);
    expect(insufficient.bitrateBps).toBe(250_000);
    expect(insufficient.budgetShortfall).toBe(true);
  });

  it('counts each media report once, adds independent peer counters and handles counter resets', () => {
    const initial = measureOutboundMediaDelta([
      { id: 'video-peer-a', type: 'outbound-rtp', kind: 'video', bytesSent: 1_000 },
      { id: 'video-peer-a', type: 'outbound-rtp', kind: 'video', bytesSent: 1_000 },
      { id: 'audio-peer-a', type: 'outbound-rtp', kind: 'audio', bytesSent: 300 },
      { id: 'candidate', type: 'candidate-pair', bytesSent: 900_000 },
    ], new Map());
    const next = measureOutboundMediaDelta([
      { id: 'video-peer-a', type: 'outbound-rtp', kind: 'video', bytesSent: 1_700 },
      { id: 'audio-peer-a', type: 'outbound-rtp', kind: 'audio', bytesSent: 450 },
      { id: 'video-peer-b', type: 'outbound-rtp', kind: 'video', bytesSent: 500 },
    ], initial.next);

    expect(initial.deltaBytes).toBe(1_300);
    expect(next.deltaBytes).toBe(1_350);
    expect(next.currentBytes).toBe(2_650);
    expect(measureOutboundMediaDelta([{ id: 'reset', type: 'outbound-rtp', kind: 'video', bytesSent: 100 }], new Map([['reset', 500]])).deltaBytes).toBe(100);
  });

  it('uses received media counters and session thresholds without inventing estimates', () => {
    const received = measureInboundMediaDelta([
      { id: 'inbound-video', type: 'inbound-rtp', kind: 'video', bytesReceived: 8_000 },
      { id: 'inbound-audio', type: 'inbound-rtp', kind: 'audio', bytesReceived: 1_000 },
    ], new Map());
    const limit = 1_000_000_000;

    expect(received.deltaBytes).toBe(9_000);
    expect(getConsumptionThresholds(limit)).toEqual([500_000_000, 800_000_000, 1_000_000_000]);
    expect(getConsumptionPercent(500_000_000, limit)).toBe(50);
    expect(getProjectedHourlyBytes(10_000_000, 10_000)).toBe(3_600_000_000);
    expect(getProjectedHourlyBytes(10_000_000, 5_000)).toBeNull();
    expect(formatDataAmount(500)).toBe('500 B');
    expect(formatDataAmount(5_000)).toBe('5.0 kB');
    expect(formatDataAmount(500_000_000)).toBe('500.00 MB');
    expect(formatDataAmount(2_250_000_000)).toBe('2.25 GB');
  });

  it('defaults to a protective one-gigabyte session stop and sanitizes stored preferences', () => {
    expect(defaultShareScreenPreferences.sessionLimitBytes).toBe(1_000_000_000);
    expect(defaultShareScreenPreferences.alertPolicy).toBe('stop');
    const loaded = loadShareScreenPreferences(JSON.stringify({ qualityMode: 'fake', viewerLimit: 999, dataSaver: 'yes', alertPolicy: 'delete' }));
    expect(loaded.qualityMode).toBe('automatic');
    expect(loaded.viewerLimit).toBe(5);
    expect(loaded.dataSaver).toBe(false);
    expect(loaded.alertPolicy).toBe('stop');
  });
});
