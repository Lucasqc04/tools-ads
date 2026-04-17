import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Sobre o Projeto',
  description:
    'Entenda o objetivo do Tools Lucasqc, como as ferramentas são construídas e quais princípios de SEO, UX e privacidade orientam o produto.',
  path: '/about',
  keywords: ['sobre ferramentas online', 'projeto tools', 'seo e ux'],
});

export default function AboutPage() {
  return (
    <Container className="py-8 md:py-10">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Sobre' }]} />
      <article className="prose-lite max-w-reading space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Sobre o Tools Lucasqc</h1>
        <p>
          O Tools Lucasqc nasceu para entregar utilitários web realmente úteis, rápidos e com estrutura profissional de SEO técnico. Cada página foi pensada como entrada direta de tráfego orgânico, sem depender da home para fazer sentido.
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Princípios do produto</h2>
        <ul>
          <li>Conteúdo útil antes de monetização.</li>
          <li>Experiência limpa e responsiva em mobile e desktop.</li>
          <li>Processamento local quando possível, para mais privacidade.</li>
          <li>Arquitetura escalável para novas tools sem retrabalho.</li>
        </ul>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Compromisso de qualidade</h2>
        <p>
          Mantemos páginas institucionais claras, políticas transparentes e uma arquitetura de links internos discreta. Isso fortalece confiança de usuários, mecanismos de busca e plataformas de anúncios como o Google AdSense.
        </p>
      </article>
    </Container>
  );
}
