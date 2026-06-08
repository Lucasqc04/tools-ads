// ---------- TYPES ----------

export type EmvField = {
  id: string;
  name: string;
  length: number;
  value: string;
  rawSlice: string;
  offset: number;
  children?: EmvField[];
  category: 'emv' | 'pix' | 'merchant' | 'additional' | 'crc' | 'unknown';
  required: boolean;
  description: string;
};

export type PixType = 'static' | 'dynamic' | 'unknown';

export type PixKeyType = 'cpf' | 'cnpj' | 'email' | 'phone' | 'random' | 'manual';

export type PixData = {
  type: PixType;
  key: string | null;
  keyType: PixKeyType | null;
  amount: string | null;
  merchantName: string | null;
  merchantCity: string | null;
  countryCode: string | null;
  currency: string | null;
  txid: string | null;
  additionalInfo: string | null;
  url: string | null;
  merchantCategoryCode: string | null;
  postalCode: string | null;
  crcProvided: string | null;
  crcCalculated: string | null;
  crcValid: boolean;
  pointOfInitiation: string | null;
};

export type ValidationIssue = {
  level: 'error' | 'warning' | 'info';
  field: string;
  message: string;
};

export type PixValidationResult = {
  isValid: boolean;
  isPix: boolean;
  type: PixType;
  status: 'valid' | 'valid-warnings' | 'invalid' | 'crc-invalid' | 'not-pix';
  issues: ValidationIssue[];
  pixData: PixData;
  fields: EmvField[];
  rawPayload: string;
  crc: string | null;
  calculatedCrc: string | null;
};

export type PixGeneratorInput = {
  type?: Exclude<PixType, 'unknown'>;
  keyType: PixKeyType;
  key: string;
  merchantName: string;
  merchantCity: string;
  amount?: string;
  txid?: string;
  additionalInfo?: string;
  merchantCategoryCode?: string;
  countryCode?: string;
  currency?: string;
  pointOfInitiation?: string;
  url?: string;
};

export type PixGeneratorResult = {
  payload: string;
  pixData: PixData;
  fields: EmvField[];
  qrData: string;
  isValid: boolean;
  issues: ValidationIssue[];
};

type ParseEmvResult = {
  fields: EmvField[];
  issues: ValidationIssue[];
  consumedLength: number;
};

// ---------- FIELD NAMES ----------

const EMV_FIELD_NAMES: Record<string, { name: string; description: string; category: EmvField['category']; required: boolean }> = {
  '00': { name: 'Payload Format Indicator', description: 'Versão do formato do payload. Deve ser "01".', category: 'emv', required: true },
  '01': { name: 'Point of Initiation Method', description: '11 = estático (reutilizável), 12 = dinâmico (uso único).', category: 'emv', required: false },
  '26': { name: 'Merchant Account Information', description: 'Contém dados da conta do recebedor Pix.', category: 'pix', required: true },
  '27': { name: 'Merchant Account Information', description: 'Conta alternativa do recebedor.', category: 'pix', required: false },
  '52': { name: 'Merchant Category Code', description: 'Código MCC do estabelecimento. "0000" para genérico.', category: 'merchant', required: true },
  '53': { name: 'Transaction Currency', description: 'Código ISO 4217 da moeda. "986" para BRL.', category: 'merchant', required: true },
  '54': { name: 'Transaction Amount', description: 'Valor da transação. Ausente = aberto para digitação.', category: 'merchant', required: false },
  '55': { name: 'Tip or Convenience Fee Indicator', description: 'Indicador de gorjeta ou taxa.', category: 'merchant', required: false },
  '56': { name: 'Value of Convenience Fee (Fixed)', description: 'Valor fixo de taxa de conveniência.', category: 'merchant', required: false },
  '57': { name: 'Value of Convenience Fee (%)', description: 'Percentual de taxa de conveniência.', category: 'merchant', required: false },
  '58': { name: 'Country Code', description: 'País do recebedor. "BR" para Brasil.', category: 'merchant', required: true },
  '59': { name: 'Merchant Name', description: 'Nome do recebedor (até 25 caracteres).', category: 'merchant', required: true },
  '60': { name: 'Merchant City', description: 'Cidade do recebedor (até 15 caracteres).', category: 'merchant', required: true },
  '61': { name: 'Postal Code', description: 'CEP do recebedor.', category: 'merchant', required: false },
  '62': { name: 'Additional Data Field Template', description: 'Dados adicionais incluindo TXID.', category: 'additional', required: false },
  '63': { name: 'CRC16', description: 'Checksum CRC16-CCITT do payload.', category: 'crc', required: true },
  '64': { name: 'Merchant Information (Language)', description: 'Informações em idioma alternativo.', category: 'merchant', required: false },
  '65': { name: 'Unreserved Templates', description: 'Templates não reservados.', category: 'unknown', required: false },
};

