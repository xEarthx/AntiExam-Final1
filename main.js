import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM style __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    kiosk: true, // ป้องกัน Alt+Tab, fullscreen
    autoHideMenuBar: true,       // ✅ ซ่อน menu bar
    menuBarVisible: false,       // ✅ ปิดไม่ให้กด Alt แล้วโผล่มา
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // preload
    },
  });

  win.loadURL('http://localhost:5173'); // Vite dev server

  win.once('ready-to-show', () => {
    win.show(); // ปลอดภัยเผื่อ kiosk บั๊ก
    console.log('✅ Window is now running in kiosk mode');
  });
}

app.whenReady().then(() => {
  createWindow();
  console.log('🟢 App is ready');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('exit-app', () => {
  app.quit();
});
