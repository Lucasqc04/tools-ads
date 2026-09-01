import type { AppLocale } from '@/lib/i18n/config';

export type ShortcutEntry = {
  id: string;
  actionByLocale: Record<AppLocale, string>;
  combo: string;
  macCombo?: string;
};

export type ShortcutCategory = {
  id: string;
  labelByLocale: Record<AppLocale, string>;
  shortcuts: ShortcutEntry[];
};

export type ShortcutApp = {
  id: string;
  slugWordByLocale: Record<AppLocale, string>;
  labelByLocale: Record<AppLocale, string>;
  hasOsVariants: boolean;
  categories: ShortcutCategory[];
};

export const deriveMacCombo = (combo: string): string =>
  combo.replace(/Ctrl/g, 'Cmd').replace(/Alt/g, 'Option');

export const getShortcutDisplayCombo = (
  entry: ShortcutEntry,
  os: 'windows' | 'mac',
): string => {
  if (os === 'mac') {
    return entry.macCombo ?? deriveMacCombo(entry.combo);
  }

  return entry.combo;
};

export const shortcutApps: ShortcutApp[] = [
  {
    id: 'windows',
    slugWordByLocale: { 'pt-br': 'windows', en: 'windows', es: 'windows',
    zh: 'windows', },
    labelByLocale: { 'pt-br': 'Windows', en: 'Windows', es: 'Windows',
    zh: 'Windows', },
    hasOsVariants: false,
    categories: [
      {
        id: 'windows-management',
        labelByLocale: {
          'pt-br': 'Janelas',
          en: 'Window Management',
          es: 'Ventanas',
          zh: 'Window Management',
        },
        shortcuts: [
          { id: 'win-show-desktop', combo: 'Win+D', actionByLocale: { 'pt-br': 'Mostrar a área de trabalho', en: 'Show the desktop', es: 'Mostrar el escritorio',
          zh: 'Show the desktop', } },
          { id: 'win-task-view', combo: 'Win+Tab', actionByLocale: { 'pt-br': 'Abrir a visão de tarefas / áreas de trabalho virtuais', en: 'Open task view / virtual desktops', es: 'Abrir vista de tareas / escritorios virtuales',
          zh: 'Open task view / virtual desktops', } },
          { id: 'win-alt-tab', combo: 'Alt+Tab', actionByLocale: { 'pt-br': 'Alternar entre janelas abertas', en: 'Switch between open windows', es: 'Cambiar entre ventanas abiertas',
          zh: 'Switch between open windows', } },
          { id: 'win-snap', combo: 'Win+Seta Esquerda/Direita', actionByLocale: { 'pt-br': 'Encaixar a janela na lateral da tela', en: 'Snap the window to the side of the screen', es: 'Ajustar la ventana al lateral de la pantalla',
          zh: 'Snap the window to the side of the screen', } },
          { id: 'win-close', combo: 'Alt+F4', actionByLocale: { 'pt-br': 'Fechar a janela ativa', en: 'Close the active window', es: 'Cerrar la ventana activa',
          zh: 'Close the active window', } },
        ],
      },
      {
        id: 'windows-system',
        labelByLocale: { 'pt-br': 'Sistema', en: 'System', es: 'Sistema',
        zh: 'System', },
        shortcuts: [
          { id: 'win-lock', combo: 'Win+L', actionByLocale: { 'pt-br': 'Bloquear o computador', en: 'Lock the PC', es: 'Bloquear el equipo',
          zh: 'Lock the PC', } },
          { id: 'win-settings', combo: 'Win+I', actionByLocale: { 'pt-br': 'Abrir as Configurações', en: 'Open Settings', es: 'Abrir Configuración',
          zh: 'Open Settings', } },
          { id: 'win-run', combo: 'Win+R', actionByLocale: { 'pt-br': 'Abrir a caixa Executar', en: 'Open the Run dialog', es: 'Abrir el cuadro Ejecutar',
          zh: 'Open the Run dialog', } },
          { id: 'win-task-manager', combo: 'Ctrl+Shift+Esc', actionByLocale: { 'pt-br': 'Abrir o Gerenciador de Tarefas', en: 'Open Task Manager', es: 'Abrir el Administrador de tareas',
          zh: 'Open Task Manager', } },
          { id: 'win-emoji', combo: 'Win+.', actionByLocale: { 'pt-br': 'Abrir o painel de emojis', en: 'Open the emoji panel', es: 'Abrir el panel de emojis',
          zh: 'Open the emoji panel', } },
        ],
      },
      {
        id: 'windows-files',
        labelByLocale: { 'pt-br': 'Arquivos e Edição', en: 'Files & Editing', es: 'Archivos y Edición',
        zh: 'Files & Editing', },
        shortcuts: [
          { id: 'win-explorer', combo: 'Win+E', actionByLocale: { 'pt-br': 'Abrir o Explorador de Arquivos', en: 'Open File Explorer', es: 'Abrir el Explorador de archivos',
          zh: 'Open File Explorer', } },
          { id: 'win-snip', combo: 'Win+Shift+S', actionByLocale: { 'pt-br': 'Abrir a ferramenta de captura de tela', en: 'Open the screen snipping tool', es: 'Abrir la herramienta de recorte de pantalla',
          zh: 'Open the screen snipping tool', } },
          { id: 'win-copy', combo: 'Ctrl+C', actionByLocale: { 'pt-br': 'Copiar', en: 'Copy', es: 'Copiar',
          zh: 'Copy', } },
          { id: 'win-paste', combo: 'Ctrl+V', actionByLocale: { 'pt-br': 'Colar', en: 'Paste', es: 'Pegar',
          zh: 'Paste', } },
          { id: 'win-undo', combo: 'Ctrl+Z', actionByLocale: { 'pt-br': 'Desfazer', en: 'Undo', es: 'Deshacer',
          zh: 'Undo', } },
        ],
      },
    ],
  },
  {
    id: 'macos',
    slugWordByLocale: { 'pt-br': 'macos', en: 'macos', es: 'macos',
    zh: 'macos', },
    labelByLocale: { 'pt-br': 'macOS', en: 'macOS', es: 'macOS',
    zh: 'macOS', },
    hasOsVariants: false,
    categories: [
      {
        id: 'macos-management',
        labelByLocale: { 'pt-br': 'Janelas', en: 'Window Management', es: 'Ventanas',
        zh: 'Window Management', },
        shortcuts: [
          { id: 'mac-app-switch', combo: 'Cmd+Tab', actionByLocale: { 'pt-br': 'Alternar entre aplicativos abertos', en: 'Switch between open apps', es: 'Cambiar entre apps abiertas',
          zh: 'Switch between open apps', } },
          { id: 'mac-quit', combo: 'Cmd+Q', actionByLocale: { 'pt-br': 'Fechar o aplicativo ativo', en: 'Quit the active app', es: 'Cerrar la app activa',
          zh: 'Quit the active app', } },
          { id: 'mac-close-window', combo: 'Cmd+W', actionByLocale: { 'pt-br': 'Fechar a janela ativa', en: 'Close the active window', es: 'Cerrar la ventana activa',
          zh: 'Close the active window', } },
          { id: 'mac-minimize', combo: 'Cmd+M', actionByLocale: { 'pt-br': 'Minimizar a janela ativa', en: 'Minimize the active window', es: 'Minimizar la ventana activa',
          zh: 'Minimize the active window', } },
          { id: 'mac-fullscreen', combo: 'Ctrl+Cmd+F', actionByLocale: { 'pt-br': 'Alternar tela cheia', en: 'Toggle full screen', es: 'Alternar pantalla completa',
          zh: 'Toggle full screen', } },
        ],
      },
      {
        id: 'macos-system',
        labelByLocale: { 'pt-br': 'Sistema', en: 'System', es: 'Sistema',
        zh: 'System', },
        shortcuts: [
          { id: 'mac-spotlight', combo: 'Cmd+Space', actionByLocale: { 'pt-br': 'Abrir a busca do Spotlight', en: 'Open Spotlight search', es: 'Abrir la búsqueda de Spotlight',
          zh: 'Open Spotlight search', } },
          { id: 'mac-hide', combo: 'Cmd+H', actionByLocale: { 'pt-br': 'Ocultar o aplicativo ativo', en: 'Hide the active app', es: 'Ocultar la app activa',
          zh: 'Hide the active app', } },
          { id: 'mac-preferences', combo: 'Cmd+,', actionByLocale: { 'pt-br': 'Abrir as preferências do app', en: 'Open app preferences', es: 'Abrir preferencias de la app',
          zh: 'Open app preferences', } },
          { id: 'mac-force-quit', combo: 'Cmd+Option+Esc', actionByLocale: { 'pt-br': 'Forçar o fechamento de um aplicativo', en: 'Force quit an app', es: 'Forzar el cierre de una app',
          zh: 'Force quit an app', } },
          { id: 'mac-screenshot-full', combo: 'Cmd+Shift+3', actionByLocale: { 'pt-br': 'Capturar a tela inteira', en: 'Screenshot the full screen', es: 'Capturar toda la pantalla',
          zh: 'Screenshot the full screen', } },
          { id: 'mac-screenshot-selection', combo: 'Cmd+Shift+4', actionByLocale: { 'pt-br': 'Capturar uma seleção da tela', en: 'Screenshot a selection', es: 'Capturar una selección',
          zh: 'Screenshot a selection', } },
        ],
      },
      {
        id: 'macos-files',
        labelByLocale: { 'pt-br': 'Arquivos e Edição', en: 'Files & Editing', es: 'Archivos y Edición',
        zh: 'Files & Editing', },
        shortcuts: [
          { id: 'mac-trash', combo: 'Cmd+Delete', actionByLocale: { 'pt-br': 'Mover item para a Lixeira', en: 'Move item to Trash', es: 'Mover elemento a la Papelera',
          zh: 'Move item to Trash', } },
          { id: 'mac-copy', combo: 'Cmd+C', actionByLocale: { 'pt-br': 'Copiar', en: 'Copy', es: 'Copiar',
          zh: 'Copy', } },
          { id: 'mac-paste', combo: 'Cmd+V', actionByLocale: { 'pt-br': 'Colar', en: 'Paste', es: 'Pegar',
          zh: 'Paste', } },
          { id: 'mac-undo', combo: 'Cmd+Z', actionByLocale: { 'pt-br': 'Desfazer', en: 'Undo', es: 'Deshacer',
          zh: 'Undo', } },
        ],
      },
    ],
  },
  {
    id: 'vscode',
    slugWordByLocale: { 'pt-br': 'vscode', en: 'vscode', es: 'vscode',
    zh: 'vscode', },
    labelByLocale: { 'pt-br': 'VS Code', en: 'VS Code', es: 'VS Code',
    zh: 'VS Code', },
    hasOsVariants: true,
    categories: [
      {
        id: 'vscode-navigation',
        labelByLocale: { 'pt-br': 'Navegação', en: 'Navigation', es: 'Navegación',
        zh: 'Navigation', },
        shortcuts: [
          { id: 'vscode-quick-open', combo: 'Ctrl+P', actionByLocale: { 'pt-br': 'Abrir arquivo rapidamente', en: 'Quick open a file', es: 'Abrir un archivo rápidamente',
          zh: 'Quick open a file', } },
          { id: 'vscode-command-palette', combo: 'Ctrl+Shift+P', actionByLocale: { 'pt-br': 'Abrir a paleta de comandos', en: 'Open the Command Palette', es: 'Abrir la paleta de comandos',
          zh: 'Open the Command Palette', } },
          { id: 'vscode-terminal', combo: 'Ctrl+`', actionByLocale: { 'pt-br': 'Abrir/fechar o terminal integrado', en: 'Toggle the integrated terminal', es: 'Mostrar/ocultar la terminal integrada',
          zh: 'Toggle the integrated terminal', } },
          { id: 'vscode-sidebar', combo: 'Ctrl+B', actionByLocale: { 'pt-br': 'Mostrar/ocultar a barra lateral', en: 'Toggle the sidebar', es: 'Mostrar/ocultar la barra lateral',
          zh: 'Toggle the sidebar', } },
          { id: 'vscode-search-files', combo: 'Ctrl+Shift+F', actionByLocale: { 'pt-br': 'Buscar em todos os arquivos', en: 'Search across all files', es: 'Buscar en todos los archivos',
          zh: 'Search across all files', } },
          { id: 'vscode-go-to-line', combo: 'Ctrl+G', actionByLocale: { 'pt-br': 'Ir para uma linha específica', en: 'Go to a specific line', es: 'Ir a una línea específica',
          zh: 'Go to a specific line', } },
        ],
      },
      {
        id: 'vscode-editing',
        labelByLocale: { 'pt-br': 'Edição', en: 'Editing', es: 'Edición',
        zh: 'Editing', },
        shortcuts: [
          { id: 'vscode-comment', combo: 'Ctrl+/', actionByLocale: { 'pt-br': 'Comentar/descomentar a linha', en: 'Toggle line comment', es: 'Comentar/descomentar la línea',
          zh: 'Toggle line comment', } },
          { id: 'vscode-move-line', combo: 'Alt+Seta Cima/Baixo', macCombo: 'Option+Seta Cima/Baixo', actionByLocale: { 'pt-br': 'Mover a linha atual para cima/baixo', en: 'Move the current line up/down', es: 'Mover la línea actual arriba/abajo',
          zh: 'Move the current line up/down', } },
          { id: 'vscode-copy-line', combo: 'Shift+Alt+Seta Baixo', macCombo: 'Shift+Option+Seta Baixo', actionByLocale: { 'pt-br': 'Copiar a linha atual para baixo', en: 'Copy the current line down', es: 'Copiar la línea actual hacia abajo',
          zh: 'Copy the current line down', } },
          { id: 'vscode-select-next', combo: 'Ctrl+D', actionByLocale: { 'pt-br': 'Selecionar a próxima ocorrência igual', en: 'Select the next matching occurrence', es: 'Seleccionar la siguiente coincidencia',
          zh: 'Select the next matching occurrence', } },
          { id: 'vscode-delete-line', combo: 'Ctrl+Shift+K', actionByLocale: { 'pt-br': 'Apagar a linha atual', en: 'Delete the current line', es: 'Eliminar la línea actual',
          zh: 'Delete the current line', } },
          { id: 'vscode-suggestions', combo: 'Ctrl+Space', actionByLocale: { 'pt-br': 'Acionar sugestões de código', en: 'Trigger suggestions', es: 'Activar sugerencias de código',
          zh: 'Trigger suggestions', } },
        ],
      },
      {
        id: 'vscode-files',
        labelByLocale: { 'pt-br': 'Arquivos', en: 'Files', es: 'Archivos',
        zh: 'Files', },
        shortcuts: [
          { id: 'vscode-save', combo: 'Ctrl+S', actionByLocale: { 'pt-br': 'Salvar o arquivo', en: 'Save the file', es: 'Guardar el archivo',
          zh: 'Save the file', } },
          { id: 'vscode-go-to-definition', combo: 'F12', actionByLocale: { 'pt-br': 'Ir para a definição', en: 'Go to definition', es: 'Ir a la definición',
          zh: 'Go to definition', } },
        ],
      },
    ],
  },
  {
    id: 'excel',
    slugWordByLocale: { 'pt-br': 'excel', en: 'excel', es: 'excel',
    zh: 'excel', },
    labelByLocale: { 'pt-br': 'Excel', en: 'Excel', es: 'Excel',
    zh: 'Excel', },
    hasOsVariants: true,
    categories: [
      {
        id: 'excel-navigation',
        labelByLocale: { 'pt-br': 'Navegação e Seleção', en: 'Navigation & Selection', es: 'Navegación y Selección',
        zh: 'Navigation & Selection', },
        shortcuts: [
          { id: 'excel-jump-edge', combo: 'Ctrl+Seta', actionByLocale: { 'pt-br': 'Pular para a borda da região de dados', en: 'Jump to the edge of a data region', es: 'Saltar al borde de la región de datos',
          zh: 'Jump to the edge of a data region', } },
          { id: 'excel-select-edge', combo: 'Ctrl+Shift+Seta', actionByLocale: { 'pt-br': 'Selecionar até a borda da região de dados', en: 'Extend selection to the edge of a data region', es: 'Extender selección hasta el borde de los datos',
          zh: 'Extend selection to the edge of a data region', } },
          { id: 'excel-select-column', combo: 'Ctrl+Espaço', actionByLocale: { 'pt-br': 'Selecionar a coluna inteira', en: 'Select the entire column', es: 'Seleccionar toda la columna',
          zh: 'Select the entire column', } },
          { id: 'excel-select-row', combo: 'Shift+Espaço', actionByLocale: { 'pt-br': 'Selecionar a linha inteira', en: 'Select the entire row', es: 'Seleccionar toda la fila',
          zh: 'Select the entire row', } },
          { id: 'excel-next-sheet', combo: 'Ctrl+PageDown', actionByLocale: { 'pt-br': 'Ir para a próxima planilha', en: 'Switch to the next sheet', es: 'Ir a la siguiente hoja',
          zh: 'Switch to the next sheet', } },
          { id: 'excel-prev-sheet', combo: 'Ctrl+PageUp', actionByLocale: { 'pt-br': 'Ir para a planilha anterior', en: 'Switch to the previous sheet', es: 'Ir a la hoja anterior',
          zh: 'Switch to the previous sheet', } },
        ],
      },
      {
        id: 'excel-editing',
        labelByLocale: { 'pt-br': 'Edição', en: 'Editing', es: 'Edición',
        zh: 'Editing', },
        shortcuts: [
          { id: 'excel-edit-cell', combo: 'F2', actionByLocale: { 'pt-br': 'Editar a célula ativa', en: 'Edit the active cell', es: 'Editar la celda activa',
          zh: 'Edit the active cell', } },
          { id: 'excel-autosum', combo: 'Alt+=', actionByLocale: { 'pt-br': 'Somar automaticamente o intervalo selecionado', en: 'AutoSum the selected range', es: 'Autosuma del rango seleccionado',
          zh: 'AutoSum the selected range', } },
          { id: 'excel-insert-date', combo: 'Ctrl+;', actionByLocale: { 'pt-br': 'Inserir a data de hoje', en: 'Insert today\'s date', es: 'Insertar la fecha de hoy',
          zh: 'Insert today\'s date', } },
          { id: 'excel-create-table', combo: 'Ctrl+T', actionByLocale: { 'pt-br': 'Criar uma tabela a partir da seleção', en: 'Create a table from the selection', es: 'Crear una tabla a partir de la selección',
          zh: 'Create a table from the selection', } },
        ],
      },
      {
        id: 'excel-formatting',
        labelByLocale: { 'pt-br': 'Formatação', en: 'Formatting', es: 'Formato',
        zh: 'Formatting', },
        shortcuts: [
          { id: 'excel-format-cells', combo: 'Ctrl+1', actionByLocale: { 'pt-br': 'Abrir Formatar Células', en: 'Open Format Cells', es: 'Abrir Formato de celdas',
          zh: 'Open Format Cells', } },
          { id: 'excel-toggle-filter', combo: 'Ctrl+Shift+L', actionByLocale: { 'pt-br': 'Ativar/desativar os filtros', en: 'Toggle filters', es: 'Activar/desactivar filtros',
          zh: 'Toggle filters', } },
        ],
      },
    ],
  },
  {
    id: 'google-sheets',
    slugWordByLocale: { 'pt-br': 'google-sheets', en: 'google-sheets', es: 'google-sheets',
    zh: 'google-sheets', },
    labelByLocale: { 'pt-br': 'Google Sheets', en: 'Google Sheets', es: 'Google Sheets',
    zh: 'Google Sheets', },
    hasOsVariants: true,
    categories: [
      {
        id: 'sheets-navigation',
        labelByLocale: { 'pt-br': 'Navegação e Seleção', en: 'Navigation & Selection', es: 'Navegación y Selección',
        zh: 'Navigation & Selection', },
        shortcuts: [
          { id: 'sheets-select-column', combo: 'Ctrl+Espaço', actionByLocale: { 'pt-br': 'Selecionar a coluna inteira', en: 'Select the entire column', es: 'Seleccionar toda la columna',
          zh: 'Select the entire column', } },
          { id: 'sheets-select-row', combo: 'Shift+Espaço', actionByLocale: { 'pt-br': 'Selecionar a linha inteira', en: 'Select the entire row', es: 'Seleccionar toda la fila',
          zh: 'Select the entire row', } },
          { id: 'sheets-search-menus', combo: 'Alt+/', actionByLocale: { 'pt-br': 'Buscar nos menus', en: 'Search the menus', es: 'Buscar en los menús',
          zh: 'Search the menus', } },
        ],
      },
      {
        id: 'sheets-editing',
        labelByLocale: { 'pt-br': 'Edição', en: 'Editing', es: 'Edición',
        zh: 'Editing', },
        shortcuts: [
          { id: 'sheets-insert-date', combo: 'Ctrl+;', actionByLocale: { 'pt-br': 'Inserir a data de hoje', en: 'Insert today\'s date', es: 'Insertar la fecha de hoy',
          zh: 'Insert today\'s date', } },
          { id: 'sheets-insert-time', combo: 'Ctrl+Shift+;', actionByLocale: { 'pt-br': 'Inserir a hora atual', en: 'Insert the current time', es: 'Insertar la hora actual',
          zh: 'Insert the current time', } },
          { id: 'sheets-insert-comment', combo: 'Ctrl+Alt+M', macCombo: 'Cmd+Option+M', actionByLocale: { 'pt-br': 'Inserir um comentário', en: 'Insert a comment', es: 'Insertar un comentario',
          zh: 'Insert a comment', } },
          { id: 'sheets-paste-values', combo: 'Ctrl+Shift+V', actionByLocale: { 'pt-br': 'Colar somente os valores', en: 'Paste values only', es: 'Pegar solo los valores',
          zh: 'Paste values only', } },
          { id: 'sheets-toggle-absolute', combo: 'F4', actionByLocale: { 'pt-br': 'Alternar referência absoluta/relativa na fórmula', en: 'Toggle absolute/relative reference in a formula', es: 'Alternar referencia absoluta/relativa en la fórmula',
          zh: 'Toggle absolute/relative reference in a formula', } },
        ],
      },
      {
        id: 'sheets-formatting',
        labelByLocale: { 'pt-br': 'Formatação', en: 'Formatting', es: 'Formato',
        zh: 'Formatting', },
        shortcuts: [
          { id: 'sheets-bold', combo: 'Ctrl+B', actionByLocale: { 'pt-br': 'Negrito', en: 'Bold', es: 'Negrita',
          zh: 'Bold', } },
          { id: 'sheets-italic', combo: 'Ctrl+I', actionByLocale: { 'pt-br': 'Itálico', en: 'Italic', es: 'Cursiva',
          zh: 'Italic', } },
          { id: 'sheets-clear-format', combo: 'Ctrl+\\', actionByLocale: { 'pt-br': 'Limpar a formatação', en: 'Clear formatting', es: 'Borrar el formato',
          zh: 'Clear formatting', } },
        ],
      },
    ],
  },
  {
    id: 'chrome',
    slugWordByLocale: { 'pt-br': 'chrome', en: 'chrome', es: 'chrome',
    zh: 'chrome', },
    labelByLocale: { 'pt-br': 'Chrome', en: 'Chrome', es: 'Chrome',
    zh: 'Chrome', },
    hasOsVariants: true,
    categories: [
      {
        id: 'chrome-tabs',
        labelByLocale: { 'pt-br': 'Abas e Janelas', en: 'Tabs & Windows', es: 'Pestañas y Ventanas',
        zh: 'Tabs & Windows', },
        shortcuts: [
          { id: 'chrome-new-tab', combo: 'Ctrl+T', actionByLocale: { 'pt-br': 'Abrir uma nova aba', en: 'Open a new tab', es: 'Abrir una nueva pestaña',
          zh: 'Open a new tab', } },
          { id: 'chrome-reopen-tab', combo: 'Ctrl+Shift+T', actionByLocale: { 'pt-br': 'Reabrir a última aba fechada', en: 'Reopen the last closed tab', es: 'Reabrir la última pestaña cerrada',
          zh: 'Reopen the last closed tab', } },
          { id: 'chrome-close-tab', combo: 'Ctrl+W', actionByLocale: { 'pt-br': 'Fechar a aba atual', en: 'Close the current tab', es: 'Cerrar la pestaña actual',
          zh: 'Close the current tab', } },
          { id: 'chrome-next-tab', combo: 'Ctrl+Tab', actionByLocale: { 'pt-br': 'Ir para a próxima aba', en: 'Switch to the next tab', es: 'Ir a la siguiente pestaña',
          zh: 'Switch to the next tab', } },
          { id: 'chrome-new-window', combo: 'Ctrl+N', actionByLocale: { 'pt-br': 'Abrir uma nova janela', en: 'Open a new window', es: 'Abrir una nueva ventana',
          zh: 'Open a new window', } },
          { id: 'chrome-incognito', combo: 'Ctrl+Shift+N', actionByLocale: { 'pt-br': 'Abrir uma janela anônima', en: 'Open an Incognito window', es: 'Abrir una ventana de incógnito',
          zh: 'Open an Incognito window', } },
        ],
      },
      {
        id: 'chrome-navigation',
        labelByLocale: { 'pt-br': 'Navegação', en: 'Navigation', es: 'Navegación',
        zh: 'Navigation', },
        shortcuts: [
          { id: 'chrome-address-bar', combo: 'Ctrl+L', actionByLocale: { 'pt-br': 'Focar na barra de endereço', en: 'Focus the address bar', es: 'Enfocar la barra de direcciones',
          zh: 'Focus the address bar', } },
          { id: 'chrome-history', combo: 'Ctrl+H', actionByLocale: { 'pt-br': 'Abrir o histórico', en: 'Open History', es: 'Abrir el historial',
          zh: 'Open History', } },
          { id: 'chrome-downloads', combo: 'Ctrl+J', actionByLocale: { 'pt-br': 'Abrir os downloads', en: 'Open Downloads', es: 'Abrir las descargas',
          zh: 'Open Downloads', } },
        ],
      },
      {
        id: 'chrome-page',
        labelByLocale: { 'pt-br': 'Página', en: 'Page', es: 'Página',
        zh: 'Page', },
        shortcuts: [
          { id: 'chrome-reload', combo: 'Ctrl+R', actionByLocale: { 'pt-br': 'Recarregar a página', en: 'Reload the page', es: 'Recargar la página',
          zh: 'Reload the page', } },
          { id: 'chrome-find', combo: 'Ctrl+F', actionByLocale: { 'pt-br': 'Buscar na página', en: 'Find on page', es: 'Buscar en la página',
          zh: 'Find on page', } },
          { id: 'chrome-bookmark', combo: 'Ctrl+D', actionByLocale: { 'pt-br': 'Adicionar a página aos favoritos', en: 'Bookmark the current page', es: 'Añadir la página a favoritos',
          zh: 'Bookmark the current page', } },
          { id: 'chrome-clear-data', combo: 'Ctrl+Shift+Delete', actionByLocale: { 'pt-br': 'Limpar dados de navegação', en: 'Clear browsing data', es: 'Borrar datos de navegación',
          zh: 'Clear browsing data', } },
        ],
      },
    ],
  },
  {
    id: 'github',
    slugWordByLocale: { 'pt-br': 'github', en: 'github', es: 'github',
    zh: 'github', },
    labelByLocale: { 'pt-br': 'GitHub', en: 'GitHub', es: 'GitHub',
    zh: 'GitHub', },
    hasOsVariants: false,
    categories: [
      {
        id: 'github-navigation',
        labelByLocale: { 'pt-br': 'Navegação', en: 'Navigation', es: 'Navegación',
        zh: 'Navigation', },
        shortcuts: [
          { id: 'github-notifications', combo: 'g n', actionByLocale: { 'pt-br': 'Ir para as notificações', en: 'Go to your notifications', es: 'Ir a las notificaciones',
          zh: 'Go to your notifications', } },
          { id: 'github-issues', combo: 'g i', actionByLocale: { 'pt-br': 'Ir para as Issues do repositório', en: 'Go to Issues in a repository', es: 'Ir a los Issues del repositorio',
          zh: 'Go to Issues in a repository', } },
          { id: 'github-pulls', combo: 'g p', actionByLocale: { 'pt-br': 'Ir para os Pull Requests do repositório', en: 'Go to Pull Requests in a repository', es: 'Ir a los Pull Requests del repositorio',
          zh: 'Go to Pull Requests in a repository', } },
          { id: 'github-code', combo: 'g c', actionByLocale: { 'pt-br': 'Ir para a aba Code do repositório', en: 'Go to the Code tab of a repository', es: 'Ir a la pestaña Code del repositorio',
          zh: 'Go to the Code tab of a repository', } },
          { id: 'github-file-finder', combo: 't', actionByLocale: { 'pt-br': 'Ativar o buscador de arquivos do repositório', en: 'Activate the repository file finder', es: 'Activar el buscador de archivos del repositorio',
          zh: 'Activate the repository file finder', } },
          { id: 'github-search', combo: '/', actionByLocale: { 'pt-br': 'Focar na barra de busca', en: 'Focus the search bar', es: 'Enfocar la barra de búsqueda',
          zh: 'Focus the search bar', } },
          { id: 'github-shortcuts-help', combo: '?', actionByLocale: { 'pt-br': 'Mostrar a ajuda de atalhos de teclado', en: 'Show the keyboard shortcuts help', es: 'Mostrar la ayuda de atajos de teclado',
          zh: 'Show the keyboard shortcuts help', } },
          { id: 'github-dev', combo: '.', actionByLocale: { 'pt-br': 'Abrir o repositório atual no github.dev', en: 'Open the current repo in github.dev', es: 'Abrir el repositorio actual en github.dev',
          zh: 'Open the current repo in github.dev', } },
        ],
      },
    ],
  },
  {
    id: 'figma',
    slugWordByLocale: { 'pt-br': 'figma', en: 'figma', es: 'figma',
    zh: 'figma', },
    labelByLocale: { 'pt-br': 'Figma', en: 'Figma', es: 'Figma',
    zh: 'Figma', },
    hasOsVariants: true,
    categories: [
      {
        id: 'figma-tools',
        labelByLocale: { 'pt-br': 'Ferramentas', en: 'Tools', es: 'Herramientas',
        zh: 'Tools', },
        shortcuts: [
          { id: 'figma-move', combo: 'V', actionByLocale: { 'pt-br': 'Ferramenta de mover/selecionar', en: 'Move/selection tool', es: 'Herramienta de mover/seleccionar',
          zh: 'Move/selection tool', } },
          { id: 'figma-rectangle', combo: 'R', actionByLocale: { 'pt-br': 'Ferramenta de retângulo', en: 'Rectangle tool', es: 'Herramienta de rectángulo',
          zh: 'Rectangle tool', } },
          { id: 'figma-ellipse', combo: 'O', actionByLocale: { 'pt-br': 'Ferramenta de elipse', en: 'Ellipse tool', es: 'Herramienta de elipse',
          zh: 'Ellipse tool', } },
          { id: 'figma-text', combo: 'T', actionByLocale: { 'pt-br': 'Ferramenta de texto', en: 'Text tool', es: 'Herramienta de texto',
          zh: 'Text tool', } },
          { id: 'figma-pen', combo: 'P', actionByLocale: { 'pt-br': 'Ferramenta de caneta', en: 'Pen tool', es: 'Herramienta de pluma',
          zh: 'Pen tool', } },
        ],
      },
      {
        id: 'figma-editing',
        labelByLocale: { 'pt-br': 'Edição', en: 'Editing', es: 'Edición',
        zh: 'Editing', },
        shortcuts: [
          { id: 'figma-duplicate', combo: 'Ctrl+D', actionByLocale: { 'pt-br': 'Duplicar a seleção', en: 'Duplicate the selection', es: 'Duplicar la selección',
          zh: 'Duplicate the selection', } },
          { id: 'figma-group', combo: 'Ctrl+G', actionByLocale: { 'pt-br': 'Agrupar a seleção', en: 'Group the selection', es: 'Agrupar la selección',
          zh: 'Group the selection', } },
          { id: 'figma-auto-layout', combo: 'Shift+A', actionByLocale: { 'pt-br': 'Adicionar auto layout', en: 'Add auto layout', es: 'Añadir auto layout',
          zh: 'Add auto layout', } },
          { id: 'figma-frame', combo: 'Ctrl+Alt+G', macCombo: 'Cmd+Option+G', actionByLocale: { 'pt-br': 'Colocar a seleção em um frame', en: 'Frame the selection', es: 'Enmarcar la selección',
          zh: 'Frame the selection', } },
        ],
      },
      {
        id: 'figma-view',
        labelByLocale: { 'pt-br': 'Visualização', en: 'View', es: 'Vista',
        zh: 'View', },
        shortcuts: [
          { id: 'figma-zoom-fit', combo: 'Shift+1', actionByLocale: { 'pt-br': 'Ajustar zoom para caber tudo', en: 'Zoom to fit', es: 'Ajustar zoom a todo',
          zh: 'Zoom to fit', } },
          { id: 'figma-zoom-selection', combo: 'Shift+2', actionByLocale: { 'pt-br': 'Ajustar zoom à seleção', en: 'Zoom to selection', es: 'Ajustar zoom a la selección',
          zh: 'Zoom to selection', } },
        ],
      },
    ],
  },
];

const appById = new Map(shortcutApps.map((app) => [app.id, app]));

export const getShortcutAppById = (id: string): ShortcutApp | undefined => appById.get(id);

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

export const searchShortcutApps = (query: string, locale: AppLocale): ShortcutApp[] => {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return shortcutApps;
  }

  return shortcutApps.filter((app) =>
    normalize(app.labelByLocale[locale]).includes(normalizedQuery),
  );
};

export const searchShortcuts = (
  app: ShortcutApp,
  query: string,
  locale: AppLocale,
): ShortcutCategory[] => {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return app.categories;
  }

  return app.categories
    .map((category) => ({
      ...category,
      shortcuts: category.shortcuts.filter((shortcut) =>
        normalize(shortcut.actionByLocale[locale]).includes(normalizedQuery) ||
        normalize(shortcut.combo).includes(normalizedQuery),
      ),
    }))
    .filter((category) => category.shortcuts.length > 0);
};

export const countShortcuts = (app: ShortcutApp): number =>
  app.categories.reduce((total, category) => total + category.shortcuts.length, 0);
