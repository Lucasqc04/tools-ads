import type { FaqItem } from '@/types/content';

type FaqProps = {
  items: FaqItem[];
  title?: string;
};

export function Faq({ items, title = 'Perguntas frequentes' }: FaqProps) {
  return (
    <section aria-labelledby="faq-title" className="space-y-3 md:space-y-4">
      <h2 id="faq-title" className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
        {title}
      </h2>

      <div className="space-y-2">
        {items.map((item) => (
          <details key={item.question} className="rounded-xl border border-slate-200 bg-white px-3 py-3 md:px-4">
            <summary className="cursor-pointer list-none pr-6 text-sm font-semibold text-slate-900 md:text-base">
              {item.question}
            </summary>
            <p className="mt-2 text-sm leading-6 text-slate-700 md:mt-3 md:leading-7">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
