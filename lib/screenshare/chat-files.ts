import { waitForDataChannelDrain } from '@/lib/transfer';

export const CHAT_FILE_CHUNK_SIZE = 64 * 1024;
export const CHAT_FILE_MAX_BYTES = 200 * 1024 * 1024;
/** Above this size the sender is asked to confirm and the receiver is offered saving straight to disk. */
export const CHAT_FILE_LARGE_BYTES = 100 * 1024 * 1024;
const CHAT_FILE_BUFFER_LIMIT = 256 * 1024;

/** Only raster formats are previewed inline; SVG and everything else is offered as a download. */
const INLINE_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif']);
const GENERIC_MIME = 'application/octet-stream';

export type ChatAttachment = {
  name: string;
  mime: string;
  size: number;
  kind: 'image' | 'file';
  status: 'sending' | 'receiving' | 'ready' | 'failed';
  /** 0-100 while the transfer is running. */
  progress: number;
  blob?: Blob;
  /** Object URL used for the inline preview. */
  url?: string;
  /** Written straight to a file on disk, so there is no blob to download again. */
  onDisk?: boolean;
};

/** A short copy of the message being answered, kept with the reply so it still reads if the original is gone. */
export type ChatReplyRef = {
  id: string;
  displayName: string;
  text: string;
};

export type CallChatMessage = {
  id: string;
  peerId: string;
  displayName: string;
  text: string;
  createdAt: number;
  attachment?: ChatAttachment;
  replyTo?: ChatReplyRef;
};

/** Validates the reply reference of an incoming message. Anything malformed is dropped, not the message. */
export const parseReplyRef = (value: unknown): ChatReplyRef | undefined => {
  if (typeof value !== 'object' || value === null) return undefined;
  const reply = value as Record<string, unknown>;
  if (typeof reply.id !== 'string' || reply.id.length > 64) return undefined;
  if (typeof reply.displayName !== 'string' || reply.displayName.length > 32) return undefined;
  if (typeof reply.text !== 'string') return undefined;
  return { id: reply.id, displayName: reply.displayName, text: reply.text.slice(0, 140) };
};

export type ChatFileMeta = {
  id: string;
  peerId: string;
  displayName: string;
  createdAt: number;
  name: string;
  mime: string;
  size: number;
  chunks: number;
};

export const isInlineImageType = (mime: string) => INLINE_IMAGE_TYPES.has(mime.toLowerCase());

