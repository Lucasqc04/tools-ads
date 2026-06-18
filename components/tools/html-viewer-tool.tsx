'use client';

import dynamic from 'next/dynamic';
import { type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { type Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { type Diagnostic, lintGutter, linter } from '@codemirror/lint';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  Brush,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileUp,
  Maximize2,
  Monitor,
  Moon,
  Play,
  RotateCcw,
  Smartphone,
  Tablet,
  TerminalSquare,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/cn';
import { type AppLocale } from '@/lib/i18n/config';

const CodeMirror = dynamic<ReactCodeMirrorProps>(
  () => import('@uiw/react-codemirror'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[430px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-500">
        Loading editor...
      </div>
    ),
  },
);

type HtmlViewerToolProps = Readonly<{
  locale?: AppLocale;
}>;

type SourceFileKind = 'html' | 'css' | 'js' | 'unsupported';
type EditorTab = Exclude<SourceFileKind, 'unsupported'>;
type PreviewViewport = 'desktop' | 'tablet' | 'mobile';
type EditorTheme = 'light' | 'dark';
type ConsoleLevel = 'log' | 'info' | 'warn' | 'error';
type IssueSeverity = 'error' | 'warning' | 'info';

type LoadedSourceFile = {
  id: string;
  name: string;
  kind: SourceFileKind;
  content: string;
};

type ConsoleEntry = {
  id: number;
  level: ConsoleLevel;
  message: string;
  at: string;
};

type CodeIssue = {
  kind: EditorTab;
  severity: IssueSeverity;
  message: string;
  line?: number;
  column?: number;
};

type TemplateId = 'starter' | 'landing' | 'email' | 'form' | 'table' | 'blank';

type HtmlTemplate = {
  id: TemplateId;
  label: string;
  description: string;
  html: string;
  css: string;
  js: string;
};

type HtmlViewerUi = {
  title: string;
  intro: string;
  editorTitle: string;
  htmlLabel: string;
  cssLabel: string;
  jsLabel: string;
  htmlPlaceholder: string;
  cssPlaceholder: string;
  jsPlaceholder: string;
  run: string;
  autoRun: string;
  format: string;
  clear: string;
  copyDocument: string;
  copied: string;
  download: string;
  templatesLabel: string;
  templatesHint: string;
  filesLabel: string;
  filesHint: string;
  htmlEntryLabel: string;
  unsupportedFilesWarning: string;
  noHtmlFileWarning: string;
  fileReadError: string;
  loadedFilesTitle: string;
  previewTitle: string;
  previewHint: string;
  desktop: string;
  tablet: string;
  mobile: string;
  fullscreen: string;
  editorFullscreen: string;
  exitFullscreen: string;
  openNewTab: string;
  consoleTitle: string;
  consoleHint: string;
  clearConsole: string;
  emptyConsole: string;
  issuesTitle: string;
  noIssues: string;
  securityHint: string;
  emptyPreviewHint: string;
  themeLight: string;
  themeDark: string;
};

const uiByLocale: Record<AppLocale, HtmlViewerUi> = {
  'pt-br': {
    title: 'HTML Editor com Preview, CSS, JS e Console',
    intro:
      'Edite HTML, CSS e JavaScript com highlight, numeros de linha, preview em sandbox, console capturado e exportacao em um arquivo .html.',
    editorTitle: 'Editor',
    htmlLabel: 'HTML',
    cssLabel: 'CSS',
    jsLabel: 'JavaScript',
    htmlPlaceholder: '<main><h1>Ola, mundo</h1></main>',
    cssPlaceholder: 'body { font-family: sans-serif; }',
    jsPlaceholder: "console.log('Preview pronto');",
    run: 'Executar',
    autoRun: 'Auto-run',
    format: 'Formatar',
    clear: 'Limpar',
    copyDocument: 'Copiar HTML final',
    copied: 'Copiado',
    download: 'Baixar .html',
    templatesLabel: 'Template rapido',
    templatesHint: 'Use um ponto de partida e ajuste o codigo no editor.',
    filesLabel: 'Importar arquivos',
    filesHint: 'Carregue .html, .css e .js para popular o editor.',
    htmlEntryLabel: 'HTML principal',
    unsupportedFilesWarning:
      'Alguns arquivos foram ignorados por extensao nao suportada. Use apenas .html, .css ou .js.',
    noHtmlFileWarning:
      'Nenhum arquivo HTML foi encontrado. Inclua ao menos um .html para montar o preview.',
    fileReadError: 'Nao foi possivel ler um ou mais arquivos selecionados. Tente novamente.',
    loadedFilesTitle: 'Arquivos carregados',
    previewTitle: 'Preview',
    previewHint: 'O iframe executa CSS e JS em sandbox e envia logs para o console abaixo.',
    desktop: 'Desktop',
    tablet: 'Tablet',
    mobile: 'Mobile',
    fullscreen: 'Tela cheia',
    editorFullscreen: 'Tela cheia editor',
    exitFullscreen: 'Sair da tela cheia',
    openNewTab: 'Nova aba',
    consoleTitle: 'Console',
    consoleHint: 'Logs, warnings, errors e promises rejeitadas aparecem aqui.',
    clearConsole: 'Limpar console',
    emptyConsole: 'Sem logs ainda. Execute o preview ou use console.log no JS.',
    issuesTitle: 'Checagens',
    noIssues: 'Nenhum problema simples encontrado.',
    securityHint:
      'Dica de seguranca: execute apenas codigo confiavel. Scripts rodam no preview sandboxed.',
    emptyPreviewHint: 'Adicione HTML para visualizar o resultado.',
    themeLight: 'Claro',
    themeDark: 'Escuro',
  },
  en: {
    title: 'HTML Editor with Live Preview, CSS, JS, and Console',
    intro:
      'Edit HTML, CSS, and JavaScript with syntax highlighting, line numbers, sandbox preview, captured console, and one-click .html export.',
    editorTitle: 'Editor',
    htmlLabel: 'HTML',
    cssLabel: 'CSS',
    jsLabel: 'JavaScript',
    htmlPlaceholder: '<main><h1>Hello world</h1></main>',
    cssPlaceholder: 'body { font-family: sans-serif; }',
    jsPlaceholder: "console.log('Preview ready');",
    run: 'Run',
    autoRun: 'Auto-run',
    format: 'Format',
    clear: 'Clear',
    copyDocument: 'Copy final HTML',
    copied: 'Copied',
    download: 'Download .html',
    templatesLabel: 'Quick template',
    templatesHint: 'Start from a template and adjust the code in the editor.',
    filesLabel: 'Import files',
    filesHint: 'Load .html, .css, and .js files to populate the editor.',
    htmlEntryLabel: 'Main HTML',
    unsupportedFilesWarning:
      'Some files were ignored because their extension is not supported. Use .html, .css, or .js only.',
    noHtmlFileWarning:
      'No HTML file was found. Include at least one .html file to build the preview.',
    fileReadError: 'Could not read one or more selected files. Please try again.',
    loadedFilesTitle: 'Loaded files',
    previewTitle: 'Preview',
    previewHint: 'The iframe runs CSS and JS in a sandbox and forwards logs to the console below.',
    desktop: 'Desktop',
    tablet: 'Tablet',
    mobile: 'Mobile',
    fullscreen: 'Fullscreen',
    editorFullscreen: 'Editor fullscreen',
    exitFullscreen: 'Exit fullscreen',
    openNewTab: 'New tab',
    consoleTitle: 'Console',
    consoleHint: 'Logs, warnings, errors, and rejected promises appear here.',
    clearConsole: 'Clear console',
    emptyConsole: 'No logs yet. Run the preview or use console.log in JS.',
    issuesTitle: 'Checks',
    noIssues: 'No simple issues found.',
    securityHint:
      'Security tip: run trusted code only. Scripts execute inside the sandboxed preview.',
    emptyPreviewHint: 'Add HTML content to render preview.',
    themeLight: 'Light',
    themeDark: 'Dark',
  },
  es: {
    title: 'Editor HTML con Vista Previa, CSS, JS y Consola',
    intro:
      'Edita HTML, CSS y JavaScript con resaltado, numeros de linea, preview en sandbox, consola capturada y exportacion .html.',
    editorTitle: 'Editor',
    htmlLabel: 'HTML',
    cssLabel: 'CSS',
    jsLabel: 'JavaScript',
    htmlPlaceholder: '<main><h1>Hola mundo</h1></main>',
    cssPlaceholder: 'body { font-family: sans-serif; }',
    jsPlaceholder: "console.log('Preview listo');",
    run: 'Ejecutar',
    autoRun: 'Auto-run',
    format: 'Formatear',
    clear: 'Limpiar',
    copyDocument: 'Copiar HTML final',
    copied: 'Copiado',
    download: 'Descargar .html',
    templatesLabel: 'Template rapido',
    templatesHint: 'Usa una base y ajusta el codigo en el editor.',
    filesLabel: 'Importar archivos',
    filesHint: 'Carga .html, .css y .js para poblar el editor.',
    htmlEntryLabel: 'HTML principal',
    unsupportedFilesWarning:
      'Algunos archivos fueron ignorados por extension no soportada. Usa solo .html, .css o .js.',
    noHtmlFileWarning:
      'No se encontro archivo HTML. Incluye al menos un .html para montar el preview.',
    fileReadError: 'No fue posible leer uno o mas archivos seleccionados. Intentalo de nuevo.',
    loadedFilesTitle: 'Archivos cargados',
    previewTitle: 'Vista previa',
    previewHint: 'El iframe ejecuta CSS y JS en sandbox y envia logs a la consola abajo.',
    desktop: 'Desktop',
    tablet: 'Tablet',
    mobile: 'Mobile',
    fullscreen: 'Pantalla completa',
    editorFullscreen: 'Editor pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
    openNewTab: 'Nueva pestana',
    consoleTitle: 'Consola',
    consoleHint: 'Logs, warnings, errors y promises rechazadas aparecen aqui.',
    clearConsole: 'Limpiar consola',
    emptyConsole: 'Sin logs aun. Ejecuta el preview o usa console.log en JS.',
    issuesTitle: 'Chequeos',
    noIssues: 'No se encontraron problemas simples.',
    securityHint:
      'Consejo de seguridad: ejecuta solo codigo confiable. Los scripts corren dentro del preview sandboxed.',
    emptyPreviewHint: 'Agrega HTML para renderizar la vista previa.',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
  },
};

const templateLabels: Record<AppLocale, Record<TemplateId, Pick<HtmlTemplate, 'label' | 'description'>>> = {
  'pt-br': {
    starter: { label: 'Componente inicial', description: 'Pagina simples com botao e interacao.' },
    landing: { label: 'Secao de landing', description: 'Hero com CTA, lista de beneficios e prova.' },
    email: { label: 'Email HTML', description: 'Estrutura compativel com emails e tabela.' },
    form: { label: 'Formulario', description: 'Formulario com validacao JavaScript simples.' },
    table: { label: 'Tabela responsiva', description: 'Tabela com estilos e ordenacao basica.' },
    blank: { label: 'Em branco', description: 'Comece do zero.' },
  },
  en: {
    starter: { label: 'Starter component', description: 'Simple page with a button and interaction.' },
    landing: { label: 'Landing section', description: 'Hero with CTA, benefits, and proof card.' },
    email: { label: 'HTML email', description: 'Email-friendly table structure.' },
    form: { label: 'Form demo', description: 'Form with simple JavaScript validation.' },
    table: { label: 'Responsive table', description: 'Styled table with basic sorting.' },
    blank: { label: 'Blank', description: 'Start from zero.' },
  },
  es: {
    starter: { label: 'Componente inicial', description: 'Pagina simple con boton e interaccion.' },
    landing: { label: 'Seccion landing', description: 'Hero con CTA, beneficios y prueba.' },
    email: { label: 'Email HTML', description: 'Estructura de tabla compatible con emails.' },
    form: { label: 'Formulario', description: 'Formulario con validacion JavaScript simple.' },
    table: { label: 'Tabla responsiva', description: 'Tabla con estilos y ordenacion basica.' },
    blank: { label: 'En blanco', description: 'Empieza desde cero.' },
  },
};

const starterTemplate = {
  html: `<main class="hero">
  <p class="eyebrow">HTML Viewer</p>
  <h1>Real-time preview</h1>
  <p>Edit HTML, CSS, and JS, then inspect console messages from the sandbox.</p>
  <button id="cta">Run interaction</button>
</main>`,
  css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: Inter, system-ui, sans-serif;
  color: #172033;
  background: #f6f8fb;
}

.hero {
  width: min(680px, calc(100vw - 32px));
  padding: 32px;
  border: 1px solid #d8e0ea;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 18px 50px rgba(23, 32, 51, 0.12);
}

.eyebrow {
  margin: 0 0 8px;
  color: #0f766e;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 6vw, 4rem);
}

button {
  margin-top: 20px;
  border: 0;
  border-radius: 8px;
  padding: 12px 16px;
  background: #1d4ed8;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
}`,
  js: `const button = document.getElementById('cta');

button?.addEventListener('click', () => {
  console.log('Button clicked from sandbox preview');
  button.textContent = 'Interaction worked';
  button.style.background = '#0f766e';
});`,
};

const landingTemplate = {
  html: `<main class="page">
  <section class="hero">
    <div>
      <p class="eyebrow">Product update</p>
      <h1>Launch a sharper HTML preview workflow</h1>
      <p class="lead">Use this template to test spacing, buttons, cards, responsive states, and script behavior.</p>
      <a href="#features" class="button">View features</a>
    </div>
    <aside class="proof">
      <strong>98%</strong>
      <span>faster QA loop</span>
    </aside>
  </section>
  <section id="features" class="features">
    <article>Preview desktop and mobile.</article>
    <article>Check console logs quickly.</article>
    <article>Export a complete HTML file.</article>
  </section>
</main>`,
  css: `body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  background: #f4f7f5;
  color: #172033;
}

.page {
  min-height: 100vh;
  padding: 32px;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 24px;
  align-items: end;
  min-height: 68vh;
  border-bottom: 1px solid #ced8d2;
}

.eyebrow {
  color: #0f766e;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

h1 {
  max-width: 900px;
  margin: 0;
  font-size: clamp(2.5rem, 8vw, 6rem);
  line-height: 0.95;
}

.lead {
  max-width: 620px;
  color: #475569;
  font-size: 1.1rem;
}

.button {
  display: inline-flex;
  margin-top: 16px;
  border-radius: 8px;
  padding: 12px 16px;
  background: #172033;
  color: white;
  font-weight: 800;
  text-decoration: none;
}

.proof {
  border: 1px solid #ced8d2;
  border-radius: 10px;
  padding: 18px;
  background: #fff;
}

.proof strong {
  display: block;
  font-size: 48px;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 24px;
}

.features article {
  border: 1px solid #ced8d2;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
}

@media (max-width: 720px) {
  .page { padding: 20px; }
  .hero, .features { grid-template-columns: 1fr; }
}`,
  js: `document.querySelectorAll('.features article').forEach((card, index) => {
  card.addEventListener('click', () => {
    console.log('Feature selected', index + 1);
    card.toggleAttribute('data-active');
  });
});`,
};

const emailTemplate = {
  html: `<table role="presentation" class="email" cellspacing="0" cellpadding="0">
  <tr>
    <td class="header">
      <h1>Weekly report</h1>
      <p>Summary, metrics, and next actions.</p>
    </td>
  </tr>
  <tr>
    <td class="body">
      <p>Hello,</p>
      <p>This HTML email template keeps layout simple for better client support.</p>
      <a class="button" href="https://example.com">Open dashboard</a>
    </td>
  </tr>
</table>`,
  css: `body {
  margin: 0;
  padding: 24px;
  background: #edf2f7;
  font-family: Arial, sans-serif;
}

.email {
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
}

.header {
  padding: 28px;
  background: #172033;
  color: #ffffff;
}

.header h1 {
  margin: 0 0 8px;
}

.body {
  padding: 28px;
  color: #334155;
}

.button {
  display: inline-block;
  margin-top: 12px;
  border-radius: 6px;
  padding: 12px 16px;
  background: #0f766e;
  color: #ffffff;
  font-weight: bold;
  text-decoration: none;
}`,
  js: `console.log('Email template preview loaded');`,
};

const formTemplate = {
  html: `<form id="signup" novalidate>
  <h1>Join the beta</h1>
  <label>
    Email
    <input id="email" type="email" placeholder="you@example.com" />
  </label>
  <button type="submit">Submit</button>
  <p id="message" aria-live="polite"></p>
</form>`,
  css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f8fafc;
  font-family: Inter, system-ui, sans-serif;
}

form {
  width: min(420px, calc(100vw - 32px));
  border: 1px solid #d8e0ea;
  border-radius: 10px;
  padding: 24px;
  background: white;
}

label {
  display: grid;
  gap: 8px;
  color: #334155;
  font-weight: 700;
}

input {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px;
  font: inherit;
}

button {
  width: 100%;
  margin-top: 16px;
  border: 0;
  border-radius: 8px;
  padding: 12px;
  background: #1d4ed8;
  color: white;
  font-weight: 800;
}`,
  js: `const form = document.getElementById('signup');
const email = document.getElementById('email');
const message = document.getElementById('message');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const valid = email?.value.includes('@');
  message.textContent = valid ? 'Ready to submit.' : 'Enter a valid email.';
  console[valid ? 'log' : 'warn'](message.textContent);
});`,
};

const tableTemplate = {
  html: `<main>
  <h1>Revenue by channel</h1>
  <table>
    <thead>
      <tr><th>Channel</th><th>Visitors</th><th>Revenue</th></tr>
    </thead>
    <tbody>
      <tr><td>Search</td><td>12,430</td><td>$48,900</td></tr>
      <tr><td>Direct</td><td>8,220</td><td>$31,400</td></tr>
      <tr><td>Social</td><td>5,810</td><td>$12,700</td></tr>
    </tbody>
  </table>
</main>`,
  css: `body {
  margin: 0;
  padding: 24px;
  background: #f6f8fb;
  color: #172033;
  font-family: Inter, system-ui, sans-serif;
}

main {
  max-width: 820px;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: 8px;
  background: white;
}

th, td {
  padding: 14px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

th {
  background: #172033;
  color: white;
}

tr:hover td {
  background: #f1f5f9;
}`,
  js: `document.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    console.log('Selected row:', row.innerText);
  });
});`,
};

const templateCode: Record<TemplateId, Pick<HtmlTemplate, 'html' | 'css' | 'js'>> = {
  starter: starterTemplate,
  landing: landingTemplate,
  email: emailTemplate,
  form: formTemplate,
  table: tableTemplate,
  blank: { html: '', css: '', js: '' },
};

const templateCodeByLocale: Record<AppLocale, Record<TemplateId, Pick<HtmlTemplate, 'html' | 'css' | 'js'>>> = {
  en: templateCode,
  'pt-br': {
    ...templateCode,
    starter: {
      ...starterTemplate,
      html: `<main class="hero">
  <p class="eyebrow">HTML Viewer</p>
  <h1>Preview em tempo real</h1>
  <p>Edite HTML, CSS e JS e veja mensagens do console direto do sandbox.</p>
  <button id="cta">Executar interacao</button>
</main>`,
      js: `const button = document.getElementById('cta');

button?.addEventListener('click', () => {
  console.log('Botao clicado no preview sandbox');
  button.textContent = 'Interacao funcionando';
  button.style.background = '#0f766e';
});`,
    },
    landing: {
      ...landingTemplate,
      html: `<main class="page">
  <section class="hero">
    <div>
      <p class="eyebrow">Novidade do produto</p>
      <h1>Crie um fluxo melhor para testar HTML</h1>
      <p class="lead">Use este template para testar espacamento, botoes, cards, responsividade e comportamento de scripts.</p>
      <a href="#features" class="button">Ver recursos</a>
    </div>
    <aside class="proof">
      <strong>98%</strong>
      <span>ciclo de QA mais rapido</span>
    </aside>
  </section>
  <section id="features" class="features">
    <article>Preview desktop e mobile.</article>
    <article>Logs de console em poucos segundos.</article>
    <article>Exportacao de HTML completo.</article>
  </section>
</main>`,
      js: `document.querySelectorAll('.features article').forEach((card, index) => {
  card.addEventListener('click', () => {
    console.log('Recurso selecionado', index + 1);
    card.toggleAttribute('data-active');
  });
});`,
    },
    email: {
      ...emailTemplate,
      html: `<table role="presentation" class="email" cellspacing="0" cellpadding="0">
  <tr>
    <td class="header">
      <h1>Relatorio semanal</h1>
      <p>Resumo, metricas e proximas acoes.</p>
    </td>
  </tr>
  <tr>
    <td class="body">
      <p>Ola,</p>
      <p>Este template de email HTML mantem a estrutura simples para maior compatibilidade.</p>
      <a class="button" href="https://example.com">Abrir painel</a>
    </td>
  </tr>
</table>`,
      js: `console.log('Preview do template de email carregado');`,
    },
    form: {
      ...formTemplate,
      html: `<form id="signup" novalidate>
  <h1>Entrar na beta</h1>
  <label>
    Email
    <input id="email" type="email" placeholder="voce@exemplo.com" />
  </label>
  <button type="submit">Enviar</button>
  <p id="message" aria-live="polite"></p>
</form>`,
      js: `const form = document.getElementById('signup');
const email = document.getElementById('email');
const message = document.getElementById('message');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const valid = email?.value.includes('@');
  message.textContent = valid ? 'Pronto para enviar.' : 'Digite um email valido.';
  console[valid ? 'log' : 'warn'](message.textContent);
});`,
    },
    table: {
      ...tableTemplate,
      html: `<main>
  <h1>Receita por canal</h1>
  <table>
    <thead>
      <tr><th>Canal</th><th>Visitantes</th><th>Receita</th></tr>
    </thead>
    <tbody>
      <tr><td>Busca</td><td>12.430</td><td>R$ 48.900</td></tr>
      <tr><td>Direto</td><td>8.220</td><td>R$ 31.400</td></tr>
      <tr><td>Social</td><td>5.810</td><td>R$ 12.700</td></tr>
    </tbody>
  </table>
</main>`,
      js: `document.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    console.log('Linha selecionada:', row.innerText);
  });
});`,
    },
  },
  es: {
    ...templateCode,
    starter: {
      ...starterTemplate,
      html: `<main class="hero">
  <p class="eyebrow">HTML Viewer</p>
  <h1>Vista previa en tiempo real</h1>
  <p>Edita HTML, CSS y JS y revisa mensajes de consola desde el sandbox.</p>
  <button id="cta">Ejecutar interaccion</button>
</main>`,
      js: `const button = document.getElementById('cta');

button?.addEventListener('click', () => {
  console.log('Boton clicado desde el preview sandbox');
  button.textContent = 'Interaccion funcionando';
  button.style.background = '#0f766e';
});`,
    },
    landing: {
      ...landingTemplate,
      html: `<main class="page">
  <section class="hero">
    <div>
      <p class="eyebrow">Novedad del producto</p>
      <h1>Crea un mejor flujo para probar HTML</h1>
      <p class="lead">Usa este template para probar espacios, botones, cards, responsividad y comportamiento de scripts.</p>
      <a href="#features" class="button">Ver recursos</a>
    </div>
    <aside class="proof">
      <strong>98%</strong>
      <span>ciclo de QA mas rapido</span>
    </aside>
  </section>
  <section id="features" class="features">
    <article>Preview desktop y mobile.</article>
    <article>Logs de consola rapidamente.</article>
    <article>Exportacion de HTML completo.</article>
  </section>
</main>`,
      js: `document.querySelectorAll('.features article').forEach((card, index) => {
  card.addEventListener('click', () => {
    console.log('Recurso seleccionado', index + 1);
    card.toggleAttribute('data-active');
  });
});`,
    },
    email: {
      ...emailTemplate,
      html: `<table role="presentation" class="email" cellspacing="0" cellpadding="0">
  <tr>
    <td class="header">
      <h1>Reporte semanal</h1>
      <p>Resumen, metricas y proximas acciones.</p>
    </td>
  </tr>
  <tr>
    <td class="body">
      <p>Hola,</p>
      <p>Este template de email HTML mantiene una estructura simple para mayor compatibilidad.</p>
      <a class="button" href="https://example.com">Abrir panel</a>
    </td>
  </tr>
</table>`,
      js: `console.log('Preview del template de email cargado');`,
    },
    form: {
      ...formTemplate,
      html: `<form id="signup" novalidate>
  <h1>Entrar en la beta</h1>
  <label>
    Email
    <input id="email" type="email" placeholder="tu@ejemplo.com" />
  </label>
  <button type="submit">Enviar</button>
  <p id="message" aria-live="polite"></p>
</form>`,
      js: `const form = document.getElementById('signup');
const email = document.getElementById('email');
const message = document.getElementById('message');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const valid = email?.value.includes('@');
  message.textContent = valid ? 'Listo para enviar.' : 'Escribe un email valido.';
  console[valid ? 'log' : 'warn'](message.textContent);
});`,
    },
    table: {
      ...tableTemplate,
      html: `<main>
  <h1>Ingresos por canal</h1>
  <table>
    <thead>
      <tr><th>Canal</th><th>Visitantes</th><th>Ingresos</th></tr>
    </thead>
    <tbody>
      <tr><td>Busqueda</td><td>12.430</td><td>$48.900</td></tr>
      <tr><td>Directo</td><td>8.220</td><td>$31.400</td></tr>
      <tr><td>Social</td><td>5.810</td><td>$12.700</td></tr>
    </tbody>
  </table>
</main>`,
      js: `document.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    console.log('Fila seleccionada:', row.innerText);
  });
});`,
    },
  },
};

const getTemplates = (locale: AppLocale): HtmlTemplate[] =>
  (Object.keys(templateCodeByLocale[locale]) as TemplateId[]).map((id) => ({
    id,
    ...templateLabels[locale][id],
    ...templateCodeByLocale[locale][id],
  }));

const editorTabLabels: Record<EditorTab, keyof Pick<HtmlViewerUi, 'htmlLabel' | 'cssLabel' | 'jsLabel'>> = {
  html: 'htmlLabel',
  css: 'cssLabel',
  js: 'jsLabel',
};

const voidHtmlTags = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const consoleEventSource = 'adtools-html-viewer-console';

const consoleBridgeScript = `<script>
(function () {
  var source = '${consoleEventSource}';
  function stringify(value) {
    try {
      if (value instanceof Error) return value.name + ': ' + value.message;
      if (typeof value === 'string') return value;
      return JSON.stringify(value);
    } catch (error) {
      return String(value);
    }
  }
  function send(level, args) {
    parent.postMessage({
      source: source,
      level: level,
      message: Array.prototype.slice.call(args).map(stringify).join(' '),
      time: new Date().toLocaleTimeString()
    }, '*');
  }
  ['log', 'info', 'warn', 'error'].forEach(function (level) {
    var original = console[level];
    console[level] = function () {
      send(level, arguments);
      original.apply(console, arguments);
    };
  });
  window.addEventListener('error', function (event) {
    send('error', [event.message + ' at ' + event.lineno + ':' + event.colno]);
  });
  window.addEventListener('unhandledrejection', function (event) {
    send('error', ['Unhandled promise rejection', event.reason]);
  });
})();
</script>`;

const modeButtonClass = (active: boolean) =>
  cn(
    'inline-flex h-9 items-center rounded-lg border px-3 text-xs font-semibold transition',
    active
      ? 'border-slate-900 bg-slate-900 text-white'
      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  );

const getSourceFileKind = (name: string): SourceFileKind => {
  const normalized = name.toLowerCase();

  if (normalized.endsWith('.html') || normalized.endsWith('.htm')) {
    return 'html';
  }

  if (normalized.endsWith('.css')) {
    return 'css';
  }

  if (normalized.endsWith('.js')) {
    return 'js';
  }

  return 'unsupported';
};

const readFileText = async (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsText(file);
  });

