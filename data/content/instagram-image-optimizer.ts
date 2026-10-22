import type { ContentBlock, FaqItem } from '@/types/content';

export const instagramImageOptimizerIntro =
  'Ajuste fotos para Feed, Carrossel ou Story: escolha o formato, reposicione o corte, compare o resultado e baixe a imagem pronta. O processamento acontece no navegador.';

export const instagramImageOptimizerContentBlocks: ContentBlock[] = [
  {
    title: 'Prepare o enquadramento antes de publicar',
    paragraphs: [
      'O otimizador de imagem para Instagram ajusta o enquadramento de uma foto para Feed, Carrossel, Story ou capa de Reel. Escolha um destino e a ferramenta mostra um quadro de corte que você pode arrastar e ampliar. Assim, dá para conferir o que ficará dentro da imagem final antes de baixar.',
      'Para fotos do Feed, o preset vertical 3:4 usa 1080 × 1440 pixels como referência. O Instagram também aceita fotos em outros formatos, como 4:5, quadrado e paisagem dentro dos limites publicados pela plataforma. Story e capa de Reel usam 9:16 como referência visual; isso não impede que o próprio Instagram faça novos ajustes ao publicar.',
    ],
  },
  {
    title: 'O que muda no arquivo preparado',
    paragraphs: [
      'Quando a imagem é maior do que o destino, ela é reduzida sem ampliação automática. Se a proporção escolhida for diferente da original, o corte é aplicado ao arquivo exportado. A ferramenta usa JPEG em fotos por padrão e mantém PNG em imagens PNG para evitar remover transparência ou degradar gráficos sem uma escolha explícita.',
      'Se a proporção e as dimensões da imagem já couberem no destino, a opção automática mantém os bytes originais. Isso evita uma nova codificação desnecessária. Ao redimensionar, cortar ou trocar o formato, o navegador cria um novo arquivo e pode remover metadados como localização; perfis de cor e HDR também podem ser alterados pela decodificação e codificação do navegador.',
    ],
    list: [
      'Feed vertical 3:4, retrato 4:5, quadrado ou horizontal.',
      'Story e capa de Reel em 9:16; perfil em 1:1.',
      'Ajuste opcional de posição e zoom para cada foto.',
      'Comparação antes/depois, downloads individuais e ZIP para o lote.',
      'Registro local opcional das condições de publicação e da sua preferência após comparar no Instagram.',
    ],
  },
  {
    title: 'Privacidade e limites',
    paragraphs: [
      'As imagens não são enviadas a um servidor: leitura, corte e exportação são feitos localmente no navegador. O original continua disponível para comparação e pode ser baixado sem alteração. O comportamento de orientação EXIF e suporte a HEIC dependem dos codecs do navegador e do dispositivo; se uma foto não abrir, salve uma cópia em JPEG e tente novamente.',
      'O arquivo exportado é uma preparação técnica, não uma simulação da compressão do Instagram. A plataforma pode recomprimir a imagem depois da publicação, então não existe garantia de que uma versão preparada ficará visualmente melhor em todos os aparelhos. Compare as opções publicando-as sob as mesmas condições e observando o resultado no próprio Instagram.',
      'Depois da comparação, você pode guardar uma nota local com aparelho, versão do Instagram, tipo de publicação e condições usadas. Esse histórico fica no navegador deste aparelho e não contém as imagens.',
    ],
  },
];

export const instagramImageOptimizerFaq: FaqItem[] = [
  {
    question: 'As imagens são enviadas para um servidor?',
    answer:
      'Não. A seleção, o corte, o redimensionamento e a exportação acontecem no navegador. A ferramenta não envia as fotos para um servidor.',
  },
  {
    question: 'O Instagram aceita fotos em 3:4?',
    answer:
      'Sim. O Instagram anunciou suporte a fotos 3:4 no Feed e em carrosséis. O aplicativo ainda pode aplicar processamento próprio ao publicar.',
  },
  {
    question: 'A ferramenta garante que o Instagram não vai comprimir a foto?',
    answer:
      'Não. O Instagram pode recomprimir imagens durante a publicação. A ferramenta só prepara o arquivo e não prevê o resultado final da plataforma.',
  },
  {
    question: 'Posso manter a imagem sem alterações?',
    answer:
      'Sim. Escolha “Manter original” para usar os mesmos bytes da foto. No modo automático, uma foto já adequada ao destino também é mantida sem recodificação.',
  },
  {
    question: 'Quais formatos posso usar?',
    answer:
      'JPEG, PNG e WebP são os formatos mais compatíveis. HEIC/HEIF pode abrir em alguns navegadores; se o aparelho não tiver um codec compatível, salve a foto como JPEG antes de enviá-la.',
  },
];
