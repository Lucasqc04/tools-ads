import type { ContentBlock, FaqItem } from '@/types/content';

export const audioBlasterIntro =
  'Envie um áudio ou grave pelo microfone para criar efeitos de clipping, saturação, foldback, bitcrush e rádio; ouça antes de baixar.';

export const audioBlasterContentBlocks: ContentBlock[] = [
  {
    title: 'Distorção de áudio intencional para memes',
    paragraphs: [
      'O estourador de áudio aplica distorção digital de propósito para deixar uma fala, efeito ou trecho musical mais agressivo, saturado ou com aparência de gravação ruim. Envie um arquivo curto ou grave uma fala pelo microfone, escolha um preset e ajuste o ganho, o drive e a mistura do efeito. A prévia permite comparar a textura antes de salvar o resultado.',
      'O clipping seco corta os picos de volume e cria o som quadrado associado a áudios estourados. A saturação suave arredonda esses picos. O foldback dobra a forma de onda quando o sinal passa do limite, produzindo harmônicos mais ásperos. O bitcrush reduz a resolução e segura o valor das amostras por mais tempo, dando uma textura de videogame antigo. O modo rádio filtra graves e agudos para aproximar a voz de um megafone ou alto-falante pequeno.',
    ],
  },
  {
    title: 'Presets e controles para encontrar o efeito',
    paragraphs: [
      'Os presets Estouro clássico, Rádio ruim, 8-bit e Overdrive meme servem como ponto de partida. Depois você pode trocar o algoritmo e regular ganho entre 0 e 30 dB, drive, mistura e, no bitcrush, profundidade de bits e redução de amostras. Aumentar o ganho e o drive costuma intensificar a distorção, enquanto diminuir a mistura deixa mais do áudio limpo na saída.',
      'Use uma frase curta para criar uma reação exagerada, aumente o bitcrush para um efeito digital retrô ou escolha rádio para uma voz estreita e áspera. A exportação oferece WAV para evitar nova compressão e MP3 com taxa de bits ajustável para compartilhar um arquivo menor.',
    ],
    list: [
      'Clipping seco para picos bem evidentes.',
      'Saturação suave para um estouro menos rígido.',
      'Foldback para uma distorção intensa e irregular.',
      'Bitcrush com controle de resolução e retenção de amostras.',
      'Filtro de rádio/megafone para falas e efeitos curtos.',
    ],
  },
  {
    title: 'Arquivos aceitos e privacidade',
    paragraphs: [
      'O processamento é local: o áudio enviado ou gravado é decodificado e transformado no navegador, sem ser enviado ao servidor do site. A gravação precisa de permissão para acessar o microfone. A prévia é criada como WAV. Se você escolher MP3, o navegador carrega o codificador local para gerar a versão compactada; o primeiro uso pode demorar um pouco mais.',
      'Para manter a edição responsiva, são aceitos arquivos de até 100 MB e áudios de até quatro minutos. O áudio descompactado pode ocupar muito mais memória do que o arquivo MP3 ou M4A original. Se o navegador não conseguir decodificar determinado codec, converta o arquivo para MP3 ou WAV e tente novamente. Distorção forte pode tornar a fala menos inteligível e causar picos desagradáveis; ajuste o volume de reprodução antes de ouvir em caixas altas.',
    ],
  },
];

export const audioBlasterFaq: FaqItem[] = [
  {
    question: 'O que significa estourar o áudio?',
    answer:
      'É aplicar clipping ou saturação de propósito para cortar os picos e criar um som distorcido, comum em memes, efeitos cômicos e vozes exageradas.',
  },
  {
    question: 'Quais efeitos estão disponíveis?',
    answer:
      'Há clipping seco, saturação suave, foldback, bitcrush e efeito de rádio/megafone, além de presets para começar rapidamente.',
  },
  {
    question: 'Posso gravar pelo microfone e ouvir antes de baixar?',
    answer:
      'Sim. Permita o acesso ao microfone para gravar uma fala de até quatro minutos, ou envie um arquivo. A ferramenta gera uma prévia WAV que pode ser reproduzida antes de exportar em WAV ou MP3.',
  },
  {
    question: 'Meu áudio é enviado para algum servidor?',
    answer:
      'Não. A decodificação, os efeitos e a prévia são processados localmente no navegador.',
  },
  {
    question: 'Qual é o limite do arquivo?',
    answer:
      'O limite é 100 MB e quatro minutos por áudio para controlar o uso de memória durante a edição local.',
  },
];