const ensureHtmlDocument = (inputHtml: string): string => {
  const trimmed = inputHtml.trim();

  if (!trimmed) {
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>HTML Preview</title>
  </head>
  <body></body>
</html>`;
  }

  if (/<html[\s>]/i.test(trimmed)) {
    return trimmed;
  }

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>HTML Preview</title>
  </head>
  <body>
${trimmed}
  </body>
</html>`;
};

const escapeInlineCss = (value: string): string => value.replace(/<\/style/gi, '<\\/style');
const escapeInlineScript = (value: string): string => value.replace(/<\/script/gi, '<\\/script');

const injectIntoHead = (documentHtml: string, tag: string): string => {
  if (/<\/head>/i.test(documentHtml)) {
    return documentHtml.replace(/<\/head>/i, `${tag}\n</head>`);
  }

  return `${tag}\n${documentHtml}`;
};

const injectIntoBody = (documentHtml: string, tag: string): string => {
  if (/<\/body>/i.test(documentHtml)) {
    return documentHtml.replace(/<\/body>/i, `${tag}\n</body>`);
  }

  return `${documentHtml}\n${tag}`;
};

const injectStyleAndScript = (baseHtml: string, stylesheet: string, script: string): string => {
  let next = ensureHtmlDocument(baseHtml);

  next = injectIntoHead(next, consoleBridgeScript);

  if (stylesheet.trim()) {
    next = injectIntoHead(next, `<style id="preview-inline-css">\n${escapeInlineCss(stylesheet)}\n</style>`);
  }

  if (script.trim()) {
    next = injectIntoBody(next, `<script id="preview-inline-js">\n${escapeInlineScript(script)}\n</script>`);
  }

  return next;
};

const joinFileBundle = (files: LoadedSourceFile[], kind: 'css' | 'js') =>
  files
    .filter((file) => file.kind === kind)
    .map((file) => `/* ${file.name} */\n${file.content}`)
    .join('\n\n');

const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

const getLineAndColumnFromOffset = (value: string, offset: number): { line: number; column: number } => {
  const prefix = value.slice(0, Math.max(0, Math.min(value.length, offset)));
  const lines = prefix.split('\n');

  return {
    line: lines.length,
    column: lines[lines.length - 1]?.length ?? 0,
  };
};

const getOffsetFromLine = (value: string, line = 1, column = 0): number => {
  const lines = value.split('\n');
  const safeLine = Math.max(1, Math.min(line, lines.length));
  let offset = 0;

  for (let index = 0; index < safeLine - 1; index += 1) {
    offset += lines[index]!.length + 1;
  }

  return Math.min(value.length, offset + Math.max(0, column));
};

const inspectHtml = (value: string): CodeIssue[] => {
  const issues: CodeIssue[] = [];
  const stack: Array<{ tag: string; index: number }> = [];
  const tagPattern = /<\/?([a-zA-Z][\w:-]*)(?:\s[^<>]*)?>/g;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(value)) !== null) {
    const raw = match[0];
    const tag = match[1]!.toLowerCase();

    if (voidHtmlTags.has(tag) || raw.endsWith('/>') || raw.startsWith('<!')) {
      continue;
    }

    if (raw.startsWith('</')) {
      const last = stack.pop();
      if (!last || last.tag !== tag) {
        const position = getLineAndColumnFromOffset(value, match.index);
        issues.push({
          kind: 'html',
          severity: 'warning',
          message: `Unexpected closing tag </${tag}>.`,
          line: position.line,
          column: position.column,
        });
      }
      continue;
    }

    stack.push({ tag, index: match.index });
  }

  stack.slice(-5).forEach((item) => {
    const position = getLineAndColumnFromOffset(value, item.index);
    issues.push({
      kind: 'html',
      severity: 'warning',
      message: `Possibly unclosed <${item.tag}> tag.`,
      line: position.line,
      column: position.column,
    });
  });

  return issues;
};

