import { sha256Hex } from '@/lib/screenshare/auth';
import { isValidPeerId, isValidRoomId, isValidSecret } from '@/lib/screenshare/protocol';
import { consumeRateLimit, setScreenSharer } from '@/lib/screenshare/store';
import { isRecord, json, readJsonBody, serverError } from '@/lib/screenshare/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ roomId: string }> };

export async function POST(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const body = await readJsonBody(request, 1_000);
  if (!body.ok) return json({ error: body.code }, body.status);
  if (!isRecord(body.value) || (body.value.role !== 'host' && body.value.role !== 'viewer') || (body.value.action !== 'start' && body.value.action !== 'stop')) {
    return json({ error: 'invalid_request' }, 400);
  }

  const role = body.value.role;
  if (body.value.audioAvailable !== undefined && typeof body.value.audioAvailable !== 'boolean') return json({ error: 'invalid_request' }, 400);
  const actorId = role === 'host' ? 'host' : body.value.peerId;
  if (role === 'viewer' && (typeof actorId !== 'string' || !isValidPeerId(actorId))) return json({ error: 'invalid_request' }, 400);
  const token = request.headers.get(role === 'host' ? 'x-screenshare-host-token' : 'x-screenshare-viewer-token');
  if (!isValidSecret(token)) return json({ error: 'unauthorized' }, 401);

  try {
    if (!(await consumeRateLimit(`screenshare:rate:screen:${roomId}:${actorId}`, 60, 12))) return json({ error: 'rate_limited' }, 429);
    const screenSharerId = await setScreenSharer({
      id: roomId,
      actorId: actorId as string,
      tokenHash: await sha256Hex(token),
      action: body.value.action,
      audioAvailable: body.value.audioAvailable === true,
      now: Date.now(),
    });
    if (screenSharerId === 'busy') return json({ error: 'screen_busy' }, 409);
    if (screenSharerId === 'unauthorized' || screenSharerId === 'missing') return json({ error: 'not_found' }, 404);
    if (screenSharerId === 'closed') return json({ error: 'room_ended' }, 410);
    return json({ ok: true, screenSharerId: screenSharerId === 'none' ? null : screenSharerId });
  } catch (error) {
    return serverError(error);
  }
}
