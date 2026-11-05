export type SlideKind = 'image' | 'video';

/** `post` = foto ou carrossel de fotos/vídeos; `panorama` = carrossel contínuo; `reel` = um único vídeo vertical. */
export type PostType = 'post' | 'panorama' | 'reel';

export type FrameAspectId = '1:1' | '4:5' | '3:4' | '1.91:1';

export type PanoramaAspectId = '4:5' | '3:4';

/** `fill` preenche o quadro cortando as bordas; `fit` mostra a foto inteira com faixas. */
export type FitMode = 'fill' | 'fit';

export type PhoneView = 'feed' | 'profile' | 'reels';

export type PhoneTheme = 'light' | 'dark';

export type PhoneModelId = 'iphone-17-pro' | 'iphone-17-pro-max';

export type EditorStep = 'media' | 'edit' | 'details' | 'export';

/** Posição do enquadramento: x/y de 0 a 1 (0,5 = centralizado) e zoom de 1 a 3. */
export type PanCrop = {
  x: number;
  y: number;
  zoom: number;
};

/** Ajustes visuais básicos. Valores neutros: brilho 1, contraste 1, saturação 1. */
export type SlideFilters = {
  brightness: number;
  contrast: number;
  saturation: number;
};

/** Mídia original carregada localmente. Nada disso é enviado a um servidor. */
export type SourceMedia = {
  id: string;
  kind: SlideKind;
  file: File;
  /** Object URL para exibição. Deve ser revogada ao remover a mídia. */
  url: string;
  width: number;
  height: number;
  duration?: number;
  /** Miniatura reduzida (JPEG) para listas. Para vídeo, é o quadro inicial. */
  thumbUrl?: string;
};

export type MediaSlide = SourceMedia & {
  crop: PanCrop;
  fit: FitMode;
  filters: SlideFilters;
  altText: string;
};

export type PanoramaSettings = {
  count: number;
  aspect: PanoramaAspectId;
  source: SourceMedia | null;
  crop: PanCrop;
  fit: FitMode;
  filters: SlideFilters;
};

export type CoverImage = {
  url: string;
  blob: Blob;
  width: number;
  height: number;
};

export type ProfileSettings = {
  username: string;
  displayName: string;
  bio: string;
  location: string;
  tags: string;
  avatarUrl: string | null;
  avatarFile: File | null;
};

export type PostDraft = {
  postType: PostType;
  aspect: FrameAspectId;
  slides: MediaSlide[];
  /** Enquadramento da capa dentro da miniatura 3:4 do perfil. Só x e y são usados. */
  gridCrop: PanCrop;
  reelCover: CoverImage | null;
  panorama: PanoramaSettings;
  profile: ProfileSettings;
  caption: string;
  hideLikes: boolean;
  likes: number;
  comments: number;
};

/** Fatia renderizável: a mesma estrutura alimenta a prévia no iPhone e o exportador. */
export type SlideView = {
  id: string;
  index: number;
  kind: SlideKind;
  source: SourceMedia;
  /** Posição do conteúdo em frações do quadro do slide (left/width em largura, top/height em altura). */
  box: { left: number; top: number; width: number; height: number };
  filters: SlideFilters;
  altText: string;
  /** Fração de largura/altura do quadro do slide. */
  frameRatio: number;
};
