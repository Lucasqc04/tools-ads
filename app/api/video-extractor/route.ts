import { NextResponse } from 'next/server';
import { defaultErrorMessage, ExtractionError, httpStatusForError } from '@/lib/video-downloader/errors';
import { extractVideo } from '@/lib/video-downloader/extract';
import { acquireExtractionSlot, takeRequestSlot } from '@/lib/video-downloader/rate-limit';
import type { ExtractionErrorCode, ExtractionFailure } from '@/lib/video-downloader/types';
import { MAX_INPUT_LENGTH } from '@/lib/video-downloader/validate-url';

export const runtime = 'nodejs';
export const maxDuration = 15;

const MAX_BODY_BYTES = MAX_INPUT_LENGTH + 256;

const headers = {
  'Cache-Control': 'no-store',
  Allow: 'POST, OPTIONS',
};

const failure = (code: ExtractionErrorCode, extraHeaders: Record<string, string> = {}) => {
  const body: ExtractionFailure = {
    success: false,
    error: { code, message: defaultErrorMessage[code] },
  };

  return NextResponse.json(body, {
    status: httpStatusForError(code),
    headers: { ...headers, ...extraHeaders },
  });
};

const getClientKey = (request: Request): string =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  request.headers.get('x-real-ip') ||
  'unknown';

/** Browsers send Origin on cross-site POSTs; refuse other sites using this endpoint as a free extractor. */
const isSameOrigin = (request: Request): boolean => {
  const origin = request.headers.get('origin');
  if (!origin) {
    return true;
  }

  try {
    return new URL(origin).host === (request.headers.get('host') ?? new URL(request.url).host);
  } catch {
    return false;
  }
};

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return failure('access_blocked');
  }

  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return failure('bad_request');
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return failure('bad_request');
  }

  if (!takeRequestSlot(getClientKey(request))) {
    return failure('rate_limited', { 'Retry-After': '30' });
  }

  let url: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return failure('bad_request');
    }
    url = (JSON.parse(text) as { url?: unknown }).url;
  } catch {
    return failure('bad_request');
  }

  const release = acquireExtractionSlot();
  if (!release) {
    return failure('rate_limited', { 'Retry-After': '5' });
  }

  try {
    const result = await extractVideo(url);
    return NextResponse.json(result, { headers });
  } catch (error) {
    if (error instanceof ExtractionError) {
      return failure(error.code);
    }

    // Unknown failure: report a generic upstream error without echoing details or the URL.
    return failure('upstream_error');
  } finally {
    release();
  }
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers });
}

const methodNotAllowed = () =>
  NextResponse.json(
    { success: false, error: { code: 'bad_request', message: 'Use POST.' } },
    { status: 405, headers },
  );

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
