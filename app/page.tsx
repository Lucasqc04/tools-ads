import Link from 'next/link';
import { AdSlotTop } from '@/components/ads/ad-slot-top';
import { Container } from '@/components/layout/container';
import { ToolCard } from '@/components/tools/tool-card';
import { buildMetadata } from '@/lib/seo';
import { toolsRegistry } from '@/data/tools-registry';

export const metadata = buildMetadata({
  title: 'Ferramentas Online para Produtividade e Desenvolvimento',
  description:
    'Hub de ferramentas online com foco em SEO técnico, performance e experiência limpa. Use utilitários práticos sem cadastro e com processamento local quando aplicável.',
  path: '/',
  keywords: [
    'ferramentas online',
    'tools online grátis',
    'utilitários web',
    'ferramentas para desenvolvedores',
  ],
});

export default function HomePage() {
  return (
    <Container className="py-10 md:py-14">
      <section className="max-w-reading space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Ferramentas online úteis, rápidas e prontas para SEO
        </h1>
        <p className="text-lg leading-8 text-slate-700">
          Este projeto foi estruturado como um hub de tools com páginas independentes, performance alta e base de monetização com Google AdSense sem comprometer UX.
        </p>
      </section>

      <div className="mt-6">
        <AdSlotTop />
      </div>

      <section className="mt-10" aria-labelledby="featured-tools-title">
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2 id="featured-tools-title" className="text-2xl font-bold tracking-tight text-slate-900">
            Ferramentas em destaque
          </h2>
          <Link href="/tools" className="text-sm font-semibold">
            Ver todas as ferramentas
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {toolsRegistry.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="prose-lite mt-12 max-w-reading space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Estrutura pensada para crescimento orgânico
        </h2>
        <p>
          Cada tool é tratada como landing page própria, com metadados dedicados, FAQ, conteúdo explicativo e links internos leves. Assim, as páginas conseguem rankear direto no Google sem depender da home como única entrada.
        </p>
        <p>
          A navegação global é discreta para evitar poluição visual. O usuário encontra rápido o que precisa e o robô de busca mantém rastreabilidade de rotas importantes via sitemap e estrutura de links contextual.
        </p>
      </section>
    </Container>
  );
}
