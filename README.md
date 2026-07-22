<div align="center">

# Tools Lucasqc

**Hub gratuito de ferramentas online para desenvolvimento, produtividade, mídia, dados, jogos e Bitcoin.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Production](https://img.shields.io/badge/status-production-success)](https://tools.lucasqc.com)

[**Acessar o projeto**](https://tools.lucasqc.com) · [Explorar as ferramentas](https://tools.lucasqc.com/tools)

</div>

## Sobre o projeto

O **Tools Lucasqc** reúne dezenas de utilitários gratuitos em uma aplicação única, rápida e responsiva. O projeto foi desenvolvido do zero com foco em:

- SEO técnico e conteúdo orientado à intenção de busca;
- performance e Core Web Vitals;
- experiência mobile-first;
- arquitetura modular para inclusão rápida de novas ferramentas;
- internacionalização e URLs localizadas;
- crescimento orgânico sustentável.

O portal recebe **mais de 2 mil usuários únicos por mês**, conquistados de forma totalmente orgânica por mecanismos de busca.

## Principais categorias

### Desenvolvimento e dados

- visualizador e editor de HTML;
- formatador de JSON e SQL;
- testador de expressões regulares;
- decoder de JWT;
- geradores de UUID, Nano ID e slug;
- conversores de dados, Base64, URL e timestamp Unix;
- comparador de textos e contador de caracteres.

### Imagens, áudio, vídeo e documentos

- conversão e compressão de imagens;
- remoção de fundo;
- extração de cores;
- compressão de vídeo e extração de áudio;
- visualização e manipulação de PDFs;
- geração e leitura de QR Codes.

### Bitcoin, Pix e criptografia

- conversor de unidades de Bitcoin;
- decoder de Pix;
- decoder de invoices Lightning;
- ferramentas para carteiras Bitcoin e seeds;
- utilitários baseados em BIP32, BIP39, secp256k1 e BitcoinJS.

### Produtividade e utilidades

- geradores de senhas, CPF e dados fictícios;
- calculadora de juros compostos;
- sorteadores e conversores universais;
- gerador de links para WhatsApp e Telegram;
- consulta de IP público e e-mail temporário.

### Games

- ferramentas e configurações para CS2;
- códigos, comandos e páginas especializadas para jogos;
- conteúdo estruturado para buscas específicas.

## Arquitetura

A aplicação usa o **Next.js App Router** e mantém a definição das ferramentas centralizada em um registry tipado.

```text
app/                    páginas e rotas
components/             componentes compartilhados e shells
components/ads/         slots desacoplados de anúncios
data/tools-registry.ts  catálogo central das ferramentas
data/content/            conteúdo e FAQs por ferramenta
lib/                    regras e lógica reutilizável
lib/seo.ts              helpers de metadata e SEO
types/                  contratos TypeScript
```

### Fluxo para adicionar uma ferramenta

1. Definir nome, slug, categoria, palavra-chave e intenção de busca.
2. Registrar a ferramenta em `data/tools-registry.ts`.
3. Criar conteúdo, introdução e FAQ em `data/content/`.
4. Implementar a lógica isolada em `lib/`.
5. Criar a página usando os componentes compartilhados.
6. Configurar metadata, canonical, JSON-LD e ferramentas relacionadas.
7. Validar responsividade, acessibilidade, lint, typecheck e build.

## SEO e distribuição de conteúdo

- metadata dinâmica por rota;
- URLs canônicas e localizadas;
- suporte a conteúdo em português, inglês e espanhol;
- dados estruturados com JSON-LD;
- sitemap gerado automaticamente;
- `robots.txt` e páginas institucionais;
- FAQs e links internos entre ferramentas relacionadas;
- arquitetura preparada para páginas long-tail.

## Stack

- **Framework:** Next.js 15 e React 18;
- **Linguagem:** TypeScript;
- **UI:** Tailwind CSS e Lucide React;
- **Editores:** CodeMirror;
- **Mídia:** FFmpeg, PDF.js, PDF-Lib, Canvas e browser-image-compression;
- **Bitcoin:** bitcoinjs-lib, BIP32, BIP39, secp256k1 e bech32;
- **Dados:** XLSX, ZIP.js e formatadores especializados;
- **Infraestrutura:** Vercel Analytics e Upstash Redis.

## Executando localmente

### Requisitos

- Node.js 20 ou superior;
- npm.

```bash
git clone https://github.com/Lucasqc04/tools-ads.git
cd tools-ads
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

### Verificações de qualidade

```bash
npm run lint
npm run typecheck
npm run build
```

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | inicia o ambiente de desenvolvimento |
| `npm run build` | gera o build de produção |
| `npm run start` | executa o build gerado |
| `npm run lint` | executa o ESLint |
| `npm run typecheck` | valida os tipos sem emitir arquivos |

## Roadmap

- ampliar o catálogo de ferramentas;
- continuar a expansão internacional;
- melhorar a cobertura de testes;
- evoluir acessibilidade e métricas de performance;
- expandir páginas programáticas sem comprometer a qualidade do conteúdo.

## Autor

Desenvolvido por **[Lucas Quinteiro Campos](https://github.com/Lucasqc04)**.

[LinkedIn](https://www.linkedin.com/in/lucas-quinteiro-2071022a4/) · [Projeto em produção](https://tools.lucasqc.com)
