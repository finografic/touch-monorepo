#!/usr/bin/env tsx
import { copyFile, mkdir, readFile, writeFile, cp, readdir, stat } from 'fs/promises';
import { join, resolve, dirname } from 'path';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = resolve(__dirname, '../../../deployment');
const WORKSPACE_ROOT = resolve(__dirname, '../../..');

interface BuildConfig {
  distDir: string;
  workspaceRoot: string;
  clientDir: string;
  serverDir: string;
  dataDir: string;
  configDir: string;
  buildDir: string;
  targetPlatform?: 'windows' | 'linux' | 'macos' | 'universal';
  targetArch?: 'x64' | 'arm64' | 'universal';
  includeNode?: boolean;
  standalone?: boolean;
}

interface BuildOptions {
  platform?: 'windows' | 'linux' | 'macos' | 'universal';
  arch?: 'x64' | 'arm64' | 'universal';
  includeNode?: boolean;
  standalone?: boolean;
  zip?: boolean;
  outputDir?: string;
}

const config: BuildConfig = {
  distDir: DIST_DIR,
  workspaceRoot: WORKSPACE_ROOT,
  clientDir: join(WORKSPACE_ROOT, 'apps/client'),
  serverDir: join(WORKSPACE_ROOT, 'apps/server'),
  dataDir: join(WORKSPACE_ROOT, 'data'),
  configDir: join(WORKSPACE_ROOT, 'config'),
  buildDir: join(DIST_DIR, 'dist'),
};

async function cleanDistDirectory(): Promise<void> {
  console.log('🧹 Cleaning distribution directory...');
  // Only clean the dist subdirectory, preserve other files like ports.utils.js
  execSync(`rm -rf ${config.buildDir}`, { stdio: 'inherit' });
}

async function createDistStructure(): Promise<void> {
  console.log('📁 Creating deployment directory structure...');

  const directories = [
    config.distDir,
    config.buildDir,
    join(config.buildDir, 'client'),
    join(config.buildDir, 'server'),
    join(config.buildDir, 'data'),
    join(config.buildDir, 'data/db'),
    join(config.buildDir, 'data/uploads'),
    join(config.buildDir, 'data/migrations'),
  ];

  for (const dir of directories) {
    await mkdir(dir, { recursive: true });
  }
}

async function buildClient(): Promise<void> {
  console.log('🏗️  Building client application...');

  try {
    execSync('pnpm --filter @workspace/client build.production', {
      cwd: config.workspaceRoot,
      stdio: 'inherit',
    });

    // Copy client build output to dist/client
    const clientBuildDir = join(config.clientDir, 'dist');
    if (existsSync(clientBuildDir)) {
      await cp(clientBuildDir, join(config.buildDir, 'client'), { recursive: true });
      console.log('✅ Client build copied to deployment');
    } else {
      throw new Error('Client build directory not found');
    }
  } catch (error) {
    console.error('❌ Client build failed:', error);
    throw error;
  }
}

async function buildServer(): Promise<void> {
  console.log('🏗️  Building server application...');

  try {
    // Build server with bundling to eliminate node_modules dependency
    execSync('pnpm --filter @workspace/server build.production', {
      cwd: config.workspaceRoot,
      stdio: 'inherit',
    });

    // Copy server build output to dist/server
    const serverBuildDir = join(config.serverDir, 'dist');
    if (existsSync(serverBuildDir)) {
      await cp(serverBuildDir, join(config.buildDir, 'server'), { recursive: true });
      console.log('✅ Server build copied to deployment');
    } else {
      throw new Error('Server build directory not found');
    }
  } catch (error) {
    console.error('❌ Server build failed:', error);
    throw error;
  }
}

async function copyDataFiles(): Promise<void> {
  console.log('📊 Copying data files...');

  try {
    // Copy database files to dist/data/db
    const dbFiles = ['development.sqlite.db'];
    for (const dbFile of dbFiles) {
      const srcPath = join(config.dataDir, dbFile);
      if (existsSync(srcPath)) {
        const destPath = join(config.buildDir, 'data/db', 'production.sqlite.db');
        await copyFile(srcPath, destPath);
        console.log(`✅ Database ${dbFile} copied as production.sqlite.db`);
      }
    }

    // Copy migrations to dist/data/migrations
    const migrationsDir = join(config.dataDir, 'migrations');
    if (existsSync(migrationsDir)) {
      await cp(migrationsDir, join(config.buildDir, 'data/migrations'), { recursive: true });
      console.log('✅ Database migrations copied');
    }

    // Copy uploads directory to dist/data/uploads
    const uploadsDir = join(config.dataDir, 'uploads');
    if (existsSync(uploadsDir)) {
      await cp(uploadsDir, join(config.buildDir, 'data/uploads'), { recursive: true });
      console.log('✅ Uploads directory copied');
    }
  } catch (error) {
    console.error('❌ Failed to copy data files:', error);
    throw error;
  }
}

