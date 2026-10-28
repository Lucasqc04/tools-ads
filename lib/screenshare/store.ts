import { Redis } from '@upstash/redis';
import {
  SCREENSHARE_HOST_RECOVERY_MS,
  SCREENSHARE_MAX_VIEWERS_DEFAULT,
  SCREENSHARE_SIGNAL_LIMIT,
  SCREENSHARE_SIGNAL_TTL_SECONDS,
  SCREENSHARE_VIEWER_LEASE_SECONDS,
  type PeerState,
  type QualityMode,
  type ScreenSharePeerRecord,
  type ScreenShareRoomRecord,
  type ScreenShareSignal,
  type UnsequencedSignal,
} from './protocol';

export class ScreenShareStoreUnavailableError extends Error {
  constructor() {
    super('Screen share signaling store unavailable.');
    this.name = 'ScreenShareStoreUnavailableError';
  }
}

let redisClient: Redis | null | undefined;

const getRedis = (): Redis => {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim();
  if (!url || !token) throw new ScreenShareStoreUnavailableError();

  redisClient = new Redis({ url, token });
  return redisClient;
};

const roomKey = (id: string) => `screenshare:{${id}}:room`;
const viewersKey = (id: string) => `screenshare:{${id}}:viewers`;
const viewerKey = (id: string, peerId: string) => `screenshare:{${id}}:peer:${peerId}`;
const signalSequenceKey = (id: string) => `screenshare:{${id}}:signal-sequence`;
const hostSignalsKey = (id: string) => `screenshare:{${id}}:signals:host`;
const peerSignalsKey = (id: string, peerId: string) => `screenshare:{${id}}:signals:${peerId}`;

const RATE_LIMIT_SCRIPT = `
local current = redis.call('INCR', KEYS[1])
if current == 1 then redis.call('EXPIRE', KEYS[1], tonumber(ARGV[1])) end
if current > tonumber(ARGV[2]) then return 0 end
return 1
`;

const CREATE_ROOM_SCRIPT = `
local result = redis.call('SET', KEYS[1], ARGV[1], 'EX', tonumber(ARGV[2]), 'NX')
if not result then return 0 end
redis.call('SET', KEYS[2], '0', 'EX', tonumber(ARGV[2]))
return 1
`;

const JOIN_ROOM_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
local room = cjson.decode(roomValue)
local now = tonumber(ARGV[1])
if room.status ~= 'active' then return 'closed' end
if tonumber(room.hardExpiresAt) <= now then return 'expired' end
if now - tonumber(room.lastHostHeartbeat) > tonumber(ARGV[2]) then return 'recovering' end
local existingValue = redis.call('GET', KEYS[3])
if existingValue then
  local existing = cjson.decode(existingValue)
  if existing.tokenHash ~= ARGV[4] then return 'unauthorized' end
  existing.lastHeartbeat = now
  redis.call('SET', KEYS[3], cjson.encode(existing), 'EX', tonumber(ARGV[3]))
  redis.call('SADD', KEYS[2], ARGV[5])
  redis.call('EXPIRE', KEYS[2], tonumber(ARGV[3]))
  return 'existing'
end
local existingPeers = redis.call('SMEMBERS', KEYS[2])
for _, existingPeerId in ipairs(existingPeers) do
  local existingPeerKey = ARGV[7] .. existingPeerId
  local existingPeerValue = redis.call('GET', existingPeerKey)
  if not existingPeerValue then
    redis.call('SREM', KEYS[2], existingPeerId)
  else
    local existingPeer = cjson.decode(existingPeerValue)
    if now - tonumber(existingPeer.lastHeartbeat) > (tonumber(ARGV[3]) * 1000) then
      redis.call('SREM', KEYS[2], existingPeerId)
      redis.call('DEL', existingPeerKey)
      redis.call('DEL', ARGV[8] .. existingPeerId)
    end
  end
end
if redis.call('SCARD', KEYS[2]) >= tonumber(room.viewerLimit) then return 'full' end
redis.call('SET', KEYS[3], ARGV[6], 'EX', tonumber(ARGV[3]), 'NX')
if redis.call('EXISTS', KEYS[3]) == 0 then return 'conflict' end
redis.call('SADD', KEYS[2], ARGV[5])
redis.call('EXPIRE', KEYS[2], tonumber(ARGV[3]))
return 'joined'
`;

const HOST_HEARTBEAT_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
local room = cjson.decode(roomValue)
local now = tonumber(ARGV[2])
if room.hostTokenHash ~= ARGV[1] then return 'unauthorized' end
if room.status ~= 'active' or tonumber(room.hardExpiresAt) <= now or now - tonumber(room.lastHostHeartbeat) > tonumber(ARGV[4]) then return 'expired' end
room.lastHostHeartbeat = now
room.audioAvailable = ARGV[3] == '1'
room.qualityMode = ARGV[5]
local ttl = math.max(1, math.min(math.floor((tonumber(room.hardExpiresAt) - now) / 1000), math.floor(tonumber(ARGV[4]) / 1000)))
redis.call('SET', KEYS[1], cjson.encode(room), 'EX', ttl)
redis.call('EXPIRE', KEYS[2], ttl)
redis.call('EXPIRE', KEYS[3], ttl)
return 'ok'
`;

