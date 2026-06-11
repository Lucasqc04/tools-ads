import { NextRequest, NextResponse } from 'next/server';

/**
 * Web Share Target API - recebe dados compartilhados via navigator.share()
 * Redireciona para a página de transfer com o dados em query params
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const text = formData.get('text') as string | null;

    if (!text) {
      return NextResponse.redirect(new URL('/pt-br/tools/transfer', request.url), {
        status: 303,
      });
    }

    // Detecta se é offer ou answer baseado no conteúdo JSON
    let isOffer = false;
    try {
      const json = JSON.parse(text);
      isOffer = json.type === 'offer' || (json.sdp && json.sdp.includes('a=group:BUNDLE'));
    } catch {
      // Ignora se não for JSON válido
    }

    // Redireciona para transfer com os dados
    // Nota: URLSearchParams faz o encoding automaticamente
    const target = new URL('/pt-br/tools/transfer', request.url);
    target.searchParams.set('share_text', text);
    target.searchParams.set('share_type', isOffer ? 'offer' : 'answer');

    return NextResponse.redirect(target, { status: 303 });
  } catch (error) {
    console.error('Share API error:', error);
    return NextResponse.redirect(new URL('/pt-br/tools/transfer', request.url), {
      status: 303,
    });
  }
}
