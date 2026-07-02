import type { ContentBlock, FaqItem } from '@/types/content';

export const audioEditorIntro =
  'Extraia audio de videos, importe arquivos de audio ou URLs diretas de midia, corte pela waveform, renomeie trechos e baixe cada clip separado em MP3 ou outros formatos.';

export const audioEditorContentBlocks: ContentBlock[] = [
  {
    title: 'Extrair audio de video e editar no mesmo fluxo',
    paragraphs: [
      'Esta ferramenta foi criada para quem precisa pegar sons especificos de um video e transformar em arquivos de audio prontos para uso. Voce pode enviar um video, importar uma URL direta de arquivo de midia, extrair a faixa de audio e abrir o editor com waveform para selecionar exatamente o trecho desejado.',
      'O fluxo tambem aceita audio importado diretamente. Isso ajuda quando voce ja tem um MP3, WAV, M4A, OGG ou FLAC e quer apenas recortar, renomear e exportar partes menores sem instalar um editor pesado.',
    ],
  },
  {
    title: 'Cortes por waveform, preview e exportacao por trecho',
    paragraphs: [
      'Depois que a faixa e carregada, a pagina mostra a onda sonora para facilitar a localizacao de picos, pausas, falas e efeitos. Clique para posicionar o cursor, arraste na waveform para criar selecoes e use as alcas do trecho para mover ou redimensionar cortes com precisao.',
      'Cada corte pode ter um nome proprio antes do download. Isso e util para organizar efeitos de jogo, falas, sons ambientes, samples, trilhas curtas, audios para redes sociais e materiais de referencia.',
    ],
    list: [
      'Extrair audio de video em MP3, WAV, M4A, OGG ou WEBM.',
      'Importar URLs diretas de audio ou video quando o servidor permitir acesso pelo navegador.',
      'Tentar separar multiplas faixas internas de audio quando o arquivo tiver streams diferentes.',
      'Ouvir a selecao antes de exportar.',
      'Criar varios cortes e baixar os arquivos separados.',
      'Renomear cada trecho antes do download.',
    ],
  },
  {
    title: 'Exemplos praticos de uso',
    paragraphs: [
      'Um desenvolvedor de jogo pode enviar um video gravado no celular, encontrar o som de agua, porta, passos ou impacto, cortar apenas a parte limpa e baixar um MP3 separado para testar no projeto.',
      'Criadores de conteudo podem remover sobras no inicio e no fim de uma gravacao, dividir uma entrevista em partes menores ou extrair audio de um video curto para reaproveitar em edicoes futuras.',
    ],
  },
  {
    title: 'Privacidade, formatos e limites',
    paragraphs: [
      'O editor foi pensado para processamento local no navegador. A waveform, o preview e a exportacao com FFmpeg rodam no dispositivo do usuario, sem envio automatico dos arquivos para servidor por esta ferramenta.',
      'URLs diretas dependem de CORS e permissao do servidor de origem. Links de plataformas como YouTube, X/Twitter e Facebook nao sao baixados diretamente pela ferramenta; nesses casos, use um arquivo local que voce tenha permissao para editar.',
      'Arquivos muito longos ou pesados podem exigir bastante memoria e CPU. Em celulares simples, prefira trabalhar com videos menores ou exportar poucos cortes por vez. Alguns formatos antigos ou muito especificos dependem do suporte do FFmpeg no navegador.',
    ],
  },
];

export const audioEditorFaq: FaqItem[] = [
  {
    question: 'Consigo extrair audio de video e baixar em MP3?',
    answer:
      'Sim. Envie o video ou importe uma URL direta de arquivo, clique para extrair o audio e escolha MP3 como formato de saida antes de exportar os cortes.',
  },
  {
    question: 'Posso importar um audio pronto e apenas recortar?',
    answer:
      'Sim. A ferramenta aceita arquivos de audio como MP3, WAV, M4A, OGG e FLAC para cortar, ouvir e exportar trechos separados.',
  },
  {
    question: 'Da para separar faixas internas de audio de um video?',
    answer:
      'A ferramenta tenta separar streams de audio quando o arquivo possui mais de uma faixa interna. Se o video tiver tudo misturado em uma unica faixa, nao ha como isolar vozes, musica ou efeitos perfeitamente sem separacao por inteligencia artificial.',
  },
  {
    question: 'Os arquivos sao enviados para servidor?',
    answer:
      'Nao por padrao. O processamento da ferramenta acontece no navegador usando APIs locais e FFmpeg carregado no cliente.',
  },
  {
    question: 'Posso colar link do YouTube, X/Twitter ou Facebook?',
    answer:
      'Nao para download direto dessas plataformas. A ferramenta aceita upload local e URLs diretas de arquivos de midia quando o servidor permite acesso pelo navegador.',
  },
];
