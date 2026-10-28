export type FacingMode = 'user' | 'environment';
export type DetectedFacing = FacingMode | 'unknown';
export type MediaDeviceOption = { id: string; label: string };

type DeviceKind = 'videoinput' | 'audioinput' | 'audiooutput';

const REAR_LABEL = /\b(back|rear|traseira|trasera|environment|arri[eè]re|hinten)\b|后置/i;
const FRONT_LABEL = /\b(front|frontal|user|facetime|avant|vorne)\b|前置/i;

/**
 * Lists the devices of one kind. Browsers hide labels until permission is
 * granted, so unnamed entries fall back to "<fallback> <n>". The virtual
 * "default"/"communications" aliases are dropped because they duplicate a
 * real entry and break selection when the system default changes.
 */
export const normalizeDevices = (
  devices: ReadonlyArray<Pick<MediaDeviceInfo, 'deviceId' | 'kind' | 'label'>>,
  kind: DeviceKind,
  fallback: string,
): MediaDeviceOption[] => {
  const seen = new Set<string>();
  const options: MediaDeviceOption[] = [];
  for (const device of devices) {
    if (device.kind !== kind || !device.deviceId) continue;
    if (device.deviceId === 'default' || device.deviceId === 'communications') continue;
    if (seen.has(device.deviceId)) continue;
    seen.add(device.deviceId);
    options.push({ id: device.deviceId, label: device.label.trim() || `${fallback} ${options.length + 1}` });
  }
  return options;
};

export const buildCameraConstraints = ({ deviceId, facingMode }: { deviceId?: string; facingMode?: FacingMode }): MediaTrackConstraints => {
  const base: MediaTrackConstraints = { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30, max: 30 } };
  if (deviceId) return { ...base, deviceId: { exact: deviceId } };
  return { ...base, facingMode: { ideal: facingMode ?? 'user' } };
};

export const buildMicrophoneConstraints = ({ deviceId }: { deviceId?: string }): MediaTrackConstraints => ({
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
});

/** Prefers the facing mode reported by the track; falls back to the device label. */
export const detectFacingMode = (settings: Pick<MediaTrackSettings, 'facingMode'> | undefined, label = ''): DetectedFacing => {
  const reported = settings?.facingMode;
  if (reported === 'environment') return 'environment';
  if (reported === 'user') return 'user';
  if (REAR_LABEL.test(label)) return 'environment';
  if (FRONT_LABEL.test(label)) return 'user';
  return 'unknown';
};

/** Only the front camera is mirrored in the local preview; remote viewers always get the raw image. */
export const shouldMirrorPreview = (facing: DetectedFacing, mirrorEnabled: boolean) => mirrorEnabled && facing !== 'environment';

export const isScreenCaptureSupported = (nav: { mediaDevices?: { getDisplayMedia?: unknown } } | undefined) =>
  typeof nav?.mediaDevices?.getDisplayMedia === 'function';

export const supportsOutputSelection = () =>
  typeof HTMLMediaElement !== 'undefined' && 'setSinkId' in HTMLMediaElement.prototype;
