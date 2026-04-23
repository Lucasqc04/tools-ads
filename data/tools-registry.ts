import {
  bitcoinWalletContentBlocks,
  bitcoinWalletFaq,
  bitcoinWalletIntro,
} from '@/data/content/bitcoin-wallet';
import {
  base64ImageViewerContentBlocks,
  base64ImageViewerFaq,
  base64ImageViewerIntro,
} from '@/data/content/base64-image-viewer';
import {
  cpfGeneratorContentBlocks,
  cpfGeneratorFaq,
  cpfGeneratorIntro,
} from '@/data/content/cpf-generator';
import {
  fakePersonGeneratorContentBlocks,
  fakePersonGeneratorFaq,
  fakePersonGeneratorIntro,
} from '@/data/content/fake-person-generator';
import {
  compoundInterestContentBlocks,
  compoundInterestFaq,
  compoundInterestIntro,
} from '@/data/content/compound-interest';
import {
  imageToBase64ContentBlocks,
  imageToBase64Faq,
  imageToBase64Intro,
} from '@/data/content/image-to-base64';
import {
  passwordGeneratorContentBlocks,
  passwordGeneratorFaq,
  passwordGeneratorIntro,
} from '@/data/content/password-generator';
import {
  cryptoConverterContentBlocks,
  cryptoConverterFaq,
  cryptoConverterIntro,
} from '@/data/content/crypto-unit-converter';
import {
  htmlViewerContentBlocks,
  htmlViewerFaq,
  htmlViewerIntro,
} from '@/data/content/html-viewer';
import {
  imageConverterContentBlocks,
  imageConverterFaq,
  imageConverterIntro,
} from '@/data/content/image-converter';
import {
  imageCompressionContentBlocks,
  imageCompressionFaq,
  imageCompressionIntro,
} from '@/data/content/image-compression';
import {
  invisibleCharacterContentBlocks,
  invisibleCharacterFaq,
  invisibleCharacterIntro,
} from '@/data/content/invisible-character';
import {
  videoCompressionContentBlocks,
  videoCompressionFaq,
  videoCompressionIntro,
} from '@/data/content/video-compression';
import {
  jsonFormatterContentBlocks,
  jsonFormatterFaq,
  jsonFormatterIntro,
} from '@/data/content/json-formatter';
import {
  qrCodeGeneratorContentBlocks,
  qrCodeGeneratorFaq,
  qrCodeGeneratorIntro,
} from '@/data/content/qr-code-generator';
import {
  sorteadorContentBlocks,
  sorteadorFaq,
  sorteadorIntro,
} from '@/data/content/sorteador';
import { getToolTranslation } from '@/data/i18n/tool-translations';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import type { ToolDefinition } from '@/types/tool';

