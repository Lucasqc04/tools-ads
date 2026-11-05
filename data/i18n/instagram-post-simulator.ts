import type { AppLocale } from '@/lib/i18n/config';
import type { DemoPostSeed } from '@/lib/instagram-post-simulator/demo';

export type SimulatorCopy = {
  simulationNotice: string;
  unofficial: string;
  steps: { media: string; edit: string; details: string; exportStep: string };
  back: string;
  next: string;
  mediaTitle: string;
  mediaHint: string;
  dropzoneLabel: string;
  dropzoneHint: string;
  examples: string;
  examplesHint: string;
  clearAll: string;
  slidesCount: (count: number, limit: number) => string;
  processing: (done: number, total: number) => string;
  rejectedFiles: (count: number) => string;
  limitReached: (limit: number) => string;
  errors: {
    unsupported_format: string;
    file_too_large: string;
    decode_failed: string;
    too_many_pixels: string;
    export_failed: string;
  };
  selectedBadge: string;
  remove: string;
  moveLeft: string;
  moveRight: string;
  dragHint: string;
  editTitle: string;
  postTypeLabel: string;
  postTypes: { post: string; panorama: string; reel: string };
  postTypeHints: { post: string; panorama: string; reel: string };
  aspectLabel: string;
  aspectHelp: string;
  aspectNames: Record<'1:1' | '4:5' | '3:4' | '1.91:1', string>;
  slideLabel: (index: number) => string;
  activeSlideLabel: string;
  kindPhoto: string;
  kindVideo: string;
  fitLabel: string;
  fill: string;
  fit: string;
  zoomLabel: string;
  panLabel: string;
  resetCrop: string;
  cutAreaHint: string;
  videoPreviewNote: string;
  altTextLabel: string;
  altTextHint: string;
  filtersTitle: string;
  presets: Record<'original' | 'vivid' | 'soft' | 'mono' | 'contrast', string>;
  brightness: string;
  contrast: string;
  saturation: string;
  applyFiltersToAll: string;
  gridTitle: string;
  gridHint: string;
  gridCutWarning: (percent: number) => string;
  gridWindowLabel: string;
  gridPosX: string;
  gridPosY: string;
  panoramaTitle: string;
  panoramaHint: string;
  panoramaChooseImage: string;
  panoramaCount: string;
  panoramaSlidesNote: (count: number) => string;
  panoramaNeedsImage: string;
  reelTitle: string;
  reelHint: string;
  reelNeedsOneVideo: string;
  reelScrub: string;
  reelUseFrame: string;
  reelImportCover: string;
  reelRemoveCover: string;
  reelAutoCover: string;
  reelCoverCompare: string;
  compareFeed: string;
  compareGrid: string;
  compareReel: string;
  detailsTitle: string;
  profileTitle: string;
  avatar: string;
  avatarHint: string;
  username: string;
  displayName: string;
  bio: string;
  location: string;
  tagsLabel: string;
  tagsHint: string;
  captionLabel: string;
  captionHint: string;
  emojis: string;
  captionCount: (count: number, limit: number) => string;
  captionNearLimit: string;
  hideLikes: string;
  metricsTitle: string;
  likesCount: string;
  commentsCount: string;
  finalize: string;
  finalizeNote: string;
  exportTitle: string;
  exportFormat: string;
  formatJpeg: string;
  formatPng: string;
  downloadSlide: string;
  downloadAll: string;
  downloadVideo: string;
  downloadCover: string;
  exportSize: (width: number, height: number) => string;
  exportNote: string;
  exportEmpty: string;
  exportPreparing: string;
  previewTitle: string;
  viewFeed: string;
  viewProfile: string;
  viewReels: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  deviceLabel: string;
  frameToggle: string;
  contextToggle: string;
  guidesToggle: string;
  statusTimeLabel: string;
  showPreviewMobile: string;
  showEditorMobile: string;
  reelEmpty: string;
  profileEmpty: string;
  phone: {
    timeAgo: string;
    likeLabel: string;
    commentLabel: string;
    shareLabel: string;
    saveLabel: string;
    unsaveLabel: string;
    unlikeLabel: string;
    moreLabel: string;
    moreCaption: string;
    likedBy: (name: string, others: number) => string;
    likesHidden: string;
    likesLabel: (count: number) => string;
    viewComments: (count: number) => string;
    commentsTitle: string;
    commentPlaceholder: string;
    addComment: string;
    simulatedComment: string;
    closeSheet: string;
    sharedNote: string;
    optionsTitle: string;
    optionEdit: string;
    optionCancel: string;
    carouselCounter: (index: number, total: number) => string;
    prevSlide: string;
    nextSlide: string;
    playVideo: string;
    pauseVideo: string;
    mute: string;
    unmute: string;
    follow: string;
    audio: string;
    tabHome: string;
    tabSearch: string;
    tabReels: string;
    tabShop: string;
    tabProfile: string;
    navTitle: string;
    stories: string;
    yourStory: string;
    postsCount: string;
    followers: string;
    following: string;
    editProfile: string;
    shareProfile: string;
    gridTab: string;
    reelsTab: string;
    taggedTab: string;
    carouselIcon: string;
    reelIcon: string;
    videoIcon: string;
    yourPost: string;
    tagsLine: (names: string) => string;
    reelLocked: string;
  };
  demoPosts: Record<DemoPostSeed['id'], { caption: string; time: string; comments: Array<{ user: string; text: string }> }>;
  defaults: { username: string; displayName: string; bio: string; caption: string };
};

