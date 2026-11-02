import type { ContentBlock, FaqItem } from '@/types/content';

export const audioVideoTranscriptionIntro =
  'Transcreva áudio e vídeo no navegador, revise os trechos com timestamp e crie um vídeo com legendas personalizadas. Ajuste a posição, o tamanho, a cor e a fonte, sem enviar sua mídia para um servidor.';

export const audioVideoTranscriptionContentBlocks: ContentBlock[] = [
  {
    title: 'Transcrição de áudio e vídeo no navegador',
    paragraphs: [
      'A ferramenta usa Whisper para transformar falas em texto e dividir o resultado em trechos com timestamps. Você pode enviar arquivos de áudio como MP3, WAV, M4A, AAC, OGG, OPUS ou FLAC, além de vídeos MP4, MOV, WEBM e MKV. Em vídeos, o navegador extrai a faixa de áudio para reconhecer a fala.',
      'O modelo funciona no seu dispositivo. Se o navegador permitir, a transcrição usa WebGPU; caso contrário, executa pela CPU com um modelo leve sugerido para celulares e aparelhos de menor capacidade. Na primeira utilização, os arquivos do modelo precisam ser baixados e podem ocupar espaço em cache.',
    ],
  },
  {
    title: 'Revise o texto e reduza repetições inesperadas',
    paragraphs: [
      'O reconhecimento automático pode errar nomes, sotaques, falas sobrepostas, trechos cantados ou áudio com ruído. A ferramenta reduz loops longos de frases repetidas que podem aparecer quando o modelo perde o contexto, mantendo algumas repetições que fazem parte de uma fala normal. Essa limpeza evita blocos enormes de palavras duplicadas, mas não substitui a revisão do resultado.',
      'Na aba de segmentos, confira cada frase junto do timestamp e use o player para ouvir aquele ponto. Para preparar legendas, os trechos longos são separados em linhas menores e ficam disponíveis para edição. Corrija palavras e pontuação antes de gerar o arquivo final.',
    ],
  },
  {
    title: 'Personalize e exporte legendas para vídeo',
    paragraphs: [
      'Depois de transcrever um vídeo, escolha “Legendar vídeo” no resultado. A prévia acompanha a reprodução e permite colocar o texto em cima, no centro ou embaixo. Ajuste o tamanho, escolha uma cor, use uma fonte sem serifa, com serifa ou monoespaçada e ative um fundo escuro para dar contraste.',
      'Ao gerar o vídeo, as legendas ficam gravadas na imagem. O navegador renderiza o arquivo localmente e em tempo real; mantenha a página aberta até terminar. A resolução de saída é limitada a 1920 por 1080 pixels, e o formato depende do suporte do navegador, geralmente WebM ou MP4. Se a gravação não estiver disponível, exporte SRT ou WebVTT e aplique as legendas em outro editor.',
    ],
  },
  {
    title: 'Privacidade, desempenho e formatos de exportação',
    paragraphs: [
      'Áudio, vídeo, transcrição e vídeo legendado são processados no navegador e não são enviados aos nossos servidores nem incluídos em eventos de análise. Apenas os arquivos do modelo de transcrição são baixados de uma fonte externa para que o reconhecimento funcione.',
      'A velocidade depende do aparelho, do tamanho do arquivo e do suporte a WebGPU. Sem aceleração por GPU, a CPU pode levar mais tempo que a duração do áudio, especialmente em gravações extensas. Você pode cancelar a transcrição e, ao terminar, copiar o texto ou exportar TXT, timestamps, SRT, WebVTT e JSON.',
    ],
  },
];

export const audioVideoTranscriptionFaq: FaqItem[] = [
  {
    question: 'Meu áudio ou vídeo é enviado para algum servidor?',
    answer:
      'Não. O reconhecimento, a prévia e a renderização das legendas acontecem localmente no navegador. Apenas os arquivos do modelo de transcrição são baixados para o aparelho.',
  },
  {
    question: 'Como criar um vídeo com as legendas gravadas na imagem?',
    answer:
      'Envie um vídeo, transcreva o áudio e escolha “Legendar vídeo”. Revise os textos com timestamp, ajuste posição, tamanho, cor e fonte e gere uma nova cópia do vídeo.',
  },
  {
    question: 'Posso corrigir palavras antes de exportar?',
    answer:
      'Sim. Cada trecho da legenda tem um campo editável e mantém seu timestamp. Você pode corrigir palavras, pontuação e nomes antes de gerar o vídeo.',
  },
  {
    question: 'Por que a transcrição pode repetir palavras?',
    answer:
      'Modelos de fala podem entrar em loops quando há música, ruído, silêncio ou fala difícil de entender. A ferramenta reduz repetições longas e você pode revisar cada trecho antes de exportar.',
  },
  {
    question: 'A transcrição funciona no celular sem WebGPU?',
    answer:
      'Sim. Sem WebGPU, o navegador usa um modelo mais leve pela CPU. Isso pode demorar mais, mas evita depender de uma placa de vídeo compatível. A renderização do vídeo legendado também acontece no aparelho e em tempo real.',
  },
];