export const toolsRegistry: ToolDefinition[] = [
  {
    id: 'bitcoin-wallet',
    slug: 'bitcoin-wallet',
    name: 'Carteira Bitcoin Testnet e Mainnet',
    shortDescription:
      'Gere carteira Bitcoin, importe seed/WIF, veja saldo e UTXOs e envie BTC em testnet ou mainnet usando mempool API.',
    category: 'crypto',
    primaryKeyword: 'carteira bitcoin testnet e mainnet',
    secondaryKeywords: [
      'gerar carteira bitcoin online',
      'importar seed bitcoin',
      'importar wif bitcoin',
      'enviar bitcoin testnet',
      'enviar bitcoin mainnet',
      'wallet bitcoin no navegador',
      'bitcoin wallet tool',
      'bip39 bitcoin wallet',
      'bip84 segwit wallet',
      'mempool api bitcoin tool',
      'consultar utxos bitcoin',
      'saldo bitcoin testnet',
    ],
    searchIntent:
      'Usuarios e devs que precisam criar ou importar carteira Bitcoin e enviar transacoes com processamento local no navegador.',
    seoTitle:
      'Carteira Bitcoin Testnet/Mainnet | Gerar, Importar e Enviar BTC',
    seoDescription:
      'Crie carteira Bitcoin com seed BIP39, importe WIF, consulte saldo e UTXOs e envie BTC em testnet ou mainnet com assinatura local. Gratis, sem cadastro.',
    h1: 'Carteira Bitcoin Testnet e Mainnet com Envio Local de BTC',
    intro: bitcoinWalletIntro,
    canonicalPath: '/tools/bitcoin-wallet',
    faq: bitcoinWalletFaq,
    contentBlocks: bitcoinWalletContentBlocks,
    relatedToolIds: ['crypto-unit-converter', 'json-formatter', 'qr-code-generator'],
  },
  {
    id: 'crypto-unit-converter',
    slug: 'crypto-unit-converter',
    name: 'Conversor de Unidades Cripto',
    shortDescription:
      'Converta satoshi, gwei, wei, lamport, sun, lovelace e outras unidades on-chain grátis, sem cadastro e sem login.',
    category: 'crypto',
    primaryKeyword: 'conversor de unidades cripto gratis',
    secondaryKeywords: [
      'btc para satoshi',
      'gwei para eth',
      'wei para eth',
      'lamport para sol',
      'trx para sun',
      'conversor cripto sem cadastro',
      'conversor cripto sem login',
      'conversor de satoshi gratis',
      'conversor unidades bitcoin',
      'conversor unidades ethereum',
    ],
    searchIntent:
      'Usuários e devs que querem converter subunidades cripto com precisão, rápido, grátis e sem cadastro.',
    seoTitle:
      'Conversor de Satoshi, Gwei, Wei e Lamport Grátis | Sem Cadastro',
    seoDescription:
      'Converta unidades de BTC, ETH, USDT, USDC, SOL, TRX, XRP, ADA e mais ativos localmente no navegador, grátis, sem cadastro e sem login.',
    h1: 'Conversor de Unidades Cripto Grátis, Sem Cadastro e Sem Login',
    intro: cryptoConverterIntro,
    canonicalPath: '/tools/crypto-unit-converter',
    faq: cryptoConverterFaq,
    contentBlocks: cryptoConverterContentBlocks,
    relatedToolIds: ['image-converter', 'html-viewer', 'json-formatter'],
  },
  {
    id: 'html-viewer',
    slug: 'html-viewer',
    name: 'HTML Viewer com CSS e JS',
    shortDescription:
      'Visualize HTML com suporte a CSS/JS, tela cheia e multiarquivos, grátis, sem cadastro e sem login.',
    category: 'dev',
    primaryKeyword: 'html viewer online gratis',
    secondaryKeywords: [
      'visualizador html online',
      'preview html css js',
      'editor html com js',
      'testar html online',
      'html viewer sem cadastro',
      'html viewer sem login',
      'html sandbox viewer',
    ],
    searchIntent:
      'Usuários e devs que precisam renderizar HTML com CSS/JS rápido, grátis e sem login.',
    seoTitle:
      'HTML Viewer Online Grátis | CSS, JS, Tela Cheia e Sem Cadastro',
    seoDescription:
      'Cole HTML, CSS e JavaScript ou envie múltiplos arquivos para renderizar em sandbox, grátis, sem cadastro, sem login e com abertura em nova aba.',
    h1: 'HTML Viewer Grátis com CSS, JS, Tela Cheia e Sem Cadastro',
    intro: htmlViewerIntro,
    canonicalPath: '/tools/html-viewer',
    faq: htmlViewerFaq,
    contentBlocks: htmlViewerContentBlocks,
    relatedToolIds: ['json-formatter', 'image-converter'],
  },
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter e Minifier',
    shortDescription:
      'Formate, minifique e valide JSON grátis, sem cadastro e sem login, com feedback de erro e cópia rápida.',
    category: 'dev',
    primaryKeyword: 'formatador json online gratis',
    secondaryKeywords: [
      'json minify online',
      'json pretty print',
      'validar json online',
      'formatador json sem cadastro',
      'formatador json sem login',
      'json formatter browser',
    ],
    searchIntent:
      'Desenvolvedores e analistas que precisam validar e ajustar payloads JSON rápido, grátis e sem cadastro.',
    seoTitle: 'JSON Formatter Online Grátis | Minify, Validação e Sem Cadastro',
    seoDescription:
      'Cole JSON para formatar, minificar e validar sintaxe no navegador, grátis, sem cadastro e sem login.',
    h1: 'JSON Formatter Grátis, Sem Cadastro e Sem Login',
    intro: jsonFormatterIntro,
    canonicalPath: '/tools/json-formatter',
    faq: jsonFormatterFaq,
    contentBlocks: jsonFormatterContentBlocks,
    relatedToolIds: ['html-viewer', 'image-converter'],
  },
  {
    id: 'cpf-generator',
    slug: 'cpf-generator',
    name: 'Criador de CPF Válido',
    shortDescription:
      'Gere CPF válido para testes com opção com ou sem pontuação, grátis, sem cadastro e com cópia rápida.',
    category: 'utility',
    primaryKeyword: 'gerador de cpf valido gratis',
    secondaryKeywords: [
      'criador de cpf válido',
      'gerar cpf para teste',
      'cpf válido com pontuação',
      'cpf válido sem pontuação',
      'gerador de cpf sem cadastro',
      'gerador de cpf sem login',
      'cpf para homologação',
      'gerar cpf em lote',
    ],
    searchIntent:
      'Usuários e devs que precisam gerar CPF válido para testes de formulário, integração e QA sem cadastro.',
    seoTitle: 'Gerador de CPF Válido Grátis | Com ou Sem Pontuação',
    seoDescription:
      'Crie CPF válido online para testes com opção com ou sem pontuação, geração em lote e cópia rápida, grátis, sem cadastro e sem login.',
    h1: 'Gerador de CPF Válido Grátis, Sem Cadastro e Com Cópia Rápida',
    intro: cpfGeneratorIntro,
    canonicalPath: '/tools/cpf-generator',
    faq: cpfGeneratorFaq,
    contentBlocks: cpfGeneratorContentBlocks,
    relatedToolIds: ['gerador-pessoa-fake', 'json-formatter', 'qr-code-generator'],
  },
  {
    id: 'gerador-pessoa-fake',
    slug: 'gerador-pessoa-fake',
    name: 'Gerador de Pessoa Fake para Testes',
    shortDescription:
      'Gere identidade ficticia coerente com CPF valido, RG, email, telefone, endereco, idade e nascimento para desenvolvimento e QA.',
    category: 'utility',
    primaryKeyword: 'gerador de pessoa fake',
    secondaryKeywords: [
      'gerador de dados fake',
      'gerador de dados para teste',
      'fake data generator brasil',
      'gerador de identidade ficticia',
      'gerar cpf valido com nome',
      'gerador de cpf e rg',
      'gerador de usuario fake',
      'gerador de dados completos pessoa',
      'fake user generator brazil',
      'gerador de cadastro de teste',
      'dados ficticios para homologacao',
    ],
    searchIntent:
      'Devs, QAs e analistas que precisam gerar pessoas ficticias coerentes para testar formularios, APIs, banco de dados e automacoes.',
    seoTitle:
      'Gerador de Pessoa Fake para Testes | CPF, RG, Email, Telefone e Endereco',
    seoDescription:
      'Crie pessoas ficticias coerentes para testes com CPF valido, RG, idade, nascimento, estado, cidade, DDD, CEP e exportacao em JSON, CSV e SQL.',
    h1: 'Gerador de Pessoa Fake para Testes com CPF, RG e Endereco Coerente',
    intro: fakePersonGeneratorIntro,
    canonicalPath: '/tools/gerador-pessoa-fake',
    faq: fakePersonGeneratorFaq,
    contentBlocks: fakePersonGeneratorContentBlocks,
    relatedToolIds: ['cpf-generator', 'json-formatter', 'password-generator'],
  },
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Gerador de Senha Forte',
    shortDescription:
      'Crie senha forte com tamanho personalizado e combinacao de letras, numeros e simbolos, gratis e sem cadastro.',
    category: 'utility',
    primaryKeyword: 'gerador de senha forte gratis',
    secondaryKeywords: [
      'gerador de senha segura online',
      'criar senha aleatoria',
      'gerar senha com simbolos',
      'senha com letras e numeros',
      'gerador de senha sem cadastro',
      'gerador de senha sem login',
      'senha forte para contas',
      'password generator online',
    ],
    searchIntent:
      'Usuarios que precisam gerar senha forte rapidamente para contas pessoais, profissionais e testes de sistema.',
    seoTitle: 'Gerador de Senha Forte Gratis | Com Letras, Numeros e Simbolos',
    seoDescription:
      'Gere senha forte online com tamanho personalizado, escolha de caracteres, regeneracao automatica e botao de copiar. Gratis, sem cadastro e sem login.',
    h1: 'Gerador de Senha Forte Gratis, Sem Cadastro e Com Copia Rapida',
    intro: passwordGeneratorIntro,
    canonicalPath: '/tools/password-generator',
    faq: passwordGeneratorFaq,
    contentBlocks: passwordGeneratorContentBlocks,
    relatedToolIds: ['cpf-generator', 'json-formatter', 'qr-code-generator'],
  },
  {
    id: 'base64-image-viewer',
    slug: 'base64-image-viewer',
    name: 'Leitor de Base64 para Imagem',
    shortDescription:
      'Cole Base64, veja a imagem na hora e baixe em varios formatos, gratis, sem cadastro e sem login.',
    category: 'dev',
    primaryKeyword: 'leitor de base64 para imagem online',
    secondaryKeywords: [
      'converter base64 em imagem',
      'visualizar base64 imagem',
      'decodificar base64 de imagem',
      'base64 para png',
      'base64 para jpeg',
      'base64 image viewer',
      'abrir base64 em imagem',
      'download de imagem base64',
    ],
    searchIntent:
      'Usuarios e devs que precisam colar Base64 e visualizar imagem imediatamente para validar e baixar em formatos diferentes.',
    seoTitle: 'Leitor de Base64 para Imagem Online | Preview e Download',
    seoDescription:
      'Cole Base64 e visualize imagem em tempo real. Baixe em varios formatos com conversao local, gratis, sem cadastro e sem login.',
    h1: 'Leitor de Base64 para Imagem Grátis com Preview Instantaneo',
    intro: base64ImageViewerIntro,
    canonicalPath: '/tools/base64-image-viewer',
    faq: base64ImageViewerFaq,
    contentBlocks: base64ImageViewerContentBlocks,
    relatedToolIds: ['image-to-base64', 'image-converter', 'html-viewer'],
  },
  {
    id: 'image-to-base64',
    slug: 'image-to-base64',
    name: 'Gerador de Base64 por Imagem',
    shortDescription:
      'Converta imagem para Base64 com preview, copia em um clique e opcao de data URL ou Base64 puro.',
    category: 'dev',
    primaryKeyword: 'gerador de base64 por imagem online',
    secondaryKeywords: [
      'imagem para base64',
      'converter imagem em base64',
      'gerar data url de imagem',
      'copiar base64 da imagem',
      'image to base64 converter',
      'jpg para base64',
      'png para base64',
      'base64 encoder imagem',
    ],
    searchIntent:
      'Usuarios e devs que precisam transformar imagem em Base64 rapidamente para usar em APIs, HTML e testes de integracao.',
    seoTitle: 'Gerador de Base64 por Imagem | Converter Imagem para Base64',
    seoDescription:
      'Envie imagem e gere Base64 automaticamente com preview, copia rapida e modo data URL. Gratis, sem cadastro e sem login.',
    h1: 'Gerador de Base64 por Imagem Grátis com Preview e Copia Rapida',
    intro: imageToBase64Intro,
    canonicalPath: '/tools/image-to-base64',
    faq: imageToBase64Faq,
    contentBlocks: imageToBase64ContentBlocks,
    relatedToolIds: ['base64-image-viewer', 'image-converter', 'json-formatter'],
  },
  {
    id: 'image-converter',
    slug: 'image-converter',
    name: 'Conversor de Imagem e PDF',
    shortDescription:
      'Converta mais de 20 formatos de imagem e PDF no navegador, grátis, sem cadastro, sem login e com download imediato.',
    category: 'documents',
    primaryKeyword: 'conversor de imagem para pdf gratis',
    secondaryKeywords: [
      'png para jpeg',
      'jpg para pdf',
      'pdf para png',
      'webp para jpg',
      'heic para jpg',
      'tiff para png',
      'avif para png',
      'svg para png',
      'psd para png',
      'conversor de formatos de imagem',
      'conversor de imagem sem cadastro',
      'conversor pdf sem login',
      'converter pdf para imagem online',
    ],
    searchIntent:
      'Usuários que precisam converter arquivos visuais entre formatos de imagem e PDF rápido, grátis e sem cadastro.',
    seoTitle:
      'Conversor de Imagem e PDF Grátis (20+ formatos) | Sem Cadastro',
    seoDescription:
      'Converta imagens e PDFs online com processamento local, sem cadastro, sem login e com fluxo rápido para desktop e mobile.',
    h1: 'Conversor de Imagem e PDF Grátis, Sem Cadastro, Sem Login e Rápido',
    intro: imageConverterIntro,
    canonicalPath: '/tools/image-converter',
    faq: imageConverterFaq,
    contentBlocks: imageConverterContentBlocks,
    relatedToolIds: ['html-viewer', 'qr-code-generator'],
  },
  {
    id: 'image-compression',
    slug: 'image-compression',
    name: 'Compressor de Imagem em Lote',
    shortDescription:
      'Comprima varias imagens online, ajuste nivel de compressao, veja estimativa de tamanho e preview antes de baixar.',
    category: 'documents',
    primaryKeyword: 'comprimir imagem online gratis',
    secondaryKeywords: [
      'compressor de imagem online',
      'reduzir tamanho de imagem',
      'comprimir foto sem perder muita qualidade',
      'compressao de imagem em lote',
      'jpeg compressor online',
      'webp compressor online',
      'reduzir kb da imagem',
      'otimizar imagem para site',
      'compressor de imagem sem cadastro',
      'compressor de imagem sem login',
    ],
    searchIntent:
      'Usuarios que precisam reduzir tamanho de imagem rapido, com controle de compressao e preview antes do download.',
    seoTitle:
      'Compressor de Imagem Online Gratis em Lote | Reduzir Tamanho com Preview',
    seoDescription:
      'Comprima varias imagens de uma vez com controle de nivel, estimativa de tamanho final, preview antes/depois e download rapido. Gratis, sem cadastro e sem login.',
    h1: 'Compressor de Imagem em Lote Gratis com Preview e Controle de Compressao',
    intro: imageCompressionIntro,
    canonicalPath: '/tools/image-compression',
    faq: imageCompressionFaq,
    contentBlocks: imageCompressionContentBlocks,
    relatedToolIds: ['image-converter', 'image-to-base64', 'video-compression'],
  },
  {
    id: 'video-compression',
    slug: 'video-compression',
    name: 'Compressor de Video Online',
    shortDescription:
      'Comprima videos online em lote, ajuste nivel, veja estimativa de tamanho e preview antes de baixar.',
    category: 'documents',
    primaryKeyword: 'comprimir video online gratis',
    secondaryKeywords: [
      'compressor de video online',
      'reduzir tamanho de video',
      'comprimir mp4 online',
      'reduzir mb de video',
      'compressao de video em lote',
      'compressor de video rapido',
      'otimizar video para upload',
      'comprimir video sem cadastro',
      'comprimir video sem login',
      'diminuir tamanho do video para whatsapp',
    ],
    searchIntent:
      'Usuarios que querem reduzir tamanho de video com controle de compressao, mantendo preview antes do download.',
    seoTitle:
      'Compressor de Video Online Gratis | Reduzir Tamanho',
    seoDescription:
      'Comprima varios videos online com controle de nivel, estimativa de tamanho final, preview antes/depois e download local. Gratis, sem cadastro e sem login.',
    h1: 'Compressor de Video Online Gratis com Preview Antes do Download',
    intro: videoCompressionIntro,
    canonicalPath: '/tools/video-compression',
    faq: videoCompressionFaq,
    contentBlocks: videoCompressionContentBlocks,
    relatedToolIds: ['image-compression', 'image-converter'],
  },
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    name: 'Gerador de QR Code com Logo',
    shortDescription:
      'Crie QR Code grátis a partir de texto ou URL, sem cadastro, com logo e download em vários formatos.',
    category: 'utility',
    primaryKeyword: 'gerador de qr code gratis sem cadastro',
    secondaryKeywords: [
      'gerador de qr code gratis',
      'gerar qr code sem cadastro',
      'qr code sem login',
      'qr code com logo',
      'gerar qr code online',
      'gerador de qr code ilimitado',
      'qr code png',
      'qr code em pdf',
      'qr code personalizado',
    ],
    searchIntent:
      'Usuários que querem gerar QR Code rápido, grátis, sem cadastro, sem login, personalizar visual e baixar imagem.',
    seoTitle: 'Gerador de QR Code Grátis, Sem Cadastro e Sem Login | PNG, PDF e SVG',
    seoDescription:
      'Gere QR Code online grátis, sem cadastro, sem login e sem pagar nada. Personalize cores, adicione logo central e exporte em PNG, JPEG, WEBP, SVG e PDF.',
    h1: 'Gerador de QR Code Grátis, Sem Cadastro, Sem Login e com Download',
    intro: qrCodeGeneratorIntro,
    canonicalPath: '/tools/qr-code-generator',
    faq: qrCodeGeneratorFaq,
    contentBlocks: qrCodeGeneratorContentBlocks,
    relatedToolIds: ['image-converter', 'json-formatter'],
  },
  {
    id: 'sorteador',
    slug: 'sorteador',
    name: 'Sorteador Online Completo',
    shortDescription:
      'Sortear nomes e numeros online com parsing inteligente, roleta visual, multiplos resultados e compartilhamento por link.',
    category: 'utility',
    primaryKeyword: 'sorteador online',
    secondaryKeywords: [
      'sortear nomes online',
      'sorteador de numeros',
      'roleta online de nomes',
      'random picker online',
      'wheel picker online',
      'sortear lista online',
      'sorteio aleatorio gratis',
      'sortear 3 nomes online',
      'sortear sem repetir',
      'sorteador com tempo',
      'roleta com nomes gratis',
    ],
    searchIntent:
      'Usuarios que querem sortear nomes, numeros ou listas completas de forma rapida, com transparencia e opcoes avancadas de configuracao.',
    seoTitle:
      'Sorteador Online Completo | Sortear Nomes, Numeros e Roleta',
    seoDescription:
      'Use o sorteador online para nomes e numeros com auto-deteccao de separador, sorteio com/sem repeticao, roleta animada, CSV e link compartilhavel.',
    h1: 'Sorteador Online de Nomes e Numeros com Modo Roleta',
    intro: sorteadorIntro,
    canonicalPath: '/tools/sorteador',
    faq: sorteadorFaq,
    contentBlocks: sorteadorContentBlocks,
    relatedToolIds: ['calculadora-juros-compostos', 'password-generator', 'qr-code-generator'],
  },
  {
    id: 'calculadora-juros-compostos',
    slug: 'calculadora-juros-compostos',
    name: 'Calculadora de Juros Compostos',
    shortDescription:
      'Simule juros compostos com aporte mensal, descubra aporte para meta e taxa necessaria com grafico, tabela e comparacao com juros simples.',
    category: 'utility',
    primaryKeyword: 'calculadora de juros compostos',
    secondaryKeywords: [
      'simulador de juros compostos',
      'juros compostos online',
      'calculadora de investimento com aporte mensal',
      'quanto rende por mes',
      'quanto preciso investir por mes',
      'descobrir taxa de juros necessaria',
      'simulador de rendimento mensal',
      'calculadora juros compostos mensal',
      'calculadora juros compostos anual',
      'como calcular juros compostos',
      'juros simples vs compostos',
    ],
    searchIntent:
      'Usuarios que precisam calcular crescimento de patrimonio com juros compostos e comparar cenarios para investimento, meta financeira e planejamento de prazo.',
    seoTitle:
      'Calculadora de Juros Compostos Online | Simulador com Aporte Mensal',
    seoDescription:
      'Calcule juros compostos com valor inicial, aporte mensal, taxa e prazo. Veja valor final, juros totais, grafico, tabela, comparacao com juros simples e metas.',
    h1: 'Calculadora de Juros Compostos Online com Aporte Mensal',
    intro: compoundInterestIntro,
    canonicalPath: '/tools/calculadora-juros-compostos',
    faq: compoundInterestFaq,
    contentBlocks: compoundInterestContentBlocks,
    relatedToolIds: ['sorteador', 'crypto-unit-converter', 'json-formatter'],
  },
  {
    id: 'invisible-character',
    slug: 'invisible-character',
    name: 'Caractere Invisivel para Jogos',
    shortDescription:
      'Copie e gere caractere invisivel para jogos e redes sociais, com variacoes 2, 3 e 4 chars, detector Unicode e paginas por plataforma.',
    category: 'utility',
    primaryKeyword: 'caractere invisivel free fire',
    secondaryKeywords: [
      'espaco invisivel free fire',
      'nick invisivel free fire',
      'nome invisivel cod mobile',
      'nick invisivel discord',
      'letra invisivel copiar',
      'caractere invisivel para jogos',
      'invisible character free fire',
      'invisible name cod mobile',
      'invisible text discord',
      'blank character copy paste',
      'invisible username generator',
    ],
    searchIntent:
      'Usuarios que querem copiar ou gerar nome invisivel para jogos e redes sociais com mais chance de passar em validacoes de nickname.',
    seoTitle:
      'Caractere Invisivel para Free Fire, COD e Discord | Copiar e Colar',
    seoDescription:
      'Copie caractere invisivel e gere nome invisivel para Free Fire, COD Mobile, Discord e outras plataformas. Teste combinacoes 2, 3 e 4 caracteres.',
    h1: 'Caractere Invisivel para Jogos (Free Fire, COD, Discord e mais)',
    intro: invisibleCharacterIntro,
    canonicalPath: '/tools/invisible-character',
    faq: invisibleCharacterFaq,
    contentBlocks: invisibleCharacterContentBlocks,
    relatedToolIds: ['qr-code-generator', 'password-generator', 'json-formatter'],
  },
];