async function consolidateEnvironmentFiles(): Promise<void> {
  console.log('⚙️  Consolidating environment files...');

  try {
    // Only include essential production variables
    const envContent: string[] = [
      '# PRODUCTION ENVIRONMENT - AUTO-GENERATED',
      '# DO NOT EDIT MANUALLY',
      '',
      '# Application Environment',
      'NODE_ENV=production',
      '',
      '# API Server Configuration',
      'API_PROTOCOL=http',
      'API_HOST=localhost',
      'API_PORT=4040',
      'API_BASE_PATH=/api',
      'API_URL=http://localhost:4040/api',
      '',
      '# Client Configuration',
      'CLIENT_PROTOCOL=http',
      'CLIENT_HOST=localhost',
      'CLIENT_PORT=3000',
      'CLIENT_ORIGIN=http://localhost:3000',
      'VITE_APP_NAME=Touch Monorepo',
      '',
      '# Database Configuration',
      'DB_DIALECT=sqlite',
      'DB_HOST=localhost',
      'DB_USER=admin',
      'DB_PORT=0',
      'DATABASE_URL=./data/db/production.sqlite.db',
      'DB_NAME=production.sqlite.db',
      '',
      '# Authentication',
      'BETTER_AUTH_SECRET=your-super-secret-auth-key-minimum-32-characters-long',
      'BETTER_AUTH_URL=http://localhost:4040',
      '',
      '# File Uploads',
      'UPLOAD_DIR=./data/uploads',
      '',
      '# Logging Configuration',
      'PINO_DISABLE_WORKER_THREADS=true',
      'PINO_LOG_LEVEL=info',
      '',
    ];

    // Create .env.production in dist/ and config/
    const envLocations = [
      join(config.buildDir, '.env.production'),
      join(config.distDir, 'config', '.env.production'), // Root level config/
    ];

    // Create config directory if it doesn't exist
    await mkdir(join(config.distDir, 'config'), { recursive: true });

    // Write to all locations
    for (const envPath of envLocations) {
      await writeFile(envPath, envContent.join('\n'));
      console.log('✅ Created environment file:', envPath);
    }

    console.log('✅ Environment files consolidated');
  } catch (error) {
    console.error('❌ Failed to consolidate environment files:', error);
    throw error;
  }
}

async function createPortsUtility(): Promise<void> {
  console.log('🔧 Creating ports utility...');

  const portsUtility = `import { execSync } from 'child_process';

// Function to kill processes on specific ports
export function killPortIfOccupied(port) {
  try {
    const result = execSync('lsof -ti:' + port, { stdio: 'pipe' })
      .toString()
      .trim();
    if (result) {
      console.log('⚠️  Port ' + port + ' is occupied, killing process...');
      execSync('lsof -ti:' + port + ' | xargs kill -9', { stdio: 'inherit' });
      console.log('✅ Killed process on port ' + port);
    } else {
      console.log('✅ Port ' + port + ' is available');
    }
  } catch (error) {
    // Port is not in use
    console.log('✅ Port ' + port + ' is available');
  }
}
`;

  await writeFile(join(config.distDir, 'ports.utils.js'), portsUtility);
  console.log('✅ Ports utility created');
}

async function createStartupScript(): Promise<void> {
  console.log('🚀 Creating startup script...');

  // Read template file
  const templatePath = join(__dirname, 'templates/start-server.js.template');
  const templateContent = await readFile(templatePath, 'utf-8');

  // Replace template variables
  const startScript = templateContent.replace(/{{SERVER_PORT}}/g, '4040').replace(/{{CLIENT_PORT}}/g, '3000');

  await writeFile(join(config.distDir, 'start-server.js'), startScript);

  // Make it executable
  execSync(`chmod +x ${join(config.distDir, 'start-server.js')}`, { stdio: 'inherit' });

  console.log('✅ Startup script created as start-server.js');
}

async function createClientServer(): Promise<void> {
  console.log('🌐 Creating client server script...');

  // Read template file
  const templatePath = join(__dirname, 'templates/start-client.js.template');
  const templateContent = await readFile(templatePath, 'utf-8');

  // Replace template variables
  const clientServerScript = templateContent.replace(/{{CLIENT_PORT}}/g, '3000');

  await writeFile(join(config.distDir, 'start-client.js'), clientServerScript);

  // Make it executable
  execSync(`chmod +x ${join(config.distDir, 'start-client.js')}`, { stdio: 'inherit' });

  console.log('✅ Client server script created');
}

async function createPackageJson(): Promise<void> {
  console.log('📦 Creating production package.json...');

  // Read server package.json to get dependencies
  const serverPackagePath = join(config.serverDir, 'package.json');
  const serverPackageContent = await readFile(serverPackagePath, 'utf-8');
  const serverPackage = JSON.parse(serverPackageContent);

  // Get all server dependencies (excluding workspace packages)
  const serverDependencies = { ...serverPackage.dependencies };

  // Remove workspace packages as they're bundled
  Object.keys(serverDependencies).forEach((key) => {
    if (key.startsWith('@workspace/')) {
      delete serverDependencies[key];
    }
  });

  const packageJson = {
    name: 'touch-monorepo-production',
    version: '1.0.0',
    description: 'Touch Monorepo Production Distribution',
    private: true,
    type: 'module',
    scripts: {
      'start': 'run-p start:server start:client',
      'start:v1': 'node start-server.js',
      'start:server': 'node start-server.js',
      'start:client': 'node start-client.js',
      'start:both': 'npm-run-all --parallel start:server start:client',
    },
    dependencies: {
      ...serverDependencies,
      dotenv: '^16.0.0',
    },
    optionalDependencies: {
      'npm-run-all': '^4.1.5',
      'serve': '^14.0.0',
    },
    engines: {
      node: '>=20.0.0',
    },
  };

  await writeFile(join(config.distDir, 'package.json'), JSON.stringify(packageJson, null, 2));

  console.log('✅ Production package.json created');
}

