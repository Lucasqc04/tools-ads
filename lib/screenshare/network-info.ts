export type BrowserNetworkType = 'wifi' | 'cellular' | 'ethernet' | 'unknown';

export type BrowserNetworkInfo = {
  type: BrowserNetworkType;
  typeWasReported: boolean;
  effectiveType: string | null;
  saveData: boolean | null;
  downlinkMbps: number | null;
  rttMs: number | null;
  available: boolean;
};

export type NetworkInformationLike = {
  type?: string;
  effectiveType?: string;
  saveData?: boolean;
  downlink?: number;
  rtt?: number;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
};

export const classifyBrowserNetwork = (value: NetworkInformationLike | null | undefined): BrowserNetworkInfo => {
  if (!value) {
    return {
      type: 'unknown',
      typeWasReported: false,
      effectiveType: null,
      saveData: null,
      downlinkMbps: null,
      rttMs: null,
      available: false,
    };
  }

  const reportedType = value.type?.toLowerCase();
  const type: BrowserNetworkType = reportedType === 'wifi'
    ? 'wifi'
    : reportedType === 'cellular'
      ? 'cellular'
      : reportedType === 'ethernet'
        ? 'ethernet'
        : 'unknown';

  return {
    type,
    typeWasReported: type !== 'unknown',
    effectiveType: value.effectiveType ?? null,
    saveData: typeof value.saveData === 'boolean' ? value.saveData : null,
    downlinkMbps: typeof value.downlink === 'number' && Number.isFinite(value.downlink) ? value.downlink : null,
    rttMs: typeof value.rtt === 'number' && Number.isFinite(value.rtt) ? value.rtt : null,
    available: true,
  };
};

export const getBrowserNetworkInformation = (): NetworkInformationLike | null => {
  if (typeof navigator === 'undefined') return null;
  return (navigator as Navigator & { connection?: NetworkInformationLike }).connection ?? null;
};
