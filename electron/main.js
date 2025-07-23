const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let serverProcess;

// Start the server process
function startServer() {
  console.log('Starting server...');

  // Path to the server entry point
  const serverPath = path.join(__dirname, '../apps/server/dist/index.js');

  serverProcess = spawn('node', [serverPath], {
    stdio: 'pipe',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      DATABASE_URL: 'file:./data/production.sqlite.db',
      API_PORT: '4040',
      CLIENT_PORT: '3000',
    },
  });

  serverProcess.stdout.on('data', (data) => {
    console.log('Server stdout:', data.toString());
  });

  serverProcess.stderr.on('data', (data) => {
    console.log('Server stderr:', data.toString());
  });

  serverProcess.on('close', (code) => {
    console.log('Server process exited with code:', code);
  });
}

// Create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'Touch Client',
  });

  // Load the app
  const startUrl = 'http://localhost:3000';
  mainWindow.loadURL(startUrl);

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App event handlers
app.whenReady().then(() => {
  startServer();

  // Wait a bit for server to start
  setTimeout(() => {
    createWindow();
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    console.log('Stopping server...');
    serverProcess.kill();
  }
});

// Handle IPC messages from renderer
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-name', () => {
  return app.getName();
});