async function createReadme(): Promise<void> {
  console.log('📖 Creating README...');

  const readme = `# Touch Monorepo - Deployment

This is a self-contained deployment build of the Touch Monorepo application.

## Quick Start

\`\`\`bash
# Start both server and client
npm start

# Or start them separately
npm run start:server  # Backend server on port 4040
npm run start:client  # Frontend with API proxy on port 3000

# Or run directly
node start-server.js & node start-client.js
\`\`\`

## Structure

\`\`\`
deployment/
├── dist/                    # Build artifacts (regenerated each time)
│   ├── client/             # Client build output
│   ├── server/             # Server build output
│   └── data/               # Database, migrations, uploads
├── node_modules/           # Dependencies (preserved)
├── .env                    # Environment configuration
├── .env.production         # Production environment
├── package.json            # Dependencies and scripts
├── ports.utils.js          # Port management utility
├── start-server.js         # Backend server startup
├── start-client.js         # Frontend server with API proxy
├── test-production.js      # Test script
└── README.md               # This file
\`\`\`

## Scripts

- \`start-server.js\` - Starts the backend API server on port 4040
- \`start-client.js\` - Starts the frontend server on port 3000 with API proxy
- \`ports.utils.js\` - Utility for managing port conflicts
- \`test-production.js\` - Tests the deployment build

## Configuration

Edit \`.env\` to customize:
- \`API_PORT\` - Backend server port (default: 4040)
- \`CLIENT_PORT\` - Frontend server port (default: 3000)
- Database settings
- Other environment variables

## Data

The SQLite database is located at \`dist/data/db/production.sqlite.db\`.
Uploads are stored in \`dist/data/uploads/\`.

## Requirements

- Node.js 20.0.0 or higher
- No other dependencies required

## Troubleshooting

1. **Port conflicts**: The scripts automatically kill processes on occupied ports
2. **Database issues**: Check that \`dist/data/db/production.sqlite.db\` exists
3. **Permission issues**: Ensure scripts are executable (\`chmod +x start-server.js start-client.js\`)

## Architecture

This deployment structure separates:
- **Build artifacts** (\`dist/\`) - Regenerated on each build
- **Runtime files** (scripts, configs) - Preserved between builds
- **Dependencies** (\`node_modules/\`) - Installed once and preserved

Generated on: ${new Date().toISOString()}
`;

  await writeFile(join(config.distDir, 'README.md'), readme);
  console.log('✅ README created');
}

async function createTestScript(): Promise<void> {
  console.log('🧪 Creating test script...');

  const testScript = `#!/usr/bin/env node
/**
 * Touch Monorepo Production Build Test Script
 * Tests the production build to ensure everything is working
 */

import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { killPortIfOccupied } from './ports.utils.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing Touch Monorepo Production Build...');
console.log('='.repeat(50));

// Test 1: Check required files exist
console.log('\\n📁 Checking required files...');
const requiredFiles = [
  'dist/server/index.js',
  'dist/client/index.html',
  'dist/data/db/production.sqlite.db',
  '.env',
  'start-server.js',
  'start-client.js',
  'ports.utils.js',
  'package.json'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  const exists = existsSync(filePath);
  console.log((exists ? '✅' : '❌') + ' ' + file);
  if (!exists) allFilesExist = false;
}

if (!allFilesExist) {
  console.error('\\n❌ Some required files are missing!');
  process.exit(1);
}

console.log('\\n✅ All required files found');

// Test 2: Check ports utility
console.log('\\n🔧 Testing ports utility...');
try {
  killPortIfOccupied('9999'); // Test with a port that shouldn't be in use
  console.log('✅ Ports utility is working');
} catch (error) {
  console.log('❌ Ports utility error:', error.message);
}

// Test 3: Check if servers are running
console.log('\\n🌐 Testing server connectivity...');

try {
  // Test server API
  const serverResponse = await fetch('http://localhost:4040/api');
  if (serverResponse.ok) {
    console.log('✅ Server API is responding');
  } else {
    console.log('❌ Server API is not responding correctly');
  }
} catch (error) {
  console.log('❌ Server API is not accessible:', error.message);
}

try {
  // Test client
  const clientResponse = await fetch('http://localhost:3000');
  if (clientResponse.ok) {
    console.log('✅ Client is responding');
  } else {
    console.log('❌ Client is not responding correctly');
  }
} catch (error) {
  console.log('❌ Client is not accessible:', error.message);
}

console.log('\\n🎉 Production build test completed!');
console.log('\\n📋 Summary:');
console.log('- Server: http://localhost:4040');
console.log('- Client: http://localhost:3000');
console.log('- Database: ./dist/data/db/production.sqlite.db');
console.log('\\n🚀 To start the servers:');
console.log('  node start-server.js & node start-client.js');
`;

  await writeFile(join(config.distDir, 'test-production.js'), testScript);

  // Make it executable
  execSync(`chmod +x ${join(config.distDir, 'test-production.js')}`, { stdio: 'inherit' });

  console.log('✅ Test script created');
}

async function installDependencies(): Promise<void> {
  console.log('📦 Installing production dependencies...');

  try {
    // Install dependencies in the deployment directory
    execSync('npm install --production', {
      cwd: config.distDir,
      stdio: 'inherit',
    });

    console.log('✅ Production dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error);
    throw error;
  }
}

async function killPortsIfOccupied(): Promise<void> {
  console.log('🔧 Checking for occupied ports...');

  const ports = [3000, 4040];

  for (const port of ports) {
    try {
      // Check if port is in use
      const result = execSync(`lsof -ti:${port}`, { stdio: 'pipe' }).toString().trim();
      if (result) {
        console.log(`⚠️  Port ${port} is occupied, killing process...`);
        execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'inherit' });
        console.log(`✅ Killed process on port ${port}`);
      } else {
        console.log(`✅ Port ${port} is available`);
      }
    } catch (error) {
      // Port is not in use (lsof returns non-zero exit code)
      console.log(`✅ Port ${port} is available`);
    }
  }
}

