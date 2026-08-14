'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics/track';
import { toToolId } from '@/lib/analytics/tool-ids';

type ToolViewTrackerProps = Readonly<{
  /** Raw registry id (kebab-case), e.g. `tool.id` from `ToolDefinition`. */
  toolId: string;
  locale?: string;
}>;

/**
 * Fires `tool_view` exactly once per mount of a tool page. Mounted centrally
 * by `ToolPageShell` so every tool (including alias/sibling SEO pages and
 * CS2/front-only variants) reports views the same way, without every tool
 * component having to remember to do it.
 *
 * Guards against React Strict Mode's dev-only double effect invocation with
 * a ref: a fresh page mount (real navigation) always gets a fresh ref, so
 * this does not suppress legitimate repeat views.
 */
export function ToolViewTracker({ toolId, locale }: ToolViewTrackerProps) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) {
      return;
    }
    hasTrackedRef.current = true;
    trackEvent('tool_view', { tool: toToolId(toolId), locale });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolId, locale]);

  return null;
}
