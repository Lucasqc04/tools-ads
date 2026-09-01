import { cs2ToolIds } from '@/data/cs2/tools';

export const zhReadyToolIds: Set<string> = new Set<string>([
  'invisible-character',
  'nickname-symbol-generator',
  'symbols-to-copy',
  'cs2-crosshair-codes',
  ...cs2ToolIds,
]);

export const isZhReady = (toolId: string): boolean => zhReadyToolIds.has(toolId);
