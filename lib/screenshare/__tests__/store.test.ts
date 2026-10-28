import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ScreenShareRoomRecord } from '../protocol';

const redisMocks = vi.hoisted(() => ({ eval: vi.fn(), get: vi.fn(), ttl: vi.fn() }));

vi.mock('@upstash/redis', () => ({ Redis: vi.fn(() => redisMocks) }));

const makeRoom = (): ScreenShareRoomRecord => ({
  id: 'a'.repeat(48), hostTokenHash: 'b'.repeat(64), status: 'active', createdAt: 1_000,
  lastHostHeartbeat: 1_000, hardExpiresAt: 3_601_000, viewerLimit: 2, maxViewerLimit: 5,
  qualityMode: 'automatic', audioAvailable: false,
});

describe('isolated Upstash screen-share store adapter', () => {
  beforeEach(() => {
    vi.resetModules();
    redisMocks.eval.mockReset();
    redisMocks.get.mockReset();
    redisMocks.ttl.mockReset();
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example.invalid';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
  });

  it('creates a room with a collision guard and a short heartbeat lease', async () => {
    redisMocks.eval.mockResolvedValue(1);
    const store = await import('../store');
    const room = { ...makeRoom(), hardExpiresAt: Date.now() + 3_600_000 };

    await expect(store.createRoom(room)).resolves.toBe(true);
    const [script, keys, args] = redisMocks.eval.mock.calls[0] as [string, string[], unknown[]];
    expect(keys[0]).toBe(`screenshare:{${'a'.repeat(48)}}:room`);
    expect(script).toContain("'NX'");
    expect(args[1]).toBe(90);
  });

  it('returns a clear unavailable error when Redis credentials are missing instead of using memory', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    const store = await import('../store');

    await expect(store.consumeRateLimit('screenshare:rate:test', 60, 1)).rejects.toMatchObject({ name: 'ScreenShareStoreUnavailableError' });
    expect(redisMocks.eval).not.toHaveBeenCalled();
  });

  it('enforces rate limits with one atomic counter and expiration', async () => {
    redisMocks.eval.mockResolvedValue(0);
    const store = await import('../store');

    await expect(store.consumeRateLimit('screenshare:rate:create:hash', 60, 4)).resolves.toBe(false);
    const [script, keys, args] = redisMocks.eval.mock.calls[0] as [string, string[], unknown[]];
    expect(script).toContain("redis.call('INCR'");
    expect(script).toContain("redis.call('EXPIRE'");
    expect(keys[0]).toBe('screenshare:rate:create:hash');
    expect(args).toEqual([60, 4]);
  });

  it('checks host/viewer authorization and expires viewer reservations in the atomic join script', async () => {
    redisMocks.get.mockResolvedValue(makeRoom());
    redisMocks.eval.mockResolvedValue('unauthorized');
    const store = await import('../store');

    await expect(store.joinRoom({ id: makeRoom().id, peerId: 'c'.repeat(32), tokenHash: 'd'.repeat(64), now: 2_000 })).resolves.toBe('unauthorized');
    const [script, keys, args] = redisMocks.eval.mock.calls[0] as [string, string[], unknown[]];
    expect(script).toContain('existing.tokenHash ~= ARGV[4]');
    expect(script).toContain("redis.call('SCARD'");
    expect(script).toContain("redis.call('SADD'");
    expect(script).toContain('now - tonumber(existingPeer.lastHeartbeat) > (tonumber(ARGV[3]) * 1000)');
    expect(script.indexOf("redis.call('SCARD'")).toBeLessThan(script.indexOf("redis.call('SET', KEYS[3], ARGV[6]"));
    expect(keys[0]).toContain('screenshare:{');
    expect(args[3]).toBe('d'.repeat(64));
  });

  it('serializes simultaneous viewer attempts through the bounded atomic seat check', async () => {
    redisMocks.get.mockResolvedValue(makeRoom());
    redisMocks.eval.mockResolvedValueOnce('joined').mockResolvedValueOnce('full');
    const store = await import('../store');
    const base = { id: makeRoom().id, tokenHash: 'd'.repeat(64), now: 2_000 };

    const outcomes = await Promise.all([
      store.joinRoom({ ...base, peerId: 'c'.repeat(32) }),
      store.joinRoom({ ...base, peerId: 'e'.repeat(32) }),
    ]);

    expect(outcomes.sort()).toEqual(['full', 'joined']);
    expect(redisMocks.eval).toHaveBeenCalledTimes(2);
    expect(redisMocks.eval.mock.calls[0][0]).toBe(redisMocks.eval.mock.calls[1][0]);
  });

  it('bounds signaling queues, checks identity and expires messages after their room lease', async () => {
    redisMocks.ttl.mockResolvedValue(60);
    redisMocks.eval.mockResolvedValue(7);
    const store = await import('../store');
    const signal = { type: 'offer' as const, negotiationId: '12345678-1234-1234', description: { type: 'offer' as const, sdp: 'v=0' } };

    await expect(store.sendSignal({ id: makeRoom().id, role: 'host', peerId: 'host', tokenHash: 'b'.repeat(64), target: 'c'.repeat(32), signal, now: 2_000 })).resolves.toBe(7);
    const [script, keys, args] = redisMocks.eval.mock.calls[0] as [string, string[], unknown[]];
    expect(script).toContain('room.hostTokenHash ~= ARGV[4]');
    expect(script).toContain("redis.call('LTRIM'");
    expect(script).toContain("redis.call('EXPIRE'");
    expect(keys[4]).toContain(':signals:');
    expect(JSON.parse(String(args[5]))).toEqual(signal);
    expect(args[7]).toBe(60);
  });

  it('renews a host lease for recovery and atomically closes the room for viewers', async () => {
    redisMocks.eval.mockResolvedValueOnce('ok').mockResolvedValueOnce('ok');
    const store = await import('../store');

    await expect(store.heartbeatHost({ id: makeRoom().id, tokenHash: makeRoom().hostTokenHash, now: 2_000, audioAvailable: true, qualityMode: 'automatic' })).resolves.toBe('ok');
    await expect(store.closeRoom({ id: makeRoom().id, tokenHash: makeRoom().hostTokenHash, now: 3_000 })).resolves.toBe('ok');
    const heartbeatScript = String(redisMocks.eval.mock.calls[0][0]);
    const closeScript = String(redisMocks.eval.mock.calls[1][0]);
    expect(heartbeatScript).toContain('room.lastHostHeartbeat');
    expect(heartbeatScript).toContain("math.min");
    expect(heartbeatScript).toContain("redis.call('EXPIRE', KEYS[3], ttl)");
    expect(redisMocks.eval.mock.calls[0][1]).toHaveLength(3);
    expect(closeScript).toContain("room.status = 'closed'");
    expect(closeScript).toContain("type='room-closed'");
  });

  it('updates the active viewer limit atomically for the host within the configured cap', async () => {
    redisMocks.eval.mockResolvedValue('ok');
    const store = await import('../store');
    await expect(store.setRoomViewerLimit({ id: makeRoom().id, tokenHash: makeRoom().hostTokenHash, viewerLimit: 1, now: 2_000 })).resolves.toBe('ok');
    const [script, keys, args] = redisMocks.eval.mock.calls[0] as [string, string[], unknown[]];
    expect(script).toContain('room.hostTokenHash ~= ARGV[1]');
    expect(script).toContain('room.maxViewerLimit or room.viewerLimit');
    expect(script).toContain('room.viewerLimit = requested');
    expect(keys[0]).toContain('screenshare:{');
    expect(args[2]).toBe(1);
  });

  it('compares viewer heartbeat timestamps in milliseconds for room counts and host peer cleanup', async () => {
    redisMocks.eval
      .mockResolvedValueOnce('{"status":"ok","viewerCount":1}')
      .mockResolvedValueOnce('{"status":"ok","peers":[]}');
    const store = await import('../store');

    await expect(store.getPublicRoomInfo(makeRoom().id, 62_000)).resolves.toMatchObject({ viewerCount: 1 });
    await expect(store.getHostPeers(makeRoom().id, makeRoom().hostTokenHash, 62_000)).resolves.toMatchObject({ peers: [] });

    const publicRoomScript = String(redisMocks.eval.mock.calls[0][0]);
    const hostPeersScript = String(redisMocks.eval.mock.calls[1][0]);
    expect(publicRoomScript).toContain('now - tonumber(peer.lastHeartbeat) > (tonumber(ARGV[3]) * 1000)');
    expect(hostPeersScript).toContain('now - tonumber(peer.lastHeartbeat) > (tonumber(ARGV[4]) * 1000)');
  });
});