const MAI_FIELD_NAMES: Record<string, { name: string; description: string }> = {
  '00': { name: 'GUI', description: 'Identificador global. Para Pix: "br.gov.bcb.pix".' },
  '01': { name: 'Chave Pix', description: 'Chave Pix do recebedor (CPF, CNPJ, e-mail, telefone ou aleatória).' },
  '02': { name: 'Informação Adicional', description: 'Descrição ou informação adicional do pagamento.' },
  '03': { name: 'FOSS', description: 'Facilitador de Serviços de Saque.' },
  '25': { name: 'URL', description: 'URL da location para Pix dinâmico (sem protocolo https://).' },
};

const ADDITIONAL_FIELD_NAMES: Record<string, { name: string; description: string }> = {
  '01': { name: 'Bill Number', description: 'Número da fatura.' },
  '02': { name: 'Mobile Number', description: 'Número de celular.' },
  '03': { name: 'Store Label', description: 'Identificador da loja.' },
  '04': { name: 'Loyalty Number', description: 'Número de fidelidade.' },
  '05': { name: 'Reference Label (TXID)', description: 'Identificador da transação Pix (txid).' },
  '06': { name: 'Customer Label', description: 'Identificador do cliente.' },
  '07': { name: 'Terminal Label', description: 'Identificador do terminal.' },
  '08': { name: 'Purpose of Transaction', description: 'Finalidade da transação.' },
  '09': { name: 'Additional Consumer Data Request', description: 'Dados adicionais do pagador.' },
  '10': { name: 'Merchant Tax ID', description: 'Documento fiscal do recebedor.' },
};

// ---------- CRC16 ----------

function normalizePixPayload(payload: string): string {
  return payload.trim().replace(/[\n\r\t]/g, '');
}

