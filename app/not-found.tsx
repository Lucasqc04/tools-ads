import Link from 'next/link';
import { Container } from '@/components/layout/container';

export default function NotFound() {
  return (
    <Container className="py-16">
      <div className="max-w-reading space-y-4 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-card">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Página não encontrada</h1>
        <p className="text-slate-700">
          A URL acessada não existe ou foi movida. Use o link abaixo para voltar ao hub principal.
        </p>
        <Link href="/" className="inline-flex text-sm font-semibold">
          Voltar para a home
        </Link>
      </div>
    </Container>
  );
}
