import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata = buildMetadata({
  title: 'Contato',
  description:
    'Canal oficial de contato para suporte, feedback, parcerias e reportes técnicos sobre as ferramentas online.',
  path: '/contact',
  keywords: ['contato tools lucas qc', 'suporte ferramentas online', 'fale conosco'],
});

export default function ContactPage() {
  return (
    <Container className="py-8 md:py-10">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Contato' }]} />
      <article className="prose-lite max-w-reading space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Contato</h1>
        <p>
          Para dúvidas, sugestões, correções de conteúdo ou oportunidades de parceria, use o canal oficial abaixo.
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">E-mail</h2>
        <p>
          <Link href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</Link>
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Tempo de resposta</h2>
        <p>
          Buscamos responder mensagens em até 2 dias úteis. Reportes técnicos com passos de reprodução têm prioridade por facilitarem análise e correção.
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Boas práticas ao reportar problemas</h2>
        <ul>
          <li>Informe a URL exata da página.</li>
          <li>Descreva o comportamento esperado e o comportamento atual.</li>
          <li>Inclua navegador, dispositivo e horário aproximado do erro.</li>
        </ul>
      </article>
    </Container>
  );
}
