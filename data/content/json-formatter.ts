import type { ContentBlock, FaqItem } from '@/types/content';

export const jsonFormatterIntro =
  'Formate, minifique e valide JSON no navegador com feedback de erro amigável e cópia rápida do resultado.';

export const jsonFormatterContentBlocks: ContentBlock[] = [
  {
    title: 'Formatação e minificação com validação de sintaxe',
    paragraphs: [
      'Esta página é dedicada ao JSON Formatter. Você pode organizar payloads com indentação para leitura ou gerar versão minificada para transporte, sempre com validação antes do resultado.',
      'Quando o JSON está inválido, a ferramenta retorna erro textual claro para acelerar correção sem depender de extensões externas.',
    ],
  },
  {
    title: 'Casos de uso comuns',
    paragraphs: [
      'No desenvolvimento e suporte técnico, é comum receber payloads quebrados ou difíceis de ler. Uma etapa rápida de formatação ajuda na análise, documentação e troubleshooting.',
      'Já em integrações e envio de dados, minificar pode reduzir peso de conteúdo e simplificar cópia para ferramentas de teste de API.',
    ],
    list: [
      'Validar JSON antes de enviar para API.',
      'Formatar resposta para depuração.',
      'Minificar payload para transporte.',
      'Copiar resultado limpo com um clique.',
    ],
  },
  {
    title: 'Privacidade e limites',
    paragraphs: [
      'O processamento do JSON acontece localmente no navegador e não exige upload para backend.',
      'Para arquivos muito extensos, a performance depende do dispositivo. Em payloads gigantes, trabalhar em blocos pode melhorar fluidez.',
    ],
  },
];

export const jsonFormatterFaq: FaqItem[] = [
  {
    question: 'A ferramenta valida JSON inválido?',
    answer:
      'Sim. O parser identifica erro de sintaxe e exibe uma mensagem para facilitar correção.',
  },
  {
    question: 'Posso minificar e formatar no mesmo lugar?',
    answer:
      'Sim. Você pode alternar entre formato legível e minificado sem sair da página.',
  },
  {
    question: 'Preciso instalar algo?',
    answer:
      'Não. O uso é direto no navegador, sem extensão e sem cadastro obrigatório.',
  },
  {
    question: 'O conteúdo é enviado para servidor?',
    answer:
      'Não por padrão. O processamento é local para preservar privacidade.',
  },
];

