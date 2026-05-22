import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import {
  extractMailgunRecipient,
  saveInboundMessage,
  verifyMailgunSignature,
} from '@/lib/temp-email';
import type { TempEmailMessage } from '@/types/temp-email';

export const runtime = 'nodejs';

const defaultHeaders = {
  'Cache-Control': 'no-store',
};

const readField = (formData: FormData, fieldName: string): string => {
  const value = formData.get(fieldName);
  return typeof value === 'string' ? value : '';
};

export async function POST(request: Request) {
  const signingKey = process.env.MAILGUN_WEBHOOK_SIGNING_KEY?.trim() ?? '';

  if (!signingKey) {
    return NextResponse.json(
      {
        error: 'MAILGUN_WEBHOOK_SIGNING_KEY nao configurado.',
      },
      {
        status: 503,
        headers: defaultHeaders,
      },
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      {
        error: 'Payload invalido.',
      },
      {
        status: 400,
        headers: defaultHeaders,
      },
    );
  }

  const timestamp = readField(formData, 'timestamp');
  const token = readField(formData, 'token');
  const signature = readField(formData, 'signature');

  const signatureIsValid = verifyMailgunSignature({
    timestamp,
    token,
    signature,
    signingKey,
  });

  if (!signatureIsValid) {
    return NextResponse.json(
      {
        error: 'Assinatura Mailgun invalida.',
      },
      {
        status: 401,
        headers: defaultHeaders,
      },
    );
  }

  const recipient = extractMailgunRecipient(readField(formData, 'recipient'));

  if (!recipient) {
    return NextResponse.json(
      {
        ok: true,
      },
      {
        status: 200,
        headers: defaultHeaders,
      },
    );
  }

  const inboundMessage: TempEmailMessage = {
    id: crypto.randomUUID(),
    from: readField(formData, 'sender'),
    to: recipient,
    subject: readField(formData, 'subject'),
    text: readField(formData, 'body-plain') || undefined,
    html: readField(formData, 'body-html') || undefined,
    receivedAt: new Date().toISOString(),
  };

  try {
    await saveInboundMessage(recipient, inboundMessage);
  } catch {
    return NextResponse.json(
      {
        ok: true,
      },
      {
        status: 200,
        headers: defaultHeaders,
      },
    );
  }

  return NextResponse.json(
    {
      ok: true,
    },
    {
      status: 200,
      headers: defaultHeaders,
    },
  );
}
