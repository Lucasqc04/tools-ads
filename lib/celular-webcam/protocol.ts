export const WEBCAM_SESSION_TTL_SECONDS = 30 * 60;
export const WEBCAM_SESSION_MAX_LIFETIME_MS = 4 * 60 * 60 * 1000;
export const WEBCAM_SESSION_CLOSED_TTL_SECONDS = 60;
export const WEBCAM_SIGNAL_MAX_BYTES = 64_000;
export const WEBCAM_SIGNAL_QUEUE_LIMIT = 48;

export type WebcamRole = 'host' | 'phone';
export type WebcamSessionStatus = 'waiting' | 'requested' | 'accepted' | 'connecting' | 'connected' | 'closed';

export type WebcamSignal =
  | { type: 'request' | 'accept' | 'restart-request' | 'bye' }
  | { type: 'offer' | 'answer'; description: { type: 'offer' | 'answer'; sdp: string } }
  | {
      type: 'candidate';
      candidate: {
        candidate: string;
        sdpMid?: string | null;
        sdpMLineIndex?: number | null;
        usernameFragment?: string | null;
      };
    }
  | { type: 'state'; state: 'connected' | 'disconnected' };

export type WebcamSignalEnvelope = { signalId: string; signal: WebcamSignal };

export type WebcamSessionRecord = {
  id: string;
  hostTokenHash: string;
  phoneTokenHash: string;
  status: WebcamSessionStatus;
  createdAt: number;
  hardExpiresAt: number;
  phoneConnectionId?: string;
};

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isValidWebcamSessionId = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-f0-9]{48}$/.test(value);

export const isValidWebcamToken = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);

export const isValidWebcamSignalId = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-f0-9-]{16,64}$/i.test(value);

export const isValidWebcamClientId = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-f0-9]{32}$/.test(value);

export const createWebcamSessionRecord = (
  id: string,
  hostTokenHash: string,
  phoneTokenHash: string,
  now = Date.now(),
): WebcamSessionRecord => ({
  id,
  hostTokenHash,
  phoneTokenHash,
  status: 'waiting',
  createdAt: now,
  hardExpiresAt: now + WEBCAM_SESSION_MAX_LIFETIME_MS,
});

export const isWebcamSessionExpired = (record: Pick<WebcamSessionRecord, 'hardExpiresAt'>, now = Date.now()): boolean =>
  record.hardExpiresAt <= now;

const optionalBoundedString = (value: unknown, maxLength: number): value is string | null | undefined =>
  value === undefined || value === null || (typeof value === 'string' && value.length <= maxLength);

export const validateWebcamSignal = (value: unknown): WebcamSignal | null => {
  if (!isRecord(value) || typeof value.type !== 'string') return null;

  if (value.type === 'request' || value.type === 'accept' || value.type === 'restart-request' || value.type === 'bye') {
    return { type: value.type };
  }

  if (value.type === 'state' && (value.state === 'connected' || value.state === 'disconnected')) {
    return { type: 'state', state: value.state };
  }

  if (value.type === 'offer' || value.type === 'answer') {
    if (!isRecord(value.description) || value.description.type !== value.type || typeof value.description.sdp !== 'string') {
      return null;
    }
    const sdp = value.description.sdp;
    if (sdp.length < 1 || sdp.length > WEBCAM_SIGNAL_MAX_BYTES) return null;
    return { type: value.type, description: { type: value.type, sdp } };
  }

  if (value.type === 'candidate') {
    if (!isRecord(value.candidate) || typeof value.candidate.candidate !== 'string') return null;
    if (value.candidate.candidate.length > 2_048) return null;
    if (!optionalBoundedString(value.candidate.sdpMid, 256)) return null;
    if (!optionalBoundedString(value.candidate.usernameFragment, 256)) return null;
    const lineIndex = value.candidate.sdpMLineIndex;
    if (lineIndex !== undefined && lineIndex !== null && (!Number.isInteger(lineIndex) || Number(lineIndex) < 0 || Number(lineIndex) > 64)) {
      return null;
    }
    return {
      type: 'candidate',
      candidate: {
        candidate: value.candidate.candidate,
        ...(value.candidate.sdpMid !== undefined ? { sdpMid: value.candidate.sdpMid as string | null } : {}),
        ...(lineIndex !== undefined ? { sdpMLineIndex: lineIndex as number | null } : {}),
        ...(value.candidate.usernameFragment !== undefined ? { usernameFragment: value.candidate.usernameFragment as string | null } : {}),
      },
    };
  }

  return null;
};

export const isWebcamSignalAllowed = (role: WebcamRole, signal: WebcamSignal): boolean => {
  if (signal.type === 'candidate' || signal.type === 'state' || signal.type === 'restart-request' || signal.type === 'bye') return true;
  if (role === 'phone') return signal.type === 'request' || signal.type === 'offer';
  return signal.type === 'accept' || signal.type === 'answer';
};

export const webcamSignalRateLimit = (signal: WebcamSignal): number =>
  signal.type === 'candidate' ? 120 : 30;