export function calculateCrc16(payload: string): string {
  const polynomial = 0x1021;
  let crc = 0xFFFF;
  const bytes = new TextEncoder().encode(payload);

  for (const byte of bytes) {
    crc ^= byte << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function fixCrc(payload: string): string {
  // Remove existing CRC if present (last 4 chars after "6304")
  const normalized = normalizePixPayload(payload);
  const crcFieldIndex = normalized.lastIndexOf('6304');
  const base = crcFieldIndex >= 0 ? normalized.slice(0, crcFieldIndex + 4) : `${normalized}6304`;
  const crc = calculateCrc16(base);
  return `${base}${crc}`;
}

export function verifyCrc(payload: string): { provided: string; calculated: string; valid: boolean } {
  const normalized = normalizePixPayload(payload);
  if (normalized.length < 8) return { provided: '', calculated: '', valid: false };

  const crcFieldIndex = normalized.lastIndexOf('6304');
  if (crcFieldIndex < 0) return { provided: '', calculated: '', valid: false };

  const provided = normalized.slice(crcFieldIndex + 4, crcFieldIndex + 8).toUpperCase();
  const base = normalized.slice(0, crcFieldIndex + 4);
  const calculated = calculateCrc16(base);

  return { provided, calculated, valid: provided === calculated };
}

// ---------- EMV PARSER ----------

export function parseEmvFields(payload: string, parentCategory?: EmvField['category']): EmvField[] {
  return parseEmvFieldsDetailed(payload, parentCategory).fields;
}

function parseEmvFieldsDetailed(
  payload: string,
  parentCategory?: EmvField['category'],
  baseOffset = 0,
): ParseEmvResult {
  const fields: EmvField[] = [];
  const issues: ValidationIssue[] = [];
  let pos = 0;

  while (pos < payload.length) {
    if (pos + 4 > payload.length) {
      issues.push({
        level: 'error',
        field: '',
        message: `Payload EMV termina com ${payload.length - pos} caractere(s) solto(s) no offset ${baseOffset + pos}.`,
      });
      break;
    }

    const id = payload.slice(pos, pos + 2);
    const lengthStr = payload.slice(pos + 2, pos + 4);
    if (!/^\d{4}$/.test(`${id}${lengthStr}`)) {
      issues.push({
        level: 'error',
        field: id,
        message: `ID ou tamanho inválido no offset ${baseOffset + pos}. Esperado formato numérico NNLL.`,
      });
      break;
    }

    const length = Number.parseInt(lengthStr, 10);

    if (Number.isNaN(length) || length < 0) {
      issues.push({
        level: 'error',
        field: id,
        message: `Tamanho inválido no campo ${id}.`,
      });
      break;
    }

    if (pos + 4 + length > payload.length) {
      issues.push({
        level: 'error',
        field: id,
        message: `Campo ${id} declara ${length} caractere(s), mas o payload termina antes do fim do campo.`,
      });
      break;
    }

    const value = payload.slice(pos + 4, pos + 4 + length);
    const rawSlice = payload.slice(pos, pos + 4 + length);

    const fieldMeta = EMV_FIELD_NAMES[id];
    const category = parentCategory ?? fieldMeta?.category ?? 'unknown';

    const field: EmvField = {
      id,
      name: fieldMeta?.name ?? `Campo ${id}`,
      length,
      value,
      rawSlice,
      offset: pos,
      category,
      required: fieldMeta?.required ?? false,
      description: fieldMeta?.description ?? 'Campo não documentado.',
    };

    // Parse nested fields for MAI (26-51) and Additional Data (62)
    const idNum = Number.parseInt(id, 10);
    if ((idNum >= 26 && idNum <= 51) || id === '62' || id === '64') {
      const nested = parseNestedFieldsDetailed(value, id, baseOffset + pos + 4);
      field.children = nested.fields;
      issues.push(
        ...nested.issues.map((issue) => ({
          ...issue,
          field: issue.field ? `${id}.${issue.field}` : id,
        })),
      );
    }

    fields.push(field);
    pos += 4 + length;
  }

  return { fields, issues, consumedLength: pos };
}

function parseNestedFieldsDetailed(value: string, parentId: string, baseOffset = 0): ParseEmvResult {
  const fields: EmvField[] = [];
  const issues: ValidationIssue[] = [];
  let pos = 0;

  while (pos < value.length) {
    if (pos + 4 > value.length) {
      issues.push({
        level: 'error',
        field: '',
        message: `Template ${parentId} termina com ${value.length - pos} caractere(s) solto(s) no offset ${baseOffset + pos}.`,
      });
      break;
    }

    const id = value.slice(pos, pos + 2);
    const lengthStr = value.slice(pos + 2, pos + 4);
    if (!/^\d{4}$/.test(`${id}${lengthStr}`)) {
      issues.push({
        level: 'error',
        field: id,
        message: `ID ou tamanho de subcampo inválido no template ${parentId}, offset ${baseOffset + pos}.`,
      });
      break;
    }

    const length = Number.parseInt(lengthStr, 10);

    if (Number.isNaN(length) || length < 0) {
      issues.push({
        level: 'error',
        field: id,
        message: `Tamanho inválido no subcampo ${parentId}.${id}.`,
      });
      break;
    }

    if (pos + 4 + length > value.length) {
      issues.push({
        level: 'error',
        field: id,
        message: `Subcampo ${parentId}.${id} declara ${length} caractere(s), mas o template termina antes do fim do campo.`,
      });
      break;
    }

    const fieldValue = value.slice(pos + 4, pos + 4 + length);
    const rawSlice = value.slice(pos, pos + 4 + length);

    let meta: { name: string; description: string } | undefined;
    if (parentId === '62') {
      meta = ADDITIONAL_FIELD_NAMES[id];
    } else {
      meta = MAI_FIELD_NAMES[id];
    }

    const category: EmvField['category'] = parentId === '62' ? 'additional' : 'pix';

    fields.push({
      id,
      name: meta?.name ?? `Subcampo ${id}`,
      length,
      value: fieldValue,
      rawSlice,
      offset: pos,
      category,
      required: id === '00',
      description: meta?.description ?? 'Subcampo não documentado.',
    });

    pos += 4 + length;
  }

  return { fields, issues, consumedLength: pos };
}

// ---------- PIX DATA EXTRACTOR ----------

export function extractPixData(fields: EmvField[], payload: string): PixData {
  const crcResult = verifyCrc(payload);

  let key: string | null = null;
  let additionalInfo: string | null = null;
  let url: string | null = null;
  let gui: string | null = null;

  // Find MAI field (26-51) with br.gov.bcb.pix
  for (const field of fields) {
    const idNum = Number.parseInt(field.id, 10);
    if (idNum >= 26 && idNum <= 51 && field.children) {
      const guiField = field.children.find((c) => c.id === '00');
      if (guiField?.value.toLowerCase() === 'br.gov.bcb.pix') {
        gui = guiField.value;
        const keyField = field.children.find((c) => c.id === '01');
        if (keyField) key = keyField.value;
        const infoField = field.children.find((c) => c.id === '02');
        if (infoField) additionalInfo = infoField.value;
        const urlField = field.children.find((c) => c.id === '25');
        if (urlField) url = urlField.value;
        break;
      }
    }
  }

  const getFieldValue = (id: string): string | null =>
    fields.find((f) => f.id === id)?.value ?? null;

  // Extract txid from additional data (62.05)
  let txid: string | null = null;
  const additionalField = fields.find((f) => f.id === '62');
  if (additionalField?.children) {
    const txidField = additionalField.children.find((c) => c.id === '05');
    if (txidField) txid = txidField.value;
  }

  const pointOfInitiation = getFieldValue('01');
  const hasUrl = Boolean(url);
  const isDynamic = pointOfInitiation === '12' || hasUrl;

  const pixType: PixType = gui ? (isDynamic ? 'dynamic' : 'static') : 'unknown';

  return {
    type: pixType,
    key,
    keyType: key ? detectKeyType(key) : null,
    amount: getFieldValue('54'),
    merchantName: getFieldValue('59'),
    merchantCity: getFieldValue('60'),
    countryCode: getFieldValue('58'),
    currency: getFieldValue('53'),
    txid,
    additionalInfo,
    url,
    merchantCategoryCode: getFieldValue('52'),
    postalCode: getFieldValue('61'),
    crcProvided: crcResult.provided || null,
    crcCalculated: crcResult.calculated || null,
    crcValid: crcResult.valid,
    pointOfInitiation,
  };
}

// ---------- KEY TYPE DETECTION ----------

export function detectKeyType(key: string): PixKeyType {
  const digitsOnly = key.replace(/\D/g, '');

  if (/^\d{11}$/.test(digitsOnly) && isValidCpfDigits(digitsOnly)) return 'cpf';
  if (/^\d{14}$/.test(digitsOnly) && isValidCnpjDigits(digitsOnly)) return 'cnpj';
  if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(key)) return 'random';
  if (/^.+@.+\..+$/.test(key)) return 'email';
  if (/^\+?\d{10,15}$/.test(digitsOnly) || /^\+55\d{10,11}$/.test(key)) return 'phone';

  return 'manual';
}

// ---------- VALIDATION ----------

export function validatePixPayload(payload: string): PixValidationResult {
  const trimmed = normalizePixPayload(payload);
  const issues: ValidationIssue[] = [];

  if (!trimmed) {
    return emptyResult('Payload vazio.', trimmed);
  }

  if (trimmed.length < 20) {
    return emptyResult('Payload muito curto para ser um BR Code válido.', trimmed);
  }

  // Check if starts with 00
  if (!trimmed.startsWith('0002')) {
    issues.push({ level: 'error', field: '00', message: 'Payload não começa com Payload Format Indicator (0002).' });
  }

  const parseResult = parseEmvFieldsDetailed(trimmed);
  const fields = parseResult.fields;
  issues.push(...parseResult.issues);

  if (fields.length === 0) {
    return emptyResult('Não foi possível parsear campos EMV.', trimmed);
  }

  // Check Format Indicator
  const formatField = fields.find((f) => f.id === '00');
  if (!formatField) {
    issues.push({ level: 'error', field: '00', message: 'Campo 00 (Payload Format Indicator) ausente.' });
  } else if (formatField.value !== '01') {
    issues.push({ level: 'warning', field: '00', message: `Valor esperado "01", encontrado "${formatField.value}".` });
  }

  // Check Pix GUI
  const pixMaiFields: EmvField[] = [];
  for (const field of fields) {
    const idNum = Number.parseInt(field.id, 10);
    if (idNum >= 26 && idNum <= 51 && field.children) {
      const guiField = field.children.find((c) => c.id === '00');
      if (guiField?.value.toLowerCase() === 'br.gov.bcb.pix') {
        pixMaiFields.push(field);
      }
    }
  }
  const hasPix = pixMaiFields.length > 0;

  if (!hasPix) {
    issues.push({ level: 'error', field: '26', message: 'GUI "br.gov.bcb.pix" não encontrada. Pode não ser um QR Code Pix.' });
  }
  if (pixMaiFields.length > 1) {
    issues.push({ level: 'error', field: '26', message: `Foram encontrados ${pixMaiFields.length} templates Pix. O payload deve ter apenas uma Merchant Account Information Pix.` });
  }

  const pixMai = pixMaiFields[0];
  if (pixMai?.children) {
    const hasKey = pixMai.children.some((c) => c.id === '01');
    const hasUrl = pixMai.children.some((c) => c.id === '25');
    const urlField = pixMai.children.find((c) => c.id === '25');

    if (hasKey && hasUrl) {
      issues.push({ level: 'error', field: `${pixMai.id}.01/25`, message: 'Merchant Account Pix contém chave e URL ao mesmo tempo. Use chave para Pix estático ou URL para Pix dinâmico.' });
    } else if (!hasKey && !hasUrl) {
      issues.push({ level: 'error', field: pixMai.id, message: 'Merchant Account Pix não contém chave (26.01) nem URL dinâmica (26.25).' });
    }

    if (urlField?.value.toLowerCase().startsWith('http')) {
      issues.push({ level: 'error', field: `${pixMai.id}.25`, message: 'URL de Pix dinâmico não deve conter protocolo. Use apenas o domínio/caminho, sem https://.' });
    }
  }

  // Check required fields
  const requiredIds = ['52', '53', '58', '59', '60', '63'];
  for (const reqId of requiredIds) {
    if (!fields.find((f) => f.id === reqId)) {
      const meta = EMV_FIELD_NAMES[reqId];
      issues.push({ level: 'error', field: reqId, message: `Campo obrigatório ausente: ${meta?.name ?? reqId}.` });
    }
  }

  const poiField = fields.find((f) => f.id === '01');
  if (poiField && !/^1[12]$/.test(poiField.value)) {
    issues.push({ level: 'warning', field: '01', message: `Point of Initiation Method deve ser "11" ou "12", encontrado "${poiField.value}".` });
  }

  const mccField = fields.find((f) => f.id === '52');
  if (mccField && !/^\d{4}$/.test(mccField.value)) {
    issues.push({ level: 'warning', field: '52', message: 'MCC deve conter exatamente 4 dígitos.' });
  }

  // Check currency
  const currencyField = fields.find((f) => f.id === '53');
  if (currencyField && currencyField.value !== '986') {
    issues.push({ level: 'warning', field: '53', message: `Moeda "${currencyField.value}" não é BRL (986).` });
  }
  if (currencyField && !/^\d{3}$/.test(currencyField.value)) {
    issues.push({ level: 'warning', field: '53', message: 'Moeda deve conter exatamente 3 dígitos ISO 4217.' });
  }

  // Check country
  const countryField = fields.find((f) => f.id === '58');
  if (countryField && countryField.value !== 'BR') {
    issues.push({ level: 'warning', field: '58', message: `País "${countryField.value}" não é BR.` });
  }
  if (countryField && countryField.value.length !== 2) {
    issues.push({ level: 'warning', field: '58', message: 'País deve conter exatamente 2 caracteres.' });
  }

  const amountField = fields.find((f) => f.id === '54');
  if (amountField && (!/^\d+(\.\d{2})?$/.test(amountField.value) || amountField.value.length > 13)) {
    issues.push({ level: 'warning', field: '54', message: 'Valor deve ser numérico, usar ponto decimal opcional com 2 casas e ter no máximo 13 caracteres.' });
  }

  const merchantNameField = fields.find((f) => f.id === '59');
  if (merchantNameField && merchantNameField.value.length > 25) {
    issues.push({ level: 'warning', field: '59', message: 'Nome do recebedor excede 25 caracteres.' });
  }

  const merchantCityField = fields.find((f) => f.id === '60');
  if (merchantCityField && merchantCityField.value.length > 15) {
    issues.push({ level: 'warning', field: '60', message: 'Cidade do recebedor excede 15 caracteres.' });
  }

  // Check CRC
  const crcResult = verifyCrc(trimmed);
  const crcField = fields.find((f) => f.id === '63');
  if (!crcResult.provided || !crcField) {
    issues.push({ level: 'error', field: '63', message: 'Campo CRC16 (63) ausente ou malformado.' });
  } else if (!crcResult.valid) {
    issues.push({ level: 'error', field: '63', message: `CRC inválido. Informado: ${crcResult.provided}, calculado: ${crcResult.calculated}.` });
  }
  if (crcField && !/^[A-Fa-f0-9]{4}$/.test(crcField.value)) {
    issues.push({ level: 'error', field: '63', message: 'CRC deve conter exatamente 4 caracteres hexadecimais.' });
  }

  // Check for field length inconsistencies
  for (const field of fields) {
    if (field.value.length !== field.length) {
      issues.push({ level: 'error', field: field.id, message: `Tamanho declarado (${field.length}) difere do real (${field.value.length}) no campo ${field.id}.` });
    }
  }

  // Check 63 is last field
  if (crcField && (crcField.offset !== trimmed.length - 8 || trimmed.slice(-8, -4) !== '6304')) {
    issues.push({ level: 'error', field: '63', message: 'Campo CRC16 (63) deve ser o último campo do payload.' });
  }

  // Detect duplicates
  const idCounts = new Map<string, number>();
  for (const field of fields) {
    idCounts.set(field.id, (idCounts.get(field.id) ?? 0) + 1);
  }
  for (const [id, count] of idCounts) {
    if (count > 1) {
      issues.push({ level: 'warning', field: id, message: `Campo ${id} aparece ${count} vezes (duplicado).` });
    }
  }

  const pixData = extractPixData(fields, trimmed);
  const hasErrors = issues.some((i) => i.level === 'error');
  const hasWarnings = issues.some((i) => i.level === 'warning');

  let status: PixValidationResult['status'];
  if (!hasPix) status = 'not-pix';
  else if (!crcResult.valid && crcResult.provided) status = 'crc-invalid';
  else if (hasErrors) status = 'invalid';
  else if (hasWarnings) status = 'valid-warnings';
  else status = 'valid';

  return {
    isValid: !hasErrors,
    isPix: hasPix,
    type: pixData.type,
    status,
    issues,
    pixData,
    fields,
    rawPayload: trimmed,
    crc: crcResult.provided || null,
    calculatedCrc: crcResult.calculated || null,
  };
}

function emptyResult(message: string, raw: string): PixValidationResult {
  return {
    isValid: false,
    isPix: false,
    type: 'unknown',
    status: 'invalid',
    issues: [{ level: 'error', field: '', message }],
    pixData: {
      type: 'unknown', key: null, keyType: null, amount: null,
      merchantName: null, merchantCity: null, countryCode: null, currency: null,
      txid: null, additionalInfo: null, url: null, merchantCategoryCode: null,
      postalCode: null, crcProvided: null, crcCalculated: null, crcValid: false,
      pointOfInitiation: null,
    },
    fields: [],
    rawPayload: raw,
    crc: null,
    calculatedCrc: null,
  };
}

// ---------- PIX PAYLOAD BUILDER ----------

function emvField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

export function buildPixPayload(input: PixGeneratorInput): PixGeneratorResult {
  const issues: ValidationIssue[] = [];
  const pixType: Exclude<PixType, 'unknown'> = input.type ?? (input.url ? 'dynamic' : 'static');
  const cleanUrl = input.url?.trim().replace(/^https?:\/\//i, '') ?? '';

  // Validate key
  if (pixType === 'static') {
    const keyValidation = validatePixKey(input.keyType, input.key);
    if (keyValidation) issues.push(keyValidation);
  } else {
    if (!cleanUrl) {
      issues.push({ level: 'error', field: '26.25', message: 'URL/location é obrigatória para Pix dinâmico.' });
    }
    if (input.url && /^https?:\/\//i.test(input.url.trim())) {
      issues.push({ level: 'warning', field: '26.25', message: 'O protocolo da URL dinâmica será removido para ficar compatível com BR Code Pix.' });
    }
    if (cleanUrl.length > 77) {
      issues.push({ level: 'error', field: '26.25', message: 'URL/location muito longa. Use até 77 caracteres para manter o template Pix dentro do limite EMV.' });
    }
  }

  // Validate name
  if (!input.merchantName.trim()) {
    issues.push({ level: 'error', field: '59', message: 'Nome do recebedor é obrigatório.' });
  } else if (input.merchantName.length > 25) {
    issues.push({ level: 'warning', field: '59', message: 'Nome excede 25 caracteres e será truncado.' });
  }

  // Validate city
  if (!input.merchantCity.trim()) {
    issues.push({ level: 'error', field: '60', message: 'Cidade do recebedor é obrigatória.' });
  } else if (input.merchantCity.length > 15) {
    issues.push({ level: 'warning', field: '60', message: 'Cidade excede 15 caracteres e será truncada.' });
  }

  // Validate amount
  if (input.amount) {
    const numAmount = Number(input.amount.replace(',', '.').replace(/[^\d.]/g, ''));
    if (Number.isNaN(numAmount) || numAmount <= 0) {
      issues.push({ level: 'error', field: '54', message: 'Valor deve ser maior que zero.' });
    }
  }

  // Validate txid
  if (input.txid && !/^[a-zA-Z0-9]{1,25}$/.test(input.txid)) {
    issues.push({ level: 'warning', field: '62.05', message: 'TXID deve conter apenas letras e números (máx 25 caracteres).' });
  }
  if (pixType === 'dynamic' && input.txid && input.txid !== '***') {
    issues.push({ level: 'warning', field: '62.05', message: 'Pix dinâmico usa TXID "***" no payload EMV; o identificador real fica na cobrança do PSP.' });
  }

  // Build payload
  const merchantName = input.merchantName.trim().slice(0, 25);
  const merchantCity = input.merchantCity.trim().slice(0, 15);
  const mcc = input.merchantCategoryCode || '0000';
  const currency = input.currency || '986';
  const country = input.countryCode || 'BR';
  const poi = input.pointOfInitiation || (pixType === 'dynamic' ? '12' : '11');

  // Build MAI (Merchant Account Information)
  let maiContent = emvField('00', 'br.gov.bcb.pix');
  if (pixType === 'dynamic') {
    maiContent += emvField('25', cleanUrl);
  } else {
    maiContent += emvField('01', input.key);
  }
  if (pixType === 'static' && input.additionalInfo) {
    maiContent += emvField('02', input.additionalInfo.slice(0, 72));
  }

  let payload = '';
  payload += emvField('00', '01');
  payload += emvField('01', poi);
  payload += emvField('26', maiContent);
  payload += emvField('52', mcc);
  payload += emvField('53', currency);

  if (input.amount) {
    const numAmount = Number(input.amount.replace(',', '.').replace(/[^\d.]/g, ''));
    if (!Number.isNaN(numAmount) && numAmount > 0) {
      payload += emvField('54', numAmount.toFixed(2));
    }
  }

  payload += emvField('58', country);
  payload += emvField('59', merchantName);
  payload += emvField('60', merchantCity);

  // Additional Data
  const txid = pixType === 'dynamic' ? '***' : input.txid || '***';
  const additionalContent = emvField('05', txid.slice(0, 25));
  payload += emvField('62', additionalContent);

  // CRC placeholder then calculate
  payload += '6304';
  const crc = calculateCrc16(payload);
  payload += crc;

  const fields = parseEmvFields(payload);
  const pixData = extractPixData(fields, payload);
  const hasErrors = issues.some((i) => i.level === 'error');

  return {
    payload,
    pixData,
    fields,
    qrData: payload,
    isValid: !hasErrors,
    issues,
  };
}

// ---------- KEY VALIDATION ----------

function validatePixKey(keyType: PixKeyType, key: string): ValidationIssue | null {
  if (!key.trim()) {
    return { level: 'error', field: '26.01', message: 'Chave Pix é obrigatória.' };
  }

  switch (keyType) {
    case 'cpf': {
      const digits = key.replace(/\D/g, '');
      if (digits.length !== 11 || !isValidCpfDigits(digits)) {
        return { level: 'error', field: '26.01', message: 'CPF inválido.' };
      }
      break;
    }
    case 'cnpj': {
      const digits = key.replace(/\D/g, '');
      if (digits.length !== 14 || !isValidCnpjDigits(digits)) {
        return { level: 'error', field: '26.01', message: 'CNPJ inválido.' };
      }
      break;
    }
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) {
        return { level: 'error', field: '26.01', message: 'E-mail inválido.' };
      }
      break;
    case 'phone': {
      const phoneDigits = key.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        return { level: 'error', field: '26.01', message: 'Telefone inválido. Use formato E.164 (+5511999999999).' };
      }
      break;
    }
    case 'random':
      if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(key)) {
        return { level: 'warning', field: '26.01', message: 'Chave aleatória não parece UUID válido.' };
      }
      break;
    case 'manual':
      break;
  }

  return null;
}

