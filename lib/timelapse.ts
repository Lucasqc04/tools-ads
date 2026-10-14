export type TimelapseSegment = {
  id: string;
  start: number;
  end: number;
  speed: number;
  include: boolean;
};

export type TimelapseMetadata = {
  durationInSeconds: number;
  width: number;
  height: number;
};

export type TimelapseQuality = 'high' | 'medium' | 'low';
export type TimelapseFormat = 'mp4' | 'webm';

export type TimelapseProcessingOptions = {
  segments: TimelapseSegment[];
  frameRate: 24 | 30 | 60;
  quality: TimelapseQuality;
  format: TimelapseFormat;
  onProgress?: (progress: number) => void;
  onLog?: (message: string) => void;
};

export type TimelapseErrorCode =
  | 'webcodecs_unsupported'
  | 'storage_unavailable'
  | 'storage_quota'
  | 'unsupported_codec'
  | 'invalid_timeline'
  | 'processing_failed';

export const MAX_TIMELAPSE_FILE_SIZE_BYTES = 10 * 1024 * 1024 * 1024;
const STORAGE_DIRECTORY = 'adtools-timelapse';

type TimelapseWorkerResponse =
  | { type: 'log'; message: string }
  | { type: 'progress'; progress: number }
  | { type: 'completed'; storageFileName: string }
  | { type: 'failed'; code: TimelapseErrorCode };

export class TimelapseProcessingError extends Error {
  constructor(readonly code: TimelapseErrorCode) {
    super(code);
    this.name = 'TimelapseProcessingError';
  }
}

export const readTimelapseMetadata = async (file: File): Promise<TimelapseMetadata> => {
  const { ALL_FORMATS, BlobSource, Input } = await import('mediabunny');
  const input = new Input({ formats: ALL_FORMATS, source: new BlobSource(file) });

  try {
    const track = await input.getPrimaryVideoTrack();
    if (!track) throw new TimelapseProcessingError('unsupported_codec');

    const [firstTimestamp, metadataEndTimestamp, width, height] = await Promise.all([
      input.getFirstTimestamp([track]),
      input.getDurationFromMetadata([track]),
      track.getDisplayWidth(),
      track.getDisplayHeight(),
    ]);
    const visibleStart = Math.max(0, firstTimestamp);
    const endTimestamp = metadataEndTimestamp ?? await input.computeDuration([track]);
    const duration = endTimestamp === null ? null : endTimestamp - visibleStart;

    if (!duration || !Number.isFinite(duration) || duration <= 0) {
      throw new TimelapseProcessingError('unsupported_codec');
    }

    return { durationInSeconds: duration, width, height };
  } finally {
    input.dispose();
  }
};

const validateSegments = (segments: TimelapseSegment[]): boolean => {
  if (!segments.length || !segments.some((segment) => segment.include)) return false;
  const sorted = [...segments].sort((a, b) => a.start - b.start);
  return sorted.every(
    (segment, index) =>
      Number.isFinite(segment.start) &&
      Number.isFinite(segment.end) &&
      segment.start >= 0 &&
      segment.end > segment.start &&
      Number.isFinite(segment.speed) &&
      segment.speed >= 0.25 &&
      segment.speed <= 16 &&
      (index === 0 || segment.start >= sorted[index - 1].end - 0.001),
  );
};

export const createTimelapseVideo = async (
  file: File,
  options: TimelapseProcessingOptions,
): Promise<{ file: File; storageFileName: string }> => {
  if (!validateSegments(options.segments)) {
    throw new TimelapseProcessingError('invalid_timeline');
  }

  const storageFileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}-timelapse.${options.format}`;
  const worker = new Worker(new URL('./timelapse.worker.ts', import.meta.url), { type: 'module' });

  const completed = await new Promise<string>((resolve, reject) => {
    worker.onerror = () => {
      worker.terminate();
      reject(new TimelapseProcessingError('processing_failed'));
    };

    worker.onmessage = (event: MessageEvent<TimelapseWorkerResponse>) => {
      const message = event.data;
      if (message.type === 'log') {
        options.onLog?.(message.message);
      } else if (message.type === 'progress') {
        options.onProgress?.(Math.max(0, Math.min(1, message.progress)));
      } else if (message.type === 'completed') {
        worker.terminate();
        resolve(message.storageFileName);
      } else {
        worker.terminate();
        reject(new TimelapseProcessingError(message.code));
      }
    };

    try {
      worker.postMessage({
        type: 'process',
        file,
        segments: options.segments,
        frameRate: options.frameRate,
        quality: options.quality,
        format: options.format,
        storageFileName,
      });
    } catch {
      worker.terminate();
      reject(new TimelapseProcessingError('processing_failed'));
    }
  });

  try {
    const root = await navigator.storage.getDirectory();
    const directory = await root.getDirectoryHandle(STORAGE_DIRECTORY);
    const handle = await directory.getFileHandle(completed);
    const storedFile = await handle.getFile();
    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]+/g, '-');
    return {
      file: new File([storedFile], `${baseName || 'video'}-timelapse.${options.format}`, {
        type: options.format === 'mp4' ? 'video/mp4' : 'video/webm',
        lastModified: Date.now(),
      }),
      storageFileName: completed,
    };
  } catch {
    await removeTimelapseOutput(completed);
    throw new TimelapseProcessingError('storage_unavailable');
  }
};

export const removeTimelapseOutput = async (storageFileName: string): Promise<void> => {
  if (typeof navigator === 'undefined' || !navigator.storage?.getDirectory) return;
  try {
    const root = await navigator.storage.getDirectory();
    const directory = await root.getDirectoryHandle(STORAGE_DIRECTORY);
    await directory.removeEntry(storageFileName);
  } catch {
    // The temporary file may already have been removed by the browser.
  }
};