const inspectCss = (value: string): CodeIssue[] => {
  const issues: CodeIssue[] = [];
  const stack: number[] = [];

  Array.from(value).forEach((char, index) => {
    if (char === '{') {
      stack.push(index);
      return;
    }

    if (char === '}') {
      if (!stack.length) {
        const position = getLineAndColumnFromOffset(value, index);
        issues.push({
          kind: 'css',
          severity: 'warning',
          message: 'Unexpected closing brace.',
          line: position.line,
          column: position.column,
        });
        return;
      }

      stack.pop();
    }
  });

  stack.slice(-5).forEach((index) => {
    const position = getLineAndColumnFromOffset(value, index);
    issues.push({
      kind: 'css',
      severity: 'warning',
      message: 'Possible missing closing brace.',
      line: position.line,
      column: position.column,
    });
  });

  return issues;
};

const inspectJs = (value: string): CodeIssue[] => {
  if (!value.trim()) {
    return [];
  }

  try {
    // Syntax check only; the code is not executed here.
    // eslint-disable-next-line no-new-func
    new Function(value);
    return [];
  } catch (error) {
    const message = error instanceof Error ? error.message : 'JavaScript syntax error.';
    const stack = error instanceof Error ? String(error.stack ?? '') : '';
    const match = stack.match(/<anonymous>:(\d+):(\d+)/);
    const line = match ? Math.max(1, Number(match[1]) - 2) : 1;
    const column = match ? Math.max(0, Number(match[2]) - 1) : 0;

    return [{ kind: 'js', severity: 'error', message, line, column }];
  }
};