const SET_VIEWER_LIMIT_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
local room = cjson.decode(roomValue)
local now = tonumber(ARGV[2])
if room.hostTokenHash ~= ARGV[1] then return 'unauthorized' end
if room.status ~= 'active' or tonumber(room.hardExpiresAt) <= now or now - tonumber(room.lastHostHeartbeat) > tonumber(ARGV[4]) then return 'closed' end
local requested = tonumber(ARGV[3])
local maximum = tonumber(room.maxViewerLimit or room.viewerLimit)
if requested < 1 or requested > maximum then return 'invalid' end
room.viewerLimit = requested
local ttl = redis.call('TTL', KEYS[1])
if ttl < 1 then ttl = math.max(1, math.floor((tonumber(room.hardExpiresAt) - now) / 1000)) end
redis.call('SET', KEYS[1], cjson.encode(room), 'EX', ttl)
return 'ok'
`;

const VIEWER_HEARTBEAT_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
local room = cjson.decode(roomValue)
if room.status ~= 'active' then return 'closed' end
local peerValue = redis.call('GET', KEYS[3])
if not peerValue or not redis.call('SISMEMBER', KEYS[2], ARGV[1]) then return 'missing_peer' end
local peer = cjson.decode(peerValue)
if peer.tokenHash ~= ARGV[2] then return 'unauthorized' end
peer.lastHeartbeat = tonumber(ARGV[4])
peer.state = ARGV[3]
redis.call('SET', KEYS[3], cjson.encode(peer), 'EX', tonumber(ARGV[5]))
return 'ok'
`;

const SEND_SIGNAL_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
local room = cjson.decode(roomValue)
local now = tonumber(ARGV[5])
if room.status ~= 'active' or tonumber(room.hardExpiresAt) <= now then return 'closed' end
local role = ARGV[1]
local peerId = ARGV[2]
local target = ARGV[3]
if role == 'host' then
  if room.hostTokenHash ~= ARGV[4] then return 'unauthorized' end
  if target == 'host' or redis.call('SISMEMBER', KEYS[2], target) == 0 then return 'invalid_target' end
else
  if target ~= 'host' or redis.call('SISMEMBER', KEYS[2], peerId) == 0 then return 'unauthorized' end
  local peerValue = redis.call('GET', KEYS[3])
  if not peerValue or cjson.decode(peerValue).tokenHash ~= ARGV[4] then return 'unauthorized' end
end
local sequence = redis.call('INCR', KEYS[4])
local signal = cjson.decode(ARGV[6])
signal.sequence = sequence
signal.fromPeerId = role == 'host' and 'host' or peerId
signal.createdAt = now
redis.call('RPUSH', KEYS[5], cjson.encode(signal))
redis.call('LTRIM', KEYS[5], -tonumber(ARGV[7]), -1)
redis.call('EXPIRE', KEYS[5], tonumber(ARGV[8]))
return sequence
`;

const POLL_SIGNALS_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return cjson.encode({status='missing', messages={}}) end
local room = cjson.decode(roomValue)
local role = ARGV[1]
local peerId = ARGV[2]
if role == 'host' then
  if room.hostTokenHash ~= ARGV[3] then return cjson.encode({status='unauthorized', messages={}}) end
else
  local peerValue = redis.call('GET', KEYS[2])
  if not peerValue or not redis.call('SISMEMBER', KEYS[3], peerId) or cjson.decode(peerValue).tokenHash ~= ARGV[3] then
    return cjson.encode({status='unauthorized', messages={}})
  end
end
local queue = redis.call('LRANGE', KEYS[4], 0, -1)
local messages = {}
local oldest = nil
for _, encoded in ipairs(queue) do
  local message = cjson.decode(encoded)
  if not oldest or tonumber(message.sequence) < oldest then oldest = tonumber(message.sequence) end
  if tonumber(message.sequence) > tonumber(ARGV[4]) then table.insert(messages, message) end
end
local state = room.status
local now = tonumber(ARGV[5])
if state == 'active' and tonumber(room.hardExpiresAt) <= now then state = 'expired' end
if state == 'active' and now - tonumber(room.lastHostHeartbeat) > tonumber(ARGV[6]) then state = 'expired' end
if state == 'active' and now - tonumber(room.lastHostHeartbeat) > 30000 then state = 'recovering' end
return cjson.encode({status='ok', roomState=state, messages=messages, oldestSequence=oldest, viewerLimit=room.viewerLimit})
`;

