const { app, BrowserWindow, ipcMain, session } = require('electron');
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
      API_PROTOCOL: 'http',
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
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false, // We need this false for our preload script
    },
    title: 'Touch Client',
  });

  // Set Content Security Policy
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:4040 https://localhost:4040;",
        ],
      },
    });
  });

  // Load the app
  const startUrl = 'http://localhost:4040';
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

// Handle IPC messages from renderer with sender validation
ipcMain.handle('get-app-version', (event) => {
  // Validate sender - only allow from our own app
  if (event.senderFrame && event.senderFrame.url.startsWith('http://localhost:4040')) {
    return app.getVersion();
  }
  return null;
});

ipcMain.handle('get-app-name', (event) => {
  // Validate sender - only allow from our own app
  if (event.senderFrame && event.senderFrame.url.startsWith('http://localhost:4040')) {
    return app.getName();
  }
  return null;
});
