import { requestFingerprint, sha256Hex } from '@/lib/screenshare/auth';
import { isValidPeerId, isValidRoomId, isValidSecret, sanitizeParticipantName } from '@/lib/screenshare/protocol';
import { consumeRateLimit, getViewerAdmission, joinRoom } from '@/lib/screenshare/store';
import { isRecord, json, readJsonBody, serverError } from '@/lib/screenshare/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ roomId: string }> };

export async function POST(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const body = await readJsonBody(request, 2_000);
  if (!body.ok) return json({ error: body.code }, body.status);
  if (!isRecord(body.value) || typeof body.value.peerId !== 'string' || !isValidPeerId(body.value.peerId)) {
    return json({ error: 'invalid_request' }, 400);
  }
  if ((body.value.cameraOn !== undefined && typeof body.value.cameraOn !== 'boolean') || (body.value.microphoneOn !== undefined && typeof body.value.microphoneOn !== 'boolean')) {
    return json({ error: 'invalid_request' }, 400);
  }
  const displayName = sanitizeParticipantName(body.value.displayName);
  if (!displayName) return json({ error: 'invalid_display_name' }, 400);

  const viewerToken = request.headers.get('x-screenshare-viewer-token');
  if (!isValidSecret(viewerToken)) return json({ error: 'invalid_viewer_token' }, 400);

  try {
    const peerId = body.value.peerId;
    const fingerprint = await requestFingerprint(request);
    if (!(await consumeRateLimit(`screenshare:rate:join:${roomId}:${fingerprint}`, 60, 12))) {
      return json({ error: 'rate_limited' }, 429);
    }

    const outcome = await joinRoom({
      id: roomId,
      peerId,
      tokenHash: await sha256Hex(viewerToken),
      displayName,
      cameraOn: body.value.cameraOn === true,
      microphoneOn: body.value.microphoneOn === true,
      now: Date.now(),
    });

    if (outcome === 'joined' || outcome === 'existing' || outcome === 'pending') {
      return json({ peerId, state: outcome === 'pending' ? 'pending' : 'approved', resumed: outcome === 'existing' });
    }
    if (outcome === 'pending_full') return json({ error: 'room_busy' }, 409);
    if (outcome === 'denied') return json({ error: 'join_rejected' }, 403);
    if (outcome === 'full') return json({ error: 'room_full' }, 409);
    if (outcome === 'recovering') return json({ error: 'host_recovering' }, 409);
    if (outcome === 'closed' || outcome === 'expired') return json({ error: 'room_ended' }, 410);
    if (outcome === 'unauthorized') return json({ error: 'not_found' }, 404);
    if (outcome === 'conflict') return json({ error: 'try_again' }, 409);
    return json({ error: 'not_found' }, 404);
  } catch (error) {
    return serverError(error);
  }
}

export async function GET(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const url = new URL(request.url);
  const peerId = url.searchParams.get('peerId') ?? '';
  if (!isValidPeerId(peerId)) return json({ error: 'invalid_request' }, 400);
  const token = request.headers.get('x-screenshare-viewer-token');
  if (!isValidSecret(token)) return json({ error: 'unauthorized' }, 401);

  try {
    if (!(await consumeRateLimit(`screenshare:rate:admission:${roomId}:${peerId}`, 60, 40))) {
      return json({ error: 'rate_limited' }, 429);
    }
    const admission = await getViewerAdmission({ id: roomId, peerId, tokenHash: await sha256Hex(token), now: Date.now() });
    if (admission.status !== 'ok') return json({ error: 'not_found' }, 404);
    return json({ state: admission.roomState, admission: admission.admission });
  } catch (error) {
    return serverError(error);
  }
}
