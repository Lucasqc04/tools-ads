'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject, type PointerEvent as ReactPointerEvent } from 'react';
import { Eye, EyeOff, PenLine } from 'lucide-react';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import type { AppState, BinaryFileData, BinaryFiles, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types';
import { getShareScreenCallCopy } from '@/data/i18n/share-screen-call';
import { queueChannelTask } from '@/lib/screenshare/chat-files';
import { waitForDataChannelDrain } from '@/lib/transfer';
import type { AppLocale } from '@/lib/i18n/config';

const Excalidraw = dynamic(() => import('@excalidraw/excalidraw').then((module) => module.Excalidraw), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center bg-white text-sm text-slate-500">…</div>,
});

const CHUNK_CHARS = 5_000;
const MAX_TRANSFER_CHARS = 8 * 1024 * 1024;
const MAX_SCENE_ELEMENTS = 25_000;
const MAX_FILE_CHARS = 7 * 1024 * 1024;
const CHANNEL_BUFFER_LIMIT = 256 * 1024;
const sharedBoardId = 'shared';

type BoardPerson = { id: string; displayName: string };
type ElementAuthor = { id: string; name: string };
type BoardScene = {
  elements: ExcalidrawElement[];
  files: BinaryFiles;
  order: string[];
  orderClock: number;
  orderSender: string;
};
type BoardPayload =
  | { kind: 'snapshot'; boardId: string; elements: ExcalidrawElement[]; order: string[]; orderClock: number; orderSender: string }
  | { kind: 'patch'; boardId: string; elements: ExcalidrawElement[]; order?: string[]; orderClock?: number; orderSender?: string }
  | { kind: 'file'; boardId: string; file: BinaryFileData };
export type BoardMessageHandlerRef = MutableRefObject<((channel: RTCDataChannel, message: unknown, remotePeerId: string) => boolean) | null>;
type PendingTransfer = { total: number; parts: Map<number, string>; size: number };
type PendingPatch = { elements: Map<string, ExcalidrawElement>; files: Map<string, BinaryFileData>; order?: string[]; orderClock?: number; orderSender?: string };

type Props = {
  open: boolean;
  locale: AppLocale;
  selfId: string;
  selfName: string;
  participants: BoardPerson[];
  getChannels: () => RTCDataChannel[];
  messageHandlerRef: BoardMessageHandlerRef;
  notify: (message: string) => void;
};

const emptyScene = (): BoardScene => ({ elements: [], files: {}, order: [], orderClock: 0, orderSender: '' });
const elementAuthor = (element: ExcalidrawElement): ElementAuthor | null => {
  const value = (element as ExcalidrawElement & { customData?: Record<string, unknown> }).customData?.callAuthor;
  if (typeof value !== 'object' || value === null) return null;
  const author = value as Record<string, unknown>;
  return typeof author.id === 'string' && typeof author.name === 'string' ? { id: author.id, name: author.name } : null;
};
const sameOrder = (left: string[], right: string[]) => left.length === right.length && left.every((id, index) => id === right[index]);
const sameNames = (left: string[], right: string[]) => left.length === right.length && left.every((name, index) => name === right[index]);
const isBoardId = (value: unknown): value is string => value === sharedBoardId || (typeof value === 'string' && /^personal:[a-zA-Z0-9_-]{1,40}$/.test(value));
const isSceneElement = (value: unknown): value is ExcalidrawElement => typeof value === 'object' && value !== null && typeof (value as ExcalidrawElement).id === 'string' && typeof (value as ExcalidrawElement).version === 'number';
const isBinaryFile = (value: unknown): value is BinaryFileData => typeof value === 'object' && value !== null && typeof (value as BinaryFileData).id === 'string' && typeof (value as BinaryFileData).dataURL === 'string';
const compareElements = (candidate: ExcalidrawElement, current: ExcalidrawElement) => {
  if (candidate.version !== current.version) return candidate.version > current.version;
  if (candidate.versionNonce !== current.versionNonce) return candidate.versionNonce > current.versionNonce;
  return JSON.stringify(candidate) > JSON.stringify(current);
};
const compareOrder = (clock: number, sender: string, current: BoardScene) => clock > current.orderClock || (clock === current.orderClock && sender > current.orderSender);
const orderedElements = (elements: Map<string, ExcalidrawElement>, preferredOrder: string[]) => {
  const result: ExcalidrawElement[] = [];
  const added = new Set<string>();
  for (const id of preferredOrder) {
    const element = elements.get(id);
    if (element && !added.has(id)) { result.push(element); added.add(id); }
  }
  for (const id of Array.from(elements.keys()).filter((elementId) => !added.has(elementId)).sort()) {
    const element = elements.get(id);
    if (element) result.push(element);
  }
  return result;
};

