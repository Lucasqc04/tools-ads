import { sha256Hex } from '@/lib/screenshare/auth';
import { isValidPeerId, isValidRoomId, isValidSecret } from '@/lib/screenshare/protocol';
import { castKickVote, consumeRateLimit, startKickVote } from '@/lib/screenshare/store';
import { isRecord, json, readJsonBody, serverError } from '@/lib/screenshare/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = { params: Promise<{ roomId: string }> };

export async function POST(request: Request, { params }: RouteProps) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return json({ error: 'not_found' }, 404);
  const body = await readJsonBody(request, 2_000);
  if (!body.ok) return json({ error: body.code }, body.status);
  if (!isRecord(body.value) || (body.value.action !== 'start' && body.value.action !== 'vote') || typeof body.value.actorId !== 'string') {
    return json({ error: 'invalid_request' }, 400);
  }

  const { action, actorId } = body.value;
  if (actorId !== 'host' && !isValidPeerId(actorId)) return json({ error: 'invalid_request' }, 400);
  const targetPeerId = body.value.targetPeerId;
  const voteId = body.value.voteId;
  const choice = body.value.choice;
  if (typeof voteId !== 'string' || !isValidPeerId(voteId)) return json({ error: 'invalid_request' }, 400);
  if (action === 'start' && (typeof targetPeerId !== 'string' || !isValidPeerId(targetPeerId))) return json({ error: 'invalid_request' }, 400);
  if (action === 'vote' && choice !== 'yes' && choice !== 'no') return json({ error: 'invalid_request' }, 400);

  const role = actorId === 'host' ? 'host' : 'viewer';
  const token = request.headers.get(role === 'host' ? 'x-screenshare-host-token' : 'x-screenshare-viewer-token');
  if (!isValidSecret(token)) return json({ error: 'unauthorized' }, 401);

  try {
    const tokenHash = await sha256Hex(token);
    const rateIdentity = `${roomId}:${tokenHash}`;
    if (!(await consumeRateLimit(`screenshare:rate:kick-vote:${action}:${rateIdentity}`, 60, action === 'start' ? 3 : 20))) {
      return json({ error: 'rate_limited' }, 429);
    }

    const now = Date.now();
    const result = action === 'start'
      ? await startKickVote({ id: roomId, actorId, tokenHash, targetPeerId: targetPeerId as string, voteId, now })
      : await castKickVote({ id: roomId, actorId, tokenHash, voteId, choice: choice as 'yes' | 'no', now });

    if (result === 'started' || result === 'existing' || result === 'passed' || result === 'rejected' || result === 'expired' || result === 'cancelled' || result === 'vote_resolved') {
      return json({ status: result });
    }
    if (result === 'unauthorized' || result === 'missing' || result === 'target_missing') return json({ error: 'not_found' }, 404);
    if (result === 'closed') return json({ error: 'room_ended' }, 410);
    if (result === 'vote_active') return json({ error: 'vote_active' }, 409);
    if (result === 'not_enough_voters') return json({ error: 'not_enough_voters' }, 409);
    if (result === 'not_eligible') return json({ error: 'not_eligible' }, 403);
    if (result === 'already_voted') return json({ error: 'already_voted' }, 409);
    if (result === 'vote_missing' || result === 'vote_stale') return json({ error: 'vote_stale' }, 409);
    if (result === 'vote_cancelled' || result === 'vote_expired') return json({ status: result.replace('vote_', '') });
    return json({ error: 'not_found' }, 404);
  } catch (error) {
    return serverError(error);
  }
}
