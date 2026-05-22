import { NextResponse } from 'next/server';
import { getTempInboxMessages, isValidTempEmailToken } from '@/lib/temp-email';
import { TempEmailStoreUnavailableError } from '@/lib/temp-email-store';

export const runtime = 'nodejs';

const defaultHeaders = {
  'Cache-Control': 'no-store',
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get('token')?.trim().toLowerCase() ?? '';

  if (!isValidTempEmailToken(token)) {
    return NextResponse.json(
      {
        error: 'Token invalido.',
      },
      {
        status: 400,
        headers: defaultHeaders,
      },
    );
  }

  try {
    const payload = await getTempInboxMessages(token);

    if ('expired' in payload && payload.expired) {
      return NextResponse.json(
        {
          expired: true,
          messages: [],
        },
        {
          status: 200,
          headers: defaultHeaders,
        },
      );
    }

    return NextResponse.json(payload, {
      status: 200,
      headers: defaultHeaders,
    });
  } catch (error: unknown) {
    if (error instanceof TempEmailStoreUnavailableError) {
      return NextResponse.json(
        {
          error: 'Servico de inbox temporaria indisponivel no momento. Tente novamente.',
        },
        {
          status: 503,
          headers: defaultHeaders,
        },
      );
    }

    return NextResponse.json(
      {
        error: 'Nao foi possivel consultar mensagens agora.',
      },
      {
        status: 500,
        headers: defaultHeaders,
      },
    );
  }
}
