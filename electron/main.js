const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

// Ensure single instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  console.log('Another instance is already running. Quitting.');
  app.quit();
  return;
}

let mainWindow;
let serverProcess;
let serverStartAttempts = 0;
const MAX_SERVER_ATTEMPTS = 3;
let isQuitting = false; // Track if app is actually quitting

// Start the server process
function startServer() {
  if (serverStartAttempts >= MAX_SERVER_ATTEMPTS) {
    console.error('Max server start attempts reached. Starting app without server.');
    // Only create window if none exists
    if (!mainWindow || mainWindow.isDestroyed()) {
      createWindow();
    }
    return;
  }

  serverStartAttempts++;
  console.log(`Starting server (attempt ${serverStartAttempts}/${MAX_SERVER_ATTEMPTS})...`);

  // Path to the server entry point
  let serverPath;
  if (isDev) {
    serverPath = path.join(__dirname, '../apps/server/dist/index.js');
  } else {
    // In production, the server files are bundled with the app
    // Try multiple possible locations
    const possiblePaths = [
      path.join(process.resourcesPath, 'app.asar.unpacked/apps/server/dist/index.js'),
      path.join(__dirname, 'apps/server/dist/index.js'),
      path.join(process.resourcesPath, 'app.asar/apps/server/dist/index.js'),
    ];

    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        serverPath = testPath;
        break;
      }
    }

    if (!serverPath) {
      console.error('Server file not found in any expected location:', possiblePaths);
      serverPath = possiblePaths[1]; // Use the most likely path for error reporting
    }
  }

  console.log('Server path:', serverPath);

  // Check if server file exists
  if (!fs.existsSync(serverPath)) {
    console.error('Server file not found:', serverPath);
    if (serverStartAttempts < MAX_SERVER_ATTEMPTS && !isQuitting) {
      setTimeout(startServer, 5000);
    } else {
      console.error('Server file not found after all attempts. Starting app without server.');
      // Only create window if none exists
      if (!mainWindow || mainWindow.isDestroyed()) {
        createWindow();
      }
    }
    return;
  }

  // In production (packaged app), we need to use the bundled Node.js
  // In development, we can use the system Node.js
  const nodeExecutable = isDev ? 'node' : process.execPath;

  serverProcess = spawn(nodeExecutable, [serverPath], {
    stdio: 'pipe',
    env: {
      ...process.env,
      NODE_ENV: 'development',
      DB_HOST: 'localhost',
      DB_USER: 'user',
      DB_PASS: '',
      DB_NAME: 'development.sqlite.db',
      DB_DIALECT: 'sqlite',
      DB_PORT: '3306',
      BETTER_AUTH_SECRET: 'your-32-character-secret-key-here-123456',
      BETTER_AUTH_URL: 'http://localhost:4040',
      API_PROTOCOL: 'http',
      API_PORT: '4040',
      CLIENT_PORT: '3000',
    },
  });

  serverProcess.stdout.on('data', (data) => {
    console.log('Server stdout:', data.toString());
  });

  serverProcess.stdout.on('error', (error) => {
    if (error.code !== 'EPIPE') {
      console.error('Server stdout error:', error);
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.log('Server stderr:', data.toString());
  });

  serverProcess.stderr.on('error', (error) => {
    if (error.code !== 'EPIPE') {
      console.error('Server stderr error:', error);
    }
  });

  serverProcess.on('close', (code) => {
    console.log('Server process exited with code:', code);

    // Don't retry if we're quitting the app
    if (isQuitting) {
      console.log('App is quitting, not restarting server');
      return;
    }

    if (code !== 0 && serverStartAttempts < MAX_SERVER_ATTEMPTS) {
      console.log(
        `Server failed, retrying in 5 seconds... (attempt ${serverStartAttempts}/${MAX_SERVER_ATTEMPTS})`,
      );
      // Only restart server, don't create new windows
      setTimeout(() => {
        if (!isQuitting) {
          startServer();
        }
      }, 5000);
    } else if (serverStartAttempts >= MAX_SERVER_ATTEMPTS) {
      console.error('Server failed after all attempts. Starting app without server.');
      // Only create window if none exists
      if (!mainWindow) {
        createWindow();
      }
    } else {
      // Server closed normally (code 0) - only log, don't create new windows
      console.log('Server closed normally');
    }
  });

  serverProcess.on('error', (error) => {
    console.error('Failed to start server:', error);

    // Don't retry if we're quitting the app
    if (isQuitting) {
      console.log('App is quitting, not restarting server');
      return;
    }

    if (serverStartAttempts < MAX_SERVER_ATTEMPTS) {
      console.log(
        `Server error, retrying in 5 seconds... (attempt ${serverStartAttempts}/${MAX_SERVER_ATTEMPTS})`,
      );
      // Only restart server, don't create new windows
      setTimeout(() => {
        if (!isQuitting) {
          startServer();
        }
      }, 5000);
    } else {
      console.error('Server failed after all attempts. Starting app without server.');
      // Only create window if none exists
      if (!mainWindow) {
        createWindow();
      }
    }
  });
}

