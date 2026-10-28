import { describe, expect, it } from 'vitest';
import {
  buildCameraConstraints, buildMicrophoneConstraints, detectFacingMode,
  isScreenCaptureSupported, normalizeDevices, shouldMirrorPreview,
} from '../devices';

const device = (deviceId: string, kind: MediaDeviceKind, label = '') => ({ deviceId, kind, label });

describe('normalizeDevices', () => {
  it('keeps one kind, drops virtual aliases and duplicates', () => {
    const list = [
      device('default', 'audioinput', 'Padrão'),
      device('a', 'audioinput', 'USB Mic'),
      device('a', 'audioinput', 'USB Mic'),
      device('v1', 'videoinput', 'Cam'),
    ];
    expect(normalizeDevices(list, 'audioinput', 'Mic')).toEqual([{ id: 'a', label: 'USB Mic' }]);
  });

  it('numbers unlabeled devices while permission is pending', () => {
    const list = [device('x', 'videoinput'), device('y', 'videoinput')];
    expect(normalizeDevices(list, 'videoinput', 'Câmera').map((item) => item.label)).toEqual(['Câmera 1', 'Câmera 2']);
  });
});

describe('capture constraints', () => {
  it('requires the exact device when one is chosen', () => {
    expect(buildCameraConstraints({ deviceId: 'abc' }).deviceId).toEqual({ exact: 'abc' });
    expect(buildCameraConstraints({ deviceId: 'abc' }).facingMode).toBeUndefined();
    expect(buildMicrophoneConstraints({ deviceId: 'mic' }).deviceId).toEqual({ exact: 'mic' });
  });

  it('falls back to a preferred facing mode without a device id', () => {
    expect(buildCameraConstraints({ facingMode: 'environment' }).facingMode).toEqual({ ideal: 'environment' });
    expect(buildCameraConstraints({}).facingMode).toEqual({ ideal: 'user' });
    expect(buildMicrophoneConstraints({}).deviceId).toBeUndefined();
  });
});

describe('detectFacingMode', () => {
  it('trusts the reported setting first', () => {
    expect(detectFacingMode({ facingMode: 'environment' }, 'Front camera')).toBe('environment');
    expect(detectFacingMode({ facingMode: 'user' })).toBe('user');
  });

  it('reads the label when the setting is missing', () => {
    expect(detectFacingMode({}, 'Câmera traseira')).toBe('environment');
    expect(detectFacingMode(undefined, 'camera2 0, facing back')).toBe('environment');
    expect(detectFacingMode(undefined, 'FaceTime HD Camera')).toBe('user');
    expect(detectFacingMode(undefined, 'Integrated Webcam')).toBe('unknown');
  });
});

describe('preview mirroring', () => {
  it('mirrors every camera except the rear one', () => {
    expect(shouldMirrorPreview('user', true)).toBe(true);
    expect(shouldMirrorPreview('unknown', true)).toBe(true);
    expect(shouldMirrorPreview('environment', true)).toBe(false);
    expect(shouldMirrorPreview('user', false)).toBe(false);
  });
});

describe('isScreenCaptureSupported', () => {
  it('requires a callable getDisplayMedia', () => {
    expect(isScreenCaptureSupported({ mediaDevices: { getDisplayMedia: () => undefined } })).toBe(true);
    expect(isScreenCaptureSupported({ mediaDevices: {} })).toBe(false);
    expect(isScreenCaptureSupported(undefined)).toBe(false);
  });
});
