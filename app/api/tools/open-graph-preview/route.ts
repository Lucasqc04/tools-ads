import { NextResponse } from 'next/server';
import { extractOpenGraphData } from '@/lib/open-graph-preview';

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
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Nao foi possivel acessar a URL (status ${response.status}).`,
        },
        {
          status: 502,
          headers: defaultHeaders,
        },
      );
    }

    const html = await response.text();
    const data = extractOpenGraphData(html, response.url || targetUrl);

    return NextResponse.json(
      {
        ok: true,
        fetchedUrl: response.url || targetUrl,
        data,
      },
      {
        status: 200,
        headers: defaultHeaders,
      },
    );
  } catch {
    return NextResponse.json(
      {
        error: 'Falha ao buscar a URL informada no momento.',
      },
      {
        status: 500,
        headers: defaultHeaders,
      },
    );
  }
}