const inspectSource = (kind: EditorTab, value: string): CodeIssue[] => {
  if (kind === 'html') {
    return inspectHtml(value);
  }

  if (kind === 'css') {
    return inspectCss(value);
  }

  return inspectJs(value);
};

const issueToDiagnostic = (value: string, issue: CodeIssue): Diagnostic => {
  const from = getOffsetFromLine(value, issue.line, issue.column);

  return {
    from,
    to: Math.min(value.length, from + 1),
    severity: issue.severity,
    message: issue.message,
  };
};

const getLanguageExtension = (kind: EditorTab): Extension => {
  if (kind === 'html') {
    return html();
  }

  if (kind === 'css') {
    return css();
  }

  return javascript({ jsx: true, typescript: false });
};

const formatHtml = (value: string): string => {
  const compact = value
    .replace(/>\s+</g, '>\n<')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  let depth = 0;

  return compact
    .map((line) => {
      const isClosing = /^<\//.test(line);
      const isOpening = /^<[^!/][^>]*[^/]?>$/.test(line) && !voidHtmlTags.has(line.match(/^<([a-zA-Z][\w:-]*)/)?.[1]?.toLowerCase() ?? '');

      if (isClosing) {
        depth = Math.max(0, depth - 1);
      }

      const output = `${'  '.repeat(depth)}${line}`;

      if (isOpening && !line.includes('</')) {
        depth += 1;
      }

      return output;
    })
    .join('\n');
};

