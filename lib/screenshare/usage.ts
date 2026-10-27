import { qualityProfiles, type QualityMode } from './protocol';

export const NETWORK_OVERHEAD_FACTOR = 0.08;
export const MIN_PEER_VIDEO_BITRATE_BPS = 250_000;

export type TrafficEstimate = {
  mediaMbps: number;
  mediaGBPerHour: number;
  overheadMbps: number;
  overheadGBPerHour: number;
  totalMbps: number;
  totalGBPerHour: number;
};

export const getNominalVideoBitrate = (mode: QualityMode): number =>
  mode === 'automatic' ? qualityProfiles.maximum.maxBitrate : qualityProfiles[mode].maxBitrate;

export const estimateUploadTraffic = (
  videoBitrateBps: number,
  viewers: number,
  overheadFactor = NETWORK_OVERHEAD_FACTOR,
  audioBitrateBps = 0,
): TrafficEstimate => {
  const count = Math.max(0, Math.floor(viewers));
  const safeBitrate = Math.max(0, videoBitrateBps) + Math.max(0, audioBitrateBps);
  const mediaMbps = (safeBitrate * count) / 1_000_000;
  const overheadMbps = mediaMbps * Math.max(0, overheadFactor);
  const mediaGBPerHour = (mediaMbps * 1_000_000 * 3_600) / 8 / 1_000_000_000;
  const overheadGBPerHour = (overheadMbps * 1_000_000 * 3_600) / 8 / 1_000_000_000;
  return {
    mediaMbps,
    mediaGBPerHour,
    overheadMbps,
    overheadGBPerHour,
    totalMbps: mediaMbps + overheadMbps,
    totalGBPerHour: mediaGBPerHour + overheadGBPerHour,
  };
};

export const allocatePeerBitrate = ({
  budgetMbps,
  activeViewers,
  profileCeilingBps,
  viewerPrefersEconomy,
  audioPerViewerBps = 0,
  overheadFactor = NETWORK_OVERHEAD_FACTOR,
}: {
  budgetMbps: number;
  activeViewers: number;
  profileCeilingBps: number;
  viewerPrefersEconomy?: boolean;
  audioPerViewerBps?: number;
  overheadFactor?: number;
}): { bitrateBps: number; budgetShortfall: boolean; mediaBudgetMbps: number } => {
  const count = Math.max(1, Math.floor(activeViewers));
  const totalTargetBps = Math.max(0, budgetMbps) * 1_000_000;
  const mediaBudgetBps = totalTargetBps / (1 + Math.max(0, overheadFactor));
  const shareBps = mediaBudgetBps / count;
  const videoShareBps = Math.max(0, shareBps - Math.max(0, audioPerViewerBps));
  const bitrateBps = Math.max(
    MIN_PEER_VIDEO_BITRATE_BPS,
    Math.min(
      profileCeilingBps,
      videoShareBps,
      viewerPrefersEconomy ? qualityProfiles.economy.maxBitrate : Number.POSITIVE_INFINITY,
    ),
  );
  return {
    bitrateBps,
    budgetShortfall: videoShareBps < MIN_PEER_VIDEO_BITRATE_BPS,
    mediaBudgetMbps: mediaBudgetBps / 1_000_000,
  };
};

export type ByteCounterState = Map<string, number>;

export const measureOutboundMediaDelta = (
  reports: Iterable<{ id?: string; type?: string; kind?: string; mediaType?: string; bytesSent?: number }>,
  previous: ByteCounterState,
): { deltaBytes: number; currentBytes: number; next: ByteCounterState } => {
  const next = new Map(previous);
  let deltaBytes = 0;
  let currentBytes = 0;
  const seen = new Set<string>();

  for (const report of reports) {
    if (report.type !== 'outbound-rtp' || (report.kind !== 'video' && report.kind !== 'audio' && report.mediaType !== 'video' && report.mediaType !== 'audio')) continue;
    if (!report.id || !Number.isFinite(report.bytesSent) || seen.has(report.id)) continue;
    seen.add(report.id);
    const bytes = Math.max(0, Number(report.bytesSent));
    const oldBytes = next.get(report.id);
    deltaBytes += oldBytes === undefined ? bytes : bytes >= oldBytes ? bytes - oldBytes : bytes;
    next.set(report.id, bytes);
    currentBytes += bytes;
  }

  return { deltaBytes, currentBytes, next };
};

export const measureInboundMediaDelta = (
  reports: Iterable<{ id?: string; type?: string; kind?: string; mediaType?: string; bytesReceived?: number }>,
  previous: ByteCounterState,
): { deltaBytes: number; currentBytes: number; next: ByteCounterState } => {
  const next = new Map(previous);
  let deltaBytes = 0;
  let currentBytes = 0;
  const seen = new Set<string>();

  for (const report of reports) {
    if (report.type !== 'inbound-rtp' || (report.kind !== 'video' && report.kind !== 'audio' && report.mediaType !== 'video' && report.mediaType !== 'audio')) continue;
    if (!report.id || !Number.isFinite(report.bytesReceived) || seen.has(report.id)) continue;
    seen.add(report.id);
    const bytes = Math.max(0, Number(report.bytesReceived));
    const oldBytes = next.get(report.id);
    deltaBytes += oldBytes === undefined ? bytes : bytes >= oldBytes ? bytes - oldBytes : bytes;
    next.set(report.id, bytes);
    currentBytes += bytes;
  }

  return { deltaBytes, currentBytes, next };
};

export const getConsumptionThresholds = (limitBytes: number | null): number[] =>
  limitBytes && limitBytes > 0
    ? [0.5, 0.8, 1].map((fraction) => Math.ceil(limitBytes * fraction))
    : [];

export const getConsumptionPercent = (bytes: number, limitBytes: number | null): number | null =>
  limitBytes && limitBytes > 0 ? Math.min(100, (bytes / limitBytes) * 100) : null;

export const getProjectedHourlyBytes = (sessionBytes: number, elapsedMs: number): number | null =>
  elapsedMs > 5_000 ? (sessionBytes / elapsedMs) * 3_600_000 : null;

export const formatDataAmount = (bytes: number): string => {
  const safeBytes = Math.max(0, bytes);
  if (safeBytes < 1_000) return `${Math.round(safeBytes)} B`;
  if (safeBytes < 1_000_000) return `${(safeBytes / 1_000).toFixed(safeBytes < 10_000 ? 1 : 0)} kB`;
  if (safeBytes < 1_000_000_000) return `${(safeBytes / 1_000_000).toFixed(2)} MB`;
  return `${(safeBytes / 1_000_000_000).toFixed(2)} GB`;
};
