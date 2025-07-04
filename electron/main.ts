import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { fileURLToPath } from 'node:url';
import { spawn } from 'child_process';
import Store from 'electron-store';
import path from 'node:path';
import { platform } from 'node:os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

const store = new Store();

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  // win.setMenu(null);

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('open_file', async (_event, isFile: boolean, fileExtensions: string[]) => {
  const options: Electron.OpenDialogOptions = {
    properties: [isFile ? 'openFile' : 'openDirectory'],
  };

  if (isFile) options.properties?.push('multiSelections');
  if (fileExtensions)
    options.filters = [{ name: `${fileExtensions[0]} ... extensions`, extensions: fileExtensions }];

  const { canceled, filePaths } = await dialog.showOpenDialog(options);

  if (canceled) return null;
  return filePaths;
});

ipcMain.handle('app_quit', () => {
  app.quit();
});

ipcMain.on('run_command', (event, command: string, args: string[]) => {
  const child = spawn(command, args);

  console.log(`Running: ${command} with args: ${args}`);

  child.stdout.on('data', (data) => {
    event.sender.send('stdout', String(data));
  });

  child.on('error', (error) => {
    event.sender.send('stderr', String(error));
    console.log('stderr: ', error);
  });

  child.stdout.on('close', () => {
    event.sender.send('closed');
    console.log(`${command} closed.`);
  });
});

ipcMain.handle('set_store', (_event, key: string, value: JSON | string) => {
  store.set(key, value);
});

ipcMain.handle('get_store', (_event, key: string) => {
  const value = store.get(key);

  return value;
});

ipcMain.handle('get_os', () => {
  const os: NodeJS.Platform = platform();
  switch (os) {
    case 'win32': {
      return 'windows';
    }
    case 'linux': {
      return 'linux';
    }
    case 'darwin': {
      return 'macos';
    }
    default: {
      return 'unknown';
    }
  }
});

app.whenReady().then(createWindow);