const formatBraces = (value: string): string => {
  let depth = 0;

  return value
    .replace(/\{/g, ' {\n')
    .replace(/\}/g, '\n}\n')
    .replace(/;/g, ';\n')
    .split('\n')
    .map((rawLine) => rawLine.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith('}')) {
        depth = Math.max(0, depth - 1);
      }

      const output = `${'  '.repeat(depth)}${line}`;

      if (line.endsWith('{')) {
        depth += 1;
      }

      return output;
    })
    .join('\n');
};

const formatCode = (kind: EditorTab, value: string): string => {
  if (!value.trim()) {
    return value;
  }

  if (kind === 'html') {
    return formatHtml(value);
  }

  return formatBraces(value);
};

type CodeEditorProps = {
  kind: EditorTab;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  theme: EditorTheme;
  height: string;
};

function CodeEditor({ kind, value, onChange, placeholder, theme, height }: Readonly<CodeEditorProps>) {
  const extensions = useMemo(
    () => [
      getLanguageExtension(kind),
      lintGutter(),
      linter((view) => inspectSource(kind, view.state.doc.toString()).map((issue) => issueToDiagnostic(view.state.doc.toString(), issue))),
      EditorView.lineWrapping,
    ],
    [kind],
  );

  return (
    <CodeMirror
      value={value}
      height={height}
      theme={theme === 'dark' ? oneDark : 'light'}
      extensions={extensions}
      placeholder={placeholder}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        searchKeymap: true,
      }}
      className="overflow-hidden rounded-lg border border-slate-200 text-sm"
      onChange={onChange}
    />
  );
}

