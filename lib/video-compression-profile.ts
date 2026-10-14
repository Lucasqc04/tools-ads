export type VideoCompressionProfile = {
  crf: number;
  videoBitrateFactor: number;
  audioBitrateKbps: number;
  downscaleFactor: number;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const getVideoCompressionProfile = (compressionLevel: number): VideoCompressionProfile => {
  const normalized = clamp(compressionLevel / 100, 0, 1);

  return {
    crf: Math.round(20 + normalized * 17),
    videoBitrateFactor: clamp(0.98 - normalized * 0.72, 0.22, 0.98),
    audioBitrateKbps: normalized >= 0.75 ? 64 : normalized >= 0.45 ? 96 : 128,
    downscaleFactor:
      normalized >= 0.9
        ? 0.58
        : normalized >= 0.75
          ? 0.68
          : normalized >= 0.55
            ? 0.8
            : normalized >= 0.35
              ? 0.9
              : 1,
  };
};
