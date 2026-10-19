'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Copy,
  Download,
  FileJson,
  FileText,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AppLocale } from '@/lib/i18n/config';
import {
  buildPixPayload,
  fixCrc,
  formatKeyForPayload,
  getPixExamples,
  parseEmvFields,
  pixToCsv,
  pixToJson,
  validatePixPayload,
  verifyCrc,
  type EmvField,
  type PixData,
  type PixGeneratorInput,
  type PixGeneratorResult,
  type PixKeyType,
  type PixValidationResult,
} from '@/lib/pix-emv';
import { trackEvent, TOOL_ID } from '@/lib/analytics';

// ---------- TYPES ----------

type Tab = 'generate' | 'validate' | 'decoder' | 'tree' | 'qrcode' | 'crc' | 'export';
type PixGenerationMode = 'static' | 'dynamic';

type PixDecoderToolProps = Readonly<{
  locale?: AppLocale;
  initialTab?: Tab;
}>;

// ---------- LABELS ----------

const ui: Record<string, Record<AppLocale, string>> = {
  tabGenerate: { 'pt-br': 'Gerar Pix', en: 'Generate Pix', es: 'Generar Pix', zh: '生成 Pix' },
  tabValidate: { 'pt-br': 'Validar', en: 'Validate', es: 'Validar', zh: '校验' },
  tabDecoder: { 'pt-br': 'Decoder', en: 'Decoder', es: 'Decoder', zh: '解析器' },
  tabTree: { 'pt-br': 'Árvore EMV', en: 'EMV Tree', es: 'Árbol EMV', zh: 'EMV 字段树' },
  tabQr: { 'pt-br': 'QR Code', en: 'QR Code', es: 'QR Code', zh: '二维码' },
  tabCrc: { 'pt-br': 'CRC16', en: 'CRC16', es: 'CRC16', zh: 'CRC16 校验' },
  tabExport: { 'pt-br': 'Exportar', en: 'Export', es: 'Exportar', zh: '导出' },
  pixMode: { 'pt-br': 'Tipo de Pix', en: 'Pix type', es: 'Tipo de Pix', zh: 'Pix 类型' },
  staticMode: { 'pt-br': 'Estático', en: 'Static', es: 'Estático', zh: '静态' },
  dynamicMode: { 'pt-br': 'Dinâmico', en: 'Dynamic', es: 'Dinámico', zh: '动态' },
  keyType: { 'pt-br': 'Tipo de chave', en: 'Key type', es: 'Tipo de clave', zh: '密钥类型' },
  key: { 'pt-br': 'Chave Pix', en: 'Pix Key', es: 'Clave Pix', zh: 'Pix 密钥' },
  dynamicUrl: { 'pt-br': 'URL/location do Pix dinâmico', en: 'Dynamic Pix URL/location', es: 'URL/location de Pix dinámico', zh: '动态 Pix 地址' },
  dynamicUrlHelp: {
    'pt-br': 'Use o domínio/caminho fornecido pelo PSP. Se colar com https://, a ferramenta remove o protocolo.',
    en: 'Use the domain/path provided by the PSP. If you paste https://, the tool removes the protocol.',
    es: 'Usa el dominio/ruta provisto por el PSP. Si pegas https://, la herramienta quita el protocolo.',
    zh: '填写支付服务提供商（PSP）提供的域名或路径。粘贴 https:// 地址时，工具会自动移除协议前缀。',
  },
  name: { 'pt-br': 'Nome do recebedor', en: 'Recipient name', es: 'Nombre del receptor',
  zh: '收款人姓名', },
  city: { 'pt-br': 'Cidade', en: 'City', es: 'Ciudad',
  zh: '城市', },
  maxAbbr: { 'pt-br': 'máx.', en: 'max.', es: 'máx.',
  zh: '最多', },
  amount: { 'pt-br': 'Valor (R$)', en: 'Amount (BRL)', es: 'Valor (BRL)',
  zh: '金额（巴西雷亚尔）', },
  txid: { 'pt-br': 'TXID (opcional)', en: 'TXID (optional)', es: 'TXID (opcional)',
  zh: '交易编号 TXID（可选）', },
  additionalInfo: { 'pt-br': 'Info adicional', en: 'Additional info', es: 'Info adicional',
  zh: '附加信息', },
  generate: { 'pt-br': 'Gerar Pix Copia e Cola', en: 'Generate Pix Copy & Paste', es: 'Generar Pix Copia y Pega',
  zh: '生成 Pix 付款码', },
  reset: { 'pt-br': 'Resetar', en: 'Reset', es: 'Resetear',
  zh: '重置', },
  loadExample: { 'pt-br': 'Carregar exemplo', en: 'Load example', es: 'Cargar ejemplo',
  zh: '加载示例', },
  copy: { 'pt-br': 'Copiar', en: 'Copy', es: 'Copiar',
  zh: '复制', },
  copied: { 'pt-br': 'Copiado!', en: 'Copied!', es: '¡Copiado!',
  zh: '已复制', },
  download: { 'pt-br': 'Baixar', en: 'Download', es: 'Descargar',
  zh: '下载', },
  payload: { 'pt-br': 'Pix Copia e Cola', en: 'Pix Copy & Paste', es: 'Pix Copia y Pega',
  zh: 'Pix 付款码文本', },
  pastePayload: { 'pt-br': 'Cole o Pix Copia e Cola aqui', en: 'Paste Pix Copy & Paste here', es: 'Pegue el Pix Copia y Pega aquí',
  zh: '在此粘贴 Pix 付款码文本', },
  validate: { 'pt-br': 'Validar', en: 'Validate', es: 'Validar',
  zh: '开始校验', },
  valid: { 'pt-br': 'Válido', en: 'Valid', es: 'Válido',
  zh: '有效', },
  validWarnings: { 'pt-br': 'Válido com avisos', en: 'Valid with warnings', es: 'Válido con avisos',
  zh: '有效，但有提醒', },
  invalid: { 'pt-br': 'Inválido', en: 'Invalid', es: 'Inválido',
  zh: '无效', },
  crcInvalid: { 'pt-br': 'CRC inválido', en: 'Invalid CRC', es: 'CRC inválido',
  zh: 'CRC 无效', },
  notPix: { 'pt-br': 'Não parece Pix', en: 'Not a Pix payload', es: 'No parece Pix',
  zh: '不是 Pix 付款码', },
  static: { 'pt-br': 'Pix Estático', en: 'Static Pix', es: 'Pix Estático',
  zh: '静态 Pix', },
  dynamic: { 'pt-br': 'Pix Dinâmico', en: 'Dynamic Pix', es: 'Pix Dinámico',
  zh: '动态 Pix', },
  unknown: { 'pt-br': 'Desconhecido', en: 'Unknown', es: 'Desconocido',
  zh: '未知', },
  pixData: { 'pt-br': 'Dados Pix extraídos', en: 'Extracted Pix data', es: 'Datos Pix extraídos',
  zh: '提取的 Pix 信息', },
  fixCrc: { 'pt-br': 'Corrigir CRC', en: 'Fix CRC', es: 'Corregir CRC',
  zh: '修复 CRC', },
  crcOriginal: { 'pt-br': 'CRC original', en: 'Original CRC', es: 'CRC original',
  zh: '原始 CRC', },
  crcCalculated: { 'pt-br': 'CRC calculado', en: 'Calculated CRC', es: 'CRC calculado',
  zh: '计算所得 CRC', },
  crcStatus: { 'pt-br': 'Status', en: 'Status', es: 'Estado',
  zh: '状态', },
  fixedPayload: { 'pt-br': 'Payload corrigido', en: 'Fixed payload', es: 'Payload corregido',
  zh: '已修复的付款码文本', },
  qrSize: { 'pt-br': 'Tamanho do QR', en: 'QR size', es: 'Tamaño del QR',
  zh: '二维码尺寸', },
  qrColor: { 'pt-br': 'Cor do QR', en: 'QR color', es: 'Color del QR',
  zh: '二维码颜色', },
  qrBg: { 'pt-br': 'Cor de fundo', en: 'Background', es: 'Color de fondo',
  zh: '背景颜色', },
  downloadPng: { 'pt-br': 'Baixar PNG', en: 'Download PNG', es: 'Descargar PNG',
  zh: '下载 PNG', },
  downloadSvg: { 'pt-br': 'Baixar SVG', en: 'Download SVG', es: 'Descargar SVG',
  zh: '下载 SVG', },
  exportJson: { 'pt-br': 'Exportar JSON', en: 'Export JSON', es: 'Exportar JSON',
  zh: '导出 JSON', },
  exportCsv: { 'pt-br': 'Exportar CSV', en: 'Export CSV', es: 'Exportar CSV',
  zh: '导出 CSV', },
  exportTxt: { 'pt-br': 'Exportar TXT', en: 'Export TXT', es: 'Exportar TXT',
  zh: '导出 TXT', },
  openValidation: { 'pt-br': 'Abrir validação', en: 'Open validation', es: 'Abrir validación',
  zh: '查看校验结果', },
  openQrCode: { 'pt-br': 'Abrir QR Code', en: 'Open QR Code', es: 'Abrir QR Code',
  zh: '查看二维码', },
  syncedPayload: {
    'pt-br': 'Payload sincronizado com validação, decoder, árvore, CRC, exportação e QR Code.',
    en: 'Payload synced with validation, decoder, tree, CRC, export, and QR Code.',
    es: 'Payload sincronizado con validación, decoder, árbol, CRC, exportación y QR Code.',
    zh: '付款码文本已同步到校验、解析、字段树、CRC、导出和二维码页面。',
  },
  privacy: { 'pt-br': 'Processamento 100% local. Nenhum dado é enviado ao servidor.', en: '100% local processing. No data is sent to any server.', es: 'Procesamiento 100% local. Ningún dato se envía al servidor.',
  zh: '所有处理均在本地完成。数据不会发送到服务器。', },
  securityWarning: { 'pt-br': 'CRC válido não garante que o recebedor é confiável. Confira sempre no app do banco.', en: 'A valid CRC does not mean the recipient is trustworthy. Always verify in your banking app.', es: 'CRC válido no garantiza que el receptor es confiable. Verifica siempre en tu app bancaria.',
  zh: 'CRC 校验通过不代表收款方可信。付款前请务必在银行应用中核对信息。', },
  examples: { 'pt-br': 'Exemplos', en: 'Examples', es: 'Ejemplos', zh: '示例' },
  legend: { 'pt-br': 'Legenda', en: 'Legend', es: 'Leyenda', zh: '字段分类' },
  cpf: { 'pt-br': 'CPF', en: 'CPF', es: 'CPF',
  zh: 'CPF', },
  cnpj: { 'pt-br': 'CNPJ', en: 'CNPJ', es: 'CNPJ',
  zh: 'CNPJ', },
  email: { 'pt-br': 'E-mail', en: 'Email', es: 'E-mail',
  zh: '邮箱', },
  phone: { 'pt-br': 'Telefone', en: 'Phone', es: 'Teléfono',
  zh: '电话号码', },
  random: { 'pt-br': 'Chave aleatória', en: 'Random key', es: 'Clave aleatoria',
  zh: '随机密钥', },
  manual: { 'pt-br': 'Manual/outro', en: 'Manual/other', es: 'Manual/otro',
  zh: '手动/其他', },
};

