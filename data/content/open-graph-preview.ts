import type { ContentBlock, FaqItem } from '@/types/content';

export const openGraphPreviewIntro =
  'Informe o endereço de uma página pública e veja o Open Graph preview do link: título, descrição e imagem como aparecem em redes sociais, com as meta tags lidas prontas para copiar.';

export const openGraphPreviewContentBlocks: ContentBlock[] = [
  {
    title: 'Como usar o preview de links',
    paragraphs: [
      'Cole a URL de uma página já publicada (http ou https) e clique em "Analisar URL". A ferramenta lê as meta tags Open Graph e Twitter Card da página e mostra uma simulação do link no WhatsApp, Facebook, LinkedIn, X/Twitter, Discord e Google. Use o seletor de rede para comparar como título, descrição e imagem aparecem em cada uma.',
      'Abaixo do preview, um checklist indica se a página tem og:title, og:description, og:image, og:url, twitter:card, canonical, favicon e manifest, se a imagem usa HTTPS e se título (até 70 caracteres) e descrição (até 200) cabem nos limites usados como referência.',
    ],
    list: [
      'Ícones, imagens e arquivos encontrados na página, com cópia do endereço e download.',
      'Lista completa das meta tags e dos links técnicos (canonical, alternates, hreflang, manifest).',
      'Snippet de meta tags HTML e de metadata do Next.js montados com os valores lidos.',
    ],
  },
  {
    title: 'Como a análise por URL funciona e quais são os limites',
    paragraphs: [
      'A consulta é feita pelo servidor do site, não pelo seu navegador: a URL é enviada à nossa API, que baixa o HTML e devolve os dados. Por isso a página precisa estar acessível na internet. Endereços locais, de rede interna ou com usuário e senha, e portas diferentes de 80 e 443, são recusados.',
      'A API segue até 4 redirecionamentos, espera no máximo 12 segundos e lê até 2 MB de HTML. Ela não executa JavaScript: se as meta tags só são inseridas depois que a página carrega no navegador, a ferramenta não as verá. Ao copiar ou baixar uma imagem, o servidor busca o arquivo (até 15 MB) em nome do navegador.',
      'A ferramenta não tem formulário para digitar as tags manualmente, então só gera os trechos de código a partir de uma página que já esteja no ar. Revise o código antes de colar: aspas e caracteres especiais no conteúdo lido não são escapados.',
    ],
  },
  {
    title: 'Privacidade e prévia desatualizada',
    paragraphs: [
      'O endereço informado e o conteúdo da página consultada passam pelo servidor do site durante a análise. Não informe links privados ou endereços que você não tenha autorização para consultar.',
      'O preview é uma simulação com base nas meta tags: cada rede monta o cartão final do seu jeito e pode manter um link em cache por dias. Se corrigiu a imagem e a prévia não mudou, é preciso pedir à própria rede que atualize o link.',
    ],
  },
];

export const openGraphPreviewFaq: FaqItem[] = [
  {
    question: 'O que é Open Graph?',
    answer:
      'É um conjunto de meta tags (og:title, og:description, og:image e outras) que define o título, a descrição e a imagem usados quando um link é compartilhado em redes sociais e mensageiros.',
  },
  {
    question: 'Por que meu link aparece sem imagem no WhatsApp?',
    answer:
      'Em geral falta a og:image, a URL da imagem não é pública ou não usa HTTPS, o arquivo é grande demais ou a rede ainda mostra uma prévia antiga em cache. O checklist da ferramenta aponta se a tag existe e se a imagem usa HTTPS.',
  },
  {
    question: 'A URL é enviada ao servidor do site?',
    answer:
      'Sim. O servidor do site busca a página para ler as meta tags, porque o navegador não consegue ler o HTML de outros sites. Por isso, use só endereços públicos que você pode consultar. Links internos, locais ou com senha são recusados.',
  },
  {
    question: 'Consigo testar uma página que ainda não foi publicada?',
    answer:
      'Não diretamente. A ferramenta precisa abrir a URL pela internet e não aceita digitar as tags à mão. Publique a página em um endereço público, mesmo que seja de teste, e analise por ele.',
  },
  {
    question: 'Qual tamanho de imagem é recomendado para a prévia?',
    answer:
      'Uma imagem de 1200 × 630 pixels, com URL absoluta em HTTPS, costuma funcionar bem na maioria das redes.',
  },
];
