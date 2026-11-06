import type { ContentBlock, FaqItem } from '@/types/content';

export const qrCodeGeneratorIntro =
  'Cole um texto, link ou código Pix copia-e-cola e gere um QR Code grátis, sem cadastro, com logo no centro, cores personalizadas e download em PNG, JPEG, WEBP, SVG ou PDF.';

export const qrCodeGeneratorContentBlocks: ContentBlock[] = [
  {
    title: 'Como gerar um QR Code com logo',
    paragraphs: [
      'Digite ou cole o conteúdo no campo principal e o QR Code aparece na hora. Funciona com texto simples, links, mensagens e códigos de pagamento, como o Pix copia-e-cola. Cada vez que o conteúdo muda, o código é refeito, então basta trocar o texto para gerar outra versão.',
      'Depois ajuste o visual: estilos prontos (Básico, Redondo, Quadrado e Alto contraste), cor dos módulos e do fundo, formato dos pontos e dos cantos, margem, tamanho de 220 a 900 px e nível de correção de erro. Para usar sua marca, envie uma imagem de logo e defina o tamanho e a margem dela no centro do código.',
    ],
  },
  {
    title: 'Formatos de download e exemplos de uso',
    paragraphs: [
      'Você pode baixar o QR Code em PNG, JPEG, WEBP ou SVG, copiar a imagem para a área de transferência ou gerar um PDF em A4. O PNG serve para web e redes sociais; o SVG é vetorial e mantém a nitidez em impressos grandes; o PDF contém o QR Code como imagem, centralizado na página.',
      'Exemplos comuns: um QR Code para o cardápio de um restaurante, para o Wi-Fi da recepção, para o perfil de uma rede social impresso em um cartão, ou para o código de rastreio de um pedido em uma etiqueta. Para Wi-Fi e contato (vCard), a ferramenta de QR Wi-Fi, vCard e Evento monta o conteúdo no formato correto.',
    ],
  },
  {
    title: 'Como garantir que o código seja lido',
    paragraphs: [
      'Prefira módulos escuros sobre fundo claro e mantenha o logo pequeno: quanto maior a imagem no centro, menos área o leitor tem para decodificar. O nível de correção de erro mais alto tolera mais interferência, mas deixa o código mais denso, e todo QR Code tem capacidade máxima, de cerca de 3 mil caracteres. Textos muito longos geram um padrão pequeno e difícil de ler.',
      'Antes de imprimir ou publicar, teste a leitura em mais de um celular e no tamanho final. Em materiais impressos, deixe a margem em branco ao redor e evite colocar o código sobre fotos ou fundos coloridos.',
    ],
    list: [
      'Use fundo claro e módulos escuros para obter contraste máximo.',
      'Mantenha o logo pequeno, com margem interna.',
      'Teste em iPhone e Android antes de distribuir.',
    ],
  },
  {
    title: 'Privacidade e limites',
    paragraphs: [
      'O QR Code, o logo e os arquivos exportados são gerados no seu navegador. O texto digitado e a imagem do logo não são enviados ao servidor do site para gerar o código.',
      'O QR Code gerado é estático: ele guarda o conteúdo informado e não tem contador de acessos nem pode ser alterado depois de impresso. Se o destino mudar, é preciso gerar e imprimir um novo código.',
    ],
  },
];

export const qrCodeGeneratorFaq: FaqItem[] = [
  {
    question: 'Preciso criar conta ou pagar para gerar e baixar o QR Code?',
    answer:
      'Não. Você gera e baixa o QR Code sem cadastro e sem login. Não há marca d\'água sobre o código.',
  },
  {
    question: 'Posso colocar um logo no centro do QR Code?',
    answer:
      'Sim. Envie uma imagem de logo e ajuste o tamanho (15% a 45% do código) e a margem. O logo cobre parte do código, então use o nível de correção Q ou H e teste a leitura depois de gerar.',
  },
  {
    question: 'Quais formatos de download estão disponíveis?',
    answer:
      'PNG, JPEG, WEBP, SVG e PDF. Também é possível copiar a imagem para a área de transferência, nos navegadores que permitem essa ação.',
  },
  {
    question: 'O QR Code deixa de funcionar depois de algum tempo?',
    answer:
      'Não. É um código estático: o conteúdo fica dentro da imagem e ele funciona enquanto o destino existir, por exemplo, enquanto o link continuar no ar. Não há como editar o conteúdo depois de gerado.',
  },
  {
    question: 'A ferramenta envia meu texto ou meu logo para um servidor?',
    answer:
      'Não. A geração, a prévia e as exportações acontecem no navegador. O conteúdo e o logo não são enviados ao servidor do site.',
  },
];
