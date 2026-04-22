import { writeFile, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { NextResponse } from 'next/server';
import { buildConvertedFileName } from '@/lib/image-conversion';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as any;

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tmpDir = os.tmpdir();
    const safeName = (file.name ? String(file.name) : `upload-${Date.now()}`).replace(/[^
\w.\-]/g, '_');
    const inputPath = path.join(tmpDir, `${Date.now()}-${safeName}`);
    const outputPath = `${inputPath}.jpg`;

    await writeFile(inputPath, buffer);

    // dynamic import to avoid build-time failures when packages are not installed
    let ffmpegPath: string | undefined;
    let ffmpeg: any;

    try {
      const ffmpegStaticMod = await import('ffmpeg-static');
      ffmpegPath = (ffmpegStaticMod && (ffmpegStaticMod.default ?? ffmpegStaticMod)) as string;
    } catch (err) {
      // will error below if no binary available
    }

    try {
      const ffmpegMod = await import('fluent-ffmpeg');
      ffmpeg = (ffmpegMod && (ffmpegMod.default ?? ffmpegMod)) as any;
    } catch (err) {
      throw new Error('Dependência fluent-ffmpeg não instalada. Rode npm install fluent-ffmpeg ffmpeg-static');
    }

    if (ffmpeg && typeof ffmpeg.setFfmpegPath === 'function' && ffmpegPath) {
      ffmpeg.setFfmpegPath(ffmpegPath);
    }

    try {
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .outputOptions(['-y'])
          .output(outputPath)
          .on('end', () => resolve())
          .on('error', (err: any) => reject(err))
          .run();
      });

      const out = await readFile(outputPath);
      const filename = buildConvertedFileName(safeName, 'jpeg');

      return new NextResponse(out, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } finally {
      await unlink(inputPath).catch(() => undefined);
      await unlink(outputPath).catch(() => undefined);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
