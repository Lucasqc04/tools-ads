import { describe, expect, it } from 'vitest';
import { parseCallSession } from '../session';

const room = 'ab12'.repeat(12);
const token = 'cd34'.repeat(16);
const peer = 'ef56'.repeat(8);

describe('parseCallSession', () => {
  it('accepts a host session', () => {
    expect(parseCallSession({ role: 'host', roomId: room, token, name: 'Ana', access: 'public', startedAt: 1, cursor: 4 }))
      .toMatchObject({ role: 'host', roomId: room, cursor: 4 });
  });

  it('accepts a viewer session', () => {
    expect(parseCallSession({ role: 'viewer', roomId: room, peerId: peer, token, name: 'Bia', economy: false, cursor: 0 }))
      .toMatchObject({ role: 'viewer', peerId: peer });
  });

  it('rejects malformed ids, tokens and roles', () => {
    expect(parseCallSession({ role: 'host', roomId: 'x', token, name: 'A', access: 'public', startedAt: 1, cursor: 0 })).toBeNull();
    expect(parseCallSession({ role: 'host', roomId: room, token: 'short', name: 'A', access: 'public', startedAt: 1, cursor: 0 })).toBeNull();
    expect(parseCallSession({ role: 'admin', roomId: room, token, name: 'A', cursor: 0 })).toBeNull();
    expect(parseCallSession({ role: 'viewer', roomId: room, peerId: 'bad', token, name: 'A', economy: false, cursor: 0 })).toBeNull();
    expect(parseCallSession(null)).toBeNull();
  });

  it('rejects a negative or fractional cursor', () => {
    expect(parseCallSession({ role: 'host', roomId: room, token, name: 'A', access: 'public', startedAt: 1, cursor: -1 })).toBeNull();
    expect(parseCallSession({ role: 'host', roomId: room, token, name: 'A', access: 'public', startedAt: 1, cursor: 1.5 })).toBeNull();
  });
});
