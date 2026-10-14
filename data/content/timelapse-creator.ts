import type { ContentBlock, FaqItem } from '@/types/content';

export const timelapseCreatorIntro =
  'Acelere vídeos longos, controle a velocidade em cada trecho e exporte um timelapse MP4 ou WebM direto no navegador.';

export const timelapseCreatorContentBlocks: ContentBlock[] = [
  {
    title: 'Crie um timelapse com controle por trecho',
    paragraphs: [
      'O criador de timelapse transforma gravações longas em vídeos curtos ao acelerar a reprodução. Envie uma gravação de obra, montagem, desenho, cultivo, céu, viagem ou rotina e escolha quantas vezes cada parte deve ficar mais rápida. A ferramenta começa com o vídeo inteiro em 4× para você ter um resultado imediato, mas cada trecho pode receber uma velocidade própria.',
      'A linha do tempo pode ser dividida no ponto atual da prévia. Isso permite, por exemplo, deixar uma introdução em velocidade normal, acelerar horas de processo em 16× e desacelerar os segundos finais para mostrar o resultado com mais clareza. Também é possível retirar um trecho da exportação sem editar o arquivo original.',
    ],
  },
  {
    title: 'Ajuste a duração, a fluidez e o formato',
    paragraphs: [
      'A duração final estimada muda conforme a velocidade e os trechos incluídos. Um segmento de dez minutos em 10× ocupa cerca de um minuto no vídeo final; se outro segmento ficar em 0,5×, ele passa a durar o dobro. A estimativa aparece enquanto você ajusta as velocidades, então fica fácil decidir se o timelapse serve para uma publicação curta ou para uma demonstração mais longa.',
      'Escolha 24, 30 ou 60 quadros por segundo, qualidade alta, equilibrada ou mais leve, e exporte em MP4 ou WebM. Para compartilhar em redes sociais, MP4 costuma ser a opção mais compatível. WebM pode ser útil quando o navegador ou fluxo de edição já trabalha com esse formato.',
    ],
    list: [
      'Acelerar o vídeo inteiro ou só alguns segmentos.',
      'Reduzir a velocidade de uma parte para destacar detalhes.',
      'Dividir a linha do tempo no ponto escolhido na prévia.',
      'Remover intervalos e estimar o tempo final antes de renderizar.',
    ],
  },
  {
    title: 'Processamento local e limites para vídeos grandes',
    paragraphs: [
      'O vídeo é lido, decodificado e codificado no próprio navegador. A ferramenta grava a saída em armazenamento temporário local durante a renderização, sem enviar o arquivo para o servidor do site. A disponibilidade de exportação depende de WebCodecs, dos codecs que o navegador oferece e do espaço livre no dispositivo.',
      'O limite de seleção é 10 GB, mas aceitar um arquivo não garante que todo aparelho consiga renderizá-lo: resolução, duração, codec, memória, bateria e espaço disponível influenciam bastante o tempo e a conclusão do trabalho. Arquivos longos podem levar minutos ou horas. Mantenha a página aberta durante a exportação; navegadores móveis podem pausar tarefas em segundo plano. O resultado é exportado sem áudio, pois uma trilha original acelerada pode ficar fora de sincronia ou ter o tom alterado.',
    ],
  },
];

export const timelapseCreatorFaq: FaqItem[] = [
  {
    question: 'Posso acelerar só uma parte do vídeo?',
    answer:
      'Sim. Pause a prévia no ponto desejado, divida o trecho selecionado e escolha uma velocidade para cada segmento. Também pode manter, desacelerar ou excluir cada parte.',
  },
  {
    question: 'A ferramenta aceita vídeos grandes?',
    answer:
      'A seleção aceita arquivos de até 10 GB e a renderização usa processamento local em fluxo. O sucesso depende de codecs, memória e espaço livre do navegador e do dispositivo.',
  },
  {
    question: 'O vídeo final mantém o áudio original?',
    answer:
      'Não. O timelapse é exportado sem áudio para evitar dessincronização e mudanças bruscas no tom da gravação original.',
  },
  {
    question: 'Quais formatos posso baixar?',
    answer:
      'Você pode escolher MP4 ou WebM, além de 24, 30 ou 60 quadros por segundo e três níveis de qualidade.',
  },
  {
    question: 'Meu vídeo é enviado para um servidor?',
    answer:
      'Não. A leitura e a renderização acontecem no navegador. A saída temporária é escrita no armazenamento local do dispositivo.',
  },
];
