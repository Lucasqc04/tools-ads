import { describe, expect, it } from 'vitest';
import { getRemoteTrackKind, mapCallMediaTransceivers } from '../media';

const makeTransceiver = (mid: string | null, kind: 'audio' | 'video') => ({
  mid,
  receiver: { track: { kind } },
}) as RTCRtpTransceiver;

describe('call media transceiver mapping', () => {
  it('maps the offer media sections and ignores unassociated local transceivers', () => {
    const offerTransceivers = [
      makeTransceiver('0', 'audio'),
      makeTransceiver('1', 'video'),
      makeTransceiver('2', 'video'),
      makeTransceiver('3', 'audio'),
    ];
    const pc = {
      getTransceivers: () => [
        makeTransceiver(null, 'audio'),
        makeTransceiver(null, 'video'),
        ...offerTransceivers,
      ],
    } as unknown as RTCPeerConnection;

    const mapped = mapCallMediaTransceivers(pc);

    expect(mapped).toMatchObject({
      microphone: offerTransceivers[0],
      camera: offerTransceivers[1],
      screen: offerTransceivers[2],
      screenAudio: offerTransceivers[3],
    });
  });

  it('recognizes a remote track by MID when the browser returns a different transceiver object', () => {
    const mapped = {
      microphone: makeTransceiver('0', 'audio'),
      camera: makeTransceiver('1', 'video'),
      screen: makeTransceiver('2', 'video'),
      screenAudio: makeTransceiver('3', 'audio'),
    };

    expect(getRemoteTrackKind(mapped, makeTransceiver('2', 'video'))).toBe('screen');
    expect(getRemoteTrackKind(mapped, makeTransceiver('3', 'audio'))).toBe('screenAudio');
    expect(getRemoteTrackKind(mapped, makeTransceiver('9', 'video'))).toBeNull();
  });
});
