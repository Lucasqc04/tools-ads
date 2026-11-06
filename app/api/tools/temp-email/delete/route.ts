import { NextResponse } from 'next/server';
import { deleteTempInbox, isValidTempEmailToken } from '@/lib/temp-email';
import { TempEmailStoreUnavailableError } from '@/lib/temp-email-store';

export const runtime = 'nodejs';

const defaultHeaders = {
  'Cache-Control': 'no-store',
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export async function DELETE(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: 'Corpo da requisição inválido.',
      },
      {
        status: 400,
        headers: defaultHeaders,
      },
    );
  }

  const token =
    isPlainObject(body) && typeof body.token === 'string'
      ? body.token.trim().toLowerCase()
      : '';

  if (!isValidTempEmailToken(token)) {
    return NextResponse.json(
      {
        error: 'Token inválido.',
      },
      {
        status: 400,
        headers: defaultHeaders,
      },
    );
  }

  try {
    await deleteTempInbox(token);

    return NextResponse.json(
      {
        ok: true,
      },
      {
        status: 200,
        headers: defaultHeaders,
      },
    );
  } catch (error: unknown) {
    if (error instanceof TempEmailStoreUnavailableError) {
      return NextResponse.json(
        {
          error: 'Serviço de inbox temporária indisponível no momento. Tente novamente.',
        },
        {
          status: 503,
          headers: defaultHeaders,
        },
      );
    }

    return NextResponse.json(
      {
        error: 'Não foi possível apagar esta inbox temporária agora.',
      },
      {
        status: 500,
        headers: defaultHeaders,
      },
    );
  }
}
