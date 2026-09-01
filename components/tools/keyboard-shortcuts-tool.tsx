'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { trackEvent, TOOL_ID } from '@/lib/analytics';
import type { AppLocale } from '@/lib/i18n/config';
import { cn } from '@/lib/cn';
import {
  getShortcutAppById,
  getShortcutDisplayCombo,
  searchShortcuts,
  shortcutApps,
} from '@/lib/keyboard-shortcuts';

type KeyboardShortcutsToolProps = Readonly<{
  locale?: AppLocale;
  initialAppId?: string;
}>;

type UiCopy = {
  searchPlaceholder: string;
  os: string;
  windows: string;
  mac: string;
  noResults: string;
  privacy: string;
};

const uiByLocale: Record<AppLocale, UiCopy> = {
  'pt-br': {
    searchPlaceholder: 'Buscar atalho por ação (ex: copiar, comentário)',
    os: 'Sistema',
    windows: 'Windows',
    mac: 'Mac',
    noResults: 'Nenhum atalho encontrado para essa busca.',
    privacy: '🔒 Tudo acontece localmente no seu navegador. Nada é enviado para um servidor.',
  },
  en: {
    searchPlaceholder: 'Search a shortcut by action (e.g. copy, comment)',
    os: 'OS',
    windows: 'Windows',
    mac: 'Mac',
    noResults: 'No shortcut matches that search.',
    privacy: '🔒 Everything runs locally in your browser. Nothing is sent to a server.',
  },
  es: {
    searchPlaceholder: 'Buscar un atajo por acción (ej: copiar, comentario)',
    os: 'Sistema',
    windows: 'Windows',
    mac: 'Mac',
    noResults: 'No hay atajos para esa búsqueda.',
    privacy: '🔒 Todo ocurre localmente en tu navegador. Nada se envía a un servidor.',
  },
  zh: {
    searchPlaceholder: 'Search a shortcut by action (e.g. copy, comment)',
    os: 'OS',
    windows: 'Windows',
    mac: 'Mac',
    noResults: 'No shortcut matches that search.',
    privacy: '🔒 Everything runs locally in your browser. Nothing is sent to a server.',
  },
};

export function KeyboardShortcutsTool({
  locale = 'pt-br',
  initialAppId,
}: KeyboardShortcutsToolProps) {
  const ui = uiByLocale[locale];
  const defaultAppId = initialAppId ?? shortcutApps[0]?.id ?? '';

  const [activeAppId, setActiveAppId] = useState(defaultAppId);
  const [query, setQuery] = useState('');
  const [os, setOs] = useState<'windows' | 'mac'>('windows');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);

  const markStarted = useCallback(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackEvent('tool_started', { tool: TOOL_ID.keyboardShortcuts, locale });
    }
  }, [locale]);

  const activeApp = getShortcutAppById(activeAppId) ?? shortcutApps[0];

  const filteredCategories = useMemo(
    () => (activeApp ? searchShortcuts(activeApp, query, locale) : []),
    [activeApp, query, locale],
  );

  useEffect(() => {
    setQuery('');
  }, [activeAppId]);

  const copyShortcut = useCallback(
    async (id: string, combo: string) => {
      markStarted();

      try {
        await navigator.clipboard.writeText(combo);
        setCopiedId(id);
        window.setTimeout(() => {
          setCopiedId((prev) => (prev === id ? null : prev));
        }, 1500);

        trackEvent('result_copied', { tool: TOOL_ID.keyboardShortcuts, locale, app: activeAppId });

        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          trackEvent('tool_completed', { tool: TOOL_ID.keyboardShortcuts, locale });
        }
      } catch {
        trackEvent('tool_error', {
          tool: TOOL_ID.keyboardShortcuts,
          locale,
          error_type: 'clipboard_write_failed',
        });
      }
    },
    [activeAppId, locale, markStarted],
  );

  return (
    <div className="space-y-6">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
        {shortcutApps.map((app) => (
          <button
            key={app.id}
            type="button"
            aria-pressed={activeAppId === app.id}
            onClick={() => {
              markStarted();
              setActiveAppId(app.id);
            }}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition',
              activeAppId === app.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            )}
          >
            {app.labelByLocale[locale]}
          </button>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 md:p-6">
        <Input
          type="text"
          value={query}
          onChange={(event) => {
            markStarted();
            setQuery(event.target.value);
          }}
          placeholder={ui.searchPlaceholder}
        />

        {activeApp?.hasOsVariants ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">{ui.os}</span>
            <div className="flex overflow-hidden rounded-lg border border-slate-300">
              {(['windows', 'mac'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={os === option}
                  onClick={() => {
                    setOs(option);
                    trackEvent('mode_selected', {
                      tool: TOOL_ID.keyboardShortcuts,
                      locale,
                      mode: option,
                    });
                  }}
                  className={cn(
                    'px-3 py-1.5 text-xs font-semibold transition',
                    os === option ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100',
                  )}
                >
                  {option === 'windows' ? ui.windows : ui.mac}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {activeApp && filteredCategories.length > 0 ? (
        <div className="space-y-5">
          {filteredCategories.map((category) => (
            <div key={category.id} className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-700">
                {category.labelByLocale[locale]}
              </h3>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                {category.shortcuts.map((shortcut) => {
                  const combo = getShortcutDisplayCombo(
                    shortcut,
                    activeApp.hasOsVariants ? os : 'windows',
                  );

                  return (
                    <button
                      key={shortcut.id}
                      type="button"
                      onClick={() => void copyShortcut(shortcut.id, combo)}
                      className="flex w-full items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-2.5 text-left transition last:border-b-0 hover:bg-slate-50"
                    >
                      <span className="text-sm text-slate-700">
                        {shortcut.actionByLocale[locale]}
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <kbd className="rounded border border-slate-300 bg-slate-100 px-2 py-1 font-mono text-xs text-slate-800">
                          {combo}
                        </kbd>
                        {copiedId === shortcut.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-slate-400" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">{ui.noResults}</p>
      )}

      <p className="text-xs text-slate-400">{ui.privacy}</p>
    </div>
  );
}