async function copyEnvExample(): Promise<void> {
  console.log('📋 Copying .env.example...');

  try {
    const examplePath = join(config.workspaceRoot, '.env.example');
    if (existsSync(examplePath)) {
      await copyFile(examplePath, join(config.distDir, '.env.example'));
      console.log('✅ .env.example copied to deployment');
    } else {
      console.log('⚠️  .env.example not found, skipping');
    }
  } catch (error) {
    console.error('❌ Failed to copy .env.example:', error);
    // Don't throw error, this is not critical
  }
}

async function cleanPlatformArtifacts(): Promise<void> {
  console.log('🧽 Cleaning platform-specific artifacts in deployment root...');
  try {
    const cmd = [
      `cd "${config.distDir}"`,
      // remove any previously generated platform-specific scripts/docs
      'rm -f setup.bat setup.sh setup-macos.sh',
      'rm -f start-*.bat start-*.sh',
      'rm -f USER_GUIDE*.md GUIA_USUARIO*.md',
    ].join(' && ');
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️  Failed to clean some platform artifacts (safe to ignore if not present).');
  }
}

async function createSetupScripts(options: BuildOptions): Promise<void> {
  console.log('🔧 Creating platform-specific setup scripts...');

  const setupScripts = {
    windows: `@echo off
setlocal ENABLEDELAYEDEXPANSION
echo ========================================
echo Touch Monorepo - Windows Setup
echo ========================================
echo.

REM 1) Ensure Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Attempting to install Node.js LTS via winget...
    winget --version >nul 2>&1
    if %errorlevel% EQU 0 (
        winget install OpenJS.NodeJS.LTS -e --silent --accept-source-agreements --accept-package-agreements
        if %errorlevel% NEQ 0 (
            echo ⚠️  winget install failed. Checking for Chocolatey...
            choco -v >nul 2>&1
            if %errorlevel% EQU 0 (
                choco install nodejs-lts -y
            ) else (
                echo ⚠️  Chocolatey not found. Opening Node.js download page...
                start https://nodejs.org/
                echo Please install Node.js LTS manually, then press any key to continue.
                pause >nul
            )
        )
    ) else (
        echo ⚠️  winget not available. Checking for Chocolatey...
        choco -v >nul 2>&1
        if %errorlevel% EQU 0 (
            choco install nodejs-lts -y
        ) else (
            echo ⚠️  Chocolatey not found. Opening Node.js download page...
            start https://nodejs.org/
            echo Please install Node.js LTS manually, then press any key to continue.
            pause >nul
        )
    )
)

REM Refresh PATH for current session (common install location)
set PATH=%PATH%;C:\\Program Files\\nodejs

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js still not detected. Please close this window, install Node.js, then run setup.bat again.
    pause
    exit /b 1
)

echo ✅ Node.js found:
node --version

echo ✅ npm found:
npm --version

echo.
echo 📦 Installing dependencies (production)...
npm install --production
if %errorlevel% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🚀 Starting application (server + client)...
start "server" cmd /c start-server.bat
start "client" cmd /c start-client.bat

echo.
echo 🎉 Setup completed. Two windows should be running (server and client).
pause
`,
    linux: `#!/bin/bash
set -e

echo "========================================"
echo "Touch Monorepo - Linux Setup"
echo "========================================"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is not installed. Attempting to install..."
  if command -v apt >/dev/null 2>&1; then
    sudo apt update && sudo apt install -y nodejs npm
  elif command -v dnf >/dev/null 2>&1; then
    sudo dnf install -y nodejs npm
  elif command -v pacman >/dev/null 2>&1; then
    sudo pacman -Sy --noconfirm nodejs npm
  else
    echo "⚠️  Could not auto-install Node.js. Please install Node 20+ from https://nodejs.org/ then re-run ./setup.sh"
    exit 1
  fi
fi

echo "✅ Node.js: $(node -v)"
echo "✅ npm: $(npm -v)"

echo "📦 Installing dependencies (production)..."
npm install --production

echo "🚀 Starting application (server + client)..."
chmod +x start-server.sh start-client.sh || true
(./start-server.sh &) >/dev/null 2>&1
(./start-client.sh &) >/dev/null 2>&1

echo "🎉 Setup completed. Server and client started in background."
`,
    macos: `#!/bin/bash
set -e

echo "========================================"
echo "Touch Monorepo - macOS Setup"
echo "========================================"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is not installed. Attempting Homebrew install..."
  if command -v brew >/dev/null 2>&1; then
    brew install node
  else
    echo "⚠️  Homebrew not found. Installing Homebrew (may prompt for password)..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
    brew install node
  fi
fi

echo "✅ Node.js: $(node -v)"
echo "✅ npm: $(npm -v)"

echo "📦 Installing dependencies (production)..."
npm install --production

echo "🚀 Starting application (server + client)..."
chmod +x start-server-macos.sh start-client-macos.sh || true
(./start-server-macos.sh &) >/dev/null 2>&1
(./start-client-macos.sh &) >/dev/null 2>&1

echo "🎉 Setup completed. Server and client started in background."
`,
  };

  // Create platform-specific setup scripts
  if (options.platform === 'windows') {
    await writeFile(join(config.distDir, 'setup.bat'), setupScripts.windows);
    console.log('✅ Windows setup script created (setup.bat)');
  }

  if (options.platform === 'linux') {
    await writeFile(join(config.distDir, 'setup.sh'), setupScripts.linux);
    execSync(`chmod +x ${join(config.distDir, 'setup.sh')}`, { stdio: 'inherit' });
    console.log('✅ Linux setup script created (setup.sh)');
  }

  if (options.platform === 'macos') {
    await writeFile(join(config.distDir, 'setup-macos.sh'), setupScripts.macos);
    execSync(`chmod +x ${join(config.distDir, 'setup-macos.sh')}`, { stdio: 'inherit' });
    console.log('✅ macOS setup script created (setup-macos.sh)');
  }
}

