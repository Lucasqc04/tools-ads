import { Redis } from '@upstash/redis';
import {
  SCREENSHARE_HOST_RECOVERY_MS,
  SCREENSHARE_KICK_VOTE_SECONDS,
  SCREENSHARE_KICK_VOTE_TTL_SECONDS,
  SCREENSHARE_MAX_VIEWERS_DEFAULT,
  SCREENSHARE_ROOM_TTL_SECONDS,
  SCREENSHARE_TRANSFER_TTL_SECONDS,
  SCREENSHARE_SIGNAL_LIMIT,
  SCREENSHARE_SIGNAL_TTL_SECONDS,
  SCREENSHARE_VIEWER_LEASE_SECONDS,
  type PeerState,
  type KickVoteView,
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
const pendingKey = (id: string) => `screenshare:{${id}}:pending`;
const viewerKey = (id: string, peerId: string) => `screenshare:{${id}}:peer:${peerId}`;
const signalSequenceKey = (id: string) => `screenshare:{${id}}:signal-sequence`;
const transferKey = (id: string) => `screenshare:{${id}}:transfer`;
const kickVoteKey = (id: string) => `screenshare:{${id}}:kick-vote`;
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

const ELECT_HOST_FUNCTION = `
local function bestNextHost(peersKey, peerPrefix, excludePeerId, now, leaseSeconds)
  local ids = redis.call('SMEMBERS', peersKey)
  local best = nil
  local bestScore = -1000000000
  for _, peerId in ipairs(ids) do
    local key = peerPrefix .. peerId
    local value = redis.call('GET', key)
    if not value then
      redis.call('SREM', peersKey, peerId)
    else
      local peer = cjson.decode(value)
      if now - tonumber(peer.lastHeartbeat) > (leaseSeconds * 1000) then
        redis.call('SREM', peersKey, peerId)
        redis.call('DEL', key)
      elseif peerId ~= excludePeerId and peer.admission == 'approved' then
        local score = peer.state == 'connected' and 300000 or 0
        if peer.networkType == 'ethernet' then score = score + 1100000
        elseif peer.networkType == 'wifi' then score = score + 1000000
        elseif peer.networkType == 'cellular' then score = score - 100000
        end
        score = score + math.min(tonumber(peer.downlinkMbps) or 0, 500) * 1000
        score = score - math.min(tonumber(peer.rttMs) or 1000, 1000) * 100
        if score > bestScore or (score == bestScore and (not best or peerId < best.id)) then
          best = peer
          bestScore = score
        end
      end
    end
  end
  return best
end
`;

const JOIN_ROOM_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
local room = cjson.decode(roomValue)
local now = tonumber(ARGV[1])
if room.status ~= 'active' then return 'closed' end
if tonumber(room.hardExpiresAt) <= now then return 'expired' end
local existingValue = redis.call('GET', KEYS[3])
if existingValue then
  local existing = cjson.decode(existingValue)
  if existing.tokenHash ~= ARGV[4] then return 'unauthorized' end
  if existing.admission == 'denied' then return 'denied' end
  existing.lastHeartbeat = now
  redis.call('SET', KEYS[3], cjson.encode(existing), 'EX', tonumber(ARGV[3]))
  if existing.admission == 'pending' then
    redis.call('SADD', KEYS[4], ARGV[5])
    redis.call('EXPIRE', KEYS[4], tonumber(ARGV[3]))
    return 'pending'
  end
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
local pendingPeers = redis.call('SMEMBERS', KEYS[4])
for _, pendingPeerId in ipairs(pendingPeers) do
  local pendingPeerKey = ARGV[7] .. pendingPeerId
  local pendingPeerValue = redis.call('GET', pendingPeerKey)
  if not pendingPeerValue then
    redis.call('SREM', KEYS[4], pendingPeerId)
  else
    local pendingPeer = cjson.decode(pendingPeerValue)
    if now - tonumber(pendingPeer.lastHeartbeat) > (tonumber(ARGV[3]) * 1000) then
      redis.call('SREM', KEYS[4], pendingPeerId)
      redis.call('DEL', pendingPeerKey)
    end
  end
end
local peer = cjson.decode(ARGV[6])
if room.access == 'private' then
  if redis.call('SCARD', KEYS[4]) >= math.min(20, math.max(5, tonumber(room.viewerLimit) * 3)) then return 'pending_full' end
  peer.admission = 'pending'
  redis.call('SET', KEYS[3], cjson.encode(peer), 'EX', tonumber(ARGV[3]), 'NX')
  if redis.call('EXISTS', KEYS[3]) == 0 then return 'conflict' end
  redis.call('SADD', KEYS[4], ARGV[5])
  redis.call('EXPIRE', KEYS[4], tonumber(ARGV[3]))
  return 'pending'
end
if redis.call('SCARD', KEYS[2]) >= tonumber(room.viewerLimit) then return 'full' end
peer.admission = 'approved'
redis.call('SET', KEYS[3], cjson.encode(peer), 'EX', tonumber(ARGV[3]), 'NX')
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
if room.status ~= 'active' or tonumber(room.hardExpiresAt) <= now then return 'expired' end
room.lastHostHeartbeat = now
room.hardExpiresAt = now + (tonumber(ARGV[8]) * 1000)
if room.screenSharerId == 'host' then room.audioAvailable = ARGV[3] == '1' end
if not room.screenSharerId or room.screenSharerId == cjson.null then room.audioAvailable = false end
room.qualityMode = ARGV[5]
room.hostCameraOn = ARGV[6] == '1'
room.hostMicrophoneOn = ARGV[7] == '1'
local ttl = tonumber(ARGV[8])
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
if room.status ~= 'active' or tonumber(room.hardExpiresAt) <= now then return 'closed' end
local requested = tonumber(ARGV[3])
local maximum = tonumber(room.maxViewerLimit or room.viewerLimit)
if requested < 1 or requested > maximum then return 'invalid' end
room.viewerLimit = requested
local ttl = redis.call('TTL', KEYS[1])
if ttl < 1 then ttl = math.max(1, math.floor((tonumber(room.hardExpiresAt) - now) / 1000)) end
redis.call('SET', KEYS[1], cjson.encode(room), 'EX', ttl)
return 'ok'
`;

const VIEWER_HEARTBEAT_SCRIPT = `${ELECT_HOST_FUNCTION}
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
local room = cjson.decode(roomValue)
if room.status ~= 'active' then return 'closed' end
local peerValue = redis.call('GET', KEYS[3])
if not peerValue then return 'missing_peer' end
local peer = cjson.decode(peerValue)
if peer.tokenHash ~= ARGV[2] then return 'unauthorized' end
peer.lastHeartbeat = tonumber(ARGV[4])
peer.state = ARGV[3]
peer.cameraOn = ARGV[6] == '1'
peer.microphoneOn = ARGV[7] == '1'
peer.networkType = ARGV[8]
peer.downlinkMbps = tonumber(ARGV[9])
peer.rttMs = tonumber(ARGV[10])
redis.call('SET', KEYS[3], cjson.encode(peer), 'EX', tonumber(ARGV[5]))
if peer.admission == 'pending' and redis.call('SISMEMBER', KEYS[4], ARGV[1]) == 1 then
  redis.call('EXPIRE', KEYS[4], tonumber(ARGV[5]))
  return 'pending'
end
if peer.admission ~= 'approved' or redis.call('SISMEMBER', KEYS[2], ARGV[1]) == 0 then return 'missing_peer' end
redis.call('EXPIRE', KEYS[2], tonumber(ARGV[5]))
local now = tonumber(ARGV[4])
if (room.hostPeerId or 'host') == ARGV[1] then
  room.lastHostHeartbeat = now
  room.hardExpiresAt = now + (tonumber(ARGV[13]) * 1000)
  room.hostName = peer.displayName
  room.hostCameraOn = peer.cameraOn == true
  room.hostMicrophoneOn = peer.microphoneOn == true
  local ownerTtl = tonumber(ARGV[13])
  redis.call('SET', KEYS[1], cjson.encode(room), 'EX', ownerTtl)
  redis.call('EXPIRE', KEYS[2], ownerTtl)
  redis.call('EXPIRE', KEYS[4], ownerTtl)
end
if now - tonumber(room.lastHostHeartbeat) > tonumber(ARGV[11]) then
  local candidate = bestNextHost(KEYS[2], ARGV[12], room.hostPeerId or 'host', now, tonumber(ARGV[5]))
  if not candidate then
    room.status = 'closed'
    room.closedAt = now
    redis.call('SET', KEYS[1], cjson.encode(room), 'EX', 120)
    return 'closed'
  end
  local previousHostId = room.hostPeerId or 'host'
  room.hostPeerId = candidate.id
  room.hostTokenHash = candidate.tokenHash
  room.hostName = candidate.displayName
  room.hostCameraOn = candidate.cameraOn == true
  room.hostMicrophoneOn = candidate.microphoneOn == true
  room.lastHostHeartbeat = now
  room.hardExpiresAt = now + (tonumber(ARGV[13]) * 1000)
  if room.screenSharerId == previousHostId then
    room.screenSharerId = cjson.null
    room.audioAvailable = false
  end
  local ttl = tonumber(ARGV[13])
  redis.call('SET', KEYS[1], cjson.encode(room), 'EX', ttl)
  redis.call('EXPIRE', KEYS[2], ttl)
  redis.call('EXPIRE', KEYS[4], ttl)
  return candidate.id == ARGV[1] and 'promoted' or 'ok'
end
return 'ok'
`;

/**
 * The host asks one approved viewer to take over. Only one request can be open
 * at a time: a new request replaces the previous one.
 */
const TRANSFER_REQUEST_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
local room = cjson.decode(roomValue)
if room.hostTokenHash ~= ARGV[1] then return 'unauthorized' end
if room.status ~= 'active' then return 'closed' end
if (room.hostPeerId or 'host') == ARGV[2] then return 'self' end
if redis.call('SISMEMBER', KEYS[2], ARGV[2]) == 0 then return 'not_member' end
local peerValue = redis.call('GET', KEYS[3])
if not peerValue then return 'not_member' end
if cjson.decode(peerValue).admission ~= 'approved' then return 'not_member' end
redis.call('SET', KEYS[4], ARGV[2], 'EX', tonumber(ARGV[4]))
return 'ok'
`;

const TRANSFER_CANCEL_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
if cjson.decode(roomValue).hostTokenHash ~= ARGV[1] then return 'unauthorized' end
redis.call('DEL', KEYS[2])
return 'ok'
`;

/**
 * The invited viewer answers. Accepting makes them the room's host: the room's
 * host token becomes their own, so the previous host's next heartbeat fails and
 * that device rejoins as a viewer.
 */
const TRANSFER_RESPOND_SCRIPT = `
local transferValue = redis.call('GET', KEYS[2])
if not transferValue then return 'expired' end
if transferValue ~= ARGV[2] then return 'unauthorized' end
local peerValue = redis.call('GET', KEYS[3])
if not peerValue then return 'unauthorized' end
local peer = cjson.decode(peerValue)
if peer.tokenHash ~= ARGV[1] or peer.admission ~= 'approved' then return 'unauthorized' end
redis.call('DEL', KEYS[2])
if ARGV[3] ~= '1' then return 'declined' end
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
local room = cjson.decode(roomValue)
if room.status ~= 'active' then return 'closed' end
local now = tonumber(ARGV[4])
local previousHostId = room.hostPeerId or 'host'
room.hostPeerId = ARGV[2]
room.hostTokenHash = peer.tokenHash
room.hostName = peer.displayName
room.hostCameraOn = peer.cameraOn == true
room.hostMicrophoneOn = peer.microphoneOn == true
room.lastHostHeartbeat = now
room.hardExpiresAt = now + (tonumber(ARGV[5]) * 1000)
if room.screenSharerId == previousHostId then
  room.screenSharerId = cjson.null
  room.audioAvailable = false
end
redis.call('SET', KEYS[1], cjson.encode(room), 'EX', tonumber(ARGV[5]))
redis.call('EXPIRE', KEYS[4], tonumber(ARGV[5]))
return 'transferred'
`;

const HANDOFF_HOST_SCRIPT = `${ELECT_HOST_FUNCTION}
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return cjson.encode({status='missing'}) end
local room = cjson.decode(roomValue)
if room.hostTokenHash ~= ARGV[1] then return cjson.encode({status='unauthorized'}) end
local now = tonumber(ARGV[2])
if room.status ~= 'active' or tonumber(room.hardExpiresAt) <= now then return cjson.encode({status='closed'}) end
local previousHostId = room.hostPeerId or 'host'
local candidate = bestNextHost(KEYS[2], ARGV[3], previousHostId, now, tonumber(ARGV[4]))
if not candidate then
  room.status = 'closed'
  room.closedAt = now
  redis.call('SET', KEYS[1], cjson.encode(room), 'EX', 120)
  return cjson.encode({status='closed'})
end
room.hostPeerId = candidate.id
room.hostTokenHash = candidate.tokenHash
room.hostName = candidate.displayName
room.hostCameraOn = candidate.cameraOn == true
room.hostMicrophoneOn = candidate.microphoneOn == true
room.lastHostHeartbeat = now
room.hardExpiresAt = now + (tonumber(ARGV[5]) * 1000)
if room.screenSharerId == previousHostId then
  room.screenSharerId = cjson.null
  room.audioAvailable = false
end
local ttl = tonumber(ARGV[5])
redis.call('SET', KEYS[1], cjson.encode(room), 'EX', ttl)
redis.call('EXPIRE', KEYS[2], ttl)
redis.call('EXPIRE', KEYS[3], ttl)
return cjson.encode({status='transferred', hostPeerId=candidate.id, hostName=candidate.displayName})
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
  if not redis.call('GET', KEYS[6]) then return 'invalid_target' end
else
  if redis.call('SISMEMBER', KEYS[2], peerId) == 0 then return 'unauthorized' end
  local peerValue = redis.call('GET', KEYS[3])
  if not peerValue or cjson.decode(peerValue).tokenHash ~= ARGV[4] then return 'unauthorized' end
  if target ~= 'host' then
    if target == peerId or redis.call('SISMEMBER', KEYS[2], target) == 0 or not redis.call('GET', KEYS[6]) then return 'invalid_target' end
  end
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
if state == 'active' and now - tonumber(room.lastHostHeartbeat) > 120000 then state = 'recovering' end
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
if state == 'active' and now - tonumber(room.lastHostHeartbeat) > tonumber(ARGV[5]) then state = 'recovering' end
return cjson.encode({
  status='ok',
  state=state,
  viewerLimit=room.viewerLimit,
  viewerCount=count,
  createdAt=room.createdAt,
  expiresAt=room.hardExpiresAt,
  qualityMode=room.qualityMode,
  audioAvailable=room.audioAvailable,
  hostName=room.hostName,
  hostPeerId=room.hostPeerId or 'host',
  access=room.access,
  hostCameraOn=room.hostCameraOn,
  hostMicrophoneOn=room.hostMicrophoneOn,
  screenSharerId=room.screenSharerId
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
local pending = {}
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
      if peerId ~= (room.hostPeerId or 'host') then
        table.insert(peers, {id=peer.id, displayName=peer.displayName, joinedAt=peer.joinedAt, lastHeartbeat=peer.lastHeartbeat, state=peer.state, cameraOn=peer.cameraOn, microphoneOn=peer.microphoneOn})
      end
    end
  end
end
local requests = redis.call('SMEMBERS', KEYS[3])
for _, peerId in ipairs(requests) do
  local peerKey = ARGV[3] .. peerId
  local peerValue = redis.call('GET', peerKey)
  if not peerValue then
    redis.call('SREM', KEYS[3], peerId)
  else
    local peer = cjson.decode(peerValue)
    if now - tonumber(peer.lastHeartbeat) > (tonumber(ARGV[4]) * 1000) then
      redis.call('SREM', KEYS[3], peerId)
      redis.call('DEL', peerKey)
    else
      table.insert(pending, {id=peer.id, displayName=peer.displayName, joinedAt=peer.joinedAt, lastHeartbeat=peer.lastHeartbeat})
    end
  end
end
return cjson.encode({status='ok', host={id=room.hostPeerId or 'host', displayName=room.hostName, cameraOn=room.hostCameraOn, microphoneOn=room.hostMicrophoneOn}, peers=peers, pending=pending, hostPeerId=room.hostPeerId or 'host', screenSharerId=room.screenSharerId, audioAvailable=room.audioAvailable})
`;

const GET_PARTICIPANTS_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return cjson.encode({status='missing'}) end
local room = cjson.decode(roomValue)
local peerValue = redis.call('GET', KEYS[3])
if not peerValue or cjson.decode(peerValue).tokenHash ~= ARGV[1] or not redis.call('SISMEMBER', KEYS[2], ARGV[2]) then
  return cjson.encode({status='unauthorized'})
end
local now = tonumber(ARGV[3])
local peers = {}
local ids = redis.call('SMEMBERS', KEYS[2])
for _, peerId in ipairs(ids) do
  local peerKey = ARGV[4] .. peerId
  local value = redis.call('GET', peerKey)
  if not value then
    redis.call('SREM', KEYS[2], peerId)
  else
    local peer = cjson.decode(value)
    if now - tonumber(peer.lastHeartbeat) > (tonumber(ARGV[5]) * 1000) then
      redis.call('SREM', KEYS[2], peerId)
      redis.call('DEL', peerKey)
    elseif peerId ~= (room.hostPeerId or 'host') then
      table.insert(peers, {id=peer.id, displayName=peer.displayName, state=peer.state, cameraOn=peer.cameraOn, microphoneOn=peer.microphoneOn})
    end
  end
end
return cjson.encode({status='ok', host={id=room.hostPeerId or 'host', displayName=room.hostName, cameraOn=room.hostCameraOn, microphoneOn=room.hostMicrophoneOn}, peers=peers, hostPeerId=room.hostPeerId or 'host', screenSharerId=room.screenSharerId, access=room.access, audioAvailable=room.audioAvailable})
`;

const START_KICK_VOTE_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
local room = cjson.decode(roomValue)
local now = tonumber(ARGV[2])
if room.hostTokenHash ~= ARGV[1] then return 'unauthorized' end
if room.status ~= 'active' or tonumber(room.hardExpiresAt) <= now then return 'closed' end
local hostId = room.hostPeerId or 'host'
if ARGV[3] ~= hostId then return 'unauthorized' end
local targetId = ARGV[4]
if targetId == hostId or redis.call('SISMEMBER', KEYS[2], targetId) == 0 then return 'target_missing' end
local targetKey = ARGV[6] .. targetId
local targetValue = redis.call('GET', targetKey)
if not targetValue then return 'target_missing' end
local target = cjson.decode(targetValue)
if target.admission ~= 'approved' or now - tonumber(target.lastHeartbeat) > (tonumber(ARGV[8]) * 1000) then return 'target_missing' end
local currentValue = redis.call('GET', KEYS[3])
if currentValue then
  local current = cjson.decode(currentValue)
  if current.status == 'active' and tonumber(current.expiresAt) > now then
    if current.initiatorPeerId == hostId then
      return current.id == ARGV[5] and 'existing' or 'vote_active'
    end
  end
end
local eligible = {}
local totalWeight = 0
local hostIncluded = false
local viewerIds = redis.call('SMEMBERS', KEYS[2])
for _, voterId in ipairs(viewerIds) do
  if voterId ~= targetId then
    local voterKey = ARGV[6] .. voterId
    local voterValue = redis.call('GET', voterKey)
    if not voterValue then
      redis.call('SREM', KEYS[2], voterId)
    else
      local voter = cjson.decode(voterValue)
      if voter.admission ~= 'approved' or now - tonumber(voter.lastHeartbeat) > (tonumber(ARGV[8]) * 1000) then
        redis.call('SREM', KEYS[2], voterId)
      else
        local weight = voterId == hostId and 2 or 1
        table.insert(eligible, {id=voterId, weight=weight})
        totalWeight = totalWeight + weight
        if voterId == hostId then hostIncluded = true end
      end
    end
  end
end
if hostId == 'host' then
  table.insert(eligible, {id='host', weight=2})
  totalWeight = totalWeight + 2
  hostIncluded = true
end
if not hostIncluded then return 'host_missing' end
if #eligible < 2 then return 'not_enough_voters' end
local vote = {
  id=ARGV[5], targetPeerId=targetId, targetName=target.displayName,
  initiatorPeerId=hostId, startedAt=now,
  expiresAt=now + (tonumber(ARGV[7]) * 1000), status='active',
  totalWeight=totalWeight, eligible=eligible, yes={}, no={}
}
redis.call('SET', KEYS[3], cjson.encode(vote), 'EX', tonumber(ARGV[9]))
return 'started'
`;

const CAST_KICK_VOTE_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
local room = cjson.decode(roomValue)
local now = tonumber(ARGV[5])
if room.status ~= 'active' or tonumber(room.hardExpiresAt) <= now then return 'closed' end
local hostId = room.hostPeerId or 'host'
local actorId = ARGV[1]
if actorId == 'host' then
  if hostId ~= 'host' or room.hostTokenHash ~= ARGV[2] then return 'unauthorized' end
else
  if redis.call('SISMEMBER', KEYS[2], actorId) == 0 then return 'unauthorized' end
  local actorValue = redis.call('GET', ARGV[6] .. actorId)
  if not actorValue then return 'unauthorized' end
  local actor = cjson.decode(actorValue)
  if actor.tokenHash ~= ARGV[2] or actor.admission ~= 'approved' or now - tonumber(actor.lastHeartbeat) > (tonumber(ARGV[10]) * 1000) then return 'unauthorized' end
  if actorId == hostId and room.hostTokenHash ~= ARGV[2] then return 'unauthorized' end
end
local voteValue = redis.call('GET', KEYS[3])
if not voteValue then return 'vote_missing' end
local vote = cjson.decode(voteValue)
if vote.id ~= ARGV[3] then return 'vote_stale' end
if vote.status ~= 'active' then return 'vote_resolved' end
if vote.initiatorPeerId ~= hostId then
  vote.status = 'cancelled'
  redis.call('SET', KEYS[3], cjson.encode(vote), 'EX', tonumber(ARGV[11]))
  return 'vote_cancelled'
end
if tonumber(vote.expiresAt) <= now then
  vote.status = 'expired'
  redis.call('SET', KEYS[3], cjson.encode(vote), 'EX', tonumber(ARGV[11]))
  return 'vote_expired'
end
local weight = nil
for _, voter in ipairs(vote.eligible) do
  if voter.id == actorId then weight = tonumber(voter.weight); break end
end
if not weight then return 'not_eligible' end
for _, voterId in ipairs(vote.yes) do if voterId == actorId then return 'already_voted' end end
for _, voterId in ipairs(vote.no) do if voterId == actorId then return 'already_voted' end end
if ARGV[4] == 'yes' then table.insert(vote.yes, actorId) else table.insert(vote.no, actorId) end
local yesWeight = 0
local noWeight = 0
for _, voter in ipairs(vote.eligible) do
  for _, voterId in ipairs(vote.yes) do if voterId == voter.id then yesWeight = yesWeight + tonumber(voter.weight) end end
  for _, voterId in ipairs(vote.no) do if voterId == voter.id then noWeight = noWeight + tonumber(voter.weight) end end
end
local threshold = math.floor(tonumber(vote.totalWeight) / 2) + 1
if yesWeight >= threshold then
  vote.status = 'passed'
elseif noWeight >= threshold then
  vote.status = 'rejected'
elseif (#vote.yes + #vote.no) >= #vote.eligible then
  vote.status = 'rejected'
end
if vote.status == 'passed' then
  local targetId = vote.targetPeerId
  local targetKey = ARGV[6] .. targetId
  local targetValue = redis.call('GET', targetKey)
  if not targetValue or redis.call('SISMEMBER', KEYS[2], targetId) == 0 then
    vote.status = 'cancelled'
  else
    local target = cjson.decode(targetValue)
    if target.admission ~= 'approved' or now - tonumber(target.lastHeartbeat) > (tonumber(ARGV[10]) * 1000) then
      vote.status = 'cancelled'
    else
      target.admission = 'denied'
      target.lastHeartbeat = now
      redis.call('SET', targetKey, cjson.encode(target), 'EX', 120)
      redis.call('SREM', KEYS[2], targetId)
      redis.call('SREM', KEYS[4], targetId)
      if room.screenSharerId == targetId then
        room.screenSharerId = cjson.null
        room.audioAvailable = false
        redis.call('SET', KEYS[1], cjson.encode(room), 'KEEPTTL')
      end
      local sequence = redis.call('INCR', KEYS[5])
      local message = cjson.encode({type='bye', fromPeerId=targetId, sequence=sequence, createdAt=now})
      redis.call('RPUSH', KEYS[6], message)
      redis.call('LTRIM', KEYS[6], -tonumber(ARGV[8]), -1)
      redis.call('EXPIRE', KEYS[6], tonumber(ARGV[9]))
      local remainingPeers = redis.call('SMEMBERS', KEYS[2])
      for _, peerId in ipairs(remainingPeers) do
        local peerSequence = redis.call('INCR', KEYS[5])
        local peerMessage = cjson.encode({type='bye', fromPeerId=targetId, sequence=peerSequence, createdAt=now})
        local peerQueue = ARGV[7] .. peerId
        redis.call('RPUSH', peerQueue, peerMessage)
        redis.call('LTRIM', peerQueue, -tonumber(ARGV[8]), -1)
        redis.call('EXPIRE', peerQueue, tonumber(ARGV[9]))
      end
    end
  end
end
redis.call('SET', KEYS[3], cjson.encode(vote), 'EX', tonumber(ARGV[11]))
return vote.status
`;

const GET_KICK_VOTE_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return cjson.encode({status='missing'}) end
local room = cjson.decode(roomValue)
local role = ARGV[1]
local actorId = ARGV[2]
if role == 'host' then
  if actorId ~= 'host' or (room.hostPeerId or 'host') ~= 'host' or room.hostTokenHash ~= ARGV[3] then return cjson.encode({status='unauthorized'}) end
else
  local actorValue = redis.call('GET', KEYS[3])
  if not actorValue or cjson.decode(actorValue).tokenHash ~= ARGV[3] or not redis.call('SISMEMBER', KEYS[2], actorId) then return cjson.encode({status='unauthorized'}) end
end
local voteValue = redis.call('GET', KEYS[4])
if not voteValue then return cjson.encode({status='ok', vote=cjson.null}) end
local vote = cjson.decode(voteValue)
local now = tonumber(ARGV[4])
local hostId = room.hostPeerId or 'host'
if vote.status == 'active' and vote.initiatorPeerId ~= hostId then vote.status = 'cancelled' end
if vote.status == 'active' and tonumber(vote.expiresAt) <= now then vote.status = 'expired' end
if vote.status ~= 'active' then redis.call('SET', KEYS[4], cjson.encode(vote), 'EX', tonumber(ARGV[6])) end
local yesWeight = 0
local noWeight = 0
local ownVote = cjson.null
local canVote = false
for _, voter in ipairs(vote.eligible) do
  if voter.id == actorId then canVote = true end
  for _, voterId in ipairs(vote.yes) do
    if voterId == voter.id then
      yesWeight = yesWeight + tonumber(voter.weight)
      if voterId == actorId then ownVote = 'yes' end
    end
  end
  for _, voterId in ipairs(vote.no) do
    if voterId == voter.id then
      noWeight = noWeight + tonumber(voter.weight)
      if voterId == actorId then ownVote = 'no' end
    end
  end
end
return cjson.encode({status='ok', vote={
  id=vote.id, targetPeerId=vote.targetPeerId, targetName=vote.targetName,
  startedAt=vote.startedAt, expiresAt=vote.expiresAt, status=vote.status,
  yesWeight=yesWeight, noWeight=noWeight, totalWeight=vote.totalWeight, ownVote=ownVote, canVote=canVote
}})
`;

const SET_SCREEN_SHARER_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
local room = cjson.decode(roomValue)
local actor = ARGV[1]
if room.status ~= 'active' or tonumber(room.hardExpiresAt) <= tonumber(ARGV[3]) then return 'closed' end
if actor == 'host' then
  if room.hostTokenHash ~= ARGV[2] then return 'unauthorized' end
else
  if not redis.call('SISMEMBER', KEYS[2], actor) then return 'unauthorized' end
  local peerValue = redis.call('GET', KEYS[3])
  if not peerValue or cjson.decode(peerValue).tokenHash ~= ARGV[2] then return 'unauthorized' end
end
if ARGV[4] == 'start' then
  if room.screenSharerId and room.screenSharerId ~= cjson.null and room.screenSharerId ~= actor then return 'busy' end
  room.screenSharerId = actor
  room.audioAvailable = ARGV[5] == '1'
else
  if room.screenSharerId == actor then room.screenSharerId = cjson.null; room.audioAvailable = false end
end
local ttl = redis.call('TTL', KEYS[1])
if ttl < 1 then ttl = math.max(1, math.floor((tonumber(room.hardExpiresAt) - tonumber(ARGV[3])) / 1000)) end
redis.call('SET', KEYS[1], cjson.encode(room), 'EX', ttl)
if not room.screenSharerId or room.screenSharerId == cjson.null then return 'none' end
return room.screenSharerId
`;

const VIEWER_ADMISSION_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return cjson.encode({status='missing'}) end
local room = cjson.decode(roomValue)
local peerValue = redis.call('GET', KEYS[2])
if not peerValue then return cjson.encode({status='missing'}) end
local peer = cjson.decode(peerValue)
if peer.tokenHash ~= ARGV[1] or peer.id ~= ARGV[2] then return cjson.encode({status='missing'}) end
local roomState = room.status
local now = tonumber(ARGV[3])
if roomState == 'active' and tonumber(room.hardExpiresAt) <= now then roomState = 'expired' end
if roomState == 'active' and now - tonumber(room.lastHostHeartbeat) > 120000 then roomState = 'recovering' end
return cjson.encode({status='ok', admission=peer.admission, roomState=roomState})
`;

const APPROVE_VIEWER_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
local room = cjson.decode(roomValue)
if room.hostTokenHash ~= ARGV[1] then return 'unauthorized' end
local now = tonumber(ARGV[3])
if room.status ~= 'active' or tonumber(room.hardExpiresAt) <= now then return 'closed' end
if redis.call('SISMEMBER', KEYS[4], ARGV[2]) == 0 then return 'missing' end
local peerValue = redis.call('GET', KEYS[3])
if not peerValue then redis.call('SREM', KEYS[4], ARGV[2]); return 'missing' end
local peer = cjson.decode(peerValue)
if peer.admission ~= 'pending' then return 'conflict' end
local activePeers = redis.call('SMEMBERS', KEYS[2])
for _, activePeerId in ipairs(activePeers) do
  local activePeerKey = ARGV[4] .. activePeerId
  local activePeerValue = redis.call('GET', activePeerKey)
  if not activePeerValue then
    redis.call('SREM', KEYS[2], activePeerId)
  else
    local activePeer = cjson.decode(activePeerValue)
    if now - tonumber(activePeer.lastHeartbeat) > (tonumber(ARGV[6]) * 1000) then
      redis.call('SREM', KEYS[2], activePeerId)
      redis.call('DEL', activePeerKey)
    end
  end
end
if redis.call('SCARD', KEYS[2]) >= tonumber(room.viewerLimit) then return 'full' end
peer.admission = 'approved'
peer.lastHeartbeat = now
redis.call('SREM', KEYS[4], ARGV[2])
redis.call('SADD', KEYS[2], ARGV[2])
redis.call('SET', KEYS[3], cjson.encode(peer), 'EX', tonumber(ARGV[6]))
redis.call('EXPIRE', KEYS[2], tonumber(ARGV[6]))
return 'approved'
`;

const REJECT_VIEWER_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
if not roomValue then return 'missing' end
local room = cjson.decode(roomValue)
if room.hostTokenHash ~= ARGV[1] then return 'unauthorized' end
if redis.call('SISMEMBER', KEYS[3], ARGV[2]) == 0 then return 'missing' end
local peerValue = redis.call('GET', KEYS[2])
if not peerValue then redis.call('SREM', KEYS[3], ARGV[2]); return 'missing' end
local peer = cjson.decode(peerValue)
peer.admission = 'denied'
peer.lastHeartbeat = tonumber(ARGV[3])
redis.call('SET', KEYS[2], cjson.encode(peer), 'EX', 120)
redis.call('SREM', KEYS[3], ARGV[2])
return 'rejected'
`;

const LEAVE_VIEWER_SCRIPT = `
local roomValue = redis.call('GET', KEYS[1])
local peerValue = redis.call('GET', KEYS[3])
if not roomValue or not peerValue or (not redis.call('SISMEMBER', KEYS[2], ARGV[1]) and not redis.call('SISMEMBER', KEYS[6], ARGV[1])) then return 'missing' end
local peer = cjson.decode(peerValue)
if peer.tokenHash ~= ARGV[2] then return 'unauthorized' end
local room = cjson.decode(roomValue)
if room.screenSharerId == ARGV[1] then
  room.screenSharerId = cjson.null
  room.audioAvailable = false
  redis.call('SET', KEYS[1], cjson.encode(room), 'KEEPTTL')
end
redis.call('SREM', KEYS[2], ARGV[1])
redis.call('SREM', KEYS[6], ARGV[1])
redis.call('DEL', KEYS[3])
if room.status == 'active' then
  local sequence = redis.call('INCR', KEYS[4])
  local message = cjson.encode({type='bye', fromPeerId=ARGV[1], sequence=sequence, createdAt=tonumber(ARGV[3])})
  redis.call('RPUSH', KEYS[5], message)
  redis.call('LTRIM', KEYS[5], -tonumber(ARGV[4]), -1)
  redis.call('EXPIRE', KEYS[5], tonumber(ARGV[5]))
  local peers = redis.call('SMEMBERS', KEYS[2])
  for _, targetPeerId in ipairs(peers) do
    local peerSequence = redis.call('INCR', KEYS[4])
    local peerMessage = cjson.encode({type='bye', fromPeerId=ARGV[1], sequence=peerSequence, createdAt=tonumber(ARGV[3])})
    local peerQueue = ARGV[6] .. targetPeerId
    redis.call('RPUSH', peerQueue, peerMessage)
    redis.call('LTRIM', peerQueue, -tonumber(ARGV[4]), -1)
    redis.call('EXPIRE', peerQueue, tonumber(ARGV[5]))
  end
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
  const ttl = Math.max(1, Math.ceil((record.hardExpiresAt - Date.now()) / 1000));
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
  displayName,
  cameraOn = false,
  microphoneOn = false,
  now,
}: {
  id: string;
  peerId: string;
  tokenHash: string;
  displayName: string;
  cameraOn?: boolean;
  microphoneOn?: boolean;
  now: number;
}): Promise<'joined' | 'existing' | 'pending' | 'pending_full' | 'denied' | 'full' | 'missing' | 'closed' | 'expired' | 'recovering' | 'unauthorized' | 'conflict'> => {
  const room = await getRedis().get<ScreenShareRoomRecord>(roomKey(id));
  if (!room) return 'missing';
  const remainingSeconds = Math.max(1, Math.ceil((room.hardExpiresAt - now) / 1000));
  const record: ScreenSharePeerRecord = {
    id: peerId,
    tokenHash,
    joinedAt: now,
    lastHeartbeat: now,
    state: 'connecting',
    displayName,
    admission: 'approved',
    cameraOn,
    microphoneOn,
  };
  const result = await getRedis().eval(
    JOIN_ROOM_SCRIPT,
    [roomKey(id), viewersKey(id), viewerKey(id, peerId), pendingKey(id)],
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
  cameraOn,
  microphoneOn,
}: {
  id: string;
  tokenHash: string;
  now: number;
  audioAvailable: boolean;
  qualityMode: QualityMode;
  cameraOn: boolean;
  microphoneOn: boolean;
}): Promise<string> => String(await getRedis().eval(
  HOST_HEARTBEAT_SCRIPT,
  [roomKey(id), viewersKey(id), signalSequenceKey(id)],
  [tokenHash, now, audioAvailable ? '1' : '0', SCREENSHARE_HOST_RECOVERY_MS, qualityMode, cameraOn ? '1' : '0', microphoneOn ? '1' : '0', SCREENSHARE_ROOM_TTL_SECONDS],
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
  cameraOn,
  microphoneOn,
  networkType,
  downlinkMbps,
  rttMs,
}: {
  id: string;
  peerId: string;
  tokenHash: string;
  now: number;
  state: PeerState;
  cameraOn: boolean;
  microphoneOn: boolean;
  networkType: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  downlinkMbps: number | null;
  rttMs: number | null;
}): Promise<string> => String(await getRedis().eval(
  VIEWER_HEARTBEAT_SCRIPT,
  [roomKey(id), viewersKey(id), viewerKey(id, peerId), pendingKey(id)],
  [peerId, tokenHash, state, now, SCREENSHARE_VIEWER_LEASE_SECONDS, cameraOn ? '1' : '0', microphoneOn ? '1' : '0', networkType, downlinkMbps ?? 0, rttMs ?? 1000, SCREENSHARE_HOST_RECOVERY_MS, `screenshare:{${id}}:peer:`, SCREENSHARE_ROOM_TTL_SECONDS],
));

export const requestHostTransfer = async ({ id, tokenHash, peerId, now }: { id: string; tokenHash: string; peerId: string; now: number }): Promise<string> => String(await getRedis().eval(
  TRANSFER_REQUEST_SCRIPT,
  [roomKey(id), viewersKey(id), viewerKey(id, peerId), transferKey(id)],
  [tokenHash, peerId, now, SCREENSHARE_TRANSFER_TTL_SECONDS],
));

export const cancelHostTransfer = async ({ id, tokenHash }: { id: string; tokenHash: string }): Promise<string> => String(await getRedis().eval(
  TRANSFER_CANCEL_SCRIPT,
  [roomKey(id), transferKey(id)],
  [tokenHash],
));

export const respondHostTransfer = async ({ id, peerId, tokenHash, accept, now }: { id: string; peerId: string; tokenHash: string; accept: boolean; now: number }): Promise<string> => String(await getRedis().eval(
  TRANSFER_RESPOND_SCRIPT,
  [roomKey(id), transferKey(id), viewerKey(id, peerId), viewersKey(id)],
  [tokenHash, peerId, accept ? '1' : '0', now, SCREENSHARE_ROOM_TTL_SECONDS],
));

export const handoffHost = async ({ id, tokenHash, now }: { id: string; tokenHash: string; now: number }): Promise<{ status: string; hostPeerId?: string; hostName?: string }> => parseScriptJson(await getRedis().eval(
  HANDOFF_HOST_SCRIPT,
  [roomKey(id), viewersKey(id), signalSequenceKey(id)],
  [tokenHash, now, `screenshare:{${id}}:peer:`, SCREENSHARE_VIEWER_LEASE_SECONDS, SCREENSHARE_ROOM_TTL_SECONDS],
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
    [roomKey(id), viewersKey(id), viewerKey(id, peerId), signalSequenceKey(id), queueKey, viewerKey(id, target)],
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
  hostName?: string;
  hostPeerId?: string;
  access?: 'public' | 'private';
  hostCameraOn?: boolean;
  hostMicrophoneOn?: boolean;
  screenSharerId?: string | null;
};

export const getPublicRoomInfo = async (id: string, now: number): Promise<PublicRoomInfo> => {
  const result = await getRedis().eval(
    GET_PUBLIC_ROOM_SCRIPT,
    [roomKey(id), viewersKey(id)],
    [now, `screenshare:{${id}}:peer:`, SCREENSHARE_VIEWER_LEASE_SECONDS, `screenshare:{${id}}:signals:`, SCREENSHARE_HOST_RECOVERY_MS],
  );
  return parseScriptJson(result);
};

export type HostPeerSummary = Pick<ScreenSharePeerRecord, 'id' | 'displayName' | 'joinedAt' | 'lastHeartbeat' | 'state' | 'cameraOn' | 'microphoneOn'>;
export type PendingPeerSummary = Pick<ScreenSharePeerRecord, 'id' | 'displayName' | 'joinedAt' | 'lastHeartbeat'>;

export const getHostPeers = async (
  id: string,
  tokenHash: string,
  now: number,
): Promise<{ status: string; host?: { id: string; displayName: string; cameraOn: boolean; microphoneOn: boolean }; hostPeerId?: string; peers: HostPeerSummary[]; pending: PendingPeerSummary[]; screenSharerId?: string | null; audioAvailable?: boolean }> => {
  const result = await getRedis().eval(
    GET_PEERS_SCRIPT,
    [roomKey(id), viewersKey(id), pendingKey(id)],
    [tokenHash, now, `screenshare:{${id}}:peer:`, SCREENSHARE_VIEWER_LEASE_SECONDS, `screenshare:{${id}}:signals:`],
  );
  return parseScriptJson(result);
};

export type ParticipantSummary = { id: string; displayName: string; state: PeerState; cameraOn: boolean; microphoneOn: boolean };
export const getParticipants = async ({ id, peerId, tokenHash, now }: { id: string; peerId: string; tokenHash: string; now: number }): Promise<{
  status: string;
  host?: { id: string; displayName: string; cameraOn: boolean; microphoneOn: boolean };
  hostPeerId?: string;
  peers?: ParticipantSummary[];
  screenSharerId?: string | null;
  access?: 'public' | 'private';
  audioAvailable?: boolean;
}> => parseScriptJson(await getRedis().eval(
  GET_PARTICIPANTS_SCRIPT,
  [roomKey(id), viewersKey(id), viewerKey(id, peerId)],
  [tokenHash, peerId, now, `screenshare:{${id}}:peer:`, SCREENSHARE_VIEWER_LEASE_SECONDS],
));

export type ViewerAdmission = { status: string; admission?: 'pending' | 'approved' | 'denied'; roomState?: string };
export const getViewerAdmission = async ({ id, peerId, tokenHash, now }: { id: string; peerId: string; tokenHash: string; now: number }): Promise<ViewerAdmission> => parseScriptJson(await getRedis().eval(
  VIEWER_ADMISSION_SCRIPT,
  [roomKey(id), viewerKey(id, peerId)],
  [tokenHash, peerId, now, SCREENSHARE_HOST_RECOVERY_MS],
));

export const startKickVote = async ({ id, actorId, tokenHash, targetPeerId, voteId, now }: {
  id: string;
  actorId: string;
  tokenHash: string;
  targetPeerId: string;
  voteId: string;
  now: number;
}): Promise<string> => String(await getRedis().eval(
  START_KICK_VOTE_SCRIPT,
  [roomKey(id), viewersKey(id), kickVoteKey(id)],
  [tokenHash, now, actorId, targetPeerId, voteId, `screenshare:{${id}}:peer:`, SCREENSHARE_KICK_VOTE_SECONDS, SCREENSHARE_VIEWER_LEASE_SECONDS, SCREENSHARE_KICK_VOTE_TTL_SECONDS],
));

export const castKickVote = async ({ id, actorId, tokenHash, voteId, choice, now }: {
  id: string;
  actorId: string;
  tokenHash: string;
  voteId: string;
  choice: 'yes' | 'no';
  now: number;
}): Promise<string> => String(await getRedis().eval(
  CAST_KICK_VOTE_SCRIPT,
  [roomKey(id), viewersKey(id), kickVoteKey(id), pendingKey(id), signalSequenceKey(id), hostSignalsKey(id)],
  [actorId, tokenHash, voteId, choice, now, `screenshare:{${id}}:peer:`, `screenshare:{${id}}:signals:`, SCREENSHARE_SIGNAL_LIMIT, SCREENSHARE_SIGNAL_TTL_SECONDS, SCREENSHARE_VIEWER_LEASE_SECONDS, SCREENSHARE_KICK_VOTE_TTL_SECONDS],
));

export const getKickVote = async ({ id, role, actorId, tokenHash, now }: {
  id: string;
  role: 'host' | 'viewer';
  actorId: string;
  tokenHash: string;
  now: number;
}): Promise<{ status: string; vote: KickVoteView | null }> => parseScriptJson(await getRedis().eval(
  GET_KICK_VOTE_SCRIPT,
  [roomKey(id), viewersKey(id), viewerKey(id, actorId), kickVoteKey(id)],
  [role, actorId, tokenHash, now, SCREENSHARE_VIEWER_LEASE_SECONDS, SCREENSHARE_KICK_VOTE_TTL_SECONDS],
));

export const approveViewer = async ({ id, peerId, tokenHash, now }: { id: string; peerId: string; tokenHash: string; now: number }): Promise<string> => String(await getRedis().eval(
  APPROVE_VIEWER_SCRIPT,
  [roomKey(id), viewersKey(id), viewerKey(id, peerId), pendingKey(id)],
  [tokenHash, peerId, now, `screenshare:{${id}}:peer:`, `screenshare:{${id}}:signals:`, SCREENSHARE_VIEWER_LEASE_SECONDS],
));

export const rejectViewer = async ({ id, peerId, tokenHash, now }: { id: string; peerId: string; tokenHash: string; now: number }): Promise<string> => String(await getRedis().eval(
  REJECT_VIEWER_SCRIPT,
  [roomKey(id), viewerKey(id, peerId), pendingKey(id)],
  [tokenHash, peerId, now],
));

export const setScreenSharer = async ({ id, actorId, tokenHash, action, audioAvailable = false, now }: { id: string; actorId: string; tokenHash: string; action: 'start' | 'stop'; audioAvailable?: boolean; now: number }): Promise<string> => String(await getRedis().eval(
  SET_SCREEN_SHARER_SCRIPT,
  [roomKey(id), viewersKey(id), viewerKey(id, actorId)],
  [actorId, tokenHash, now, action, audioAvailable ? '1' : '0'],
));

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
  [roomKey(id), viewersKey(id), viewerKey(id, peerId), signalSequenceKey(id), hostSignalsKey(id), pendingKey(id)],
  [peerId, tokenHash, now, SCREENSHARE_SIGNAL_LIMIT, SCREENSHARE_SIGNAL_TTL_SECONDS, `screenshare:{${id}}:signals:`],
));

export const closeRoom = async ({ id, tokenHash, now }: { id: string; tokenHash: string; now: number }): Promise<string> =>
  String(await getRedis().eval(
    CLOSE_ROOM_SCRIPT,
    [roomKey(id), viewersKey(id), signalSequenceKey(id)],
    [tokenHash, now, `screenshare:{${id}}:signals:`, SCREENSHARE_SIGNAL_LIMIT, 120, `screenshare:{${id}}:peer:`],
  ));
