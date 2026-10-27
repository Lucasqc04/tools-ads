import { qualityProfiles, type ManualQualityProfile, type QualityMode } from './protocol';

export type RtcStat = {
  id?: string;
  type?: string;
  timestamp?: number;
  [key: string]: unknown;
};

export type ConnectionMetrics = {
  bitrateBps: number | null;
  roundTripMs: number | null;
  packetLossPercent: number | null;
  framesPerSecond: number | null;
  width: number | null;
  height: number | null;
  framesDropped: number | null;
  candidateType: string | null;
  connection: 'direct' | 'relayed' | null;
};

export type StatsBaseline = {
  timestamp: number;
  bytes: number | null;
  packetsLost: number | null;
  packetsTotal: number | null;
  frames: number | null;
};

export type ConnectionQuality = 'excellent' | 'stable' | 'unstable' | 'unknown';

const finiteNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const findFirst = (stats: readonly RtcStat[], type: string): RtcStat | undefined =>
  stats.find((item) => item.type === type);

const getCandidatePair = (stats: readonly RtcStat[]): RtcStat | undefined => {
  const transport = findFirst(stats, 'transport');
  const selectedId = typeof transport?.selectedCandidatePairId === 'string'
    ? transport.selectedCandidatePairId
    : null;
  return (selectedId ? stats.find((item) => item.id === selectedId) : undefined) ??
    stats.find((item) => item.type === 'candidate-pair' && (item.selected === true || (item.nominated === true && item.state === 'succeeded')));
};

export const computeConnectionMetrics = (
  reports: Iterable<RtcStat>,
  direction: 'inbound' | 'outbound',
  previous: StatsBaseline | null,
  now = Date.now(),
): { metrics: ConnectionMetrics; baseline: StatsBaseline } => {
  const stats = Array.from(reports);
  const mediaType = direction === 'inbound' ? 'inbound-rtp' : 'outbound-rtp';
  const media = stats.find((item) => item.type === mediaType && item.kind === 'video') ??
    findFirst(stats, mediaType);
  const remoteInbound = findFirst(stats, 'remote-inbound-rtp');
  const candidatePair = getCandidatePair(stats);
  const timestamp = finiteNumber(media?.timestamp) ?? now;
  const bytes = finiteNumber(direction === 'inbound' ? media?.bytesReceived : media?.bytesSent);
  const packetsLost = finiteNumber(direction === 'inbound' ? media?.packetsLost : remoteInbound?.packetsLost);
  const packetsReceived = finiteNumber(direction === 'inbound' ? media?.packetsReceived : remoteInbound?.packetsReceived);
  const packetsTotal = packetsLost !== null || packetsReceived !== null
    ? Math.max(0, (packetsLost ?? 0) + (packetsReceived ?? 0))
    : null;
  const frames = finiteNumber(direction === 'inbound' ? media?.framesReceived : media?.framesSent);
  const elapsedMs = previous ? Math.max(1, timestamp - previous.timestamp) : 0;
  const byteDelta = bytes !== null && previous?.bytes !== null && previous ? Math.max(0, bytes - previous.bytes) : null;
  const frameDelta = frames !== null && previous?.frames !== null && previous ? Math.max(0, frames - previous.frames) : null;
  const lostDelta = packetsLost !== null && previous?.packetsLost !== null && previous ? Math.max(0, packetsLost - previous.packetsLost) : null;
  const totalDelta = packetsTotal !== null && previous?.packetsTotal !== null && previous ? Math.max(0, packetsTotal - previous.packetsTotal) : null;
  const measuredLoss = lostDelta !== null && totalDelta !== null && totalDelta > 0
    ? (lostDelta / totalDelta) * 100
    : direction === 'outbound' && finiteNumber(remoteInbound?.fractionLost) !== null
      ? (finiteNumber(remoteInbound?.fractionLost) as number) * 100
      : packetsTotal !== null && packetsTotal > 0
        ? ((packetsLost ?? 0) / packetsTotal) * 100
        : null;

  const localCandidate = stats.find((item) => item.type === 'local-candidate' && item.id === candidatePair?.localCandidateId);
  const remoteCandidate = stats.find((item) => item.type === 'remote-candidate' && item.id === candidatePair?.remoteCandidateId);
  const localCandidateType = typeof localCandidate?.candidateType === 'string' ? localCandidate.candidateType : null;
  const remoteCandidateType = typeof remoteCandidate?.candidateType === 'string' ? remoteCandidate.candidateType : null;
  const candidateType = localCandidateType && remoteCandidateType
    ? `${localCandidateType}/${remoteCandidateType}`
    : localCandidateType ?? remoteCandidateType;
  const connection = localCandidateType === 'relay' || remoteCandidateType === 'relay'
    ? 'relayed'
    : candidateType
      ? 'direct'
      : null;

  const framesPerSecond = finiteNumber(media?.framesPerSecond) ??
    (frameDelta !== null && elapsedMs > 0 ? (frameDelta * 1_000) / elapsedMs : null);
  const metrics: ConnectionMetrics = {
    bitrateBps: byteDelta !== null && elapsedMs > 0 ? (byteDelta * 8 * 1_000) / elapsedMs : null,
    roundTripMs: finiteNumber(remoteInbound?.roundTripTime) !== null
      ? (finiteNumber(remoteInbound?.roundTripTime) as number) * 1_000
      : finiteNumber(candidatePair?.currentRoundTripTime) !== null
        ? (finiteNumber(candidatePair?.currentRoundTripTime) as number) * 1_000
        : null,
    packetLossPercent: measuredLoss,
    framesPerSecond,
    width: finiteNumber(media?.frameWidth),
    height: finiteNumber(media?.frameHeight),
    framesDropped: finiteNumber(media?.framesDropped),
    candidateType,
    connection,
  };

  return {
    metrics,
    baseline: { timestamp, bytes, packetsLost, packetsTotal, frames },
  };
};

