'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { Check, CircleAlert, ClipboardCopy, Download, FileUp, Link2, LoaderCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { transferLinkCopy } from '@/data/content/transfer-link-ui';
import type { AppLocale } from '@/lib/i18n/config';
import { formatBytes } from '@/lib/file-size';
import { downloadBlob } from '@/lib/qr-code';
import { trackEvent, TOOL_ID } from '@/lib/analytics';
import {
  buildUint8Chunks,
  createTransferSecret,
  mergeUint8Chunks,
  waitForDataChannelDrain,
} from '@/lib/transfer';
import type { ScreenShareSignal, UnsequencedSignal } from '@/lib/screenshare/protocol';

type Props = Readonly<{
  locale: AppLocale;
  initialRoomId: string | null;
}>;

type ApiError = Error & { code?: string };
type RoomRole = 'host' | 'viewer';
type ParticipantStatus = 'waiting' | 'connecting' | 'connected' | 'disconnected';
type RoomParticipant = {
  id: string;
  displayName: string;
  role: RoomRole;
  state: ParticipantStatus;
};
type PendingCandidate = { negotiationId: string; candidate: RTCIceCandidateInit };
type RoomPeerRuntime = {
  id: string;
  displayName: string;
  pc: RTCPeerConnection;
  channel: RTCDataChannel | null;
  negotiationId: string;
  candidates: PendingCandidate[];
};
type RoomRuntime = {
  roomId: string;
  role: RoomRole;
  localName: string;
  hostToken?: string;
  viewerToken?: string;
  peerId?: string;
  iceServers: RTCIceServer[];
  cursor: number;
  peers: Map<string, RoomPeerRuntime>;
  negotiationIdForViewer?: string;
  viewerCandidates: PendingCandidate[];
  viewerPc?: RTCPeerConnection;
  closed: boolean;
  signalInFlight: boolean;
  rosterInFlight: boolean;
  signalTimer?: number;
  rosterTimer?: number;
  heartbeatTimer?: number;
};
type RoomMeta = {
  type: 'meta';
  fileName: string;
  mimeType: string;
  size: number;
  totalChunks: number;
};
type IncomingFile = {
  meta: RoomMeta;
  chunks: Uint8Array[];
  receivedBytes: number;
};
type ReadyFile = {
  id: string;
  fileName: string;
  size: number;
  blob: Blob;
};
type TransferProgress = {
  fileName: string;
  percent: number;
  state: 'sending' | 'sent' | 'failed';
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

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
    <div className="h-2 overflow-hidden rounded-full bg-slate-200" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(safeValue)} role="progressbar">
      <div className="h-full rounded-full bg-brand-600 transition-[width]" style={{ width: `${safeValue}%` }} />
    </div>
  );
}

