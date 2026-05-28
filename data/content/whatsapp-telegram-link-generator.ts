import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type WhatsAppTelegramLinkLocaleContent = {
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

const contentByLocale: Record<AppLocale, WhatsAppTelegramLinkLocaleContent> = {
  'pt-br': {
    name: 'Gerador de Link com Mensagem para WhatsApp e Telegram',
    shortDescription:
      'Gere link de WhatsApp e Telegram com mensagem pronta usando numero ou @nick, sem cadastro e com copia rapida.',
    primaryKeyword: 'gerador de link whatsapp com mensagem',
    secondaryKeywords: [
      'link whatsapp com texto pronto',
      'gerar link telegram com mensagem',
      'wa.me com mensagem',
      't.me com mensagem',
      'link de contato whatsapp',
    ],
    searchIntent:
      'Usuarios que querem criar links prontos para iniciar conversa no WhatsApp ou Telegram com texto predefinido.',
    seoTitle: 'Gerador de Link WhatsApp e Telegram com Mensagem Pronta',
    seoDescription:
      'Crie link de WhatsApp e Telegram com mensagem pronta. Informe numero ou @nick, personalize o texto e copie o link final.',
    h1: 'Gerador de Link para WhatsApp e Telegram com Mensagem Pronta',
    intro:
      'Digite numero ou @nick, escreva a mensagem e gere links prontos para abrir conversa no WhatsApp e no Telegram em um clique.',
    contentBlocks: [
      {
        title: 'Como funciona o link com mensagem pronta',
        paragraphs: [
          'A ferramenta monta automaticamente URLs oficiais de abertura de conversa com o texto ja preenchido. Isso acelera atendimento, suporte, vendas e chamadas para acao.',
          'No WhatsApp, o formato usa numero com codigo do pais. No Telegram, voce pode usar @nick ou numero no padrao internacional.',
        ],
      },
      {
        title: 'Quando usar no dia a dia',
        paragraphs: [
          'Use os links prontos em botao de site, bio de rede social, assinatura de e-mail, anuncio pago, landing pages e mensagens automatizadas.',
          'Com texto pronto voce reduz atrito e aumenta a chance de a pessoa enviar a mensagem com o contexto correto.',
        ],
        list: [
          'Botao Fale no WhatsApp com mensagem inicial.',
          'Atalho no Telegram para suporte tecnico.',
          'Link de campanha com termo UTM no proprio texto.',
          'Mensagem de triagem para atendimento comercial.',
        ],
      },
      {
        title: 'Limites importantes e boas praticas',
        paragraphs: [
          'WhatsApp exige numero valido e nao abre conversa por @nick. Para Telegram, prefira @nick quando houver para evitar erro de formato em numeros antigos.',
          'Evite mensagens muito longas e inclua um contexto claro para facilitar resposta rapida no primeiro contato.',
        ],
      },
    ],
    faq: [
      {
        question: 'Posso usar @nick no WhatsApp?',
        answer:
          'Nao. O WhatsApp aceita apenas numero de telefone no link wa.me, com codigo do pais.',
      },
      {
        question: 'Funciona com numero no Telegram?',
        answer:
          'Sim. O Telegram aceita link com numero internacional, mas quando houver @nick publico ele costuma ser a opcao mais estavel.',
      },
      {
        question: 'Preciso pagar ou criar conta para usar?',
        answer:
          'Nao. A ferramenta e gratuita e pode ser usada sem cadastro e sem login.',
      },
      {
        question: 'Minha mensagem e enviada para servidor?',
        answer:
          'Nao por padrao. A geracao do link e feita localmente no navegador.',
      },
    ],
  },
  en: {
    name: 'WhatsApp and Telegram Link Generator with Prefilled Message',
    shortDescription:
      'Create WhatsApp and Telegram links with prefilled text using phone number or @username, with fast copy actions.',
    primaryKeyword: 'whatsapp link generator with message',
    secondaryKeywords: [
      'create wa.me link with text',
      'telegram link with prefilled message',
      'whatsapp click to chat generator',
      't.me message link generator',
      'chat link generator online',
    ],
    searchIntent:
      'Users who need ready-to-share chat links for WhatsApp and Telegram with prefilled message context.',
    seoTitle: 'WhatsApp and Telegram Link Generator with Prefilled Message',
    seoDescription:
      'Generate WhatsApp and Telegram links with ready text. Enter phone number or @username, customize the message, and copy instantly.',
    h1: 'WhatsApp and Telegram Link Generator with Ready Message',
    intro:
      'Enter a phone number or @username, write your message, and generate chat links that open with prefilled text.',
    contentBlocks: [
      {
        title: 'How prefilled chat links work',
        paragraphs: [
          'The tool builds official chat URLs with encoded text, so users open the conversation with the message already prepared.',
          'WhatsApp links require a phone number. Telegram links can use a public @username or an international phone number.',
        ],
      },
      {
        title: 'High-impact usage scenarios',
        paragraphs: [
          'Use these links in CTA buttons, social bios, paid traffic pages, CRM templates, and support signatures.',
          'Prefilled text reduces friction and helps the user send the first message with the right context.',
        ],
        list: [
          'Click-to-chat button on landing pages.',
          'Telegram support shortcut in docs and help centers.',
          'Campaign links with short qualification message.',
          'Sales triage message for inbound leads.',
        ],
      },
      {
        title: 'Practical limits and validation',
        paragraphs: [
          'WhatsApp does not support @username in wa.me format. Use full international number with country code.',
          'For Telegram, @username links are usually more stable when available on the profile.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can I use @username on WhatsApp?',
        answer:
          'No. WhatsApp links support only phone numbers in the wa.me format.',
      },
      {
        question: 'Does Telegram support both @username and phone number?',
        answer:
          'Yes. You can build links with either format, depending on what is available.',
      },
      {
        question: 'Is this tool free?',
        answer: 'Yes. You can use it for free without sign-up.',
      },
      {
        question: 'Is the message processed locally?',
        answer: 'Yes. Link generation runs in your browser by default.',
      },
    ],
  },
  es: {
    name: 'Generador de Enlace para WhatsApp y Telegram con Mensaje',
    shortDescription:
      'Genera enlaces de WhatsApp y Telegram con mensaje listo usando numero o @usuario, gratis y sin registro.',
    primaryKeyword: 'generador de enlace whatsapp con mensaje',
    secondaryKeywords: [
      'crear enlace wa.me con texto',
      'enlace telegram con mensaje listo',
      'link whatsapp click to chat',
      'generador t.me con mensaje',
      'enlace de contacto whatsapp',
    ],
    searchIntent:
      'Usuarios que quieren crear enlaces de chat para WhatsApp y Telegram con texto predefinido para contacto rapido.',
    seoTitle: 'Generador de Enlace WhatsApp y Telegram con Mensaje Listo',
    seoDescription:
      'Crea enlaces de WhatsApp y Telegram con mensaje listo. Ingresa numero o @usuario, personaliza el texto y copia al instante.',
    h1: 'Generador de Enlace para WhatsApp y Telegram con Mensaje Listo',
    intro:
      'Ingresa numero o @usuario, escribe tu mensaje y genera enlaces para abrir chat en WhatsApp y Telegram con texto preparado.',
    contentBlocks: [
      {
        title: 'Como funciona el enlace con mensaje',
        paragraphs: [
          'La herramienta crea URLs de chat con texto codificado para que la conversacion se abra con el mensaje ya escrito.',
          'En WhatsApp se usa numero internacional. En Telegram puedes usar @usuario o numero.',
        ],
      },
      {
        title: 'Casos reales de uso',
        paragraphs: [
          'Coloca estos enlaces en botones de sitio, perfiles sociales, campañas pagadas, firmas de correo y flujos de soporte.',
          'El mensaje listo reduce friccion y mejora la calidad del primer contacto.',
        ],
        list: [
          'Boton de contacto en landing page.',
          'Atajo de soporte en Telegram.',
          'Link de campana con mensaje de contexto.',
          'Filtro inicial para leads comerciales.',
        ],
      },
      {
        title: 'Limites y recomendaciones',
        paragraphs: [
          'WhatsApp no acepta @usuario en el formato wa.me. Debes usar numero con codigo de pais.',
          'En Telegram, cuando existe @usuario publico suele ser la opcion mas confiable.',
        ],
      },
    ],
    faq: [
      {
        question: 'Puedo usar @usuario en WhatsApp?',
        answer: 'No. WhatsApp solo acepta numero en enlaces wa.me.',
      },
      {
        question: 'Telegram funciona con numero y @usuario?',
        answer: 'Si. Puedes generar enlace con ambos formatos.',
      },
      {
        question: 'Necesito registro para usar la herramienta?',
        answer: 'No. Es gratis y no requiere registro.',
      },
      {
        question: 'El texto se envia al servidor?',
        answer: 'No por defecto. La generacion del enlace ocurre en el navegador.',
      },
    ],
  },
};

export const getWhatsAppTelegramLinkContent = (
  locale: AppLocale,
): WhatsAppTelegramLinkLocaleContent => contentByLocale[locale] ?? contentByLocale['pt-br'];

export const whatsappTelegramLinkIntro = contentByLocale['pt-br'].intro;
export const whatsappTelegramLinkContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const whatsappTelegramLinkFaq = contentByLocale['pt-br'].faq;
