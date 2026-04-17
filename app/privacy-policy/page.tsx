import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Política de Privacidade',
  description:
    'Política de privacidade do Tools Lucasqc: dados coletados, finalidade, cookies, uso de anúncios e direitos do usuário.',
  path: '/privacy-policy',
  keywords: ['política de privacidade', 'cookies', 'dados pessoais', 'adsense'],
});

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-8 md:py-10">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Política de Privacidade' }]} />
      <article className="prose-lite max-w-reading space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Política de Privacidade</h1>
        <p>
          Esta política descreve como o Tools Lucasqc trata informações de navegação e quais práticas adotamos para proteger usuários.
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">1. Dados processados nas ferramentas</h2>
        <p>
          As ferramentas principais foram projetadas para processamento local no navegador sempre que possível. Isso significa que conteúdos inseridos em campos de uso não são enviados automaticamente para nossos servidores.
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">2. Cookies e métricas</h2>
        <p>
          Podemos usar cookies técnicos e de medição para melhorar desempenho, estabilidade e experiência. Quando houver integração de publicidade, parceiros podem usar cookies para personalização e medição conforme suas próprias políticas.
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">3. Publicidade</h2>
        <p>
          Este site pode exibir anúncios de redes como Google AdSense. A veiculação está sujeita às políticas da plataforma, inclusive quanto a uso de cookies e personalização de anúncios por interesse.
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">4. Direitos do usuário</h2>
        <p>
          Você pode solicitar esclarecimentos sobre dados e práticas de privacidade por meio da página de contato. Revisamos periodicamente esta política para manter clareza e conformidade.
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">5. Atualizações desta política</h2>
        <p>
          Alterações podem ocorrer para refletir melhorias no produto, mudanças legais ou novas integrações. Recomenda-se revisar esta página periodicamente.
        </p>
      </article>
    </Container>
  );
}