function t(key: string, locale: AppLocale): string {
  return ui[key]?.[locale] ?? ui[key]?.['pt-br'] ?? key;
}

// ---------- ANALYTICS HELPERS ----------
// Map internal, non-sensitive identifiers (copy keys, validation status, file
// extensions) to the categorical values used in trackEvent params. None of
// these ever carry the actual payload/field value the user typed or pasted.

/** Maps a `copyToClipboard` `key` argument to a generic `field` label. */
function resolveCopyField(key: string): string {
  if (key.startsWith('field-')) return 'field_value';
  if (key.startsWith('tree-')) return 'tree_value';
  switch (key) {
    case 'gen-payload':
    case 'validate-payload':
    case 'export-payload':
      return 'pix_payload';
    case 'qr-payload':
      return 'qr_payload';
    case 'fixed-payload':
      return 'fixed_payload';
    case 'export-json':
      return 'export_json';
    default:
      return 'unknown';
  }
}

/** Maps a downloaded filename to a generic `format` label (e.g. "txt", "json"). */
function resolveDownloadFormat(filename: string): string {
  const ext = filename.split('.').pop();
  return ext ? ext.toLowerCase() : 'unknown';
}

/** Maps a `PixValidationResult['status']` to a normalized `error_type`. */
function resolveValidationErrorType(status: PixValidationResult['status']): string {
  if (status === 'crc-invalid') return 'crc_invalid';
  if (status === 'not-pix') return 'not_pix';
  return 'invalid_pix';
}

// ---------- FIELD CATEGORY COLORS ----------

const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  emv: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'EMV básico' },
  pix: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pix' },
  merchant: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Recebedor' },
  additional: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Dados adicionais' },
  crc: { bg: 'bg-red-100', text: 'text-red-800', label: 'CRC' },
  unknown: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Desconhecido' },
};

const CATEGORY_LABELS_ZH: Record<string, string> = {
  emv: 'EMV 基础字段',
  pix: 'Pix 信息',
  merchant: '商户信息',
  additional: '附加数据',
  crc: 'CRC 校验',
  unknown: '未分类',
};

const PIX_FIELD_TRANSLATIONS_ZH: Record<string, Pick<EmvField, 'name' | 'description'>> = {
  '00': { name: '载荷格式指示符', description: '载荷格式版本，应为 "01"。' },
  '01': { name: '发起方式', description: '11 表示静态（可重复使用），12 表示动态（单次使用）。' },
  '26': { name: '商户账户信息', description: '包含 Pix 收款账户信息。' },
  '27': { name: '备用商户账户信息', description: '备用收款账户信息。' },
  '52': { name: '商户类别代码', description: '商户的 MCC 代码；"0000" 表示通用类别。' },
  '53': { name: '交易货币代码', description: 'ISO 4217 货币代码；"986" 表示巴西雷亚尔（BRL）。' },
  '54': { name: '交易金额', description: '付款金额；缺省时由付款人输入。' },
  '55': { name: '小费或服务费标记', description: '说明是否收取小费或服务费。' },
  '56': { name: '固定服务费', description: '固定金额的服务费。' },
  '57': { name: '百分比服务费', description: '按百分比计算的服务费。' },
  '58': { name: '国家/地区代码', description: '收款方所在国家；"BR" 表示巴西。' },
  '59': { name: '收款方名称', description: '收款方名称，最多 25 个字符。' },
  '60': { name: '收款方城市', description: '收款方城市，最多 15 个字符。' },
  '61': { name: '邮政编码', description: '收款方邮政编码。' },
  '62': { name: '附加数据模板', description: '包含 TXID 等附加数据。' },
  '63': { name: 'CRC16 校验值', description: '载荷的 CRC16-CCITT 校验和。' },
  '64': { name: '其他语言的商户信息', description: '以其他语言填写的商户信息。' },
  '65': { name: '未保留模板', description: '未保留用途的模板数据。' },
  '26.00': { name: 'GUI', description: '全局标识符；Pix 使用 "br.gov.bcb.pix"。' },
  '26.01': { name: 'Pix 密钥', description: '收款方 Pix 密钥，可以是 CPF、CNPJ、邮箱、电话或随机密钥。' },
  '26.02': { name: '附加付款信息', description: '付款说明或其他附加信息。' },
  '26.03': { name: '取款服务标识', description: '取款服务促成方标识。' },
  '26.25': { name: '动态付款地址', description: '动态 Pix 的地址，不包含 https:// 协议前缀。' },
  '27.00': { name: 'GUI', description: '全局标识符。' },
  '27.01': { name: '账户密钥', description: '备用收款账户密钥。' },
  '27.02': { name: '附加信息', description: '备用账户的附加付款信息。' },
  '27.25': { name: '动态付款地址', description: '备用账户的动态付款地址。' },
  '62.01': { name: '账单编号', description: '账单或发票编号。' },
  '62.02': { name: '手机号码', description: '手机号码。' },
  '62.03': { name: '商店标识', description: '商店或门店标识。' },
  '62.04': { name: '会员编号', description: '会员或忠诚度计划编号。' },
  '62.05': { name: '交易参考编号（TXID）', description: 'Pix 交易标识符。' },
  '62.06': { name: '客户标识', description: '客户编号或标识。' },
  '62.07': { name: '终端标识', description: '交易终端标识。' },
  '62.08': { name: '交易用途', description: '交易用途说明。' },
  '62.09': { name: '付款人附加信息请求', description: '请求付款人提供的附加数据。' },
  '62.10': { name: '商户税务编号', description: '收款方税务登记编号。' },
};