export const classifyConnection = (metrics: ConnectionMetrics): ConnectionQuality => {
  if (metrics.roundTripMs === null && metrics.packetLossPercent === null && metrics.bitrateBps === null) {
    return 'unknown';
  }

  const rtt = metrics.roundTripMs;
  const loss = metrics.packetLossPercent;
  if ((rtt !== null && rtt >= 350) || (loss !== null && loss >= 4) || (metrics.bitrateBps !== null && metrics.bitrateBps < 250_000)) {
    return 'unstable';
  }
  if ((rtt === null || rtt < 120) && (loss === null || loss < 1) && (metrics.bitrateBps === null || metrics.bitrateBps >= 1_000_000)) {
    return 'excellent';
  }
  return 'stable';
};

export type AutomaticCaptureLevel = 'economy' | 'balanced' | 'high';

export const getInitialCaptureConstraints = (mode: QualityMode, prioritizeMotion = false) => {
  const profile = mode === 'automatic' ? qualityProfiles.balanced : qualityProfiles[mode];
  const selectedProfile = mode === 'automatic' && prioritizeMotion ? qualityProfiles.fluid : profile;
  return {
    width: { ideal: selectedProfile.width },
    height: { ideal: selectedProfile.height },
    frameRate: { ideal: selectedProfile.frameRate, max: selectedProfile.frameRate },
  };
};

const captureLevels: AutomaticCaptureLevel[] = ['economy', 'balanced', 'high'];

export const chooseAutomaticCaptureLevel = ({
  metrics,
  current,
  currentSince,
  now,
}: {
  metrics: readonly ConnectionMetrics[];
  current: AutomaticCaptureLevel;
  currentSince: number;
  now: number;
}): AutomaticCaptureLevel => {
  if (metrics.length === 0) return current;
  const majority = Math.floor(metrics.length / 2) + 1;
  const congested = metrics.filter((item) =>
    (item.packetLossPercent !== null && item.packetLossPercent >= 4) ||
    (item.roundTripMs !== null && item.roundTripMs >= 350),
  ).length;
  const stable = metrics.filter((item) =>
    (item.packetLossPercent !== null || item.roundTripMs !== null) &&
    (item.packetLossPercent === null || item.packetLossPercent < 1.5) &&
    (item.roundTripMs === null || item.roundTripMs < 180),
  ).length;
  const index = captureLevels.indexOf(current);

  if (congested >= majority && now - currentSince >= 10_000 && index > 0) {
    return captureLevels[index - 1];
  }
  if (stable >= majority && now - currentSince >= 35_000 && index < captureLevels.length - 1) {
    return captureLevels[index + 1];
  }
  return current;
};

export const getCaptureLevelConstraints = (level: AutomaticCaptureLevel, prioritizeMotion = false) => {
  const profile = prioritizeMotion && level !== 'economy'
    ? qualityProfiles.fluid
    : qualityProfiles[level === 'high' ? 'high' : level];
  return {
    width: { ideal: profile.width },
    height: { ideal: profile.height },
    frameRate: { ideal: profile.frameRate, max: profile.frameRate },
  };
};

export const getPeerBitrateCeiling = (
  mode: QualityMode,
  metrics: ConnectionMetrics,
  currentCeiling: number,
  secondsInCondition: number,
): number => {
  const maxBitrate = mode === 'automatic'
    ? qualityProfiles.maximum.maxBitrate
    : qualityProfiles[mode as ManualQualityProfile].maxBitrate;
  const congested = (metrics.packetLossPercent !== null && metrics.packetLossPercent >= 5) ||
    (metrics.roundTripMs !== null && metrics.roundTripMs >= 350);
  const hasNetworkMetrics = metrics.packetLossPercent !== null || metrics.roundTripMs !== null;
  const excellent = hasNetworkMetrics && (metrics.packetLossPercent === null || metrics.packetLossPercent < 1) &&
    (metrics.roundTripMs === null || metrics.roundTripMs < 200);

  if (congested && secondsInCondition >= 5) {
    return Math.max(250_000, Math.floor(currentCeiling * 0.7));
  }
  if (!congested && excellent && secondsInCondition >= 25) {
    return Math.min(maxBitrate, Math.floor(currentCeiling * 1.12));
  }
  return Math.min(maxBitrate, currentCeiling);
};

export const getProfileBitrate = (mode: QualityMode): number =>
  mode === 'automatic' ? qualityProfiles.balanced.maxBitrate : qualityProfiles[mode].maxBitrate;
