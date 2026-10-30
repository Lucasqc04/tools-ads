import { Redis } from '@upstash/redis';
import {
  WEBCAM_SESSION_CLOSED_TTL_SECONDS,
  WEBCAM_SESSION_TTL_SECONDS,
  WEBCAM_SIGNAL_QUEUE_LIMIT,
  type WebcamRole,
  type WebcamSessionRecord,
  type WebcamSessionStatus,
  type WebcamSignal,
} from './protocol';

export class WebcamStoreUnavailableError extends Error {
  constructor() {
    super('Webcam session store unavailable.');
    this.name = 'WebcamStoreUnavailableError';
  }
}

let redisClient: Redis | null = null;

const getRedis = (): Redis => {
  if (redisClient) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim();
  if (!url || !token) throw new WebcamStoreUnavailableError();
  redisClient = new Redis({ url, token });
  return redisClient;
};

const sessionKey = (id: string) => 'webcam:{' + id + '}:session';
const hostQueueKey = (id: string) => 'webcam:{' + id + '}:host-signals';
const phoneQueueKey = (id: string) => 'webcam:{' + id + '}:phone-signals';
const seenKey = (id: string) => 'webcam:{' + id + '}:seen';

const RATE_LIMIT_SCRIPT = `
local current = redis.call('INCR', KEYS[1])
if current == 1 then redis.call('EXPIRE', KEYS[1], tonumber(ARGV[1])) end
if current > tonumber(ARGV[2]) then return 0 end
return 1
`;

const POLL_SCRIPT = `
local sessionValue = redis.call('GET', KEYS[1])
if not sessionValue then return cjson.encode({ status = 'expired', messages = {} }) end
local session = cjson.decode(sessionValue)
local role = ARGV[1]
local expected = role == 'host' and session.hostTokenHash or session.phoneTokenHash
if expected ~= ARGV[2] then return cjson.encode({ status = 'not_found', messages = {} }) end
if role == 'phone' and (not session.phoneConnectionId or session.phoneConnectionId ~= ARGV[3]) then return cjson.encode({ status = 'not_found', messages = {} }) end
if tonumber(session.hardExpiresAt) <= tonumber(ARGV[4]) then
  session.status = 'closed'
  redis.call('SET', KEYS[1], cjson.encode(session), 'EX', tonumber(ARGV[7]))
  redis.call('DEL', KEYS[2])
  return cjson.encode({ status = 'expired', messages = {} })
end
local rate = redis.call('INCR', KEYS[3])
if rate == 1 then redis.call('EXPIRE', KEYS[3], tonumber(ARGV[5])) end
if rate > tonumber(ARGV[6]) then return cjson.encode({ status = 'rate_limited', messages = {} }) end
local raw = redis.call('LRANGE', KEYS[2], 0, 31)
redis.call('LTRIM', KEYS[2], 32, -1)
local messages = {}
for _, item in ipairs(raw) do
  local ok, decoded = pcall(cjson.decode, item)
  if ok then table.insert(messages, decoded) end
end
return cjson.encode({ status = session.status, messages = messages, expiresAt = session.hardExpiresAt })
`;

