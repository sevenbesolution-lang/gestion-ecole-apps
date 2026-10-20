// Point d'entrée Electron : ouvre l'application de gestion scolaire
// dans une fenêtre native, sans aucune dépendance à un navigateur installé.
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

const APP_FILE = path.join(__dirname, 'app', 'gestion-ecole.html');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    title: 'Gestion Scolaire',
    icon: path.join(__dirname, 'build', process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    webPreferences: {
      // L'application est un fichier HTML autonome (pas de Node intégré requis dans la page).
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
    backgroundColor: '#0a2e26',
  });

  win.loadFile(APP_FILE);

  win.once('ready-to-show', () => win.show());

  // Les liens externes éventuels (ex: clic sur un lien http) s'ouvrent
  // dans le navigateur par défaut du système, jamais dans la fenêtre de l'app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  const menuTemplate = [
    {
      label: 'Fichier',
      submenu: [
        { role: 'reload', label: 'Recharger' },
        { role: 'toggleDevTools', label: 'Outils de développement' },
        { type: 'separator' },
        { role: 'quit', label: 'Quitter' },
      ],
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'resetZoom', label: 'Taille réelle' },
        { role: 'zoomIn', label: 'Zoom +' },
        { role: 'zoomOut', label: 'Zoom -' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Plein écran' },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
