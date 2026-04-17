import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Termos de Uso',
  description:
    'Termos de uso do Tools Lucasqc: responsabilidades, limitações, propriedade intelectual e condições gerais de utilização.',
  path: '/terms',
  keywords: ['termos de uso', 'condições de uso', 'responsabilidades'],
});

export default function TermsPage() {
  return (
    <Container className="py-8 md:py-10">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Termos de Uso' }]} />
      <article className="prose-lite max-w-reading space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Termos de Uso</h1>
        <p>
          Ao utilizar este site, você concorda com os termos abaixo. Se não concordar, interrompa o uso das ferramentas.
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">1. Natureza das ferramentas</h2>
        <p>
          As ferramentas disponibilizadas são utilitários de apoio e não substituem aconselhamento profissional técnico, jurídico, contábil ou financeiro.
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">2. Responsabilidade de uso</h2>
        <p>
          O usuário é responsável por validar resultados antes de aplicar decisões críticas. Apesar dos esforços de qualidade, podem existir limitações de interpretação e de compatibilidade entre ambientes.
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">3. Propriedade intelectual</h2>
        <p>
          Conteúdos textuais, estrutura do site e componentes visuais são protegidos por direitos aplicáveis. Reprodução integral sem autorização não é permitida.
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">4. Disponibilidade e mudanças</h2>
        <p>
          Podemos atualizar, pausar ou remover funcionalidades sem aviso prévio para manutenção, melhorias ou adequação a políticas de terceiros.
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">5. Contato</h2>
        <p>
          Dúvidas sobre estes termos podem ser enviadas pela página de contato do site.
        </p>
      </article>
    </Container>
  );
}
