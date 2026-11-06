import type { ContentBlock, FaqItem } from '@/types/content';

export const audioEditorIntro =
  'Extraia o áudio de um vídeo, ou abra um áudio que você já tem, marque trechos na forma de onda (waveform) e baixe cada corte separado em MP3, WAV, M4A, OGG ou WEBM. Tudo no navegador.';

export const audioEditorContentBlocks: ContentBlock[] = [
  {
    title: 'Como extrair o áudio de um vídeo e cortar trechos',
    paragraphs: [
      'Envie um vídeo (MP4, MOV, WEBM, MKV e outros formatos que o FFmpeg consiga ler) ou um áudio (MP3, WAV, M4A, OGG, FLAC). Os arquivos podem ter até 1 GB. Para vídeos, clique em extrair áudio e a faixa abre no editor. Se o vídeo tiver mais de uma faixa de áudio, marque a opção de separar faixas internas para tentar abrir até 4 delas, como narração, jogo e trilha em faixas diferentes.',
      'No editor, a forma de onda mostra picos, pausas e falas. Clique para posicionar o cursor, arraste para criar uma seleção e mova as alças para ajustar o início e o fim. Você pode ouvir a seleção, repetir em loop, dividir no cursor, criar vários cortes e dar um nome a cada um. Ao final, exporte o corte selecionado, todos os cortes ou a faixa inteira.',
    ],
    list: [
      'Formatos de saída: MP3, WAV, M4A, OGG e WEBM.',
      'Qualidade de 128 a 320 kbps (padrão 192 kbps); no WAV, sem compressão, essa opção não se aplica.',
      'Vários cortes por arquivo, cada um exportado separadamente.',
      'Importação por URL direta de arquivo de áudio ou vídeo, com até 100 MB.',
    ],
  },
  {
    title: 'Exemplos de uso',
    paragraphs: [
      'Quem faz um jogo ou um vídeo pode enviar uma gravação feita no celular, localizar o som de uma porta ou de passos, cortar só a parte limpa e baixar em MP3. Em uma entrevista longa, dá para criar um corte por pergunta e baixar cada trecho com um nome claro. Também serve para tirar o silêncio do início e do fim de uma gravação de voz ou reaproveitar o áudio de um vídeo curto.',
    ],
  },
  {
    title: 'Privacidade, URLs e limites',
    paragraphs: [
      'O corte e a exportação acontecem no seu aparelho, com FFmpeg rodando no navegador, e os arquivos que você envia não vão para o nosso servidor. No primeiro uso, o navegador baixa os componentes do FFmpeg (do próprio site ou, se necessário, de CDNs públicas), então a primeira extração pode demorar mais.',
      'Na importação por URL, o seu navegador baixa o arquivo direto do endereço informado, e esse servidor pode ver o acesso. Só funciona com links diretos de arquivos de áudio ou vídeo, e o servidor de origem precisa permitir o acesso pelo navegador (CORS). Links do YouTube, X/Twitter e Facebook são bloqueados: use um arquivo que você tenha permissão para editar.',
      'Arquivos grandes exigem muita memória, principalmente no celular; nesse caso, trabalhe com vídeos menores ou exporte poucos cortes por vez. A ferramenta separa as faixas que já existem no arquivo, mas não isola voz, música e efeitos misturados em uma única faixa. Alguns formatos antigos podem não ser lidos.',
    ],
  },
];

export const audioEditorFaq: FaqItem[] = [
  {
    question: 'Consigo extrair o áudio de um vídeo e baixar em MP3?',
    answer:
      'Sim. Envie o vídeo, clique em extrair áudio, marque os cortes (ou use a faixa inteira) e escolha MP3 como formato de saída antes de exportar. Há também WAV, M4A, OGG e WEBM.',
  },
  {
    question: 'Posso abrir um áudio pronto e só recortar?',
    answer:
      'Sim. Aceita MP3, WAV, M4A, OGG e FLAC. Você marca os trechos na forma de onda, ouve a seleção e baixa cada corte separado.',
  },
  {
    question: 'Dá para separar as faixas de áudio de um vídeo?',
    answer:
      'Só quando o arquivo tem mais de uma faixa de áudio. Nesse caso, a opção de separar faixas internas abre até 4 delas. Se tudo estiver misturado em uma única faixa, a ferramenta não consegue isolar voz, música e efeitos.',
  },
  {
    question: 'Meus arquivos são enviados para algum servidor?',
    answer:
      'Não. O corte e a exportação rodam no navegador. Na importação por URL, o navegador baixa o arquivo direto do endereço que você informou, e esse servidor pode ver o acesso.',
  },
  {
    question: 'Posso colar um link do YouTube, X ou Facebook?',
    answer:
      'Não, esses links são bloqueados. A ferramenta aceita arquivos do seu aparelho e URLs diretas de áudio ou vídeo (até 100 MB) em servidores que permitam o acesso pelo navegador.',
  },
];
