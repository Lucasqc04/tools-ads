/**
 * Per-instance protection only. Serverless instances do not share memory, so this
 * limits bursts hitting one warm instance; it is not a global rate limit.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const MAX_CONCURRENT_EXTRACTIONS = 6;
const MAX_TRACKED_CLIENTS = 2000;

const hits = new Map<string, number[]>();
let inFlight = 0;

export const resetRateLimitState = (): void => {
  hits.clear();
  inFlight = 0;
};

export const takeRequestSlot = (clientKey: string, now = Date.now()): boolean => {
  const recent = (hits.get(clientKey) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(clientKey, recent);
    return false;
  }

  recent.push(now);
  hits.delete(clientKey);
  hits.set(clientKey, recent);

  // Drop the oldest entries first (Map keeps insertion order) so memory stays bounded.
  while (hits.size > MAX_TRACKED_CLIENTS) {
    const oldest = hits.keys().next().value;
    if (oldest === undefined) {
      break;
    }
    hits.delete(oldest);
  }

  return true;
};

export const acquireExtractionSlot = (): (() => void) | null => {
  if (inFlight >= MAX_CONCURRENT_EXTRACTIONS) {
    return null;
  }

  inFlight += 1;
  let released = false;

  return () => {
    if (!released) {
      released = true;
      inFlight -= 1;
    }
  };
};
