import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type JwtDecoderLocaleContent = {
  name: string;
  shortDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

const contentByLocale: Record<AppLocale, JwtDecoderLocaleContent> = {
  'pt-br': {
    name: 'JWT Decoder Online',
    shortDescription: 'Decodifique JWT e visualize header, payload e assinatura com JSON legivel, alertas de claims e datas.',
    primaryKeyword: 'jwt decoder online',
    secondaryKeywords: ['decodificar jwt', 'ler token jwt', 'jwt payload decoder', 'jwt header payload', 'jwt exp iat nbf'],
    searchIntent: 'Devs que precisam inspecionar rapidamente tokens JWT para debug de auth, API e sessoes.',
    seoTitle: 'JWT Decoder Online | Header, Payload e Claims JWT',
    seoDescription: 'Cole seu JWT e veja header, payload e signature com JSON formatado, exp/iat/nbf legiveis e alertas claros de token malformado.',
    h1: 'JWT Decoder Online com Header, Payload e Claims',
    intro: 'Decodifique tokens JWT no navegador, visualize claims comuns e entenda expiracao sem precisar instalar extensoes.',
    contentBlocks: [
      {
        title: 'Como funciona o JWT Decoder',
        paragraphs: [
          'Um token JWT possui tres partes: header, payload e assinatura. Esta ferramenta separa essas partes e mostra o header e o payload em JSON legivel para facilitar depuracao.',
          'O objetivo e acelerar analise de integracoes, autenticacao e testes de API quando voce recebe um token e precisa saber exatamente quais claims estao presentes.',
        ],
      },
      {
        title: 'Claims comuns e datas legiveis',
        paragraphs: [
          'Campos como exp, iat e nbf costumam vir em timestamp Unix. O decoder converte esses valores para datas legiveis para voce identificar rapidamente validade e janela de uso.',
          'Tambem destacamos iss, aud, sub e role para facilitar validacao manual de contexto antes de testar seu fluxo de autorizacao.',
        ],
      },
      {
        title: 'Limites e seguranca',
        paragraphs: [
          'Decodificar JWT nao significa validar assinatura. Um token pode ser decodificado mesmo sem autenticidade. Por isso, use esta pagina para inspeção e debug, nao para confiar no token automaticamente.',
          'O processamento ocorre localmente no navegador. Nao ha envio obrigatorio do token para backend da ferramenta.',
        ],
      },
    ],
    faq: [
      { question: 'Essa ferramenta valida a assinatura do JWT?', answer: 'Nao. Ela apenas decodifica e exibe as partes do token. A validacao criptografica deve ser feita no servidor ou ambiente confiavel.' },
      { question: 'Consigo ver se o token expirou?', answer: 'Sim. Quando o campo exp existe, mostramos a data e um indicativo de expirado ou ainda valido.' },
      { question: 'Meus dados sao enviados para servidor?', answer: 'Nao por padrao. O processamento acontece localmente no navegador.' },
      { question: 'Funciona em celular?', answer: 'Sim. A interface foi pensada para funcionar em desktop e mobile.' },
    ],
  },
  en: {
    name: 'JWT Decoder Online',
    shortDescription: 'Decode JWT and inspect header, payload, and signature with readable JSON, claim highlights, and timestamp conversion.',
    primaryKeyword: 'jwt decoder online',
    secondaryKeywords: ['decode jwt', 'jwt payload decoder', 'jwt token inspector', 'jwt exp claim reader', 'jwt debug tool'],
    searchIntent: 'Developers who need to inspect JWT tokens for authentication, API, and session debugging.',
    seoTitle: 'JWT Decoder Online | Header, Payload, Signature',
    seoDescription: 'Paste a JWT and inspect header, payload, signature, and common claims like exp, iat, nbf, iss, aud, and sub.',
    h1: 'JWT Decoder Online for Header and Payload Inspection',
    intro: 'Quickly decode JWT tokens in-browser and inspect claims with readable JSON and friendly validation messages.',
    contentBlocks: [
      {
        title: 'What this JWT decoder does',
        paragraphs: [
          'JWT contains three dot-separated parts: header, payload, and signature. This page separates those parts and formats the first two into readable JSON.',
          'It is useful for API troubleshooting, auth testing, and integration checks when you need to inspect token content fast.',
        ],
      },
      {
        title: 'Readable dates for exp, iat, and nbf',
        paragraphs: [
          'Many JWT claims store timestamps in Unix format. We convert those values to local and UTC date strings so you can validate timing quickly.',
          'We also highlight common claims such as iss, aud, sub, and role to improve manual verification during debugging.',
        ],
      },
      {
        title: 'Limitations and security note',
        paragraphs: [
          'Decoding is not signature verification. A decoded JWT is not automatically trustworthy. Always verify signatures in your backend or trusted environment.',
          'Processing runs locally in your browser by default, which helps privacy during quick token inspection.',
        ],
      },
    ],
    faq: [
      { question: 'Does this tool verify JWT signature?', answer: 'No. It only decodes and displays token parts. Signature verification must be done elsewhere.' },
      { question: 'Can I check token expiration?', answer: 'Yes. If exp is present, the tool shows readable date and expiration status.' },
      { question: 'Is token data sent to a server?', answer: 'No by default. Decoding runs in your browser.' },
      { question: 'Can I use it on mobile?', answer: 'Yes. The interface is responsive and mobile friendly.' },
    ],
  },
  es: {
    name: 'JWT Decoder Online',
    shortDescription: 'Decodifica JWT y visualiza header, payload y firma con JSON legible, claims destacadas y conversion de fechas.',
    primaryKeyword: 'jwt decoder online',
    secondaryKeywords: ['decodificar jwt', 'ver payload jwt', 'inspector jwt', 'claims jwt', 'jwt exp iat nbf'],
    searchIntent: 'Developers y equipos tecnicos que necesitan inspeccionar tokens JWT para pruebas y debug de autenticacion.',
    seoTitle: 'JWT Decoder Online | Header, Payload y Signature',
    seoDescription: 'Pega un JWT y revisa header, payload y firma con JSON formateado y lectura de claims comunes.',
    h1: 'JWT Decoder Online para Inspeccionar Claims',
    intro: 'Decodifica JWT en el navegador y analiza claims comunes con mensajes claros para debugging rapido.',
    contentBlocks: [
      {
        title: 'Que hace este decoder JWT',
        paragraphs: [
          'Un JWT tiene tres partes separadas por puntos. Esta herramienta separa header, payload y signature, y formatea header/payload para lectura inmediata.',
          'Es util para validar integraciones, sesiones y respuestas de API cuando necesitas inspeccionar el token sin instalar software.',
        ],
      },
      {
        title: 'Claims comunes y fechas legibles',
        paragraphs: [
          'Campos como exp, iat y nbf suelen estar en timestamp Unix. La herramienta muestra fecha legible local y UTC para facilitar la revision.',
          'Tambien destacamos iss, aud, sub y role para apoyar la verificacion manual de contexto.',
        ],
      },
      {
        title: 'Limites y privacidad',
        paragraphs: [
          'Decodificar no significa validar firma. Un token decodificado no es automaticamente seguro o autentico.',
          'El procesamiento se realiza localmente en tu navegador por defecto.',
        ],
      },
    ],
    faq: [
      { question: 'Esta herramienta valida la firma del JWT?', answer: 'No. Solo decodifica y muestra las partes del token.' },
      { question: 'Puedo ver si el token expiro?', answer: 'Si. Cuando existe exp mostramos fecha y estado de expiracion.' },
      { question: 'Se envian mis datos al servidor?', answer: 'No por defecto. El procesamiento ocurre localmente en el navegador.' },
      { question: 'Funciona en celular?', answer: 'Si. La interfaz es responsiva.' },
    ],
  },
};

export const getJwtDecoderContent = (locale: AppLocale): JwtDecoderLocaleContent =>
  contentByLocale[locale] ?? contentByLocale['pt-br'];

export const jwtDecoderIntro = contentByLocale['pt-br'].intro;
export const jwtDecoderContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const jwtDecoderFaq = contentByLocale['pt-br'].faq;
