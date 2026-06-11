import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

export type TransferPacketKind = 'text' | 'signal';
export type TransferSignalKind = 'offer' | 'answer';

export type TransferPacket = {
  version: 1;
  kind: TransferPacketKind;
  sessionId: string;
  partIndex: number;
  totalParts: number;
  data: string;
  signalKind?: TransferSignalKind;
};

export type TransferAssemblyState = {
  sessionId: string;
  kind: TransferPacketKind;
  signalKind?: TransferSignalKind;
  totalParts: number;
  parts: Record<number, string>;
};

export type TransferAssemblyResult =
  | {
      complete: false;
      state: TransferAssemblyState;
      receivedParts: number;
    }
  | {
      complete: true;
      state: TransferAssemblyState;
      receivedParts: number;
      decoded: string;
    };

export type TransferSignalDescription = {
  type: RTCSdpType;
  sdp: string;
};

type CreateTransferPacketsOptions = {
  kind: TransferPacketKind;
  rawContent: string;
  baseUrl: string;
  signalKind?: TransferSignalKind;
  maxChunkLength?: number;
  sessionId?: string;
};

type ParsedTransferInput =
  | {
      kind: 'packet';
      packet: TransferPacket;
    }
  | {
      kind: 'plain';
      text: string;
    };

const DEFAULT_CHUNK_LENGTH = 900;
const TRANSFER_MARKER = 'xfer=1';

const clampPositiveInteger = (value: number, fallback: number): number => {
  if (!Number.isFinite(value) || value < 1) {
    return fallback;
  }

  return Math.floor(value);
};

export const createTransferId = (): string => {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (item) => item.toString(16).padStart(2, '0')).join('');
};

export const compressTransferPayload = (rawContent: string): string =>
  compressToEncodedURIComponent(rawContent);

export const decompressTransferPayload = (compressed: string): string => {
  const output = decompressFromEncodedURIComponent(compressed);

  if (typeof output !== 'string') {
    throw new Error('Nao foi possivel descompactar o payload da transferencia.');
  }

  return output;
};

export const splitTransferPayload = (
  compressedPayload: string,
  maxChunkLength = DEFAULT_CHUNK_LENGTH,
): string[] => {
  const safeChunkLength = clampPositiveInteger(maxChunkLength, DEFAULT_CHUNK_LENGTH);
  const parts: string[] = [];

  for (let cursor = 0; cursor < compressedPayload.length; cursor += safeChunkLength) {
    parts.push(compressedPayload.slice(cursor, cursor + safeChunkLength));
  }

  return parts.length > 0 ? parts : [''];
};

export const buildTransferHash = (packet: TransferPacket): string => {
  const signalPart =
    packet.kind === 'signal' && packet.signalKind ? `&signal=${packet.signalKind}` : '';

  return `#${TRANSFER_MARKER}&kind=${packet.kind}&session=${packet.sessionId}&part=${packet.partIndex + 1}&total=${packet.totalParts}${signalPart}&data=${packet.data}`;
};

export const buildTransferUrl = (baseUrl: string, packet: TransferPacket): string =>
  `${baseUrl}${buildTransferHash(packet)}`;

export const createTransferPackets = ({
  kind,
  rawContent,
  baseUrl,
  signalKind,
  maxChunkLength = DEFAULT_CHUNK_LENGTH,
  sessionId = createTransferId(),
}: CreateTransferPacketsOptions): {
  compressedPayload: string;
  packets: TransferPacket[];
  urls: string[];
  sessionId: string;
} => {
  const compressedPayload = compressTransferPayload(rawContent);
  const parts = splitTransferPayload(compressedPayload, maxChunkLength);
  const packets = parts.map<TransferPacket>((part, index) => ({
    version: 1,
    kind,
    sessionId,
    partIndex: index,
    totalParts: parts.length,
    data: part,
    signalKind,
  }));

  return {
    compressedPayload,
    packets,
    urls: packets.map((packet) => buildTransferUrl(baseUrl, packet)),
    sessionId,
  };
};

const extractTransferFragment = (rawInput: string): string | null => {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('#')) {
    return trimmed.slice(1);
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed);
      return url.hash.startsWith('#') ? url.hash.slice(1) : null;
    } catch {
      return null;
    }
  }

  if (trimmed.includes(TRANSFER_MARKER)) {
    return trimmed.startsWith('?') ? trimmed.slice(1) : trimmed;
  }

  return null;
};

