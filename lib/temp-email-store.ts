import { Redis } from '@upstash/redis';

type MemoryRecord = {
  value: unknown;
  expiresAt: number;
};

type GlobalWithTempEmailStore = typeof globalThis & {
  __tempEmailMemoryStore?: Map<string, MemoryRecord>;
};

const TTL_NOT_FOUND = -2;

export class TempEmailStoreUnavailableError extends Error {
  readonly originalError: unknown;

  constructor(message: string, originalError: unknown) {
    super(message);
    this.name = 'TempEmailStoreUnavailableError';
    this.originalError = originalError;
  }
}

let redisClient: Redis | null | undefined;

const getRedisClient = (): Redis | null => {
  if (redisClient !== undefined) {
    return redisClient;
  }

  const redisUrl =
    process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim();
  const redisToken =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim();

  if (!redisUrl || !redisToken) {
    redisClient = null;
    return redisClient;
  }

  redisClient = new Redis({ url: redisUrl, token: redisToken });

  return redisClient;
};

const getMemoryStore = (): Map<string, MemoryRecord> => {
  const globalStore = globalThis as GlobalWithTempEmailStore;

  if (!globalStore.__tempEmailMemoryStore) {
    globalStore.__tempEmailMemoryStore = new Map<string, MemoryRecord>();
  }

  return globalStore.__tempEmailMemoryStore;
};

const cloneValue = <T>(value: T): T => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value !== 'object') {
    return value;
  }

  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value)) as T;
  }
};

const isExpired = (record: MemoryRecord): boolean => record.expiresAt <= Date.now();

const getFromMemory = <T>(key: string): T | null => {
  const store = getMemoryStore();
  const record = store.get(key);

  if (!record) {
    return null;
  }

  if (isExpired(record)) {
    store.delete(key);
    return null;
  }

  return cloneValue(record.value as T);
};

const setInMemory = (key: string, value: unknown, ttlSeconds: number): void => {
  const store = getMemoryStore();
  const safeTtl = Math.max(1, Math.floor(ttlSeconds));

  store.set(key, {
    value: cloneValue(value),
    expiresAt: Date.now() + safeTtl * 1000,
  });
};

const delFromMemory = (key: string): void => {
  const store = getMemoryStore();
  store.delete(key);
};

const ttlFromMemory = (key: string): number => {
  const store = getMemoryStore();
  const record = store.get(key);

  if (!record) {
    return TTL_NOT_FOUND;
  }

  if (isExpired(record)) {
    store.delete(key);
    return TTL_NOT_FOUND;
  }

  return Math.max(1, Math.ceil((record.expiresAt - Date.now()) / 1000));
};

export const tempEmailStore = {
  async get<T>(key: string): Promise<T | null> {
    const redis = getRedisClient();

    if (!redis) {
      return getFromMemory<T>(key);
    }

    try {
      const value = await redis.get<T>(key);
      return value ?? null;
    } catch (error: unknown) {
      throw new TempEmailStoreUnavailableError('Redis/KV indisponivel no momento.', error);
    }
  },

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    const safeTtl = Math.max(1, Math.floor(ttlSeconds));
    const redis = getRedisClient();

    if (!redis) {
      setInMemory(key, value, safeTtl);
      return;
    }

    try {
      await redis.set(key, value, { ex: safeTtl });
    } catch (error: unknown) {
      throw new TempEmailStoreUnavailableError('Redis/KV indisponivel no momento.', error);
    }
  },

  async del(key: string): Promise<void> {
    const redis = getRedisClient();

    if (!redis) {
      delFromMemory(key);
      return;
    }

    try {
      await redis.del(key);
    } catch (error: unknown) {
      throw new TempEmailStoreUnavailableError('Redis/KV indisponivel no momento.', error);
    }
  },

  async ttl(key: string): Promise<number> {
    const redis = getRedisClient();

    if (!redis) {
      return ttlFromMemory(key);
    }

    try {
      return await redis.ttl(key);
    } catch (error: unknown) {
      throw new TempEmailStoreUnavailableError('Redis/KV indisponivel no momento.', error);
    }
  },
};
