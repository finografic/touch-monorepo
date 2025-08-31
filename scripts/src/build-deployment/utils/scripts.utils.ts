import { writeFile, copyFile } from 'fs/promises';
import { join, dirname } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import type { BuildConfig, BuildOptions } from '../build-deployment.types.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Create universal setup script
 */
export async function createSetupScripts(config: BuildConfig): Promise<void> {
  console.log('🔧 Creating universal setup script...');

  // Universal setup script that detects platform and installs Node.js
  const universalSetupScript = `#!/bin/bash
set -e

echo "========================================"
echo "Touch Monorepo - Universal Setup"
echo "========================================"
echo "Detecting platform and setting up..."
echo

# Detect operating system
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    PLATFORM="windows"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macos"
else
    PLATFORM="linux"
fi

echo "🔍 Detected platform: $PLATFORM"
echo

# Check if Node.js is installed
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Node.js is not installed. Installing..."

    case $PLATFORM in
        "windows")
            echo "⚠️  Please install Node.js manually from https://nodejs.org/"
            echo "   Then run this script again."
            read -p "Press Enter after installing Node.js..."
            ;;
        "linux")
            if command -v apt >/dev/null 2>&1; then
                sudo apt update && sudo apt install -y nodejs npm
            elif command -v dnf >/dev/null 2>&1; then
                sudo dnf install -y nodejs npm
            elif command -v pacman >/dev/null 2>&1; then
                sudo pacman -Sy --noconfirm nodejs npm
            else
                echo "⚠️  Could not auto-install Node.js."
                echo "   Please install Node.js 20+ from https://nodejs.org/"
                echo "   Then run this script again."
                exit 1
            fi
            ;;
        "macos")
            if command -v brew >/dev/null 2>&1; then
                brew install node
            else
                echo "🍺 Installing Homebrew first..."
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
                echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
                eval "$(/opt/homebrew/bin/brew shellenv)"
                brew install node
            fi
            ;;
    esac
fi

# Verify Node.js installation
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Node.js still not found. Please install manually and try again."
    exit 1
fi

echo "✅ Node.js: $(node -v)"
echo "✅ npm: $(npm -v)"
echo

echo "📦 Installing application dependencies..."
npm install --production

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo
echo "🎉 Setup completed successfully!"
echo
echo "🚀 To start the application, run:"
echo "   ./start"
echo
echo "   Or manually:"
echo "   npm start"
echo
`;

  // Always create universal setup.sh
  await writeFile(join(config.distDir, 'setup.sh'), universalSetupScript);
  execSync(`chmod +x ${join(config.distDir, 'setup.sh')}`, { stdio: 'inherit' });
  console.log('✅ Universal setup script created (setup.sh)');
}

/**
 * Create simple start script
 */
export async function createStartScript(config: BuildConfig): Promise<void> {
  console.log('🚀 Creating simple start script...');

  // Simple, cross-platform start script (no extension)
  const startScript = `#!/bin/bash
set -e

echo "🚀 Starting Touch Monorepo..."
echo

# Check if Node.js is available
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Node.js not found. Please run ./setup.sh first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not installed. Please run ./setup.sh first."
    exit 1
fi

echo "✅ Starting server and client..."
echo "   Server: http://localhost:4040"
echo "   Client: http://localhost:3000"
echo
echo "Press Ctrl+C to stop"
echo

# Start the application
npm start
`;

  // Create the start script (no extension)
  await writeFile(join(config.distDir, 'start'), startScript);
  execSync(`chmod +x ${join(config.distDir, 'start')}`, { stdio: 'inherit' });
  console.log('✅ Simple start script created (start)');
}

/**
 * Create ports utility script
 */
export async function createPortsUtility(config: BuildConfig): Promise<void> {
  console.log('🔌 Creating ports utility...');

  // Copy the template file
  const templatePath = join(__dirname, '../templates/ports.utils.js');
  const destPath = join(config.distDir, 'ports.utils.js');

  await copyFile(templatePath, destPath);
  console.log('✅ Ports utility created');
}

/**
 * Create production test script
 */
export async function createTestScript(config: BuildConfig): Promise<void> {
  console.log('🧪 Creating production test script...');

  const testScript = `#!/usr/bin/env node

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
  console.log('\\n❌ Some required files are missing. Deployment may not work correctly.');
  process.exit(1);
}

// Test 2: Check ports are available
console.log('\\n🔌 Checking ports...');
try {
  killPortIfOccupied(4040); // API server port
  killPortIfOccupied(3000); // Client server port
} catch (error) {
  console.log('❌ Port check failed:', error.message);
  process.exit(1);
}

console.log('\\n🎉 All tests passed! Production build is ready.');
console.log('\\n🚀 To start the application:');
console.log('   ./start');
console.log('   or');
console.log('   npm start');
`;

  await writeFile(join(config.distDir, 'test-production.js'), testScript);
  execSync(`chmod +x ${join(config.distDir, 'test-production.js')}`, { stdio: 'inherit' });
  console.log('✅ Production test script created');
}

/**
 * Create platform-specific startup scripts (legacy support)
 */
export async function createPlatformSpecificScripts(
  config: BuildConfig,
  options: BuildOptions,
): Promise<void> {
  console.log('🔧 Creating platform-specific startup scripts...');

  const scripts = {
    'start-server.js': `const { spawn } = require('child_process');
const process = require('process');

console.log('🖥️  Starting Touch Monorepo Server...');

const server = spawn('node', ['dist/server/index.js'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' }
});

server.on('close', (code) => {
  console.log(\`Server process exited with code \${code}\`);
});`,

    'start-client.js': `const { spawn } = require('child_process');
const process = require('process');

console.log('📱 Starting Touch Monorepo Client...');

const client = spawn('node', ['dist/client/server.js'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' }
});

client.on('close', (code) => {
  console.log(\`Client process exited with code \${code}\`);
});`,
  };

  // Create the startup scripts
  for (const [filename, content] of Object.entries(scripts)) {
    await writeFile(join(config.distDir, filename), content);
    console.log(`  ✅ ${filename}`);
  }

  // Create platform-specific script wrappers for macOS
  if (options.platform === 'macos' || options.platform === 'universal') {
    const macScripts = {
      'start-server-macos.sh': `#!/bin/bash
cd "$(dirname "$0")"
node start-server.js`,
      'start-client-macos.sh': `#!/bin/bash
cd "$(dirname "$0")"
node start-client.js`,
      'start-both-macos.sh': `#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Starting Touch Monorepo (Server + Client)..."
node start-server.js &
sleep 2
node start-client.js &
wait`,
    };

    for (const [filename, content] of Object.entries(macScripts)) {
      await writeFile(join(config.distDir, filename), content);
      execSync(`chmod +x ${join(config.distDir, filename)}`, { stdio: 'inherit' });
    }
    console.log('✅ macOS startup scripts created');
  }
}
