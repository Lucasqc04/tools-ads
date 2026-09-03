import type { ContentBlock, FaqItem } from '@/types/content';

export const audioVideoTranscriptionIntro =
  'Transcreva audio e video para texto direto no navegador com Whisper rodando localmente, sem enviar o arquivo para nenhum servidor. Obtenha texto continuo, segmentos com timestamp e legendas SRT/VTT.';

export const audioVideoTranscriptionContentBlocks: ContentBlock[] = [
  {
    title: 'Transcricao local com Whisper, sem upload',
    paragraphs: [
      'Esta ferramenta usa um modelo Whisper multilingue rodando inteiramente no seu navegador, atraves de WebGPU quando disponivel (com fallback automatico para processamento por CPU). O arquivo de audio ou video nunca e enviado para o nosso servidor: a extracao de audio, a normalizacao e a inferencia acontecem localmente no seu dispositivo.',
      'Apenas os arquivos do modelo de IA (pesos do Whisper) sao baixados do Hugging Face na primeira vez que voce usa a ferramenta. Depois disso, o navegador guarda esses arquivos em cache e as proximas transcricoes nao exigem um novo download.',
    ],
  },
  {
    title: 'Audio ou video, com extracao automatica da faixa de audio',
    paragraphs: [
      'Voce pode enviar arquivos de audio (MP3, WAV, M4A, AAC, OGG, OPUS, FLAC) ou de video (MP4, MOV, WEBM, MKV e outros). Quando o arquivo e um video, apenas a faixa de audio e extraida e processada; os frames de video nao sao usados na transcricao.',
      'A ferramenta tenta primeiro decodificar o audio usando APIs nativas do navegador. Se o formato ou codec nao for suportado diretamente, ela recorre a um conversor local (FFmpeg compilado para WebAssembly) para extrair o audio antes de transcrever, sem depender de upload.',
    ],
    list: [
      'Selecionar o nivel de qualidade (Rapido, Equilibrado ou Alta qualidade).',
      'Escolher o idioma manualmente ou deixar o Whisper detectar automaticamente.',
      'Transcrever no idioma original ou traduzir para ingles.',
      'Acompanhar progresso real de download do modelo e de transcricao por trecho.',
      'Cancelar a qualquer momento sem travar a pagina.',
    ],
  },
  {
    title: 'Timestamps, player sincronizado e exportacao',
    paragraphs: [
      'O resultado inclui timestamps por trecho, exibidos tanto no texto continuo quanto na lista de segmentos. Clique em qualquer timestamp para mover o player de audio/video exatamente para aquele ponto.',
      'Voce pode copiar o texto puro, copiar com timestamps, ou exportar em TXT, TXT com timestamps, SRT (legenda), WebVTT ou JSON estruturado com os segmentos, idioma e duracao.',
    ],
  },
  {
    title: 'Desempenho, limites e privacidade',
    paragraphs: [
      'Em dispositivos com suporte a WebGPU, a transcricao roda acelerada por GPU. Sem WebGPU, a ferramenta usa processamento por CPU (WebAssembly), que funciona em praticamente qualquer navegador mas e mais lento, especialmente em celulares.',
      'Arquivos muito longos exigem mais memoria do navegador; ha um limite pratico de duracao para evitar que a aba trave. Nenhum audio, video ou texto transcrito e salvo em nossos servidores ou enviado para analytics.',
    ],
  },
];

export const audioVideoTranscriptionFaq: FaqItem[] = [
  {
    question: 'O audio ou video e enviado para algum servidor?',
    answer:
      'Nao. A extracao de audio e a transcricao acontecem localmente no seu navegador. Apenas os arquivos do modelo de IA sao baixados do Hugging Face para rodar a inferencia no seu dispositivo; o seu arquivo de midia nunca sai do navegador.',
  },
  {
    question: 'Quais formatos de audio e video sao aceitos?',
    answer:
      'Audio: MP3, WAV, M4A, AAC, OGG, OPUS e FLAC. Video: MP4, MOV, WEBM, MKV e outros containers com faixa de audio legivel pelo navegador ou pelo conversor local de apoio.',
  },
  {
    question: 'Funciona sem placa de video com suporte a WebGPU?',
    answer:
      'Sim. Quando WebGPU nao esta disponivel, a ferramenta usa automaticamente processamento por CPU. E mais lento, mas continua funcionando dentro do navegador.',
  },
  {
    question: 'Consigo exportar como legenda?',
    answer:
      'Sim. Voce pode exportar o resultado em SRT ou WebVTT, alem de TXT simples, TXT com timestamps e JSON estruturado com os segmentos.',
  },
  {
    question: 'Da para escolher o idioma ou traduzir para ingles?',
    answer:
      'Sim. Voce pode deixar o Whisper detectar o idioma automaticamente ou selecionar um idioma especifico, alem de escolher entre transcrever no idioma original ou traduzir o audio para ingles.',
  },
];
