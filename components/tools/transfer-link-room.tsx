'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react';
import {
  Check,
  CircleAlert,
  ClipboardCopy,
  Download,
  File,
  Files,
  Link2,
  LoaderCircle,
  MonitorSmartphone,
  Trash2,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { transferLinkCopy } from '@/data/content/transfer-link-ui';
import type { AppLocale } from '@/lib/i18n/config';
import { formatBytes } from '@/lib/file-size';
import { downloadBlob } from '@/lib/qr-code';
import { trackEvent, TOOL_ID } from '@/lib/analytics';
import { createTransferSecret, waitForDataChannelDrain } from '@/lib/transfer';
import type { ScreenShareSignal, UnsequencedSignal } from '@/lib/screenshare/protocol';

type Props = Readonly<{
  locale: AppLocale;
  initialRoomId: string | null;
}>;

type ApiError = Error & { code?: string };
type RoomRole = 'host' | 'viewer';
type ParticipantStatus = 'connecting' | 'connected' | 'disconnected';
type RoomParticipant = {
  id: string;
  displayName: string;
  role: RoomRole;
  state: ParticipantStatus;
  isLocal: boolean;
};
type PendingCandidate = { negotiationId: string; candidate: RTCIceCandidateInit };
type RoomPeerRuntime = {
  id: string;
  displayName: string;
  pc: RTCPeerConnection;
  channel: RTCDataChannel | null;
  negotiationId: string;
  candidates: PendingCandidate[];
  initiatedLocally: boolean;
};
type RoomRuntime = {
  roomId: string;
  role: RoomRole;
  selfPeerId: string;
  localName: string;
  hostToken?: string;
  viewerToken?: string;
  iceServers: RTCIceServer[];
  cursor: number;
  peers: Map<string, RoomPeerRuntime>;
  closed: boolean;
  signalInFlight: boolean;
  rosterInFlight: boolean;
  connectedEventSent: boolean;
  signalTimer?: number;
  rosterTimer?: number;
  heartbeatTimer?: number;
};
type RoomMeta = {
  type: 'meta';
  transferId: string;
  senderName: string;
  fileName: string;
  mimeType: string;
  size: number;
  totalChunks: number;
};
type IncomingFile = {
  id: string;
  meta: RoomMeta;
  chunks: ArrayBuffer[];
  receivedBytes: number;
};
type ReadyFile = {
  id: string;
  fileName: string;
  senderName: string;
  size: number;
  blob: Blob;
};
type TransferActivity = {
  id: string;
  peerId: string;
  peerName: string;
  fileName: string;
  size: number;
  direction: 'send' | 'receive';
  percent: number;
  state: 'sending' | 'receiving' | 'sent' | 'received' | 'failed';
};

const TRANSFER_CHUNK_SIZE = 64 * 1024;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const deviceNameFor = (template: string, number: number): string =>
  template.replace('{number}', String(Math.max(1, number)));

async function requestRoomApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { cache: 'no-store', ...init });
  const payload: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const code = isRecord(payload) && typeof payload.error === 'string' ? payload.error : 'request_failed';
    const error = new Error(code) as ApiError;
    error.code = code;
    throw error;
  }

  return payload as T;
}

const connectionStateToStatus = (state: RTCPeerConnectionState): ParticipantStatus => {
  if (state === 'connected') return 'connected';
  if (state === 'disconnected' || state === 'failed' || state === 'closed') return 'disconnected';
  return 'connecting';
};

function ProgressBar({ value }: Readonly<{ value: number }>) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-slate-200"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safeValue)}
      role="progressbar"
    >
      <div className="h-full rounded-full bg-brand-600 transition-[width]" style={{ width: `${safeValue}%` }} />
    </div>
  );
}

