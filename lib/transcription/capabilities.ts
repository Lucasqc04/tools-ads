import type { InferenceDevice, TranscriptionQuality } from './transcription-types';

export type DeviceCapabilities = {
  webgpuAvailable: boolean;
  hardwareConcurrency: number;
  /** Only set when `navigator.deviceMemory` (Chromium-only, optional) is available. */
  approxDeviceMemoryGb: number | null;
  isLikelyLowPower: boolean;
};

declare global {
  interface Navigator {
    gpu?: unknown;
    deviceMemory?: number;
  }
}

export const detectWebGpuSupport = async (): Promise<boolean> => {
  if (typeof navigator === 'undefined' || !navigator.gpu) {
    return false;
  }

  try {
    const gpu = navigator.gpu as { requestAdapter: () => Promise<unknown> };
    const adapter = await gpu.requestAdapter();
    return Boolean(adapter);
  } catch {
    return false;
  }
};

export const getDeviceCapabilities = async (): Promise<DeviceCapabilities> => {
  const webgpuAvailable = await detectWebGpuSupport();
  const hardwareConcurrency =
    typeof navigator !== 'undefined' && Number.isFinite(navigator.hardwareConcurrency)
      ? navigator.hardwareConcurrency
      : 4;
  const approxDeviceMemoryGb =
    typeof navigator !== 'undefined' && typeof navigator.deviceMemory === 'number'
      ? navigator.deviceMemory
      : null;

  const isLikelyLowPower =
    !webgpuAvailable && (hardwareConcurrency <= 4 || (approxDeviceMemoryGb ?? 8) <= 4);

  return {
    webgpuAvailable,
    hardwareConcurrency,
    approxDeviceMemoryGb,
    isLikelyLowPower,
  };
};

export const pickInferenceDevice = (
  capabilities: Pick<DeviceCapabilities, 'webgpuAvailable'>,
): InferenceDevice => (capabilities.webgpuAvailable ? 'webgpu' : 'wasm');

/** Suggests a starting quality tier. The user can always override it. */
export const suggestQualityTier = (capabilities: DeviceCapabilities): TranscriptionQuality => {
  if (capabilities.isLikelyLowPower) {
    return 'fast';
  }

  return 'balanced';
};