const GET_PUBLIC_ROOM_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return cjson.encode({status='missing'}) end
local room = cjson.decode(roomValue)
local now = tonumber(ARGV[1])
local peers = redis.call('SMEMBERS', KEYS[2])
local count = 0
for _, peerId in ipairs(peers) do
  local peerKey = ARGV[2] .. peerId
  local peerValue = redis.call('GET', peerKey)
  if not peerValue then
    redis.call('SREM', KEYS[2], peerId)
  else
    local peer = cjson.decode(peerValue)
    if now - tonumber(peer.lastHeartbeat) > (tonumber(ARGV[3]) * 1000) then
      redis.call('SREM', KEYS[2], peerId)
      redis.call('DEL', peerKey)
      redis.call('DEL', ARGV[4] .. peerId)
    else
      count = count + 1
    end
  end
end
local state = room.status
if state == 'active' and tonumber(room.hardExpiresAt) <= now then state = 'expired' end
if state == 'active' and now - tonumber(room.lastHostHeartbeat) > tonumber(ARGV[5]) then state = 'expired' end
if state == 'active' and now - tonumber(room.lastHostHeartbeat) > 30000 then state = 'recovering' end
return cjson.encode({
  status='ok',
  state=state,
  viewerLimit=room.viewerLimit,
  viewerCount=count,
  createdAt=room.createdAt,
  expiresAt=room.hardExpiresAt,
  qualityMode=room.qualityMode,
  audioAvailable=room.audioAvailable
})
`;

const GET_PEERS_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return cjson.encode({status='missing', peers={}}) end
local room = cjson.decode(roomValue)
if room.hostTokenHash ~= ARGV[1] then return cjson.encode({status='unauthorized', peers={}}) end
local now = tonumber(ARGV[2])
local ids = redis.call('SMEMBERS', KEYS[2])
local peers = {}
for _, peerId in ipairs(ids) do
  local peerKey = ARGV[3] .. peerId
  local peerValue = redis.call('GET', peerKey)
  if not peerValue then
    redis.call('SREM', KEYS[2], peerId)
  else
    local peer = cjson.decode(peerValue)
    if now - tonumber(peer.lastHeartbeat) > (tonumber(ARGV[4]) * 1000) then
      redis.call('SREM', KEYS[2], peerId)
      redis.call('DEL', peerKey)
      redis.call('DEL', ARGV[5] .. peerId)
    else
      table.insert(peers, {id=peer.id, joinedAt=peer.joinedAt, lastHeartbeat=peer.lastHeartbeat, state=peer.state})
    end
  end
end
return cjson.encode({status='ok', peers=peers})
`;

const LEAVE_VIEWER_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
local peerValue = redis.call('GET', KEYS[3])
if not roomValue or not peerValue or not redis.call('SISMEMBER', KEYS[2], ARGV[1]) then return 'missing' end
local peer = cjson.decode(peerValue)
if peer.tokenHash ~= ARGV[2] then return 'unauthorized' end
redis.call('SREM', KEYS[2], ARGV[1])
redis.call('DEL', KEYS[3])
local room = cjson.decode(roomValue)
if room.status == 'active' then
  local sequence = redis.call('INCR', KEYS[4])
  local message = cjson.encode({type='bye', fromPeerId=ARGV[1], sequence=sequence, createdAt=tonumber(ARGV[3])})
  redis.call('RPUSH', KEYS[5], message)
  redis.call('LTRIM', KEYS[5], -tonumber(ARGV[4]), -1)
  redis.call('EXPIRE', KEYS[5], tonumber(ARGV[5]))
