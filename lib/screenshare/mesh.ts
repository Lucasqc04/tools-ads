/** The original host has its own connection; promoted hosts remain mesh peers. */
export const meshParticipantIds = (participantIds: string[], selfId: string): Set<string> =>
  new Set(participantIds.filter((id) => id !== 'host' && id !== selfId));
