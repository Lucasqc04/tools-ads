import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_ZPL_BYTES = 3 * 1024 * 1024;
const PROVIDER_TIMEOUT_MS = 15_000;

type ZplRenderBody = {
  zpl?: unknown;
  dpi?: unknown;
  widthMm?: unknown;
  heightMm?: unknown;
  format?: unknown;
};

const safeNumber = (value: unknown, fallback: number, min: number, max: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
};

const dpiToDpmm = (dpi: number): 8 | 12 | 24 => {
  if (dpi >= 500) return 24;
  if (dpi >= 250) return 12;
  return 8;
};

export async function POST(request: NextRequest) {
  let body: ZplRenderBody;

  try {
    body = (await request.json()) as ZplRenderBody;
  } catch {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  const zpl = typeof body.zpl === 'string' ? body.zpl.trim() : '';
  if (!zpl || !/\^XA/i.test(zpl) || !/\^XZ/i.test(zpl)) {
    return NextResponse.json({ error: 'invalid_zpl' }, { status: 422 });
  }

  if (new TextEncoder().encode(zpl).byteLength > MAX_ZPL_BYTES) {
    return NextResponse.json({ error: 'file_too_large' }, { status: 413 });
  }

  const dpi = safeNumber(body.dpi, 203, 150, 650);
  const widthMm = safeNumber(body.widthMm, 100, 10, 500);
  const heightMm = safeNumber(body.heightMm, 150, 10, 1000);
  const format = body.format === 'pdf' ? 'pdf' : 'png';
  const widthInches = (widthMm / 25.4).toFixed(3);
  const heightInches = (heightMm / 25.4).toFixed(3);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    const providerResponse = await fetch(
      `https://api.labelary.com/v1/printers/${dpiToDpmm(dpi)}dpmm/labels/${widthInches}x${heightInches}/0/`,
      {
        method: 'POST',
        headers: {
          accept: format === 'pdf' ? 'application/pdf' : 'image/png',
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: zpl,
        signal: controller.signal,
        cache: 'no-store',
      },
    );

    if (!providerResponse.ok || !providerResponse.body) {
      const providerMessage = (await providerResponse.text()).slice(0, 600);
      return NextResponse.json(
        {
          error:
            providerResponse.status === 429
              ? 'rate_limited'
              : providerResponse.status >= 400 && providerResponse.status < 500
                ? 'zpl_render_error'
                : 'provider_unavailable',
          detail: providerMessage || undefined,
        },
        { status: providerResponse.status === 429 ? 429 : 502 },
      );
    }

    return new NextResponse(providerResponse.body, {
      status: 200,
      headers: {
        'content-type': format === 'pdf' ? 'application/pdf' : 'image/png',
        'cache-control': 'private, max-age=300',
        'x-zpl-renderer': 'labelary',
      },
    });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    return NextResponse.json({ error: isTimeout ? 'timeout' : 'provider_unavailable' }, { status: 503 });
  } finally {
    clearTimeout(timeout);
  }
}
