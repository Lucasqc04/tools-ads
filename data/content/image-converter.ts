import type { ContentBlock, FaqItem } from '@/types/content';

export const imageConverterIntro =
  'Converta uma imagem entre PNG, JPEG, WEBP, AVIF e outros formatos, transforme uma imagem em PDF ou extraia as páginas de um PDF como imagens. Tudo no navegador, sem cadastro.';

export const imageConverterContentBlocks: ContentBlock[] = [
  {
    title: 'Como usar o conversor de imagem e PDF',
    paragraphs: [
      'Escolha o formato de origem, o formato de destino e selecione um arquivo. A ferramenta converte um arquivo por vez e libera o download no mesmo lugar. Em formatos com perda, como JPEG, WEBP e AVIF, há um controle de qualidade (o padrão é 90%): valores mais altos mantêm mais detalhe e geram arquivos maiores.',
      'O PDF funciona nos dois sentidos. Ao converter imagem para PDF, o resultado é um PDF de uma página com o mesmo tamanho da imagem, e áreas transparentes ficam brancas. Ao converter PDF para imagem, cada página vira um arquivo separado. Por padrão são convertidas as 5 primeiras páginas, e você pode aumentar o limite até 120 páginas por vez.',
    ],
  },
  {
    title: 'Formatos de saída e o que esperar de cada um',
    paragraphs: [
      'Os formatos de destino disponíveis são PNG, JPEG, WEBP, AVIF, BMP, ICO, SVG, TGA e PDF. AVIF e WEBP dependem de o seu navegador saber gerar esses arquivos; se ele não souber, a ferramenta avisa em vez de entregar um arquivo errado. O BMP é salvo em 24 bits, sem transparência, e o TGA em 32 bits sem compressão.',
      'Dois destinos têm particularidades. O SVG gerado apenas embute a imagem como PNG dentro de um arquivo SVG, então não vira um desenho vetorial editável. O ICO contém uma única imagem no tamanho original; para um conjunto completo de ícones de site, use o gerador de favicon.',
    ],
    list: [
      'PNG para JPEG: reduz o peso de imagens sem transparência.',
      'JPEG para WEBP ou AVIF: costuma gerar arquivos menores para páginas web.',
      'HEIC de iPhone para JPEG: deixa a foto aberta em qualquer sistema.',
      'Imagem para PDF: junta uma foto ou digitalização em um documento para anexar.',
      'PDF para PNG ou JPEG: extrai páginas para revisar ou editar como imagem.',
    ],
  },
  {
    title: 'Formatos de origem, HEIC e limites',
    paragraphs: [
      'A lista de origem inclui também TIFF, DDS, HDR, EXR, PSD e formatos RAW de câmera (CR2, NEF, ARW), mas quem lê o arquivo é o próprio navegador. Formatos comuns da web, como PNG, JPEG, WEBP, GIF, BMP e SVG, abrem sem problema. HEIC e HEIF dependem de o navegador oferecer suporte; se a foto não abrir, exporte uma cópia em JPEG no aparelho e tente novamente. Os formatos profissionais e RAW normalmente não abrem; nesse caso, exporte o arquivo para PNG ou JPEG no programa onde ele foi criado.',
      'Todo o processamento de imagens e PDFs acontece no navegador. Arquivos HEIC e HEIF também não são enviados ao servidor: eles só podem ser convertidos quando o navegador consegue lê-los. O leitor de PDF carrega um script de apoio de um CDN público, mas o conteúdo do seu PDF não é enviado.',
      'Arquivos muito grandes ou PDFs com muitas páginas dependem da memória do aparelho. No celular, converta poucas páginas por vez. A conversão não preserva camadas, animações de GIF nem metadados da imagem original.',
    ],
  },
];

export const imageConverterFaq: FaqItem[] = [
  {
    question: 'Meus arquivos são enviados para um servidor?',
    answer:
      'Não. A conversão acontece no navegador e os arquivos não são enviados ao servidor. Para abrir HEIC ou HEIF, o navegador precisa ter suporte a esses formatos; se não abrir, salve uma cópia em JPEG no aparelho.',
  },
  {
    question: 'Para quais formatos posso converter?',
    answer:
      'PNG, JPEG, WEBP, AVIF, BMP, ICO, SVG, TGA e PDF. AVIF e WEBP dependem de o navegador conseguir gerar o arquivo. O SVG gerado contém a imagem embutida como PNG, não um desenho vetorial.',
  },
  {
    question: 'Consigo converter PDF para imagem e imagem para PDF?',
    answer:
      'Sim. No PDF para imagem, cada página gera um arquivo (5 páginas por padrão, até 120 por vez). Na imagem para PDF, o resultado é um PDF de uma página com o tamanho da imagem.',
  },
  {
    question: 'Por que meu arquivo PSD, RAW ou TIFF não abriu?',
    answer:
      'Esses formatos aparecem na lista, mas a leitura depende do navegador, que em geral não abre PSD, EXR, DDS e RAW de câmera. Exporte o arquivo como PNG ou JPEG no programa original e converta em seguida.',
  },
  {
    question: 'Qual formato escolher para usar em um site?',
    answer:
      'WEBP ou JPEG costumam dar boa relação entre qualidade e tamanho. Use PNG se precisar de transparência. Teste a qualidade (o padrão é 90%) e compare o tamanho do arquivo antes de publicar.',
  },
];