/** Drops path parts and control characters so a name is safe to show and to use as a download name. */
export const sanitizeFileName = (name: string, fallback = 'arquivo'): string => {
  // eslint-disable-next-line no-control-regex
  const cleaned = name.replace(/[\u0000-\u001f\u007f<>:"|?*]/g, '').split(/[\\/]/).pop()?.trim().replace(/^\.+/, '') ?? '';
  return (cleaned || fallback).slice(0, 120);
};

export const normalizeMime = (mime: string): string => {
  const value = mime.trim().toLowerCase();
  return /^[a-z0-9][a-z0-9!#$&^_.+-]{0,63}\/[a-z0-9][a-z0-9!#$&^_.+-]{0,63}$/.test(value) ? value : GENERIC_MIME;
};

/** Short type label shown on file cards: the extension when there is one, otherwise the MIME subtype. */
export const fileTypeLabel = (name: string, mime: string): string => {
  const extension = name.includes('.') ? name.split('.').pop() ?? '' : '';
  if (/^[a-z0-9]{1,5}$/i.test(extension)) return extension.toUpperCase();
  const subtype = mime.split('/')[1]?.split(/[+;]/)[0] ?? '';
  return subtype && mime !== GENERIC_MIME ? subtype.slice(0, 6).toUpperCase() : 'FILE';
};

export const buildFileMeta = (
  file: Pick<File, 'name' | 'size' | 'type'>,
  sender: { id: string; peerId: string; displayName: string; createdAt: number },
  fallbackName?: string,
): ChatFileMeta => ({
  ...sender,
  name: sanitizeFileName(file.name, fallbackName),
  mime: normalizeMime(file.type),
  size: file.size,
  chunks: Math.ceil(file.size / CHAT_FILE_CHUNK_SIZE),
});

/** Validates the metadata announced by a remote peer before any memory is reserved for it. */
export const parseFileMeta = (value: unknown): ChatFileMeta | null => {
  if (typeof value !== 'object' || value === null) return null;
  const meta = value as Record<string, unknown>;
  if (meta.type !== 'file-meta') return null;
  if (typeof meta.id !== 'string' || !meta.id || meta.id.length > 64) return null;
  if (typeof meta.peerId !== 'string' || meta.peerId.length > 32) return null;
  if (typeof meta.displayName !== 'string' || meta.displayName.length > 32) return null;
  if (typeof meta.createdAt !== 'number' || !Number.isFinite(meta.createdAt)) return null;
  if (typeof meta.name !== 'string' || !meta.name || meta.name.length > 255) return null;
  if (typeof meta.mime !== 'string' || meta.mime.length > 127) return null;
  if (typeof meta.size !== 'number' || !Number.isSafeInteger(meta.size) || meta.size <= 0 || meta.size > CHAT_FILE_MAX_BYTES) return null;
  if (meta.chunks !== Math.ceil(meta.size / CHAT_FILE_CHUNK_SIZE)) return null;
  return {
    id: meta.id,
    peerId: meta.peerId,
    displayName: meta.displayName,
    createdAt: meta.createdAt,
    name: sanitizeFileName(meta.name),
    mime: normalizeMime(meta.mime),
    size: meta.size,
    chunks: meta.chunks,
  };
};

export type ChatFileReceiverEvent =
  | { type: 'start'; meta: ChatFileMeta; channel: object }
  | { type: 'progress'; id: string; percent: number; chunk: ArrayBuffer }
  | { type: 'done'; meta: ChatFileMeta; blob: Blob | null }
  | { type: 'failed'; id: string };

type IncomingFile = { meta: ChatFileMeta; chunks: ArrayBuffer[]; received: number; streamed: boolean };

/**
 * Reassembles files arriving on chat data channels. A channel is ordered and
 * its sender sends one file at a time, so a binary chunk always belongs to the
 * file announced last on that same channel. A file can switch to streaming
 * (see beginStreaming): from then on its chunks go to the caller, not to memory.
 */
export class ChatFileReceiver {
  private incoming = new WeakMap<object, IncomingFile>();

  handleText(channel: object, parsed: unknown): ChatFileReceiverEvent | null {
    if (typeof parsed !== 'object' || parsed === null) return null;
    const type = (parsed as { type?: unknown }).type;
    if (type === 'file-meta') {
      const meta = parseFileMeta(parsed);
      if (!meta) return null;
      this.incoming.set(channel, { meta, chunks: [], received: 0, streamed: false });
      return { type: 'start', meta, channel };
    }
    if (type === 'file-done') {
      const state = this.incoming.get(channel);
      if (!state || (parsed as { id?: unknown }).id !== state.meta.id) return null;
      this.incoming.delete(channel);
      if (state.received !== state.meta.size || (!state.streamed && state.chunks.length !== state.meta.chunks)) return { type: 'failed', id: state.meta.id };
      if (state.streamed) return { type: 'done', meta: state.meta, blob: null };
      const mime = isInlineImageType(state.meta.mime) ? state.meta.mime : GENERIC_MIME;
      return { type: 'done', meta: state.meta, blob: new Blob(state.chunks, { type: mime }) };
    }
    return null;
  }

  handleBinary(channel: object, chunk: ArrayBuffer): ChatFileReceiverEvent | null {
    const state = this.incoming.get(channel);
    if (!state) return null;
    if (state.received + chunk.byteLength > state.meta.size || chunk.byteLength > CHAT_FILE_CHUNK_SIZE) {
      this.incoming.delete(channel);
      return { type: 'failed', id: state.meta.id };
    }
    if (!state.streamed) state.chunks.push(chunk);
    state.received += chunk.byteLength;
    return { type: 'progress', id: state.meta.id, percent: Math.min(100, (state.received / state.meta.size) * 100), chunk };
  }

  /**
   * Switches the file on this channel to streaming and returns the chunks that
   * arrived so far, so the caller can write them first. Later chunks are not kept.
   */
  beginStreaming(channel: object): ArrayBuffer[] | null {
    const state = this.incoming.get(channel);
    if (!state || state.streamed) return null;
    state.streamed = true;
    const chunks = state.chunks;
    state.chunks = [];
    return chunks;
  }

  /** The channel closed: whatever was still arriving will never finish. */
  abort(channel: object): ChatFileReceiverEvent | null {
    const state = this.incoming.get(channel);
    if (!state) return null;
    this.incoming.delete(channel);
    return { type: 'failed', id: state.meta.id };
  }
}

export type DiskWriter = {
  write: (chunk: ArrayBuffer) => Promise<void>;
  close: () => Promise<void>;
  abort: () => Promise<void>;
};

type SavePickerWindow = Window & {
  showSaveFilePicker?: (options?: { suggestedName?: string }) => Promise<{
    createWritable: () => Promise<{ write: (data: ArrayBuffer) => Promise<void>; close: () => Promise<void>; abort: () => Promise<void> }>;
  }>;
};

/** Saving straight to disk needs the File System Access API, which is available in desktop Chromium only. */
export const supportsDiskSave = (): boolean =>
  typeof window !== 'undefined' && typeof (window as SavePickerWindow).showSaveFilePicker === 'function';

/** Asks the user where to save; resolves to null when the picker is cancelled or unavailable. Must run from a click. */
export const openDiskWriter = async (suggestedName: string): Promise<DiskWriter | null> => {
  const picker = (window as SavePickerWindow).showSaveFilePicker;
  if (!picker) return null;
  try {
    const handle = await picker({ suggestedName });
    const stream = await handle.createWritable();
    return { write: (chunk) => stream.write(chunk), close: () => stream.close(), abort: () => stream.abort() };
  } catch {
    return null;
  }
};

const channelQueues = new WeakMap<object, Promise<unknown>>();

/** Runs tasks one after another per channel so two files never interleave their chunks. */
export const queueChannelTask = <T>(channel: object, task: () => Promise<T>): Promise<T> => {
  const previous = channelQueues.get(channel) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(task);
  channelQueues.set(channel, next);
  return next;
};

export const sendFileOverChannel = async (
  channel: RTCDataChannel,
  file: Blob,
  meta: ChatFileMeta,
  onProgress?: (sentBytes: number) => void,
): Promise<void> => {
  const ensureOpen = () => { if (channel.readyState !== 'open') throw new Error('channel_closed'); };
  ensureOpen();
  channel.send(JSON.stringify({ type: 'file-meta', ...meta }));
  for (let index = 0; index < meta.chunks; index += 1) {
    await waitForDataChannelDrain(channel, CHAT_FILE_BUFFER_LIMIT);
    ensureOpen();
    const start = index * CHAT_FILE_CHUNK_SIZE;
    channel.send(await file.slice(start, start + CHAT_FILE_CHUNK_SIZE).arrayBuffer());
    onProgress?.(Math.min(meta.size, start + CHAT_FILE_CHUNK_SIZE));
  }
  await waitForDataChannelDrain(channel, CHAT_FILE_BUFFER_LIMIT);
  ensureOpen();
  channel.send(JSON.stringify({ type: 'file-done', id: meta.id }));
};
