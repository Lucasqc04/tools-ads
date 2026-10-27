import type { QualityMode } from './protocol';
import { isQualityMode } from './protocol';

export type AlertPolicy = 'warn' | 'reduce' | 'stop';
export type ContentPreference = 'automatic' | 'text' | 'motion';
export type UploadBudgetPreset = 'economy' | 'moderate' | 'balanced' | 'performance' | 'custom';
export type SessionLimitPreset = '500mb' | '1gb' | '2gb' | '5gb' | 'custom' | 'unlimited';

export type ShareScreenPreferences = {
  qualityMode: QualityMode;
  dataSaver: boolean;
  uploadBudgetPreset: UploadBudgetPreset;
  uploadBudgetMbps: number;
  sessionLimitPreset: SessionLimitPreset;
  sessionLimitBytes: number | null;
  alertPolicy: AlertPolicy;
  contentPreference: ContentPreference;
  viewerLimit: number;
  limitedConnection: boolean;
};

export const SHARE_SCREEN_PREFERENCES_KEY = 'adtools.share-screen.preferences.v1';

export const defaultShareScreenPreferences: ShareScreenPreferences = {
  qualityMode: 'automatic',
  dataSaver: false,
  uploadBudgetPreset: 'moderate',
  uploadBudgetMbps: 10,
  sessionLimitPreset: '1gb',
  sessionLimitBytes: 1_000_000_000,
  alertPolicy: 'stop',
  contentPreference: 'automatic',
  viewerLimit: 5,
  limitedConnection: false,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const loadShareScreenPreferences = (value: string | null): ShareScreenPreferences => {
  if (!value) return defaultShareScreenPreferences;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed)) return defaultShareScreenPreferences;
    const qualityMode = isQualityMode(parsed.qualityMode) ? parsed.qualityMode : defaultShareScreenPreferences.qualityMode;
    const uploadBudgetPreset: UploadBudgetPreset = ['economy', 'moderate', 'balanced', 'performance', 'custom'].includes(String(parsed.uploadBudgetPreset))
      ? parsed.uploadBudgetPreset as UploadBudgetPreset
      : defaultShareScreenPreferences.uploadBudgetPreset;
    const sessionLimitPreset: SessionLimitPreset = ['500mb', '1gb', '2gb', '5gb', 'custom', 'unlimited'].includes(String(parsed.sessionLimitPreset))
      ? parsed.sessionLimitPreset as SessionLimitPreset
      : defaultShareScreenPreferences.sessionLimitPreset;
    const alertPolicy: AlertPolicy = ['warn', 'reduce', 'stop'].includes(String(parsed.alertPolicy))
      ? parsed.alertPolicy as AlertPolicy
      : defaultShareScreenPreferences.alertPolicy;
    const contentPreference: ContentPreference = ['automatic', 'text', 'motion'].includes(String(parsed.contentPreference))
      ? parsed.contentPreference as ContentPreference
      : defaultShareScreenPreferences.contentPreference;
    return {
      ...defaultShareScreenPreferences,
      qualityMode,
      dataSaver: typeof parsed.dataSaver === 'boolean' ? parsed.dataSaver : defaultShareScreenPreferences.dataSaver,
      uploadBudgetPreset,
      uploadBudgetMbps: typeof parsed.uploadBudgetMbps === 'number' && parsed.uploadBudgetMbps >= 1 && parsed.uploadBudgetMbps <= 200
        ? parsed.uploadBudgetMbps
        : defaultShareScreenPreferences.uploadBudgetMbps,
      sessionLimitPreset,
      sessionLimitBytes: parsed.sessionLimitBytes === null || typeof parsed.sessionLimitBytes === 'number' && parsed.sessionLimitBytes >= 0
        ? parsed.sessionLimitBytes
        : null,
      alertPolicy,
      contentPreference,
      viewerLimit: typeof parsed.viewerLimit === 'number' && Number.isInteger(parsed.viewerLimit) && parsed.viewerLimit >= 1 && parsed.viewerLimit <= 20
        ? parsed.viewerLimit
        : defaultShareScreenPreferences.viewerLimit,
      limitedConnection: typeof parsed.limitedConnection === 'boolean' ? parsed.limitedConnection : defaultShareScreenPreferences.limitedConnection,
    };
  } catch {
    return defaultShareScreenPreferences;
  }
};

export const getUploadBudgetForPreset = (preset: UploadBudgetPreset): number | null => {
  if (preset === 'economy') return 3;
  if (preset === 'moderate') return 10;
  if (preset === 'balanced') return 20;
  if (preset === 'performance') return 50;
  return null;
};

export const getSessionLimitForPreset = (preset: SessionLimitPreset): number | null => {
  if (preset === '500mb') return 500_000_000;
  if (preset === '1gb') return 1_000_000_000;
  if (preset === '2gb') return 2_000_000_000;
  if (preset === '5gb') return 5_000_000_000;
  return null;
};
