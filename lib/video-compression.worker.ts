import {
  ALL_FORMATS,
  BlobSource,
  Conversion,
  Input,
  Mp4OutputFormat,
  Output,
  Quality,
  StreamTarget,
} from 'mediabunny';
import { getVideoCompressionProfile } from '@/lib/video-compression-profile';
import {
  type LargeVideoCompressionErrorCode,
  type VideoCompressionWorkerRequest,
  type VideoCompressionWorkerResponse,
} from '@/lib/video-compression-worker-protocol';

type CompressionWorkerScope = {
  onmessage: ((event: MessageEvent<VideoCompressionWorkerRequest>) => void) | null;
  postMessage: (message: VideoCompressionWorkerResponse) => void;
};

const workerScope = self as unknown as CompressionWorkerScope;
const OUTPUT_DIRECTORY = 'adtools-video-compression';

const getErrorCode = (error: unknown): LargeVideoCompressionErrorCode => {
  const name =
    error && typeof error === 'object' && 'name' in error ? String(error.name) : '';
  const message = error instanceof Error ? error.message : String(error);

  if (name === 'StorageUnavailableError' || /local file storage|origin private file system/i.test(message)) {
    return 'storage_unavailable';
  }

  if (name === 'QuotaExceededError' || /quota|disk full|storage is full/i.test(message)) {
    return 'storage_quota';
  }

  if (/unsupported|not supported|decoder|encoder|codec/i.test(message)) {
    return 'unsupported_codec';
  }

  return 'processing_failed';
};

const send = (message: VideoCompressionWorkerResponse): void => {
  workerScope.postMessage(message);
};

const getEvenDimension = (value: number, factor: number): number =>
  Math.max(2, Math.floor((value * factor) / 2) * 2);

const compressLargeVideo = async (request: VideoCompressionWorkerRequest): Promise<void> => {
  const storage = navigator.storage;

  if (typeof VideoDecoder === 'undefined' || typeof VideoEncoder === 'undefined') {
    throw Object.assign(new Error('WebCodecs is not supported in this browser.'), {
      name: 'NotSupportedError',
    });
  }

  if (!storage || typeof storage.getDirectory !== 'function') {
    throw Object.assign(new Error('Local file storage is not supported.'), {
      name: 'StorageUnavailableError',
    });
  }

  send({ type: 'log', message: 'Preparing streamed video conversion...' });
  const root = await storage.getDirectory();
  const outputDirectory = await root.getDirectoryHandle(OUTPUT_DIRECTORY, { create: true });
  const outputHandle = await outputDirectory.getFileHandle(request.storageFileName, {
    create: true,
  });
  const writable = await outputHandle.createWritable();
  const output = new Output({
    format: new Mp4OutputFormat({ fastStart: 'fragmented' }),
    target: new StreamTarget(writable, { chunked: true }),
  });

  let input: Input | undefined;

  try {
    input = new Input({
      formats: ALL_FORMATS,
      source: new BlobSource(request.file),
    });

    const videoTrack = await input.getPrimaryVideoTrack();
    if (!videoTrack) {
      throw Object.assign(new Error('No video track was found.'), { name: 'NotSupportedError' });
    }

    if (!(await videoTrack.canDecode())) {
      throw Object.assign(new Error('This video codec cannot be decoded in this browser.'), {
        name: 'NotSupportedError',
      });
    }

    const profile = getVideoCompressionProfile(request.compressionLevel);
    const normalizedLevel = Math.min(100, Math.max(1, request.compressionLevel)) / 100;
    const displayWidth = await videoTrack.getDisplayWidth();
    const displayHeight = await videoTrack.getDisplayHeight();
    const shouldResize = profile.downscaleFactor < 0.995;
    const conversion = await Conversion.init({
      input,
      output,
      tracks: 'primary',
      video: {
        codec: 'avc',
        forceTranscode: true,
        quality: new Quality(Math.max(0.08, 1 - normalizedLevel * 0.92)),
        ...(shouldResize
          ? {
              width: getEvenDimension(displayWidth, profile.downscaleFactor),
              height: getEvenDimension(displayHeight, profile.downscaleFactor),
            }
          : {}),
      },
      tags: {},
    });

    const audioTrack = await input.getPrimaryAudioTrack();
    const discardedRequiredTrack = conversion.discardedTracks.some(
      ({ track }) => track === videoTrack || (audioTrack && track === audioTrack),
    );

    if (!conversion.isValid || discardedRequiredTrack) {
      throw Object.assign(
        new Error('The browser cannot encode this video and audio combination.'),
        { name: 'NotSupportedError' },
      );
    }

    send({ type: 'log', message: 'Encoding in a worker and writing output to local storage...' });
    conversion.onProgress = (progress) => {
      send({ type: 'progress', progress: Math.min(0.98, Math.max(0, progress * 0.98)) });
    };

    await conversion.execute();
    input.dispose();
    input = undefined;
    send({ type: 'completed', storageFileName: request.storageFileName });
  } catch (error) {
    input?.dispose();
    await output.cancel().catch(() => undefined);
    await outputDirectory.removeEntry(request.storageFileName).catch(() => undefined);
    throw error;
  }
};

workerScope.onmessage = (event) => {
  const request = event.data;
  if (request.type !== 'compress') {
    return;
  }

  void compressLargeVideo(request).catch((error: unknown) => {
    send({ type: 'failed', code: getErrorCode(error) });
  });
};
