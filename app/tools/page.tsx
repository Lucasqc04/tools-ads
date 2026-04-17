import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { ToolCard } from '@/components/tools/tool-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toolsRegistry } from '@/data/tools-registry';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Ferramentas Online',
  description:
    'Lista de ferramentas online com páginas próprias, conteúdo útil e foco em performance para desktop e mobile.',
  path: '/tools',
  keywords: ['ferramentas online', 'lista de tools', 'utilitários web grátis'],
});

type ToolsIndexPageProps = {
  searchParams?: Promise<{
    search?: string;
  }>;
};

export default async function ToolsIndexPage({ searchParams }: ToolsIndexPageProps) {
  const resolvedSearchParams = await searchParams;
  const query =
    typeof resolvedSearchParams?.search === 'string'
      ? resolvedSearchParams.search.trim()
      : '';
  const normalizedQuery = query.toLowerCase();

  const filteredTools = normalizedQuery
    ? toolsRegistry.filter((tool) => {
        const haystack = [
          tool.name,
          tool.shortDescription,
          tool.primaryKeyword,
          ...tool.secondaryKeywords,
        ]
          .join(' ')
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
    : toolsRegistry;

  return (
    <Container className="py-8 md:py-10">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Ferramentas' }]} />

      <header className="max-w-reading space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Todas as ferramentas</h1>
        <p className="text-base leading-7 text-slate-700 md:text-lg">
          Catálogo enxuto com páginas focadas. Cada ferramenta tem contexto próprio, FAQ, metadados individuais e arquitetura pronta para crescer sem perder qualidade.
        </p>
      </header>

      <form method="get" className="mt-6 flex flex-col gap-2 md:max-w-lg">
        <label htmlFor="search-tools" className="text-sm font-semibold text-slate-800">
          Buscar ferramenta
        </label>
        <div className="flex gap-2">
          <Input
            id="search-tools"
            name="search"
            defaultValue={query}
            placeholder="Ex.: json, satoshi, pdf"
          />
          <Button type="submit" variant="secondary">
            Buscar
          </Button>
        </div>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        {filteredTools.length} resultado(s){query ? ` para "${query}"` : ''}.
      </p>

      <section className="mt-6 grid gap-4 md:grid-cols-2" aria-label="Lista de ferramentas disponíveis">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </section>

      {!filteredTools.length ? (
        <p className="mt-4 text-sm text-slate-700">
          Nenhuma ferramenta encontrada para essa busca. Tente termos como
          <span className="font-semibold"> satoshi</span>,
          <span className="font-semibold"> json</span> ou
          <span className="font-semibold"> pdf</span>.
        </p>
      ) : null}
    </Container>
  );
}
