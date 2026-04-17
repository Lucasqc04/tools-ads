import type { ContentBlock } from '@/types/content';

type ContentBlocksProps = {
  blocks: ContentBlock[];
};

export function ContentBlocks({ blocks }: ContentBlocksProps) {
  return (
    <section aria-labelledby="tool-content-title" className="prose-lite space-y-8">
      <h2 id="tool-content-title" className="text-2xl font-bold tracking-tight text-slate-900">
        Guia rápido e contexto de uso
      </h2>

      {blocks.map((block) => (
        <article key={block.title} className="space-y-4">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">{block.title}</h3>
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {block.list ? (
            <ul>
              {block.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </section>
  );
}
