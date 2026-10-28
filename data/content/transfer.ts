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
      'Envie e receba arquivos, texto, links, Pix e JSON entre celular e PC por QR Code ou uma sala WebRTC no navegador.',
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
      'Use QR Code para passar conteudo curto ou crie uma sala por link para que todos os dispositivos possam enviar e receber arquivos com WebRTC.',
    contentBlocks: [
      {
        title: 'Dois modos para problemas diferentes',
        paragraphs: [
          'Esta ferramenta foi pensada para dois cenarios comuns. O primeiro e copiar conteudo pequeno, como links, chaves Pix, comandos de terminal, tokens temporarios e JSON curto. Nesse caso, o proprio QR Code ja carrega o conteudo ou um fragmento de URL processado no navegador.',
          'Para arquivos, PDFs, imagens e outros dados maiores, crie uma sala e compartilhe o link. Todos os dispositivos conectados podem enviar arquivos entre si; os recebidos ficam listados para cada pessoa escolher quando baixar. O pareamento manual por QR segue disponivel como alternativa.',
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
          'No modo por link, uma pessoa cria a sala e compartilha o convite. Todos os dispositivos conectados podem enviar e receber arquivos entre si pelo DataChannel WebRTC. Cada arquivo recebido aparece em uma lista e so e baixado quando a pessoa escolhe. Tambem e possivel usar o pareamento manual por QR.',
          'A conexao pode usar STUN apenas para descobrir a melhor rota entre os peers. Nao existe relay TURN nesta implementacao. Isso preserva a ideia de conexao direta, mas tambem significa que algumas redes mais restritas podem nao fechar a conexao.',
        ],
      },
      {
        title: 'Privacidade, limites e o que nao prometer',
        paragraphs: [
          'O texto curto e tratado no navegador. Na sala por link, o servidor coordena a conexao e mantem dados temporarios de sinalizacao; o arquivo nao e armazenado nele e segue pelo DataChannel. A conectividade ainda depende da rede, NAT e firewall. Sem TURN, alguns cenarios podem falhar.',
          'Tambem e importante lembrar que QR Code tem limite pratico de tamanho. Se voce estiver tentando empacotar muito conteudo no modo simples, a ferramenta vai dividir em partes ou sugerir migracao para o P2P.',
        ],
      },
    ],
    faq: [
      {
        question: 'Essa ferramenta envia meus dados para servidor?',
        answer:
          'O modo simples processa o conteudo localmente. No modo por link, o servidor coordena a sala e a conexao, mas nao recebe nem armazena o arquivo. O conteudo segue por WebRTC entre os navegadores. Pode haver STUN para descoberta de rota; esta implementacao nao inclui relay TURN.',
      },
      {
        question: 'Funciona para arquivos grandes?',
        answer:
          'Todos na sala podem enviar e receber arquivos. O envio acontece em partes; os arquivos recebidos ficam disponiveis para baixar quando voce quiser. A estabilidade depende da memoria do navegador, da rede e da conexao WebRTC entre os dispositivos.',
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
      'Send and receive files, text, links, Pix payloads, and JSON between devices with QR Code or a WebRTC room in the browser.',
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
      'Use QR codes for short content, or create a room link so every connected device can send and receive files over WebRTC.',
    contentBlocks: [
      {
        title: 'Two modes for two different jobs',
        paragraphs: [
          'The simple mode is designed for short payloads such as links, temporary passwords, Pix payloads, crypto addresses, terminal commands, and compact JSON. The QR itself carries the content or a client-side URL fragment.',
          'For larger files, create a room and share its link. Everyone connected can send files to the other devices, and received files stay in a list until each person chooses to download them. Manual QR pairing remains available as an alternative.',
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
          'One person creates a room and shares the invite. Everyone connected can send and receive files directly over WebRTC DataChannels. Received files appear in a list and download only when chosen. Manual QR pairing is also available.',
          'This implementation can use STUN for route discovery, but it does not include a TURN relay. That keeps the tool closer to direct transfer, while also meaning some restrictive networks may fail to connect.',
        ],
      },
      {
        title: 'Privacy and practical limits',
        paragraphs: [
          'Short QR content is processed in the browser. The link room coordinates the connection and temporarily handles signaling data; it does not store the file. Network topology still matters, and direct connectivity is not guaranteed on every firewall or NAT setup.',
          'QR capacity is also finite. If a payload becomes too large, splitting or switching to P2P is the correct fallback.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does this tool upload my content to a server?',
        answer:
          'Short QR content is processed locally. For link transfers, the server coordinates the room and connection but does not receive or store the file. The payload travels over WebRTC between browsers. STUN may help discover a route; this implementation has no TURN relay.',
      },
      {
        question: 'Do I need an account or app?',
        answer:
          'No. The tool is designed to work directly in the browser with no sign-up and no dedicated app.',
      },
      {
        question: 'Can everyone in the room send files?',
        answer:
          'Yes. Every connected device can send files to the other participants and receive files. Downloads are started manually from the received-files list.',
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
      'Envía y recibe archivos, texto, enlaces, payloads Pix y JSON entre dispositivos con QR Code o una sala WebRTC en el navegador.',
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
      'Usa QR para contenido corto o crea una sala con enlace para que todos los dispositivos conectados envíen y reciban archivos por WebRTC.',
    contentBlocks: [
      {
        title: 'Dos modos para dos necesidades',
        paragraphs: [
          'El modo simple sirve para enlaces, claves Pix, contraseñas temporales, comandos y texto corto. El propio QR lleva el contenido o un fragmento procesado del lado del cliente.',
          'Para archivos grandes, crea una sala y comparte el enlace. Todos los dispositivos conectados pueden enviarse archivos; los recibidos aparecen en una lista hasta que cada persona decida descargarlos. El emparejamiento manual por QR sigue disponible.',
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
          'Una persona crea la sala y comparte la invitación. Todos los dispositivos conectados pueden enviar y recibir archivos directamente por WebRTC DataChannels. Los archivos recibidos aparecen en una lista y solo se descargan cuando alguien lo elige. También se puede usar el emparejamiento manual por QR.',
          'Esta implementacion puede usar STUN para descubrir la ruta, pero no incluye TURN relay. Eso mantiene el enfoque directo, aunque algunas redes cerradas pueden fallar.',
        ],
      },
      {
        title: 'Privacidad y limites reales',
        paragraphs: [
          'El contenido corto por QR se procesa en el navegador. La sala por enlace coordina la conexion y gestiona temporalmente la senalizacion, pero no guarda los archivos. La red y el firewall pueden afectar la conexion directa.',
          'La capacidad del QR es limitada. Si el contenido se vuelve demasiado grande, la salida correcta es dividirlo o migrar al modo P2P.',
        ],
      },
    ],
    faq: [
      {
        question: 'Se suben mis datos a un servidor?',
        answer:
          'El contenido corto por QR se procesa localmente. En las transferencias por enlace, el servidor coordina la sala y la conexion, pero no recibe ni guarda el archivo. El contenido viaja por WebRTC entre los navegadores. Puede usarse STUN; esta implementacion no tiene relay TURN.',
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
  zh: {
    name: '设备间传输',
    shortDescription:
      '通过二维码或浏览器中的 WebRTC 房间，在设备之间发送和接收文件、文本、链接与 JSON。',
    primaryKeyword: '设备间传输文件',
    secondaryKeywords: [
      '二维码传文件',
      '浏览器设备间文件传输',
      '手机电脑无线传文件',
      'WebRTC 文件传输',
      '设备间传输链接',
      '浏览器点对点传输',
      '二维码传文本',
      '在线传输文件',
    ],
    searchIntent:
      '需要通过二维码快速传递短内容，或在浏览器中点对点传输文件的用户。',
    seoTitle: '设备间传输文件与文本 | 二维码和 WebRTC',
    seoDescription:
      '使用二维码传递短文本，或通过 WebRTC 房间在设备之间发送和接收文件。无需注册，直接在浏览器中使用。',
    h1: '使用二维码或 WebRTC 在设备之间传输文件和文本',
    intro:
      '使用二维码传递短内容，或创建房间链接，让所有已连接设备都能通过 WebRTC 发送和接收文件。',
    contentBlocks: [
      {
        title: '两种传输方式',
        paragraphs: [
          '简单模式适合传递链接、临时密码、Pix 内容、加密货币地址、终端命令和短 JSON。二维码本身携带内容或浏览器本地处理的 URL 片段。',
          '传输较大的文件时，可以创建房间并分享链接。所有已连接设备都可以互相发送文件，收到的文件会列出，供每个人自行选择下载。也可以使用二维码手动配对。',
        ],
      },
      {
        title: '适合使用二维码的场景',
        paragraphs: [
          '如果只需要把少量内容从一个屏幕传到另一个屏幕，二维码通常最快，也无需注册或手动输入。',
          '当内容超过二维码的实用容量时，可以拆分内容；较大的文件更适合使用点对点传输。',
        ],
      },
      {
        title: 'WebRTC 文件传输的工作方式',
        paragraphs: [
          '一位用户创建房间并分享邀请链接。房间负责协调 WebRTC 连接，文件随后通过 DataChannel 在设备之间直接传输。',
          '服务器不保存文件。部分网络可能会阻止设备之间建立直接连接。',
        ],
      },
      {
        title: '隐私与使用限制',
        paragraphs: [
          '二维码短内容在浏览器中处理。链接房间负责协调连接并临时处理信令数据，不会存储文件。网络、防火墙和 NAT 设置可能影响直接连接。',
          '二维码容量有限。内容较大时，可以拆分内容或改用点对点传输。',
        ],
      },
    ],
    faq: [
      {
        question: '所有人都可以在房间里发送文件吗？',
        answer:
          '可以。所有已连接设备都能互相发送和接收文件。收到的文件会显示在列表中，由你选择何时下载。',
      },
      {
        question: '文件会上传并保存在服务器上吗？',
        answer:
          '不会。服务器协调房间和连接，文件通过 WebRTC 在浏览器之间传输。',
      },
      {
        question: '需要安装应用或注册账号吗？',
        answer:
          '不需要。你可以直接在浏览器中使用这项工具。',
      },
      {
        question: '为什么点对点连接有时会失败？',
        answer:
          '某些网络、防火墙或 NAT 设置可能会阻止设备之间建立直接连接。',
      },
    ],
  },
};

export const getTransferContent = (locale: AppLocale): TransferLocaleContent =>
  contentByLocale[locale] ?? contentByLocale['pt-br'];

export const transferIntro = contentByLocale['pt-br'].intro;
export const transferContentBlocks = contentByLocale['pt-br'].contentBlocks;
export const transferFaq = contentByLocale['pt-br'].faq;
