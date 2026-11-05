/**
 * Conteúdo de demonstração gerado localmente: imagens de exemplo pelo canvas e artes SVG embutidas.
 * Não há fotos de pessoas reais nem arquivos baixados de fora do site.
 */

export type DemoArtShape = 'sun' | 'waves' | 'grid' | 'circles';

export type DemoPostSeed = {
  id: string;
  username: string;
  palette: [string, string, string];
  shape: DemoArtShape;
  likes: number;
  comments: number;
  slides: number;
  location?: string;
};

export const DEMO_POST_SEEDS: DemoPostSeed[] = [
  {
    id: 'demo-1',
    username: 'viagem.da.lia',
    palette: ['#f97316', '#fbbf24', '#7c2d12'],
    shape: 'sun',
    likes: 2841,
    comments: 96,
    slides: 3,
    location: 'Lençóis Maranhenses',
  },
  {
    id: 'demo-2',
    username: 'cafe.da.tarde',
    palette: ['#1d67d6', '#89c5ff', '#1c3d76'],
    shape: 'waves',
    likes: 514,
    comments: 22,
    slides: 1,
  },
  {
    id: 'demo-3',
    username: 'estudio.noite',
    palette: ['#7c3aed', '#c4b5fd', '#1e1b4b'],
    shape: 'grid',
    likes: 1290,
    comments: 47,
    slides: 2,
  },
  {
    id: 'demo-4',
    username: 'designer.rafa',
    palette: ['#059669', '#6ee7b7', '#064e3b'],
    shape: 'circles',
    likes: 3307,
    comments: 151,
    slides: 1,
  },
];

const shapeMarkup = (shape: DemoArtShape, palette: DemoPostSeed['palette'], variant: number): string => {
  const [, b, c] = palette;
  const offset = variant * 140;
  switch (shape) {
    case 'sun':
      return `<circle cx="${540 + offset}" cy="620" r="230" fill="${b}"/><path d="M0 900 Q270 760 540 900 T1080 900 V1350 H0Z" fill="${c}"/>`;
    case 'waves':
      return `<path d="M0 500 Q270 420 540 500 T1080 500 V1350 H0Z" fill="${b}"/><path d="M0 760 Q270 690 540 760 T1080 760 V1350 H0Z" fill="${c}"/>`;
    case 'grid':
      return [0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) =>
          `<rect x="${120 + col * 300 + row * 10}" y="${200 + row * 260}" width="250" height="210" rx="28" fill="${(row + col) % 2 === 0 ? b : c}" opacity="${0.55 + ((row + col) % 3) * 0.15}"/>`,
        ).join(''),
      ).join('');
    case 'circles':
      return `<circle cx="300" cy="420" r="210" fill="${b}"/><circle cx="760" cy="860" r="300" fill="${c}" opacity="0.8"/><circle cx="820" cy="300" r="120" fill="${b}" opacity="0.7"/>`;
    default:
      return '';
  }
};

/** Arte SVG em data URI, sempre na proporção 4:5 de referência (1080 × 1350). */
export const createDemoArtDataUri = (seed: DemoPostSeed, variant = 0): string => {
  const [a] = seed.palette;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${seed.palette[2]}"/></linearGradient></defs><rect width="1080" height="1350" fill="url(#g)"/>${shapeMarkup(seed.shape, seed.palette, variant)}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/** Avatar com inicial sobre cor sólida. Usado quando o usuário não envia foto de perfil. */
export const createInitialAvatarDataUri = (letter: string, color: string): string => {
  const initial = (letter.trim().charAt(0) || '?').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="${color}"/><text x="60" y="78" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="56" font-weight="600" text-anchor="middle" fill="#ffffff">${initial}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const drawSunset = (context: CanvasRenderingContext2D, width: number, height: number) => {
  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#312e81');
  sky.addColorStop(0.55, '#f97316');
  sky.addColorStop(1, '#fde68a');
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);

  context.fillStyle = '#fff7ed';
  context.beginPath();
  context.arc(width * 0.5, height * 0.52, width * 0.16, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = '#7c2d12';
  context.beginPath();
  context.moveTo(0, height * 0.72);
  context.quadraticCurveTo(width * 0.25, height * 0.6, width * 0.5, height * 0.72);
  context.quadraticCurveTo(width * 0.75, height * 0.84, width, height * 0.7);
  context.lineTo(width, height);
  context.lineTo(0, height);
  context.closePath();
  context.fill();
};

const drawShapes = (context: CanvasRenderingContext2D, width: number, height: number) => {
  context.fillStyle = '#0f172a';
  context.fillRect(0, 0, width, height);
  const colors = ['#38bdf8', '#f472b6', '#facc15', '#34d399'];
  colors.forEach((color, index) => {
    context.fillStyle = color;
    context.globalAlpha = 0.85;
    context.beginPath();
    context.arc(width * (0.2 + index * 0.2), height * (0.3 + (index % 2) * 0.35), width * 0.13, 0, Math.PI * 2);
    context.fill();
  });
  context.globalAlpha = 1;
};

const drawPanoramaHills = (context: CanvasRenderingContext2D, width: number, height: number) => {
  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#0ea5e9');
  sky.addColorStop(1, '#e0f2fe');
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);
  const hills: Array<[string, number]> = [['#166534', 0.62], ['#15803d', 0.74], ['#14532d', 0.86]];
  hills.forEach(([color, base], index) => {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(0, height);
    for (let x = 0; x <= width; x += width / 12) {
      const wave = Math.sin((x / width) * Math.PI * (2 + index)) * height * 0.05;
      context.lineTo(x, height * base + wave);
    }
    context.lineTo(width, height);
    context.closePath();
    context.fill();
  });
};

/**
 * Gera três imagens de exemplo locais: duas em 4:5 e uma panorâmica larga, para o carrossel contínuo.
 */
export const createExampleFiles = async (): Promise<File[]> => {
  const specs: Array<{ name: string; width: number; height: number; draw: typeof drawSunset }> = [
    { name: 'exemplo-por-do-sol.jpg', width: 1080, height: 1350, draw: drawSunset },
    { name: 'exemplo-formas.jpg', width: 1080, height: 1350, draw: drawShapes },
    { name: 'exemplo-panoramica.jpg', width: 2700, height: 900, draw: drawPanoramaHills },
  ];

  const files: File[] = [];
  for (const spec of specs) {
    const canvas = document.createElement('canvas');
    canvas.width = spec.width;
    canvas.height = spec.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('canvas_unavailable');
    spec.draw(context, spec.width, spec.height);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((value) => (value ? resolve(value) : reject(new Error('example_failed'))), 'image/jpeg', 0.9);
    });
    files.push(new File([blob], spec.name, { type: 'image/jpeg' }));
    canvas.width = 0;
    canvas.height = 0;
  }

  return files;
};
