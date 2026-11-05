import { NextResponse } from 'next/server';
import {
  fetchPublicUrl,
  PublicUrlFetchError,
} from '@/lib/safe-public-url-fetch';

export const runtime = 'nodejs';

const defaultHeaders = {
  'Cache-Control': 'no-store',
};

const isValidPublicUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const targetUrl = requestUrl.searchParams.get('url')?.trim() ?? '';

  if (!isValidPublicUrl(targetUrl)) {
    return NextResponse.json(
      {
        error: 'URL inválida. Use um endereço público com HTTP ou HTTPS.',
      },
      {
        status: 400,
        headers: defaultHeaders,
      },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetchPublicUrl(new URL(targetUrl), {
      signal: controller.signal,
      userAgent: 'adtools-og-preview-bot/1.0 (+https://tools.lucasqc.com)',
      accept: '*/*',
      maxBytes: 15_000_000,
    });

    return new NextResponse(new Uint8Array(response.body), {
      status: 200,
      headers: {
        ...defaultHeaders,
        'Content-Type': response.headers['content-type'] || 'application/octet-stream',
      },
    });
  } catch (error) {
    const isUnsafeUrl = error instanceof PublicUrlFetchError && error.code === 'unsafe_url';

    return NextResponse.json(
      {
        error: isUnsafeUrl
          ? 'Este endereço não pode ser consultado. Use uma página pública em HTTP ou HTTPS.'
          : 'Falha ao baixar o arquivo informado no momento.',
      },
      {
        status: isUnsafeUrl ? 400 : 502,
        headers: defaultHeaders,
      },
    );
  } finally {
    clearTimeout(timeout);
  }
}
