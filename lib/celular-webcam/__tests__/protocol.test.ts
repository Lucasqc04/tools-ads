import { describe, expect, it } from 'vitest';
import {
  WEBCAM_SESSION_MAX_LIFETIME_MS,
  createWebcamSessionRecord,
  isValidWebcamSessionId,
  isValidWebcamClientId,
  isValidWebcamSignalId,
  isValidWebcamToken,
  isWebcamSignalAllowed,
  isWebcamSessionExpired,
  validateWebcamSignal,
  webcamSignalRateLimit,
} from '../protocol';

describe('phone webcam session protocol', () => {
  it('creates a waiting session with a bounded four-hour lifetime', () => {
    const session = createWebcamSessionRecord('a'.repeat(48), 'b'.repeat(64), 'c'.repeat(64), 1_000);
    expect(session).toMatchObject({ id: 'a'.repeat(48), status: 'waiting', createdAt: 1_000 });
    expect(session.hardExpiresAt).toBe(1_000 + WEBCAM_SESSION_MAX_LIFETIME_MS);
    expect(isWebcamSessionExpired(session, session.hardExpiresAt - 1)).toBe(false);
    expect(isWebcamSessionExpired(session, session.hardExpiresAt)).toBe(true);
  });

  it('requires random-sized session ids, bearer tokens, and replay ids', () => {
    expect(isValidWebcamSessionId('a'.repeat(48))).toBe(true);
    expect(isValidWebcamSessionId('a'.repeat(47))).toBe(false);
    expect(isValidWebcamToken('d'.repeat(64))).toBe(true);
    expect(isValidWebcamToken('short-token')).toBe(false);
    expect(isValidWebcamSignalId('12345678-1234-1234')).toBe(true);
    expect(isValidWebcamSignalId('bad-id')).toBe(false);
    expect(isValidWebcamClientId('e'.repeat(32))).toBe(true);
    expect(isValidWebcamClientId('short')).toBe(false);
  });

  it('accepts bounded SDP and ICE data and rejects malformed or oversized payloads', () => {
    expect(validateWebcamSignal({ type: 'offer', description: { type: 'offer', sdp: 'v=0' } })).toEqual({
      type: 'offer', description: { type: 'offer', sdp: 'v=0' },
    });
    expect(validateWebcamSignal({ type: 'answer', description: { type: 'offer', sdp: 'v=0' } })).toBeNull();
    expect(validateWebcamSignal({ type: 'offer', description: { type: 'offer', sdp: 'x'.repeat(64_001) } })).toBeNull();
    expect(validateWebcamSignal({ type: 'candidate', candidate: { candidate: 'candidate:1', sdpMLineIndex: 0 } })).toMatchObject({ type: 'candidate' });
    expect(validateWebcamSignal({ type: 'candidate', candidate: { candidate: 'x'.repeat(2_049) } })).toBeNull();
    expect(validateWebcamSignal({ type: 'state', state: 'connected' })).toEqual({ type: 'state', state: 'connected' });
    expect(validateWebcamSignal({ type: 'state', state: 'failed' })).toBeNull();
  });

  it('restricts signal directions and gives ICE candidates a separate rate budget', () => {
    const offer = { type: 'offer', description: { type: 'offer', sdp: 'v=0' } } as const;
    const answer = { type: 'answer', description: { type: 'answer', sdp: 'v=0' } } as const;
    const candidate = { type: 'candidate', candidate: { candidate: 'candidate:1' } } as const;
    expect(isWebcamSignalAllowed('phone', offer)).toBe(true);
    expect(isWebcamSignalAllowed('host', offer)).toBe(false);
    expect(isWebcamSignalAllowed('host', answer)).toBe(true);
    expect(isWebcamSignalAllowed('phone', answer)).toBe(false);
    expect(webcamSignalRateLimit(candidate)).toBe(120);
    expect(webcamSignalRateLimit(offer)).toBe(30);
  });
});