const localizePixFields = (fields: EmvField[], locale: AppLocale, parentId?: string): EmvField[] =>
  fields.map((field) => {
    const fieldKey = parentId ? `${parentId}.${field.id}` : field.id;
    const translation = locale === 'zh' ? PIX_FIELD_TRANSLATIONS_ZH[fieldKey] : undefined;

    return {
      ...field,
      ...(translation ?? (locale === 'zh'
        ? { name: `EMV 字段 ${field.id}`, description: '此字段包含 BR Code 中的附加信息。' }
        : {})),
      ...(field.children ? { children: localizePixFields(field.children, locale, field.id) } : {}),
    };
  });

const PIX_ISSUE_TRANSLATIONS_ZH: Record<string, string> = {
  'Payload vazio.': '付款码文本为空。',
  'Payload muito curto para ser um BR Code válido.': '文本过短，无法构成有效的 BR Code。',
  'Payload não começa com Payload Format Indicator (0002).': '付款码文本未以 Payload Format Indicator（0002）开头。',
  'Não foi possível parsear campos EMV.': '无法解析 EMV 字段。',
  'Campo 00 (Payload Format Indicator) ausente.': '缺少字段 00（载荷格式指示符）。',
  'GUI "br.gov.bcb.pix" não encontrada. Pode não ser um QR Code Pix.': '未找到 GUI "br.gov.bcb.pix"，这可能不是 Pix 二维码。',
  'Merchant Account Pix contém chave e URL ao mesmo tempo. Use chave para Pix estático ou URL para Pix dinâmico.': 'Pix 账户信息同时包含密钥和地址。静态 Pix 请使用密钥，动态 Pix 请使用地址。',
  'Merchant Account Pix não contém chave (26.01) nem URL dinâmica (26.25).': 'Pix 账户信息缺少密钥（26.01）或动态地址（26.25）。',
  'URL de Pix dinâmico não deve conter protocolo. Use apenas o domínio/caminho, sem https://.': '动态 Pix 地址不应包含协议前缀，请只填写域名或路径，不要包含 https://。',
  'MCC deve conter exatamente 4 dígitos.': 'MCC 必须为 4 位数字。',
  'Moeda deve conter exatamente 3 dígitos ISO 4217.': '货币代码必须是 3 位 ISO 4217 数字代码。',
  'País deve conter exatamente 2 caracteres.': '国家/地区代码必须为 2 个字符。',
  'Valor deve ser numérico, usar ponto decimal opcional com 2 casas e ter no máximo 13 caracteres.': '金额必须为数字，可带两位小数，且最多 13 个字符。',
  'Nome do recebedor excede 25 caracteres.': '收款方名称超过 25 个字符。',
  'Cidade do recebedor excede 15 caracteres.': '收款方城市超过 15 个字符。',
  'Campo CRC16 (63) ausente ou malformado.': '缺少 CRC16 字段（63），或字段格式错误。',
  'CRC deve conter exatamente 4 caracteres hexadecimais.': 'CRC 必须正好包含 4 个十六进制字符。',
  'Campo CRC16 (63) deve ser o último campo do payload.': 'CRC16 字段（63）必须是付款码的最后一个字段。',
  'URL/location é obrigatória para Pix dinâmico.': '动态 Pix 必须填写付款地址。',
  'URL/location muito longa. Use até 77 caracteres para manter o template Pix dentro do limite EMV.': '付款地址过长。请控制在 77 个字符以内，以符合 Pix EMV 模板的长度限制。',
  'O protocolo da URL dinâmica será removido para ficar compatível com BR Code Pix.': '为兼容 Pix BR Code，动态地址中的协议前缀将被移除。',
  'Nome do recebedor é obrigatório.': '必须填写收款方名称。',
  'Nome excede 25 caracteres e será truncado.': '名称超过 25 个字符，将被截断。',
  'Cidade do recebedor é obrigatória.': '必须填写收款方城市。',
  'Cidade excede 15 caracteres e será truncada.': '城市名称超过 15 个字符，将被截断。',
  'Valor deve ser maior que zero.': '金额必须大于零。',
  'TXID deve conter apenas letras e números (máx 25 caracteres).': 'TXID 只能包含字母和数字，最多 25 个字符。',
  'Pix dinâmico usa TXID "***" no payload EMV; o identificador real fica na cobrança do PSP.': '动态 Pix 的 EMV 载荷使用 TXID "***"；实际交易编号保存在 PSP 生成的账单中。',
  'Chave Pix é obrigatória.': '必须填写 Pix 密钥。',
  'CPF inválido.': 'CPF 格式无效。',
  'CNPJ inválido.': 'CNPJ 格式无效。',
  'E-mail inválido.': '邮箱格式无效。',
  'Telefone inválido. Use formato E.164 (+5511999999999).': '电话号码格式无效。请使用 E.164 格式（例如 +5511999999999）。',
  'Chave aleatória não parece UUID válido.': '随机密钥看起来不是有效的 UUID。',
};

const localizePixIssue = (message: string, field: string, locale: AppLocale): string => {
  if (locale !== 'zh') return message;
  const translated = PIX_ISSUE_TRANSLATIONS_ZH[message];
  if (translated) return translated;

  const crcMismatch = message.match(/^CRC inválido\. Informado: ([\da-f]+), calculado: ([\da-f]+)\.$/i);
  if (crcMismatch) return `CRC 校验失败：输入值 ${crcMismatch[1]}，计算值 ${crcMismatch[2]}。`;

  const fieldLengthMismatch = message.match(/^Tamanho declarado \((\d+)\) difere do real \((\d+)\) no campo (.+)\.$/);
  if (fieldLengthMismatch) {
    return `字段 ${fieldLengthMismatch[3]} 的声明长度为 ${fieldLengthMismatch[1]}，实际长度为 ${fieldLengthMismatch[2]}。`;
  }

  const duplicateField = message.match(/^Campo (\S+) aparece (\d+) vezes \(duplicado\)\.$/);
  if (duplicateField) return `字段 ${duplicateField[1]} 重复出现 ${duplicateField[2]} 次。`;

  return `字段 ${field} 未通过格式校验，请检查输入内容。`;
};