const ptBr: SimulatorCopy = {
  simulationNotice: 'Simulação local: nada é publicado e nenhuma conta é acessada.',
  unofficial: 'Ferramenta independente, sem afiliação com a Meta ou o Instagram.',
  steps: { media: 'Mídias', edit: 'Editar', details: 'Legenda e perfil', exportStep: 'Exportar' },
  back: 'Voltar',
  next: 'Continuar',
  mediaTitle: 'Escolha as fotos e vídeos',
  mediaHint: 'Até 20 itens por carrossel. Os arquivos ficam neste navegador.',
  dropzoneLabel: 'Arraste fotos ou vídeos para cá',
  dropzoneHint: 'JPG, PNG, WebP, HEIC (se o navegador abrir), MP4 ou MOV (se o navegador reproduzir).',
  examples: 'Experimentar exemplo',
  examplesHint: 'Gera três imagens de demonstração no seu navegador.',
  clearAll: 'Remover tudo',
  slidesCount: (count, limit) => `${count} de ${limit} itens`,
  processing: (done, total) => `Processando ${done} de ${total}…`,
  rejectedFiles: (count) => `${count} arquivo(s) não puderam ser usados.`,
  limitReached: (limit) => `O carrossel aceita no máximo ${limit} itens.`,
  errors: {
    unsupported_format: 'Formato não suportado. Use foto ou vídeo compatível com o navegador.',
    file_too_large: 'Arquivo grande demais para esta ferramenta.',
    decode_failed: 'Não foi possível abrir este arquivo neste navegador. Tente salvar como JPEG ou MP4.',
    too_many_pixels: 'Esta foto tem resolução alta demais. Reduza o tamanho e tente de novo.',
    export_failed: 'Não foi possível gerar o arquivo. Tente novamente.',
  },
  selectedBadge: 'Ordem',
  remove: 'Remover',
  moveLeft: 'Mover para antes',
  moveRight: 'Mover para depois',
  dragHint: 'Arraste os cartões com o mouse ou use os botões de mover, que funcionam com toque e teclado.',
  editTitle: 'Formato e edição',
  postTypeLabel: 'Tipo de publicação',
  postTypes: { post: 'Foto ou carrossel', panorama: 'Carrossel contínuo', reel: 'Reel' },
  postTypeHints: {
    post: 'Uma foto ou até 20 itens. Todos usam o mesmo formato.',
    panorama: 'Uma imagem larga dividida em slides lado a lado.',
    reel: 'Um vídeo vertical 9:16. Você escolhe a capa.',
  },
  aspectLabel: 'Formato do feed',
  aspectHelp: 'O formato vale para todos os slides. Cada slide tem seu próprio enquadramento.',
  aspectNames: { '1:1': 'Quadrado 1:1', '4:5': 'Retrato 4:5', '3:4': 'Retrato 3:4', '1.91:1': 'Paisagem 1,91:1' },
  slideLabel: (index) => `Slide ${index}`,
  activeSlideLabel: 'Slide em edição',
  kindPhoto: 'Foto',
  kindVideo: 'Vídeo',
  fitLabel: 'Enquadramento',
  fill: 'Preencher',
  fit: 'Ajustar',
  zoomLabel: 'Zoom',
  panLabel: 'Arraste a imagem para reposicionar. Use pinça no celular.',
  resetCrop: 'Restaurar enquadramento',
  cutAreaHint: 'A parte escura da imagem fica fora do quadro e não aparece no post.',
  videoPreviewNote: 'Vídeos aparecem com este enquadramento só na prévia. O download entrega o arquivo original, sem cortes.',
  altTextLabel: 'Texto alternativo',
  altTextHint: 'Descreve a imagem para pessoas que usam leitor de tela.',
  filtersTitle: 'Ajustes visuais',
  presets: { original: 'Original', vivid: 'Vívido', soft: 'Suave', mono: 'Preto e branco', contrast: 'Contraste' },
  brightness: 'Brilho',
  contrast: 'Contraste',
  saturation: 'Saturação',
  applyFiltersToAll: 'Aplicar a todos os slides',
  gridTitle: 'Capa na grade do perfil',
  gridHint: 'A grade do perfil mostra uma área 3:4 do post. Ajuste a posição sem mudar o post.',
  gridCutWarning: (percent) => `Cerca de ${percent}% da imagem fica fora da grade. Confira as bordas da área tracejada.`,
  gridWindowLabel: 'Área visível na grade',
  gridPosX: 'Posição horizontal',
  gridPosY: 'Posição vertical',
  panoramaTitle: 'Carrossel contínuo',
  panoramaHint: 'Uma imagem larga atravessa vários slides. Cada slide exporta com a largura exata.',
  panoramaChooseImage: 'Escolher imagem panorâmica',
  panoramaCount: 'Quantidade de slides',
  panoramaSlidesNote: (count) => `${count} slides, cada um com 1080 px de largura.`,
  panoramaNeedsImage: 'Escolha uma imagem para montar o carrossel contínuo.',
  reelTitle: 'Capa do Reel',
  reelHint: 'Escolha um quadro do vídeo ou importe uma imagem como capa.',
  reelNeedsOneVideo: 'Para o modo Reel, deixe apenas um vídeo no editor.',
  reelScrub: 'Quadro do vídeo',
  reelUseFrame: 'Usar este quadro como capa',
  reelImportCover: 'Importar imagem como capa',
  reelRemoveCover: 'Remover capa personalizada',
  reelAutoCover: 'Capa automática (início do vídeo)',
  reelCoverCompare: 'Como a capa aparece',
  compareFeed: 'Feed (4:5)',
  compareGrid: 'Grade do perfil (3:4)',
  compareReel: 'Reel (9:16)',
  detailsTitle: 'Legenda e perfil',
  profileTitle: 'Perfil',
  avatar: 'Foto de perfil',
  avatarHint: 'Opcional. Sem foto, a prévia usa uma inicial.',
  username: 'Nome de usuário',
  displayName: 'Nome exibido',
  bio: 'Bio',
  location: 'Localização',
  tagsLabel: 'Marcações simuladas',
  tagsHint: 'Separe com vírgula. Ex.: @ana, @bruno',
  captionLabel: 'Legenda',
  captionHint: 'Use #hashtags e @menções. Elas aparecem destacadas na prévia.',
  emojis: 'Emojis',
  captionCount: (count, limit) => `${count} / ${limit} caracteres`,
  captionNearLimit: 'Perto do limite de 2.200 caracteres.',
  hideLikes: 'Ocultar contagem de curtidas na prévia',
  metricsTitle: 'Métricas fictícias',
  likesCount: 'Curtidas (fictícias)',
  commentsCount: 'Comentários (fictícios)',
  finalize: 'Finalizar simulação',
  finalizeNote: 'Abre a prévia do feed com sua publicação. Nada é enviado.',
  exportTitle: 'Exportar',
  exportFormat: 'Formato do arquivo',
  formatJpeg: 'JPEG (menor)',
  formatPng: 'PNG (sem perda)',
  downloadSlide: 'Baixar slide',
  downloadAll: 'Baixar tudo em ZIP',
  downloadVideo: 'Baixar vídeo original',
  downloadCover: 'Baixar capa',
  exportSize: (width, height) => `${width} × ${height} px`,
  exportNote: 'A exportação gera só a imagem recortada e com os ajustes aplicados. Molduras, guias e controles não entram no arquivo.',
  exportEmpty: 'Adicione mídias para exportar.',
  exportPreparing: 'Gerando arquivos…',
  previewTitle: 'Prévia no iPhone',
  viewFeed: 'Feed',
  viewProfile: 'Perfil',
  viewReels: 'Reels',
  themeLabel: 'Aparência',
  themeLight: 'Claro',
  themeDark: 'Escuro',
  deviceLabel: 'Aparelho',
  frameToggle: 'Moldura',
  contextToggle: 'Feed de exemplo',
  guidesToggle: 'Guias do Reel',
  statusTimeLabel: 'Horário na barra de status',
  showPreviewMobile: 'Ver prévia',
  showEditorMobile: 'Ver editor',
  reelEmpty: 'Escolha um vídeo e o tipo Reel para ver esta prévia.',
  profileEmpty: 'Sua publicação aparece aqui na grade.',
  phone: {
    timeAgo: 'AGORA',
    likeLabel: 'Curtir',
    commentLabel: 'Comentar',
    shareLabel: 'Compartilhar (simulação)',
    saveLabel: 'Salvar',
    unsaveLabel: 'Remover dos salvos',
    unlikeLabel: 'Descurtir',
    moreLabel: 'Mais opções',
    moreCaption: 'mais',
    likedBy: (name, others) => `Curtido por ${name} e outras ${others} pessoas`,
    likesHidden: 'Contagem de curtidas oculta',
    likesLabel: (count) => `${count.toLocaleString('pt-BR')} curtidas`,
    viewComments: (count) => `Ver todos os ${count} comentários`,
    commentsTitle: 'Comentários',
    commentPlaceholder: 'Adicionar comentário…',
    addComment: 'Publicar',
    simulatedComment: 'Comentário apenas nesta simulação.',
    closeSheet: 'Fechar',
    sharedNote: 'Simulação: nada foi enviado para o Instagram.',
    optionsTitle: 'Opções',
    optionEdit: 'Editar publicação',
    optionCancel: 'Cancelar',
    carouselCounter: (index, total) => `${index}/${total}`,
    prevSlide: 'Slide anterior',
    nextSlide: 'Próximo slide',
    playVideo: 'Reproduzir vídeo',
    pauseVideo: 'Pausar vídeo',
    mute: 'Silenciar',
    unmute: 'Ativar som',
    follow: 'Seguir',
    audio: 'Áudio original',
    tabHome: 'Início',
    tabSearch: 'Pesquisar',
    tabReels: 'Reels',
    tabShop: 'Loja',
    tabProfile: 'Perfil',
    navTitle: 'Instagram',
    stories: 'Stories',
    yourStory: 'Seu story',
    postsCount: 'publicações',
    followers: 'seguidores',
    following: 'seguindo',
    editProfile: 'Editar perfil',
    shareProfile: 'Compartilhar perfil',
    gridTab: 'Publicações',
    reelsTab: 'Reels',
    taggedTab: 'Marcadas',
    carouselIcon: 'Carrossel',
    reelIcon: 'Reel',
    videoIcon: 'Vídeo',
    yourPost: 'Sua publicação',
    tagsLine: (names) => `Com ${names}`,
    reelLocked: 'Reel',
  },
  demoPosts: {
    'demo-1': {
      caption: 'Dia de dunas e lagoas. Quem mais já sonhou com esse lugar? ✨ #viagem #nordeste',
      time: '2 HORAS',
      comments: [
        { user: 'mari.fotos', text: 'Que cor incrível!' },
        { user: 'joao.trilhas', text: 'Preciso ir até aí 😍' },
      ],
    },
    'demo-2': {
      caption: 'Café passado na hora e uma tarde pedindo silêncio.',
      time: '5 HORAS',
      comments: [{ user: 'lu.cafe', text: 'Perfeito para essa hora ☕' }],
    },
    'demo-3': {
      caption: 'Estúdio à noite com a luz da mesa e nada mais.',
      time: '1 DIA',
      comments: [{ user: 'ana.design', text: 'Essa paleta ficou muito boa' }],
    },
    'demo-4': {
      caption: 'Três formas, uma ideia. Para o próximo projeto de identidade visual.',
      time: '2 DIAS',
      comments: [
        { user: 'bruno.ux', text: 'Bem limpo!' },
        { user: 'carla.arte', text: 'Salvei para referência' },
      ],
    },
  },
  defaults: {
    username: 'seu.perfil',
    displayName: 'Seu nome',
    bio: 'Escreva sua bio aqui. Ela aparece no topo do perfil.',
    caption: 'Escreva a legenda da sua publicação aqui. #simulacao',
  },
};

