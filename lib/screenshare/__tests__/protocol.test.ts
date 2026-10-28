import { describe, expect, it } from 'vitest';
import { getSignalRateLimit, isQualityMode, isRoomAccess, isValidPeerId, isValidRoomId, isValidSecret, isViewerSignalDirectionValid, sanitizeParticipantName, validateSignalPayload } from '../protocol';

describe('screen-share signaling validation', () => {
  it('accepts cryptographically-sized IDs and tokens only', () => {
    expect(isValidRoomId('a'.repeat(48))).toBe(true);
    expect(isValidRoomId('a'.repeat(47))).toBe(false);
    expect(isValidPeerId('b'.repeat(32))).toBe(true);
    expect(isValidSecret('c'.repeat(64))).toBe(true);
    expect(isValidSecret('token')).toBe(false);
    expect(isQualityMode('automatic')).toBe(true);
    expect(isQualityMode('custom')).toBe(false);
  });

  it('accepts bounded SDP and ICE payloads while rejecting oversized or malformed values', () => {
    expect(validateSignalPayload({ type: 'offer', negotiationId: '12345678-1234-1234', description: { type: 'offer', sdp: 'v=0' } })).toMatchObject({ type: 'offer' });
    expect(validateSignalPayload({ type: 'candidate', negotiationId: '12345678-1234-1234', candidate: { candidate: 'candidate:1', sdpMLineIndex: 0 } })).toMatchObject({ type: 'candidate' });
    expect(validateSignalPayload({ type: 'offer', negotiationId: '12345678-1234-1234', description: { type: 'offer', sdp: 'x'.repeat(80_001) } })).toBeNull();
    expect(validateSignalPayload({ type: 'quality-request', preference: 'economy' })).toEqual({ type: 'quality-request', preference: 'economy' });
    expect(validateSignalPayload({ type: 'quality-request', preference: 'force-1080p' })).toBeNull();
  });

  it('allows viewer offers only to another viewer and keeps control signals host-directed', () => {
    const offer = { type: 'offer', negotiationId: '12345678-1234-1234', description: { type: 'offer', sdp: 'v=0' } } as const;
    expect(isViewerSignalDirectionValid(offer, 'host')).toBe(false);
    expect(isViewerSignalDirectionValid(offer, 'a'.repeat(32))).toBe(true);
    expect(isViewerSignalDirectionValid({ type: 'join' }, 'host')).toBe(true);
    expect(isViewerSignalDirectionValid({ type: 'join' }, 'a'.repeat(32))).toBe(false);
    expect(isViewerSignalDirectionValid({ type: 'quality-request', preference: 'economy' }, 'a'.repeat(32))).toBe(false);
  });

  it('gives trickled ICE candidates a separate bounded rate budget', () => {
    const candidate = { type: 'candidate', negotiationId: '12345678-1234-1234', candidate: { candidate: 'candidate:1' } } as const;
    const offer = { type: 'offer', negotiationId: '12345678-1234-1234', description: { type: 'offer', sdp: 'v=0' } } as const;
    expect(getSignalRateLimit('viewer', candidate)).toEqual({ bucket: 'candidate', limit: 600 });
    expect(getSignalRateLimit('host', candidate)).toEqual({ bucket: 'candidate', limit: 600 });
    expect(getSignalRateLimit('viewer', offer)).toEqual({ bucket: 'signal', limit: 120 });
    expect(getSignalRateLimit('host', offer)).toEqual({ bucket: 'signal', limit: 180 });
  });

  it('normalizes temporary participant names and validates room access choices', () => {
    expect(sanitizeParticipantName('  Ana\nCosta  ')).toBe('AnaCosta');
    expect(sanitizeParticipantName('😀'.repeat(40))).toBe('😀'.repeat(32));
    expect(sanitizeParticipantName('   ')).toBeNull();
    expect(isRoomAccess('private')).toBe(true);
    expect(isRoomAccess('listed')).toBe(false);
  });
});