// ---------- MAIN COMPONENT ----------

export function PixDecoderTool({ locale = 'pt-br', initialTab = 'generate' }: PixDecoderToolProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generate state
  const [genMode, setGenMode] = useState<PixGenerationMode>('static');
  const [genKeyType, setGenKeyType] = useState<PixKeyType>('cpf');
  const [genKey, setGenKey] = useState('');
  const [genUrl, setGenUrl] = useState('');
  const [genName, setGenName] = useState('Fulano da Silva');
  const [genCity, setGenCity] = useState('SAO PAULO');
  const [genAmount, setGenAmount] = useState('');
  const [genTxid, setGenTxid] = useState('');
  const [genInfo, setGenInfo] = useState('');
  const [genResult, setGenResult] = useState<PixGeneratorResult | null>(null);

  // Validate/Decode state
  const [inputPayload, setInputPayload] = useState('');
  const [validationResult, setValidationResult] = useState<PixValidationResult | null>(null);

  // QR state
  const [qrSize, setQrSize] = useState(256);
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBg, setQrBg] = useState('#ffffff');
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  // Analytics: `tool_started` fires once per mount, the first time the user
  // either clicks "Generate" or pastes something that resolves as an actual
  // Pix payload. `lastReportedResultRef`/`lastReportedErrorRef` remember the
  // payload string that was last reported so the effect-driven events below
  // don't refire on unrelated re-renders, only on a genuinely new payload.
  const hasStartedRef = useRef(false);
  const lastReportedResultRef = useRef<string | null>(null);
  const lastReportedErrorRef = useRef<string | null>(null);

  const copyToClipboard = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
      trackEvent('result_copied', { tool: TOOL_ID.pixDecoder, locale, field: resolveCopyField(key) });
    });
  }, [locale]);

  const downloadFile = useCallback((content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent('result_downloaded', { tool: TOOL_ID.pixDecoder, locale, format: resolveDownloadFormat(filename) });
  }, [locale]);

  // Auto-validate when payload changes
  useEffect(() => {
    if (!inputPayload.trim()) {
      setValidationResult(null);
      lastReportedResultRef.current = null;
      lastReportedErrorRef.current = null;
      return;
    }

    const result = validatePixPayload(inputPayload);
    setValidationResult(result);

    // (b) pasted/typed a payload that actually looks like Pix.
    if (result.isPix && !hasStartedRef.current) {
      hasStartedRef.current = true;
      trackEvent('tool_started', { tool: TOOL_ID.pixDecoder, locale });
    }

    const succeeded = result.status === 'valid' || result.status === 'valid-warnings';
    if (succeeded) {
      if (lastReportedResultRef.current !== inputPayload) {
        lastReportedResultRef.current = inputPayload;
        lastReportedErrorRef.current = null;
        trackEvent('tool_completed', {
          tool: TOOL_ID.pixDecoder,
          locale,
          result_type: 'validated',
          pix_type: result.type,
        });
      }
    } else if (lastReportedErrorRef.current !== inputPayload) {
      lastReportedErrorRef.current = inputPayload;
      lastReportedResultRef.current = null;
      trackEvent('tool_error', {
        tool: TOOL_ID.pixDecoder,
        locale,
        error_type: resolveValidationErrorType(result.status),
      });
    }
  }, [inputPayload, locale]);

  // Generate handler
  const handleGenerate = useCallback(() => {
    // (a) user clicks "Gerar Pix Copia e Cola" — real start of the flow.
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackEvent('tool_started', { tool: TOOL_ID.pixDecoder, locale });
    }

    const input: PixGeneratorInput = {
      type: genMode,
      keyType: genKeyType,
      key: genMode === 'static' ? formatKeyForPayload(genKeyType, genKey) : '',
      url: genMode === 'dynamic' ? genUrl : undefined,
      merchantName: genName,
      merchantCity: genCity,
      amount: genAmount || undefined,
      txid: genMode === 'static' ? genTxid || undefined : undefined,
      additionalInfo: genMode === 'static' ? genInfo || undefined : undefined,
    };
    const result = buildPixPayload(input);
    const validation = validatePixPayload(result.payload);
    setGenResult(result);
    if (result.payload) {
      // Report success/error based on the same validation used below so the
      // auto-validate effect (triggered by setInputPayload right after) sees
      // the refs already up to date and doesn't double-report this payload.
      const succeeded = validation.status === 'valid' || validation.status === 'valid-warnings';
      if (succeeded) {
        lastReportedResultRef.current = result.payload;
        lastReportedErrorRef.current = null;
        trackEvent('tool_completed', {
          tool: TOOL_ID.pixDecoder,
          locale,
          result_type: 'generated',
          gen_mode: genMode,
        });
      } else {
        lastReportedErrorRef.current = result.payload;
        lastReportedResultRef.current = null;
        trackEvent('tool_error', {
          tool: TOOL_ID.pixDecoder,
          locale,
          error_type: resolveValidationErrorType(validation.status),
        });
      }

      setInputPayload(result.payload);
      setValidationResult(validation);
      if (result.isValid && validation.isPix && result.issues.length === 0) {
        setActiveTab('validate');
      }
    }
  }, [genMode, genKeyType, genKey, genUrl, genName, genCity, genAmount, genTxid, genInfo, locale]);

  const handleReset = useCallback(() => {
    setGenMode('static');
    setGenKey('');
    setGenUrl('');
    setGenName('');
    setGenCity('');
    setGenAmount('');
    setGenTxid('');
    setGenInfo('');
    setGenResult(null);
    setInputPayload('');
    setValidationResult(null);
  }, []);

  const loadExample = useCallback((payload: string) => {
    setInputPayload(payload);
    setValidationResult(validatePixPayload(payload));
    setActiveTab('validate');
  }, []);

  const activePayload = inputPayload;
  const activeValidation = validationResult;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'generate', label: t('tabGenerate', locale) },
    { key: 'validate', label: t('tabValidate', locale) },
    { key: 'decoder', label: t('tabDecoder', locale) },
    { key: 'tree', label: t('tabTree', locale) },
    { key: 'qrcode', label: t('tabQr', locale) },
    { key: 'crc', label: t('tabCrc', locale) },
    { key: 'export', label: t('tabExport', locale) },
  ];

  return (
    <Card className="space-y-6">
      {/* Tab bar */}
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="inline-flex min-w-full gap-1 rounded-xl border border-slate-200 bg-slate-100/70 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`min-h-9 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB: Generate */}
      {activeTab === 'generate' && (
        <GenerateTab
          locale={locale}
          genMode={genMode}
          setGenMode={setGenMode}
          genKeyType={genKeyType}
          setGenKeyType={setGenKeyType}
          genKey={genKey}
          setGenKey={setGenKey}
          genUrl={genUrl}
          setGenUrl={setGenUrl}
          genName={genName}
          setGenName={setGenName}
          genCity={genCity}
          setGenCity={setGenCity}
          genAmount={genAmount}
          setGenAmount={setGenAmount}
          genTxid={genTxid}
          setGenTxid={setGenTxid}
          genInfo={genInfo}
          setGenInfo={setGenInfo}
          genResult={genResult}
          onGenerate={handleGenerate}
          onReset={handleReset}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
          openValidation={() => setActiveTab('validate')}
          openQrCode={() => setActiveTab('qrcode')}
        />
      )}

      {/* TAB: Validate */}
      {activeTab === 'validate' && (
        <ValidateTab
          locale={locale}
          inputPayload={inputPayload}
          setInputPayload={setInputPayload}
          validationResult={activeValidation}
          loadExample={loadExample}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
          openQrCode={() => setActiveTab('qrcode')}
        />
      )}

      {/* TAB: Decoder */}
      {activeTab === 'decoder' && (
        <DecoderTab
          locale={locale}
          payload={activePayload}
          validation={activeValidation}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
        />
      )}

      {/* TAB: Tree */}
      {activeTab === 'tree' && (
        <TreeTab
          locale={locale}
          validation={activeValidation}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
        />
      )}

      {/* TAB: QR Code */}
      {activeTab === 'qrcode' && (
        <QrCodeTab
          locale={locale}
          payload={activePayload}
          qrSize={qrSize}
          setQrSize={setQrSize}
          qrColor={qrColor}
          setQrColor={setQrColor}
          qrBg={qrBg}
          setQrBg={setQrBg}
          qrCanvasRef={qrCanvasRef}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
        />
      )}

      {/* TAB: CRC */}
      {activeTab === 'crc' && (
        <CrcTab
          locale={locale}
          payload={activePayload}
          setInputPayload={setInputPayload}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
        />
      )}

      {/* TAB: Export */}
      {activeTab === 'export' && (
        <ExportTab
          locale={locale}
          payload={activePayload}
          validation={activeValidation}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
          downloadFile={downloadFile}
        />
      )}

      {/* Privacy & Security */}
      <div className="grid gap-2 border-t border-slate-200 pt-4">
        <p className="flex items-start gap-2 text-xs text-slate-500">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" aria-hidden="true" />
          <span>{t('privacy', locale)}</span>
        </p>
        <p className="flex items-start gap-2 text-xs text-amber-700">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{t('securityWarning', locale)}</span>
        </p>
      </div>
    </Card>
  );
}