const en: SimulatorCopy = {
  simulationNotice: 'Local simulation: nothing is published and no account is accessed.',
  unofficial: 'Independent tool, not affiliated with Meta or Instagram.',
  steps: { media: 'Media', edit: 'Edit', details: 'Caption and profile', exportStep: 'Export' },
  back: 'Back',
  next: 'Continue',
  mediaTitle: 'Choose photos and videos',
  mediaHint: 'Up to 20 items per carousel. Files stay in this browser.',
  dropzoneLabel: 'Drag photos or videos here',
  dropzoneHint: 'JPG, PNG, WebP, HEIC (if your browser opens it), MP4 or MOV (if your browser plays it).',
  examples: 'Try an example',
  examplesHint: 'Generates three demo images in your browser.',
  clearAll: 'Remove all',
  slidesCount: (count, limit) => `${count} of ${limit} items`,
  processing: (done, total) => `Processing ${done} of ${total}…`,
  rejectedFiles: (count) => `${count} file(s) could not be used.`,
  limitReached: (limit) => `The carousel accepts up to ${limit} items.`,
  errors: {
    unsupported_format: 'Unsupported format. Use a photo or video your browser can handle.',
    file_too_large: 'This file is too large for this tool.',
    decode_failed: 'This file could not be opened in this browser. Try saving it as JPEG or MP4.',
    too_many_pixels: 'This photo has too many pixels. Reduce its size and try again.',
    export_failed: 'The file could not be generated. Try again.',
  },
  selectedBadge: 'Order',
  remove: 'Remove',
  moveLeft: 'Move earlier',
  moveRight: 'Move later',
  dragHint: 'Drag cards with a mouse, or use the move buttons, which also work with touch and keyboard.',
  editTitle: 'Format and editing',
  postTypeLabel: 'Post type',
  postTypes: { post: 'Photo or carousel', panorama: 'Continuous carousel', reel: 'Reel' },
  postTypeHints: {
    post: 'One photo or up to 20 items. All share the same format.',
    panorama: 'One wide image split across side-by-side slides.',
    reel: 'One vertical 9:16 video. You choose the cover.',
  },
  aspectLabel: 'Feed format',
  aspectHelp: 'The format applies to every slide. Each slide keeps its own framing.',
  aspectNames: { '1:1': 'Square 1:1', '4:5': 'Portrait 4:5', '3:4': 'Portrait 3:4', '1.91:1': 'Landscape 1.91:1' },
  slideLabel: (index) => `Slide ${index}`,
  activeSlideLabel: 'Slide being edited',
  kindPhoto: 'Photo',
  kindVideo: 'Video',
  fitLabel: 'Framing',
  fill: 'Fill',
  fit: 'Fit',
  zoomLabel: 'Zoom',
  panLabel: 'Drag the image to reposition it. Use pinch on a phone.',
  resetCrop: 'Reset framing',
  cutAreaHint: 'The dimmed part of the image is outside the frame and does not appear in the post.',
  videoPreviewNote: 'Videos use this framing only in the preview. The download gives you the original file, uncropped.',
  altTextLabel: 'Alt text',
  altTextHint: 'Describes the image for people using screen readers.',
  filtersTitle: 'Visual adjustments',
  presets: { original: 'Original', vivid: 'Vivid', soft: 'Soft', mono: 'Black and white', contrast: 'Contrast' },
  brightness: 'Brightness',
  contrast: 'Contrast',
  saturation: 'Saturation',
  applyFiltersToAll: 'Apply to all slides',
  gridTitle: 'Cover in the profile grid',
  gridHint: 'The profile grid shows a 3:4 area of the post. Adjust the position without changing the post.',
  gridCutWarning: (percent) => `About ${percent}% of the image is outside the grid. Check the edges of the dashed area.`,
  gridWindowLabel: 'Area visible in the grid',
  gridPosX: 'Horizontal position',
  gridPosY: 'Vertical position',
  panoramaTitle: 'Continuous carousel',
  panoramaHint: 'One wide image runs across several slides. Each slide exports at its exact width.',
  panoramaChooseImage: 'Choose panoramic image',
  panoramaCount: 'Number of slides',
  panoramaSlidesNote: (count) => `${count} slides, each 1080 px wide.`,
  panoramaNeedsImage: 'Choose an image to build the continuous carousel.',
  reelTitle: 'Reel cover',
  reelHint: 'Pick a frame from the video or import an image as the cover.',
  reelNeedsOneVideo: 'For Reel mode, keep only one video in the editor.',
  reelScrub: 'Video frame',
  reelUseFrame: 'Use this frame as cover',
  reelImportCover: 'Import image as cover',
  reelRemoveCover: 'Remove custom cover',
  reelAutoCover: 'Automatic cover (start of the video)',
  reelCoverCompare: 'How the cover appears',
  compareFeed: 'Feed (4:5)',
  compareGrid: 'Profile grid (3:4)',
  compareReel: 'Reel (9:16)',
  detailsTitle: 'Caption and profile',
  profileTitle: 'Profile',
  avatar: 'Profile photo',
  avatarHint: 'Optional. Without a photo, the preview uses an initial.',
  username: 'Username',
  displayName: 'Display name',
  bio: 'Bio',
  location: 'Location',
  tagsLabel: 'Simulated tags',
  tagsHint: 'Separate with commas. Example: @ana, @bruno',
  captionLabel: 'Caption',
  captionHint: 'Use #hashtags and @mentions. They are highlighted in the preview.',
  emojis: 'Emojis',
  captionCount: (count, limit) => `${count} / ${limit} characters`,
  captionNearLimit: 'Close to the 2,200 character limit.',
  hideLikes: 'Hide like count in the preview',
  metricsTitle: 'Fictional metrics',
  likesCount: 'Likes (fictional)',
  commentsCount: 'Comments (fictional)',
  finalize: 'Finish simulation',
  finalizeNote: 'Opens the feed preview with your post. Nothing is sent.',
  exportTitle: 'Export',
  exportFormat: 'File format',
  formatJpeg: 'JPEG (smaller)',
  formatPng: 'PNG (lossless)',
  downloadSlide: 'Download slide',
  downloadAll: 'Download all as ZIP',
  downloadVideo: 'Download original video',
  downloadCover: 'Download cover',
  exportSize: (width, height) => `${width} × ${height} px`,
  exportNote: 'Export only creates the cropped image with the adjustments applied. Frames, guides and controls are not included in the file.',
  exportEmpty: 'Add media to export.',
  exportPreparing: 'Generating files…',
  previewTitle: 'iPhone preview',
  viewFeed: 'Feed',
  viewProfile: 'Profile',
  viewReels: 'Reels',
  themeLabel: 'Appearance',
  themeLight: 'Light',
  themeDark: 'Dark',
  deviceLabel: 'Device',
  frameToggle: 'Frame',
  contextToggle: 'Example feed',
  guidesToggle: 'Reel guides',
  statusTimeLabel: 'Status bar time',
  showPreviewMobile: 'View preview',
  showEditorMobile: 'View editor',
  reelEmpty: 'Choose a video and the Reel type to see this preview.',
  profileEmpty: 'Your post appears here in the grid.',
  phone: {
    timeAgo: 'JUST NOW',
    likeLabel: 'Like',
    commentLabel: 'Comment',
    shareLabel: 'Share (simulation)',
    saveLabel: 'Save',
    unsaveLabel: 'Remove from saved',
    unlikeLabel: 'Unlike',
    moreLabel: 'More options',
    moreCaption: 'more',
    likedBy: (name, others) => `Liked by ${name} and ${others} others`,
    likesHidden: 'Like count hidden',
    likesLabel: (count) => `${count.toLocaleString('en-US')} likes`,
    viewComments: (count) => `View all ${count} comments`,
    commentsTitle: 'Comments',
    commentPlaceholder: 'Add a comment…',
    addComment: 'Post',
    simulatedComment: 'Comment exists only in this simulation.',
    closeSheet: 'Close',
    sharedNote: 'Simulation: nothing was sent to Instagram.',
    optionsTitle: 'Options',
    optionEdit: 'Edit post',
    optionCancel: 'Cancel',
    carouselCounter: (index, total) => `${index}/${total}`,
    prevSlide: 'Previous slide',
    nextSlide: 'Next slide',
    playVideo: 'Play video',
    pauseVideo: 'Pause video',
    mute: 'Mute',
    unmute: 'Unmute',
    follow: 'Follow',
    audio: 'Original audio',
    tabHome: 'Home',
    tabSearch: 'Search',
    tabReels: 'Reels',
    tabShop: 'Shop',
    tabProfile: 'Profile',
    navTitle: 'Instagram',
    stories: 'Stories',
    yourStory: 'Your story',
    postsCount: 'posts',
    followers: 'followers',
    following: 'following',
    editProfile: 'Edit profile',
    shareProfile: 'Share profile',
    gridTab: 'Posts',
    reelsTab: 'Reels',
    taggedTab: 'Tagged',
    carouselIcon: 'Carousel',
    reelIcon: 'Reel',
    videoIcon: 'Video',
    yourPost: 'Your post',
    tagsLine: (names) => `With ${names}`,
    reelLocked: 'Reel',
  },
  demoPosts: {
    'demo-1': {
      caption: 'Day of dunes and lagoons. Who has dreamed of this place too? ✨ #travel #coast',
      time: '2 HOURS',
      comments: [
        { user: 'mari.fotos', text: 'What an incredible color!' },
        { user: 'joao.trails', text: 'I need to go there 😍' },
      ],
    },
    'demo-2': {
      caption: 'Coffee brewed fresh and an afternoon asking for quiet.',
      time: '5 HOURS',
      comments: [{ user: 'lu.cafe', text: 'Perfect for this hour ☕' }],
    },
    'demo-3': {
      caption: 'Studio at night, lit only by the desk lamp.',
      time: '1 DAY',
      comments: [{ user: 'ana.design', text: 'This palette turned out really good' }],
    },
    'demo-4': {
      caption: 'Three shapes, one idea. For the next visual identity project.',
      time: '2 DAYS',
      comments: [
        { user: 'bruno.ux', text: 'Really clean!' },
        { user: 'carla.arte', text: 'Saved for reference' },
      ],
    },
  },
  defaults: {
    username: 'your.profile',
    displayName: 'Your name',
    bio: 'Write your bio here. It appears at the top of the profile.',
    caption: 'Write your post caption here. #simulation',
  },
};

