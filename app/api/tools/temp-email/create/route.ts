import { NextResponse } from 'next/server';
import {
  checkCreateInboxRateLimit,
  createTempInbox,
  getClientIpFromHeaders,
} from '@/lib/temp-email';
import { TempEmailStoreUnavailableError } from '@/lib/temp-email-store';

export const runtime = 'nodejs';

const defaultHeaders = {
  'Cache-Control': 'no-store',
};

export async function POST(request: Request) {
  const clientIp = getClientIpFromHeaders(request.headers);

  try {
    const rateLimit = await checkCreateInboxRateLimit(clientIp);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Muitas requisicoes. Aguarde alguns segundos e tente novamente.',
        },
        {
          status: 429,
          headers: {
            ...defaultHeaders,
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const inbox = await createTempInbox();

    return NextResponse.json(inbox, {
      status: 201,
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

    if (error instanceof Error && error.message.includes('TEMP_EMAIL_DOMAIN')) {
      return NextResponse.json(
        {
          error: 'Ferramenta indisponivel: dominio temporario nao configurado.',
        },
        {
          status: 503,
          headers: defaultHeaders,
        },
      );
    }

    return NextResponse.json(
      {
        error: 'Nao foi possivel gerar um e-mail temporario agora.',
      },
      {
        status: 500,
        headers: defaultHeaders,
      },
    );
  }
}