export const parseTransferInput = (rawInput: string): ParsedTransferInput => {
  const fragment = extractTransferFragment(rawInput);

  if (!fragment) {
    return {
      kind: 'plain',
      text: rawInput,
    };
  }

  const params = new URLSearchParams(fragment);

  if (params.get('xfer') !== '1') {
    return {
      kind: 'plain',
      text: rawInput,
    };
  }

  const kind = params.get('kind');
  const sessionId = params.get('session');
  const data = params.get('data');
  const partIndexRaw = Number(params.get('part'));
  const totalPartsRaw = Number(params.get('total'));
  const signalKindRaw = params.get('signal');

  if ((kind !== 'text' && kind !== 'signal') || !sessionId || typeof data !== 'string') {
    return {
      kind: 'plain',
      text: rawInput,
    };
  }

  if (!Number.isFinite(partIndexRaw) || !Number.isFinite(totalPartsRaw)) {
    return {
      kind: 'plain',
      text: rawInput,
    };
  }

  const partIndex = Math.max(0, Math.floor(partIndexRaw) - 1);
  const totalParts = clampPositiveInteger(totalPartsRaw, 1);
  const signalKind =
    signalKindRaw === 'offer' || signalKindRaw === 'answer' ? signalKindRaw : undefined;

  return {
    kind: 'packet',
    packet: {
      version: 1,
      kind,
      sessionId,
      partIndex,
      totalParts,
      data,
      signalKind,
    },
  };
};

export const addPacketToAssembly = (
  currentState: TransferAssemblyState | null,
  packet: TransferPacket,
): TransferAssemblyResult => {
  const shouldReset =
    !currentState ||
    currentState.sessionId !== packet.sessionId ||
    currentState.kind !== packet.kind ||
    currentState.signalKind !== packet.signalKind ||
    currentState.totalParts !== packet.totalParts;

  const state: TransferAssemblyState = shouldReset
    ? {
        sessionId: packet.sessionId,
        kind: packet.kind,
        signalKind: packet.signalKind,
        totalParts: packet.totalParts,
        parts: {},
      }
    : {
        ...currentState,
        parts: { ...currentState.parts },
      };

  state.parts[packet.partIndex] = packet.data;

  const receivedParts = Object.keys(state.parts).length;

  if (receivedParts < state.totalParts) {
    return {
      complete: false,
      state,
      receivedParts,
    };
  }

  const orderedPayload = Array.from({ length: state.totalParts }, (_, index) => state.parts[index] ?? '').join('');
  const decoded = decompressTransferPayload(orderedPayload);

  return {
    complete: true,
    state,
    receivedParts,
    decoded,
  };
};

export const serializeSignalDescription = (
  description: RTCSessionDescriptionInit,
): string =>
  JSON.stringify({
    type: description.type,
    sdp: description.sdp ?? '',
  } satisfies TransferSignalDescription);

export const parseSignalDescription = (raw: string): TransferSignalDescription => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Nao foi possivel interpretar a descricao WebRTC.');
  }

  if (
    !parsed ||
    typeof parsed !== 'object' ||
    !('type' in parsed) ||
    !('sdp' in parsed) ||
    typeof parsed.type !== 'string' ||
    typeof parsed.sdp !== 'string'
  ) {
    throw new Error('Descricao WebRTC invalida.');
  }

  if (
    parsed.type !== 'offer' &&
    parsed.type !== 'answer' &&
    parsed.type !== 'pranswer' &&
    parsed.type !== 'rollback'
  ) {
    throw new Error('Tipo de descricao WebRTC invalido.');
  }

  return {
    type: parsed.type,
    sdp: parsed.sdp,
  };
};

export const buildUint8Chunks = (
  payload: Uint8Array,
  chunkSize = 16 * 1024,
): Uint8Array[] => {
  const safeChunkSize = clampPositiveInteger(chunkSize, 16 * 1024);
  const chunks: Uint8Array[] = [];

  for (let cursor = 0; cursor < payload.byteLength; cursor += safeChunkSize) {
    chunks.push(payload.slice(cursor, cursor + safeChunkSize));
  }

  return chunks;
};

export const mergeUint8Chunks = (chunks: Uint8Array[], totalSize: number): Uint8Array => {
  const output = new Uint8Array(totalSize);
  let offset = 0;

  chunks.forEach((chunk) => {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  });

  return output;
};

export const waitForIceGatheringComplete = (
  peerConnection: RTCPeerConnection,
  timeoutMs = 8000,
): Promise<void> =>
  new Promise((resolve) => {
    if (peerConnection.iceGatheringState === 'complete') {
      resolve();
      return;
    }

    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;
      peerConnection.removeEventListener('icegatheringstatechange', onChange);
      window.clearTimeout(timeoutId);
      resolve();
    };

    const onChange = () => {
      if (peerConnection.iceGatheringState === 'complete') {
        finish();
      }
    };

    const timeoutId = window.setTimeout(finish, timeoutMs);

    peerConnection.addEventListener('icegatheringstatechange', onChange);
  });

export const waitForDataChannelDrain = (
  channel: RTCDataChannel,
  threshold = 512 * 1024,
): Promise<void> => {
  if (channel.bufferedAmount <= threshold) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let finished = false;

    const cleanup = () => {
      if (finished) {
        return;
      }

      finished = true;
      channel.removeEventListener('bufferedamountlow', onDrain);
      window.clearTimeout(timeoutId);
      resolve();
    };

    const onDrain = () => cleanup();
    const timeoutId = window.setTimeout(cleanup, 250);

    channel.addEventListener('bufferedamountlow', onDrain);
  });
};
