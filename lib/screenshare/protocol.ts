export const SCREENSHARE_NAMESPACE = 'screenshare';
export const SCREENSHARE_ROOM_TTL_SECONDS = 60 * 60;
export const SCREENSHARE_SIGNAL_TTL_SECONDS = 60 * 60;
export const SCREENSHARE_VIEWER_LEASE_SECONDS = 60;
export const SCREENSHARE_HOST_RECOVERY_MS = 90_000;
export const SCREENSHARE_SIGNAL_LIMIT = 128;
export const SCREENSHARE_MAX_BODY_BYTES = 120_000;
export const SCREENSHARE_MAX_VIEWERS_DEFAULT = 5;

export const qualityProfiles = {
  economy: { width: 854, height: 480, frameRate: 30, maxBitrate: 1_200_000 },
  balanced: { width: 1280, height: 720, frameRate: 30, maxBitrate: 2_500_000 },
  high: { width: 1920, height: 1080, frameRate: 30, maxBitrate: 5_000_000 },
  fluid: { width: 1280, height: 720, frameRate: 60, maxBitrate: 4_000_000 },
  maximum: { width: 1920, height: 1080, frameRate: 60, maxBitrate: 7_000_000 },
} as const;

export type ManualQualityProfile = keyof typeof qualityProfiles;
export type QualityMode = 'automatic' | ManualQualityProfile;
export type RoomState = 'active' | 'recovering' | 'closed' | 'expired' | 'full';
export type PeerState = 'connecting' | 'connected' | 'disconnected';
export type RoomAccess = 'public' | 'private';

export type ScreenShareRoomRecord = {
  id: string;
  hostTokenHash: string;
  status: 'active' | 'closed';
  createdAt: number;
  lastHostHeartbeat: number;
  hardExpiresAt: number;
  viewerLimit: number;
  maxViewerLimit: number;
  qualityMode: QualityMode;
  audioAvailable: boolean;
  hostName: string;
  access: RoomAccess;
  hostCameraOn: boolean;
  hostMicrophoneOn: boolean;
  screenSharerId: string | null;
};

export type ScreenSharePeerRecord = {
  id: string;
  tokenHash: string;
  joinedAt: number;
  lastHeartbeat: number;
  state: PeerState;
  displayName: string;
  admission: 'pending' | 'approved' | 'denied';
  cameraOn: boolean;
  microphoneOn: boolean;
};

export type ScreenShareSignal =
  | { type: 'join'; fromPeerId: string; sequence: number; createdAt: number }
  | {
      type: 'offer' | 'answer';
      fromPeerId: string;
      sequence: number;
      createdAt: number;
      negotiationId: string;
      description: { type: 'offer' | 'answer'; sdp: string };
    }
  | {
      type: 'candidate';
      fromPeerId: string;
      sequence: number;
      createdAt: number;
      negotiationId: string;
      candidate: {
        candidate: string;
        sdpMid?: string | null;
        sdpMLineIndex?: number | null;
        usernameFragment?: string | null;
      };
    }
  | {
      type: 'restart-request' | 'bye';
      fromPeerId: string;
      sequence: number;
      createdAt: number;
    }
  | {
      type: 'quality-request';
      fromPeerId: string;
      sequence: number;
      createdAt: number;
      preference: 'economy' | 'automatic';
    }
  | {
      type: 'room-closed';
      fromPeerId: 'host';
      sequence: number;
      createdAt: number;
    };

export type UnsequencedSignal =
  | { type: 'join' | 'restart-request' | 'bye' }
  | { type: 'quality-request'; preference: 'economy' | 'automatic' }
  | {
      type: 'offer' | 'answer';
      negotiationId: string;
      description: { type: 'offer' | 'answer'; sdp: string };
    }
  | {
      type: 'candidate';
      negotiationId: string;
      candidate: {
        candidate: string;
        sdpMid?: string | null;
        sdpMLineIndex?: number | null;
        usernameFragment?: string | null;
      };
    };