const SEND_SIGNAL_SCRIPT = `
local sessionValue = redis.call('GET', KEYS[1])
if not sessionValue then return 'expired' end
local session = cjson.decode(sessionValue)
local role = ARGV[1]
local tokenHash = ARGV[2]
local clientId = ARGV[3]
local now = tonumber(ARGV[4])
local signal = cjson.decode(ARGV[5])
local expected = role == 'host' and session.hostTokenHash or session.phoneTokenHash
if expected ~= tokenHash then return 'not_found' end
if session.status == 'closed' or tonumber(session.hardExpiresAt) <= now then return 'expired' end
if role == 'phone' then
  if clientId == '' then return 'not_found' end
  if session.phoneConnectionId and session.phoneConnectionId ~= clientId then return 'not_found' end
  if not session.phoneConnectionId and signal.type ~= 'request' then return 'invalid_state' end
end

local signalType = signal.type
if role == 'phone' and not (signalType == 'request' or signalType == 'offer' or signalType == 'candidate' or signalType == 'state' or signalType == 'restart-request' or signalType == 'bye') then return 'invalid_direction' end
if role == 'host' and not (signalType == 'accept' or signalType == 'answer' or signalType == 'candidate' or signalType == 'state' or signalType == 'restart-request' or signalType == 'bye') then return 'invalid_direction' end

local rate = redis.call('INCR', KEYS[4])
if rate == 1 then redis.call('EXPIRE', KEYS[4], tonumber(ARGV[8])) end
if rate > tonumber(ARGV[7]) then return 'rate_limited' end
local wasSeen = redis.call('SADD', KEYS[3], ARGV[6])
if wasSeen == 0 then return 'duplicate' end
redis.call('EXPIRE', KEYS[3], tonumber(ARGV[9]))

if signalType == 'request' then
  if role ~= 'phone' or session.status ~= 'waiting' then return 'invalid_state' end
  session.phoneConnectionId = clientId
  session.status = 'requested'
elseif signalType == 'accept' then
  if role ~= 'host' or session.status ~= 'requested' then return 'invalid_state' end
  session.status = 'accepted'
elseif signalType == 'offer' then
  if role ~= 'phone' or not (session.status == 'accepted' or session.status == 'connecting' or session.status == 'connected') then return 'invalid_state' end
  session.status = 'connecting'
elseif signalType == 'answer' then
  if role ~= 'host' or not (session.status == 'connecting' or session.status == 'connected') then return 'invalid_state' end
elseif signalType == 'candidate' then
  if not (session.status == 'accepted' or session.status == 'connecting' or session.status == 'connected') then return 'invalid_state' end
elseif signalType == 'state' and signal.state == 'connected' then
  if not (session.status == 'accepted' or session.status == 'connecting' or session.status == 'connected') then return 'invalid_state' end
  session.status = 'connected'
elseif signalType == 'bye' then
  session.status = 'closed'
  redis.call('DEL', KEYS[2])
  redis.call('SET', KEYS[1], cjson.encode(session), 'EX', tonumber(ARGV[10]))
  redis.call('DEL', KEYS[3])
  return 'ok'
end

if redis.call('LLEN', KEYS[2]) >= tonumber(ARGV[11]) then return 'queue_full' end
redis.call('RPUSH', KEYS[2], ARGV[5])
redis.call('EXPIRE', KEYS[2], tonumber(ARGV[9]))
local ttl = math.min(tonumber(ARGV[9]), math.max(1, math.floor((tonumber(session.hardExpiresAt) - now) / 1000)))
redis.call('SET', KEYS[1], cjson.encode(session), 'EX', ttl)
return 'ok'
`;

const AUTHORIZE_SCRIPT = `
local value = redis.call('GET', KEYS[1])
if not value then return cjson.encode({ status = 'expired' }) end
local session = cjson.decode(value)
local expected = ARGV[1] == 'host' and session.hostTokenHash or session.phoneTokenHash
if expected ~= ARGV[2] then return cjson.encode({ status = 'not_found' }) end
if ARGV[1] == 'phone' and (not session.phoneConnectionId or session.phoneConnectionId ~= ARGV[3]) then return cjson.encode({ status = 'not_found' }) end
if tonumber(session.hardExpiresAt) <= tonumber(ARGV[4]) then
  session.status = 'closed'
  redis.call('SET', KEYS[1], cjson.encode(session), 'EX', tonumber(ARGV[5]))
  redis.call('DEL', KEYS[2], KEYS[3], KEYS[4])
  return cjson.encode({ status = 'expired' })
end
return cjson.encode({ status = session.status, hardExpiresAt = session.hardExpiresAt })
`;

const HEARTBEAT_SCRIPT = `
local value = redis.call('GET', KEYS[1])
if not value then return 'expired' end
local session = cjson.decode(value)
local expected = ARGV[1] == 'host' and session.hostTokenHash or session.phoneTokenHash
if expected ~= ARGV[2] then return 'not_found' end
if ARGV[1] == 'phone' and (not session.phoneConnectionId or session.phoneConnectionId ~= ARGV[3]) then return 'not_found' end
local now = tonumber(ARGV[4])
if session.status == 'closed' or tonumber(session.hardExpiresAt) <= now then return 'expired' end
local ttl = math.min(tonumber(ARGV[5]), math.max(1, math.floor((tonumber(session.hardExpiresAt) - now) / 1000)))
redis.call('SET', KEYS[1], cjson.encode(session), 'EX', ttl)
redis.call('EXPIRE', KEYS[2], ttl)
redis.call('EXPIRE', KEYS[3], ttl)
return 'ok'
`;

const CLOSE_SCRIPT = `
local value = redis.call('GET', KEYS[1])
if not value then return 'expired' end
local session = cjson.decode(value)
local expected = ARGV[1] == 'host' and session.hostTokenHash or session.phoneTokenHash
if expected ~= ARGV[2] then return 'not_found' end
if ARGV[1] == 'phone' and (not session.phoneConnectionId or session.phoneConnectionId ~= ARGV[3]) then return 'not_found' end
session.status = 'closed'
redis.call('SET', KEYS[1], cjson.encode(session), 'EX', tonumber(ARGV[4]))
redis.call('DEL', KEYS[2], KEYS[3], KEYS[4])
return 'ok'
`;

