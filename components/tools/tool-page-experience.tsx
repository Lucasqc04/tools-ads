'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EXPANDED_QUERY_PARAM = 'expanded';

const isExpandedUrl = () => {
  const value = new URLSearchParams(window.location.search).get(EXPANDED_QUERY_PARAM);
  return value === '1' || value === 'true';
};

const makeBackgroundInert = (root: HTMLElement) => {
  const previousInert = new Map<HTMLElement, boolean>();
  let branch: HTMLElement = root;

  while (branch.parentElement) {
    const parent = branch.parentElement;

    for (const sibling of Array.from(parent.children)) {
      if (!(sibling instanceof HTMLElement) || sibling === branch) continue;
      previousInert.set(sibling, sibling.inert);
      sibling.inert = true;
    }

    if (parent === document.body) break;
    branch = parent;
  }

  return () => {
    previousInert.forEach((wasInert, element) => {
      element.inert = wasInert;
    });
  };
};

type ToolPageExperienceProps = Readonly<{
  breadcrumbs: ReactNode;
  header: ReactNode;
  beforeToolSection?: ReactNode;
  toolUi: ReactNode;
  afterToolSection?: ReactNode;
  supportingContent: ReactNode;
  toolName: string;
  useToolTitle: string;
  expandLabel: string;
  backLabel: string;
  enableFocusMode?: boolean;
}>;

export function ToolPageExperience({
  breadcrumbs,
  header,
  beforeToolSection,
  toolUi,
  afterToolSection,
  supportingContent,
  toolName,
  useToolTitle,
  expandLabel,
  backLabel,
  enableFocusMode = true,
}: ToolPageExperienceProps) {
  const [expanded, setExpanded] = useState(false);
  const expandedByAction = useRef(false);
  const wasExpanded = useRef(false);

  const openFocusMode = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set(EXPANDED_QUERY_PARAM, '1');
    expandedByAction.current = true;
    window.history.pushState(window.history.state, '', url);
    setExpanded(true);
  }, []);

  const closeFocusMode = useCallback(() => {
    if (expandedByAction.current) {
      expandedByAction.current = false;
      window.history.back();
      setExpanded(false);
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.delete(EXPANDED_QUERY_PARAM);
    window.history.replaceState(
      window.history.state,
      '',
      `${url.pathname}${url.search}${url.hash}`,
    );
    setExpanded(false);
  }, []);

  useEffect(() => {
    if (!enableFocusMode) return;

    const syncWithUrl = () => {
      const nextExpanded = isExpandedUrl();
      expandedByAction.current = false;
      setExpanded(nextExpanded);
    };

    syncWithUrl();
    window.addEventListener('popstate', syncWithUrl);
    return () => window.removeEventListener('popstate', syncWithUrl);
  }, [enableFocusMode]);

  useEffect(() => {
    if (!enableFocusMode || !expanded) return;

    const previousOverflow = document.body.style.overflow;
    const experience = document.querySelector<HTMLElement>('[data-tool-page-experience]');
    document.body.style.overflow = 'hidden';
    const restoreBackground = experience ? makeBackgroundInert(experience) : () => undefined;
    document.getElementById('tool-focus-exit')?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      restoreBackground();
    };
  }, [enableFocusMode, expanded]);

  useEffect(() => {
    if (wasExpanded.current && !expanded) {
      document.getElementById('tool-focus-open')?.focus();
    }
    wasExpanded.current = expanded;
  }, [expanded]);

  useEffect(() => {
    if (!enableFocusMode || !expanded) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeFocusMode();
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [closeFocusMode, enableFocusMode, expanded]);

  const isFocusMode = enableFocusMode && expanded;

  return (
    <div
      data-tool-page-experience
      data-tool-focus-mode={isFocusMode ? 'expanded' : 'page'}
      role={isFocusMode ? 'dialog' : undefined}
      aria-modal={isFocusMode ? true : undefined}
      aria-label={isFocusMode ? toolName : undefined}
      className={
        isFocusMode
          ? 'fixed inset-0 z-[100] min-h-dvh overflow-y-auto bg-white px-0 py-0'
          : 'relative'
      }
    >
      <div hidden={isFocusMode}>
        {breadcrumbs}
        <div className="mt-4 flex flex-col gap-4 sm:mt-6 sm:flex-row sm:items-end sm:justify-between">
          {header}
          {enableFocusMode ? (
            <Button
              id="tool-focus-open"
              type="button"
              aria-controls="tool-interface"
              aria-expanded={isFocusMode}
              onClick={openFocusMode}
              className="w-full shrink-0 sm:w-auto"
            >
              <Maximize2 size={16} className="mr-2" aria-hidden="true" />
              {expandLabel}
            </Button>
          ) : null}
        </div>
        {beforeToolSection ? <div className="mt-6 md:mt-8">{beforeToolSection}</div> : null}
      </div>

      <div
        className={
          isFocusMode
            ? 'mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-3 sm:px-4 md:px-6'
            : 'mt-6 md:mt-8'
        }
      >
        {isFocusMode ? (
          <div className="sticky top-0 z-10 -mx-3 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-3 py-3 backdrop-blur sm:-mx-4 sm:px-4 md:-mx-6 md:px-6">
            <Button
              id="tool-focus-exit"
              type="button"
              variant="ghost"
              onClick={closeFocusMode}
              className="shrink-0"
            >
              <ArrowLeft size={16} className="mr-2" aria-hidden="true" />
              {backLabel}
            </Button>
            <span className="min-w-0 truncate text-sm font-semibold text-slate-800 sm:text-base">
              {toolName}
            </span>
          </div>
        ) : null}

        <main
          className={
            isFocusMode
              ? 'flex flex-1 flex-col py-4 sm:py-6'
              : 'space-y-6 md:space-y-8'
          }
        >
          <section id="tool-interface" aria-labelledby="tool-interface-title" className="min-w-0 space-y-3">
            <h2
              id="tool-interface-title"
              className="sr-only"
            >
              {useToolTitle}
            </h2>
            <div data-tool-workspace className={isFocusMode ? 'min-w-0 flex-1' : 'min-w-0'}>
              {toolUi}
            </div>
          </section>

          {!isFocusMode && afterToolSection ? afterToolSection : null}
          {!isFocusMode ? supportingContent : null}
        </main>
      </div>
    </div>
  );
}
