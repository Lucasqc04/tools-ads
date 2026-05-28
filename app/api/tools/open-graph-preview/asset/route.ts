import { NextResponse } from 'next/server';

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
        error: 'URL invalida. Use endereco publico com http ou https.',
      },
      {
        status: 400,
        headers: defaultHeaders,
      },
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(targetUrl, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'User-Agent': 'adtools-og-preview-bot/1.0 (+https://adtools.local)',
        Accept: '*/*',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Nao foi possivel baixar o arquivo (status ${response.status}).`,
        },
        {
          status: 502,
          headers: defaultHeaders,
        },
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        ...defaultHeaders,
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: 'Falha ao baixar o arquivo informado no momento.',
      },
      {
        status: 500,
        headers: defaultHeaders,
      },
    );
  }
}