async function createPlatformSpecificScripts(options: BuildOptions): Promise<void> {
  console.log('🔧 Creating platform-specific startup scripts...');

  const scripts = {
    windows: {
      server: `@echo off
echo Starting Touch Monorepo Server...
cd /d "%~dp0"
node dist/server/index.js
`,
      client: `@echo off
echo Starting Touch Monorepo Client...
cd /d "%~dp0"
node dist/client/server.js
`,
      both: `@echo off
cd /d "%~dp0"
start "server" cmd /c start-server.bat
start "client" cmd /c start-client.bat
`,
    },
    linux: {
      server: `#!/bin/bash
echo "Starting Touch Monorepo Server..."
cd "$(dirname "$0")"
node dist/server/index.js
`,
      client: `#!/bin/bash
echo "Starting Touch Monorepo Client..."
cd "$(dirname "$0")"
node dist/client/server.js
`,
      both: `#!/bin/bash
cd "$(dirname "$0")"
(./start-server.sh &) >/dev/null 2>&1
(./start-client.sh &) >/dev/null 2>&1
`,
    },
    macos: {
      server: `#!/bin/bash
echo "Starting Touch Monorepo Server..."
cd "$(dirname "$0")"
node dist/server/index.js
`,
      client: `#!/bin/bash
echo "Starting Touch Monorepo Client..."
cd "$(dirname "$0")"
node dist/client/server.js
`,
      both: `#!/bin/bash
cd "$(dirname "$0")"
(./start-server-macos.sh &) >/dev/null 2>&1
(./start-client-macos.sh &) >/dev/null 2>&1
`,
    },
  };

  if (options.platform === 'windows') {
    await writeFile(join(config.distDir, 'start-server.bat'), scripts.windows.server);
    await writeFile(join(config.distDir, 'start-client.bat'), scripts.windows.client);
    await writeFile(join(config.distDir, 'start-both.bat'), scripts.windows.both);
    console.log('✅ Windows startup scripts created');
  }

  if (options.platform === 'linux') {
    await writeFile(join(config.distDir, 'start-server.sh'), scripts.linux.server);
    await writeFile(join(config.distDir, 'start-client.sh'), scripts.linux.client);
    await writeFile(join(config.distDir, 'start-both.sh'), scripts.linux.both);
    execSync(
      `chmod +x ${join(config.distDir, 'start-server.sh')} ${join(config.distDir, 'start-client.sh')} ${join(config.distDir, 'start-both.sh')}`,
      { stdio: 'inherit' },
    );
    console.log('✅ Linux startup scripts created');
  }

  if (options.platform === 'macos') {
    await writeFile(join(config.distDir, 'start-server-macos.sh'), scripts.macos.server);
    await writeFile(join(config.distDir, 'start-client-macos.sh'), scripts.macos.client);
    await writeFile(join(config.distDir, 'start-both-macos.sh'), scripts.macos.both);
    execSync(
      `chmod +x ${join(config.distDir, 'start-server-macos.sh')} ${join(config.distDir, 'start-client-macos.sh')} ${join(config.distDir, 'start-both-macos.sh')}`,
      { stdio: 'inherit' },
    );
    console.log('✅ macOS startup scripts created');
  }
}

async function createZipArchive(options: BuildOptions): Promise<void> {
  console.log('📦 Creating deployment archive...');

  const platform = options.platform || 'universal';
  const arch = options.arch || 'universal';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const zipName = `touch-monorepo-${platform}-${arch}-${timestamp}.zip`;
  const zipPath = join(options.outputDir || config.workspaceRoot, zipName);

  try {
    // Use system zip command
    const zipCommand = `cd "${config.distDir}" && zip -r "${zipPath}" . -x "node_modules/*" "*.log" ".DS_Store"`;
    execSync(zipCommand, { stdio: 'inherit' });

    console.log(`✅ Deployment archive created: ${zipName}`);
    console.log(`📁 Location: ${zipPath}`);
  } catch (error) {
    console.error('❌ Failed to create zip archive:', error);
    throw error;
  }
}

async function createStandalonePackage(options: BuildOptions): Promise<void> {
  console.log('📦 Creating standalone package...');

  // Create a minimal package.json for standalone deployment
  const standalonePackageJson = {
    name: 'touch-monorepo-standalone',
    version: '1.0.0',
    description: 'Touch Monorepo Standalone Deployment',
    private: true,
    type: 'module',
    scripts: {
      'start': 'node dist/server/index.js',
      'start:client': 'node dist/client/server.js',
      'start:both': 'concurrently "npm run start" "npm run start:client"',
      'setup': options.platform === 'windows' ? 'setup.bat' : './setup.sh',
    },
    dependencies: {
      'better-sqlite3': '11.9.0',
      'dotenv': '^16.0.0',
      'concurrently': '^4.1.5',
    },
    engines: {
      node: '>=20.0.0',
    },
  };

  await writeFile(join(config.distDir, 'package.json'), JSON.stringify(standalonePackageJson, null, 2));
  console.log('✅ Standalone package.json created');
}