const parseScriptJson = <T,>(value: unknown): T =>
  typeof value === 'string' ? (JSON.parse(value) as T) : (value as T);

export const consumeWebcamRateLimit = async (key: string, windowSeconds: number, limit: number): Promise<boolean> =>
  Number(await getRedis().eval(RATE_LIMIT_SCRIPT, [key], [windowSeconds, limit])) === 1;

export const createWebcamSession = async (record: WebcamSessionRecord): Promise<boolean> => {
  const result = await getRedis().set(sessionKey(record.id), JSON.stringify(record), {
    ex: WEBCAM_SESSION_TTL_SECONDS,
    nx: true,
  });
  return result === 'OK';
};

export const pollWebcamSignals = async ({
  id,
  role,
  tokenHash,
  clientId,
  now = Date.now(),
}: {
  id: string;
  role: WebcamRole;
  tokenHash: string;
  clientId?: string;
  now?: number;
}): Promise<{ status: WebcamSessionStatus | 'expired' | 'not_found' | 'rate_limited'; messages: WebcamSignal[]; expiresAt?: number }> => {
  const queue = role === 'host' ? hostQueueKey(id) : phoneQueueKey(id);
  const result = await getRedis().eval(
    POLL_SCRIPT,
    [sessionKey(id), queue, 'webcam:{' + id + '}:poll-rate:' + role],
    [role, tokenHash, clientId ?? '', now, 60, 140, WEBCAM_SESSION_CLOSED_TTL_SECONDS],
  );
  return parseScriptJson(result);
};

export const sendWebcamSignal = async ({
  id,
  role,
  tokenHash,
  clientId,
  signalId,
  signal,
  now = Date.now(),
}: {
  id: string;
  role: WebcamRole;
  tokenHash: string;
  clientId?: string;
  signalId: string;
  signal: WebcamSignal;
  now?: number;
}): Promise<string> => {
  const targetQueue = role === 'host' ? phoneQueueKey(id) : hostQueueKey(id);
  const result = await getRedis().eval(
    SEND_SIGNAL_SCRIPT,
    [sessionKey(id), targetQueue, seenKey(id), 'webcam:{' + id + '}:signal-rate:' + role],
    [
      role,
      tokenHash,
      clientId ?? '',
      now,
      JSON.stringify(signal),
      signalId,
      signal.type === 'candidate' ? 120 : 30,
      60,
      WEBCAM_SESSION_TTL_SECONDS,
      WEBCAM_SESSION_CLOSED_TTL_SECONDS,
      WEBCAM_SIGNAL_QUEUE_LIMIT,
    ],
  );
  return String(result);
};

export const authorizeWebcamSession = async ({
  id,
  role,
  tokenHash,
  clientId,
  now = Date.now(),
}: {
  id: string;
  role: WebcamRole;
  tokenHash: string;
  clientId?: string;
  now?: number;
}): Promise<{ status: string; hardExpiresAt?: number }> => {
  const result = await getRedis().eval(
    AUTHORIZE_SCRIPT,
    [sessionKey(id), hostQueueKey(id), phoneQueueKey(id), seenKey(id)],
    [role, tokenHash, clientId ?? '', now, WEBCAM_SESSION_CLOSED_TTL_SECONDS],
  );
  return parseScriptJson(result);
};

export const heartbeatWebcamSession = async ({
  id,
  role,
  tokenHash,
  clientId,
  now = Date.now(),
}: {
  id: string;
  role: WebcamRole;
  tokenHash: string;
  clientId?: string;
  now?: number;
}): Promise<string> => String(await getRedis().eval(
  HEARTBEAT_SCRIPT,
  [sessionKey(id), hostQueueKey(id), phoneQueueKey(id)],
  [role, tokenHash, clientId ?? '', now, WEBCAM_SESSION_TTL_SECONDS],
));

export const closeWebcamSession = async ({
  id,
  role,
  tokenHash,
  clientId,
}: {
  id: string;
  role: WebcamRole;
  tokenHash: string;
  clientId?: string;
}): Promise<string> => String(await getRedis().eval(
  CLOSE_SCRIPT,
  [sessionKey(id), hostQueueKey(id), phoneQueueKey(id), seenKey(id)],
  [role, tokenHash, clientId ?? '', WEBCAM_SESSION_CLOSED_TTL_SECONDS],
));