export const getToolBySlug = (slug: string): ToolDefinition | undefined =>
  toolsRegistry.find((tool) => tool.slug === slug);

export const getToolById = (id: string): ToolDefinition | undefined =>
  toolsRegistry.find((tool) => tool.id === id);

export const getRelatedTools = (toolId: string): ToolDefinition[] => {
  const currentTool = getToolById(toolId);

  if (!currentTool) {
    return [];
  }

  return currentTool.relatedToolIds
    .map((relatedId) => getToolById(relatedId))
    .filter((tool): tool is ToolDefinition => Boolean(tool));
};

type LocalizableToolId =
  | 'bitcoin-wallet'
  | 'crypto-unit-converter'
  | 'html-viewer'
  | 'json-formatter'
  | 'cpf-generator'
  | 'gerador-pessoa-fake'
  | 'password-generator'
  | 'base64-image-viewer'
  | 'image-to-base64'
  | 'image-converter'
  | 'image-compression'
  | 'video-compression'
  | 'qr-code-generator'
  | 'sorteador'
  | 'calculadora-juros-compostos'
  | 'invisible-character';

const localizableToolIds = new Set<LocalizableToolId>([
  'bitcoin-wallet',
  'crypto-unit-converter',
  'html-viewer',
  'json-formatter',
  'cpf-generator',
  'gerador-pessoa-fake',
  'password-generator',
  'base64-image-viewer',
  'image-to-base64',
  'image-converter',
  'image-compression',
  'video-compression',
  'qr-code-generator',
  'sorteador',
  'calculadora-juros-compostos',
  'invisible-character',
]);