async function createUserDocumentation(options: BuildOptions): Promise<void> {
  console.log('📝 Creating user documentation...');

  const platform = options.platform || 'universal';
  const isWindows = platform === 'windows' || platform === 'universal';
  const isLinux = platform === 'linux' || platform === 'universal';
  const isMacOS = platform === 'macos' || platform === 'universal';

  // English User Guide
  const englishGuide = `# Touch Monorepo - User Guide

## 🎯 Welcome!

This guide will help you set up and run the Touch Monorepo application on your computer. No technical knowledge required!

## 📋 What You Need

- **Windows 10/11**: Any recent Windows computer
- **Linux (Ubuntu/Debian)**: Any Linux computer
- **macOS**: Any Mac computer (Intel or Apple Silicon)
- **Internet connection**: For initial setup (one-time only)

## 🚀 Quick Start Guide

### Step 1: Extract the Files

1. **Find the downloaded file**: Look for a file ending in \`.zip\` (e.g., \`touch-monorepo-windows-x64-2024-01-15.zip\`)
2. **Right-click the file** and select "Extract All" or "Extract Here"
3. **Choose a location** (like your Desktop or Documents folder)
4. **Click "Extract"**

### Step 2: Run the Setup

${
  isWindows
    ? `#### For Windows Users

1. **Open the extracted folder** (double-click the folder)
2. **Find the file called \`setup.bat\`** (it has a gear icon)
3. **Double-click \`setup.bat\`**
4. **Wait for the setup to complete** (this may take a few minutes)
5. **Click "OK" when it says "Setup completed successfully!"**

**If you see an error about Node.js:**
- Go to https://nodejs.org/
- Click the big green "LTS" button to download
- Run the installer and follow the instructions
- Then try running \`setup.bat\` again`
    : ''
}

${
  isLinux
    ? `#### For Linux Users

1. **Open Terminal** (press Ctrl+Alt+T)
2. **Navigate to the extracted folder**:
   \`\`\`bash
   cd /path/to/your/extracted/folder
   \`\`\`
3. **Make the setup script executable**:
   \`\`\`bash
   chmod +x setup.sh
   \`\`\`
4. **Run the setup**:
   \`\`\`bash
   ./setup.sh
   \`\`\`
5. **Wait for the setup to complete**

**If you see an error about Node.js:**
- Run: \`sudo apt update && sudo apt install nodejs npm\`
- Then try running \`./setup.sh\` again`
    : ''
}

${
  isMacOS
    ? `#### For macOS Users

1. **Open Terminal** (press Cmd+Space, type "Terminal", press Enter)
2. **Navigate to the extracted folder**:
   \`\`\`bash
   cd /path/to/your/extracted/folder
   \`\`\`
3. **Make the setup script executable**:
   \`\`\`bash
   chmod +x setup-macos.sh
   \`\`\`
4. **Run the setup**:
   \`\`\`bash
   ./setup-macos.sh
   \`\`\`
5. **Wait for the setup to complete**

**If you see an error about Node.js:**
- Go to https://nodejs.org/
- Click the big green "LTS" button to download
- Run the installer and follow the instructions
- Then try running \`./setup-macos.sh\` again`
    : ''
}

### Step 3: Start the Application

${
  isWindows
    ? `#### For Windows Users

1. **In the same folder**, find \`start-server.bat\`
2. **Double-click \`start-server.bat\`** (this starts the backend)
3. **Wait for it to say "Server is running"**
4. **In the same folder**, find \`start-client.bat\`
5. **Double-click \`start-client.bat\`** (this starts the frontend)
6. **Your web browser should open automatically** to the application

**Alternative**: Double-click \`start-both.bat\` to start both at once`
    : ''
}

${
  isLinux
    ? `#### For Linux Users

1. **In Terminal**, run the server:
   \`\`\`bash
   ./start-server.sh
   \`\`\`
2. **Open a new Terminal window** and run the client:
   \`\`\`bash
   ./start-client.sh
   \`\`\`
3. **Your web browser should open automatically** to the application

**Alternative**: Run \`npm start\` to start both at once`
    : ''
}

${
  isMacOS
    ? `#### For macOS Users

1. **In Terminal**, run the server:
   \`\`\`bash
   ./start-server-macos.sh
   \`\`\`
2. **Open a new Terminal window** and run the client:
   \`\`\`bash
   ./start-client-macos.sh
   \`\`\`
3. **Your web browser should open automatically** to the application

**Alternative**: Run \`npm start\` to start both at once`
    : ''
}

## 🌐 Using the Application

1. **Open your web browser** (Chrome, Firefox, Safari, Edge)
2. **Go to**: http://localhost:3000
3. **The application should load** and be ready to use!

## 🔧 Troubleshooting

### Common Issues

**"Node.js is not installed"**
- Follow the installation instructions above
- Make sure to restart your computer after installing Node.js

**"Port is already in use"**
- Close any other applications that might be using ports 3000 or 4040
- Restart your computer and try again

**"Permission denied" (Linux/macOS)**
- Make sure you ran the setup script first
- Try running: \`chmod +x *.sh\`

**"Application won't start"**
- Make sure you ran the setup script first
- Check that you're in the correct folder
- Try restarting your computer

### Getting Help

If you're still having trouble:

1. **Check the README.md file** in this folder for technical details
2. **Look for error messages** in the terminal/command prompt
3. **Make sure your computer meets the requirements** listed above
4. **Try running the setup script again**

## 📞 Support

For technical support, please provide:
- Your operating system (Windows/Linux/macOS)
- Any error messages you see
- Steps you've already tried

## 🎉 You're Ready!

Once the application is running, you can:
- Access it at http://localhost:3000
- Use all the features of the Touch Monorepo application
- Close the terminal/command prompt windows when you're done

**Note**: Keep the terminal/command prompt windows open while using the application. Close them when you're finished.

---

*Generated on: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}*
`;

  // Spanish User Guide
  const spanishGuide = `# Touch Monorepo - Guía de Usuario

## 🎯 ¡Bienvenido!

Esta guía te ayudará a configurar y ejecutar la aplicación Touch Monorepo en tu computadora. ¡No se requieren conocimientos técnicos!

## 📋 Lo Que Necesitas

- **Windows 10/11**: Cualquier computadora Windows reciente
- **Linux (Ubuntu/Debian)**: Cualquier computadora Linux
- **macOS**: Cualquier Mac (Intel o Apple Silicon)
- **Conexión a internet**: Para la configuración inicial (solo una vez)

## 🚀 Guía de Inicio Rápido

### Paso 1: Extraer los Archivos

1. **Encuentra el archivo descargado**: Busca un archivo que termine en \`.zip\` (ej., \`touch-monorepo-windows-x64-2024-01-15.zip\`)
2. **Haz clic derecho en el archivo** y selecciona "Extraer Todo" o "Extraer Aquí"
3. **Elige una ubicación** (como tu Escritorio o carpeta Documentos)
4. **Haz clic en "Extraer"**

### Paso 2: Ejecutar la Configuración

${
  isWindows
    ? `#### Para Usuarios de Windows

