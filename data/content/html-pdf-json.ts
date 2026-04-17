import type { ContentBlock, FaqItem } from '@/types/content';

export const devUtilityIntro =
  'Ferramenta multifuncional para visualizar HTML com sandbox, abrir PDF localmente no navegador e formatar ou minificar JSON com validação.';

export const devUtilityContentBlocks: ContentBlock[] = [
  {
    title: 'HTML Viewer com isolamento básico',
    paragraphs: [
      'Você pode colar seu HTML e ver a renderização imediatamente em um iframe com sandbox. Isso é útil para validar marcação, revisar blocos de conteúdo e testar estruturas de componentes de forma rápida.',
      'Mesmo com sandbox, o ideal é evitar colar código desconhecido em ambientes de produção. O objetivo aqui é inspeção de layout e estrutura, não execução confiável de scripts complexos.',
    ],
  },
  {
    title: 'PDF Viewer local no navegador',
    paragraphs: [
      'Ao selecionar um arquivo PDF, a visualização é criada com URL local temporária (blob URL). O arquivo não é enviado para servidor e fica disponível apenas na sessão local do navegador.',
      'Esse fluxo é útil para conferência rápida de contratos, documentação técnica e arquivos de apoio sem depender de upload externo.',
    ],
  },
  {
    title: 'Formatador e minificador JSON',
    paragraphs: [
      'O bloco de JSON oferece dois modos: formatar com indentação para leitura e minificar para reduzir tamanho. O parser valida sintaxe e retorna erro amigável quando a estrutura está inválida.',
      'Esse recurso é útil para depuração de APIs, revisão de payloads e preparo de dados para documentação.',
    ],
    list: [
      'Formatar JSON para leitura e revisão.',
      'Minificar payload para transporte.',
      'Copiar resultado pronto com um clique.',
    ],
  },
];

export const devUtilityFaq: FaqItem[] = [
  {
    question: 'O PDF é enviado para algum servidor?',
    answer:
      'Não. O arquivo é lido localmente e exibido no navegador por meio de URL temporária.',
  },
  {
    question: 'Posso executar JavaScript no HTML Viewer?',
    answer:
      'O preview usa sandbox sem permissões de script para reduzir risco. O foco é visualizar estrutura HTML e CSS.',
  },
  {
    question: 'O que acontece quando o JSON está inválido?',
    answer:
      'A ferramenta exibe mensagem de erro com o motivo para facilitar correção antes da cópia.',
  },
  {
    question: 'Funciona no celular?',
    answer:
      'Sim. A interface é responsiva e mantém os principais controles em telas menores.',
  },
  {
    question: 'Precisa criar conta para usar?',
    answer: 'Não. Todas as funcionalidades estão disponíveis gratuitamente.',
  },
];
