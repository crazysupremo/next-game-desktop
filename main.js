// NEXT GAME Desktop — wrapper Electron.
// Não reimplementa nada do NEXT GAME: só abre o site já publicado
// (bluegames-nextgame.onrender.com) dentro de uma janela própria, sem barra
// de endereço, com ícone, notificações nativas do sistema operacional e
// atalhos de teclado — pra sensação de "app instalado", não navegador.
const { app, BrowserWindow, Menu, shell, session } = require('electron');
const path = require('path');

// Pode trocar sem reempacotar o instalador, se um dia mudar de domínio —
// só definir a variável de ambiente NEXT_GAME_URL antes de abrir o app.
const NEXT_GAME_URL = process.env.NEXT_GAME_URL || 'https://bluegames-nextgame.onrender.com';

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 960,
    minHeight: 600,
    title: 'NEXT GAME',
    icon: path.join(__dirname, 'build', 'icon.png'),
    backgroundColor: '#05070d',
    autoHideMenuBar: true, // some a barra de menu (Arquivo/Editar/...) — só aparece com Alt, fica mais "app" e menos "navegador"
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      // Necessário pra WebRTC (voz/câmera/compartilhamento de tela) funcionar
      // dentro do Electron do mesmo jeito que funciona no navegador comum.
      enableWebRTCPipeWireCapturer: true,
    },
  });

  mainWindow.loadURL(NEXT_GAME_URL);

  // Links que abririam em nova aba (ex: SaferNet, documentação) abrem no
  // navegador padrão do sistema, não dentro do app — janela nova dentro do
  // Electron ficaria sem contexto nenhum (sem login, sem nada).
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(NEXT_GAME_URL)) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Permite câmera/microfone/tela sem o Electron perguntar de um jeito
// diferente do navegador — o próprio NEXT GAME já pede a permissão certa
// (pra chamada de voz, câmera de verificação de idade etc).
app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowed = ['media', 'notifications', 'clipboard-read', 'display-capture'];
    callback(allowed.includes(permission));
  });

  // Menu mínimo — a barra fica escondida (autoHideMenuBar), mas continua
  // acessível via Alt, com o essencial: recarregar, zoom e sair.
  const template = [
    {
      label: 'NEXT GAME',
      submenu: [
        { label: 'Recarregar', accelerator: 'CmdOrCtrl+R', click: () => mainWindow && mainWindow.reload() },
        { label: 'Tela cheia', accelerator: 'F11', role: 'togglefullscreen' },
        { type: 'separator' },
        { label: 'Sair', role: 'quit' },
      ],
    },
    {
      label: 'Visualizar',
      submenu: [
        { role: 'zoomIn', label: 'Aumentar zoom' },
        { role: 'zoomOut', label: 'Diminuir zoom' },
        { role: 'resetZoom', label: 'Zoom padrão' },
        { type: 'separator' },
        { role: 'toggleDevTools', label: 'Ferramentas do desenvolvedor' },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
