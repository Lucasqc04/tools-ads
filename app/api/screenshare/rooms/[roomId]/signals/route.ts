import { sha256Hex } from '@/lib/screenshare/auth';
import { getSignalRateLimit, isValidPeerId, isValidRoomId, isValidSecret, isViewerSignalDirectionValid, validateSignalPayload } from '@/lib/screenshare/protocol';
import { consumeRateLimit, getHostPeers, getKickVote, getParticipants, pollSignals, sendSignal } from '@/lib/screenshare/store';
import { isRecord, json, readJsonBody, serverError } from '@/lib/screenshare/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ roomId: string }> };

/**
 * Roster piggybacks on the signal poll (`?roster=1`) so one function call
 * replaces the separate participants/peers polls. A roster failure must not
 * fail the signal poll, so it degrades to `null` and the client keeps its state.
 */
const loadRoster = async (role: 'host' | 'viewer', roomId: string, peerId: string, tokenHash: string, now: number) => {
  try {
    const kickVote = await getKickVote({ id: roomId, role, actorId: peerId, tokenHash, now }).catch(() => null);
    const vote = kickVote?.status === 'ok' ? kickVote.vote : null;
    if (role === 'host') {
      const result = await getHostPeers(roomId, tokenHash, now);
      if (result.status === 'unauthorized' || result.status === 'missing') return null;
      return { host: result.host, hostPeerId: result.hostPeerId, peers: result.peers, pending: result.pending, screenSharerId: result.screenSharerId ?? null, audioAvailable: result.audioAvailable ?? false, kickVote: vote };
    }
    const result = await getParticipants({ id: roomId, peerId, tokenHash, now });
    if (result.status !== 'ok') return null;
    return { host: result.host, hostPeerId: result.hostPeerId, peers: result.peers, screenSharerId: result.screenSharerId ?? null, access: result.access, audioAvailable: result.audioAvailable ?? false, kickVote: vote };
  } catch {
    return null;
  }
};

export async function POST(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const body = await readJsonBody(request);
  if (!body.ok) return json({ error: body.code }, body.status);
  if (!isRecord(body.value) || (body.value.role !== 'host' && body.value.role !== 'viewer')) {
    return json({ error: 'invalid_request' }, 400);
  }

  const signal = validateSignalPayload(body.value.signal);
  if (!signal) return json({ error: 'invalid_signal' }, 400);

  try {
    const role = body.value.role;
    const peerIdValue: unknown = role === 'viewer' ? body.value.peerId : 'host';
    const targetValue: unknown = role === 'host' ? body.value.toPeerId : (body.value.toPeerId ?? 'host');
    if ((role === 'viewer' && (typeof peerIdValue !== 'string' || !isValidPeerId(peerIdValue))) ||
      (role === 'host' && (typeof targetValue !== 'string' || !isValidPeerId(targetValue))) ||
      (role === 'viewer' && targetValue !== 'host' && (typeof targetValue !== 'string' || !isValidPeerId(targetValue)))) {
      return json({ error: 'invalid_target' }, 400);
    }
    const peerId = peerIdValue as string;
    const target = targetValue as string;
    if (role === 'viewer' && !isViewerSignalDirectionValid(signal, target)) {
      return json({ error: 'invalid_signal_direction' }, 400);
    }

    const token = request.headers.get(role === 'host' ? 'x-screenshare-host-token' : 'x-screenshare-viewer-token');
    if (!isValidSecret(token)) return json({ error: 'unauthorized' }, 401);

    if (role === 'host' && signal.type !== 'offer' && signal.type !== 'candidate') {
      return json({ error: 'invalid_signal_direction' }, 400);
    }
    if (role === 'viewer' && signal.type !== 'join' && signal.type !== 'offer' && signal.type !== 'answer' && signal.type !== 'candidate' && signal.type !== 'restart-request' && signal.type !== 'bye' && signal.type !== 'quality-request') {
      return json({ error: 'invalid_signal_direction' }, 400);
    }

    const rateIdentity = role === 'host' ? `host:${roomId}` : `viewer:${roomId}:${peerId}`;
    const rate = getSignalRateLimit(role, signal);
    if (!(await consumeRateLimit(`screenshare:rate:${rate.bucket}:${rateIdentity}`, 60, rate.limit))) {
      return json({ error: 'rate_limited' }, 429);
    }

    const sequence = await sendSignal({
      id: roomId,
      role,
      peerId: peerId as string,
      tokenHash: await sha256Hex(token),
      target: target as string,
      signal,
      now: Date.now(),
    });

    if (typeof sequence === 'number') return json({ ok: true, sequence });
    if (sequence === 'unauthorized') return json({ error: 'not_found' }, 404);
    if (sequence === 'invalid_target') return json({ error: 'not_found' }, 404);
    if (sequence === 'closed') return json({ error: 'room_ended' }, 410);
    return json({ error: 'not_found' }, 404);
  } catch (error) {
    return serverError(error);
  }
}

export async function GET(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const url = new URL(request.url);
  const role = url.searchParams.get('role');
  const peerId = url.searchParams.get('peerId') ?? 'host';
  const after = Number(url.searchParams.get('after') ?? '0');
  const includeRoster = url.searchParams.get('roster') === '1';
  if ((role !== 'host' && role !== 'viewer') || (role === 'viewer' && !isValidPeerId(peerId)) || !Number.isSafeInteger(after) || after < 0) {
    return json({ error: 'invalid_request' }, 400);
  }

  const token = request.headers.get(role === 'host' ? 'x-screenshare-host-token' : 'x-screenshare-viewer-token');
  if (!isValidSecret(token)) return json({ error: 'unauthorized' }, 401);

  try {
    const rateIdentity = role === 'host' ? `host:${roomId}` : `viewer:${roomId}:${peerId}`;
    if (!(await consumeRateLimit(`screenshare:rate:poll:${rateIdentity}`, 60, 100))) {
      return json({ error: 'rate_limited' }, 429);
    }
    const tokenHash = await sha256Hex(token);
    const now = Date.now();
    const result = await pollSignals({
      id: roomId,
      role,
      peerId,
      tokenHash,
      after,
      now,
    });
    if (result.status === 'unauthorized') return json({ error: 'not_found' }, 404);
    if (result.status === 'missing') return json({ error: 'not_found' }, 404);
    if (!includeRoster) return json(result);
    return json({ ...result, roster: await loadRoster(role, roomId, peerId, tokenHash, now) });
  } catch (error) {
    return serverError(error);
  }
}
