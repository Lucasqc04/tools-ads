import { spawn } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_IMAGE_SIZE_BYTES = 50 * 1024 * 1024;

const sanitizeBaseName = (fileName: string): string => {
  const withoutExtension = fileName.replace(/\.[^.]+$/, '');
  const normalized = withoutExtension
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'arquivo-convertido';
};

const getConvertedFileName = (sourceName: string): string => `${sanitizeBaseName(sourceName)}.jpg`;

const isHeicLikeFile = (file: File): boolean => {
  if (file.type === 'image/heic' || file.type === 'image/heif') {
    return true;
  }

  return /\.(heic|heif)$/i.test(file.name);
};

const runCommand = async (binary: string, args: string[], label: string): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const proc = spawn(binary, args, {
      stdio: ['ignore', 'ignore', 'pipe'],
    });

    const stderrLines: string[] = [];

    proc.stderr.on('data', (chunk: Buffer) => {
      const lines = chunk
        .toString('utf8')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      stderrLines.push(...lines);

      if (stderrLines.length > 20) {
        stderrLines.splice(0, stderrLines.length - 20);
      }
    });

    proc.on('error', (error) => {
      reject(new Error(`${label}: ${error.message}`));
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      const details = stderrLines.slice(-4).join(' | ');
      reject(
        new Error(`${label} falhou (codigo ${code ?? 'desconhecido'}). ${details}`.trim()),
      );
    });
  });
};

const listHeifConvertedCandidates = async (
  tempDir: string,
  outputStem: string,
): Promise<string[]> => {
  const files = await readdir(tempDir);
  const baseName = `${outputStem}.jpg`;
  const prefixed = `${outputStem}-`;
  const candidates = files
    .filter(
      (name) => name === baseName || (name.startsWith(prefixed) && name.toLowerCase().endsWith('.jpg')),
    )
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' }))
    .map((fileName) => path.join(tempDir, fileName));

  return candidates;
};

const pickFirstNonEmptyFile = async (candidates: string[]): Promise<string | null> => {
  for (const candidate of candidates) {
    const fileStats = await stat(candidate).catch(() => null);
    if (fileStats && fileStats.size > 0) {
      return candidate;
    }
  }

  return null;
};

export async function POST(request: Request) {
  const ffmpegBinary = process.env.FFMPEG_PATH || 'ffmpeg';
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'adtools-heic-'));

  try {
    const formData = await request.formData();
    const fileEntry = formData.get('file');

    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    if (!isHeicLikeFile(fileEntry)) {
      return NextResponse.json(
        { error: 'Formato invalido. Envie um arquivo HEIC ou HEIF.' },
        { status: 400 },
      );
    }

    if (fileEntry.size <= 0) {
      return NextResponse.json({ error: 'Arquivo vazio.' }, { status: 400 });
    }

    if (fileEntry.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Limite de 50MB para conversao HEIC.' },
        { status: 413 },
      );
    }

    const inputExt = path.extname(fileEntry.name).replace('.', '').toLowerCase() || 'heic';
    const inputPath = path.join(tempDir, `input.${inputExt}`);
    const ffmpegOutputPath = path.join(tempDir, 'output-ffmpeg.jpg');
    const heifOutputStem = 'output-heif';
    const heifOutputTarget = path.join(tempDir, `${heifOutputStem}.jpg`);

    const buffer = Buffer.from(await fileEntry.arrayBuffer());
    await writeFile(inputPath, buffer);

    const failures: string[] = [];
    let outputPath: string | null = null;

    try {
      await runCommand(
        'heif-convert',
        ['-q', '92', '-o', heifOutputTarget, inputPath],
        'Conversao via heif-convert',
      );
      const candidates = await listHeifConvertedCandidates(tempDir, heifOutputStem);
      outputPath = await pickFirstNonEmptyFile(candidates);

      if (!outputPath) {
        throw new Error('heif-convert concluiu sem gerar um JPEG valido.');
      }
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }

    if (!outputPath) {
      try {
        await runCommand(
          ffmpegBinary,
          [
            '-y',
            '-hide_banner',
            '-loglevel',
            'error',
            '-i',
            inputPath,
            '-frames:v',
            '1',
            '-q:v',
            '2',
            '-vf',
            'format=yuv420p',
            ffmpegOutputPath,
          ],
          'Conversao via ffmpeg',
        );
        const ffmpegOutput = await pickFirstNonEmptyFile([ffmpegOutputPath]);
        if (!ffmpegOutput) {
          throw new Error('ffmpeg concluiu sem gerar um JPEG valido.');
        }
        outputPath = ffmpegOutput;
      } catch (error) {
        failures.push(error instanceof Error ? error.message : String(error));
      }
    }

    if (!outputPath) {
      return NextResponse.json(
        {
          error: `Falha ao converter HEIC/HEIF no servidor. ${failures.slice(-2).join(' | ')}`,
        },
        { status: 500 },
      );
    }

    const outBuffer = await readFile(outputPath);
    const outputName = getConvertedFileName(fileEntry.name);

    return new NextResponse(outBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="${outputName}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Falha inesperada ao converter HEIC/HEIF para JPEG.';

    return NextResponse.json(
      {
        error: `Falha ao converter HEIC/HEIF: ${message}`,
      },
      { status: 500 },
    );
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
  }
}