end
return 'ok'
`;

const CLOSE_ROOM_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
local room = cjson.decode(roomValue)
if room.hostTokenHash ~= ARGV[1] then return 'unauthorized' end
if room.status == 'closed' then return 'closed' end
room.status = 'closed'
room.closedAt = tonumber(ARGV[2])
local peers = redis.call('SMEMBERS', KEYS[2])
for _, peerId in ipairs(peers) do
  local sequence = redis.call('INCR', KEYS[3])
  local message = cjson.encode({type='room-closed', fromPeerId='host', sequence=sequence, createdAt=tonumber(ARGV[2])})
  local queue = ARGV[3] .. peerId
  redis.call('RPUSH', queue, message)
  redis.call('LTRIM', queue, -tonumber(ARGV[4]), -1)
  redis.call('EXPIRE', queue, tonumber(ARGV[5]))
  redis.call('EXPIRE', ARGV[6] .. peerId, tonumber(ARGV[5]))
end
redis.call('SET', KEYS[1], cjson.encode(room), 'EX', tonumber(ARGV[5]))
redis.call('EXPIRE', KEYS[2], tonumber(ARGV[5]))
redis.call('EXPIRE', KEYS[3], tonumber(ARGV[5]))
return 'ok'
`;

const parseScriptJson = <T>(result: unknown): T => {
  if (typeof result === 'string') return JSON.parse(result) as T;
  return result as T;
};

export const getConfiguredViewerLimit = (): number => {
  const parsed = Number.parseInt(process.env.SCREENSHARE_MAX_VIEWERS ?? '', 10);
  return Number.isFinite(parsed) && parsed >= 1 && parsed <= 20
    ? parsed
    : SCREENSHARE_MAX_VIEWERS_DEFAULT;
};

export const consumeRateLimit = async (key: string, windowSeconds: number, limit: number): Promise<boolean> => {
  const result = await getRedis().eval(RATE_LIMIT_SCRIPT, [key], [windowSeconds, limit]);
  return Number(result) === 1;
};

export const createRoom = async (record: ScreenShareRoomRecord): Promise<boolean> => {
  const ttl = Math.max(1, Math.min(
    Math.ceil((record.hardExpiresAt - Date.now()) / 1000),
    Math.ceil(SCREENSHARE_HOST_RECOVERY_MS / 1_000),
  ));
  const result = await getRedis().eval(
    CREATE_ROOM_SCRIPT,
    [roomKey(record.id), signalSequenceKey(record.id)],
    [JSON.stringify(record), ttl],
  );
  return Number(result) === 1;
};

export const joinRoom = async ({
  id,
  peerId,
  tokenHash,
  now,
}: {
  id: string;
  peerId: string;
  tokenHash: string;
  now: number;
}): Promise<'joined' | 'existing' | 'full' | 'missing' | 'closed' | 'expired' | 'recovering' | 'unauthorized' | 'conflict'> => {
  const room = await getRedis().get<ScreenShareRoomRecord>(roomKey(id));
  if (!room) return 'missing';
  const remainingSeconds = Math.max(1, Math.ceil((room.hardExpiresAt - now) / 1000));
  const record: ScreenSharePeerRecord = {
    id: peerId,
    tokenHash,
    joinedAt: now,
    lastHeartbeat: now,
    state: 'connecting',
  };
  const result = await getRedis().eval(
    JOIN_ROOM_SCRIPT,
    [roomKey(id), viewersKey(id), viewerKey(id, peerId)],
    [now, SCREENSHARE_HOST_RECOVERY_MS, Math.min(SCREENSHARE_VIEWER_LEASE_SECONDS, remainingSeconds), tokenHash, peerId, JSON.stringify(record), `screenshare:{${id}}:peer:`, `screenshare:{${id}}:signals:`],
  );
  return String(result) as Awaited<ReturnType<typeof joinRoom>>;
};

export const heartbeatHost = async ({
  id,
  tokenHash,
  now,
  audioAvailable,
  qualityMode,
}: {
  id: string;
  tokenHash: string;
  now: number;
  audioAvailable: boolean;
  qualityMode: QualityMode;
}): Promise<string> => String(await getRedis().eval(
  HOST_HEARTBEAT_SCRIPT,
  [roomKey(id), viewersKey(id), signalSequenceKey(id)],
  [tokenHash, now, audioAvailable ? '1' : '0', SCREENSHARE_HOST_RECOVERY_MS, qualityMode],
));

export const setRoomViewerLimit = async ({ id, tokenHash, viewerLimit, now = Date.now() }: {
  id: string;
  tokenHash: string;
  viewerLimit: number;
  now?: number;
}): Promise<string> => String(await getRedis().eval(
  SET_VIEWER_LIMIT_SCRIPT,
  [roomKey(id)],
  [tokenHash, now, viewerLimit, SCREENSHARE_HOST_RECOVERY_MS],
));

