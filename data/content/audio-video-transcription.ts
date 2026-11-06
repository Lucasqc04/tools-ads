import type { ContentBlock, FaqItem } from '@/types/content';

export const audioVideoTranscriptionIntro =
  'Transcreva áudio e vídeo para texto no navegador, revise os trechos com timestamp e gere um vídeo com legendas personalizadas. Seu arquivo não é enviado a um servidor.';

export const audioVideoTranscriptionContentBlocks: ContentBlock[] = [
  {
    title: 'Como transcrever áudio e vídeo no navegador',
    paragraphs: [
      'A ferramenta usa o modelo de reconhecimento de fala Whisper para transformar a fala em texto e dividir o resultado em trechos com timestamps. Envie áudio (MP3, WAV, M4A, AAC, OGG, OPUS, FLAC) ou vídeo (MP4, MOV, WEBM, MKV e outros): em vídeos, o navegador extrai a faixa de áudio antes de reconhecer a fala. O arquivo pode ter até 2 GB e até 4 horas de duração.',
      'Você pode deixar o idioma em detecção automática ou escolher português, inglês, espanhol, francês, alemão, italiano, japonês, coreano, chinês ou russo. Também existe o modo de traduzir a fala para inglês. Em Qualidade, as opções são Rápido (modelo tiny, cerca de 75 MB), Equilibrado (modelo base, cerca de 135 MB, a opção recomendada) e Alta qualidade (modelo small, de 250 a 410 MB), que é mais lenta e usa mais memória.',
    ],
  },
  {
    title: 'Velocidade, primeiro uso e precisão',
    paragraphs: [
      'Na primeira transcrição, os arquivos do modelo escolhido são baixados e guardados no cache do navegador; nas próximas vezes eles já estão no aparelho. Se o navegador tiver WebGPU, a transcrição usa a placa de vídeo. Sem ela, roda pelo processador, mais devagar, e em celulares e aparelhos modestos a ferramenta sugere o modelo Rápido. Não há tempo fixo: depende do aparelho, do modelo e do tamanho do arquivo, e em gravações longas pelo processador pode levar mais do que a duração do áudio.',
      'O reconhecimento automático erra. Nomes próprios, sotaques, termos técnicos, fala sobreposta, música e áudio com ruído costumam gerar trechos incorretos, e o modelo pode repetir frases quando perde o contexto. A ferramenta reduz repetições longas, mas isso não substitui a revisão. Confira cada trecho junto do timestamp e use o player para ouvir aquele ponto.',
    ],
  },
  {
    title: 'Edite o texto e gere legendas para vídeo',
    paragraphs: [
      'Cada trecho tem um campo editável que mantém o timestamp. Trechos longos são divididos em linhas menores, próprias para legenda. Corrija palavras, pontuação e nomes antes de exportar. Depois, copie o texto ou baixe em TXT, TXT com timestamps, SRT, VTT ou JSON.',
      'Para um vídeo com legendas gravadas na imagem, escolha “Legendar vídeo” no resultado. A prévia acompanha a reprodução e permite colocar o texto em cima, no centro ou embaixo, ajustar tamanho e cor, escolher fonte (sem serifa, com serifa ou monoespaçada) e ativar um fundo escuro. O navegador regrava o vídeo em tempo real: mantenha a página aberta até terminar. A saída é limitada a 1920 por 1080 pixels e o formato (geralmente WebM ou MP4) depende do navegador. Se a gravação não estiver disponível, baixe o SRT ou o VTT e aplique as legendas em outro editor.',
    ],
  },
  {
    title: 'Privacidade e limites',
    paragraphs: [
      'Áudio, vídeo, transcrição e vídeo legendado são processados no seu aparelho e não são enviados aos nossos servidores nem incluídos em eventos de análise. O que é baixado de fora é o modelo de transcrição, hospedado na Hugging Face, na primeira vez que você o usa.',
      'Arquivos longos exigem memória. Se o aparelho ficar sem memória, a transcrição falha com uma mensagem de erro; nesse caso, tente o modelo Rápido ou divida a gravação em partes menores. Você pode cancelar a transcrição a qualquer momento.',
    ],
  },
];

export const audioVideoTranscriptionFaq: FaqItem[] = [
  {
    question: 'Meu áudio ou vídeo é enviado para algum servidor?',
    answer:
      'Não. O reconhecimento, a prévia e a renderização das legendas acontecem no navegador. Só os arquivos do modelo de transcrição são baixados na primeira vez e ficam em cache.',
  },
  {
    question: 'Quais idiomas são aceitos e quanto a transcrição é precisa?',
    answer:
      'Português, inglês, espanhol, francês, alemão, italiano, japonês, coreano, chinês e russo, ou detecção automática. A precisão varia com a qualidade do áudio, o sotaque, o ruído e o modelo escolhido, então revise o texto antes de usar.',
  },
  {
    question: 'Quanto tempo leva e qual modelo devo escolher?',
    answer:
      'Depende do aparelho e do tamanho do arquivo. Equilibrado (modelo base) é o recomendado; Rápido (tiny) é mais leve para celulares; Alta qualidade (small) erra menos, mas baixa mais dados e usa mais memória. Sem WebGPU, a transcrição roda pelo processador e pode demorar mais que o próprio áudio.',
  },
  {
    question: 'Posso corrigir o texto e gerar um vídeo com legendas?',
    answer:
      'Sim. Cada trecho é editável e mantém o timestamp. Escolha “Legendar vídeo” para ajustar posição, tamanho, cor e fonte e gerar uma cópia do vídeo com as legendas gravadas. Também dá para baixar SRT, VTT, TXT ou JSON.',
  },
  {
    question: 'Existe limite de tamanho ou duração?',
    answer:
      'O arquivo pode ter até 2 GB e 4 horas de duração. Em aparelhos com pouca memória, arquivos longos podem falhar: use o modelo Rápido ou divida a gravação em partes.',
  },
];