const isLocalizableToolId = (toolId: string): toolId is LocalizableToolId =>
  localizableToolIds.has(toolId as LocalizableToolId);

const localizeTool = (tool: ToolDefinition, locale: AppLocale): ToolDefinition => {
  if (locale === 'pt-br') {
    return {
      ...tool,
      canonicalPath: localizePath(locale, tool.canonicalPath),
    };
  }

  if (!isLocalizableToolId(tool.id)) {
    return {
      ...tool,
      canonicalPath: localizePath(locale, tool.canonicalPath),
    };
  }

  const translation = getToolTranslation(locale, tool.id);

  return {
    ...tool,
    ...translation,
    canonicalPath: localizePath(locale, tool.canonicalPath),
  };
};

export const getLocalizedToolsRegistry = (locale: AppLocale): ToolDefinition[] =>
  toolsRegistry.map((tool) => localizeTool(tool, locale));

export const getLocalizedToolBySlug = (
  locale: AppLocale,
  slug: string,
): ToolDefinition | undefined => {
  const baseTool = getToolBySlug(slug);

  if (!baseTool) {
    return undefined;
  }

  return localizeTool(baseTool, locale);
};

export const getLocalizedToolById = (
  locale: AppLocale,
  id: string,
): ToolDefinition | undefined => {
  const baseTool = getToolById(id);

  if (!baseTool) {
    return undefined;
  }

  return localizeTool(baseTool, locale);
};

export const getLocalizedRelatedTools = (
  locale: AppLocale,
  toolId: string,
): ToolDefinition[] =>
  getRelatedTools(toolId).map((tool) => localizeTool(tool, locale));
