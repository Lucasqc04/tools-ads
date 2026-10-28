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

export const getRemoteTrackKind = (
  transceivers: CallMediaTransceivers,
  target: RTCRtpTransceiver,
): CallMediaKind | null => {
  for (const kind of Object.keys(transceivers) as CallMediaKind[]) {
    if (transceivers[kind] === target) return kind;
  }
  return null;
};

export const getDisplayMediaOptions = (): DisplayMediaStreamOptions => ({
  video: true,
  audio: true,
});
