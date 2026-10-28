/**
 * The call's identity for this browser tab. sessionStorage survives a reload of
 * the same tab and is gone when the tab closes, so a reload can pick the call
 * back up without leaving other tabs or devices with access.
 */
export type HostCallSession = {
  role: 'host';
  roomId: string;
  token: string;
  name: string;
  access: 'public' | 'private';
  startedAt: number;
  /** Last signal sequence handled, so a resumed poll does not replay old messages. */
  cursor: number;
};

export type ViewerCallSession = {
  role: 'viewer';
  roomId: string;
  peerId: string;
  token: string;
  name: string;
  economy: boolean;
  cursor: number;
};

export type CallSession = HostCallSession | ViewerCallSession;

const SESSION_KEY = 'adtools.share-screen.session.v1';
const isHex = (value: unknown, length: number): value is string =>
  typeof value === 'string' && new RegExp(`^[a-f0-9]{${length}}$`).test(value);
const isCursor = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;

export const parseCallSession = (value: unknown): CallSession | null => {
  if (typeof value !== 'object' || value === null) return null;
  const session = value as Record<string, unknown>;
  if (!isHex(session.roomId, 48) || !isHex(session.token, 64) || !isCursor(session.cursor)) return null;
  if (typeof session.name !== 'string' || session.name.length > 32) return null;
  if (session.role === 'host') {
    if ((session.access !== 'public' && session.access !== 'private') || typeof session.startedAt !== 'number' || !Number.isFinite(session.startedAt)) return null;
    return { role: 'host', roomId: session.roomId, token: session.token, name: session.name, access: session.access, startedAt: session.startedAt, cursor: session.cursor };
  }
  if (session.role === 'viewer') {
    if (!isHex(session.peerId, 32) || typeof session.economy !== 'boolean') return null;
    return { role: 'viewer', roomId: session.roomId, peerId: session.peerId, token: session.token, name: session.name, economy: session.economy, cursor: session.cursor };
  }
  return null;
};

export const loadCallSession = (): CallSession | null => {
  try {
    return parseCallSession(JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null'));
  } catch {
    return null;
  }
};

export const saveCallSession = (session: CallSession): void => {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch { /* storage can be disabled */ }
};

export const clearCallSession = (): void => {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* storage can be disabled */ }
};

export const updateCallSessionCursor = (cursor: number): void => {
  const current = loadCallSession();
  if (!current || current.cursor === cursor) return;
  saveCallSession({ ...current, cursor });
};
