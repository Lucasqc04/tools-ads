'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  detectWebGpuSupport,
  getDeviceCapabilities,
  pickInferenceDevice,
  suggestQualityTier,
  type DeviceCapabilities,
} from '@/lib/transcription/capabilities';
import { decodeMediaFileToPcm } from '@/lib/transcription/audio-decoder';
import { TranscriptionClient } from '@/lib/transcription/transcription-client';
import {
  TranscriptionError,
  type InferenceDevice,
  type TranscriptionLanguageOption,
  type TranscriptionQuality,
  type TranscriptionTask,
  type TranscriptResult,
} from '@/lib/transcription/transcription-types';
import type { TranscriptionProgressPhase } from '@/lib/transcription/worker/worker-protocol';

export type TranscriptionStatus =
  | 'idle'
  | 'analyzing'
  | 'ready'
  | 'extracting-audio'
  | 'loading-model'
  | 'transcribing'
  | 'completed'
  | 'cancelled'
  | 'error';

export type TranscriptionProgress = {
  phase: TranscriptionProgressPhase | 'extracting-audio' | null;
  percent: number | null;
  processedSeconds?: number;
  totalSeconds?: number;
};

export type MediaKind = 'audio' | 'video';

const EMPTY_PROGRESS: TranscriptionProgress = { phase: null, percent: null };

