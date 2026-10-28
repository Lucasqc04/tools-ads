export type CallMediaKind = 'microphone' | 'camera' | 'screen' | 'screenAudio';
export type CallMediaTransceivers = Record<CallMediaKind, RTCRtpTransceiver>;

export const createCallMediaTransceivers = (
  connection: RTCPeerConnection,
  microphone: MediaStreamTrack | null,
  camera: MediaStreamTrack | null,
  screen: MediaStreamTrack | null,
  screenAudio: MediaStreamTrack | null,
): CallMediaTransceivers => ({
  microphone: connection.addTransceiver(microphone ?? 'audio', { direction: 'sendrecv' }),
  camera: connection.addTransceiver(camera ?? 'video', { direction: 'sendrecv' }),
  screen: connection.addTransceiver(screen ?? 'video', { direction: 'sendrecv' }),
  screenAudio: connection.addTransceiver(screenAudio ?? 'audio', { direction: 'sendrecv' }),
});

/**
 * Returns the media slots in the order used by createCallMediaTransceivers.
 * An answering peer must map these after setRemoteDescription: browsers can
 * create new, MID-associated transceivers for the offer instead of reusing
 * transceivers added before the remote description.
 */
export const mapCallMediaTransceivers = (connection: RTCPeerConnection): CallMediaTransceivers | null => {
  const associated = connection.getTransceivers().filter((transceiver) => transceiver.mid !== null);
  const audio = associated.filter((transceiver) => transceiver.receiver.track.kind === 'audio');
  const video = associated.filter((transceiver) => transceiver.receiver.track.kind === 'video');
  if (audio.length < 2 || video.length < 2) return null;

  return {
    microphone: audio[0],
    camera: video[0],
    screen: video[1],
    screenAudio: audio[1],
  };
};

export const bindCallMediaTracks = async (
  connection: RTCPeerConnection,
  localStream: MediaStream | null,
  screenStream: MediaStream | null,
): Promise<CallMediaTransceivers> => {
  const transceivers = mapCallMediaTransceivers(connection);
  if (!transceivers) throw new Error('The remote offer does not contain the expected media sections.');

  for (const transceiver of Object.values(transceivers)) transceiver.direction = 'sendrecv';
  await Promise.all([
    transceivers.microphone.sender.replaceTrack(localStream?.getAudioTracks()[0] ?? null),
    transceivers.camera.sender.replaceTrack(localStream?.getVideoTracks()[0] ?? null),
    transceivers.screen.sender.replaceTrack(screenStream?.getVideoTracks()[0] ?? null),
    transceivers.screenAudio.sender.replaceTrack(screenStream?.getAudioTracks()[0] ?? null),
  ]);
  return transceivers;
};

export const getRemoteTrackKind = (
  transceivers: CallMediaTransceivers,
  target: RTCRtpTransceiver,
): CallMediaKind | null => {
  for (const kind of Object.keys(transceivers) as CallMediaKind[]) {
    if (transceivers[kind] === target || (target.mid !== null && transceivers[kind].mid === target.mid)) return kind;
  }
  return null;
};

export const getDisplayMediaOptions = (): DisplayMediaStreamOptions => ({
  video: true,
  audio: true,
});