const viewportClasses: Record<PreviewViewport, string> = {
  desktop: 'w-full',
  tablet: 'w-[768px] max-w-full',
  mobile: 'w-[390px] max-w-full',
};

const consoleLevelClasses: Record<ConsoleLevel, string> = {
  log: 'border-slate-200 bg-slate-50 text-slate-700',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
  warn: 'border-amber-200 bg-amber-50 text-amber-900',
  error: 'border-red-200 bg-red-50 text-red-800',
};

export function HtmlViewerTool({ locale = 'pt-br' }: HtmlViewerToolProps) {
  const ui = uiByLocale[locale];
  const templates = useMemo(() => getTemplates(locale), [locale]);
  const starter = templates[0] ?? getTemplates('en')[0]!;
  const editorPanelRef = useRef<HTMLDivElement | null>(null);
  const editorSplitContainerRef = useRef<HTMLDivElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  const [activeTab, setActiveTab] = useState<EditorTab>('html');
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>(starter.id);
  const [htmlInput, setHtmlInput] = useState(starter.html);
  const [cssInput, setCssInput] = useState(starter.css);
  const [jsInput, setJsInput] = useState(starter.js);
  const [renderedDocument, setRenderedDocument] = useState(() =>
    injectStyleAndScript(starter.html, starter.css, starter.js),
  );
  const [autoRun, setAutoRun] = useState(true);
  const [editorTheme, setEditorTheme] = useState<EditorTheme>('light');
  const [previewViewport, setPreviewViewport] = useState<PreviewViewport>('desktop');
  const [loadedFiles, setLoadedFiles] = useState<LoadedSourceFile[]>([]);
  const [selectedHtmlFileId, setSelectedHtmlFileId] = useState<string>('');
  const [warningMessage, setWarningMessage] = useState('');
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  const [editorSplitRatio, setEditorSplitRatio] = useState(52);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [copiedActionId, setCopiedActionId] = useState('');

  const htmlFiles = useMemo(
    () => loadedFiles.filter((file) => file.kind === 'html'),
    [loadedFiles],
  );

  const previewDocument = useMemo(
    () => injectStyleAndScript(htmlInput, cssInput, jsInput),
    [cssInput, htmlInput, jsInput],
  );

  const allIssues = useMemo(
    () => [
      ...inspectHtml(htmlInput),
      ...inspectCss(cssInput),
      ...inspectJs(jsInput),
    ],
    [cssInput, htmlInput, jsInput],
  );

  const currentValue = activeTab === 'html' ? htmlInput : activeTab === 'css' ? cssInput : jsInput;
  const currentPlaceholder =
    activeTab === 'html' ? ui.htmlPlaceholder : activeTab === 'css' ? ui.cssPlaceholder : ui.jsPlaceholder;

  useEffect(() => {
    const nextTemplates = getTemplates(locale);
    const nextTemplate =
      nextTemplates.find((template) => template.id === selectedTemplateId) ?? nextTemplates[0]!;

    setHtmlInput(nextTemplate.html);
    setCssInput(nextTemplate.css);
    setJsInput(nextTemplate.js);
    setRenderedDocument(injectStyleAndScript(nextTemplate.html, nextTemplate.css, nextTemplate.js));
    setConsoleEntries([]);
  }, [locale, selectedTemplateId]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsPreviewFullscreen(document.fullscreenElement === previewContainerRef.current);
      setIsEditorFullscreen(document.fullscreenElement === editorPanelRef.current);
    };

    window.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as Partial<{
        source: string;
        level: ConsoleLevel;
        message: string;
        time: string;
      }>;

      const level = data.level;
      const message = data.message;

      if (data.source !== consoleEventSource || !level || !message) {
        return;
      }

      setConsoleEntries((current) => [
        ...current.slice(-79),
        {
          id: Date.now() + Math.random(),
          level,
          message,
          at: data.time ?? new Date().toLocaleTimeString(),
        },
      ]);
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!autoRun) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setConsoleEntries([]);
      setRenderedDocument(previewDocument);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [autoRun, previewDocument]);

  const handleRunPreview = () => {
    setConsoleEntries([]);
    setRenderedDocument(previewDocument);
  };

  const handleTemplateChange = (templateId: TemplateId) => {
    const template = templates.find((item) => item.id === templateId);

    if (!template) {
      return;
    }

    setSelectedTemplateId(template.id);
    setHtmlInput(template.html);
    setCssInput(template.css);
    setJsInput(template.js);
    setActiveTab('html');
    setWarningMessage('');
    setConsoleEntries([]);
    setRenderedDocument(injectStyleAndScript(template.html, template.css, template.js));
  };

  const handleClearEditor = () => {
    setHtmlInput('');
    setCssInput('');
    setJsInput('');
    setConsoleEntries([]);
    setWarningMessage('');
  };

  const handleFormatActiveTab = () => {
    const formatted = formatCode(activeTab, currentValue);

    if (activeTab === 'html') {
      setHtmlInput(formatted);
      return;
    }

    if (activeTab === 'css') {
      setCssInput(formatted);
      return;
    }

    setJsInput(formatted);
  };

  const handleCopyFinalHtml = async () => {
    try {
      await navigator.clipboard.writeText(previewDocument);
      setCopiedActionId('copy-final');
      window.setTimeout(() => {
        setCopiedActionId((current) => (current === 'copy-final' ? '' : current));
      }, 1600);
    } catch {
      setWarningMessage(ui.fileReadError);
    }
  };

  const handleDownloadHtml = () => {
    downloadBlob(new Blob([previewDocument], { type: 'text/html;charset=utf-8' }), 'html-preview.html');
  };

  const handleOpenNewTab = () => {
    const htmlBlob = new Blob([renderedDocument], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(htmlBlob);
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  };

  const toggleElementFullscreen = async (
    element: HTMLDivElement | null,
    onError: () => void,
  ) => {
    if (!element) {
      return;
    }

    try {
      if (document.fullscreenElement === element) {
        await document.exitFullscreen();
        return;
      }

      await element.requestFullscreen();
    } catch {
      onError();
    }
  };

  const handleToggleEditorFullscreen = async () => {
    await toggleElementFullscreen(editorPanelRef.current, () => setIsEditorFullscreen(false));
  };

  const handleTogglePreviewFullscreen = async () => {
    if (!previewContainerRef.current) {
      return;
    }

    await toggleElementFullscreen(previewContainerRef.current, () => setIsPreviewFullscreen(false));
  };

  const handleEditorSplitResizeStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    const container = editorSplitContainerRef.current;

    if (!container) {
      return;
    }

    event.preventDefault();
    const startX = event.clientX;
    const startRatio = editorSplitRatio;
    const width = container.getBoundingClientRect().width || 1;

    const handleMove = (moveEvent: PointerEvent) => {
      const deltaPercent = ((moveEvent.clientX - startX) / width) * 100;
      setEditorSplitRatio(Math.min(75, Math.max(25, startRatio + deltaPercent)));
    };

    const handleUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp, { once: true });
  };

  const handleFilesUpload = async (files: File[]) => {
    if (!files.length) {
      return;
    }

    let loaded: LoadedSourceFile[] = [];

    try {
      loaded = await Promise.all(
        files.map(async (file, index) => {
          const kind = getSourceFileKind(file.name);
          const content = kind === 'unsupported' ? '' : await readFileText(file);

          return {
            id: `${Date.now()}-${index}-${file.name}`,
            name: file.name,
            kind,
            content,
          } as LoadedSourceFile;
        }),
      );
    } catch {
      setWarningMessage(ui.fileReadError);
      return;
    }

    const supported = loaded.filter((file) => file.kind !== 'unsupported');
    const unsupportedCount = loaded.length - supported.length;
    const firstHtml = supported.find((file) => file.kind === 'html');
    const cssContent = joinFileBundle(supported, 'css');
    const jsContent = joinFileBundle(supported, 'js');

    setLoadedFiles(supported);
    setSelectedHtmlFileId(firstHtml?.id ?? '');
    setHtmlInput(firstHtml?.content ?? '');
    setCssInput(cssContent);
    setJsInput(jsContent);
    setActiveTab('html');
    setConsoleEntries([]);

    if (!firstHtml) {
      setWarningMessage(ui.noHtmlFileWarning);
      return;
    }

    if (unsupportedCount > 0) {
      setWarningMessage(ui.unsupportedFilesWarning);
      return;
    }

    setWarningMessage('');
  };

  const handleSelectHtmlFile = (fileId: string) => {
    const selectedFile = htmlFiles.find((file) => file.id === fileId);

    setSelectedHtmlFileId(fileId);
    if (selectedFile) {
      setHtmlInput(selectedFile.content);
      setActiveTab('html');
    }
  };

  const handleEditorChange = (value: string) => {
    if (activeTab === 'html') {
      setHtmlInput(value);
      return;
    }

    if (activeTab === 'css') {
      setCssInput(value);
      return;
    }

    setJsInput(value);
  };

  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId) ?? starter;

  return (
    <Card className="space-y-6 overflow-hidden">
      <header className="rounded-xl border border-slate-200 bg-slate-950 p-4 text-white">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
          <span className="inline-flex items-center rounded-full bg-sky-400/15 px-2.5 py-1 text-sky-200">
            <Code2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            CodeMirror
          </span>
          <span className="inline-flex items-center rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-200">
            <TerminalSquare className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Console
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-white">{ui.title}</h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">{ui.intro}</p>
      </header>

      <section className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.templatesLabel}</span>
          <Select
            value={selectedTemplateId}
            onChange={(event) => handleTemplateChange(event.target.value as TemplateId)}
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.label}
              </option>
            ))}
          </Select>
          <span className="block text-xs text-slate-600">
            {selectedTemplate.description || ui.templatesHint}
          </span>
        </label>

        <div className="flex flex-wrap items-end gap-2 lg:justify-end">
          <Button onClick={handleRunPreview}>
            <Play className="mr-2 h-4 w-4" aria-hidden="true" />
            {ui.run}
          </Button>
          <label className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={autoRun}
              onChange={(event) => setAutoRun(event.target.checked)}
              className="rounded border-slate-300"
            />
            {ui.autoRun}
          </label>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(480px,0.9fr)]">
        <section className="space-y-4">
          <div
            ref={editorPanelRef}
            className={cn(
              'rounded-xl border border-slate-200 bg-white',
              isEditorFullscreen ? 'flex h-screen flex-col overflow-hidden rounded-none border-0 p-4' : 'p-3',
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h4 className="text-base font-semibold text-slate-900">{ui.editorTitle}</h4>
                <p className="text-xs text-slate-600">
                  {ui.htmlLabel}, {ui.cssLabel}, {ui.jsLabel}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(['html', 'css', 'js'] as EditorTab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={modeButtonClass(activeTab === tab)}
                    onClick={() => setActiveTab(tab)}
                  >
                    {ui[editorTabLabels[tab]]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" className="h-9 px-3 text-xs" onClick={handleFormatActiveTab}>
                  <Brush className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  {ui.format}
                </Button>
                <Button variant="secondary" className="h-9 px-3 text-xs" onClick={handleCopyFinalHtml}>
                  <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  {copiedActionId === 'copy-final' ? ui.copied : ui.copyDocument}
                </Button>
                <Button variant="secondary" className="h-9 px-3 text-xs" onClick={handleDownloadHtml}>
                  <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  {ui.download}
                </Button>
                <Button variant="secondary" className="h-9 px-3 text-xs" onClick={handleToggleEditorFullscreen}>
                  <Maximize2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  {isEditorFullscreen ? ui.exitFullscreen : ui.editorFullscreen}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={modeButtonClass(editorTheme === 'light')}
                  onClick={() => setEditorTheme('light')}
                >
                  {ui.themeLight}
                </button>
                <button
                  type="button"
                  className={modeButtonClass(editorTheme === 'dark')}
                  onClick={() => setEditorTheme('dark')}
                >
                  <Moon className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  {ui.themeDark}
                </button>
              </div>
            </div>

            {isEditorFullscreen ? (
              <div
                ref={editorSplitContainerRef}
                className="grid min-h-0 flex-1 overflow-hidden rounded-lg border border-slate-200 bg-white"
                style={{ gridTemplateColumns: `${editorSplitRatio}% 8px minmax(0, 1fr)` }}
              >
                <div className="min-h-0 min-w-0 overflow-hidden">
                  <CodeEditor
                    kind={activeTab}
                    value={currentValue}
                    onChange={handleEditorChange}
                    placeholder={currentPlaceholder}
                    theme={editorTheme}
                    height="100%"
                  />
                </div>

                <div
                  role="separator"
                  aria-label={`${ui.editorTitle} / ${ui.previewTitle}`}
                  aria-orientation="vertical"
                  aria-valuemin={25}
                  aria-valuemax={75}
                  aria-valuenow={editorSplitRatio}
                  tabIndex={0}
                  onPointerDown={handleEditorSplitResizeStart}
                  className="group relative z-10 flex cursor-col-resize items-center justify-center border-x border-slate-200 bg-slate-100 transition-colors hover:bg-sky-50"
                >
                  <span className="h-10 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-sky-500" />
                </div>

                <div className="min-h-0 min-w-0 overflow-hidden bg-slate-100 p-3">
                  {renderedDocument.trim() ? (
                    <iframe
                      title="HTML preview"
                      srcDoc={renderedDocument}
                      sandbox="allow-scripts allow-forms allow-modals allow-popups allow-downloads"
                      className="h-full w-full rounded-lg border border-slate-200 bg-white"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                      {ui.emptyPreviewHint}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <CodeEditor
                kind={activeTab}
                value={currentValue}
                onChange={handleEditorChange}
                placeholder={currentPlaceholder}
                theme={editorTheme}
                height="clamp(300px, 48vh, 560px)"
              />
            )}
          </div>

          {warningMessage ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {warningMessage}
            </p>
          ) : null}
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h4 className="text-base font-semibold text-slate-900">{ui.previewTitle}</h4>
                <p className="text-xs text-slate-600">{ui.previewHint}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {([
                  ['desktop', Monitor, ui.desktop],
                  ['tablet', Tablet, ui.tablet],
                  ['mobile', Smartphone, ui.mobile],
                ] as const).map(([viewport, Icon, label]) => (
                  <button
                    key={viewport}
                    type="button"
                    className={modeButtonClass(previewViewport === viewport)}
                    onClick={() => setPreviewViewport(viewport)}
                    aria-label={label}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="ml-1.5 hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 py-3">
              <Button variant="secondary" className="h-9 px-3 text-xs" onClick={handleOpenNewTab}>
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                {ui.openNewTab}
              </Button>
              <Button variant="secondary" className="h-9 px-3 text-xs" onClick={handleTogglePreviewFullscreen}>
                <Maximize2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                {isPreviewFullscreen ? ui.exitFullscreen : ui.fullscreen}
              </Button>
              <Button variant="ghost" className="h-9 px-3 text-xs" onClick={handleRunPreview}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                {ui.run}
              </Button>
            </div>

            <div
              ref={previewContainerRef}
              className={cn(
                'overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-3',
                isPreviewFullscreen ? 'h-screen w-screen rounded-none border-0' : 'h-[560px]',
              )}
            >
              {renderedDocument.trim() ? (
                <iframe
                  title="HTML preview"
                  srcDoc={renderedDocument}
                  sandbox="allow-scripts allow-forms allow-modals allow-popups allow-downloads"
                  className={cn(
                    'mx-auto h-full rounded-lg border border-slate-200 bg-white',
                    viewportClasses[previewViewport],
                  )}
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                  {ui.emptyPreviewHint}
                </div>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-500">{ui.securityHint}</p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{ui.consoleTitle}</h4>
                  <p className="mt-1 text-xs text-slate-600">{ui.consoleHint}</p>
                </div>
                <Button
                  variant="ghost"
                  className="h-8 px-2 text-xs"
                  onClick={() => setConsoleEntries([])}
                >
                  {ui.clearConsole}
                </Button>
              </div>

              <div className="mt-3 max-h-64 space-y-2 overflow-auto rounded-lg border border-slate-200 bg-slate-950 p-2">
                {consoleEntries.length ? (
                  consoleEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className={cn('rounded border px-2 py-1.5 text-xs', consoleLevelClasses[entry.level])}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-semibold">{entry.level}</span>
                        <span className="text-[10px] opacity-70">{entry.at}</span>
                      </div>
                      <p className="mt-1 break-words font-mono">{entry.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="px-2 py-8 text-center text-xs text-slate-400">{ui.emptyConsole}</p>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" aria-hidden="true" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{ui.issuesTitle}</h4>
                  <p className="mt-1 text-xs text-slate-600">{ui.noIssues}</p>
                </div>
              </div>

              <div className="mt-3 max-h-64 space-y-2 overflow-auto">
                {allIssues.length ? (
                  allIssues.map((issue, index) => (
                    <div
                      key={`${issue.kind}-${issue.message}-${index}`}
                      className={cn(
                        'rounded-lg border px-3 py-2 text-xs',
                        issue.severity === 'error'
                          ? 'border-red-200 bg-red-50 text-red-800'
                          : 'border-amber-200 bg-amber-50 text-amber-900',
                      )}
                    >
                      <p className="font-semibold uppercase">{issue.kind}</p>
                      <p className="mt-1">{issue.message}</p>
                      {issue.line ? (
                        <p className="mt-1 font-mono text-[11px] opacity-75">
                          {issue.line}:{issue.column ?? 0}
                        </p>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                    {ui.noIssues}
                  </p>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.7fr)]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <FileUp className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <p className="text-sm font-semibold text-slate-800">{ui.filesLabel}</p>
          </div>
          <FileUploadDropzone
            locale={locale}
            label={ui.filesLabel}
            helperText={ui.filesHint}
            accept=".html,.htm,.css,.js,text/html,text/css,text/javascript,application/javascript"
            acceptedDescription=".HTML, .HTM, .CSS, .JS"
            multiple
            onFilesSelected={(files) => {
              void handleFilesUpload(files);
            }}
          />

          {htmlFiles.length ? (
            <label className="mt-3 block space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.htmlEntryLabel}</span>
              <Select
                value={selectedHtmlFileId}
                onChange={(event) => handleSelectHtmlFile(event.target.value)}
              >
                {htmlFiles.map((file) => (
                  <option key={file.id} value={file.id}>
                    {file.name}
                  </option>
                ))}
              </Select>
            </label>
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800">{ui.loadedFilesTitle}</p>
            <Button variant="ghost" className="h-8 px-2 text-xs" onClick={handleClearEditor}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              {ui.clear}
            </Button>
          </div>

          {loadedFiles.length ? (
            <ul className="max-h-40 space-y-1 overflow-auto text-sm text-slate-700">
              {loadedFiles.map((file) => (
                <li key={file.id} className="rounded bg-slate-50 px-2 py-1">
                  <strong className="uppercase text-slate-500">{file.kind}</strong> {file.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">{ui.templatesHint}</p>
          )}
        </div>
      </section>
    </Card>
  );
}
