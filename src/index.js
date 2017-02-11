import {
  app,
  BrowserWindow,
} from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import i18n from 'i18n';
import path from 'path';
import setMenu from './main/appMenuManager';
import setIpc from './main/appIpcManager';
import {
  handleStartupEvent,
} from './main/appStartupManager';

// const startTime = new Date();
global.shareObject = {
  nowFilePath: '',
  nowFileName: '',
  mainWindowName: 'onPress',
  defaultMainWindowName: 'onPress',
};

i18n.configure({
  locales: ['ko', 'en'],
  directory: path.resolve(__dirname, 'locales'),
  register: global,
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);

const createWindow = async () => {
  i18n.setLocale(app.getLocale());

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.setTitle(global.shareObject.mainWindowName);

  setMenu(mainWindow.webContents, __);
  setIpc(mainWindow, __);

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

if (!handleStartupEvent()) {
  app.on('ready', createWindow);
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
