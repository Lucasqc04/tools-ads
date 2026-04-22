const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;

export const formatBytes = (size: number): string => {
  if (!Number.isFinite(size) || size <= 0) {
    return '0 B';
  }

  if (size >= GB) {
    return `${(size / GB).toFixed(2)} GB`;
  }

  if (size >= MB) {
    return `${(size / MB).toFixed(2)} MB`;
  }

  if (size >= KB) {
    return `${(size / KB).toFixed(1)} KB`;
  }

  return `${Math.round(size)} B`;
};

export const calculateSavingsPercent = (
  originalSize: number,
  compressedSize: number,
): number => {
  if (originalSize <= 0 || !Number.isFinite(originalSize) || !Number.isFinite(compressedSize)) {
    return 0;
  }

  const savings = ((originalSize - compressedSize) / originalSize) * 100;
  return Math.max(-999, Math.min(100, savings));
};
