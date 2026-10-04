export type LabelCustomData = {
  description: string;
  note: string;
};

export type LabelStyle = {
  x: number;
  y: number;
  fontSize: number;
  alignment: 'left' | 'center' | 'right';
  maxLines: number;
  width: number;
  dpi: 203 | 300 | 600;
  widthMm: number;
  heightMm: number;
  rotation: 0 | 90 | 180 | 270;
};

export type LabelItem = {
  id: string;
  index: number;
  originalZpl: string;
  editableZpl: string;
  customData: LabelCustomData;
  generatedZpl: string;
};

export type ParsedZplBatch = {
  labels: string[];
  warnings: string[];
};

export type ZplDimensions = {
  widthDots: number;
  heightDots: number;
};

export const defaultLabelStyle: LabelStyle = {
  x: 32,
  y: 760,
  fontSize: 30,
  alignment: 'left',
  maxLines: 2,
  width: 720,
  dpi: 203,
  widthMm: 100,
  heightMm: 150,
  rotation: 0,
};