export function TransferLinkRoom({ locale, initialRoomId }: Props) {
  const copy = useMemo(() => transferLinkCopy[locale], [locale]);
  const [deviceName, setDeviceName] = useState('');
  const [roomId, setRoomId] = useState(initialRoomId ?? '');
  const [roomUrl, setRoomUrl] = useState('');
  const [role, setRole] = useState<RoomRole | null>(null);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progressByPeer, setProgressByPeer] = useState<Record<string, TransferProgress>>({});
  const [incomingProgress, setIncomingProgress] = useState<{ fileName: string; percent: number } | null>(null);
  const [readyFiles, setReadyFiles] = useState<ReadyFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [notice, setNotice] = useState<{ tone: 'info' | 'success' | 'error'; text: string } | null>(null);
  const runtimeRef = useRef<RoomRuntime | null>(null);
  const incomingFileRef = useRef<IncomingFile | null>(null);
  const roomFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setRoomId(initialRoomId ?? '');
  }, [initialRoomId]);

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

  const signalHeaders = useCallback((runtime: RoomRuntime) => ({
    'Content-Type': 'application/json',
    ...(runtime.role === 'host'
      ? { 'X-Screenshare-Host-Token': runtime.hostToken ?? '' }
      : { 'X-Screenshare-Viewer-Token': runtime.viewerToken ?? '' }),
  }), []);

  const sendSignal = useCallback(async (
    runtime: RoomRuntime,
    signal: UnsequencedSignal,
    toPeerId?: string,
  ) => {
    await requestRoomApi(`/api/screenshare/rooms/${runtime.roomId}/signals`, {
      method: 'POST',
      headers: signalHeaders(runtime),
      body: JSON.stringify({
        role: runtime.role,
        ...(runtime.role === 'viewer' ? { peerId: runtime.peerId } : {}),
        ...(runtime.role === 'host' ? { toPeerId } : {}),
        signal,
      }),
    });
  }, [signalHeaders]);

  const receiveFile = useCallback(async (data: string | Blob | ArrayBuffer) => {
    if (typeof data === 'string') {
      let parsed: unknown;
      try {
        parsed = JSON.parse(data);
      } catch {
        return;
      }

      if (isRecord(parsed) && parsed.type === 'meta' && typeof parsed.fileName === 'string' && typeof parsed.mimeType === 'string' && typeof parsed.size === 'number' && typeof parsed.totalChunks === 'number') {
        const meta: RoomMeta = {
          type: 'meta',
          fileName: parsed.fileName,
          mimeType: parsed.mimeType,
          size: Math.max(0, parsed.size),
          totalChunks: Math.max(0, parsed.totalChunks),
        };
        incomingFileRef.current = { meta, chunks: [], receivedBytes: 0 };
        setIncomingProgress({ fileName: meta.fileName, percent: 0 });
        return;
      }

      if (isRecord(parsed) && parsed.type === 'done') {
        const incoming = incomingFileRef.current;
        if (!incoming) return;

        if (incoming.receivedBytes !== incoming.meta.size || incoming.chunks.length !== incoming.meta.totalChunks) {
          incomingFileRef.current = null;
          setIncomingProgress(null);
          setNotice({ tone: 'error', text: copy.connectionFailed });
          return;
        }

        const bytes = mergeUint8Chunks(incoming.chunks, incoming.meta.size);
        const file: ReadyFile = {
          id: createTransferSecret(8),
          fileName: incoming.meta.fileName,
          size: incoming.meta.size,
          blob: new Blob([bytes], { type: incoming.meta.mimeType || 'application/octet-stream' }),
        };
        setReadyFiles((current) => [file, ...current]);
        setIncomingProgress(null);
        incomingFileRef.current = null;
        return;
      }
      return;
    }

    const incoming = incomingFileRef.current;
    if (!incoming) return;

    const buffer = data instanceof Blob ? await data.arrayBuffer() : data;
    const chunk = new Uint8Array(buffer);
    incoming.chunks.push(chunk);
    incoming.receivedBytes += chunk.byteLength;
    setIncomingProgress({
      fileName: incoming.meta.fileName,
      percent: incoming.meta.size > 0 ? Math.min(100, (incoming.receivedBytes / incoming.meta.size) * 100) : 0,
    });
  }, [copy.connectionFailed]);

  const attachRoomChannel = useCallback((runtime: RoomRuntime, peerId: string, channel: RTCDataChannel) => {
    channel.binaryType = 'arraybuffer';
    channel.bufferedAmountLowThreshold = 256 * 1024;

    if (runtime.role === 'host') {
      const peer = runtime.peers.get(peerId);
      if (peer) peer.channel = channel;
      channel.onopen = () => setParticipantStatus(peerId, 'connected');
      channel.onclose = () => setParticipantStatus(peerId, 'disconnected');
      channel.onerror = () => setParticipantStatus(peerId, 'disconnected');
      return;
    }

    channel.onopen = () => {
      setParticipantStatus('host', 'connected');
      setNotice({ tone: 'success', text: copy.connected });
      trackEvent('tool_completed', { tool: TOOL_ID.transfer, locale, mode: 'link_connected' });
    };
    channel.onclose = () => setParticipantStatus('host', 'disconnected');
    channel.onerror = () => setParticipantStatus('host', 'disconnected');
    channel.onmessage = (event) => { void receiveFile(event.data as string | Blob | ArrayBuffer); };
  }, [copy.connected, locale, receiveFile, setParticipantStatus]);

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
    runtime.viewerPc?.close();
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
          body: JSON.stringify({ peerId: runtime.peerId }),
        });
      }
    } catch {
      // Leases and room expiration clean up interrupted sessions.
    }
  }, []);

  const cleanupRef = useRef(closeRuntime);
  cleanupRef.current = closeRuntime;
  useEffect(() => () => { void cleanupRef.current(true); }, []);

  const startHostPeer = useCallback(async (
    runtime: RoomRuntime,
    participant: { id: string; displayName: string },
  ) => {
    if (runtime.closed || runtime.peers.has(participant.id)) return;
    const pc = new RTCPeerConnection({ iceServers: runtime.iceServers, iceCandidatePoolSize: 2 });
    const peer: RoomPeerRuntime = {
      id: participant.id,
      displayName: participant.displayName,
      pc,
      channel: null,
      negotiationId: crypto.randomUUID(),
      candidates: [],
    };
    runtime.peers.set(participant.id, peer);
    const channel = pc.createDataChannel('adtools-transfer', { ordered: true });
    attachRoomChannel(runtime, participant.id, channel);
    pc.onconnectionstatechange = () => setParticipantStatus(participant.id, connectionStateToStatus(pc.connectionState));
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

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await sendSignal(runtime, {
        type: 'offer',
        negotiationId: peer.negotiationId,
        description: { type: 'offer', sdp: pc.localDescription?.sdp ?? offer.sdp ?? '' },
      }, participant.id);
    } catch {
      pc.close();
      runtime.peers.delete(participant.id);
      setParticipantStatus(participant.id, 'disconnected');
    }
  }, [attachRoomChannel, sendSignal, setParticipantStatus]);

  const pollHostSignals = useCallback(async (runtime: RoomRuntime) => {
    if (runtime.closed || runtime.signalInFlight) return;
    runtime.signalInFlight = true;
    try {
      const result = await requestRoomApi<{ messages: ScreenShareSignal[]; roomState?: string }>(
        `/api/screenshare/rooms/${runtime.roomId}/signals?role=host&after=${runtime.cursor}`,
        { headers: { 'X-Screenshare-Host-Token': runtime.hostToken ?? '' } },
      );
      for (const signal of result.messages) {
        runtime.cursor = Math.max(runtime.cursor, signal.sequence);
        const peer = runtime.peers.get(signal.fromPeerId);
        if (signal.type === 'answer' && peer && signal.negotiationId === peer.negotiationId) {
          await peer.pc.setRemoteDescription(signal.description);
          for (const pending of peer.candidates.splice(0).filter((item) => item.negotiationId === peer.negotiationId)) {
            await peer.pc.addIceCandidate(pending.candidate).catch(() => undefined);
          }
        } else if (signal.type === 'candidate') {
          if (!peer || !signal.candidate || !signal.negotiationId) continue;
          if (peer.pc.remoteDescription && signal.negotiationId === peer.negotiationId) {
            await peer.pc.addIceCandidate(signal.candidate).catch(() => undefined);
          } else {
            peer.candidates.push({ negotiationId: signal.negotiationId, candidate: signal.candidate });
          }
        } else if (signal.type === 'bye') {
          peer?.channel?.close();
          peer?.pc.close();
          runtime.peers.delete(signal.fromPeerId);
          setParticipantStatus(signal.fromPeerId, 'disconnected');
        }
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
  }, [closeRuntime, copy.roomExpired, setParticipantStatus]);

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
      const guests = result.peers.map((person) => ({
        id: person.id,
        displayName: person.displayName,
        role: 'viewer' as const,
        state: runtime.peers.get(person.id)?.channel?.readyState === 'open'
          ? 'connected' as const
          : (person.state === 'disconnected' ? 'disconnected' as const : 'connecting' as const),
      }));
      setParticipants([
        { id: 'host', displayName: result.host.displayName, role: 'host', state: 'connected' },
        ...guests,
      ]);
      for (const person of result.peers) {
        const currentPeer = runtime.peers.get(person.id);
        if (!currentPeer) void startHostPeer(runtime, person);
        else currentPeer.displayName = person.displayName;
      }
      for (const [peerId, peer] of runtime.peers) {
        if (!result.peers.some((person) => person.id === peerId)) {
          peer.channel?.close();
          peer.pc.close();
          runtime.peers.delete(peerId);
        }
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
  }, [closeRuntime, copy.roomExpired, startHostPeer]);

  const startHostRoomLoops = useCallback((runtime: RoomRuntime) => {
    const heartbeat = () => requestRoomApi(`/api/screenshare/rooms/${runtime.roomId}/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Screenshare-Host-Token': runtime.hostToken ?? '' },
      body: JSON.stringify({ role: 'host', audioAvailable: false, qualityMode: 'automatic', cameraOn: false, microphoneOn: false }),
    }).catch(() => undefined);
    void pollHostSignals(runtime);
    void syncHostRoster(runtime);
    void heartbeat();
    runtime.signalTimer = window.setInterval(() => { void pollHostSignals(runtime); }, 1_200);
    runtime.rosterTimer = window.setInterval(() => { void syncHostRoster(runtime); }, 3_000);
    runtime.heartbeatTimer = window.setInterval(() => { void heartbeat(); }, 20_000);
  }, [pollHostSignals, syncHostRoster]);

  const createRoom = useCallback(async () => {
    const cleanName = deviceName.trim();
    if (!cleanName) {
      setNotice({ tone: 'error', text: copy.deviceName });
      return;
    }

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
        localName: cleanName,
        hostToken,
        iceServers: config.iceServers,
        cursor: 0,
        peers: new Map(),
        viewerCandidates: [],
        closed: false,
        signalInFlight: false,
        rosterInFlight: false,
      };
      runtimeRef.current = runtime;
      const url = new URL(window.location.href);
      url.search = '';
      url.hash = '';
      url.searchParams.set('room', created.roomId);
      setRoomId(created.roomId);
      setRoomUrl(url.toString());
      setRole('host');
      setParticipants([{ id: 'host', displayName: cleanName, role: 'host', state: 'connected' }]);
      setNotice({ tone: 'success', text: copy.waitingForPeople });
      startHostRoomLoops(runtime);
      trackEvent('tool_completed', { tool: TOOL_ID.transfer, locale, mode: 'link_create_room' });
    } catch (error) {
      setNotice({ tone: 'error', text: messageForError(error) });
      trackEvent('tool_error', { tool: TOOL_ID.transfer, locale, error_type: 'network_error' });
    } finally {
      setBusy(false);
    }
  }, [copy.deviceName, copy.waitingForPeople, deviceName, locale, messageForError, startHostRoomLoops]);

  const startViewerRoomLoops = useCallback((runtime: RoomRuntime, hostName: string) => {
    const heartbeat = () => requestRoomApi(`/api/screenshare/rooms/${runtime.roomId}/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Screenshare-Viewer-Token': runtime.viewerToken ?? '' },
      body: JSON.stringify({ role: 'viewer', peerId: runtime.peerId, state: connectionStateToStatus(runtime.viewerPc?.connectionState ?? 'connecting'), cameraOn: false, microphoneOn: false }),
    }).catch(() => undefined);

    const pollSignals = async () => {
      if (runtime.closed || runtime.signalInFlight) return;
      runtime.signalInFlight = true;
      try {
        const result = await requestRoomApi<{ messages: ScreenShareSignal[]; roomState?: string }>(
          `/api/screenshare/rooms/${runtime.roomId}/signals?role=viewer&peerId=${runtime.peerId}&after=${runtime.cursor}`,
          { headers: { 'X-Screenshare-Viewer-Token': runtime.viewerToken ?? '' } },
        );
        for (const signal of result.messages) {
          runtime.cursor = Math.max(runtime.cursor, signal.sequence);
          const pc = runtime.viewerPc;
          if (signal.type === 'offer' && pc && signal.description) {
            runtime.negotiationIdForViewer = signal.negotiationId;
            await pc.setRemoteDescription(signal.description);
            for (const pending of runtime.viewerCandidates.splice(0).filter((item) => item.negotiationId === signal.negotiationId)) {
              await pc.addIceCandidate(pending.candidate).catch(() => undefined);
            }
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            await sendSignal(runtime, {
              type: 'answer',
              negotiationId: signal.negotiationId ?? '',
              description: { type: 'answer', sdp: pc.localDescription?.sdp ?? answer.sdp ?? '' },
            });
          } else if (signal.type === 'candidate' && signal.candidate && signal.negotiationId && pc) {
            if (pc.remoteDescription && signal.negotiationId === runtime.negotiationIdForViewer) {
              await pc.addIceCandidate(signal.candidate).catch(() => undefined);
            } else {
              runtime.viewerCandidates.push({ negotiationId: signal.negotiationId, candidate: signal.candidate });
            }
          } else if (signal.type === 'bye') {
            setParticipantStatus('host', 'disconnected');
          }
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
    };

    const syncRoster = async () => {
      if (runtime.closed || runtime.rosterInFlight || !runtime.peerId) return;
      runtime.rosterInFlight = true;
      try {
        const result = await requestRoomApi<{
          host: { id: string; displayName: string };
          hostPeerId?: string;
          peers: Array<{ id: string; displayName: string; state: string }>;
        }>(`/api/screenshare/rooms/${runtime.roomId}/participants?peerId=${runtime.peerId}`, {
          headers: { 'X-Screenshare-Viewer-Token': runtime.viewerToken ?? '' },
        });
        setParticipants([
          { id: result.hostPeerId ?? result.host.id ?? 'host', displayName: result.host.displayName || hostName, role: 'host', state: connectionStateToStatus(runtime.viewerPc?.connectionState ?? 'connecting') },
          ...result.peers.map((person) => ({
            id: person.id,
            displayName: person.id === runtime.peerId ? `${person.displayName} (${copy.you})` : person.displayName,
            role: 'viewer' as const,
            state: person.id === runtime.peerId ? connectionStateToStatus(runtime.viewerPc?.connectionState ?? 'connecting') : (person.state === 'connected' ? 'connected' as const : 'connecting' as const),
          })),
        ]);
      } catch (error) {
        const code = (error as ApiError)?.code;
        if (code === 'room_ended' || code === 'not_found') {
          setNotice({ tone: 'error', text: copy.roomExpired });
          await closeRuntime(false);
        }
      } finally {
        runtime.rosterInFlight = false;
      }
    };

    void pollSignals();
    void syncRoster();
    void heartbeat();
    runtime.signalTimer = window.setInterval(() => { void pollSignals(); }, 1_200);
    runtime.rosterTimer = window.setInterval(() => { void syncRoster(); }, 4_000);
    runtime.heartbeatTimer = window.setInterval(() => { void heartbeat(); }, 20_000);
  }, [closeRuntime, copy.roomExpired, copy.you, sendSignal, setParticipantStatus]);

  const joinRoom = useCallback(async () => {
    const cleanName = deviceName.trim();
    if (!cleanName) {
      setNotice({ tone: 'error', text: copy.deviceName });
      return;
    }
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
        requestRoomApi<{ hostName?: string }>(`/api/screenshare/rooms/${roomId}`),
      ]);
      const viewerToken = createTransferSecret(32);
      const peerId = createTransferSecret(16);
      const pc = new RTCPeerConnection({ iceServers: config.iceServers, iceCandidatePoolSize: 2 });
      const runtime: RoomRuntime = {
        roomId,
        role: 'viewer',
        localName: cleanName,
        viewerToken,
        peerId,
        iceServers: config.iceServers,
        cursor: 0,
        peers: new Map(),
        viewerCandidates: [],
        viewerPc: pc,
        closed: false,
        signalInFlight: false,
        rosterInFlight: false,
      };
      runtimeRef.current = runtime;
      pc.onconnectionstatechange = () => setParticipantStatus('host', connectionStateToStatus(pc.connectionState));
      pc.onicecandidate = (event) => {
        if (!event.candidate || runtime.closed || !runtime.negotiationIdForViewer) return;
        const candidate = event.candidate.toJSON();
        if (!candidate.candidate) return;
        void sendSignal(runtime, {
          type: 'candidate',
          negotiationId: runtime.negotiationIdForViewer,
          candidate: {
            candidate: candidate.candidate,
            sdpMid: candidate.sdpMid,
            sdpMLineIndex: candidate.sdpMLineIndex,
            usernameFragment: candidate.usernameFragment,
          },
        }).catch(() => undefined);
      };
      pc.ondatachannel = (event) => attachRoomChannel(runtime, 'host', event.channel);

      await requestRoomApi(`/api/screenshare/rooms/${roomId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Screenshare-Viewer-Token': viewerToken },
        body: JSON.stringify({ peerId, displayName: cleanName, cameraOn: false, microphoneOn: false }),
      });
      setRole('viewer');
      setParticipants([
        { id: 'host', displayName: roomInfo.hostName || 'Sender', role: 'host', state: 'connecting' },
        { id: peerId, displayName: `${cleanName} (${copy.you})`, role: 'viewer', state: 'connecting' },
      ]);
      setNotice({ tone: 'info', text: copy.waitingForHost });
      startViewerRoomLoops(runtime, roomInfo.hostName || 'Sender');
      trackEvent('tool_completed', { tool: TOOL_ID.transfer, locale, mode: 'link_join_room' });
    } catch (error) {
      await closeRuntime(false);
      setNotice({ tone: 'error', text: messageForError(error) });
      trackEvent('tool_error', { tool: TOOL_ID.transfer, locale, error_type: (error as ApiError)?.code === 'room_full' ? 'validation_failed' : 'network_error' });
    } finally {
      setBusy(false);
    }
  }, [attachRoomChannel, closeRuntime, copy.deviceName, copy.roomExpired, copy.waitingForHost, copy.you, deviceName, locale, messageForError, roomId, sendSignal, setParticipantStatus, startViewerRoomLoops]);

  const sendFiles = useCallback(async () => {
    const runtime = runtimeRef.current;
    const peers = runtime?.role === 'host'
      ? Array.from(runtime.peers.values()).filter((peer) => peer.channel?.readyState === 'open')
      : [];
    if (!peers.length || !selectedFiles.length) {
      setNotice({ tone: 'info', text: peers.length ? copy.noFilesSelected : copy.sendNeedsPeer });
      return;
    }

    setSending(true);
    setNotice(null);
    trackEvent('tool_started', { tool: TOOL_ID.transfer, locale, mode: 'link_send_file' });
    try {
      const fileBytes = await Promise.all(selectedFiles.map(async (file) => ({
        file,
        bytes: new Uint8Array(await file.arrayBuffer()),
      })));
      const nextProgress: Record<string, TransferProgress> = {};
      for (const peer of peers) {
        nextProgress[peer.id] = { fileName: fileBytes[0]?.file.name ?? '', percent: 0, state: 'sending' };
      }
      setProgressByPeer(nextProgress);

      const outcomes = await Promise.allSettled(peers.map(async (peer) => {
        const channel = peer.channel;
        if (!channel || channel.readyState !== 'open') throw new Error('channel_closed');

        for (const { file, bytes } of fileBytes) {
          const chunks = buildUint8Chunks(bytes, 16 * 1024);
          channel.send(JSON.stringify({ type: 'meta', fileName: file.name, mimeType: file.type || 'application/octet-stream', size: bytes.byteLength, totalChunks: chunks.length } satisfies RoomMeta));
          for (let index = 0; index < chunks.length; index += 1) {
            await waitForDataChannelDrain(channel);
            if (channel.readyState !== 'open') throw new Error('channel_closed');
            channel.send(chunks[index]);
            setProgressByPeer((current) => ({
              ...current,
              [peer.id]: { fileName: file.name, percent: ((index + 1) / chunks.length) * 100, state: 'sending' },
            }));
          }
          channel.send(JSON.stringify({ type: 'done' }));
          setProgressByPeer((current) => ({
            ...current,
            [peer.id]: { fileName: file.name, percent: 100, state: 'sending' },
          }));
        }

        setProgressByPeer((current) => ({
          ...current,
          [peer.id]: { fileName: fileBytes[fileBytes.length - 1]?.file.name ?? '', percent: 100, state: 'sent' },
        }));
      }));

      const failedPeers = outcomes.filter((outcome) => outcome.status === 'rejected').length;
      if (failedPeers > 0) {
        setNotice({ tone: 'error', text: copy.failed });
        setProgressByPeer((current) => {
          const next = { ...current };
          outcomes.forEach((outcome, index) => {
            if (outcome.status === 'rejected') {
              const peer = peers[index];
              next[peer.id] = { fileName: fileBytes[0]?.file.name ?? '', percent: 0, state: 'failed' };
            }
          });
          return next;
        });
        trackEvent('tool_error', { tool: TOOL_ID.transfer, locale, error_type: 'processing_failed' });
      } else {
        setNotice({ tone: 'success', text: copy.sent });
        trackEvent('tool_completed', { tool: TOOL_ID.transfer, locale, mode: 'link_send_file' });
      }
    } catch {
      setNotice({ tone: 'error', text: copy.failed });
      trackEvent('tool_error', { tool: TOOL_ID.transfer, locale, error_type: 'processing_failed' });
    } finally {
      setSending(false);
    }
  }, [copy.failed, copy.noFilesSelected, copy.sendNeedsPeer, copy.sent, locale, selectedFiles]);

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

  const endRoom = useCallback(async () => {
    await closeRuntime(true);
    setRole(null);
    setRoomUrl('');
    setParticipants([]);
    setProgressByPeer({});
    setSelectedFiles([]);
    setNotice(null);
    setReadyFiles([]);
    setIncomingProgress(null);
    if (!initialRoomId) setRoomId('');
  }, [closeRuntime, initialRoomId]);

  const updateFiles = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(Array.from(event.target.files ?? []));
  };

  const participantStatusLabel = (participant: RoomParticipant): string => {
    if (participant.state === 'connected') return copy.connected;
    if (participant.state === 'disconnected') return copy.disconnected;
    return copy.connecting;
  };

  const connectedCount = participants.filter((participant) => participant.role === 'viewer' && participant.state === 'connected').length;
  const hostActive = role === 'host';
  const viewerActive = role === 'viewer';

  return (
    <Card className="space-y-5 bg-slate-50/80">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-brand-50 p-2 text-brand-700"><Link2 size={18} aria-hidden="true" /></div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{copy.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{copy.intro}</p>
        </div>
      </div>

      {notice ? (
        <div className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${notice.tone === 'error' ? 'border-rose-200 bg-rose-50 text-rose-900' : notice.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-700'}`} role="status" aria-live="polite">
          {notice.tone === 'error' ? <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> : null}
          <span>{notice.text}</span>
        </div>
      ) : null}

      {!role ? (
        <div className="space-y-3">
          <label className="block space-y-1.5 text-sm font-medium text-slate-800">
            <span>{copy.deviceName}</span>
            <Input value={deviceName} onChange={(event) => setDeviceName(event.target.value)} maxLength={32} placeholder={copy.deviceNamePlaceholder} autoComplete="nickname" />
          </label>
          <Button onClick={() => void (initialRoomId ? joinRoom() : createRoom())} disabled={busy || !deviceName.trim()}>
            {busy ? <LoaderCircle size={16} className="mr-2 animate-spin" aria-hidden="true" /> : null}
            {initialRoomId ? copy.joinRoom : copy.createRoom}
          </Button>
        </div>
      ) : null}

      {hostActive && roomUrl ? (
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="transfer-room-link" className="text-sm font-medium text-slate-800">{copy.inviteLink}</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input id="transfer-room-link" readOnly value={roomUrl} className="min-w-0" onFocus={(event) => event.currentTarget.select()} />
              <Button variant="secondary" onClick={() => void copyRoomLink()} className="shrink-0">
                {linkCopied ? <Check size={16} className="mr-2" aria-hidden="true" /> : <ClipboardCopy size={16} className="mr-2" aria-hidden="true" />}
                {linkCopied ? copy.copied : copy.copyLink}
              </Button>
            </div>
          </div>

          <section className="space-y-3" aria-labelledby="transfer-room-participants">
            <h4 id="transfer-room-participants" className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Users size={16} aria-hidden="true" />{copy.participants}</h4>
            <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white px-3">
              {participants.map((participant) => {
                const progress = progressByPeer[participant.id];
                return (
                  <li key={participant.id} className="flex min-w-0 items-start gap-3 py-3">
                    <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${participant.state === 'connected' ? 'bg-emerald-500' : participant.state === 'disconnected' ? 'bg-slate-300' : 'bg-amber-400'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <span className="break-words text-sm font-medium text-slate-900">{participant.role === 'host' ? `${participant.displayName} · ${copy.thisDevice}` : participant.displayName}</span>
                        <span className="shrink-0 text-xs text-slate-500">{progress?.state === 'sent' ? copy.sent : participantStatusLabel(participant)}</span>
                      </div>
                      {progress ? (
                        <div className="mt-2 space-y-1.5">
                          <p className="break-all text-xs text-slate-600">{progress.fileName}</p>
                          <ProgressBar value={progress.percent} />
                          <p className="text-right text-xs tabular-nums text-slate-500">{Math.round(progress.percent)}%</p>
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
            {connectedCount === 0 ? <p className="text-sm text-slate-600">{copy.waitingForPeople}</p> : null}
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900"><FileUp size={16} aria-hidden="true" />{copy.selectedFiles}</h4>
            <input ref={roomFileInputRef} className="sr-only" type="file" multiple onChange={updateFiles} />
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" onClick={() => roomFileInputRef.current?.click()} disabled={sending}>{copy.selectFiles}</Button>
              {selectedFiles.length ? <span className="text-sm text-slate-600">{selectedFiles.length} · {formatBytes(selectedFiles.reduce((total, file) => total + file.size, 0))}</span> : null}
            </div>
            {selectedFiles.length ? (
              <ul className="max-h-36 space-y-1 overflow-y-auto rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                {selectedFiles.map((file) => <li key={`${file.name}-${file.size}-${file.lastModified}`} className="flex min-w-0 justify-between gap-3"><span className="min-w-0 break-all">{file.name}</span><span className="shrink-0 text-xs text-slate-500">{formatBytes(file.size)}</span></li>)}
              </ul>
            ) : <p className="text-sm text-slate-600">{copy.noFilesSelected}</p>}
            <Button onClick={() => void sendFiles()} disabled={!selectedFiles.length || connectedCount === 0 || sending}>
              {sending ? <LoaderCircle size={16} className="mr-2 animate-spin" aria-hidden="true" /> : <FileUp size={16} className="mr-2" aria-hidden="true" />}
              {copy.sendFiles}
            </Button>
          </section>

          <Button variant="ghost" onClick={() => void endRoom()}>{copy.endRoom}</Button>
        </div>
      ) : null}

      {viewerActive ? (
        <div className="space-y-5">
          <section className="space-y-3" aria-labelledby="transfer-room-participants-viewer">
            <h4 id="transfer-room-participants-viewer" className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Users size={16} aria-hidden="true" />{copy.participants}</h4>
            <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white px-3">
              {participants.map((participant) => (
                <li key={participant.id} className="flex min-w-0 items-center gap-3 py-3">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${participant.state === 'connected' ? 'bg-emerald-500' : participant.state === 'disconnected' ? 'bg-slate-300' : 'bg-amber-400'}`} />
                  <span className="min-w-0 flex-1 break-words text-sm font-medium text-slate-900">{participant.displayName}</span>
                  <span className="shrink-0 text-xs text-slate-500">{participantStatusLabel(participant)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-4" aria-live="polite">
            <h4 className="text-sm font-semibold text-slate-900">{copy.receivedFilesTitle}</h4>
            {!incomingProgress && readyFiles.length === 0 ? <p className="text-sm text-slate-600">{copy.receiveEmpty}</p> : null}
            {incomingProgress ? (
              <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex min-w-0 items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 break-all font-medium text-slate-900">{incomingProgress.fileName}</span>
                  <span className="shrink-0 text-xs text-slate-500">{copy.receiving}</span>
                </div>
                <ProgressBar value={incomingProgress.percent} />
                <p className="text-right text-xs tabular-nums text-slate-500">{Math.round(incomingProgress.percent)}%</p>
              </div>
            ) : null}
            {readyFiles.map((file) => (
              <div key={file.id} className="flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="break-all text-sm font-medium text-slate-900">{file.fileName}</p>
                  <p className="mt-1 text-xs text-slate-600">{formatBytes(file.size)} · {copy.readyToDownload}</p>
                </div>
                <Button variant="secondary" className="shrink-0" onClick={() => {
                  downloadBlob(file.blob, file.fileName);
                  trackEvent('result_downloaded', { tool: TOOL_ID.transfer, locale, field: 'received_file' });
                }}><Download size={16} className="mr-2" aria-hidden="true" />{copy.download}</Button>
              </div>
            ))}
          </section>

          <Button variant="ghost" onClick={() => void endRoom()}>{copy.leaveRoom}</Button>
        </div>
      ) : null}

      <div className="border-t border-slate-200 pt-4">
        <h4 className="text-sm font-semibold text-slate-900">{copy.privacyTitle}</h4>
        <p className="mt-1 text-sm leading-6 text-slate-600">{copy.privacyBody}</p>
      </div>
    </Card>
  );
}