const generateJobId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `job-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export function useTranscription() {
  const clientRef = useRef<TranscriptionClient | null>(null);
  const activeJobIdRef = useRef<string | null>(null);
  const pcmBufferRef = useRef<Float32Array | null>(null);
  const fileNameRef = useRef<string>('');

  const [status, setStatus] = useState<TranscriptionStatus>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState<MediaKind | null>(null);
  const [durationInSeconds, setDurationInSeconds] = useState<number | null>(null);
  const [quality, setQuality] = useState<TranscriptionQuality>('balanced');
  const [language, setLanguage] = useState<TranscriptionLanguageOption>('auto');
  const [task, setTask] = useState<TranscriptionTask>('transcribe');
  const [progress, setProgress] = useState<TranscriptionProgress>(EMPTY_PROGRESS);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [error, setError] = useState<TranscriptionError | null>(null);
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities | null>(null);
  const [modelFromCache, setModelFromCache] = useState<boolean | null>(null);
  const [usedDevice, setUsedDevice] = useState<InferenceDevice | null>(null);

  const getClient = useCallback((): TranscriptionClient => {
    if (!clientRef.current) {
      clientRef.current = new TranscriptionClient();
    }
    return clientRef.current;
  }, []);

  useEffect(() => {
    let cancelled = false;

    void getDeviceCapabilities().then((capabilities) => {
      if (!cancelled) {
        setDeviceCapabilities(capabilities);
        setQuality((current) => (current === 'balanced' ? suggestQualityTier(capabilities) : current));
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(
    () => () => {
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl);
      }
      clientRef.current?.dispose();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const selectFile = useCallback(
    (nextFile: File) => {
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl);
      }

      pcmBufferRef.current = null;
      setResult(null);
      setError(null);
      setProgress(EMPTY_PROGRESS);
      setModelFromCache(null);
      setUsedDevice(null);
      setStatus('analyzing');
      setFile(nextFile);
      fileNameRef.current = nextFile.name;

      const kind: MediaKind = nextFile.type.startsWith('video/') ? 'video' : 'audio';
      setMediaKind(kind);
      setMediaUrl(URL.createObjectURL(nextFile));

      void (async () => {
        try {
          const { readMediaDuration } = await import('@/lib/transcription/audio-decoder');
          const duration = await readMediaDuration(nextFile);
          setDurationInSeconds(duration);
          setStatus('ready');
        } catch {
          setDurationInSeconds(null);
          setStatus('ready');
        }
      })();
    },
    [mediaUrl],
  );

  const clearFile = useCallback(() => {
    if (activeJobIdRef.current) {
      getClient().cancel(activeJobIdRef.current);
      activeJobIdRef.current = null;
    }

    if (mediaUrl) {
      URL.revokeObjectURL(mediaUrl);
    }

    pcmBufferRef.current = null;
    setFile(null);
    setMediaUrl(null);
    setMediaKind(null);
    setDurationInSeconds(null);
    setResult(null);
    setError(null);
    setProgress(EMPTY_PROGRESS);
    setModelFromCache(null);
    setUsedDevice(null);
    setStatus('idle');
  }, [getClient, mediaUrl]);

  const start = useCallback(async () => {
    if (!file) {
      return;
    }

    const client = getClient();
    const jobId = generateJobId();
    activeJobIdRef.current = jobId;

    setError(null);
    setResult(null);
    setProgress(EMPTY_PROGRESS);
    setStatus('extracting-audio');

    let device: InferenceDevice = 'wasm';

    try {
      const webgpuAvailable = deviceCapabilities?.webgpuAvailable ?? (await detectWebGpuSupport());
      device = pickInferenceDevice({ webgpuAvailable });

      const decoded = await decodeMediaFileToPcm(file, () => {
        setProgress({ phase: 'extracting-audio', percent: null });
      });

      if (activeJobIdRef.current !== jobId) {
        return;
      }

      pcmBufferRef.current = decoded.channelData;
      setDurationInSeconds(decoded.durationInSeconds);
      setStatus('loading-model');
      setUsedDevice(device);

      client.beginJob(jobId, {
        onProgress: (phase, percent, processedSeconds, totalSeconds) => {
          if (activeJobIdRef.current !== jobId) {
            return;
          }

          setStatus(phase === 'transcribing' ? 'transcribing' : 'loading-model');
          setProgress({ phase, percent, processedSeconds, totalSeconds });
        },
        onModelReady: (fromCache) => {
          if (activeJobIdRef.current !== jobId) {
            return;
          }

          setModelFromCache(fromCache);
          setStatus('transcribing');
          setProgress({ phase: 'transcribing', percent: 0, totalSeconds: decoded.durationInSeconds });

          const audioForWorker = pcmBufferRef.current;
          if (!audioForWorker) {
            return;
          }

          client.transcribe(jobId, {
            audio: audioForWorker,
            durationInSeconds: decoded.durationInSeconds,
            fileName: fileNameRef.current,
            quality,
            device,
            language,
            task,
          });
          pcmBufferRef.current = null;
        },
        onResult: (transcriptResult) => {
          if (activeJobIdRef.current !== jobId) {
            return;
          }

          activeJobIdRef.current = null;
          setResult(transcriptResult);
          setProgress({ phase: 'transcribing', percent: 100 });
          setStatus('completed');
        },
        onCancelled: () => {
          if (activeJobIdRef.current !== jobId) {
            return;
          }

          activeJobIdRef.current = null;
          setStatus('cancelled');
        },
        onError: (transcriptionError) => {
          if (activeJobIdRef.current !== jobId) {
            return;
          }

          activeJobIdRef.current = null;
          setError(transcriptionError);
          setStatus('error');
        },
      });

      client.loadModel(jobId, quality, device);
    } catch (error_) {
      if (activeJobIdRef.current !== jobId) {
        return;
      }

      activeJobIdRef.current = null;

      if (error_ instanceof TranscriptionError) {
        setError(error_);
      } else {
        const message = error_ instanceof Error ? error_.message : String(error_);
        setError(new TranscriptionError('unknown', message));
      }

      setStatus('error');
    }
  }, [deviceCapabilities, file, getClient, language, quality, task]);

  const cancel = useCallback(() => {
    const jobId = activeJobIdRef.current;
    if (!jobId) {
      return;
    }

    // Invalidate the job on the client side immediately: this also covers
    // the "extracting-audio" phase, which runs on the main thread before
    // any worker message exists for the worker-side CANCEL to target.
    // Any in-flight `start()` continuation checks this ref and bails out.
    activeJobIdRef.current = null;
    pcmBufferRef.current = null;
    getClient().cancel(jobId);
    setStatus('cancelled');
  }, [getClient]);

  const reset = useCallback(() => {
    clearFile();
  }, [clearFile]);

  return {
    status,
    file,
    mediaUrl,
    mediaKind,
    durationInSeconds,
    quality,
    language,
    task,
    progress,
    result,
    error,
    deviceCapabilities,
    usedDevice,
    modelFromCache,
    selectFile,
    clearFile,
    setQuality,
    setLanguage,
    setTask,
    start,
    cancel,
    reset,
  } as const;
}
