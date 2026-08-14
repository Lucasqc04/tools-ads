import type { ToolId } from './tool-ids';

/**
 * Base funnel events. Every tool should emit these four (when applicable)
 * so GA4 funnels can compare `tool_view -> tool_started -> tool_completed`
 * (and `tool_error`) across every tool using the exact same event names.
 */
export type BaseEventName = 'tool_view' | 'tool_started' | 'tool_completed' | 'tool_error';

/**
 * Conversion/"the result was actually useful" events. Only implement the
 * ones that make sense for a given tool.
 */
export type ConversionEventName = 'result_copied' | 'result_downloaded' | 'result_shared';

/**
 * Common, reusable interaction events. Only add one of these to a tool when
 * it carries real analytical value (see AGENTS.md). Prefer these generic
 * names over inventing a bespoke one-off event per tool.
 */
export type InteractionEventName =
  | 'parameter_changed'
  | 'format_selected'
  | 'mode_selected'
  | 'file_uploaded'
  | 'generation_started';

export type AnalyticsEventName = BaseEventName | ConversionEventName | InteractionEventName;

/**
 * Loosened string union: keeps autocomplete/typo-safety for the known
 * taxonomy above while still allowing a rare, justified bespoke event name.
 */
export type TrackableEventName = AnalyticsEventName | (string & {});

/**
 * Every event must carry `tool`. Everything else is optional, reusable
 * metadata — never raw user input (see AGENTS.md "Privacidade").
 */
export type AnalyticsEventParams = {
  tool: ToolId;
  /** Only set when the component already has it in scope — never derive it separately. */
  locale?: string;
} & Record<string, string | number | boolean | undefined>;

/** Normalized `error_type` values used across tools. Extend as needed, but keep values generic/reusable. */
export type NormalizedErrorType =
  | 'invalid_input'
  | 'parse_error'
  | 'validation_failed'
  | 'unsupported_format'
  | 'file_too_large'
  | 'processing_failed'
  | 'network_error'
  | 'not_found'
  | (string & {});
