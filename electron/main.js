// ============================================================
// LZContr 桌面应用主进程（Electron）
// - 启动内嵌 Express 后端（真实 API，数据写入 userData）
// - 生产模式托管 dist/ + /api，窗口加载本地服务（同源）
// ============================================================
import { app, BrowserWindow, shell } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from '../server/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let server = null;

function createWindow(url) {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'LZContr · 合同生成器',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // 外链用系统浏览器打开，内部导航留在窗口
  win.webContents.setWindowOpenHandler(({ url: u }) => {
    if (u.startsWith('http')) shell.openExternal(u);
    return { action: 'deny' };
  });

  win.loadURL(url);
  return win;
}

async function bootstrap() {
  // 数据目录指向 userData（打包后 app.asar 只读，不能写 JSON）
  process.env.LZCONTR_DATA_DIR = app.getPath('userData');
  // 内嵌真实后端（随机端口，生产模式托管 dist/ + /api）
  const { port, server: srv } = await startServer({ port: 0, prod: true });
  const url = `http://127.0.0.1:${port}/`;
  server = srv;

  createWindow(url);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(url);
  });
}

app.whenReady().then(bootstrap).catch((e) => {
  console.error('[lzcontr-desktop] 启动失败', e);
  app.quit();
});

app.on('window-all-closed', () => {
  if (server) server.close();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (server) server.close();
});
