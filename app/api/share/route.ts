import { NextRequest, NextResponse } from 'next/server';

/**
 * Web Share Target API - recebe dados compartilhados via navigator.share()
 * Redireciona para a página de transfer com o dados em query params
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const text = formData.get('text') as string | null;
    const title = formData.get('title') as string | null;

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

    // Codifica o JSON para passar na URL
    const encoded = encodeURIComponent(text);
    const isOfferParam = isOffer ? 'true' : 'false';

    // Redireciona para transfer com os dados
    // Usa locale padrão (pt-br) ou detecta pelo header Accept-Language
    const locale = 'pt-br'; // Pode ser melhorado com Accept-Language

    return NextResponse.redirect(
      new URL(
        `/pt-br/tools/transfer?share_text=${encoded}&share_type=${isOfferParam ? 'offer' : 'answer'}`,
        request.url,
      ),
      { status: 303 },
    );
  } catch (error) {
    console.error('Share API error:', error);
    return NextResponse.redirect(new URL('/pt-br/tools/transfer', request.url), {
      status: 303,
    });
  }
}