// Create the main window
function createWindow() {
  // Prevent creating multiple windows
  if (mainWindow && !mainWindow.isDestroyed()) {
    console.log('Window already exists, bringing to front');
    mainWindow.focus();
    return;
  }

  console.log('Creating new electron window...');
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

  // Try to load the app, with fallback
  const startUrl = 'http://localhost:4040';

  mainWindow.loadURL(startUrl).catch((error) => {
    console.error('Failed to load app from server:', error);
    // Load fallback content
    mainWindow.loadURL(
      'data:text/html,<html><body><h1>Touch Client</h1><p>Server is not available. Please check if the server is running.</p><p>Error: ' +
        error.message +
        '</p></body></html>',
    );
  });

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

  // Wait for server to start, using server process status instead of HTTP checks
  let attempts = 0;
  const maxAttempts = 30; // Increased attempts
  let windowCreated = false;

  const checkServer = () => {
    attempts++;

    // Check if server process is running and responsive
    if (serverProcess && !serverProcess.killed) {
      // Try a simple API endpoint that should return JSON
      const http = require('http');
      const req = http.get('http://localhost:4040/api/drink-volumes', (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode === 200 && !windowCreated) {
            console.log('Server is ready and responsive!');
            windowCreated = true;
            createWindow();
          } else if (!windowCreated && attempts < maxAttempts) {
            setTimeout(checkServer, 1000);
          } else if (!windowCreated) {
            console.log('Server process running but API not ready, creating window anyway');
            windowCreated = true;
            createWindow();
          }
        });
      });

      req.on('error', (error) => {
        console.log(`Server check attempt ${attempts}: ${error.message}`);
        if (!windowCreated && attempts < maxAttempts) {
          setTimeout(checkServer, 1000);
        } else if (!windowCreated) {
          console.log('Server process running, creating window anyway');
          windowCreated = true;
          createWindow();
        }
      });

      req.setTimeout(3000, () => {
        req.destroy();
        if (!windowCreated && attempts < maxAttempts) {
          setTimeout(checkServer, 1000);
        } else if (!windowCreated) {
          console.log('Server check timeout, creating window anyway');
          windowCreated = true;
          createWindow();
        }
      });
    } else {
      // Server process not running
      if (!windowCreated && attempts < maxAttempts) {
        console.log(`Server process not ready, attempt ${attempts}/${maxAttempts}`);
        setTimeout(checkServer, 1000);
      } else if (!windowCreated) {
        console.log('Server process failed to start, creating window anyway');
        windowCreated = true;
        createWindow();
      }
    }
  };

  // Start checking after a short delay
  setTimeout(checkServer, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    isQuitting = true;
    app.quit();
  }
});

app.on('before-quit', (event) => {
  console.log('Before quit event triggered');

  // Only kill server if we're actually quitting (not on GPU crashes etc)
  if (!isQuitting) {
    console.log('Not actually quitting, ignoring before-quit event');
    return;
  }

  if (serverProcess && !serverProcess.killed) {
    console.log('Stopping server...');
    serverProcess.kill();
    serverProcess = null;
  }
});

// Explicitly handle app quit
app.on('will-quit', () => {
  isQuitting = true;
  console.log('App will quit - cleaning up...');
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
    serverProcess = null;
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
