/**
 * Canonical, locale-independent tool identifiers used for analytics tracking.
 *
 * These map 1:1 to the `id` values in `data/tools-registry.ts`,
 * `data/content/front-only-tool-suite.ts` and `data/cs2/tools.ts`, just
 * normalized from kebab-case to snake_case. They must stay stable across
 * renames/translations of the tool's display name so that GA4/GTM can
 * aggregate the same tool across `pt-br`, `en` and `es`.
 *
 * When adding a new tool, add its id here (see AGENTS.md "Analytics").
 */
export const TOOL_ID = {
  // data/tools-registry.ts
  bitcoinWallet: 'bitcoin_wallet',
  cryptoUnitConverter: 'crypto_unit_converter',
  htmlViewer: 'html_viewer',
  markdownEditor: 'markdown_editor',
  jsonFormatter: 'json_formatter',
  csvViewer: 'csv_viewer',
  dataConverter: 'data_converter',
  textDiff: 'text_diff',
  openGraphPreview: 'open_graph_preview',
  cpfGenerator: 'cpf_generator',
  fakePersonGenerator: 'gerador_pessoa_fake',
  passwordGenerator: 'password_generator',
  base64ImageViewer: 'base64_image_viewer',
  imageToBase64: 'image_to_base64',
  imageConverter: 'image_converter',
  imageCompression: 'image_compression',
  chromaBackgroundRemover: 'remover_fundo_imagem',
  videoCompression: 'video_compression',
  audioExtractor: 'extrair_audio_de_video',
  qrCodeGenerator: 'qr_code_generator',
  transfer: 'transfer',
  whatsappTelegramLinkGenerator: 'gerador_link_whatsapp_telegram',
  sorteador: 'sorteador',
  characterCounter: 'contador_de_caracteres',
  jwtDecoder: 'jwt_decoder',
  regexTester: 'regex_tester',
  uuidNanoidGenerator: 'gerador_de_uuid_e_nanoid',
  unixTimestampConverter: 'conversor_unix_timestamp',
  urlEncoderDecoder: 'url_encoder_decoder',
  slugGenerator: 'gerador_de_slug',
  removeAccents: 'remover_acentos',
  universalConverter: 'conversor_universal',
  compoundInterest: 'calculadora_juros_compostos',
  invisibleCharacter: 'invisible_character',
  nicknameSymbolGenerator: 'nickname_symbol_generator',
  symbolsToCopy: 'symbols_to_copy',
  multiplicationTableQuiz: 'multiplication_table_quiz',
  keyboardShortcuts: 'keyboard_shortcuts',
  gamerUsernameGenerator: 'gamer_username_generator',
  cs2CrosshairCodes: 'cs2_crosshair_codes',
  gtaCheatCodes: 'gta_cheat_codes',
  ipDiscovery: 'descobrir_ip_publico',
  tempEmail: 'email_temporario',
  cssGenerator: 'css_generator',
  colorConverter: 'color_converter',
  imageColorExtractor: 'image_color_extractor',
  lightningDecoder: 'lightning_decoder',
  pixDecoder: 'pix_decoder',
  codeConverter: 'code_converter',

  // data/content/front-only-tool-suite.ts
  cnpjGenerator: 'gerador_cnpj',
  boletoValidator: 'validar_boleto',
  fileChecksum: 'file_checksum',
  exifViewer: 'exif_viewer',
  imageResizeCrop: 'redimensionar_imagem',
  pdfOrganizer: 'pdf_organizer',
  faviconGenerator: 'favicon_generator',
  qrCodeScanner: 'qr_code_scanner',
  qrPayloadGenerator: 'qr_code_wifi_vcard_evento',
  jsonToTypescript: 'json_para_typescript',
  cronGenerator: 'cron_generator',
  gzipDeflateZip: 'gzip_deflate_zip',
  dnsLookup: 'dns_lookup',
  bitcoinFeeCalculator: 'bitcoin_fee_calculator',
  bitcoinAddressTxDecoder: 'bitcoin_address_tx_decoder',
  sqlFormatter: 'sql_formatter',

  // data/cs2/tools.ts (Cs2ToolId)
  cs2PracticeCommands: 'cs2_practice_commands',
  cs2PracticeConfig: 'cs2_practice_config',
  cs2GrenadePracticeCommands: 'cs2_grenade_practice_commands',
  cs2SmokePracticeCommands: 'cs2_smoke_practice_commands',
  cs2BotCommands: 'cs2_bot_commands',
  cs2RadarSettings: 'cs2_radar_settings',
  cs2HudCommands: 'cs2_hud_commands',
  cs2HudColor: 'cs2_hud_color',
  cs2ViewmodelGenerator: 'cs2_viewmodel_generator',
  cs2FpsCommands: 'cs2_fps_commands',
  cs2AutoexecGenerator: 'cs2_autoexec_generator',
  cs2CompetitiveConfig: 'cs2_competitive_config',
  cs2TournamentSafeConfig: 'cs2_tournament_safe_config',
  cs2FunCommands: 'cs2_fun_commands',
} as const satisfies Record<string, string>;

export type ToolId = (typeof TOOL_ID)[keyof typeof TOOL_ID];

const KNOWN_TOOL_IDS = new Set<string>(Object.values(TOOL_ID));

export const isKnownToolId = (value: string): value is ToolId => KNOWN_TOOL_IDS.has(value);

/**
 * Normalizes any registry-style kebab-case tool id (e.g. `tool.id` coming
 * from `ToolDefinition`, `Cs2ToolId` or `FrontOnlyToolId`) into the
 * snake_case `ToolId` used in analytics events. Falls back to a plain
 * snake_case conversion for ids not yet listed in `TOOL_ID` so tracking
 * never throws for a tool that was just added.
 */
export const toToolId = (registryId: string): ToolId => {
  const normalized = registryId.trim().replace(/-/g, '_');
  return normalized as ToolId;
};