export function Whiteboard({ open, locale, selfId, selfName, participants, getChannels, messageHandlerRef, notify }: Props) {
  const copy = getShareScreenCallCopy(locale);
  const [selectedBoardId, setSelectedBoardId] = useState(sharedBoardId);
  const [hiddenBoards, setHiddenBoards] = useState<Record<string, boolean>>({});
  const [inspectedElementId, setInspectedElementId] = useState<string | null>(null);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [syncWarning, setSyncWarning] = useState(false);
  const scenesRef = useRef<Map<string, BoardScene> | null>(null);
  if (!scenesRef.current) scenesRef.current = new Map([[sharedBoardId, emptyScene()]]);
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const apiBoardIdRef = useRef<string | null>(null);
  const selectedBoardIdRef = useRef(selectedBoardId);
  const identityRef = useRef({ selfId, selfName });
  const notifyRef = useRef(notify);
  const openRef = useRef(open);
  const transferBuffersRef = useRef(new WeakMap<RTCDataChannel, Map<string, PendingTransfer>>());
  const syncRequestTimesRef = useRef(new WeakMap<RTCDataChannel, number>());
  const channelListenersRef = useRef(new Map<RTCDataChannel, () => void>());
  const pendingPatchesRef = useRef(new Map<string, PendingPatch>());
  const patchTimersRef = useRef(new Map<string, number>());
  const warnedBoardsRef = useRef(new Set<string>());
  const unsharedFileIdsRef = useRef(new Set<string>());
  const warnedFilesRef = useRef(new Set<string>());
  const pointerFrameRef = useRef<number | null>(null);
  const lastPointerInspectRef = useRef(0);
  selectedBoardIdRef.current = selectedBoardId;
  identityRef.current = { selfId, selfName };
  notifyRef.current = notify;
  openRef.current = open;

  const people = useMemo(() => {
    const current = participants.find((person) => person.id === selfId);
    return current ? participants : [{ id: selfId, displayName: selfName }, ...participants];
  }, [participants, selfId, selfName]);
  const boardOptions = useMemo(() => [
    { id: sharedBoardId, ownerId: '', name: copy.whiteboardGeneral },
    ...people.map((person) => ({ id: `personal:${person.id}`, ownerId: person.id, name: person.id === selfId ? copy.you : person.displayName })),
  ], [copy.whiteboardGeneral, copy.you, people, selfId]);
  const activeBoard = boardOptions.find((board) => board.id === selectedBoardId) ?? boardOptions[0];
  const canEdit = activeBoard.id === sharedBoardId || activeBoard.ownerId === selfId;

  const setAuthorNames = useCallback((names: string[]) => {
    const next = Array.from(new Set(names)).slice(0, 3);
    setSelectedAuthors((current) => sameNames(current, next) ? current : next);
  }, []);

  const getScene = useCallback((boardId: string) => {
    const store = scenesRef.current!;
    const scene = store.get(boardId);
    if (scene) return scene;
    const created = emptyScene();
    store.set(boardId, created);
    return created;
  }, []);

  const currentScene = getScene(selectedBoardId);
  const initialData = useMemo(() => ({ elements: currentScene.elements, files: currentScene.files }), [currentScene.elements, currentScene.files]);

  const handleExcalidrawAPI = useCallback((api: ExcalidrawImperativeAPI) => {
    const boardId = selectedBoardIdRef.current;
    const latest = getScene(boardId);
    apiRef.current = api;
    apiBoardIdRef.current = boardId;
    if (Object.keys(latest.files).length) api.addFiles(Object.values(latest.files));
    if (latest.elements.length) api.updateScene({ elements: latest.elements, captureUpdate: 'NEVER' });
  }, [getScene]);

  const sendTransfer = useCallback(async (channel: RTCDataChannel, payload: BoardPayload) => {
    const serialized = JSON.stringify(payload);
    if (serialized.length > MAX_TRANSFER_CHARS) {
      if (!warnedBoardsRef.current.has(payload.boardId)) {
        warnedBoardsRef.current.add(payload.boardId);
        setSyncWarning(true);
        notifyRef.current(copy.whiteboardSyncTooLarge);
      }
      return;
    }
    warnedBoardsRef.current.delete(payload.boardId);
    const senderId = identityRef.current.selfId;
    const transferId = crypto.randomUUID();
    const total = Math.ceil(serialized.length / CHUNK_CHARS);
    await queueChannelTask(channel, async () => {
      for (let index = 0; index < total; index += 1) {
        await waitForDataChannelDrain(channel, CHANNEL_BUFFER_LIMIT);
        if (channel.readyState !== 'open') throw new Error('board_channel_closed');
        channel.send(JSON.stringify({
          type: 'board-chunk', senderId, transferId, index, total,
          data: serialized.slice(index * CHUNK_CHARS, (index + 1) * CHUNK_CHARS),
        }));
      }
    });
  }, [copy.whiteboardSyncTooLarge]);

  const sendPayload = useCallback((channel: RTCDataChannel, payload: BoardPayload) => {
    void sendTransfer(channel, payload).catch(() => undefined);
  }, [sendTransfer]);

  const sendSnapshot = useCallback((channel: RTCDataChannel, boardId: string, scene: BoardScene) => {
    const unsentImageIds = new Set<string>(Object.values(scene.files).filter((file) => file.dataURL.length > MAX_FILE_CHARS || unsharedFileIdsRef.current.has(file.id)).map((file) => file.id));
    const snapshot = {
      kind: 'snapshot' as const, boardId, elements: scene.elements.filter((element) => element.type !== 'image' || !unsentImageIds.has((element as ExcalidrawElement & { fileId?: string }).fileId ?? '')), order: scene.order,
      orderClock: scene.orderClock, orderSender: scene.orderSender,
    };
    for (const file of Object.values(scene.files)) {
      if (!unsentImageIds.has(file.id)) sendPayload(channel, { kind: 'file', boardId, file });
    }
    sendPayload(channel, snapshot);
  }, [sendPayload]);

  const answerSyncRequest = useCallback((channel: RTCDataChannel) => {
    const store = scenesRef.current!;
    for (const [boardId, scene] of store) {
      if (scene.elements.length || Object.keys(scene.files).length) sendSnapshot(channel, boardId, scene);
    }
  }, [sendSnapshot]);

  const sendSyncRequest = useCallback((channel: RTCDataChannel) => {
    const now = Date.now();
    if (now - (syncRequestTimesRef.current.get(channel) ?? 0) < 800) return;
    syncRequestTimesRef.current.set(channel, now);
    const senderId = identityRef.current.selfId;
    void queueChannelTask(channel, async () => {
      if (channel.readyState === 'open') channel.send(JSON.stringify({ type: 'board-sync-request', senderId }));
    }).catch(() => undefined);
  }, []);

  const mergePayload = useCallback((payload: BoardPayload, senderId: string) => {
    if (!isBoardId(payload.boardId)) return;
    if (payload.kind === 'patch' && payload.boardId.startsWith('personal:') && payload.boardId !== `personal:${senderId}`) return;
    const current = getScene(payload.boardId);
    const elements = new Map(current.elements.map((element) => [element.id, element]));
    let changed = false;
    let order = current.order;
    let orderClock = current.orderClock;
    let orderSender = current.orderSender;
    if (payload.kind !== 'file') {
      if (!Array.isArray(payload.elements) || payload.elements.length > MAX_SCENE_ELEMENTS || payload.elements.some((element) => !isSceneElement(element))) return;
      for (const candidate of payload.elements) {
        const existing = elements.get(candidate.id);
        if (!existing || compareElements(candidate, existing)) { elements.set(candidate.id, candidate); changed = true; }
      }
      if (Array.isArray(payload.order) && typeof payload.orderClock === 'number' && typeof payload.orderSender === 'string' && compareOrder(payload.orderClock, payload.orderSender, current)) {
        order = payload.order.filter((id) => typeof id === 'string').slice(0, MAX_SCENE_ELEMENTS);
        orderClock = payload.orderClock;
        orderSender = payload.orderSender;
        changed = changed || !sameOrder(order, current.order) || orderClock !== current.orderClock || orderSender !== current.orderSender;
      }
    }
    const files = { ...current.files };
    const changedFiles: BinaryFileData[] = [];
    if (payload.kind === 'file') {
      if (!isBinaryFile(payload.file) || payload.file.dataURL.length > MAX_FILE_CHARS) return;
      const existing = files[payload.file.id];
      if (!existing || existing.dataURL !== payload.file.dataURL || existing.version !== payload.file.version) {
        files[payload.file.id] = payload.file;
        changedFiles.push(payload.file);
        changed = true;
      }
    }
    if (!changed) return;
    const next: BoardScene = { elements: orderedElements(elements, order), files, order, orderClock, orderSender };
    scenesRef.current!.set(payload.boardId, next);
    if (openRef.current && apiRef.current && apiBoardIdRef.current === payload.boardId) {
      if (changedFiles.length) apiRef.current.addFiles(changedFiles);
      if (payload.kind !== 'file') apiRef.current.updateScene({ elements: next.elements, captureUpdate: 'NEVER' });
    }
  }, [getScene]);

  const handleIncomingMessage = useCallback((channel: RTCDataChannel, value: unknown, remotePeerId: string) => {
    if (typeof value !== 'object' || value === null) return false;
    const message = value as Record<string, unknown>;
    if (message.type === 'board-sync-request') {
      if (message.senderId !== remotePeerId) return true;
      answerSyncRequest(channel);
      return true;
    }
    if (message.type !== 'board-chunk') return false;
    if (message.senderId !== remotePeerId || typeof message.transferId !== 'string' || message.transferId.length > 64 ||
      typeof message.index !== 'number' || typeof message.total !== 'number' || !Number.isInteger(message.index) || !Number.isInteger(message.total) ||
      message.total < 1 || message.total > Math.ceil(MAX_TRANSFER_CHARS / CHUNK_CHARS) || message.index < 0 || message.index >= message.total ||
      typeof message.data !== 'string' || message.data.length > CHUNK_CHARS) return true;
    let buffers = transferBuffersRef.current.get(channel);
    if (!buffers) { buffers = new Map(); transferBuffersRef.current.set(channel, buffers); }
    let transfer = buffers.get(message.transferId);
    if (!transfer) {
      if (buffers.size >= 4) buffers.delete(buffers.keys().next().value!);
      transfer = { total: message.total, parts: new Map(), size: 0 };
      buffers.set(message.transferId, transfer);
    }
    if (transfer.total !== message.total || transfer.parts.has(message.index)) return true;
    transfer.parts.set(message.index, message.data);
    transfer.size += message.data.length;
    if (transfer.size > MAX_TRANSFER_CHARS) { buffers.delete(message.transferId); return true; }
    if (transfer.parts.size !== transfer.total) return true;
    buffers.delete(message.transferId);
    try {
      const payload = JSON.parse(Array.from({ length: transfer.total }, (_, index) => transfer!.parts.get(index) ?? '').join('')) as BoardPayload;
      if (payload && typeof payload === 'object' && ['snapshot', 'patch', 'file'].includes(payload.kind)) mergePayload(payload, remotePeerId);
    } catch { /* discard an incomplete or invalid scene */ }
    return true;
  }, [answerSyncRequest, mergePayload]);

  useEffect(() => {
    messageHandlerRef.current = handleIncomingMessage;
    return () => { if (messageHandlerRef.current === handleIncomingMessage) messageHandlerRef.current = null; };
  }, [handleIncomingMessage, messageHandlerRef]);

  useEffect(() => {
    const addChannel = (channel: RTCDataChannel) => {
      if (channel.readyState === 'closed' || channelListenersRef.current.has(channel)) return;
      const request = () => sendSyncRequest(channel);
      channel.addEventListener('open', request);
      channelListenersRef.current.set(channel, () => channel.removeEventListener('open', request));
      if (channel.readyState === 'open') request();
    };
    getChannels().forEach(addChannel);
    const timer = window.setInterval(() => getChannels().forEach(addChannel), 1_500);
    return () => window.clearInterval(timer);
  }, [getChannels, open, sendSyncRequest]);

  useEffect(() => {
    if (!open) return;
    getChannels().filter((channel) => channel.readyState === 'open').forEach(sendSyncRequest);
  }, [getChannels, open, sendSyncRequest]);

  useEffect(() => {
    if (!open) { apiRef.current = null; apiBoardIdRef.current = null; }
  }, [open]);

  useEffect(() => () => {
    for (const timer of patchTimersRef.current.values()) window.clearTimeout(timer);
    for (const remove of channelListenersRef.current.values()) remove();
    if (pointerFrameRef.current !== null) window.cancelAnimationFrame(pointerFrameRef.current);
  }, []);

  const flushPatch = useCallback((boardId: string) => {
    patchTimersRef.current.delete(boardId);
    const pending = pendingPatchesRef.current.get(boardId);
    if (!pending) return;
    pendingPatchesRef.current.delete(boardId);
    const channels = getChannels().filter((channel) => channel.readyState === 'open');
    for (const channel of channels) {
      for (const file of pending.files.values()) sendPayload(channel, { kind: 'file', boardId, file });
      if (pending.elements.size || pending.order) {
        sendPayload(channel, {
          kind: 'patch', boardId, elements: Array.from(pending.elements.values()),
          ...(pending.order ? { order: pending.order, orderClock: pending.orderClock, orderSender: pending.orderSender } : {}),
        });
      }
    }
  }, [getChannels, sendPayload]);

  const handleChange = useCallback((elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
    const boardId = selectedBoardIdRef.current;
    if (!canEdit) return;
    const scene = getScene(boardId);
    const previous = new Map(scene.elements.map((element) => [element.id, element]));
    const nextElements = elements.map((element) => {
      const old = previous.get(element.id);
      if (!old) {
        return { ...element, customData: { ...(element.customData ?? {}), callAuthor: { id: identityRef.current.selfId, name: identityRef.current.selfName } } };
      }
      const author = elementAuthor(old) ?? elementAuthor(element);
      if (!author || elementAuthor(element)?.id === author.id && elementAuthor(element)?.name === author.name) return element;
      return { ...element, customData: { ...(element.customData ?? {}), callAuthor: author } };
    });
    const changedElements = nextElements.filter((element) => {
      const old = previous.get(element.id);
      return !old || JSON.stringify(element) !== JSON.stringify(old);
    });
    const authorshipChanged = changedElements.some((element) => JSON.stringify(element) !== JSON.stringify(elements.find((original) => original.id === element.id)));
    const mergedFiles = { ...scene.files, ...files };
    const changedFiles = Object.values(files).filter((file) => {
      const old = scene.files[file.id];
      return !old || old.dataURL !== file.dataURL || old.version !== file.version;
    });
    for (const file of changedFiles) {
      if (file.dataURL.length > MAX_FILE_CHARS) {
        unsharedFileIdsRef.current.add(file.id);
        if (!warnedFilesRef.current.has(file.id)) {
          warnedFilesRef.current.add(file.id);
          setSyncWarning(true);
          notifyRef.current(copy.whiteboardSyncTooLarge);
        }
      }
    }
    const shareableElements = changedElements.filter((element) => element.type !== 'image' || !unsharedFileIdsRef.current.has((element as ExcalidrawElement & { fileId?: string }).fileId ?? ''));
    const shareableFiles = changedFiles.filter((file) => !unsharedFileIdsRef.current.has(file.id));
    const order = nextElements.map((element) => element.id);
    const orderChanged = !sameOrder(order, scene.order);
    if (!changedElements.length && !changedFiles.length && !orderChanged) {
      const selected = Object.entries(appState.selectedElementIds).filter(([, isSelected]) => isSelected).map(([id]) => id);
      const authors = selected.map((id) => {
        const element = previous.get(id) ?? nextElements.find((item) => item.id === id);
        return element ? elementAuthor(element)?.name : undefined;
      }).filter((name): name is string => Boolean(name));
      setAuthorNames(authors);
      return;
    }
    const orderClock = orderChanged ? scene.orderClock + 1 : scene.orderClock;
    const orderSender = orderChanged ? identityRef.current.selfId : scene.orderSender;
    const nextScene: BoardScene = {
      elements: nextElements as ExcalidrawElement[], files: mergedFiles, order,
      orderClock, orderSender,
    };
    scenesRef.current!.set(boardId, nextScene);
    if (!unsharedFileIdsRef.current.size) {
      setSyncWarning(false);
      warnedBoardsRef.current.delete(boardId);
    }
    const api = apiRef.current;
    if (api && apiBoardIdRef.current === boardId && authorshipChanged) {
      api.updateScene({ elements: nextScene.elements, captureUpdate: 'NEVER' });
    }
    const pending = pendingPatchesRef.current.get(boardId) ?? { elements: new Map<string, ExcalidrawElement>(), files: new Map<string, BinaryFileData>() };
    shareableElements.forEach((element) => pending.elements.set(element.id, element));
    shareableFiles.forEach((file) => pending.files.set(file.id, file));
    if (orderChanged) { pending.order = order; pending.orderClock = orderClock; pending.orderSender = orderSender; }
    pendingPatchesRef.current.set(boardId, pending);
    const oldTimer = patchTimersRef.current.get(boardId);
    if (oldTimer) window.clearTimeout(oldTimer);
    patchTimersRef.current.set(boardId, window.setTimeout(() => flushPatch(boardId), 100));
    const selected = Object.entries(appState.selectedElementIds).filter(([, isSelected]) => isSelected).map(([id]) => id);
    const names = selected.map((id) => {
      const element = previous.get(id) ?? nextElements.find((item) => item.id === id);
      return element ? elementAuthor(element)?.name : undefined;
    }).filter((name): name is string => Boolean(name));
    setAuthorNames(names);
  }, [canEdit, copy.whiteboardSyncTooLarge, flushPatch, getScene, setAuthorNames]);

  const updateSelectedAuthors = useCallback((elements: readonly ExcalidrawElement[], ids: Record<string, boolean>) => {
    const selected = elements.filter((element) => ids[element.id]);
    setAuthorNames(selected.map((element) => elementAuthor(element)?.name).filter((name): name is string => Boolean(name)));
  }, [setAuthorNames]);

  const inspectAt = useCallback((clientX: number, clientY: number, target: EventTarget | null) => {
    if (!(target instanceof Element) || !target.closest('.excalidraw')) return;
    const now = performance.now();
    if (now - lastPointerInspectRef.current < 45) return;
    lastPointerInspectRef.current = now;
    const api = apiRef.current;
    if (!api || apiBoardIdRef.current !== selectedBoardIdRef.current) return;
    const { zoom, scrollX, scrollY, offsetLeft, offsetTop } = api.getAppState();
    const scale = zoom.value || 1;
    const x = (clientX - offsetLeft) / scale - scrollX;
    const y = (clientY - offsetTop) / scale - scrollY;
    const tolerance = 8 / scale;
    const element = [...api.getSceneElements()].reverse().find((item) => !item.isDeleted && x >= item.x - tolerance && x <= item.x + item.width + tolerance && y >= item.y - tolerance && y <= item.y + item.height + tolerance);
    setInspectedElementId((current) => current === (element?.id ?? null) ? current : element?.id ?? null);
  }, []);

  const inspectAtFrame = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const { clientX, clientY, target } = event;
    if (!(target instanceof Element) || !target.closest('.excalidraw')) return;
    if (pointerFrameRef.current !== null) window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      pointerFrameRef.current = null;
      inspectAt(clientX, clientY, target);
    });
  }, [inspectAt]);
  const inspectContextMenu = useCallback((event: ReactPointerEvent<HTMLDivElement>) => inspectAt(event.clientX, event.clientY, event.target), [inspectAt]);

  const inspectedElement = currentScene.elements.find((element) => element.id === inspectedElementId);
  const inspectedAuthor = inspectedElement ? elementAuthor(inspectedElement)?.name : null;
  const authorNames = selectedAuthors.length ? selectedAuthors : inspectedAuthor ? [inspectedAuthor] : [];

  const selectBoard = (boardId: string) => {
    if (hiddenBoards[boardId]) return;
    selectedBoardIdRef.current = boardId;
    setSelectedBoardId(boardId);
    setInspectedElementId(null);
    setSelectedAuthors([]);
  };
  const toggleVisibility = (boardId: string) => {
    const willHide = !hiddenBoards[boardId];
    setHiddenBoards((current) => ({ ...current, [boardId]: willHide }));
    if (willHide && selectedBoardIdRef.current === boardId) {
      const nextBoard = boardOptions.find((board) => board.id !== boardId && !hiddenBoards[board.id]);
      if (nextBoard) selectBoard(nextBoard.id);
    }
  };

  if (!open) return <div className="hidden" aria-hidden="true" />;

  return <div className="absolute inset-0 z-20 flex min-h-0 min-w-0 flex-col overflow-hidden bg-ink-950 text-white" onPointerMoveCapture={inspectAtFrame} onPointerLeave={() => { setInspectedElementId(null); if (pointerFrameRef.current !== null) window.cancelAnimationFrame(pointerFrameRef.current); pointerFrameRef.current = null; }} onContextMenuCapture={inspectContextMenu}>
    <header className="flex min-h-11 shrink-0 items-center gap-2 border-b border-ink-800 bg-ink-950 px-2.5 sm:px-3">
      <PenLine size={16} className="shrink-0 text-accent-400" aria-hidden="true" />
      <span className="shrink-0 text-sm font-semibold">{copy.whiteboard}</span>
      <span className="min-w-0 flex-1 truncate text-xs text-ink-300">{activeBoard.name}</span>
      <span className="hidden shrink-0 text-[11px] text-ink-400 sm:inline">{activeBoard.id === sharedBoardId ? copy.whiteboardEditAll : canEdit ? copy.whiteboardEditOnlyYou : copy.whiteboardEditOnlyOwner.replace('{name}', activeBoard.name)}</span>
    </header>
    <nav aria-label={copy.whiteboard} className="flex min-h-12 shrink-0 items-center gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {boardOptions.map((board) => {
        const hidden = Boolean(hiddenBoards[board.id]);
        const selected = selectedBoardId === board.id;
        return <div key={board.id} className={`flex h-9 shrink-0 items-center overflow-hidden rounded-lg border ${selected ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white'} ${hidden ? 'opacity-60' : ''}`}>
          <button type="button" disabled={hidden} onClick={() => selectBoard(board.id)} className={`max-w-36 px-3 text-xs font-semibold transition ${selected ? 'text-brand-800' : 'text-slate-700'} disabled:cursor-not-allowed`}>
            <span className="block truncate">{board.name}</span>
          </button>
          <button type="button" onClick={() => toggleVisibility(board.id)} aria-label={`${hidden ? copy.whiteboardShow : copy.whiteboardHide}: ${board.name}`} title={`${hidden ? copy.whiteboardShow : copy.whiteboardHide}: ${board.name}`} className="inline-flex h-9 w-9 shrink-0 items-center justify-center border-l border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
            {hidden ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
          </button>
        </div>;
      })}
    </nav>
    <div className="relative min-h-0 min-w-0 flex-1 bg-white">
      <Excalidraw
        key={selectedBoardId}
        theme="light"
        langCode={locale === 'pt-br' ? 'pt-BR' : locale === 'es' ? 'es-ES' : locale === 'zh' ? 'zh-CN' : 'en-US'}
        viewModeEnabled={!canEdit}
        initialData={initialData}
        excalidrawAPI={handleExcalidrawAPI}
        onChange={(elements, appState, files) => { handleChange(elements, appState, files); updateSelectedAuthors(elements, appState.selectedElementIds); }}
      />
    </div>
    <footer className="flex min-h-8 shrink-0 items-center border-t border-ink-800 bg-ink-950 px-3 py-1.5">
      {authorNames.length ? <span className="max-w-full truncate rounded-full bg-ink-800 px-2.5 py-1 text-[10px] font-medium text-ink-100">{copy.whiteboardCreatedBy.replace('{name}', authorNames.join(', '))}</span>
        : <span className="truncate text-[10px] text-ink-400">{syncWarning ? copy.whiteboardSyncTooLarge : copy.whiteboardSyncing}</span>}
    </footer>
  </div>;
}
