import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_VIDEO_SIZE_BYTES = 512 * 1024 * 1024;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

type CompressionProfile = {
  crf: number;
  audioBitrateKbps: number;
  downscaleFactor: number;
  targetBitrateKbps: number;
};

type CommandAttempt = {
  label: string;
  buildArgs: (inputPath: string, outputPath: string) => string[];
};

const parseCompressionLevel = (value: FormDataEntryValue | null): number => {
  if (typeof value !== 'string') {
    return 58;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 58;
  }

  return clamp(Math.floor(parsed), 1, 100);
};

const getCompressionProfile = (compressionLevel: number): CompressionProfile => {
  const normalized = clamp(compressionLevel / 100, 0, 1);

  return {
    crf: Math.round(20 + normalized * 17),
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
    targetBitrateKbps: clamp(Math.round(5200 - normalized * 4200), 320, 5200),
  };
};

const getScaleFilter = (downscaleFactor: number): string | undefined => {
  if (downscaleFactor >= 0.995) {
    return undefined;
  }

  return `scale=trunc(iw*${downscaleFactor}/2)*2:trunc(ih*${downscaleFactor}/2)*2`;
};

const getSanitizedName = (fileName: string): string =>
  fileName
    .replace(/\.[^.]+$/, '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'video';

const runFfmpeg = async (
  ffmpegBinary: string,
  args: string[],
  label: string,
): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn(ffmpegBinary, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const stderrLines: string[] = [];

    ffmpeg.stderr.on('data', (chunk: Buffer) => {
      const next = chunk.toString('utf8');
      const lines = next
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      stderrLines.push(...lines);

      if (stderrLines.length > 20) {
        stderrLines.splice(0, stderrLines.length - 20);
      }
    });

    ffmpeg.on('error', (error) => {
      reject(new Error(`${label}: ${error.message}`));
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      const details = stderrLines.slice(-3).join(' | ');
      reject(new Error(`${label} falhou (codigo ${code ?? 'desconhecido'}). ${details}`));
    });
  });
};

const isVideoFile = (file: File): boolean => {
  if (file.type.startsWith('video/')) {
    return true;
  }

  return /\.(mp4|mov|m4v|webm|ogv|mkv)$/i.test(file.name);
};

export async function POST(request: Request) {
  const ffmpegBinary = process.env.FFMPEG_PATH || 'ffmpeg';
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'adtools-video-'));

  try {
    const formData = await request.formData();
    const fileEntry = formData.get('file');

    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ error: 'Arquivo de video nao enviado.' }, { status: 400 });
    }

    if (!isVideoFile(fileEntry)) {
      return NextResponse.json({ error: 'Formato de video nao suportado.' }, { status: 400 });
    }

    if (fileEntry.size > MAX_VIDEO_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Arquivo muito grande para compressao via API (maximo de 512MB).' },
        { status: 413 },
      );
    }

    const compressionLevel = parseCompressionLevel(formData.get('compressionLevel'));
    const profile = getCompressionProfile(compressionLevel);
    const scaleFilter = getScaleFilter(profile.downscaleFactor);

    const sourceExt = path.extname(fileEntry.name).replace('.', '').toLowerCase() || 'mp4';
    const inputPath = path.join(tempDir, `input.${sourceExt}`);
    const outputPath = path.join(tempDir, 'output.mp4');

    const sourceBuffer = Buffer.from(await fileEntry.arrayBuffer());
    await writeFile(inputPath, sourceBuffer);

    const attempts: CommandAttempt[] = [
      {
        label: 'h264-com-audio',
        buildArgs: (inPath, outPath) => [
          '-y',
          '-i',
          inPath,
          ...(scaleFilter ? ['-vf', scaleFilter] : []),
          '-c:v',
          'libx264',
          '-preset',
          'veryfast',
          '-crf',
          String(profile.crf),
          '-c:a',
          'aac',
          '-b:a',
          `${profile.audioBitrateKbps}k`,
          '-movflags',
          '+faststart',
          '-pix_fmt',
          'yuv420p',
          outPath,
        ],
      },
      {
        label: 'mpeg4-com-audio',
        buildArgs: (inPath, outPath) => [
          '-y',
          '-i',
          inPath,
          ...(scaleFilter ? ['-vf', scaleFilter] : []),
          '-c:v',
          'mpeg4',
          '-b:v',
          `${profile.targetBitrateKbps}k`,
          '-c:a',
          'aac',
          '-b:a',
          `${profile.audioBitrateKbps}k`,
          '-movflags',
          '+faststart',
          '-pix_fmt',
          'yuv420p',
          outPath,
        ],
      },
      {
        label: 'mpeg4-sem-audio',
        buildArgs: (inPath, outPath) => [
          '-y',
          '-i',
          inPath,
          ...(scaleFilter ? ['-vf', scaleFilter] : []),
          '-c:v',
          'mpeg4',
          '-b:v',
          `${profile.targetBitrateKbps}k`,
          '-an',
          '-movflags',
          '+faststart',
          '-pix_fmt',
          'yuv420p',
          outPath,
        ],
      },
    ];

    const failures: string[] = [];
    let succeeded = false;

    for (const attempt of attempts) {
      try {
        await runFfmpeg(ffmpegBinary, attempt.buildArgs(inputPath, outputPath), attempt.label);
        succeeded = true;
        break;
      } catch (error) {
        failures.push(error instanceof Error ? error.message : String(error));
      }
    }

    if (!succeeded) {
      return NextResponse.json(
        {
          error: `Falha ao comprimir video no servidor. ${failures.slice(-2).join(' | ')}`,
        },
        { status: 500 },
      );
    }

    const outputStats = await stat(outputPath).catch(() => null);
    if (!outputStats || outputStats.size <= 0) {
      return NextResponse.json(
        { error: 'Saida de video invalida apos compressao.' },
        { status: 500 },
      );
    }

    const outputBuffer = await readFile(outputPath);
    const outputName = `${getSanitizedName(fileEntry.name)}-compressed.mp4`;

    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${outputName}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado na compressao.';

    return NextResponse.json(
      {
        error: `Falha ao processar compressao no servidor: ${message}`,
      },
      { status: 500 },
    );
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
  }
}
