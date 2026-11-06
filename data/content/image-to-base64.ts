import type { ContentBlock, FaqItem } from '@/types/content';

export const imageToBase64Intro =
  'Envie uma imagem e gere o texto em Base64 (ou data URL) com preview, cópia em um clique e download em .txt.';

export const imageToBase64ContentBlocks: ContentBlock[] = [
  {
    title: 'Como gerar o Base64 de uma imagem',
    paragraphs: [
      'Selecione uma imagem e o Base64 é gerado automaticamente, com um preview ao lado. A ferramenta aceita qualquer arquivo de imagem que o seu navegador consiga abrir, como PNG, JPG, WEBP, GIF e SVG. Em "Modo do texto Base64" você escolhe entre o data URL completo, no formato data:image/png;base64,..., que pode ser usado direto em um atributo src de HTML ou em um url() de CSS, e somente o Base64, sem o prefixo, que é o que muitas APIs esperam em um campo JSON.',
      'Atenção ao campo "Formato da imagem para codificar": ele começa em PNG. Se a imagem enviada tiver outro formato (um JPG, por exemplo), ela é convertida para PNG antes da codificação, e o arquivo pode ficar bem maior. Para manter a imagem original sem recompressão, escolha na lista o mesmo formato do arquivo enviado. As opções disponíveis são PNG, JPEG, WEBP, AVIF, BMP, ICO, SVG e TGA. WEBP e AVIF dependem de o navegador conseguir gerar esses formatos, e o SVG gerado contém a imagem como PNG, não uma versão vetorial.',
    ],
  },
  {
    title: 'Quando usar e o que esperar do tamanho',
    paragraphs: [
      'O Base64 serve para embutir imagens pequenas (ícones, logotipos, miniaturas) em HTML, CSS, JSON ou e-mails, ou para testar uma API que recebe a imagem como texto. O texto gerado é cerca de um terço maior que o arquivo original, e uma foto grande vira um texto com milhares de caracteres, o que não costuma ser uma boa ideia dentro de páginas web.',
      'Use "Copiar" para levar o resultado para a área de transferência ou "Baixar .txt" para salvar o texto em um arquivo. Para o caminho inverso, use o visualizador de Base64.',
    ],
    list: [
      'Embutir um ícone pequeno em CSS ou HTML sem um arquivo separado.',
      'Montar o corpo de uma requisição de teste que recebe a imagem em Base64.',
      'Guardar uma imagem pequena em um campo de texto, JSON ou banco de dados.',
    ],
  },
  {
    title: 'Limites e privacidade',
    paragraphs: [
      'A imagem é lida e codificada no navegador e não é enviada a nenhum servidor. Arquivos muito grandes dependem da memória do aparelho, e, quando há conversão de formato, a imagem é redesenhada e perde metadados como a data e o local da foto.',
    ],
  },
];

export const imageToBase64Faq: FaqItem[] = [
  {
    question: 'A imagem que eu envio sobe para algum servidor?',
    answer:
      'Não. A imagem é lida e convertida no navegador. Nem a imagem nem o texto gerado são enviados ao nosso servidor.',
  },
  {
    question: 'Qual a diferença entre data URL e somente Base64?',
    answer:
      'O data URL traz o prefixo com o tipo da imagem (data:image/png;base64,) e pode ser usado direto em HTML ou CSS. "Somente Base64" entrega só o texto codificado, para campos de API ou outros usos em que você informa o tipo separadamente.',
  },
  {
    question: 'Por que meu JPG virou PNG?',
    answer:
      'Porque o formato para codificar começa em PNG e a ferramenta converte a imagem quando o formato escolhido é diferente do enviado. Selecione o mesmo formato do arquivo (por exemplo, JPEG) para manter a imagem como está.',
  },
  {
    question: 'Por que o Base64 é maior que o arquivo?',
    answer:
      'Porque o Base64 representa cada 3 bytes com 4 caracteres, o que deixa o texto cerca de 33% maior que o arquivo original.',
  },
];