export const isViewerSignalDirectionValid = (signal: UnsequencedSignal, target: string): boolean => {
  if (signal.type === 'offer') return target !== 'host';
  if (signal.type === 'join' || signal.type === 'quality-request' || signal.type === 'restart-request') return target === 'host';
  return true;
};

export const getSignalRateLimit = (role: 'host' | 'viewer', signal: UnsequencedSignal): { bucket: 'candidate' | 'signal'; limit: number } => ({
  bucket: signal.type === 'candidate' ? 'candidate' : 'signal',
  limit: signal.type === 'candidate' ? 600 : role === 'host' ? 180 : 120,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isValidRoomId = (value: string): boolean => /^[a-f0-9]{48}$/.test(value);
export const isValidPeerId = (value: string): boolean => /^[a-f0-9]{32}$/.test(value);
export const isValidSecret = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);

export const sanitizeParticipantName = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const normalized = value.normalize('NFC').replace(/[\u0000-\u001f\u007f]/g, '').trim();
  const name = Array.from(normalized).slice(0, 32).join('');
  return name.length >= 1 ? name : null;
};

export const isRoomAccess = (value: unknown): value is RoomAccess =>
  value === 'public' || value === 'private';

export const isQualityMode = (value: unknown): value is QualityMode =>
  value === 'automatic' ||
  (typeof value === 'string' && Object.hasOwn(qualityProfiles, value));

export const validateSignalPayload = (value: unknown): UnsequencedSignal | null => {
  if (!isRecord(value) || typeof value.type !== 'string') return null;

  if (value.type === 'join' || value.type === 'restart-request' || value.type === 'bye') {
    return { type: value.type };
  }

  if (value.type === 'quality-request' && (value.preference === 'economy' || value.preference === 'automatic')) {
    return { type: 'quality-request', preference: value.preference };
  }

  if (value.type === 'offer' || value.type === 'answer') {
    if (
      typeof value.negotiationId !== 'string' ||
      !/^[a-f0-9-]{16,64}$/i.test(value.negotiationId) ||
      !isRecord(value.description) ||
      value.description.type !== value.type ||
      typeof value.description.sdp !== 'string' ||
      value.description.sdp.length < 1 ||
      value.description.sdp.length > 80_000
    ) {
      return null;
    }

    return {
      type: value.type,
      negotiationId: value.negotiationId,
      description: { type: value.type, sdp: value.description.sdp },
    };
  }

  if (value.type === 'candidate') {
    if (
      typeof value.negotiationId !== 'string' ||
      !/^[a-f0-9-]{16,64}$/i.test(value.negotiationId) ||
      !isRecord(value.candidate) ||
      typeof value.candidate.candidate !== 'string' ||
      value.candidate.candidate.length > 2_048
    ) {
      return null;
    }

    const sdpMid = value.candidate.sdpMid;
    const sdpMLineIndex = value.candidate.sdpMLineIndex;
    const usernameFragment = value.candidate.usernameFragment;

    if (sdpMid !== undefined && sdpMid !== null && (typeof sdpMid !== 'string' || sdpMid.length > 256)) return null;
    if (sdpMLineIndex !== undefined && sdpMLineIndex !== null && (!Number.isInteger(sdpMLineIndex) || Number(sdpMLineIndex) < 0 || Number(sdpMLineIndex) > 255)) return null;
    if (usernameFragment !== undefined && usernameFragment !== null && (typeof usernameFragment !== 'string' || usernameFragment.length > 256)) return null;

    return {
      type: 'candidate',
      negotiationId: value.negotiationId,
      candidate: {
        candidate: value.candidate.candidate,
        sdpMid: sdpMid as string | null | undefined,
        sdpMLineIndex: sdpMLineIndex as number | null | undefined,
        usernameFragment: usernameFragment as string | null | undefined,
      },
    };
  }

  return null;
};
