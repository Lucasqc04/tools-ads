import type { ContentBlock, FaqItem } from '@/types/content';

export const authenticatorCodeGeneratorIntro =
  'Leia um QR Code de autenticação ou cole uma chave Base32/link otpauth para gerar códigos TOTP no navegador, acompanhar a troca do código e copiar em um toque.';

export const authenticatorCodeGeneratorContentBlocks: ContentBlock[] = [
  {
    title: 'Como gerar código de autenticador para testes',
    paragraphs: [
      'Esta ferramenta interpreta o QR Code de configuração de um autenticador, a chave secreta em Base32 ou o link otpauth:// usado por apps compatíveis com TOTP. Depois de carregar a configuração, o código temporário é calculado diretamente no seu navegador e atualizado no intervalo definido pelo serviço, geralmente a cada 30 segundos.',
      'Você pode enviar uma captura do QR Code, abrir a câmera para lê-lo ou colar a chave manualmente. Para um teste rápido de OAuth, login, staging ou ambiente local, isso evita cadastrar o mesmo segredo em um aplicativo de celular toda vez. Um token de seis dígitos já gerado não é suficiente para criar os próximos códigos: para isso, é preciso informar o QR, a chave Base32 ou o link otpauth.',
    ],
  },
  {
    title: 'Use QR Code, chave secreta ou link otpauth',
    paragraphs: [
      'O formato mais comum é um QR Code que começa com otpauth://totp/. Ele pode trazer nome da conta, emissor, algoritmo, quantidade de dígitos e tempo de validade. A ferramenta respeita essas configurações quando estão presentes e suporta os padrões SHA-1, SHA-256 e SHA-512.',
      'Quando só tiver a chave secreta, cole a sequência Base32 — normalmente formada por letras A–Z e números de 2 a 7. Espaços e hífens são aceitos para facilitar a cópia. Por segurança e precisão, o campo não trata uma senha comum, código de recuperação ou o número temporário atual como se fossem uma chave TOTP.',
    ],
    list: [
      'Envie uma imagem com o QR Code de configuração.',
      'Leia o QR Code ao vivo com a câmera, mediante permissão do navegador.',
      'Cole uma chave Base32 ou um link otpauth://totp/.',
      'Clique no código exibido para copiá-lo para a área de transferência.',
    ],
  },
  {
    title: 'O que significa o contador de expiração',
    paragraphs: [
      'TOTP é uma senha de uso único baseada em tempo. O mesmo segredo gera um valor diferente a cada período, e o contador mostra quantos segundos restam para a próxima troca. Copie o valor antes de ele expirar e, se o serviço rejeitar o código, espere a renovação ou confira se o relógio do seu dispositivo está correto.',
      'A maioria dos serviços usa seis dígitos e períodos de 30 segundos. Alguns QR Codes adotam oito dígitos, outro algoritmo ou intervalo diferente. Exibir essas configurações na ferramenta ajuda a detectar uma configuração inesperada durante o desenvolvimento, sem que você precise adivinhar por que a validação falhou.',
    ],
  },
  {
    title: 'Salvar neste dispositivo: útil para QA, inadequado para contas críticas',
    paragraphs: [
      'Se você decidir salvar uma entrada, a chave ficará apenas no localStorage deste navegador e será usada para montar sua lista local de testes. Nenhum QR Code, segredo ou código temporário é enviado para o servidor por esta ferramenta. Ainda assim, localStorage pode ser acessado por quem tiver acesso ao perfil do navegador, a extensões maliciosas ou a backups do dispositivo.',
      'Use o salvamento para contas descartáveis, ambientes de desenvolvimento, staging e validações automatizadas manuais. Para contas pessoais, financeiras, administrativas ou de produção, prefira um autenticador confiável no celular, gerenciador de senhas com TOTP ou chave de segurança. Remova as entradas salvas ao terminar o teste, especialmente em computadores compartilhados.',
    ],
  },
  {
    title: 'Limites e boas práticas de segurança',
    paragraphs: [
      'A ferramenta funciona com códigos TOTP, que são os códigos que mudam com o tempo. Ela não substitui métodos como confirmação por push, SMS, chaves FIDO2/WebAuthn ou códigos de recuperação. QR Codes de outros formatos também não podem ser convertidos em um segundo fator válido se não contiverem uma configuração TOTP compatível.',
      'Nunca compartilhe a chave secreta, o QR de cadastro nem capturas de tela dessa configuração. Quem possuir o segredo pode gerar os mesmos códigos temporários enquanto ele estiver ativo. Ao encerrar um teste, revogue ou gere uma nova chave no serviço que a emitiu, principalmente se ela tiver sido usada fora de um ambiente isolado.',
    ],
  },
];

export const authenticatorCodeGeneratorFaq: FaqItem[] = [
  {
    question: 'Posso colar apenas o código de seis dígitos atual?',
    answer:
      'Não para gerar os próximos códigos. O número atual expira e não contém a chave necessária. Cole a chave Base32, o link otpauth:// ou leia o QR Code de configuração.',
  },
  {
    question: 'A leitura do QR Code e o cálculo do TOTP acontecem no servidor?',
    answer:
      'Não. A imagem, a chave e o cálculo do código são processados localmente no navegador. Nenhuma configuração é enviada ao servidor por padrão.',
  },
  {
    question: 'É seguro salvar uma conta na lista?',
    answer:
      'O salvamento usa localStorage deste navegador, por isso é indicado apenas para testes e contas não críticas em um dispositivo confiável. Para contas importantes, use um autenticador dedicado.',
  },
  {
    question: 'Por que o serviço recusou um código mostrado aqui?',
    answer:
      'Confira se a chave é a mesma cadastrada no serviço, se o relógio do dispositivo está sincronizado e se o código não expirou durante o envio. Também verifique os parâmetros de dígitos, período e algoritmo exibidos.',
  },
  {
    question: 'Funciona com Google Authenticator, Microsoft Authenticator e Authy?',
    answer:
      'Funciona quando o QR ou a chave segue o padrão TOTP/otpauth. Recursos específicos de cada aplicativo, como sincronização, push ou backup, não fazem parte desta ferramenta.',
  },
];