const es: SimulatorCopy = {
  simulationNotice: 'Simulación local: no se publica nada y no se accede a ninguna cuenta.',
  unofficial: 'Herramienta independiente, sin afiliación con Meta ni Instagram.',
  steps: { media: 'Medios', edit: 'Editar', details: 'Pie y perfil', exportStep: 'Exportar' },
  back: 'Volver',
  next: 'Continuar',
  mediaTitle: 'Elige fotos y videos',
  mediaHint: 'Hasta 20 elementos por carrusel. Los archivos se quedan en este navegador.',
  dropzoneLabel: 'Arrastra fotos o videos aquí',
  dropzoneHint: 'JPG, PNG, WebP, HEIC (si tu navegador lo abre), MP4 o MOV (si tu navegador lo reproduce).',
  examples: 'Probar un ejemplo',
  examplesHint: 'Genera tres imágenes de demostración en tu navegador.',
  clearAll: 'Quitar todo',
  slidesCount: (count, limit) => `${count} de ${limit} elementos`,
  processing: (done, total) => `Procesando ${done} de ${total}…`,
  rejectedFiles: (count) => `${count} archivo(s) no se pudieron usar.`,
  limitReached: (limit) => `El carrusel admite como máximo ${limit} elementos.`,
  errors: {
    unsupported_format: 'Formato no compatible. Usa una foto o video que tu navegador pueda manejar.',
    file_too_large: 'Este archivo es demasiado grande para esta herramienta.',
    decode_failed: 'No se pudo abrir este archivo en este navegador. Prueba guardarlo como JPEG o MP4.',
    too_many_pixels: 'Esta foto tiene demasiados píxeles. Reduce su tamaño e inténtalo de nuevo.',
    export_failed: 'No se pudo generar el archivo. Inténtalo de nuevo.',
  },
  selectedBadge: 'Orden',
  remove: 'Quitar',
  moveLeft: 'Mover antes',
  moveRight: 'Mover después',
  dragHint: 'Arrastra las tarjetas con el ratón o usa los botones de mover, que funcionan con toque y teclado.',
  editTitle: 'Formato y edición',
  postTypeLabel: 'Tipo de publicación',
  postTypes: { post: 'Foto o carrusel', panorama: 'Carrusel continuo', reel: 'Reel' },
  postTypeHints: {
    post: 'Una foto o hasta 20 elementos. Todos usan el mismo formato.',
    panorama: 'Una imagen ancha dividida en slides uno al lado del otro.',
    reel: 'Un video vertical 9:16. Tú eliges la portada.',
  },
  aspectLabel: 'Formato del feed',
  aspectHelp: 'El formato vale para todos los slides. Cada slide mantiene su propio encuadre.',
  aspectNames: { '1:1': 'Cuadrado 1:1', '4:5': 'Vertical 4:5', '3:4': 'Vertical 3:4', '1.91:1': 'Horizontal 1,91:1' },
  slideLabel: (index) => `Slide ${index}`,
  activeSlideLabel: 'Slide en edición',
  kindPhoto: 'Foto',
  kindVideo: 'Video',
  fitLabel: 'Encuadre',
  fill: 'Rellenar',
  fit: 'Ajustar',
  zoomLabel: 'Zoom',
  panLabel: 'Arrastra la imagen para reposicionarla. Usa pellizco en el celular.',
  resetCrop: 'Restaurar encuadre',
  cutAreaHint: 'La parte oscura de la imagen queda fuera del marco y no aparece en la publicación.',
  videoPreviewNote: 'Los videos usan este encuadre solo en la vista previa. La descarga entrega el archivo original, sin recortes.',
  altTextLabel: 'Texto alternativo',
  altTextHint: 'Describe la imagen para personas que usan lector de pantalla.',
  filtersTitle: 'Ajustes visuales',
  presets: { original: 'Original', vivid: 'Vívido', soft: 'Suave', mono: 'Blanco y negro', contrast: 'Contraste' },
  brightness: 'Brillo',
  contrast: 'Contraste',
  saturation: 'Saturación',
  applyFiltersToAll: 'Aplicar a todos los slides',
  gridTitle: 'Portada en la cuadrícula del perfil',
  gridHint: 'La cuadrícula del perfil muestra un área 3:4 de la publicación. Ajusta la posición sin cambiar la publicación.',
  gridCutWarning: (percent) => `Cerca del ${percent}% de la imagen queda fuera de la cuadrícula. Revisa los bordes del área punteada.`,
  gridWindowLabel: 'Área visible en la cuadrícula',
  gridPosX: 'Posición horizontal',
  gridPosY: 'Posición vertical',
  panoramaTitle: 'Carrusel continuo',
  panoramaHint: 'Una imagen ancha atraviesa varios slides. Cada slide se exporta con su ancho exacto.',
  panoramaChooseImage: 'Elegir imagen panorámica',
  panoramaCount: 'Cantidad de slides',
  panoramaSlidesNote: (count) => `${count} slides, cada uno de 1080 px de ancho.`,
  panoramaNeedsImage: 'Elige una imagen para crear el carrusel continuo.',
  reelTitle: 'Portada del Reel',
  reelHint: 'Elige un cuadro del video o importa una imagen como portada.',
  reelNeedsOneVideo: 'Para el modo Reel, deja solo un video en el editor.',
  reelScrub: 'Cuadro del video',
  reelUseFrame: 'Usar este cuadro como portada',
  reelImportCover: 'Importar imagen como portada',
  reelRemoveCover: 'Quitar portada personalizada',
  reelAutoCover: 'Portada automática (inicio del video)',
  reelCoverCompare: 'Cómo se ve la portada',
  compareFeed: 'Feed (4:5)',
  compareGrid: 'Cuadrícula del perfil (3:4)',
  compareReel: 'Reel (9:16)',
  detailsTitle: 'Pie y perfil',
  profileTitle: 'Perfil',
  avatar: 'Foto de perfil',
  avatarHint: 'Opcional. Sin foto, la vista previa usa una inicial.',
  username: 'Nombre de usuario',
  displayName: 'Nombre visible',
  bio: 'Bio',
  location: 'Ubicación',
  tagsLabel: 'Etiquetas simuladas',
  tagsHint: 'Sepáralas con comas. Ej.: @ana, @bruno',
  captionLabel: 'Pie de foto',
  captionHint: 'Usa #hashtags y @menciones. Se destacan en la vista previa.',
  emojis: 'Emojis',
  captionCount: (count, limit) => `${count} / ${limit} caracteres`,
  captionNearLimit: 'Cerca del límite de 2.200 caracteres.',
  hideLikes: 'Ocultar el conteo de me gusta en la vista previa',
  metricsTitle: 'Métricas ficticias',
  likesCount: 'Me gusta (ficticios)',
  commentsCount: 'Comentarios (ficticios)',
  finalize: 'Finalizar simulación',
  finalizeNote: 'Abre la vista previa del feed con tu publicación. No se envía nada.',
  exportTitle: 'Exportar',
  exportFormat: 'Formato del archivo',
  formatJpeg: 'JPEG (más liviano)',
  formatPng: 'PNG (sin pérdida)',
  downloadSlide: 'Descargar slide',
  downloadAll: 'Descargar todo en ZIP',
  downloadVideo: 'Descargar video original',
  downloadCover: 'Descargar portada',
  exportSize: (width, height) => `${width} × ${height} px`,
  exportNote: 'La exportación solo genera la imagen recortada con los ajustes aplicados. Marcos, guías y controles no entran en el archivo.',
  exportEmpty: 'Agrega medios para exportar.',
  exportPreparing: 'Generando archivos…',
  previewTitle: 'Vista previa en iPhone',
  viewFeed: 'Feed',
  viewProfile: 'Perfil',
  viewReels: 'Reels',
  themeLabel: 'Apariencia',
  themeLight: 'Claro',
  themeDark: 'Oscuro',
  deviceLabel: 'Dispositivo',
  frameToggle: 'Marco',
  contextToggle: 'Feed de ejemplo',
  guidesToggle: 'Guías del Reel',
  statusTimeLabel: 'Hora en la barra de estado',
  showPreviewMobile: 'Ver vista previa',
  showEditorMobile: 'Ver editor',
  reelEmpty: 'Elige un video y el tipo Reel para ver esta vista previa.',
  profileEmpty: 'Tu publicación aparece aquí en la cuadrícula.',
  phone: {
    timeAgo: 'AHORA',
    likeLabel: 'Me gusta',
    commentLabel: 'Comentar',
    shareLabel: 'Compartir (simulación)',
    saveLabel: 'Guardar',
    unsaveLabel: 'Quitar de guardados',
    unlikeLabel: 'Quitar me gusta',
    moreLabel: 'Más opciones',
    moreCaption: 'más',
    likedBy: (name, others) => `Le gusta a ${name} y a otras ${others} personas`,
    likesHidden: 'Conteo de me gusta oculto',
    likesLabel: (count) => `${count.toLocaleString('es-ES')} me gusta`,
    viewComments: (count) => `Ver los ${count} comentarios`,
    commentsTitle: 'Comentarios',
    commentPlaceholder: 'Añadir un comentario…',
    addComment: 'Publicar',
    simulatedComment: 'El comentario existe solo en esta simulación.',
    closeSheet: 'Cerrar',
    sharedNote: 'Simulación: no se envió nada a Instagram.',
    optionsTitle: 'Opciones',
    optionEdit: 'Editar publicación',
    optionCancel: 'Cancelar',
    carouselCounter: (index, total) => `${index}/${total}`,
    prevSlide: 'Slide anterior',
    nextSlide: 'Slide siguiente',
    playVideo: 'Reproducir video',
    pauseVideo: 'Pausar video',
    mute: 'Silenciar',
    unmute: 'Activar sonido',
    follow: 'Seguir',
    audio: 'Audio original',
    tabHome: 'Inicio',
    tabSearch: 'Buscar',
    tabReels: 'Reels',
    tabShop: 'Tienda',
    tabProfile: 'Perfil',
    navTitle: 'Instagram',
    stories: 'Historias',
    yourStory: 'Tu historia',
    postsCount: 'publicaciones',
    followers: 'seguidores',
    following: 'seguidos',
    editProfile: 'Editar perfil',
    shareProfile: 'Compartir perfil',
    gridTab: 'Publicaciones',
    reelsTab: 'Reels',
    taggedTab: 'Etiquetadas',
    carouselIcon: 'Carrusel',
    reelIcon: 'Reel',
    videoIcon: 'Video',
    yourPost: 'Tu publicación',
    tagsLine: (names) => `Con ${names}`,
    reelLocked: 'Reel',
  },
  demoPosts: {
    'demo-1': {
      caption: 'Día de dunas y lagunas. ¿Quién más soñó con este lugar? ✨ #viaje #costa',
      time: 'HACE 2 HORAS',
      comments: [
        { user: 'mari.fotos', text: '¡Qué color increíble!' },
        { user: 'joao.trilhas', text: 'Tengo que ir allí 😍' },
      ],
    },
    'demo-2': {
      caption: 'Café recién hecho y una tarde pidiendo silencio.',
      time: 'HACE 5 HORAS',
      comments: [{ user: 'lu.cafe', text: 'Perfecto para esta hora ☕' }],
    },
    'demo-3': {
      caption: 'Estudio de noche, iluminado solo por la lámpara del escritorio.',
      time: 'HACE 1 DÍA',
      comments: [{ user: 'ana.design', text: 'Esta paleta quedó muy bien' }],
    },
    'demo-4': {
      caption: 'Tres formas, una idea. Para el próximo proyecto de identidad visual.',
      time: 'HACE 2 DÍAS',
      comments: [
        { user: 'bruno.ux', text: '¡Muy limpio!' },
        { user: 'carla.arte', text: 'Guardado como referencia' },
      ],
    },
  },
  defaults: {
    username: 'tu.perfil',
    displayName: 'Tu nombre',
    bio: 'Escribe tu bio aquí. Aparece en la parte superior del perfil.',
    caption: 'Escribe el pie de tu publicación aquí. #simulacion',
  },
};

const copyByLocale: Record<AppLocale, SimulatorCopy> = {
  'pt-br': ptBr,
  en,
  es,
  // Chinês ainda não tem tradução desta ferramenta: usa o inglês com aviso do rollout.
  zh: en,
};

export const getSimulatorCopy = (locale: AppLocale): SimulatorCopy => copyByLocale[locale];
