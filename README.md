# Tools Lucasqc

Hub de ferramentas online com foco em:

- SEO técnico + on-page
- Performance (Core Web Vitals)
- UX limpa e mobile-first
- Estrutura pronta para Google AdSense
- Escalabilidade para novas tools

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS

## Rotas principais

- `/`
- `/tools`
- `/tools/crypto-unit-converter`
- `/tools/crypto-unit-converter/[from]-to-[to]` (slug técnico, canonical)
- `/tools/crypto-unit-converter/[de]-para-[para]` (slug PT-BR automático, ex.: `/tools/crypto-unit-converter/satoshi-para-btc`)
- `/tools/html-viewer`
- `/tools/json-formatter`
- `/tools/html-pdf-json` (legado, redireciona para `/tools/html-viewer`)
- `/tools/image-converter`
- `/tools/qr-code-generator`
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms`
- `/sitemap.xml`
- `/robots.txt`

## Como rodar localmente

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm start
```

## Arquitetura de conteúdo e SEO

- Registry central de tools: `data/tools-registry.ts`
- Conteúdo textual por ferramenta: `data/content/*`
- Lógica pura em `lib/*`
- Páginas em `app/tools/*`
- Schema JSON-LD por página via `components/shared/json-ld.tsx`
- Metadata por rota com helper em `lib/seo.ts`
- Sitemap automático baseado no registry em `app/sitemap.ts`

## Arquitetura de anúncios (placeholders)

- Registry de slots: `lib/ads-config.ts`
- Tipos: `types/ads.ts`
- Componentes:
  - `AdSlotTop`
  - `AdSlotInContent`
  - `AdSlotSidebar`
  - `AdSlotFooter`

Para integrar AdSense depois, troque o conteúdo de `components/ads/ad-slot.tsx` por `<ins class="adsbygoogle">` e use `adSlotId` do registry.

## Fluxo para criar nova tool

1. Defina nome, slug, keyword principal e intenção de busca.
2. Cadastre em `data/tools-registry.ts`.
3. Crie conteúdo em `data/content/<slug>.ts`.
4. Coloque lógica em `lib/<slug>.ts`.
5. Crie página em `app/tools/<slug>/page.tsx` usando `ToolPageShell`.
6. Adicione metadata e JSON-LD da página.
7. Configure links relacionados (`relatedToolIds`) no registry.
8. Revise mobile, SEO e performance.

## Checklist rápido de produção

- [ ] Metadata e canonical em todas as páginas indexáveis
- [ ] Sitemap e robots publicados
- [ ] FAQ em todas as pages de tools
- [ ] Conteúdo útil suficiente (evitar thin content)
- [ ] Páginas institucionais completas
- [ ] Placeholders de anúncio sem poluir UX
- [ ] Build e lint sem erros
- [ ] Search Console configurado
- [ ] Política de privacidade compatível com anúncios
