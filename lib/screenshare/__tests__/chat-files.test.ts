import { describe, expect, it } from 'vitest';
import {
  CHAT_FILE_CHUNK_SIZE, CHAT_FILE_MAX_BYTES, ChatFileReceiver, buildFileMeta, fileTypeLabel,
  isInlineImageType, normalizeMime, parseFileMeta, queueChannelTask, sanitizeFileName,
} from '../chat-files';

const sender = { id: 'f1', peerId: 'host', displayName: 'Ana', createdAt: 1 };
const metaMessage = (size: number, overrides: Record<string, unknown> = {}) => ({ type: 'file-meta', ...buildFileMeta({ name: 'a.pdf', size, type: 'application/pdf' }, sender), ...overrides });

describe('file names and types', () => {
  it('removes paths, control characters and leading dots', () => {
    expect(sanitizeFileName('..\\..\\etc/passwd')).toBe('passwd');
    expect(sanitizeFileName('a\u0000b<c>.png')).toBe('abc.png');
    expect(sanitizeFileName('   ')).toBe('arquivo');
    expect(sanitizeFileName('x'.repeat(300)).length).toBe(120);
  });

  it('only previews raster images', () => {
    expect(isInlineImageType('image/png')).toBe(true);
    expect(isInlineImageType('IMAGE/JPEG')).toBe(true);
    expect(isInlineImageType('image/svg+xml')).toBe(false);
    expect(isInlineImageType('text/html')).toBe(false);
  });

  it('normalizes unusable MIME types', () => {
    expect(normalizeMime('application/pdf')).toBe('application/pdf');
    expect(normalizeMime('')).toBe('application/octet-stream');
    expect(normalizeMime('not a mime')).toBe('application/octet-stream');
  });

  it('labels files by extension, then MIME subtype', () => {
    expect(fileTypeLabel('Relatório.final.pdf', 'application/pdf')).toBe('PDF');
    expect(fileTypeLabel('README', 'text/plain')).toBe('PLAIN');
    expect(fileTypeLabel('dados', 'application/octet-stream')).toBe('FILE');
  });
});

describe('parseFileMeta', () => {
  it('accepts well-formed metadata', () => {
    const meta = parseFileMeta(metaMessage(CHAT_FILE_CHUNK_SIZE * 2 + 5));
    expect(meta).toMatchObject({ name: 'a.pdf', chunks: 3, mime: 'application/pdf' });
  });

  it('rejects oversized, empty and inconsistent announcements', () => {
    expect(parseFileMeta(metaMessage(CHAT_FILE_MAX_BYTES + 1))).toBeNull();
    expect(parseFileMeta(metaMessage(0))).toBeNull();
    expect(parseFileMeta(metaMessage(100, { chunks: 5 }))).toBeNull();
    expect(parseFileMeta(metaMessage(100, { id: '' }))).toBeNull();
    expect(parseFileMeta(metaMessage(100, { displayName: 'x'.repeat(40) }))).toBeNull();
    expect(parseFileMeta({ type: 'chat' })).toBeNull();
    expect(parseFileMeta(null)).toBeNull();
  });
});

describe('ChatFileReceiver', () => {
  const channel = {};
  const payload = new Uint8Array(CHAT_FILE_CHUNK_SIZE + 10).map((_, index) => index % 251);

  const run = (receiver: ChatFileReceiver, name = 'a.pdf', type = 'application/pdf') => {
    const meta = buildFileMeta({ name, size: payload.length, type }, sender);
    const events = [receiver.handleText(channel, { type: 'file-meta', ...meta })];
    events.push(receiver.handleBinary(channel, payload.slice(0, CHAT_FILE_CHUNK_SIZE).buffer));
    events.push(receiver.handleBinary(channel, payload.slice(CHAT_FILE_CHUNK_SIZE).buffer));
    return { meta, events };
  };

  it('reassembles chunks into a blob', async () => {
    const receiver = new ChatFileReceiver();
    const { meta, events } = run(receiver);
    expect(events.map((event) => event?.type)).toEqual(['start', 'progress', 'progress']);
    const done = receiver.handleText(channel, { type: 'file-done', id: meta.id });
    expect(done?.type).toBe('done');
    if (done?.type === 'done') {
      expect(done.blob.size).toBe(payload.length);
      expect(done.blob.type).toBe('application/octet-stream');
    }
  });

  it('keeps the image type only for previewable images', () => {
    const receiver = new ChatFileReceiver();
    const { meta } = run(receiver, 'p.png', 'image/png');
    const done = receiver.handleText(channel, { type: 'file-done', id: meta.id });
    expect(done?.type === 'done' && done.blob.type).toBe('image/png');
  });

  it('fails when bytes are missing or overflow', () => {
    const receiver = new ChatFileReceiver();
    const meta = buildFileMeta({ name: 'a.bin', size: 10, type: '' }, sender);
    receiver.handleText(channel, { type: 'file-meta', ...meta });
    receiver.handleBinary(channel, new ArrayBuffer(4));
    expect(receiver.handleText(channel, { type: 'file-done', id: meta.id })).toEqual({ type: 'failed', id: meta.id });

    receiver.handleText(channel, { type: 'file-meta', ...meta });
    expect(receiver.handleBinary(channel, new ArrayBuffer(11))).toEqual({ type: 'failed', id: meta.id });
  });

  it('ignores stray chunks and reports aborted transfers', () => {
    const receiver = new ChatFileReceiver();
    expect(receiver.handleBinary(channel, new ArrayBuffer(4))).toBeNull();
    const meta = buildFileMeta({ name: 'a.bin', size: 10, type: '' }, sender);
    receiver.handleText(channel, { type: 'file-meta', ...meta });
    expect(receiver.abort(channel)).toEqual({ type: 'failed', id: meta.id });
    expect(receiver.abort(channel)).toBeNull();
  });

  it('keeps channels independent', () => {
    const receiver = new ChatFileReceiver();
    const other = {};
    const meta = buildFileMeta({ name: 'a.bin', size: 10, type: '' }, sender);
    receiver.handleText(channel, { type: 'file-meta', ...meta });
    expect(receiver.handleBinary(other, new ArrayBuffer(4))).toBeNull();
  });
});

describe('queueChannelTask', () => {
  it('serializes tasks per channel even when one fails', async () => {
    const channel = {};
    const order: string[] = [];
    const first = queueChannelTask(channel, async () => { await new Promise((resolve) => setTimeout(resolve, 10)); order.push('a'); throw new Error('x'); });
    const second = queueChannelTask(channel, async () => { order.push('b'); });
    await expect(first).rejects.toThrow();
    await second;
    expect(order).toEqual(['a', 'b']);
  });
});