export const heartbeatViewer = async ({
  id,
  peerId,
  tokenHash,
  now,
  state,
}: {
  id: string;
  peerId: string;
  tokenHash: string;
  now: number;
  state: PeerState;
}): Promise<string> => String(await getRedis().eval(
  VIEWER_HEARTBEAT_SCRIPT,
  [roomKey(id), viewersKey(id), viewerKey(id, peerId)],
  [peerId, tokenHash, state, now, SCREENSHARE_VIEWER_LEASE_SECONDS],
));

export const sendSignal = async ({
  id,
  role,
  peerId,
  tokenHash,
  target,
  signal,
  now,
}: {
  id: string;
  role: 'host' | 'viewer';
  peerId: string;
  tokenHash: string;
  target: string;
  signal: UnsequencedSignal;
  now: number;
}): Promise<number | string> => {
  const queueKey = target === 'host' ? hostSignalsKey(id) : peerSignalsKey(id, target);
  const ttl = await getRedis().ttl(roomKey(id));
  if (ttl < 1) return 'missing';
  const result = await getRedis().eval(
    SEND_SIGNAL_SCRIPT,
    [roomKey(id), viewersKey(id), viewerKey(id, peerId), signalSequenceKey(id), queueKey],
    [role, peerId, target, tokenHash, now, JSON.stringify(signal), SCREENSHARE_SIGNAL_LIMIT, Math.min(SCREENSHARE_SIGNAL_TTL_SECONDS, ttl)],
  );
  const numeric = Number(result);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : String(result);
};

export const pollSignals = async ({
  id,
  role,
  peerId,
  tokenHash,
  after,
  now,
}: {
  id: string;
  role: 'host' | 'viewer';
  peerId: string;
  tokenHash: string;
  after: number;
  now: number;
}): Promise<{ status: string; roomState?: string; messages: ScreenShareSignal[]; oldestSequence?: number | null; viewerLimit?: number }> => {
  const queue = role === 'host' ? hostSignalsKey(id) : peerSignalsKey(id, peerId);
  const result = await getRedis().eval(
    POLL_SIGNALS_SCRIPT,
    [roomKey(id), viewerKey(id, peerId), viewersKey(id), queue],
    [role, peerId, tokenHash, after, now, SCREENSHARE_HOST_RECOVERY_MS],
  );
  return parseScriptJson(result);
};

export type PublicRoomInfo = {
  status: 'ok' | 'missing';
  state?: string;
  viewerLimit?: number;
  viewerCount?: number;
  createdAt?: number;
  expiresAt?: number;
  qualityMode?: QualityMode;
  audioAvailable?: boolean;
};

export const getPublicRoomInfo = async (id: string, now: number): Promise<PublicRoomInfo> => {
  const result = await getRedis().eval(
    GET_PUBLIC_ROOM_SCRIPT,
    [roomKey(id), viewersKey(id)],
    [now, `screenshare:{${id}}:peer:`, SCREENSHARE_VIEWER_LEASE_SECONDS, `screenshare:{${id}}:signals:`, SCREENSHARE_HOST_RECOVERY_MS],
  );
  return parseScriptJson(result);
};

export type HostPeerSummary = Pick<ScreenSharePeerRecord, 'id' | 'joinedAt' | 'lastHeartbeat' | 'state'>;

export const getHostPeers = async (
  id: string,
  tokenHash: string,
  now: number,
): Promise<{ status: string; peers: HostPeerSummary[] }> => {
  const result = await getRedis().eval(
    GET_PEERS_SCRIPT,
    [roomKey(id), viewersKey(id)],
    [tokenHash, now, `screenshare:{${id}}:peer:`, SCREENSHARE_VIEWER_LEASE_SECONDS, `screenshare:{${id}}:signals:`],
  );
  return parseScriptJson(result);
};

export const leaveViewer = async ({
  id,
  peerId,
  tokenHash,
  now,
}: {
  id: string;
  peerId: string;
  tokenHash: string;
  now: number;
}): Promise<string> => String(await getRedis().eval(
  LEAVE_VIEWER_SCRIPT,
  [roomKey(id), viewersKey(id), viewerKey(id, peerId), signalSequenceKey(id), hostSignalsKey(id)],
  [peerId, tokenHash, now, SCREENSHARE_SIGNAL_LIMIT, SCREENSHARE_SIGNAL_TTL_SECONDS],
));

export const closeRoom = async ({ id, tokenHash, now }: { id: string; tokenHash: string; now: number }): Promise<string> =>
  String(await getRedis().eval(
    CLOSE_ROOM_SCRIPT,
    [roomKey(id), viewersKey(id), signalSequenceKey(id)],
    [tokenHash, now, `screenshare:{${id}}:signals:`, SCREENSHARE_SIGNAL_LIMIT, 120, `screenshare:{${id}}:peer:`],
  ));