1. **Abre la carpeta extraída** (haz doble clic en la carpeta)
2. **Encuentra el archivo llamado \`setup.bat\`** (tiene un ícono de engranaje)
3. **Haz doble clic en \`setup.bat\`**
4. **Espera a que se complete la configuración** (esto puede tomar unos minutos)
5. **Haz clic en "OK" cuando diga "Setup completed successfully!"**

**Si ves un error sobre Node.js:**
- Ve a https://nodejs.org/
- Haz clic en el botón verde grande "LTS" para descargar
- Ejecuta el instalador y sigue las instrucciones
- Luego intenta ejecutar \`setup.bat\` nuevamente`
    : ''
}

${
  isLinux
    ? `#### Para Usuarios de Linux

1. **Abre Terminal** (presiona Ctrl+Alt+T)
2. **Navega a la carpeta extraída**:
   \`\`\`bash
   cd /ruta/a/tu/carpeta/extraída
   \`\`\`
3. **Haz ejecutable el script de configuración**:
   \`\`\`bash
   chmod +x setup.sh
   \`\`\`
4. **Ejecuta la configuración**:
   \`\`\`bash
   ./setup.sh
   \`\`\`
5. **Espera a que se complete la configuración**

**Si ves un error sobre Node.js:**
- Ejecuta: \`sudo apt update && sudo apt install nodejs npm\`
- Luego intenta ejecutar \`./setup.sh\` nuevamente`
    : ''
}

${
  isMacOS
    ? `#### Para Usuarios de macOS

1. **Abre Terminal** (presiona Cmd+Espacio, escribe "Terminal", presiona Enter)
2. **Navega a la carpeta extraída**:
   \`\`\`bash
   cd /ruta/a/tu/carpeta/extraída
   \`\`\`
3. **Haz ejecutable el script de configuración**:
   \`\`\`bash
   chmod +x setup-macos.sh
   \`\`\`
4. **Ejecuta la configuración**:
   \`\`\`bash
   ./setup-macos.sh
   \`\`\`
5. **Espera a que se complete la configuración**

**Si ves un error sobre Node.js:**
- Ve a https://nodejs.org/
- Haz clic en el botón verde grande "LTS" para descargar
- Ejecuta el instalador y sigue las instrucciones
- Luego intenta ejecutar \`./setup-macos.sh\` nuevamente`
    : ''
}

### Paso 3: Iniciar la Aplicación

${
  isWindows
    ? `#### Para Usuarios de Windows

1. **En la misma carpeta**, encuentra \`start-server.bat\`
2. **Haz doble clic en \`start-server.bat\`** (esto inicia el backend)
3. **Espera a que diga "Server is running"**
4. **En la misma carpeta**, encuentra \`start-client.bat\`
5. **Haz doble clic en \`start-client.bat\`** (esto inicia el frontend)
6. **Tu navegador web debería abrirse automáticamente** a la aplicación

**Alternativa**: Haz doble clic en \`start-both.bat\` para iniciar ambos a la vez`
    : ''
}

${
  isLinux
    ? `#### Para Usuarios de Linux

1. **En Terminal**, ejecuta el servidor:
   \`\`\`bash
   ./start-server.sh
   \`\`\`
2. **Abre una nueva ventana de Terminal** y ejecuta el cliente:
   \`\`\`bash
   ./start-client.sh
   \`\`\`
3. **Tu navegador web debería abrirse automáticamente** a la aplicación

**Alternativa**: Ejecuta \`npm start\` para iniciar ambos a la vez`
    : ''
}

${
  isMacOS
    ? `#### Para Usuarios de macOS

1. **En Terminal**, ejecuta el servidor:
   \`\`\`bash
   ./start-server-macos.sh
   \`\`\`
2. **Abre una nueva ventana de Terminal** y ejecuta el cliente:
   \`\`\`bash
   ./start-client-macos.sh
   \`\`\`
3. **Tu navegador web debería abrirse automáticamente** a la aplicación

**Alternativa**: Ejecuta \`npm start\` para iniciar ambos a la vez`
    : ''
}

## 🌐 Usando la Aplicación

1. **Abre tu navegador web** (Chrome, Firefox, Safari, Edge)
2. **Ve a**: http://localhost:3000
3. **La aplicación debería cargar** y estar lista para usar!

## 🔧 Solución de Problemas

### Problemas Comunes

**"Node.js no está instalado"**
- Sigue las instrucciones de instalación arriba
- Asegúrate de reiniciar tu computadora después de instalar Node.js

**"Puerto ya está en uso"**
- Cierra cualquier otra aplicación que pueda estar usando los puertos 3000 o 4040
- Reinicia tu computadora e intenta nuevamente

