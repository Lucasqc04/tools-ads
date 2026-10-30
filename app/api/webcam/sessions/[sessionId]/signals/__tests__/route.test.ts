import { createHash } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { poll, send, close } = vi.hoisted(() => ({ poll: vi.fn(), send: vi.fn(), close: vi.fn() }));

vi.mock('@/lib/celular-webcam/store', () => ({
  pollWebcamSignals: poll,
  sendWebcamSignal: send,
  closeWebcamSession: close,
  WebcamStoreUnavailableError: class WebcamStoreUnavailableError extends Error {},
}));

import { GET, POST } from '../route';
import { DELETE } from '../../route';

const sessionId = 'a'.repeat(48);
const phoneToken = 'b'.repeat(64);
const clientId = 'c'.repeat(32);
const tokenHash = createHash('sha256').update(phoneToken).digest('hex');

describe('webcam signaling API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('does not query a phone session without a bound-client id', async () => {
    const response = await GET(
      new Request(`https://tools.example/api/webcam/sessions/${sessionId}/signals?role=phone`, {
        headers: { 'X-Webcam-Token': phoneToken },
      }),
      { params: Promise.resolve({ sessionId }) },
    );

    expect(response.status).toBe(404);
    expect(poll).not.toHaveBeenCalled();
  });

  it('keeps an unknown token indistinguishable from a missing session', async () => {
    send.mockResolvedValue('not_found');
    const response = await POST(
      new Request(`https://tools.example/api/webcam/sessions/${sessionId}/signals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Webcam-Token': phoneToken },
        body: JSON.stringify({ role: 'phone', clientId, signalId: '0123456789abcdef', signal: { type: 'request' } }),
      }),
      { params: Promise.resolve({ sessionId }) },
    );

    expect(response.status).toBe(404);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ tokenHash, clientId }));
    expect(send.mock.calls[0][0].tokenHash).not.toBe(phoneToken);
  });

  it('validates signal payloads before writing them and queues valid requests', async () => {
    const invalid = await POST(
      new Request(`https://tools.example/api/webcam/sessions/${sessionId}/signals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Webcam-Token': phoneToken },
        body: JSON.stringify({ role: 'phone', clientId, signalId: '0123456789abcdef', signal: { type: 'answer' } }),
      }),
      { params: Promise.resolve({ sessionId }) },
    );
    expect(invalid.status).toBe(400);
    expect(send).not.toHaveBeenCalled();

    send.mockResolvedValue('ok');
    const valid = await POST(
      new Request(`https://tools.example/api/webcam/sessions/${sessionId}/signals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Webcam-Token': phoneToken },
        body: JSON.stringify({ role: 'phone', clientId, signalId: 'fedcba9876543210', signal: { type: 'request' } }),
      }),
      { params: Promise.resolve({ sessionId }) },
    );
    expect(valid.status).toBe(200);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      id: sessionId,
      role: 'phone',
      tokenHash,
      clientId,
      signal: { type: 'request' },
    }));
  });

  it('closes a session only through a valid bearer token', async () => {
    close.mockResolvedValue('ok');
    const response = await DELETE(
      new Request(`https://tools.example/api/webcam/sessions/${sessionId}?role=host`, {
        method: 'DELETE',
        headers: { 'X-Webcam-Token': phoneToken },
      }),
      { params: Promise.resolve({ sessionId }) },
    );

    expect(response.status).toBe(200);
    expect(close).toHaveBeenCalledWith(expect.objectContaining({ id: sessionId, role: 'host', tokenHash }));
  });
});
