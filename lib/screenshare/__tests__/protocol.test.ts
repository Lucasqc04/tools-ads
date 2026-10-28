import { describe, expect, it } from 'vitest';
import { isQualityMode, isRoomAccess, isValidPeerId, isValidRoomId, isValidSecret, sanitizeParticipantName, validateSignalPayload } from '../protocol';

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

  it('normalizes temporary participant names and validates room access choices', () => {
    expect(sanitizeParticipantName('  Ana\nCosta  ')).toBe('AnaCosta');
    expect(sanitizeParticipantName('😀'.repeat(40))).toBe('😀'.repeat(32));
    expect(sanitizeParticipantName('   ')).toBeNull();
    expect(isRoomAccess('private')).toBe(true);
    expect(isRoomAccess('listed')).toBe(false);
  });
});