export function TransferLinkRoom({ locale, initialRoomId }: Props) {
  const copy = useMemo(() => transferLinkCopy[locale], [locale]);
  const [deviceName, setDeviceName] = useState(() => deviceNameFor(
    transferLinkCopy[locale].deviceNameTemplate,
    initialRoomId ? 2 : 1,
  ));
  const [nameWasEdited, setNameWasEdited] = useState(false);
  const [roomId, setRoomId] = useState(initialRoomId ?? '');
  const [roomUrl, setRoomUrl] = useState('');
  const [role, setRole] = useState<RoomRole | null>(null);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activities, setActivities] = useState<TransferActivity[]>([]);
  const [readyFiles, setReadyFiles] = useState<ReadyFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const runtimeRef = useRef<RoomRuntime | null>(null);
  const incomingFilesRef = useRef(new Map<string, IncomingFile>());
  const roomFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setRoomId(initialRoomId ?? '');
    setDeviceName(deviceNameFor(copy.deviceNameTemplate, initialRoomId ? 2 : 1));
    setNameWasEdited(false);
  }, [copy.deviceNameTemplate, initialRoomId]);

  useEffect(() => {
    if (!initialRoomId || nameWasEdited) return;
    let active = true;
    void requestRoomApi<{ viewerCount?: number }>(`/api/screenshare/rooms/${initialRoomId}`)
      .then((room) => {
        if (active) setDeviceName(deviceNameFor(copy.deviceNameTemplate, (room.viewerCount ?? 0) + 2));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [copy.deviceNameTemplate, initialRoomId, nameWasEdited]);

  const messageForError = useCallback((error: unknown) => {
    const code = (error as ApiError | null)?.code;
    if (code === 'room_full') return copy.roomFull;
    if (code === 'room_ended' || code === 'not_found' || code === 'missing') return copy.roomExpired;
    if (code === 'invalid_signal' || code === 'request_failed' || code === 'host_recovering') return copy.connectionFailed;
    return copy.unknownError;
  }, [copy]);

  const setParticipantStatus = useCallback((peerId: string, state: ParticipantStatus) => {
    setParticipants((current) => current.map((participant) =>
      participant.id === peerId ? { ...participant, state } : participant,
    ));
  }, []);

  const upsertActivity = useCallback((activity: TransferActivity) => {
    setActivities((current) => [activity, ...current.filter((item) => item.id !== activity.id)].slice(0, 40));
  }, []);

  const patchActivity = useCallback((id: string, update: Partial<TransferActivity>) => {
    setActivities((current) => current.map((activity) =>
      activity.id === id ? { ...activity, ...update } : activity,
    ));
  }, []);

  const failPeerTransfers = useCallback((peerId: string) => {
    const incoming = incomingFilesRef.current.get(peerId);
    if (incoming) incomingFilesRef.current.delete(peerId);
    setActivities((current) => current.map((activity) =>
      activity.peerId === peerId && (activity.state === 'sending' || activity.state === 'receiving')
        ? { ...activity, state: 'failed' }
        : activity,
    ));
  }, []);

  const sendSignal = useCallback(async (
    runtime: RoomRuntime,
    signal: UnsequencedSignal,
    toPeerId = 'host',
  ) => {
    await requestRoomApi(`/api/screenshare/rooms/${runtime.roomId}/signals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(runtime.role === 'host'
          ? { 'X-Screenshare-Host-Token': runtime.hostToken ?? '' }
          : { 'X-Screenshare-Viewer-Token': runtime.viewerToken ?? '' }),
      },
      body: JSON.stringify({
        role: runtime.role,
        ...(runtime.role === 'viewer' ? { peerId: runtime.selfPeerId } : {}),
        toPeerId,
        signal,
      }),
    });
  }, []);

  const receiveFile = useCallback(async (peerId: string, data: string | Blob | ArrayBuffer) => {
    if (typeof data === 'string') {
      let parsed: unknown;
      try {
        parsed = JSON.parse(data);
      } catch {
        return;
      }

      if (isRecord(parsed) && parsed.type === 'meta') {
        if (
          typeof parsed.transferId !== 'string' || !/^[a-f0-9]{16}$/.test(parsed.transferId) ||
          typeof parsed.fileName !== 'string' || typeof parsed.mimeType !== 'string' ||
          typeof parsed.size !== 'number' || !Number.isSafeInteger(parsed.size) || parsed.size < 0 ||
          typeof parsed.totalChunks !== 'number' || !Number.isSafeInteger(parsed.totalChunks) || parsed.totalChunks < 0 ||
          parsed.totalChunks !== Math.ceil(parsed.size / TRANSFER_CHUNK_SIZE)
        ) return;

        const runtime = runtimeRef.current;
        const peerName = typeof parsed.senderName === 'string' ? parsed.senderName.slice(0, 32) : runtime?.peers.get(peerId)?.displayName ?? copy.deviceName;
        const meta: RoomMeta = {
          type: 'meta',
          transferId: parsed.transferId,
          senderName: peerName,
          fileName: parsed.fileName.slice(0, 255),
          mimeType: parsed.mimeType.slice(0, 128),
          size: parsed.size,
          totalChunks: parsed.totalChunks,
        };
        const id = `${peerId}:${meta.transferId}`;
        incomingFilesRef.current.set(peerId, { id, meta, chunks: [], receivedBytes: 0 });
        upsertActivity({
          id,
          peerId,
          peerName: meta.senderName,
          fileName: meta.fileName,
          size: meta.size,
          direction: 'receive',
          percent: 0,
          state: 'receiving',
        });
        return;
      }

      if (isRecord(parsed) && parsed.type === 'done' && typeof parsed.transferId === 'string') {
        const incoming = incomingFilesRef.current.get(peerId);
        if (!incoming || incoming.meta.transferId !== parsed.transferId) return;
        incomingFilesRef.current.delete(peerId);

        if (incoming.receivedBytes !== incoming.meta.size || incoming.chunks.length !== incoming.meta.totalChunks) {
          patchActivity(incoming.id, { state: 'failed' });
          return;
        }

        const file: ReadyFile = {
          id: incoming.id,
          fileName: incoming.meta.fileName,
          senderName: incoming.meta.senderName,
          size: incoming.meta.size,
          blob: new Blob(incoming.chunks, { type: incoming.meta.mimeType || 'application/octet-stream' }),
        };
        setReadyFiles((current) => [file, ...current.filter((item) => item.id !== file.id)]);
        patchActivity(incoming.id, { percent: 100, state: 'received' });
        return;
      }
      return;
    }

    const incoming = incomingFilesRef.current.get(peerId);
    if (!incoming) return;
    const buffer = data instanceof Blob ? await data.arrayBuffer() : data;
    if (incoming.receivedBytes + buffer.byteLength > incoming.meta.size) {
      incomingFilesRef.current.delete(peerId);
      patchActivity(incoming.id, { state: 'failed' });
      return;
    }

    incoming.chunks.push(buffer);
    incoming.receivedBytes += buffer.byteLength;
    patchActivity(incoming.id, {
      percent: incoming.meta.size > 0 ? Math.min(100, (incoming.receivedBytes / incoming.meta.size) * 100) : 100,
    });
  }, [copy.deviceName, patchActivity, upsertActivity]);

  const attachRoomChannel = useCallback((runtime: RoomRuntime, peer: RoomPeerRuntime, channel: RTCDataChannel) => {
    channel.binaryType = 'arraybuffer';
    channel.bufferedAmountLowThreshold = 256 * 1024;
    peer.channel = channel;
    channel.onopen = () => {
      setParticipantStatus(peer.id, 'connected');
      if (runtime.connectedEventSent) return;
      runtime.connectedEventSent = true;
      setNotice({ tone: 'success', text: copy.connectionReady });
      trackEvent('tool_completed', { tool: TOOL_ID.transfer, locale, mode: 'link_connected' });
    };
    channel.onclose = () => {
      setParticipantStatus(peer.id, 'disconnected');
      failPeerTransfers(peer.id);
    };
    channel.onerror = () => {
      setParticipantStatus(peer.id, 'disconnected');
      failPeerTransfers(peer.id);
    };
    channel.onmessage = (event) => { void receiveFile(peer.id, event.data as string | Blob | ArrayBuffer); };
  }, [copy.connectionReady, failPeerTransfers, locale, receiveFile, setParticipantStatus]);

  const createPeerConnection = useCallback((
    runtime: RoomRuntime,
    participant: { id: string; displayName: string },
    initiatedLocally: boolean,
  ): RoomPeerRuntime => {
    const pc = new RTCPeerConnection({ iceServers: runtime.iceServers, iceCandidatePoolSize: 2 });
    const peer: RoomPeerRuntime = {
      id: participant.id,
      displayName: participant.displayName,
      pc,
      channel: null,
      negotiationId: crypto.randomUUID(),
      candidates: [],
      initiatedLocally,
    };
    runtime.peers.set(participant.id, peer);

    pc.onconnectionstatechange = () => {
      setParticipantStatus(participant.id, connectionStateToStatus(pc.connectionState));
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') failPeerTransfers(participant.id);
    };
    pc.onicecandidate = (event) => {
      if (!event.candidate || runtime.closed) return;
      const candidate = event.candidate.toJSON();
      if (!candidate.candidate) return;
      void sendSignal(runtime, {
        type: 'candidate',
        negotiationId: peer.negotiationId,
        candidate: {
          candidate: candidate.candidate,
          sdpMid: candidate.sdpMid,
          sdpMLineIndex: candidate.sdpMLineIndex,
          usernameFragment: candidate.usernameFragment,
        },
      }, participant.id).catch(() => undefined);
    };

    if (initiatedLocally) {
      attachRoomChannel(runtime, peer, pc.createDataChannel('adtools-transfer', { ordered: true }));
    } else {
      pc.ondatachannel = (event) => attachRoomChannel(runtime, peer, event.channel);
    }

    return peer;
  }, [attachRoomChannel, failPeerTransfers, sendSignal, setParticipantStatus]);

  const startOutgoingPeer = useCallback(async (
    runtime: RoomRuntime,
    participant: { id: string; displayName: string },
  ) => {
    if (runtime.closed || runtime.peers.has(participant.id)) return;
    const peer = createPeerConnection(runtime, participant, true);
    try {
      const offer = await peer.pc.createOffer();
      await peer.pc.setLocalDescription(offer);
      await sendSignal(runtime, {
        type: 'offer',
        negotiationId: peer.negotiationId,
        description: { type: 'offer', sdp: peer.pc.localDescription?.sdp ?? offer.sdp ?? '' },
      }, participant.id);
    } catch {
      peer.pc.close();
      runtime.peers.delete(participant.id);
      setParticipantStatus(participant.id, 'disconnected');
    }
  }, [createPeerConnection, sendSignal, setParticipantStatus]);

  const closePeer = useCallback((runtime: RoomRuntime, peerId: string) => {
    const peer = runtime.peers.get(peerId);
    if (!peer) return;
    failPeerTransfers(peerId);
    peer.channel?.close();
    peer.pc.close();
    runtime.peers.delete(peerId);
    setParticipantStatus(peerId, 'disconnected');
  }, [failPeerTransfers, setParticipantStatus]);

  const closeRuntime = useCallback(async (closeServerRoom: boolean) => {
    const runtime = runtimeRef.current;
    if (!runtime || runtime.closed) return;
    runtime.closed = true;
    if (runtime.signalTimer) window.clearInterval(runtime.signalTimer);
    if (runtime.rosterTimer) window.clearInterval(runtime.rosterTimer);
    if (runtime.heartbeatTimer) window.clearInterval(runtime.heartbeatTimer);
    runtime.peers.forEach((peer) => {
      peer.channel?.close();
      peer.pc.close();
    });
    runtime.peers.clear();
    incomingFilesRef.current.clear();
    runtimeRef.current = null;

    if (!closeServerRoom) return;
    try {
      if (runtime.role === 'host') {
        await requestRoomApi(`/api/screenshare/rooms/${runtime.roomId}/close`, {
          method: 'POST',
          headers: { 'X-Screenshare-Host-Token': runtime.hostToken ?? '' },
        });
      } else {
        await requestRoomApi(`/api/screenshare/rooms/${runtime.roomId}/leave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Screenshare-Viewer-Token': runtime.viewerToken ?? '' },
          body: JSON.stringify({ peerId: runtime.selfPeerId }),
        });
      }
    } catch {
      // Room leases and expiration clean up interrupted sessions.
    }
  }, []);

  const cleanupRef = useRef(closeRuntime);
  cleanupRef.current = closeRuntime;
  useEffect(() => () => { void cleanupRef.current(true); }, []);

  const processSignal = useCallback(async (runtime: RoomRuntime, signal: ScreenShareSignal) => {
    const remoteId = signal.fromPeerId;
    if (signal.type === 'bye') {
      closePeer(runtime, remoteId);
      return;
    }

    if (signal.type === 'room-closed') {
      setNotice({ tone: 'error', text: copy.roomExpired });
      await closeRuntime(false);
      return;
    }

    if (signal.type === 'offer') {
      if (runtime.role === 'host') return;
      let peer = runtime.peers.get(remoteId);
      if (!peer) {
        const displayName = remoteId === 'host'
          ? deviceNameFor(copy.deviceNameTemplate, 1)
          : copy.deviceNameTemplate.replace('{number}', String(participants.length + 1));
        peer = createPeerConnection(runtime, { id: remoteId, displayName }, false);
      }
      if (peer.initiatedLocally && peer.pc.signalingState !== 'stable') return;
      peer.initiatedLocally = false;
      peer.negotiationId = signal.negotiationId;
      await peer.pc.setRemoteDescription(signal.description);
      for (const pending of peer.candidates.splice(0).filter((item) => item.negotiationId === peer.negotiationId)) {
        await peer.pc.addIceCandidate(pending.candidate).catch(() => undefined);
      }
      const answer = await peer.pc.createAnswer();
      await peer.pc.setLocalDescription(answer);
      await sendSignal(runtime, {
        type: 'answer',
        negotiationId: signal.negotiationId,
        description: { type: 'answer', sdp: peer.pc.localDescription?.sdp ?? answer.sdp ?? '' },
      }, remoteId);
      return;
    }

    if (signal.type === 'answer') {
      const peer = runtime.peers.get(remoteId);
      if (!peer || !peer.initiatedLocally || signal.negotiationId !== peer.negotiationId) return;
      await peer.pc.setRemoteDescription(signal.description);
      for (const pending of peer.candidates.splice(0).filter((item) => item.negotiationId === peer.negotiationId)) {
        await peer.pc.addIceCandidate(pending.candidate).catch(() => undefined);
      }
      return;
    }

    if (signal.type === 'candidate') {
      let peer = runtime.peers.get(remoteId);
      if (!peer && runtime.role === 'viewer') {
        const displayName = remoteId === 'host'
          ? deviceNameFor(copy.deviceNameTemplate, 1)
          : copy.deviceNameTemplate.replace('{number}', String(participants.length + 1));
        peer = createPeerConnection(runtime, { id: remoteId, displayName }, false);
      }
      if (!peer) return;
      if (peer.pc.remoteDescription && signal.negotiationId === peer.negotiationId) {
        await peer.pc.addIceCandidate(signal.candidate).catch(() => undefined);
      } else {
        peer.candidates.push({ negotiationId: signal.negotiationId, candidate: signal.candidate });
      }
    }
  }, [closePeer, closeRuntime, copy.deviceNameTemplate, copy.roomExpired, createPeerConnection, participants.length, sendSignal]);

  const pollRoomSignals = useCallback(async (runtime: RoomRuntime) => {
    if (runtime.closed || runtime.signalInFlight) return;
    runtime.signalInFlight = true;
    try {
      const query = runtime.role === 'host'
        ? `role=host&after=${runtime.cursor}`
        : `role=viewer&peerId=${runtime.selfPeerId}&after=${runtime.cursor}`;
      const headers: Record<string, string> = runtime.role === 'host'
        ? { 'X-Screenshare-Host-Token': runtime.hostToken ?? '' }
        : { 'X-Screenshare-Viewer-Token': runtime.viewerToken ?? '' };
      const result = await requestRoomApi<{ messages: ScreenShareSignal[]; roomState?: string }>(
        `/api/screenshare/rooms/${runtime.roomId}/signals?${query}`,
        { headers },
      );
      for (const signal of result.messages) {
        runtime.cursor = Math.max(runtime.cursor, signal.sequence);
        await processSignal(runtime, signal);
      }
      if (result.roomState === 'closed' || result.roomState === 'expired') {
        setNotice({ tone: 'error', text: copy.roomExpired });
        await closeRuntime(false);
      }
    } catch (error) {
      const code = (error as ApiError)?.code;
      if (code === 'room_ended' || code === 'not_found') {
        setNotice({ tone: 'error', text: copy.roomExpired });
        await closeRuntime(false);
      }
    } finally {
      runtime.signalInFlight = false;
    }
  }, [closeRuntime, copy.roomExpired, processSignal]);

  const statusForPeer = useCallback((runtime: RoomRuntime, peerId: string, fallback?: string): ParticipantStatus => {
    const peer = runtime.peers.get(peerId);
    if (peer?.channel?.readyState === 'open') return 'connected';
    if (peer) return connectionStateToStatus(peer.pc.connectionState);
    return fallback === 'disconnected' ? 'disconnected' : 'connecting';
  }, []);

  const syncHostRoster = useCallback(async (runtime: RoomRuntime) => {
    if (runtime.closed || runtime.rosterInFlight) return;
    runtime.rosterInFlight = true;
    try {
      const result = await requestRoomApi<{
        host: { id: string; displayName: string };
        peers: Array<{ id: string; displayName: string; state: string }>;
      }>(`/api/screenshare/rooms/${runtime.roomId}/peers`, {
        headers: { 'X-Screenshare-Host-Token': runtime.hostToken ?? '' },
      });
      setParticipants([
        { id: runtime.selfPeerId, displayName: runtime.localName, role: 'host', state: 'connected', isLocal: true },
        ...result.peers.map((person) => ({
          id: person.id,
          displayName: person.displayName,
          role: 'viewer' as const,
          state: statusForPeer(runtime, person.id, person.state),
          isLocal: false,
        })),
      ]);
      for (const person of result.peers) {
        const peer = runtime.peers.get(person.id);
        if (!peer) void startOutgoingPeer(runtime, person);
        else peer.displayName = person.displayName;
      }
      const activeIds = new Set(result.peers.map((person) => person.id));
      for (const peerId of runtime.peers.keys()) {
        if (!activeIds.has(peerId)) closePeer(runtime, peerId);
      }
    } catch (error) {
      const code = (error as ApiError)?.code;
      if (code === 'room_ended' || code === 'not_found') {
        setNotice({ tone: 'error', text: copy.roomExpired });
        await closeRuntime(false);
      }
    } finally {
      runtime.rosterInFlight = false;
    }
  }, [closePeer, closeRuntime, copy.roomExpired, startOutgoingPeer, statusForPeer]);

  const syncViewerRoster = useCallback(async (runtime: RoomRuntime) => {
    if (runtime.closed || runtime.rosterInFlight) return;
    runtime.rosterInFlight = true;
    try {
      const result = await requestRoomApi<{
        host: { id: string; displayName: string };
        hostPeerId?: string;
        peers: Array<{ id: string; displayName: string; state: string }>;
      }>(`/api/screenshare/rooms/${runtime.roomId}/participants?peerId=${runtime.selfPeerId}`, {
        headers: { 'X-Screenshare-Viewer-Token': runtime.viewerToken ?? '' },
      });
      const hostId = result.hostPeerId ?? result.host.id ?? 'host';
      const remoteParticipants = [
        { id: hostId, displayName: result.host.displayName || deviceNameFor(copy.deviceNameTemplate, 1), state: 'connected' },
        ...result.peers.filter((person) => person.id !== runtime.selfPeerId && person.id !== hostId),
      ];
      setParticipants([
        { id: runtime.selfPeerId, displayName: runtime.localName, role: 'viewer', state: 'connected', isLocal: true },
        ...remoteParticipants.map((person) => ({
          id: person.id,
          displayName: person.displayName,
          role: person.id === hostId ? 'host' as const : 'viewer' as const,
          state: statusForPeer(runtime, person.id, person.state),
          isLocal: false,
        })),
      ]);

      const remoteIds = new Set(remoteParticipants.map((person) => person.id));
      for (const person of remoteParticipants) {
        if (person.id === hostId || runtime.peers.has(person.id)) continue;
        if (runtime.selfPeerId < person.id) void startOutgoingPeer(runtime, person);
      }
      for (const peerId of runtime.peers.keys()) {
        if (!remoteIds.has(peerId)) closePeer(runtime, peerId);
      }
    } catch (error) {
      const code = (error as ApiError)?.code;
      if (code === 'room_ended' || code === 'not_found') {
        setNotice({ tone: 'error', text: copy.roomExpired });
        await closeRuntime(false);
      }
    } finally {
      runtime.rosterInFlight = false;
    }
  }, [closePeer, closeRuntime, copy.deviceNameTemplate, copy.roomExpired, startOutgoingPeer, statusForPeer]);

  const startRoomLoops = useCallback((runtime: RoomRuntime) => {
    const heartbeat = () => {
      const isHost = runtime.role === 'host';
      void requestRoomApi(`/api/screenshare/rooms/${runtime.roomId}/heartbeat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isHost
            ? { 'X-Screenshare-Host-Token': runtime.hostToken ?? '' }
            : { 'X-Screenshare-Viewer-Token': runtime.viewerToken ?? '' }),
        },
        body: JSON.stringify(isHost
          ? { role: 'host', audioAvailable: false, qualityMode: 'automatic', cameraOn: false, microphoneOn: false }
          : {
              role: 'viewer',
              peerId: runtime.selfPeerId,
              state: runtime.peers.get('host')?.pc.connectionState === 'connected' ? 'connected' : 'connecting',
              cameraOn: false,
              microphoneOn: false,
            }),
      }).catch(() => undefined);
    };
    const syncRoster = () => runtime.role === 'host' ? syncHostRoster(runtime) : syncViewerRoster(runtime);

    void pollRoomSignals(runtime);
    void syncRoster();
    heartbeat();
    runtime.signalTimer = window.setInterval(() => { void pollRoomSignals(runtime); }, 1_200);
    runtime.rosterTimer = window.setInterval(syncRoster, runtime.role === 'host' ? 3_000 : 4_000);
    runtime.heartbeatTimer = window.setInterval(heartbeat, 20_000);
  }, [pollRoomSignals, syncHostRoster, syncViewerRoster]);

  const createRoom = useCallback(async () => {
    const cleanName = deviceName.trim() || deviceNameFor(copy.deviceNameTemplate, 1);
    setDeviceName(cleanName);
    setBusy(true);
    setNotice(null);
    trackEvent('tool_started', { tool: TOOL_ID.transfer, locale, mode: 'link_create_room' });
    try {
      const hostToken = createTransferSecret(32);
      const config = await requestRoomApi<{ iceServers: RTCIceServer[]; viewerLimit: number }>('/api/screenshare/config');
      const created = await requestRoomApi<{ roomId: string; viewerLimit: number }>('/api/screenshare/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Screenshare-Host-Token': hostToken },
        body: JSON.stringify({
          qualityMode: 'automatic',
          viewerLimit: config.viewerLimit,
          hostName: cleanName,
          access: 'public',
          hostCameraOn: false,
          hostMicrophoneOn: false,
        }),
      });
      const runtime: RoomRuntime = {
        roomId: created.roomId,
        role: 'host',
        selfPeerId: 'host',
        localName: cleanName,
        hostToken,
        iceServers: config.iceServers,
        cursor: 0,
        peers: new Map(),
        closed: false,
        signalInFlight: false,
        rosterInFlight: false,
        connectedEventSent: false,
      };
      runtimeRef.current = runtime;
      const url = new URL(window.location.href);
      url.searchParams.set('room', created.roomId);
      url.searchParams.set('expanded', '1');
      setRoomId(created.roomId);
      setRoomUrl(url.toString());
      setRole('host');
      setParticipants([{ id: 'host', displayName: cleanName, role: 'host', state: 'connected', isLocal: true }]);
      startRoomLoops(runtime);
      trackEvent('tool_completed', { tool: TOOL_ID.transfer, locale, mode: 'link_create_room' });
    } catch (error) {
      setNotice({ tone: 'error', text: messageForError(error) });
      trackEvent('tool_error', { tool: TOOL_ID.transfer, locale, error_type: 'network_error' });
    } finally {
      setBusy(false);
    }
  }, [copy.deviceNameTemplate, deviceName, locale, messageForError, startRoomLoops]);

  const joinRoom = useCallback(async () => {
    if (!/^[a-f0-9]{48}$/.test(roomId)) {
      setNotice({ tone: 'error', text: copy.roomExpired });
      return;
    }

    setBusy(true);
    setNotice(null);
    trackEvent('tool_started', { tool: TOOL_ID.transfer, locale, mode: 'link_join_room' });
    try {
      const [config, roomInfo] = await Promise.all([
        requestRoomApi<{ iceServers: RTCIceServer[] }>('/api/screenshare/config'),
        requestRoomApi<{ hostName?: string; viewerCount?: number }>(`/api/screenshare/rooms/${roomId}`),
      ]);
      const suggestedName = deviceNameFor(copy.deviceNameTemplate, Math.max(2, (roomInfo.viewerCount ?? 0) + 2));
      const cleanName = nameWasEdited ? (deviceName.trim() || suggestedName) : suggestedName;
      setDeviceName(cleanName);
      const viewerToken = createTransferSecret(32);
      const peerId = createTransferSecret(16);
      const runtime: RoomRuntime = {
        roomId,
        role: 'viewer',
        selfPeerId: peerId,
        localName: cleanName,
        viewerToken,
        iceServers: config.iceServers,
        cursor: 0,
        peers: new Map(),
        closed: false,
        signalInFlight: false,
        rosterInFlight: false,
        connectedEventSent: false,
      };
      runtimeRef.current = runtime;
      await requestRoomApi(`/api/screenshare/rooms/${roomId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Screenshare-Viewer-Token': viewerToken },
        body: JSON.stringify({ peerId, displayName: cleanName, cameraOn: false, microphoneOn: false }),
      });
      const url = new URL(window.location.href);
      url.searchParams.set('room', roomId);
      url.searchParams.set('expanded', '1');
      setRoomUrl(url.toString());
      setRole('viewer');
      setParticipants([
        { id: peerId, displayName: cleanName, role: 'viewer', state: 'connected', isLocal: true },
        { id: 'host', displayName: roomInfo.hostName || deviceNameFor(copy.deviceNameTemplate, 1), role: 'host', state: 'connecting', isLocal: false },
      ]);
      startRoomLoops(runtime);
      trackEvent('tool_completed', { tool: TOOL_ID.transfer, locale, mode: 'link_join_room' });
    } catch (error) {
      await closeRuntime(false);
      setNotice({ tone: 'error', text: messageForError(error) });
      trackEvent('tool_error', { tool: TOOL_ID.transfer, locale, error_type: (error as ApiError)?.code === 'room_full' ? 'validation_failed' : 'network_error' });
    } finally {
      setBusy(false);
    }
  }, [closeRuntime, copy.deviceNameTemplate, copy.roomExpired, deviceName, locale, messageForError, nameWasEdited, roomId, startRoomLoops]);

  const sendFiles = useCallback(async () => {
    const runtime = runtimeRef.current;
    const recipients = runtime
      ? Array.from(runtime.peers.values()).filter((peer) => peer.channel?.readyState === 'open')
      : [];
    if (!runtime || !recipients.length || !selectedFiles.length) return;

    setSending(true);
    setNotice(null);
    trackEvent('tool_started', { tool: TOOL_ID.transfer, locale, mode: 'link_send_file' });
    try {
      const outcomes = await Promise.allSettled(recipients.map(async (peer) => {
        const channel = peer.channel;
        if (!channel || channel.readyState !== 'open') throw new Error('channel_closed');

        for (const file of selectedFiles) {
          const transferId = createTransferSecret(8);
          const activityId = `send:${peer.id}:${transferId}`;
          const totalChunks = Math.ceil(file.size / TRANSFER_CHUNK_SIZE);
          upsertActivity({
            id: activityId,
            peerId: peer.id,
            peerName: peer.displayName,
            fileName: file.name,
            size: file.size,
            direction: 'send',
            percent: 0,
            state: 'sending',
          });
          channel.send(JSON.stringify({
            type: 'meta',
            transferId,
            senderName: runtime.localName,
            fileName: file.name,
            mimeType: file.type || 'application/octet-stream',
            size: file.size,
            totalChunks,
          } satisfies RoomMeta));

          for (let index = 0; index < totalChunks; index += 1) {
            await waitForDataChannelDrain(channel, 256 * 1024);
            if (channel.readyState !== 'open') throw new Error('channel_closed');
            const start = index * TRANSFER_CHUNK_SIZE;
            const chunk = await file.slice(start, start + TRANSFER_CHUNK_SIZE).arrayBuffer();
            channel.send(chunk);
            patchActivity(activityId, {
              percent: Math.min(100, ((index + 1) / Math.max(1, totalChunks)) * 100),
            });
          }

          await waitForDataChannelDrain(channel, 256 * 1024);
          if (channel.readyState !== 'open') throw new Error('channel_closed');
          channel.send(JSON.stringify({ type: 'done', transferId }));
          patchActivity(activityId, { percent: 100, state: 'sent' });
        }
      }));

      const failedPeers = outcomes.flatMap((outcome, index) => outcome.status === 'rejected' ? [recipients[index].id] : []);
      if (failedPeers.length) {
        failedPeers.forEach(failPeerTransfers);
        setNotice({ tone: 'error', text: copy.failed });
        trackEvent('tool_error', { tool: TOOL_ID.transfer, locale, error_type: 'processing_failed' });
      } else {
        setNotice({ tone: 'success', text: copy.sent });
        setSelectedFiles([]);
        trackEvent('tool_completed', { tool: TOOL_ID.transfer, locale, mode: 'link_send_file' });
      }
    } catch {
      setNotice({ tone: 'error', text: copy.failed });
      trackEvent('tool_error', { tool: TOOL_ID.transfer, locale, error_type: 'processing_failed' });
    } finally {
      setSending(false);
    }
  }, [copy.failed, copy.sent, failPeerTransfers, locale, patchActivity, selectedFiles, upsertActivity]);

  const copyRoomLink = useCallback(async () => {
    if (!roomUrl) return;
    try {
      await navigator.clipboard.writeText(roomUrl);
      setLinkCopied(true);
      setNotice({ tone: 'success', text: copy.copied });
      trackEvent('result_copied', { tool: TOOL_ID.transfer, locale, field: 'room_link' });
      window.setTimeout(() => setLinkCopied(false), 2_000);
    } catch {
      setNotice({ tone: 'error', text: copy.unknownError });
    }
  }, [copy.copied, copy.unknownError, locale, roomUrl]);

  const leaveRoom = useCallback(async () => {
    await closeRuntime(true);
    setRole(null);
    setRoomUrl('');
    setParticipants([]);
    setSelectedFiles([]);
    setActivities([]);
    setReadyFiles([]);
    setNotice(null);
    if (!initialRoomId) {
      setRoomId('');
      setDeviceName(deviceNameFor(copy.deviceNameTemplate, 1));
      setNameWasEdited(false);
    } else {
      setDeviceName(deviceNameFor(copy.deviceNameTemplate, 2));
      setNameWasEdited(false);
    }
  }, [closeRuntime, copy.deviceNameTemplate, initialRoomId]);

  const updateFiles = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length) setSelectedFiles((current) => [...current, ...files]);
    event.currentTarget.value = '';
  }, []);

  const handleDropFiles = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingFiles(false);
    const files = Array.from(event.dataTransfer.files);
    if (files.length) setSelectedFiles((current) => [...current, ...files]);
  }, []);

  const removeSelectedFile = useCallback((index: number) => {
    setSelectedFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
  }, []);

  const removeReadyFile = useCallback((fileId: string) => {
    setReadyFiles((current) => current.filter((file) => file.id !== fileId));
    setActivities((current) => current.filter((activity) => activity.id !== fileId));
  }, []);

  const participantStatusLabel = (participant: RoomParticipant): string => {
    if (participant.state === 'connected') return copy.connected;
    if (participant.state === 'disconnected') return copy.disconnected;
    return copy.connecting;
  };

  const connectedDeviceCount = participants.filter((participant) => participant.state === 'connected').length;
  const connectedPeerCount = participants.filter((participant) => !participant.isLocal && participant.state === 'connected').length;
  const activeActivities = activities.filter((activity) => activity.state === 'sending' || activity.state === 'receiving' || activity.state === 'failed');
  const localRoomActive = role !== null;

  return (
    <Card padding="none" className="overflow-hidden">
      {localRoomActive ? (
        <>
          <div className="flex flex-col gap-4 bg-slate-900 px-4 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-700 text-white">
                <Files size={22} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{copy.roomTitle}</p>
                <h3 className="mt-1 truncate text-xl font-bold tracking-tight sm:text-2xl">{copy.title}</h3>
              </div>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              <span className="font-semibold tabular-nums">{connectedDeviceCount}</span>
              <span>{copy.connectedDevices}</span>
            </div>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            {notice ? (
              <div className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${notice.tone === 'error' ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`} role="status" aria-live="polite">
                {notice.tone === 'error' ? <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> : <Check size={16} className="mt-0.5 shrink-0" aria-hidden="true" />}
                <span>{notice.text}</span>
              </div>
            ) : null}

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4" aria-label={copy.inviteLink}>
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Link2 size={17} className="shrink-0 text-brand-700" aria-hidden="true" />
                  <Input
                    aria-label={copy.inviteLink}
                    readOnly
                    value={roomUrl}
                    className="min-w-0 flex-1"
                    onFocus={(event) => event.currentTarget.select()}
                  />
                </div>
                <Button variant="primary" onClick={() => void copyRoomLink()} className="w-full shrink-0 sm:w-auto">
                  {linkCopied ? <Check size={16} className="mr-2" aria-hidden="true" /> : <ClipboardCopy size={16} className="mr-2" aria-hidden="true" />}
                  {linkCopied ? copy.copied : copy.copyLink}
                </Button>
              </div>
            </section>

            <div className="grid min-w-0 gap-4 lg:grid-cols-2">
              <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4" aria-labelledby="transfer-room-participants">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 id="transfer-room-participants" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Users size={17} className="text-brand-700" aria-hidden="true" />{copy.participants}
                  </h4>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{connectedDeviceCount}</span>
                </div>
                <ul className="space-y-2">
                  {participants.map((participant) => (
                    <li key={participant.id} className="flex min-w-0 items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
                      <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${participant.isLocal ? 'bg-brand-100 text-brand-800' : 'bg-white text-slate-700'}`}>
                        {participant.displayName.trim().slice(0, 1).toLocaleUpperCase() || <MonitorSmartphone size={17} aria-hidden="true" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block break-words text-sm font-medium text-slate-900">{participant.displayName}</span>
                        {participant.isLocal ? <span className="block text-xs text-slate-500">{copy.you}</span> : null}
                      </span>
                      <span className={`inline-flex shrink-0 items-center gap-1.5 text-xs ${participant.state === 'connected' ? 'text-emerald-700' : participant.state === 'disconnected' ? 'text-slate-500' : 'text-amber-700'}`}>
                        <span className={`h-2 w-2 rounded-full ${participant.state === 'connected' ? 'bg-emerald-500' : participant.state === 'disconnected' ? 'bg-slate-300' : 'bg-amber-400'}`} aria-hidden="true" />
                        <span>{participantStatusLabel(participant)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                {connectedPeerCount === 0 ? <p className="mt-3 text-sm leading-5 text-slate-600">{copy.waitingForPeople}</p> : null}
              </section>

              <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4" aria-labelledby="transfer-room-send-files">
                <div className="mb-3 flex items-center gap-2">
                  <Files size={17} className="text-brand-700" aria-hidden="true" />
                  <h4 id="transfer-room-send-files" className="text-sm font-semibold text-slate-900">{copy.sendToEveryone}</h4>
                </div>
                <input ref={roomFileInputRef} className="sr-only" type="file" multiple onChange={updateFiles} />
                <div
                  className={`rounded-xl border border-dashed p-4 text-center transition-colors ${isDraggingFiles ? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-slate-50'}`}
                  onDragEnter={(event) => { event.preventDefault(); setIsDraggingFiles(true); }}
                  onDragOver={(event) => event.preventDefault()}
                  onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDraggingFiles(false); }}
                  onDrop={handleDropFiles}
                >
                  <p className="text-sm text-slate-600">{copy.dropFilesHint}</p>
                  <Button variant="secondary" onClick={() => roomFileInputRef.current?.click()} disabled={sending} className="mt-3 w-full sm:w-auto">
                    <Files size={16} className="mr-2" aria-hidden="true" />{copy.chooseFiles}
                  </Button>
                </div>

                {selectedFiles.length ? (
                  <ul className="mt-3 max-h-40 space-y-1 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2">
                    {selectedFiles.map((file, index) => (
                      <li key={`${file.name}-${file.size}-${file.lastModified}-${index}`} className="flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5">
                        <File size={16} className="shrink-0 text-slate-500" aria-hidden="true" />
                        <span className="min-w-0 flex-1 break-all text-sm text-slate-800">{file.name}</span>
                        <span className="shrink-0 text-xs text-slate-500">{formatBytes(file.size)}</span>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                          aria-label={`${copy.removeFile}: ${file.name}`}
                          onClick={() => removeSelectedFile(index)}
                        ><Trash2 size={15} aria-hidden="true" /></button>
                      </li>
                    ))}
                  </ul>
                ) : <p className="mt-3 text-center text-xs leading-5 text-slate-500">{copy.noFilesSelected}</p>}

                <Button
                  onClick={() => void sendFiles()}
                  disabled={!selectedFiles.length || connectedPeerCount === 0 || sending}
                  className="mt-3 w-full"
                >
                  {sending ? <LoaderCircle size={16} className="mr-2 animate-spin" aria-hidden="true" /> : <Files size={16} className="mr-2" aria-hidden="true" />}
                  {copy.sendToEveryone}
                </Button>
                {connectedPeerCount === 0 ? <p className="mt-2 text-xs leading-5 text-slate-500">{copy.waitingForDevice}</p> : null}
              </section>
            </div>

            <div className="grid min-w-0 gap-4 lg:grid-cols-2">
              <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4" aria-labelledby="transfer-room-activity" aria-live="polite">
                <h4 id="transfer-room-activity" className="mb-3 text-sm font-semibold text-slate-900">{copy.activityTitle}</h4>
                {activeActivities.length ? (
                  <ul className="space-y-3">
                    {activeActivities.map((activity) => (
                      <li key={activity.id} className="min-w-0 rounded-lg bg-slate-50 p-3">
                        <div className="mb-2 flex min-w-0 items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="break-all text-sm font-medium text-slate-900">{activity.fileName}</p>
                            <p className="mt-1 text-xs text-slate-600">
                              {activity.state === 'failed' ? copy.failed : activity.direction === 'send' ? copy.sending : copy.receiving} · {activity.peerName} · {formatBytes(activity.size)}
                            </p>
                          </div>
                          <span className="shrink-0 text-xs font-medium tabular-nums text-slate-600">{Math.round(activity.percent)}%</span>
                        </div>
                        <ProgressBar value={activity.percent} />
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm leading-5 text-slate-600">{copy.noActiveTransfers}</p>}
              </section>

              <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4" aria-labelledby="transfer-room-received" aria-live="polite">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 id="transfer-room-received" className="text-sm font-semibold text-slate-900">{copy.receivedFiles}</h4>
                  {readyFiles.length ? <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800">{readyFiles.length}</span> : null}
                </div>
                {readyFiles.length ? (
                  <ul className="space-y-2">
                    {readyFiles.map((file) => (
                      <li key={file.id} className="flex min-w-0 flex-col gap-3 rounded-lg bg-slate-50 p-3 sm:flex-row sm:items-center">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700"><File size={18} aria-hidden="true" /></span>
                        <div className="min-w-0 flex-1">
                          <p className="break-all text-sm font-medium text-slate-900">{file.fileName}</p>
                          <p className="mt-1 text-xs text-slate-600">{file.senderName} · {formatBytes(file.size)} · {copy.readyToDownload}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Button variant="secondary" onClick={() => {
                            downloadBlob(file.blob, file.fileName);
                            trackEvent('result_downloaded', { tool: TOOL_ID.transfer, locale, field: 'received_file' });
                          }}>
                            <Download size={16} className="mr-2" aria-hidden="true" />{copy.download}
                          </Button>
                          <button
                            type="button"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                            aria-label={`${copy.removeFile}: ${file.fileName}`}
                            onClick={() => removeReadyFile(file.id)}
                          ><Trash2 size={16} aria-hidden="true" /></button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm leading-5 text-slate-600">{copy.receivedFilesEmpty}</p>}
              </section>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <details className="min-w-0 flex-1">
                <summary className="cursor-pointer text-sm font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">{copy.learnMore}</summary>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{copy.privacyBody}</p>
              </details>
              <Button variant="ghost" onClick={() => void leaveRoom()} className="shrink-0">{role === 'host' ? copy.endRoom : copy.leaveRoom}</Button>
            </div>
          </div>
        </>
      ) : (
        <div className="grid min-w-0 gap-4 p-4 sm:grid-cols-[minmax(0,1.05fr)_minmax(17rem,0.95fr)] sm:items-center sm:p-5">
          {notice ? (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900 sm:col-span-2" role="alert">
              <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{notice.text}</span>
            </div>
          ) : null}

          <div className="flex min-h-56 min-w-0 flex-col justify-between gap-6 rounded-xl bg-slate-900 p-5 text-white sm:min-h-64 sm:p-6">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-brand-300">
              <Files size={23} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">WebRTC</p>
              <h3 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">{copy.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{copy.intro}</p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center gap-4 sm:px-3 sm:py-4">
            <label className="block min-w-0 text-sm font-medium text-slate-800">
              <span>{copy.deviceName}</span>
              <Input
                value={deviceName}
                onChange={(event) => { setNameWasEdited(true); setDeviceName(event.target.value); }}
                maxLength={32}
                autoComplete="nickname"
                className="mt-1.5"
              />
            </label>
            <Button onClick={() => void (initialRoomId ? joinRoom() : createRoom())} disabled={busy} className="w-full">
              {busy ? <LoaderCircle size={16} className="mr-2 animate-spin" aria-hidden="true" /> : <Users size={16} className="mr-2" aria-hidden="true" />}
              {initialRoomId ? copy.joinRoom : copy.createRoom}
            </Button>
            <details className="border-t border-slate-200 pt-4">
              <summary className="cursor-pointer text-sm font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">{copy.learnMore}</summary>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy.privacyBody}</p>
            </details>
          </div>
        </div>
      )}
    </Card>
  );
}