function isValidCpfDigits(cpf: string): boolean {
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number.parseInt(cpf[i], 10) * (10 - i);
  let d1 = 11 - (sum % 11);
  if (d1 >= 10) d1 = 0;
  if (Number.parseInt(cpf[9], 10) !== d1) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number.parseInt(cpf[i], 10) * (11 - i);
  let d2 = 11 - (sum % 11);
  if (d2 >= 10) d2 = 0;
  return Number.parseInt(cpf[10], 10) === d2;
}

function isValidCnpjDigits(cnpj: string): boolean {
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number.parseInt(cnpj[i], 10) * weights1[i];
  const d1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (Number.parseInt(cnpj[12], 10) !== d1) return false;
  sum = 0;
  for (let i = 0; i < 13; i++) sum += Number.parseInt(cnpj[i], 10) * weights2[i];
  const d2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return Number.parseInt(cnpj[13], 10) === d2;
}

// ---------- FORMAT HELPERS ----------

export function formatKeyForPayload(keyType: PixKeyType, key: string): string {
  switch (keyType) {
    case 'cpf':
    case 'cnpj':
      return key.replace(/\D/g, '');
    case 'phone': {
      const digits = key.replace(/\D/g, '');
      if (digits.startsWith('55')) return `+${digits}`;
      if (digits.length === 11 || digits.length === 10) return `+55${digits}`;
      return key;
    }
    default:
      return key;
  }
}

