import type { ContentBlock, FaqItem } from '@/types/content';

export const descobrirIpPublicoIntro =
  'Descubra rapidamente o seu endereço IP público, o provedor estimado (ISP) e informações básicas sobre o dispositivo e localização aproximada.';

export const descobrirIpPublicoContentBlocks: ContentBlock[] = [
  {
    title: 'O que esta ferramenta faz',
    paragraphs: [
      'Esta ferramenta identifica o seu endereço IP público visível na internet e consulta uma API pública para retornar informações adicionais como provedor (ISP), cidade/estado aproximados e coordenadas geográficas aproximadas. O objetivo é fornecer uma visão rápida e prática para depuracao, configuracoes de rede e verificacao de acesso.',
      'A consulta é realizada diretamente do navegador para um serviço público e os resultados são exibidos na tela. A ferramenta também apresenta detalhes do dispositivo (sistema operacional e navegador) detectados a partir do User-Agent para facilitar diagnósticos simples.',
    ],
  },
  {
    title: 'Quando usar',
    paragraphs: [
      'Use quando precisar verificar qual IP público sua conexão está usando, confirmar se um provedor mudou, validar regras de firewall, testar bloqueios geográficos ou simplesmente obter informações para suporte técnico. Esta ferramenta é útil para desenvolvedores, administradores de rede e usuários em geral que precisam saber o IP visto por serviços externos.',
    ],
    list: [
      'Verificar o IP público antes de configurar um serviço externo.',
      'Confirmar qual ISP aparece para um serviço remoto.',
      'Obter localidade aproximada para fins de diagnóstico (não é precisa para endereços exatos).',
      'Copiar o IP em formatos diferentes (com ou sem pontos) para uso em scripts ou validações).',
    ],
  },
  {
    title: 'Privacidade e limitacoes',
    paragraphs: [
      'A ferramenta realiza uma chamada a um serviço público de IP diretamente do seu navegador. Nenhum dado é enviado ao servidor deste site; a requisição parte do seu dispositivo para a API externa. Se preferir, você pode bloquear a requisição usando extensões ou ajustar permissões de rede.',
      'A localizacao fornecida e estimada com base no endereco IP do provedor e pode estar incorreta ou apontar apenas a cidade/regiao do ISP. Nao utilize estes dados para decisões legais, de seguranca fisica ou em situacoes que exijam precisao de endereco.',
      'Para reduzir latencia e dependencia de terceiros, a consulta e simples e otimizada para respostas rapidas. Em casos de limite de uso da API publica, a ferramenta pode retornar erros temporarios.',
    ],
  },
  {
    title: 'Como copiar o IP',
    paragraphs: [
      'Você pode copiar o IP exatamente como aparece (com pontos) ou no formato compacto sem pontos, útil para sistemas que exigem apenas os dígitos. A interface oferece botões de cópia para ambas as opções.',
    ],
  },
];

export const descobrirIpPublicoFaq: FaqItem[] = [
  {
    question: 'O que significa IP público?',
    answer:
      'O IP público e o endereco que identifica sua conexao na internet e e visto por servidores externos. Se voce usa um roteador com NAT, todos dispositivos da sua rede podem compartilhar o mesmo IP publico.',
  },
  {
    question: 'A ferramenta envia meu IP para o servidor do site?',
    answer:
      'Nao. A consulta e feita diretamente do seu navegador para um serviço publico de IP. O site nao recebe automaticamente seu IP nem persiste esses dados. Consulte a secao de privacidade para mais detalhes.',
  },
  {
    question: 'A localizacao e precisa?',
    answer:
      'Nao necessariamente. A localizacao retornada e uma estimativa baseada no IP do provedor. Pode apontar para a regiao do ISP e não para sua localizacao fisica exata.',
  },
  {
    question: 'Posso copiar o IP sem pontos?',
    answer:
      'Sim. Existe um botao que copia o IP no formato sem pontos (por exemplo 123456789 em vez de 123.456.78.9) para usos que exigem apenas os digitos.',
  },
  {
    question: 'A ferramenta e gratuita?',
    answer: 'Sim. A consulta usa um servico publico e a funcionalidade e gratuita para uso basico.',
  },
];
