export type QueryParamItem = {
  key: string;
  value: string;
};

export const encodeFullUrl = (value: string): string => encodeURI(value);

export const decodeFullUrl = (value: string): string => decodeURI(value);

export const encodeQueryValue = (value: string): string => encodeURIComponent(value);

export const decodeQueryValue = (value: string): string => decodeURIComponent(value);

export const looksEncoded = (value: string): boolean => {
  try {
    const decoded = decodeURIComponent(value);
    return decoded !== value;
  } catch {
    return false;
  }
};

export const parseUrlQueryParams = (value: string): QueryParamItem[] => {
  const text = value.trim();

  const query = text.includes('?') ? text.split('?')[1] ?? '' : text;
  const queryOnly = query.split('#')[0] ?? '';

  if (!queryOnly) {
    return [];
  }

  const params = new URLSearchParams(queryOnly);
  const rows: QueryParamItem[] = [];

  params.forEach((paramValue, key) => {
    rows.push({ key, value: paramValue });
  });

  return rows;
};

export const rebuildUrlWithParams = (
  baseUrl: string,
  params: QueryParamItem[],
): string => {
  const cleanBase = baseUrl.trim() || 'https://example.com';
  const url = new URL(cleanBase);
  const search = new URLSearchParams();

  params.forEach((item) => {
    if (item.key.trim()) {
      search.set(item.key, item.value);
    }
  });

  url.search = search.toString();
  return url.toString();
};
