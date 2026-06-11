import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type TransferLocaleContent = {
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

const contentByLocale: Record<AppLocale, TransferLocaleContent> = {
  'pt-br': {
    name: 'Transferencia Entre Dispositivos',
    shortDescription:
      'Transfira texto, links, Pix, JSON, comandos e arquivos entre celular e PC com QR Code e canal P2P WebRTC, sem login e com processamento local.',
    primaryKeyword: 'transferir arquivo entre celular e pc por qr code',
    secondaryKeywords: [
      'transferir texto por qr code',
      'transferencia entre dispositivos no navegador',
      'enviar arquivo de celular para pc sem cabo',
      'webrtc datachannel transferencia',
      'copiar link do celular para pc',
      'pix por qr code entre dispositivos',
      'transferir json entre dispositivos',
      'transferir comando de terminal por qr code',
      'p2p browser file transfer',
      'device to device transfer online',
    ],
    searchIntent:
      'Usuarios que precisam passar texto pequeno por QR ou conectar celular e PC para enviar arquivos e textos maiores sem login e com o minimo de intermediarios.',
    seoTitle:
      'Transferir Entre Celular e PC por QR Code e P2P | Texto, Links e Arquivos',
    seoDescription:
      'Transfira texto rapido por QR Code e arquivos por WebRTC P2P entre celular e PC. Sem cadastro, sem login e com processamento local no navegador.',
    h1: 'Transferir Texto e Arquivos Entre Celular e PC por QR Code e P2P',
    intro:
      'Use um modo rapido para links, Pix, senhas e textos curtos via QR Code ou conecte dois navegadores com WebRTC para enviar arquivos e textos maiores diretamente entre os dispositivos.',
    contentBlocks: [
      {
        title: 'Dois modos para problemas diferentes',
        paragraphs: [
          'Esta ferramenta foi pensada para dois cenarios comuns. O primeiro e copiar conteudo pequeno, como links, chaves Pix, comandos de terminal, tokens temporarios e JSON curto. Nesse caso, o proprio QR Code ja carrega o conteudo ou um fragmento de URL processado no navegador.',
          'O segundo cenario e enviar dados maiores, como arquivos, PDFs, imagens, ZIPs leves ou blocos longos de texto. A pagina cria um pareamento manual entre os dois dispositivos usando QR Code e depois envia o conteudo por WebRTC DataChannel.',
        ],
      },
      {
        title: 'Quando usar o modo QR simples',
        paragraphs: [
          'O modo QR simples e o melhor caminho quando voce quer sair do celular e chegar no PC em poucos segundos sem depender de conta, login ou backend. Ele funciona bem para compartilhar um link aberto no navegador, um payload Pix Copia e Cola, um endereco cripto ou um snippet tecnico curto.',
          'Se o texto crescer demais, a ferramenta pode dividir o payload em varias partes. Isso ajuda em alguns fluxos tecnicos, mas para dados mais pesados a melhor escolha continua sendo o modo P2P.',
        ],
        list: [
          'Links, URLs, rotas internas e deep links.',
          'Senhas temporarias, tokens de uso curto e codigos de verificacao.',
          'Chaves Pix, enderecos cripto, JSON pequeno e comandos de terminal.',
          'Trechos curtos de texto que precisam ser copiados rapido entre dispositivos.',
        ],
      },
      {
        title: 'Como funciona o envio grande por WebRTC P2P',
        paragraphs: [
          'No modo avancado, um dispositivo gera uma offer WebRTC, o outro responde com uma answer e os dois lados abrem um canal de dados. Esse canal e criptografado pelo proprio stack WebRTC e, quando a conectividade permite, o conteudo segue direto entre os navegadores.',
          'A conexao pode usar STUN apenas para descobrir a melhor rota entre os peers. Nao existe relay TURN nesta implementacao. Isso preserva a ideia de conexao direta, mas tambem significa que algumas redes mais restritas podem nao fechar a conexao.',
        ],
      },
      {
        title: 'Privacidade, limites e o que nao prometer',
        paragraphs: [
          'O texto do modo simples e tratado no navegador. No modo P2P, o payload principal vai pelo DataChannel apos o pareamento manual. Ainda assim, a conectividade real depende da rede, NAT e firewall de cada lado. Sem TURN, alguns cenarios entre redes fechadas podem falhar.',
          'Tambem e importante lembrar que QR Code tem limite pratico de tamanho. Se voce estiver tentando empacotar muito conteudo no modo simples, a ferramenta vai dividir em partes ou sugerir migracao para o P2P.',
        ],
      },
    ],
    faq: [
      {
        question: 'Essa ferramenta envia meus dados para servidor?',
        answer:
          'O modo simples processa o conteudo localmente no navegador. No modo P2P, o payload principal e enviado pelo canal WebRTC entre os dispositivos. Pode haver uso de STUN para descoberta de rota, mas nao ha relay TURN nesta implementacao.',
      },
      {
        question: 'Funciona para arquivos grandes?',
        answer:
          'Funciona melhor para arquivos pequenos e medios. O canal envia em partes, mas a estabilidade depende da memoria do navegador, da rede e da conexao WebRTC entre os peers.',
      },
      {
        question: 'Preciso instalar app ou criar conta?',
        answer:
          'Nao. A ideia e funcionar direto no navegador, sem cadastro, sem login e sem app dedicado.',
      },
      {
        question: 'Posso escanear o QR pela propria pagina?',
        answer:
          'Sim, em navegadores compatveis voce pode usar a camera pela propria pagina ou enviar uma imagem do QR. Em celulares, o seletor de imagem tambem pode abrir a camera do sistema.',
      },
      {
        question: 'Por que a conexao P2P pode falhar em algumas redes?',
        answer:
          'Porque esta implementacao usa conexao direta com suporte opcional a STUN, mas sem TURN relay. Redes corporativas, NATs muito restritivos e firewalls agressivos podem impedir o fechamento da sessao.',
      },
    ],
  },
  en: {
    name: 'Transfer Between Devices',
    shortDescription:
      'Transfer text, links, Pix payloads, JSON, commands, and files between phone and desktop with QR Code and WebRTC P2P in the browser.',
    primaryKeyword: 'transfer files between phone and pc with qr code',
    secondaryKeywords: [
      'transfer text by qr code',
      'browser device to device transfer',
      'send file from phone to pc without cable',
      'webrtc datachannel transfer tool',
      'copy links from phone to desktop',
      'p2p file transfer in browser',
      'qr code text transfer online',
      'web transfer between devices',
    ],
    searchIntent:
      'Users who want quick QR transfer for short content and a browser-based P2P path for larger files or text between two devices.',
    seoTitle: 'Transfer Between Phone and PC with QR Code and P2P',
    seoDescription:
      'Send short text by QR Code or connect two browsers with WebRTC P2P for larger files and text. No sign-up, no login, local-first workflow.',
    h1: 'Transfer Text and Files Between Phone and PC with QR Code and P2P',
    intro:
      'Use a fast QR mode for links and short text, or pair two browsers with WebRTC to send larger files and longer text directly between devices.',
    contentBlocks: [
      {
        title: 'Two modes for two different jobs',
        paragraphs: [
          'The simple mode is designed for short payloads such as links, temporary passwords, Pix payloads, crypto addresses, terminal commands, and compact JSON. The QR itself carries the content or a client-side URL fragment.',
          'The advanced mode handles larger text and files. It uses QR codes only for the initial handshake and then moves the main payload through a WebRTC DataChannel.',
        ],
      },
      {
        title: 'When the QR mode is the best choice',
        paragraphs: [
          'If you only need to move something small from one screen to another, QR is the fastest option. It avoids account creation, avoids manual typing, and works well on mobile and desktop.',
          'When content grows beyond practical QR limits, the tool can split it into multiple parts, but larger payloads are usually better served by the P2P mode.',
        ],
      },
      {
        title: 'How the WebRTC transfer works',
        paragraphs: [
          'One device creates a WebRTC offer, the other responds with an answer, and both browsers open a direct data channel. Files are sent in chunks so the receiving browser can reconstruct them safely.',
          'This implementation can use STUN for route discovery, but it does not include a TURN relay. That keeps the tool closer to direct transfer, while also meaning some restrictive networks may fail to connect.',
        ],
      },
      {
        title: 'Privacy and practical limits',
        paragraphs: [
          'Short-text QR processing stays local in the browser. In P2P mode, the main payload travels through the browser data channel after manual pairing. Network topology still matters, and direct connectivity is not guaranteed on every firewall or NAT setup.',
          'QR capacity is also finite. If a payload becomes too large, splitting or switching to P2P is the correct fallback.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does this tool upload my content to a server?',
        answer:
          'Short QR mode is processed locally in the browser. In P2P mode, the main payload goes through WebRTC between the devices. Optional STUN may be used for route discovery, but there is no TURN relay in this implementation.',
      },
      {
        question: 'Do I need an account or app?',
        answer:
          'No. The tool is designed to work directly in the browser with no sign-up and no dedicated app.',
      },
      {
        question: 'Can I scan the QR from inside the website?',
        answer:
          'Yes. On compatible browsers you can use the camera directly on the page or import a QR image. On many phones the image picker can also open the system camera.',
      },
      {
        question: 'Why can the P2P connection fail?',
        answer:
          'Because this build relies on direct WebRTC connectivity with optional STUN and no TURN relay. Restrictive corporate networks, hard NAT, or aggressive firewalls may block the session.',
      },
    ],
  },
  es: {
    name: 'Transferencia Entre Dispositivos',
    shortDescription:
      'Transfiere texto, enlaces, payloads Pix, JSON, comandos y archivos entre movil y PC con QR Code y WebRTC P2P desde el navegador.',
    primaryKeyword: 'transferir archivos entre celular y pc con qr code',
    secondaryKeywords: [
      'transferir texto por qr',
      'transferencia entre dispositivos navegador',
      'enviar archivo del movil al pc sin cable',
      'webrtc datachannel transferencia',
      'copiar enlace del movil al escritorio',
      'transferencia p2p navegador',
      'qr para texto entre dispositivos',
      'device to device transfer online',
    ],
    searchIntent:
      'Usuarios que necesitan una via rapida por QR para contenido corto y una opcion P2P en navegador para archivos o textos mayores.',
    seoTitle: 'Transferir Entre Celular y PC con QR Code y P2P',
    seoDescription:
      'Envía texto corto por QR Code o conecta dos navegadores con WebRTC P2P para archivos y textos mas grandes. Sin registro y con flujo local.',
    h1: 'Transferir Texto y Archivos Entre Celular y PC con QR Code y P2P',
    intro:
      'Usa un modo rapido por QR para enlaces y textos cortos, o conecta dos navegadores con WebRTC para enviar archivos y textos largos entre dispositivos.',
    contentBlocks: [
      {
        title: 'Dos modos para dos necesidades',
        paragraphs: [
          'El modo simple sirve para enlaces, claves Pix, contraseñas temporales, comandos y texto corto. El propio QR lleva el contenido o un fragmento procesado del lado del cliente.',
          'El modo avanzado usa QR solo para emparejar los dispositivos y luego mueve el contenido grande por un canal WebRTC DataChannel.',
        ],
      },
      {
        title: 'Cuando conviene usar QR simple',
        paragraphs: [
          'Si solo necesitas pasar algo pequeno de una pantalla a otra, el QR es la opcion mas rapida. Evita escribir manualmente y no necesita cuenta.',
          'Si el contenido crece demasiado, la herramienta puede dividirlo en varias partes, pero para cargas grandes conviene pasar al modo P2P.',
        ],
      },
      {
        title: 'Como funciona la transferencia WebRTC',
        paragraphs: [
          'Un dispositivo crea una offer, el otro responde con una answer y ambos navegadores abren un canal de datos directo. Los archivos se envian en chunks para reconstruirlos con seguridad en el destino.',
          'Esta implementacion puede usar STUN para descubrir la ruta, pero no incluye TURN relay. Eso mantiene el enfoque directo, aunque algunas redes cerradas pueden fallar.',
        ],
      },
      {
        title: 'Privacidad y limites reales',
        paragraphs: [
          'El modo QR simple se procesa localmente. En modo P2P, el payload principal viaja por el canal WebRTC despues del emparejamiento manual. Aun asi, la red y el firewall influyen en el resultado final.',
          'La capacidad del QR es limitada. Si el contenido se vuelve demasiado grande, la salida correcta es dividirlo o migrar al modo P2P.',
        ],
      },
    ],
    faq: [
      {
        question: 'Se suben mis datos a un servidor?',
        answer:
          'El modo QR corto se procesa localmente en el navegador. En modo P2P, el payload principal viaja entre los dispositivos por WebRTC. Puede haber STUN para descubrir ruta, pero no hay TURN relay en esta implementacion.',
      },
      {
        question: 'Necesito cuenta o app?',
        answer:
          'No. La herramienta esta pensada para funcionar directo en el navegador, sin registro y sin app dedicada.',
      },
      {
        question: 'Puedo escanear el QR dentro del propio sitio?',
        answer:
          'Si. En navegadores compatibles puedes usar la camara en la propia pagina o cargar una imagen del QR. En muchos moviles el selector de imagen tambien puede abrir la camara del sistema.',
      },
      {
        question: 'Por que puede fallar la conexion P2P?',
        answer:
          'Porque esta implementacion depende de conectividad WebRTC directa con STUN opcional y sin TURN relay. Redes corporativas, NAT restrictivo o firewalls fuertes pueden impedir la sesion.',
      },
    ],
  },
};

export const getTransferContent = (locale: AppLocale): TransferLocaleContent =>
  contentByLocale[locale] ?? contentByLocale['pt-br'];

export const transferIntro = contentByLocale['pt-br'].intro;
export const transferContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const transferFaq = contentByLocale['pt-br'].faq;