// ---------- EXAMPLES ----------

export const PIX_EXAMPLES = {
  staticNoValue: '00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986580258025904Joao6009SAO PAULO62070503***6304',
  staticWithValue: '00020126330014br.gov.bcb.pix011112345678901520400005303986540510.005802BR5913MARIA SILVA6008BRASILIA62070503***6304',
  staticWithTxid: '00020126360014br.gov.bcb.pix011400112233445566520400005303986540525.505802BR5910JOSE SOUZA6010PORTO ALEGR62130509pgto123456304',
  dynamicExample: '00020101021226850014br.gov.bcb.pix2563qrcode-pix.exemplo.com.br/v2/abc123def456-7890-abcd-ef12345678905204000053039865802BR5920LOJA EXEMPLO LTDA6009SAO PAULO62070503***6304',
  invalidCrc: '00020126330014br.gov.bcb.pix011112345678901520400005303986540510.005802BR5913MARIA SILVA6008BRASILIA62070503***6304AAAA',
  incomplete: '00020126330014br.gov.bcb.pix011112345678901',
};

// Generate proper CRC for examples at runtime
export function getPixExamples(): Record<string, { label: string; payload: string; description: string }> {
  return {
    staticNoValue: {
      label: 'Pix estático sem valor',
      payload: fixCrc(PIX_EXAMPLES.staticNoValue),
      description: 'QR Code Pix estático com chave aleatória, sem valor definido.',
    },
    staticWithValue: {
      label: 'Pix estático com valor',
      payload: fixCrc(PIX_EXAMPLES.staticWithValue),
      description: 'QR Code Pix estático com CPF e valor de R$ 10,00.',
    },
    staticWithTxid: {
      label: 'Pix com TXID',
      payload: fixCrc(PIX_EXAMPLES.staticWithTxid),
      description: 'QR Code Pix estático com CNPJ, valor e identificador de transação.',
    },
    dynamicExample: {
      label: 'Pix dinâmico (exemplo)',
      payload: fixCrc(PIX_EXAMPLES.dynamicExample),
      description: 'QR Code Pix dinâmico com URL de location (exemplo ilustrativo).',
    },
    invalidCrc: {
      label: 'CRC inválido (teste)',
      payload: PIX_EXAMPLES.invalidCrc,
      description: 'Payload com CRC incorreto para testar correção.',
    },
    incomplete: {
      label: 'Payload incompleto (teste)',
      payload: PIX_EXAMPLES.incomplete,
      description: 'Payload cortado para testar validação.',
    },
  };
}