**"Permiso denegado" (Linux/macOS)**
- Asegúrate de haber ejecutado el script de configuración primero
- Intenta ejecutar: \`chmod +x *.sh\`

**"La aplicación no inicia"**
- Asegúrate de haber ejecutado el script de configuración primero
- Verifica que estés en la carpeta correcta
- Intenta reiniciar tu computadora

### Obtener Ayuda

Si aún tienes problemas:

1. **Revisa el archivo README.md** en esta carpeta para detalles técnicos
2. **Busca mensajes de error** en la terminal/línea de comandos
3. **Asegúrate de que tu computadora cumpla con los requisitos** listados arriba
4. **Intenta ejecutar el script de configuración nuevamente**

## 📞 Soporte

Para soporte técnico, por favor proporciona:
- Tu sistema operativo (Windows/Linux/macOS)
- Cualquier mensaje de error que veas
- Pasos que ya has intentado

## 🎉 ¡Estás Listo!

Una vez que la aplicación esté ejecutándose, puedes:
- Acceder a ella en http://localhost:3000
- Usar todas las funciones de la aplicación Touch Monorepo
- Cerrar las ventanas de terminal/línea de comandos cuando hayas terminado

**Nota**: Mantén las ventanas de terminal/línea de comandos abiertas mientras uses la aplicación. Ciérralas cuando hayas terminado.

---

*Generado el: ${new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}*
`;

  // Write the documentation files
  const platformSuffix = platform === 'universal' ? 'UNIVERSAL' : platform.toUpperCase();
  await writeFile(join(config.distDir, `USER_GUIDE_${platformSuffix}_EN.md`), englishGuide);
  await writeFile(join(config.distDir, `GUIA_USUARIO_${platformSuffix}_ES.md`), spanishGuide);

  console.log(
    `✅ User documentation created (USER_GUIDE_${platformSuffix}_EN.md, GUIA_USUARIO_${platformSuffix}_ES.md)`,
  );
}

function parseArguments(): BuildOptions {
  const args = process.argv.slice(2);
  const options: BuildOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--platform':
      case '-p':
        options.platform = args[++i] as 'windows' | 'linux' | 'macos' | 'universal';
        break;
      case '--arch':
      case '-a':
        options.arch = args[++i] as 'x64' | 'arm64' | 'universal';
        break;
      case '--include-node':
      case '-n':
        options.includeNode = true;
        break;
      case '--standalone':
      case '-s':
        options.standalone = true;
        break;
      case '--zip':
      case '-z':
        options.zip = true;
        break;
      case '--output-dir':
      case '-o':
        options.outputDir = args[++i];
        break;
      case '--help':
      case '-h':
        console.log(`
Touch Monorepo Deployment Builder

Usage: pnpm build.deployment [options]

Options:
  --platform, -p <platform>    Target platform (windows|linux|macos|universal)
  --arch, -a <arch>           Target architecture (x64|arm64|universal)
  --include-node, -n          Include Node.js runtime
  --standalone, -s            Create standalone package
  --zip, -z                   Create zip archive
  --output-dir, -o <dir>      Output directory for zip
  --help, -h                  Show this help

Examples:
  pnpm build.deployment --platform windows --arch x64 --zip
  pnpm build.deployment --platform linux --standalone
  pnpm build.deployment --platform universal --zip --output-dir ./dist
        `);
        process.exit(0);
    }
  }

  return options;
}

async function main(): Promise<void> {
  const options = parseArguments();

  console.log('🏗️  Building Touch Monorepo Deployment');
  console.log('='.repeat(60));
  console.log(`Platform: ${options.platform || 'universal'}`);
  console.log(`Architecture: ${options.arch || 'universal'}`);
  console.log(`Standalone: ${options.standalone ? 'Yes' : 'No'}`);
  console.log(`Include Node: ${options.includeNode ? 'Yes' : 'No'}`);
  console.log(`Create Zip: ${options.zip ? 'Yes' : 'No'}`);
  console.log('='.repeat(60));

  try {
    await killPortsIfOccupied();
    await cleanDistDirectory();
    await createDistStructure();
    await buildClient();
    await buildServer();
    await copyDataFiles();
    await consolidateEnvironmentFiles();
    await createPortsUtility();
    await createStartupScript();
    await createClientServer();
    await createPackageJson();
    await createReadme();
    await createTestScript();

    if (options.standalone) {
      await createStandalonePackage(options);
    } else {
      await installDependencies();
    }

    await copyEnvExample();
    await cleanPlatformArtifacts();
    await createSetupScripts(options);
    await createPlatformSpecificScripts(options);
    await createUserDocumentation(options);

    if (options.zip) {
      await createZipArchive(options);
    }

    console.log('');
    console.log('🎉 Deployment build completed successfully!');
    console.log('📦 Deployment created at:', config.distDir);
    console.log('');

    if (options.zip) {
      const zipName = `touch-monorepo-${options.platform || 'universal'}-${options.arch || 'universal'}-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.zip`;
      console.log('📦 Zip archive created:', zipName);
    }

    console.log('');
    console.log('🚀 Next steps:');
    console.log('  1. Extract the deployment folder');
    console.log('  2. Run the setup script for your platform:');
    if (options.platform === 'windows' || options.platform === 'universal') {
      console.log('     Windows: Double-click setup.bat');
    }
    if (options.platform === 'linux' || options.platform === 'universal') {
      console.log('     Linux: ./setup.sh');
    }
    if (options.platform === 'macos' || options.platform === 'universal') {
      console.log('     macOS: ./setup-macos.sh');
    }
    console.log('  3. Start the application with the provided scripts');
    console.log('');
  } catch (error) {
    console.error('❌ Deployment build failed:', error);
    process.exit(1);
  }
}

// Run the build if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as buildProduction };
