import { sha256Hex } from '@/lib/screenshare/auth';
import { isValidPeerId, isValidRoomId, isValidSecret, isQualityMode } from '@/lib/screenshare/protocol';
import { heartbeatHost, heartbeatViewer, consumeRateLimit } from '@/lib/screenshare/store';
import { isRecord, json, readJsonBody, serverError } from '@/lib/screenshare/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ roomId: string }> };

export async function POST(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const body = await readJsonBody(request, 2_000);
  if (!body.ok) return json({ error: body.code }, body.status);
  if (!isRecord(body.value) || (body.value.role !== 'host' && body.value.role !== 'viewer')) {
    return json({ error: 'invalid_request' }, 400);
  }

  try {
    const now = Date.now();
    if (body.value.role === 'host') {
      const token = request.headers.get('x-screenshare-host-token');
      const qualityMode = body.value.qualityMode ?? 'automatic';
      if (!isValidSecret(token) || !isQualityMode(qualityMode) || typeof body.value.audioAvailable !== 'boolean') {
        return json({ error: 'invalid_request' }, 400);
      }
      if (!(await consumeRateLimit(`screenshare:rate:heartbeat:host:${roomId}`, 60, 24))) {
        return json({ error: 'rate_limited' }, 429);
      }
      const outcome = await heartbeatHost({
        id: roomId,
        tokenHash: await sha256Hex(token),
        now,
        audioAvailable: body.value.audioAvailable,
        qualityMode,
      });
      if (outcome === 'ok') return json({ ok: true });
      if (outcome === 'unauthorized') return json({ error: 'not_found' }, 404);
      return json({ error: 'room_ended' }, 410);
    }

    const token = request.headers.get('x-screenshare-viewer-token');
    const peerId = body.value.peerId;
    const state = body.value.state;
    if (!isValidSecret(token) || typeof peerId !== 'string' || !isValidPeerId(peerId) || !['connecting', 'connected', 'disconnected'].includes(String(state))) {
      return json({ error: 'invalid_request' }, 400);
    }
    if (!(await consumeRateLimit(`screenshare:rate:heartbeat:viewer:${roomId}:${peerId}`, 60, 24))) {
      return json({ error: 'rate_limited' }, 429);
    }
    const outcome = await heartbeatViewer({
      id: roomId,
      peerId,
      tokenHash: await sha256Hex(token),
      now,
      state: state as 'connecting' | 'connected' | 'disconnected',
    });
    if (outcome === 'ok') return json({ ok: true });
    if (outcome === 'unauthorized') return json({ error: 'not_found' }, 404);
    return json({ error: 'room_ended' }, 410);
  } catch (error) {
    return serverError(error);
  }
}
