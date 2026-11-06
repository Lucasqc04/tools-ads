import type { ContentBlock, FaqItem } from '@/types/content';

export const base64ImageViewerIntro =
  'Cole um Base64 ou um data URL e veja a imagem na hora. Depois baixe o arquivo original ou converta para outro formato.';

export const base64ImageViewerContentBlocks: ContentBlock[] = [
  {
    title: 'Como transformar Base64 em imagem',
    paragraphs: [
      'Cole o texto no campo e o preview aparece sozinho, em uma fração de segundo. A ferramenta aceita dois formatos: um data URL completo, como data:image/png;base64,iVBORw0KGgo..., ou o Base64 puro, sem o prefixo. Quando o prefixo não existe, ela usa o tipo escolhido em "MIME padrão para Base64 puro" (PNG, JPEG, WEBP, GIF ou SVG) para montar a imagem. Por isso, se o preview de um Base64 puro sair quebrado, tente outro tipo.',
      'Espaços e quebras de linha dentro de um Base64 puro são ignorados, e variações com "-" e "_" (Base64 seguro para URL) também são aceitas. Já um data URL precisa estar em uma única linha, sem quebras no meio. O botão "Ver imagem" abre a imagem em uma visualização maior.',
    ],
  },
  {
    title: 'Baixar o arquivo ou converter o formato',
    paragraphs: [
      '"Original decodificado" salva exatamente os bytes que estavam no Base64, com a extensão do tipo informado. As outras opções redesenham a imagem e gravam em PNG, JPEG, WEBP, AVIF, BMP, ICO, SVG ou TGA. WEBP e AVIF dependem de o navegador conseguir gerar esses formatos. O SVG gerado é um envelope que contém a imagem como PNG, não uma versão vetorial, e a conversão não preserva animações de GIF.',
    ],
    list: [
      'Conferir uma imagem em Base64 que veio de uma API, de um banco de dados ou de um webhook.',
      'Transformar um data URL copiado do código-fonte de uma página em um arquivo de verdade.',
      'Converter a imagem decodificada para outro formato sem instalar nada.',
    ],
  },
  {
    title: 'Limites e privacidade',
    paragraphs: [
      'A decodificação e o preview acontecem no navegador e o Base64 não é enviado a nenhum servidor.',
      'A ferramenta confere se o texto é um Base64 válido e não está vazio, mas não verifica se os bytes formam uma imagem do tipo informado: se não forem, o preview aparece quebrado, sem mensagem de erro. Textos muito grandes dependem da memória do aparelho.',
    ],
  },
];

export const base64ImageViewerFaq: FaqItem[] = [
  {
    question: 'Preciso enviar o Base64 para algum servidor?',
    answer:
      'Não. A leitura, o preview e a conversão são feitos no navegador e o texto não sai do seu aparelho.',
  },
  {
    question: 'Funciona com data URL e Base64 puro?',
    answer:
      'Sim. Com data URL, o tipo da imagem vem do próprio prefixo. Com Base64 puro, você escolhe o tipo em "MIME padrão para Base64 puro". O data URL precisa estar em uma única linha.',
  },
  {
    question: 'Em quais formatos posso baixar a imagem?',
    answer:
      'No original decodificado ou convertida para PNG, JPEG, WEBP, AVIF, BMP, ICO, SVG ou TGA. WEBP e AVIF dependem do suporte do seu navegador.',
  },
  {
    question: 'Por que a imagem não aparece ou aparece quebrada?',
    answer:
      'Pode ser um Base64 incompleto ou um tipo errado para a imagem. Confira se o texto foi copiado inteiro e, em Base64 puro, tente outro tipo em "MIME padrão". A ferramenta não verifica se os bytes são mesmo de uma imagem.',
  },
];
