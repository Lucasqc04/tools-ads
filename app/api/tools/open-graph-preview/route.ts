import { NextResponse } from 'next/server';
import { extractOpenGraphData } from '@/lib/open-graph-preview';

export const runtime = 'nodejs';

const defaultHeaders = {
  'Cache-Control': 'no-store',
};

type ManifestEntry = {
  src?: string;
  url?: string;
  href?: string;
  type?: string;
  sizes?: string;
  purpose?: string;
};

const safeAbsoluteUrl = (candidate: string, baseUrl: string): string => {
  if (!candidate.trim()) {
    return '';
  }

  try {
    return new URL(candidate, baseUrl).toString();
  } catch {
    return '';
  }
};

const dedupeBy = <T,>(items: T[], getKey: (item: T) => string): T[] => {
  const seen = new Set<string>();
  const result: T[] = [];

  items.forEach((item) => {
    const key = getKey(item);
    if (!key || seen.has(key)) {
      return;
    }

    seen.add(key);
    result.push(item);
  });

  return result;
};

const fetchJson = async (url: string, signal: AbortSignal): Promise<object | null> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      signal,
      headers: {
        'User-Agent': 'adtools-og-preview-bot/1.0 (+https://adtools.local)',
        Accept: 'application/json,text/plain,*/*',
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as object;
  } catch {
    return null;
  }
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
    const startedAt = Date.now();
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

    if (data.manifest) {
      const manifestPayload = await fetchJson(data.manifest, controller.signal);

      if (manifestPayload && typeof manifestPayload === 'object') {
        const manifestObject = manifestPayload as {
          icons?: ManifestEntry[];
          screenshots?: ManifestEntry[];
          shortcuts?: Array<{ url?: string; icons?: ManifestEntry[] }>;
        };

        const manifestIcons = (manifestObject.icons ?? [])
          .map((entry) => ({
            rel: 'manifest-icon',
            href: safeAbsoluteUrl(entry.src ?? entry.url ?? entry.href ?? '', data.manifest),
            type: entry.type ?? '',
            sizes: entry.sizes ?? '',
            media: '',
            color: '',
            purpose: entry.purpose ?? '',
          }))
          .filter((item) => Boolean(item.href));

        const manifestAssets = [
          ...(manifestObject.icons ?? []).map((entry) => ({
            url: safeAbsoluteUrl(entry.src ?? entry.url ?? entry.href ?? '', data.manifest),
            kind: 'icon' as const,
            source: 'manifest-icon',
            mimeHint: entry.type ?? '',
            sameOrigin: true,
          })),
          ...(manifestObject.screenshots ?? []).map((entry) => ({
            url: safeAbsoluteUrl(entry.src ?? entry.url ?? entry.href ?? '', data.manifest),
            kind: 'image' as const,
            source: 'manifest-screenshot',
            mimeHint: entry.type ?? 'image/*',
            sameOrigin: true,
          })),
          ...(manifestObject.shortcuts ?? []).flatMap((entry) => [
            ...(entry.url
              ? [{
                  url: safeAbsoluteUrl(entry.url, data.manifest),
                  kind: 'link' as const,
                  source: 'manifest-shortcut',
                  mimeHint: '',
                  sameOrigin: true,
                }]
              : []),
            ...((entry.icons ?? []).map((icon) => ({
              url: safeAbsoluteUrl(icon.src ?? icon.url ?? icon.href ?? '', data.manifest),
              kind: 'icon' as const,
              source: 'manifest-shortcut-icon',
              mimeHint: icon.type ?? '',
              sameOrigin: true,
            }))),
          ]),
        ].filter((item) => Boolean(item.url));

        data.icons = dedupeBy([...data.icons, ...manifestIcons], (item) => item.href);
        data.discoveredAssets = dedupeBy([...data.discoveredAssets, ...manifestAssets], (item) => item.url);
      }
    }
    const durationMs = Date.now() - startedAt;

    return NextResponse.json(
      {
        ok: true,
        fetchedUrl: response.url || targetUrl,
        data,
        fetchMeta: {
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get('content-type') || '',
          contentLength: response.headers.get('content-length') || '',
          server: response.headers.get('server') || '',
          cacheControl: response.headers.get('cache-control') || '',
          contentLanguage: response.headers.get('content-language') || '',
          xRobotsTag: response.headers.get('x-robots-tag') || '',
          durationMs,
          fetchedAt: new Date().toISOString(),
        },
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
