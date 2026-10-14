import { ToolCard } from '@/components/tools/tool-card';
import type { AppLocale } from '@/lib/i18n/config';
import { getToolGameGroup, isTechnicalToolCategory } from '@/lib/tools/catalog';
import type { ToolDefinition } from '@/types/tool';

type ToolCatalogSectionsProps = {
  tools: ToolDefinition[];
  locale: AppLocale;
  headingLevel: 2 | 3;
  labelsCategory: {
    crypto: string;
    dev: string;
    documents: string;
  };
  labelsGame: {
    cs2: string;
    gta: string;
    other: string;
  };
  labelsSection: {
    technical: string;
    gaming: string;
    utility: string;
  };
};

export function ToolCatalogSections({
  tools,
  locale,
  headingLevel,
  labelsCategory,
  labelsGame,
  labelsSection,
}: Readonly<ToolCatalogSectionsProps>) {
  const technicalGroups = [
    {
      key: 'crypto',
      label: labelsCategory.crypto,
      tools: tools.filter((tool) => tool.category === 'crypto'),
    },
    {
      key: 'dev',
      label: labelsCategory.dev,
      tools: tools.filter((tool) => tool.category === 'dev'),
    },
    {
      key: 'documents',
      label: labelsCategory.documents,
      tools: tools.filter((tool) => tool.category === 'documents'),
    },
  ].filter((group) => group.tools.length > 0);

  const gamingGroups = [
    {
      key: 'cs2',
      label: labelsGame.cs2,
      tools: tools.filter((tool) => getToolGameGroup(tool) === 'cs2'),
    },
    {
      key: 'gta',
      label: labelsGame.gta,
      tools: tools.filter((tool) => getToolGameGroup(tool) === 'gta'),
    },
    {
      key: 'other',
      label: labelsGame.other,
      tools: tools.filter((tool) => getToolGameGroup(tool) === 'other'),
    },
  ].filter((group) => group.tools.length > 0);

  const utilityTools = tools.filter((tool) => tool.category === 'utility');

  const hasTechnical = tools.some((tool) => isTechnicalToolCategory(tool.category));
  const hasGaming = tools.some((tool) => tool.category === 'gaming');
  const SectionHeading = headingLevel === 2 ? 'h2' : 'h3';
  const GroupHeading = headingLevel === 2 ? 'h3' : 'h4';
  const groupedToolHeadingLevel = headingLevel === 2 ? 4 : 5;
  const utilityToolHeadingLevel = headingLevel === 2 ? 3 : 4;

  return (
    <div className="space-y-10 md:space-y-12">
      {hasTechnical ? (
        <section className="space-y-5">
          <SectionHeading className="border-b border-slate-200 pb-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {labelsSection.technical}
          </SectionHeading>

          {technicalGroups.map((group) => (
            <section key={group.key} className="space-y-3" aria-label={group.label}>
              <div className="flex items-center gap-3">
                <GroupHeading className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  {group.label}
                </GroupHeading>
                <span aria-hidden="true" className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {group.tools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    locale={locale}
                    headingLevel={groupedToolHeadingLevel}
                  />
                ))}
              </div>
            </section>
          ))}
        </section>
      ) : null}

      {hasGaming ? (
        <section className="space-y-5">
          <SectionHeading className="border-b border-slate-200 pb-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {labelsSection.gaming}
          </SectionHeading>

          {gamingGroups.map((group) => (
            <section key={group.key} className="space-y-3" aria-label={group.label}>
              <div className="flex items-center gap-3">
                <GroupHeading className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  {group.label}
                </GroupHeading>
                <span aria-hidden="true" className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {group.tools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    locale={locale}
                    headingLevel={groupedToolHeadingLevel}
                  />
                ))}
              </div>
            </section>
          ))}
        </section>
      ) : null}

      {utilityTools.length > 0 ? (
        <section className="space-y-4">
          <SectionHeading className="border-b border-slate-200 pb-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {labelsSection.utility}
          </SectionHeading>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {utilityTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                locale={locale}
                headingLevel={utilityToolHeadingLevel}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
