import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const ffmpegAssets = {
  'ffmpeg-core.js': 'text/javascript; charset=utf-8',
  'ffmpeg-core.wasm': 'application/wasm',
} as const;

type FfmpegAssetName = keyof typeof ffmpegAssets;

const isValidAsset = (value: string): value is FfmpegAssetName =>
  Object.prototype.hasOwnProperty.call(ffmpegAssets, value);

const ffmpegCoreDir = path.join(process.cwd(), 'node_modules', '@ffmpeg', 'core', 'dist', 'umd');

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const requestedAsset = requestUrl.searchParams.get('asset');

  if (!requestedAsset || !isValidAsset(requestedAsset)) {
    return NextResponse.json({ error: 'Parametro "asset" invalido.' }, { status: 400 });
  }

  const assetPath = path.join(ffmpegCoreDir, requestedAsset);

  try {
    const data = await readFile(assetPath);

    return new NextResponse(data, {
      headers: {
        'Content-Type': ffmpegAssets[requestedAsset],
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json(
      { error: `Asset do FFmpeg nao encontrado: ${requestedAsset}` },
      { status: 404 },
    );
  }
}