// ---------- GENERATE TAB ----------

function GenerateTab({
  locale,
  genMode,
  setGenMode,
  genKeyType,
  setGenKeyType,
  genKey,
  setGenKey,
  genUrl,
  setGenUrl,
  genName,
  setGenName,
  genCity,
  setGenCity,
  genAmount,
  setGenAmount,
  genTxid,
  setGenTxid,
  genInfo,
  setGenInfo,
  genResult,
  onGenerate,
  onReset,
  copyToClipboard,
  copiedKey,
  openValidation,
  openQrCode,
}: Readonly<{
  locale: AppLocale;
  genMode: PixGenerationMode;
  setGenMode: (v: PixGenerationMode) => void;
  genKeyType: PixKeyType;
  setGenKeyType: (v: PixKeyType) => void;
  genKey: string;
  setGenKey: (v: string) => void;
  genUrl: string;
  setGenUrl: (v: string) => void;
  genName: string;
  setGenName: (v: string) => void;
  genCity: string;
  setGenCity: (v: string) => void;
  genAmount: string;
  setGenAmount: (v: string) => void;
  genTxid: string;
  setGenTxid: (v: string) => void;
  genInfo: string;
  setGenInfo: (v: string) => void;
  genResult: PixGeneratorResult | null;
  onGenerate: () => void;
  onReset: () => void;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
  openValidation: () => void;
  openQrCode: () => void;
}>) {
  const keyTypes: { value: PixKeyType; label: string }[] = [
    { value: 'cpf', label: t('cpf', locale) },
    { value: 'cnpj', label: t('cnpj', locale) },
    { value: 'email', label: t('email', locale) },
    { value: 'phone', label: t('phone', locale) },
    { value: 'random', label: t('random', locale) },
    { value: 'manual', label: t('manual', locale) },
  ];
  const modes: { value: PixGenerationMode; label: string; description: string }[] = [
    {
      value: 'static',
      label: t('staticMode', locale),
      description: locale === 'zh' ? '可重复使用，载荷中包含 Pix 密钥。' : locale === 'en' ? 'Reusable payload with Pix key.' : locale === 'es' ? 'Payload reutilizable con clave Pix.' : 'Payload reutilizável com chave Pix.',
    },
    {
      value: 'dynamic',
      label: t('dynamicMode', locale),
      description: locale === 'zh' ? '通常用于单笔付款，地址由 PSP 提供。' : locale === 'en' ? 'Single-use payload with PSP location.' : locale === 'es' ? 'Payload de uso único con location del PSP.' : 'Payload de uso único com location do PSP.',
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">{t('pixMode', locale)}</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {modes.map((mode) => (
              <button
                key={mode.value}
                type="button"
                className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                  genMode === mode.value
                    ? 'border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-100'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
                onClick={() => setGenMode(mode.value)}
              >
                <span className="block text-sm font-semibold">{mode.label}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{mode.description}</span>
              </button>
            ))}
          </div>
        </div>

        {genMode === 'static' ? (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('keyType', locale)}</label>
              <div className="flex flex-wrap gap-1.5">
                {keyTypes.map((kt) => (
                  <button
                    key={kt.value}
                    type="button"
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      genKeyType === kt.value
                        ? 'bg-brand-600 text-white'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                    onClick={() => setGenKeyType(kt.value)}
                  >
                    {kt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('key', locale)}</label>
              <Input
                value={genKey}
                onChange={(e) => setGenKey(e.target.value)}
                placeholder={genKeyType === 'cpf' ? '000.000.000-00' : genKeyType === 'email' ? 'exemplo@email.com' : genKeyType === 'phone' ? '+5511999999999' : ''}
                className="font-mono text-sm"
              />
            </div>
          </>
        ) : (
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">{t('dynamicUrl', locale)}</label>
            <Input
              value={genUrl}
              onChange={(e) => setGenUrl(e.target.value)}
              placeholder="qrcodepix.example.com.br/v2/abc123"
              className="font-mono text-sm"
            />
            <p className="text-xs leading-5 text-slate-500">{t('dynamicUrlHelp', locale)}</p>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('name', locale)} <span className="text-slate-400 font-normal">({t('maxAbbr', locale)} 25)</span></label>
          <Input value={genName} onChange={(e) => setGenName(e.target.value)} maxLength={25} className="text-sm" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('city', locale)} <span className="text-slate-400 font-normal">({t('maxAbbr', locale)} 15)</span></label>
          <Input value={genCity} onChange={(e) => setGenCity(e.target.value)} maxLength={15} className="text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('amount', locale)}</label>
            <Input value={genAmount} onChange={(e) => setGenAmount(e.target.value)} placeholder="0.00" className="font-mono text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('txid', locale)}</label>
            <Input
              value={genMode === 'dynamic' ? '***' : genTxid}
              onChange={(e) => setGenTxid(e.target.value)}
              maxLength={25}
              disabled={genMode === 'dynamic'}
              className="font-mono text-sm"
            />
          </div>
        </div>

        {genMode === 'static' ? (
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('additionalInfo', locale)}</label>
            <Input value={genInfo} onChange={(e) => setGenInfo(e.target.value)} className="text-sm" />
          </div>
        ) : null}

        <div className="flex gap-2 pt-2">
          <Button onClick={onGenerate}>{t('generate', locale)}</Button>
          <Button variant="ghost" onClick={onReset}>{t('reset', locale)}</Button>
        </div>

        {genResult && genResult.issues.length > 0 && (
          <div className="space-y-1">
            {genResult.issues.map((issue, idx) => (
              <p key={idx} className={`flex items-start gap-1.5 text-xs ${issue.level === 'error' ? 'text-red-600' : 'text-amber-600'}`}>
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{localizePixIssue(issue.message, issue.field, locale)}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Result */}
      <div>
        {genResult?.payload ? (
          <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <CheckCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
              {t('payload', locale)}
            </h3>
            <div className="break-all rounded-lg border border-slate-200 bg-white p-3 font-mono text-xs text-slate-900">
              {genResult.payload}
            </div>
            <p className="text-xs leading-5 text-slate-600">{t('syncedPayload', locale)}</p>
            <div className="flex flex-wrap gap-2">
              <Button className="h-8 gap-1.5 px-3 text-xs" onClick={() => copyToClipboard(genResult.payload, 'gen-payload')}>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                {copiedKey === 'gen-payload' ? t('copied', locale) : t('copy', locale)}
              </Button>
              <Button className="h-8 px-3 text-xs" variant="secondary" onClick={openValidation}>
                {t('openValidation', locale)}
              </Button>
              <Button className="h-8 gap-1.5 px-3 text-xs" variant="secondary" onClick={openQrCode}>
                <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
                {t('openQrCode', locale)}
              </Button>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <PixDataSummary pixData={genResult.pixData} locale={locale} />
            </div>
          </section>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
            {locale === 'zh' ? '填写表单并点击“生成 Pix”' : locale === 'en' ? 'Fill the form and click Generate' : locale === 'es' ? 'Complete el formulario y haga clic en Generar' : 'Preencha o formulário e clique em Gerar'}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- VALIDATE TAB ----------

function ValidateTab({ locale, inputPayload, setInputPayload, validationResult, loadExample, copyToClipboard, copiedKey, openQrCode }: Readonly<{
  locale: AppLocale;
  inputPayload: string;
  setInputPayload: (v: string) => void;
  validationResult: PixValidationResult | null;
  loadExample: (payload: string) => void;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
  openQrCode: () => void;
}>) {
  const examples = useMemo(() => {
    const pixExamples = getPixExamples();
    if (locale !== 'zh') return pixExamples;

    const labels: Record<string, { label: string; description: string }> = {
      staticNoValue: { label: '静态 Pix（未指定金额）', description: '包含随机密钥、未设置金额的静态 Pix 二维码。' },
      staticWithValue: { label: '带金额的静态 Pix', description: '包含 CPF 和 10.00 巴西雷亚尔金额的静态 Pix 二维码。' },
      staticWithTxid: { label: '包含 TXID 的 Pix', description: '包含 CNPJ、金额和交易标识的静态 Pix 二维码。' },
      dynamicExample: { label: '动态 Pix 示例', description: '包含示例付款地址的动态 Pix 二维码。' },
      invalidCrc: { label: '无效 CRC（测试）', description: '用于测试 CRC 修复功能的付款码。' },
      incomplete: { label: '不完整文本（测试）', description: '用于测试格式校验的截断付款码。' },
    };

    return Object.fromEntries(
      Object.entries(pixExamples).map(([key, example]) => [key, { ...example, ...(labels[key] ?? {}) }]),
    );
  }, [locale]);

  const statusBadge = useMemo(() => {
    if (!validationResult) return null;
    const statusMap: Record<string, { color: string; label: string }> = {
      valid: { color: 'bg-green-100 text-green-800', label: t('valid', locale) },
      'valid-warnings': { color: 'bg-yellow-100 text-yellow-800', label: t('validWarnings', locale) },
      invalid: { color: 'bg-red-100 text-red-800', label: t('invalid', locale) },
      'crc-invalid': { color: 'bg-red-100 text-red-800', label: t('crcInvalid', locale) },
      'not-pix': { color: 'bg-slate-100 text-slate-800', label: t('notPix', locale) },
    };
    const s = statusMap[validationResult.status];
    return s ? <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.color}`}>{s.label}</span> : null;
  }, [validationResult, locale]);

  const typeBadge = useMemo(() => {
    if (!validationResult) return null;
    const typeMap: Record<string, string> = {
      static: t('static', locale),
      dynamic: t('dynamic', locale),
      unknown: t('unknown', locale),
    };
    return <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">{typeMap[validationResult.type]}</span>;
  }, [validationResult, locale]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          value={inputPayload}
          onChange={(e) => setInputPayload(e.target.value)}
          placeholder={t('pastePayload', locale)}
          className="min-h-[100px] font-mono text-xs"
          rows={4}
        />
        <div className="flex flex-wrap items-center gap-2">
          {statusBadge}
          {typeBadge}
        </div>

        {/* Examples */}
        <details>
          <summary className="cursor-pointer text-xs font-medium text-slate-500">{t('examples', locale)}</summary>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Object.entries(examples).map(([key, ex]) => (
              <button
                key={key}
                type="button"
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100"
                onClick={() => loadExample(ex.payload)}
                title={ex.description}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </details>
      </div>

      {validationResult && (
        <>
          {/* Issues */}
          {validationResult.issues.length > 0 && (
            <section className="space-y-1 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              {validationResult.issues.map((issue, idx) => (
                <p key={idx} className={`flex items-start gap-1.5 text-xs ${
                  issue.level === 'error' ? 'text-red-600' :
                  issue.level === 'warning' ? 'text-amber-600' : 'text-blue-600'
                }`}>
                  {issue.level === 'error' || issue.level === 'warning' ? (
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  )}
                  <span>{localizePixIssue(issue.message, issue.field, locale)}</span>
                </p>
              ))}
            </section>
          )}

          {/* Extracted Data */}
          <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <CheckCircle className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {t('pixData', locale)}
            </h3>
            <PixDataSummary pixData={validationResult.pixData} locale={locale} />
            <div className="flex flex-wrap gap-2">
              <Button className="h-8 gap-1.5 px-3 text-xs" onClick={() => copyToClipboard(inputPayload, 'validate-payload')}>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                {copiedKey === 'validate-payload' ? t('copied', locale) : t('copy', locale)}
              </Button>
              <Button className="h-8 gap-1.5 px-3 text-xs" variant="secondary" onClick={openQrCode}>
                <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
                {t('openQrCode', locale)}
              </Button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

// ---------- DECODER TAB ----------

function DecoderTab({ locale, payload, validation, copyToClipboard, copiedKey }: Readonly<{
  locale: AppLocale;
  payload: string;
  validation: PixValidationResult | null;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
}>) {
  const parsedFields = useMemo(() => {
    if (validation) return validation.fields;
    if (payload.trim()) return parseEmvFields(payload.trim());
    return [];
  }, [payload, validation]);
  const fields = useMemo(() => localizePixFields(parsedFields, locale), [parsedFields, locale]);

  const [selectedField, setSelectedField] = useState<EmvField | null>(null);

  if (!payload.trim()) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        {locale === 'zh' ? '请先在“校验”标签页中输入付款码文本' : locale === 'en' ? 'Enter a payload in the Validate tab first' : locale === 'es' ? 'Ingrese un payload en la pestaña Validar primero' : 'Insira um payload na aba Validar primeiro'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(CATEGORY_COLORS).map(([key, val]) => (
          <span key={key} className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium ${val.bg} ${val.text}`}>
            {locale === 'zh' ? CATEGORY_LABELS_ZH[key] : val.label}
          </span>
        ))}
      </div>

      {/* Color-coded payload */}
      <section className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex flex-wrap gap-0.5 font-mono text-xs leading-relaxed">
          {fields.map((field, idx) => {
            const cat = CATEGORY_COLORS[field.category] ?? CATEGORY_COLORS.unknown;
            return (
              <button
                key={idx}
                type="button"
                className={`cursor-pointer rounded px-1 py-0.5 transition-all hover:ring-2 hover:ring-brand-600 ${cat.bg} ${cat.text} ${
                  selectedField === field ? 'ring-2 ring-brand-600' : ''
                }`}
                onClick={() => setSelectedField(field === selectedField ? null : field)}
                title={`${field.id}: ${field.name}`}
              >
                <span className="opacity-60">{field.id}</span>
                <span className="opacity-40">{field.length.toString().padStart(2, '0')}</span>
                <span>{field.value.length > 30 ? `${field.value.slice(0, 30)}…` : field.value}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected field details */}
      {selectedField && (
        <section className="space-y-2 rounded-xl border border-brand-200 bg-brand-50/30 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">{selectedField.name}</h4>
            <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[selectedField.category]?.bg} ${CATEGORY_COLORS[selectedField.category]?.text}`}>
              {locale === 'zh' ? CATEGORY_LABELS_ZH[selectedField.category] : selectedField.category}
            </span>
          </div>
          <p className="text-xs text-slate-600">{selectedField.description}</p>
          <div className="grid grid-cols-3 gap-2 text-xs text-slate-700">
            <div><span className="text-slate-500">ID:</span> <code>{selectedField.id}</code></div>
            <div><span className="text-slate-500">{locale === 'zh' ? '长度：' : 'Tam:'}</span> <code>{selectedField.length}</code></div>
            <div><span className="text-slate-500">{locale === 'zh' ? (selectedField.required ? '✓ 必填' : '○ 可选') : (selectedField.required ? '✓ Obrigatório' : '○ Opcional')}</span></div>
          </div>
          <div className="break-all rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs text-slate-900">
            {selectedField.value}
          </div>
          {selectedField.children && selectedField.children.length > 0 && (
            <div className="mt-2 space-y-1 border-l-2 border-slate-200 pl-3">
              {selectedField.children.map((child, ci) => (
                <div key={ci} className="text-xs">
                  <span className="font-medium text-slate-700">{child.id} {child.name}:</span>{' '}
                  <code className="text-slate-900">{child.value}</code>
                </div>
              ))}
            </div>
          )}
          <Button className="h-7 px-2 text-[11px]" variant="ghost" onClick={() => copyToClipboard(selectedField.value, `field-${selectedField.id}`)}>
            {copiedKey === `field-${selectedField.id}` ? '✓' : t('copy', locale)}
          </Button>
        </section>
      )}
    </div>
  );
}

// ---------- TREE TAB ----------

function TreeTab({ locale, validation, copyToClipboard, copiedKey }: Readonly<{
  locale: AppLocale;
  validation: PixValidationResult | null;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
}>) {
  const fields = useMemo(
    () => localizePixFields(validation?.fields ?? [], locale),
    [validation, locale],
  );

  if (fields.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        {locale === 'zh' ? '没有可显示的字段' : locale === 'en' ? 'No fields to display' : locale === 'es' ? 'Sin campos para mostrar' : 'Nenhum campo para exibir'}
      </div>
    );
  }

  return (
    <section className="space-y-1 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      {fields.map((field, idx) => (
        <TreeNode key={idx} field={field} depth={0} copyToClipboard={copyToClipboard} copiedKey={copiedKey} locale={locale} />
      ))}
    </section>
  );
}

function TreeNode({ field, depth, copyToClipboard, copiedKey, locale }: Readonly<{
  field: EmvField;
  depth: number;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
  locale: AppLocale;
}>) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = field.children && field.children.length > 0;
  const cat = CATEGORY_COLORS[field.category] ?? CATEGORY_COLORS.unknown;
  const indent = depth * 16;
  const copyKey = `tree-${field.id}-${field.offset}`;

  return (
    <div style={{ marginLeft: `${indent}px` }}>
      <div className="group flex items-center gap-1.5 rounded px-1.5 py-0.5 hover:bg-slate-100">
        {hasChildren ? (
          <button type="button" className="text-xs text-slate-400" onClick={() => setExpanded(!expanded)}>
            {expanded ? '▼' : '▶'}
          </button>
        ) : (
          <span className="w-3" />
        )}
        <span className={`rounded px-1 py-0.5 text-[10px] font-mono font-bold ${cat.bg} ${cat.text}`}>
          {field.id}
        </span>
        <span className="text-xs font-medium text-slate-700">{field.name}</span>
        {!hasChildren && (
          <code className="ml-1 truncate text-xs text-slate-500">{field.value.length > 40 ? `${field.value.slice(0, 40)}…` : field.value}</code>
        )}
        <button
          type="button"
          className="ml-auto hidden text-[10px] text-slate-400 hover:text-slate-700 group-hover:inline"
          onClick={() => copyToClipboard(field.value, copyKey)}
        >
          {copiedKey === copyKey ? '✓' : '⎘'}
        </button>
      </div>
      {hasChildren && expanded && field.children?.map((child, ci) => (
        <TreeNode key={ci} field={child} depth={depth + 1} copyToClipboard={copyToClipboard} copiedKey={copiedKey} locale={locale} />
      ))}
    </div>
  );
}

// ---------- QR CODE TAB ----------

function QrCodeTab({ locale, payload, qrSize, setQrSize, qrColor, setQrColor, qrBg, setQrBg, qrCanvasRef, copyToClipboard, copiedKey }: Readonly<{
  locale: AppLocale;
  payload: string;
  qrSize: number;
  setQrSize: (v: number) => void;
  qrColor: string;
  setQrColor: (v: string) => void;
  qrBg: string;
  setQrBg: (v: string) => void;
  qrCanvasRef: React.RefObject<HTMLDivElement | null>;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
}>) {
  const [qrLib, setQrLib] = useState<typeof import('qr-code-styling') | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qrInstanceRef = useRef<any>(null);

  // Dynamic import of qr-code-styling
  useEffect(() => {
    import('qr-code-styling').then((mod) => setQrLib(mod));
  }, []);

  // Render QR
  useEffect(() => {
    if (!qrLib || !payload.trim() || !qrCanvasRef.current) return;

    const QRCodeStyling = qrLib.default;
    const container = qrCanvasRef.current;

    // Clear previous
    container.innerHTML = '';

    const qr = new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      data: payload,
      dotsOptions: { color: qrColor, type: 'square' },
      backgroundOptions: { color: qrBg },
      cornersSquareOptions: { color: qrColor },
      cornersDotOptions: { color: qrColor },
      qrOptions: { errorCorrectionLevel: 'M' },
    });

    qr.append(container);
    qrInstanceRef.current = qr;
  }, [qrLib, payload, qrSize, qrColor, qrBg, qrCanvasRef]);

  const handleDownloadPng = useCallback(() => {
    qrInstanceRef.current?.download({ extension: 'png', name: 'pix-qrcode' });
    trackEvent('result_downloaded', { tool: TOOL_ID.pixDecoder, locale, format: 'png' });
  }, [locale]);

  const handleDownloadSvg = useCallback(() => {
    qrInstanceRef.current?.download({ extension: 'svg', name: 'pix-qrcode' });
    trackEvent('result_downloaded', { tool: TOOL_ID.pixDecoder, locale, format: 'svg' });
  }, [locale]);

  if (!payload.trim()) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        {locale === 'zh' ? '请先生成或校验付款码文本' : locale === 'en' ? 'Generate or validate a payload first' : locale === 'es' ? 'Genere o valide un payload primero' : 'Gere ou valide um payload primeiro'}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Controls */}
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('qrSize', locale)}: {qrSize}px</label>
          <input type="range" min={128} max={512} step={32} value={qrSize} onChange={(e) => setQrSize(Number(e.target.value))} className="w-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('qrColor', locale)}</label>
            <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="h-9 w-full cursor-pointer rounded-lg border border-slate-200" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('qrBg', locale)}</label>
            <input type="color" value={qrBg} onChange={(e) => setQrBg(e.target.value)} className="h-9 w-full cursor-pointer rounded-lg border border-slate-200" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button className="h-8 gap-1.5 px-3 text-xs" onClick={handleDownloadPng}>
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {t('downloadPng', locale)}
          </Button>
          <Button className="h-8 gap-1.5 px-3 text-xs" variant="secondary" onClick={handleDownloadSvg}>
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {t('downloadSvg', locale)}
          </Button>
          <Button className="h-8 gap-1.5 px-3 text-xs" variant="ghost" onClick={() => copyToClipboard(payload, 'qr-payload')}>
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            {copiedKey === 'qr-payload' ? t('copied', locale) : `${t('copy', locale)} ${t('payload', locale)}`}
          </Button>
        </div>
      </div>

      {/* QR Preview */}
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50/80 p-6">
        <div ref={qrCanvasRef as React.RefObject<HTMLDivElement>} className="flex items-center justify-center" />
      </div>
    </div>
  );
}

// ---------- CRC TAB ----------

function CrcTab({ locale, payload, setInputPayload, copyToClipboard, copiedKey }: Readonly<{
  locale: AppLocale;
  payload: string;
  setInputPayload: (v: string) => void;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
}>) {
  const crcResult = useMemo(() => {
    if (!payload.trim()) return null;
    return verifyCrc(payload.trim());
  }, [payload]);

  const fixedPayload = useMemo(() => {
    if (!payload.trim()) return '';
    return fixCrc(payload.trim());
  }, [payload]);

  if (!payload.trim()) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        {locale === 'zh' ? '请先输入付款码文本' : locale === 'en' ? 'Enter a payload first' : locale === 'es' ? 'Ingrese un payload primero' : 'Insira um payload primeiro'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-[10px] font-medium text-slate-500">{t('crcOriginal', locale)}</p>
          <p className="font-mono text-lg font-bold text-slate-900">{crcResult?.provided || '—'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-[10px] font-medium text-slate-500">{t('crcCalculated', locale)}</p>
          <p className="font-mono text-lg font-bold text-slate-900">{crcResult?.calculated || '—'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-[10px] font-medium text-slate-500">{t('crcStatus', locale)}</p>
          <p className={`text-lg font-bold ${crcResult?.valid ? 'text-green-600' : 'text-red-600'}`}>
            {crcResult?.valid ? '✓' : '✗'} {crcResult?.valid ? t('valid', locale) : t('crcInvalid', locale)}
          </p>
        </div>
      </div>

      {crcResult && !crcResult.valid && (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <h4 className="text-sm font-semibold text-slate-800">{t('fixedPayload', locale)}</h4>
          <div className="break-all rounded-lg border border-green-200 bg-green-50 p-3 font-mono text-xs text-green-900">
            {fixedPayload}
          </div>
          <div className="flex gap-2">
            <Button className="h-8 gap-1.5 px-3 text-xs" onClick={() => copyToClipboard(fixedPayload, 'fixed-payload')}>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              {copiedKey === 'fixed-payload' ? t('copied', locale) : t('copy', locale)}
            </Button>
            <Button className="h-8 px-3 text-xs" variant="ghost" onClick={() => setInputPayload(fixedPayload)}>
              {locale === 'zh' ? '使用修复结果' : locale === 'en' ? 'Use fixed' : locale === 'es' ? 'Usar corregido' : 'Usar corrigido'}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

// ---------- EXPORT TAB ----------

function ExportTab({ locale, payload, validation, copyToClipboard, copiedKey, downloadFile }: Readonly<{
  locale: AppLocale;
  payload: string;
  validation: PixValidationResult | null;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
  downloadFile: (content: string, filename: string, type: string) => void;
}>) {
  const jsonContent = useMemo(() => {
    if (!validation) return '';
    const exportValidation = locale === 'zh'
      ? {
          ...validation,
          fields: localizePixFields(validation.fields, locale),
          issues: validation.issues.map((issue) => ({
            ...issue,
            message: localizePixIssue(issue.message, issue.field, locale),
          })),
        }
      : validation;
    return pixToJson(exportValidation);
  }, [validation, locale]);

  const csvContent = useMemo(() => {
    if (!validation) return '';
    return pixToCsv(validation.pixData, locale);
  }, [validation, locale]);

  if (!payload.trim()) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        {locale === 'zh' ? '没有可导出的数据' : locale === 'en' ? 'No data to export' : locale === 'es' ? 'Sin datos para exportar' : 'Nenhum dado para exportar'}
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
      <Button className="h-9 gap-1.5 text-xs" variant="secondary" onClick={() => copyToClipboard(payload, 'export-payload')}>
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        {copiedKey === 'export-payload' ? t('copied', locale) : `${t('copy', locale)} ${t('payload', locale)}`}
      </Button>
      <Button className="h-9 gap-1.5 text-xs" variant="secondary" onClick={() => downloadFile(payload, 'pix-payload.txt', 'text/plain')}>
        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
        {t('exportTxt', locale)}
      </Button>
      <Button className="h-9 gap-1.5 text-xs" variant="secondary" onClick={() => { copyToClipboard(jsonContent, 'export-json'); }}>
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        {copiedKey === 'export-json' ? t('copied', locale) : `${t('copy', locale)} JSON`}
      </Button>
      <Button className="h-9 gap-1.5 text-xs" variant="secondary" onClick={() => downloadFile(jsonContent, 'pix-data.json', 'application/json')}>
        <FileJson className="h-3.5 w-3.5" aria-hidden="true" />
        {t('exportJson', locale)}
      </Button>
      <Button className="h-9 gap-1.5 text-xs" variant="secondary" onClick={() => downloadFile(csvContent, 'pix-data.csv', 'text/csv')}>
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
        {t('exportCsv', locale)}
      </Button>
    </div>
  );
}

// ---------- PIX DATA SUMMARY ----------

function PixDataSummary({ pixData, locale }: Readonly<{ pixData: PixData; locale: AppLocale }>) {
  const rows = useMemo(() => {
    const typeLabel = pixData.type === 'static' ? t('static', locale) :
                      pixData.type === 'dynamic' ? t('dynamic', locale) : t('unknown', locale);
    const items: Array<{ label: string; value: string | null }> = [
      { label: locale === 'zh' ? '类型' : locale === 'en' ? 'Type' : locale === 'es' ? 'Tipo' : 'Tipo', value: typeLabel },
      { label: t('key', locale), value: pixData.key },
      { label: t('keyType', locale), value: pixData.keyType ? t(pixData.keyType, locale) : null },
      { label: t('amount', locale), value: pixData.amount ? `R$ ${pixData.amount}` : null },
      { label: t('name', locale), value: pixData.merchantName },
      { label: t('city', locale), value: pixData.merchantCity },
      { label: locale === 'zh' ? '国家/地区' : locale === 'en' ? 'Country' : locale === 'es' ? 'País' : 'País', value: pixData.countryCode },
      { label: locale === 'zh' ? '货币代码' : locale === 'en' ? 'Currency' : locale === 'es' ? 'Moneda' : 'Moeda', value: pixData.currency },
      { label: 'TXID', value: pixData.txid },
      { label: t('additionalInfo', locale), value: pixData.additionalInfo },
      { label: 'URL', value: pixData.url },
      { label: 'MCC', value: pixData.merchantCategoryCode },
      { label: 'CRC', value: pixData.crcProvided ? `${pixData.crcProvided} ${pixData.crcValid ? '✓' : '✗'}` : null },
    ];
    return items.filter((item) => item.value);
  }, [pixData, locale]);

  return (
    <div className="space-y-1">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between text-xs">
          <span className="text-slate-500">{row.label}</span>
          <span className="font-mono text-slate-800">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
