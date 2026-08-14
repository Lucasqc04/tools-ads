import type { AnalyticsEventParams, TrackableEventName } from './events';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Pushes a single, well-formed event to `window.dataLayer` for GTM/GA4.
 *
 * - SSR-safe (no-op on the server).
 * - Best-effort: never throws, never awaited, never blocks the caller.
 * - Does not send any raw user input — only the analytics metadata passed
 *   in `params` (see AGENTS.md "Analytics / Privacidade" before adding a
 *   new call site).
 *
 * Usage:
 *   trackEvent('tool_started', { tool: TOOL_ID.pixDecoder });
 */
export function trackEvent(event: TrackableEventName, params: AnalyticsEventParams): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      ...params,
    });
  } catch {
    // Analytics must never break a tool. Swallow and move on.
  }
}
