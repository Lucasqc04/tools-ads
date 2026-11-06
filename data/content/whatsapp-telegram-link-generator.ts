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
      'Gere links wa.me e t.me com mensagem pronta a partir de um número com código do país ou de um @nick, sem cadastro.',
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
      'Crie links wa.me e t.me com mensagem pronta a partir de um número com código do país ou de um @nick. Gere no navegador, copie e use em botões, bio e anúncios.',
    h1: 'Gerador de Link para WhatsApp e Telegram com Mensagem Pronta',
    intro:
      'Digite o número com código do país ou um @nick, escreva a mensagem e gere links prontos para abrir a conversa no WhatsApp e no Telegram.',
    contentBlocks: [
      {
        title: 'Como funciona o link com mensagem pronta',
        paragraphs: [
          'A ferramenta monta o link de conversa no formato wa.me (WhatsApp) ou t.me (Telegram) e acrescenta a mensagem como parâmetro de texto, com os caracteres especiais já codificados. Quem clicar no link abre a conversa com o texto preenchido, pronto para enviar.',
          'Se você digitar um número, a ferramenta remove espaços, parênteses, hífens e o sinal de +, e gera os dois links. Ela não acrescenta o código do país nem verifica se o número existe: digite o número completo, por exemplo 5511999998888 (55 do Brasil, 11 de DDD e o telefone). Se digitar um @nick, só o link do Telegram é gerado.',
        ],
      },
      {
        title: 'Quando usar no dia a dia',
        paragraphs: [
          'Use os links em botões do site, na bio de redes sociais, em assinaturas de e-mail, em anúncios e em páginas de vendas. Com a mensagem pronta, a pessoa não precisa escrever do zero e você já recebe o contexto do pedido.',
        ],
        list: [
          'Botão "Fale no WhatsApp" com a mensagem "Olá! Quero saber mais sobre o produto X".',
          'Link de suporte no Telegram com um texto de abertura padronizado.',
          'Mensagem inicial diferente para cada campanha, para saber de onde veio o contato.',
          'Link de triagem para o atendimento comercial, com o assunto já preenchido.',
        ],
      },
      {
        title: 'Limites e cuidados',
        paragraphs: [
          'O WhatsApp só aceita número de telefone no link wa.me; não existe link por @nick. No Telegram, o @nick público é a forma mais segura de apontar para um perfil. Já o link por número depende de como o Telegram e as configurações de privacidade do contato tratam o telefone, então teste antes de divulgar.',
          'O texto aparece preenchido, mas a pessoa ainda precisa enviar a mensagem. Prefira textos curtos, teste o link no celular e no computador, e lembre que quem tiver o link pode ver o número ou o @nick e a mensagem. Os links são gerados no navegador, e nada é enviado ao servidor do site.',
        ],
      },
    ],
    faq: [
      {
        question: 'Posso usar @nick no WhatsApp?',
        answer:
          'Não. O WhatsApp aceita apenas número de telefone no link wa.me, com código do país. Ao digitar um @nick, a ferramenta gera só o link do Telegram e avisa sobre o WhatsApp.',
      },
      {
        question: 'Preciso colocar o código do país no número?',
        answer:
          'Sim. A ferramenta só limpa os caracteres que não são dígitos. Para o Brasil, use 55 + DDD + número, como 5511999998888. Números com menos de 8 dígitos não são aceitos como telefone.',
      },
      {
        question: 'Funciona com número no Telegram?',
        answer:
          'A ferramenta gera o link t.me com o número, mas o resultado depende do Telegram e da privacidade do contato. Quando houver um @nick público, ele costuma ser a opção mais estável.',
      },
      {
        question: 'Minha mensagem é enviada para algum servidor?',
        answer:
          'Não. Os links são montados no navegador e a mensagem só aparece nos links que você copiar. Ao abrir o link, o WhatsApp ou o Telegram recebe o texto.',
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
  zh: {
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
};

export const getWhatsAppTelegramLinkContent = (
  locale: AppLocale,
): WhatsAppTelegramLinkLocaleContent => contentByLocale[locale] ?? contentByLocale['pt-br'];

export const whatsappTelegramLinkIntro = contentByLocale['pt-br'].intro;
export const whatsappTelegramLinkContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const whatsappTelegramLinkFaq = contentByLocale['pt-br'].faq;