// ---------- EXPORT HELPERS ----------

export function pixToJson(result: PixValidationResult): string {
  return JSON.stringify({
    rawPayload: result.rawPayload,
    isValid: result.isValid,
    isPix: result.isPix,
    type: result.type,
    status: result.status,
    crc: result.crc,
    calculatedCrc: result.calculatedCrc,
    pixData: result.pixData,
    fields: result.fields.map((f) => ({
      id: f.id,
      name: f.name,
      length: f.length,
      value: f.value,
      category: f.category,
      children: f.children?.map((c) => ({
        id: c.id, name: c.name, length: c.length, value: c.value,
      })),
    })),
    warnings: result.issues.filter((i) => i.level === 'warning').map((i) => i.message),
    errors: result.issues.filter((i) => i.level === 'error').map((i) => i.message),
    createdAt: new Date().toISOString(),
  }, null, 2);
}

export function pixToCsv(pixData: PixData): string {
  const rows = [
    ['Campo', 'Valor'],
    ['Tipo', pixData.type],
    ['Chave', pixData.key ?? ''],
    ['Tipo da Chave', pixData.keyType ?? ''],
    ['Valor', pixData.amount ?? ''],
    ['Nome', pixData.merchantName ?? ''],
    ['Cidade', pixData.merchantCity ?? ''],
    ['País', pixData.countryCode ?? ''],
    ['Moeda', pixData.currency ?? ''],
    ['TXID', pixData.txid ?? ''],
    ['Info Adicional', pixData.additionalInfo ?? ''],
    ['URL', pixData.url ?? ''],
    ['MCC', pixData.merchantCategoryCode ?? ''],
    ['CRC', pixData.crcProvided ?? ''],
    ['CRC Válido', pixData.crcValid ? 'Sim' : 'Não'],
  ];
  return rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
}
