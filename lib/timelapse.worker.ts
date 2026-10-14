import {
  ALL_FORMATS,
  BlobSource,
  Input,
  Mp4OutputFormat,
  Output,
  Quality,
  StreamTarget,
  VideoSampleSink,
  VideoSampleSource,
  WebMOutputFormat,
  type VideoSample,
} from 'mediabunny';
import type {
  TimelapseErrorCode,
  TimelapseFormat,
  TimelapseQuality,
  TimelapseSegment,
} from './timelapse';

type Request = {
  type: 'process';
  file: File;
  segments: TimelapseSegment[];
  frameRate: 24 | 30 | 60;
  quality: TimelapseQuality;
  format: TimelapseFormat;
  storageFileName: string;
};

type Response =
  | { type: 'log'; message: string }
  | { type: 'progress'; progress: number }
  | { type: 'completed'; storageFileName: string }
  | { type: 'failed'; code: TimelapseErrorCode };

type WorkerScope = {
  onmessage: ((event: MessageEvent<Request>) => void) | null;
  postMessage: (message: Response) => void;
};

const scope = self as unknown as WorkerScope;
const DIRECTORY = 'adtools-timelapse';

const report = (message: Response): void => scope.postMessage(message);

const errorCode = (error: unknown): TimelapseErrorCode => {
  const name = error && typeof error === 'object' && 'name' in error ? String(error.name) : '';
  const message = error instanceof Error ? error.message : String(error);
  if (name === 'NotSupportedError' || /codec|decoder|encoder|unsupported/i.test(message)) {
    return 'unsupported_codec';
  }
  if (name === 'QuotaExceededError' || /quota|disk full|storage is full/i.test(message)) {
    return 'storage_quota';
  }
  if (name === 'StorageUnavailableError' || /local file storage|origin private file system/i.test(message)) {
    return 'storage_unavailable';
  }
  return 'processing_failed';
};

const createTimestampSequence = function* (
  sourceStart: number,
  segment: TimelapseSegment,
  frameRate: number,
  outputOffset: number,
  firstOutputFrame: number,
): Generator<number> {
  const outputDuration = (segment.end - segment.start) / segment.speed;
  const outputEnd = outputOffset + outputDuration;
  for (let frame = firstOutputFrame; frame / frameRate < outputEnd - 0.000001; frame += 1) {
    const localOutputTime = frame / frameRate - outputOffset;
    yield sourceStart + segment.start + Math.min(localOutputTime * segment.speed, segment.end - segment.start - 0.001);
  }
};

const renderTimelapse = async (request: Request): Promise<void> => {
  if (typeof VideoEncoder === 'undefined' || typeof VideoDecoder === 'undefined') {
    throw Object.assign(new Error('WebCodecs is not available.'), { name: 'NotSupportedError' });
  }
  if (!navigator.storage || typeof navigator.storage.getDirectory !== 'function') {
    throw Object.assign(new Error('Local file storage is not available.'), { name: 'StorageUnavailableError' });
  }

  report({ type: 'log', message: 'Preparing the local video pipeline…' });
  const root = await navigator.storage.getDirectory();
  const directory = await root.getDirectoryHandle(DIRECTORY, { create: true });
  const outputHandle = await directory.getFileHandle(request.storageFileName, { create: true });
  const writable = await outputHandle.createWritable();
  const output = new Output({
    format: request.format === 'mp4'
      ? new Mp4OutputFormat({ fastStart: 'fragmented' })
      : new WebMOutputFormat(),
    target: new StreamTarget(writable, { chunked: true }),
  });
  let input: Input | undefined;
  let source: VideoSampleSource | undefined;

  try {
    input = new Input({ formats: ALL_FORMATS, source: new BlobSource(request.file) });
    const track = await input.getPrimaryVideoTrack();
    if (!track || !(await track.canDecode())) {
      throw Object.assign(new Error('The browser cannot decode this video.'), { name: 'NotSupportedError' });
    }

    const firstTimestamp = Math.max(0, await track.getFirstTimestamp());
    const codec = request.format === 'mp4' ? 'avc' : 'vp9';
    source = new VideoSampleSource({
      codec,
      quality: new Quality(request.quality),
    });
    output.addVideoTrack(source, {
      frameRate: request.frameRate,
      transformationMatrix: await track.getTransformationMatrix(),
    });
    await output.start();

    const sortedSegments = [...request.segments].sort((a, b) => a.start - b.start);
    const includedSegments = sortedSegments.filter((segment) => segment.include);
    const totalDuration = includedSegments.reduce(
      (sum, segment) => sum + (segment.end - segment.start) / segment.speed,
      0,
    );
    const totalFrames = Math.max(1, Math.ceil(totalDuration * request.frameRate));
    const sink = new VideoSampleSink(track);
    let outputOffset = 0;
    let completedFrames = 0;
    let lastReport = 0;

    for (const segment of includedSegments) {
      const segmentDuration = (segment.end - segment.start) / segment.speed;
      const sequence = createTimestampSequence(
        firstTimestamp,
        segment,
        request.frameRate,
        outputOffset,
        completedFrames,
      );

      for await (const sample of sink.samplesAtTimestamps(sequence)) {
        const outputTime = completedFrames / request.frameRate;
        completedFrames += 1;

        if (sample) {
          const writableSample = sample as VideoSample;
          writableSample.setTimestamp(outputTime);
          writableSample.setDuration(Math.min(1 / request.frameRate, totalDuration - outputTime));
          await source.add(writableSample);
          writableSample.close();
        }

        if (completedFrames - lastReport >= 24 || completedFrames === totalFrames) {
          report({ type: 'progress', progress: Math.min(0.97, completedFrames / totalFrames * 0.97) });
          lastReport = completedFrames;
        }
      }
      outputOffset += segmentDuration;
    }

    source.close();
    await output.finalize();
    input.dispose();
    input = undefined;
    report({ type: 'progress', progress: 1 });
    report({ type: 'completed', storageFileName: request.storageFileName });
  } catch (error) {
    input?.dispose();
    source?.close();
    await output.cancel().catch(() => undefined);
    await directory.removeEntry(request.storageFileName).catch(() => undefined);
    throw error;
  }
};

scope.onmessage = (event) => {
  if (event.data.type !== 'process') return;
  void renderTimelapse(event.data).catch((error: unknown) => {
    report({ type: 'failed', code: errorCode(error) });
  });
};
