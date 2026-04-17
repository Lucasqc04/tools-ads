import type { FaqItem } from '@/types/content';

type FaqProps = {
  items: FaqItem[];
  title?: string;
};

export function Faq({ items, title = 'Perguntas frequentes' }: FaqProps) {
  return (
    <section aria-labelledby="faq-title" className="space-y-4">
      <h2 id="faq-title" className="text-2xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>

      <div className="space-y-3">
        {items.map((item) => (
          <details key={item.question} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <summary className="cursor-pointer list-none pr-6 text-base font-semibold text-slate-900">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-7 text-slate-700">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
