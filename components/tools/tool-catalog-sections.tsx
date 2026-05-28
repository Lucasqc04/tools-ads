import Link from 'next/link';
import { ToolCard } from '@/components/tools/tool-card';
import type { AppLocale } from '@/lib/i18n/config';
import { getToolGameGroup, isTechnicalToolCategory } from '@/lib/tools/catalog';
import type { ToolDefinition } from '@/types/tool';

type ToolCatalogSectionsProps = {
  tools: ToolDefinition[];
  locale: AppLocale;
  compactGaming?: boolean;
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
  compactGaming = false,
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

  const cs2FeaturedIds = [
    'cs2-practice-commands',
    'cs2-autoexec-generator',
    'cs2-competitive-config',
    'cs2-crosshair-codes',
  ];

  const getCompactGroupTools = (groupKey: string, groupTools: ToolDefinition[]): ToolDefinition[] => {
    if (!compactGaming || groupKey !== 'cs2' || groupTools.length <= 6) {
      return groupTools;
    }

    const selected = cs2FeaturedIds
      .map((id) => groupTools.find((tool) => tool.id === id))
      .filter((tool): tool is ToolDefinition => Boolean(tool));

    if (selected.length >= 3) {
      return selected;
    }

    return groupTools.slice(0, 4);
  };

  const cs2HubTool = gamingGroups
    .find((group) => group.key === 'cs2')
    ?.tools.find((tool) => tool.id === 'cs2-practice-commands');

  let moreModesLabel = 'Ver todos os modos CS2';
  let hiddenModesPrefix = 'Mais modos de CS2 disponiveis no hub:';

  if (locale === 'en') {
    moreModesLabel = 'View all CS2 modes';
    hiddenModesPrefix = 'More CS2 modes available in the hub:';
  }

  if (locale === 'es') {
    moreModesLabel = 'Ver todos los modos CS2';
    hiddenModesPrefix = 'Mas modos de CS2 disponibles en el hub:';
  }

  const utilityTools = tools.filter((tool) => tool.category === 'utility');

  const hasTechnical = tools.some((tool) => isTechnicalToolCategory(tool.category));
  const hasGaming = tools.some((tool) => tool.category === 'gaming');

  return (
    <div className="space-y-8">
      {hasTechnical ? (
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{labelsSection.technical}</h2>

          {technicalGroups.map((group) => (
            <section key={group.key} className="space-y-3" aria-label={group.label}>
              <h3 className="text-sm font-semibold text-slate-700">{group.label}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {group.tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} locale={locale} />
                ))}
              </div>
            </section>
          ))}
        </section>
      ) : null}

      {hasGaming ? (
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{labelsSection.gaming}</h2>

          {gamingGroups.map((group) => (
            <section key={group.key} className="space-y-3" aria-label={group.label}>
              <h3 className="text-sm font-semibold text-slate-700">{group.label}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {getCompactGroupTools(group.key, group.tools).map((tool) => (
                  <ToolCard key={tool.id} tool={tool} locale={locale} />
                ))}
              </div>
              {compactGaming && group.key === 'cs2' && group.tools.length > getCompactGroupTools(group.key, group.tools).length && cs2HubTool ? (
                <p className="text-sm text-slate-600">
                  {hiddenModesPrefix}{' '}
                  <Link href={cs2HubTool.canonicalPath} className="font-semibold text-slate-900">
                    {moreModesLabel}
                  </Link>
                </p>
              ) : null}
            </section>
          ))}
        </section>
      ) : null}

      {utilityTools.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{labelsSection.utility}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {utilityTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
