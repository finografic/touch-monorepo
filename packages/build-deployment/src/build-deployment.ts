#!/usr/bin/env tsx
import { copyFile, mkdir, readFile, writeFile, cp } from 'fs/promises';
import { join, resolve, dirname } from 'path';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { select, checkbox, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import {
  platformConfigs,
  deploymentOptions,
  getDefaultPlatform,
  type PlatformConfig,
} from './platforms.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WORKSPACE_ROOT = resolve(__dirname, '../../..');
const DIST_DIR = resolve(WORKSPACE_ROOT, '.temp/deployment');

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
    join(config.buildDir, 'data/logs'),
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



async function consolidateEnvironmentFiles(options: BuildOptions): Promise<void> {
  console.log('⚙️  Consolidating environment files...');

  try {
    // Use localhost for all platforms. The client detects the correct host
    // dynamically via window.location.hostname at runtime, and the server
    // accepts any origin for CORS, so no hardcoded IP is needed.
    const HOST = 'localhost';

    console.log(`📍 Using host: ${HOST} (dynamic detection at runtime)`);

    // Read source .env.production to get sensitive values
    const sourceEnvPath = join(config.workspaceRoot, '.env.production');
    let sourceEnv: Record<string, string> = {};

    if (existsSync(sourceEnvPath)) {
      const sourceEnvContent = await readFile(sourceEnvPath, 'utf-8');
      sourceEnv = Object.fromEntries(
        sourceEnvContent
          .split('\n')
          .filter((line) => line.trim() && !line.startsWith('#'))
          .map((line) => {
            const [key, ...valueParts] = line.split('=');
            return [key.trim(), valueParts.join('=').trim()];
          }),
      );
      console.log('✅ Read source .env.production for sensitive values');
    } else {
      console.log('⚠️  Source .env.production not found, using defaults');
    }

    // Get values from source or use defaults
    const BETTER_AUTH_SECRET =
      sourceEnv.BETTER_AUTH_SECRET || 'your-super-secret-auth-key-minimum-32-characters-long';
    const AUTH_COOKIE_PREFIX = sourceEnv.AUTH_COOKIE_PREFIX || 'touch-monorepo';
    const TOKEN_COOKIE_SUFFIX = sourceEnv.TOKEN_COOKIE_SUFFIX || 'session_token';
    const DATA_COOKIE_SUFFIX = sourceEnv.DATA_COOKIE_SUFFIX || 'session_data';

    const envContent: string[] = [
      '# PRODUCTION ENVIRONMENT - AUTO-GENERATED',
      '# DO NOT EDIT MANUALLY',
      '',
      '# Application Environment',
      'NODE_ENV=production',
      '',
      '# API Server Configuration',
      'API_PROTOCOL=http',
      `API_HOST=${HOST}`,
      'API_PORT=4040',
      'API_BASE_PATH=/api',
      `API_URL=http://${HOST}:4040/api`,
      '',
      '# Client Configuration',
      'CLIENT_PROTOCOL=http',
      `CLIENT_HOST=${HOST}`,
      'CLIENT_PORT=3000',
      `CLIENT_ORIGIN=http://${HOST}:3000`,
      'VITE_APP_NAME=Touch Monorepo',
      '',
      '# Database Configuration',
      'DB_DIALECT=sqlite',
      'DB_HOST=localhost',
      'DB_USER=admin',
      'DB_PORT=0',
      'DB_NAME=production.sqlite.db',
      'DATABASE_URL=./dist/data/db/production.sqlite.db',
      '',
      '# Authentication',
      `BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}`,
      `BETTER_AUTH_URL=http://${HOST}:4040`,
      `AUTH_COOKIE_PREFIX=${AUTH_COOKIE_PREFIX}`,
      `TOKEN_COOKIE_SUFFIX=${TOKEN_COOKIE_SUFFIX}`,
      `DATA_COOKIE_SUFFIX=${DATA_COOKIE_SUFFIX}`,
      '',
      '# File Uploads',
      'UPLOAD_DIR=./dist/data/uploads',
      '',
      '# Path Configuration',
      'DATA_DIR=./dist/data',
      'LOGS_DIR=./dist/data/logs',
      'UPLOADS_DIR=./dist/data/uploads',
      '',
      '# Relay Board Configuration',
      'RELAY_ENABLED=true',
      'RELAY_NUM_RELAYS=16',
      'RELAY_RECONNECT_ATTEMPTS=5',
      'USBRELAY_VENDOR_ID=0x16c0',
      'USBRELAY_PRODUCT_ID=0x05df',
      '',
    ];

    const envPath = join(config.distDir, '.env.production');
    await writeFile(envPath, envContent.join('\n'), 'utf-8');

    console.log('✅ Created environment file:', envPath);
    console.log('✅ Environment files consolidated');
  } catch (error) {
    console.error('❌ Failed to consolidate environment files:', error);
    throw error;
  }
}


async function createPortsUtility(): Promise<void> {
  console.log('🔧 Creating ports utility...');

  const templatePath = join(__dirname, 'templates/ports.utils.js.template');
  const portsUtility = await readFile(templatePath, 'utf-8');

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

async function createPackageJson(options: BuildOptions): Promise<void> {
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

  // Base scripts
  const baseScripts = {
    'start': 'run-p start:server start:client',
    'start:server': 'node start-server.js',
    'start:client': 'node start-client.js',
  };

  // Use base scripts only (Windows-specific scripts added later)
  const scripts = baseScripts;

  const packageJson = {
    name: 'touch-monorepo-production',
    version: '1.0.0',
    description: 'Touch Monorepo Production Distribution',
    private: true,
    type: 'module',
    scripts,
    dependencies: {
      ...serverDependencies,
      dotenv: '^16.0.0',
    },
    optionalDependencies: {
      'npm-run-all': '^4.1.5',
      'serve': '^14.0.0',
    },
    engines: {
      node: '>=22.0.0',
    },
  };

  await writeFile(join(config.distDir, 'package.json'), JSON.stringify(packageJson, null, 2));

  console.log('✅ Production package.json created');
}

async function addWindowsScriptsToPackageJson(options: BuildOptions): Promise<void> {
  if (options.platform !== 'windows') {
    return; // Only add Windows scripts for Windows deployments
  }

  console.log('🪟 Adding Windows-specific scripts to package.json...');

  try {
    // Read the existing package.json
    const packageJsonPath = join(config.distDir, 'package.json');
    const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    // Add Windows-specific scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      'install:windows.tools': 'npm install -g windows-build-tools && npm install',
      'preinstall':
        "node -e \"if(process.platform==='win32'){require('child_process').exec('npm run install:windows.tools')}else{console.log('Skipping Windows build tools on non-Windows platform')}\"",
    };

    // Write the updated package.json
    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Windows-specific scripts added to package.json');
  } catch (error) {
    console.error('❌ Failed to add Windows scripts:', error);
    throw error;
  }
}

async function createReadme(): Promise<void> {
  console.log('📖 Creating README...');

  const templatePath = join(__dirname, 'templates/README.md.template');
  const template = await readFile(templatePath, 'utf-8');

  const readme = template.replace(/{{TIMESTAMP}}/g, new Date().toISOString());

  await writeFile(join(config.distDir, 'README.md'), readme);
  console.log('✅ README created');
}

async function createTestScript(): Promise<void> {
  console.log('🧪 Creating test script...');

  const templatePath = join(__dirname, 'templates/test-production.js.template');
  const testScript = await readFile(templatePath, 'utf-8');

  await writeFile(join(config.distDir, 'test-production.js'), testScript);

  // Make it executable
  execSync(`chmod +x ${join(config.distDir, 'test-production.js')}`, { stdio: 'inherit' });

  console.log('✅ Test script created');
}

async function installDependencies(): Promise<void> {
  console.log('📦 Installing production dependencies...');

  try {
    // First attempt: Standard install
    console.log('  🔧 Attempting standard npm install...');
    execSync('npm install --production --no-audit --no-fund', {
      cwd: config.distDir,
      stdio: 'inherit',
    });
    console.log('✅ Production dependencies installed');
  } catch (error) {
    console.log('⚠️  Standard install failed, trying with --legacy-peer-deps...');

    try {
      // Second attempt: Use legacy peer deps to handle version conflicts
      execSync('npm install --production --legacy-peer-deps --no-audit --no-fund', {
        cwd: config.distDir,
        stdio: 'inherit',
      });
      console.log('✅ Production dependencies installed with legacy peer deps');
    } catch (legacyError) {
      console.log('⚠️  Legacy peer deps failed, trying with --force...');

      try {
        // Third attempt: Force install to override conflicts
        execSync('npm install --production --force --no-audit --no-fund', {
          cwd: config.distDir,
          stdio: 'inherit',
        });
        console.log('✅ Production dependencies installed with force flag');
      } catch (forceError) {
        console.log('⚠️  Force install failed, trying with both flags...');

        try {
          // Final attempt: Use both flags
          execSync('npm install --production --legacy-peer-deps --force --no-audit --no-fund', {
            cwd: config.distDir,
            stdio: 'inherit',
          });
          console.log('✅ Production dependencies installed with both legacy and force flags');
        } catch (finalError) {
          console.error('❌ All installation attempts failed:', finalError);
          console.error('💡 Try manually running: npm install --production --legacy-peer-deps --force');
          throw finalError;
        }
      }
    }
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
      'rm -f setup.bat setup-macos.sh',
      'rm -f start-*.bat start-*.sh',
      'rm -f USER_GUIDE*.md GUIA_USUARIO*.md',
    ].join(' && ');
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️  Failed to clean some platform artifacts (safe to ignore if not present).');
  }
}

async function createSetupScripts(options: BuildOptions): Promise<void> {
  console.log('🔧 Creating universal setup script...');

  const templatePath = join(__dirname, 'templates/setup.sh.template');
  const setupScript = await readFile(templatePath, 'utf-8');

  await writeFile(join(config.distDir, 'setup.sh'), setupScript);
  execSync(`chmod +x ${join(config.distDir, 'setup.sh')}`, { stdio: 'inherit' });
  console.log('✅ Universal setup script created (setup.sh)');
}

async function createStartScript(): Promise<void> {
  console.log('🚀 Creating simple start script...');

  const templatePath = join(__dirname, 'templates/start.sh.template');
  const startScript = await readFile(templatePath, 'utf-8');

  await writeFile(join(config.distDir, 'start'), startScript);
  execSync(`chmod +x ${join(config.distDir, 'start')}`, { stdio: 'inherit' });
  console.log('✅ Simple start script created (start)');
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

async function createZipArchive(options: BuildOptions): Promise<string> {
  console.log('📦 Creating deployment archive...');

  const platform = options.platform || 'universal';
  const arch = options.arch || 'universal';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const zipName = `touch-monorepo-${platform}-${arch}-${timestamp}.zip`;

  // Save zip to deployments folder
  const deploymentsDir = join(config.workspaceRoot, 'deployments');
  const zipPath = join(deploymentsDir, zipName);

  try {
    // Ensure deployments directory exists
    await mkdir(deploymentsDir, { recursive: true });

    // Use system zip command
    const zipCommand = `cd "${config.distDir}" && zip -r "${zipPath}" . -x "node_modules/*" "*.log" ".DS_Store"`;
    execSync(zipCommand, { stdio: 'inherit' });

    console.log(`✅ Deployment archive created: ${zipName}`);
    console.log(`📁 Location: ${zipPath}`);

    return zipName;
  } catch (error) {
    console.error('❌ Failed to create zip archive:', error);
    throw error;
  }
}

async function cleanupTempDirectory(): Promise<void> {
  console.log('🧹 Cleaning up temporary build directory...');

  try {
    const tempDir = join(config.workspaceRoot, '.temp');
    if (existsSync(tempDir)) {
      execSync(`rm -rf "${tempDir}"`, { stdio: 'inherit' });
      console.log('✅ Temporary directory cleaned up');
    }
  } catch (error) {
    console.warn('⚠️  Failed to cleanup temp directory:', error);
    // Don't throw - this is not critical
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
      'start': 'run-p start:server start:client',
      'start:server': 'node dist/server/index.js',
      'start:client': 'node dist/client/server.js',
      'setup': './setup.sh',
    },
    dependencies: {
      'better-sqlite3': '11.9.0',
      'dotenv': '^16.0.0',
    },
    optionalDependencies: {
      'npm-run-all': '^4.1.5',
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

  // Read templates
  const englishTemplatePath = join(__dirname, 'templates/USER_GUIDE_EN.md.template');
  const spanishTemplatePath = join(__dirname, 'templates/GUIA_USUARIO_ES.md.template');

  const englishTemplate = await readFile(englishTemplatePath, 'utf-8');
  const spanishTemplate = await readFile(spanishTemplatePath, 'utf-8');

  // Generate timestamps
  const englishTimestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const spanishTimestamp = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Replace placeholders
  const englishGuide = englishTemplate.replace(/{{TIMESTAMP}}/g, englishTimestamp);
  const spanishGuide = spanishTemplate.replace(/{{TIMESTAMP}}/g, spanishTimestamp);

  // Write the documentation files
  await writeFile(join(config.distDir, 'USER_GUIDE_EN.md'), englishGuide);
  await writeFile(join(config.distDir, 'GUIA_USUARIO_ES.md'), spanishGuide);

  console.log('✅ User documentation created (USER_GUIDE_EN.md, GUIA_USUARIO_ES.md)');
}

// Add auto-confirm flag for -y/--yes (similar to db-setup)
const autoConfirm = process.argv.includes('-y') || process.argv.includes('--yes');

async function getInteractiveOptions(): Promise<BuildOptions> {
  console.log(chalk.cyan('\n🏗️  Touch Monorepo Deployment Builder'));
  console.log(chalk.gray('═'.repeat(50)));

  if (autoConfirm) {
    const defaultPlatform = getDefaultPlatform();
    const defaultConfig = platformConfigs.find((config) => config.value === defaultPlatform);
    console.log(chalk.yellow(`📦 Auto-confirm mode: Using ${defaultConfig?.name || 'macOS'}`));

    return {
      platform: defaultConfig?.platform || 'macos',
      arch: defaultConfig?.arch || 'x64',
      standalone: defaultConfig?.standalone || false,
      zip: true,
    };
  }

  // Platform selection
  const selectedPlatform = await select({
    message: chalk.bold('🎯 Select deployment platform:'),
    choices: platformConfigs.map((config) => ({
      name: config.name,
      value: config.value,
      description: config.description,
    })),
    default: getDefaultPlatform(),
  });

  const platformConfig = platformConfigs.find((config) => config.value === selectedPlatform);
  if (!platformConfig) {
    throw new Error(`Invalid platform selection: ${selectedPlatform}`);
  }

  // Additional options
  const additionalOptions = await checkbox({
    message: chalk.bold('⚙️  Select additional options:'),
    choices: deploymentOptions,
  });

  // Confirmation
  const shouldProceed = await confirm({
    message: chalk.bold(`🚀 Build ${platformConfig.name}?`),
    default: true,
  });

  if (!shouldProceed) {
    console.log(chalk.yellow('📦 Build cancelled by user'));
    process.exit(0);
  }

  return {
    platform: platformConfig.platform,
    arch: platformConfig.arch,
    standalone: platformConfig.standalone || false,
    zip: platformConfig.zip || additionalOptions.includes('zip'),
    includeNode: additionalOptions.includes('includeNode'),
  };
}

function parseArguments(): BuildOptions {
  const args = process.argv.slice(2);
  const options: BuildOptions = {};

  // Check for legacy CLI arguments (for backward compatibility)
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
        console.log(
          chalk.cyan(`
🏗️  Touch Monorepo Deployment Builder

Usage: pnpm build.deployment [options]

Interactive Mode (Recommended):
  pnpm build.deployment           Interactive platform selection
  pnpm build.deployment -y        Auto-confirm with host platform

Legacy CLI Mode:
  --platform, -p <platform>      Target platform (windows|linux|macos|universal)
  --arch, -a <arch>              Target architecture (x64|arm64|universal)
  --include-node, -n             Include Node.js runtime
  --standalone, -s               Create standalone package
  --zip, -z                      Create zip archive
  --output-dir, -o <dir>         Output directory for zip
  --yes, -y                      Auto-confirm with defaults
  --help, -h                     Show this help

Examples:
  pnpm build.deployment                    # Interactive mode
  pnpm build.deployment -y                 # Quick build with host platform
  pnpm build.deployment -p macos -z        # Legacy: macOS with zip
        `),
        );
        process.exit(0);
    }
  }

  return options;
}

async function main(): Promise<void> {
  let options = parseArguments();

  // If no CLI arguments provided (except possibly -y), use interactive mode
  const hasCliArgs = process.argv
    .slice(2)
    .some(
      (arg) =>
        arg.startsWith('--platform') ||
        arg.startsWith('-p') ||
        arg.startsWith('--arch') ||
        arg.startsWith('-a') ||
        arg.startsWith('--standalone') ||
        arg.startsWith('-s') ||
        arg.startsWith('--zip') ||
        arg.startsWith('-z') ||
        arg.startsWith('--include-node') ||
        arg.startsWith('-n'),
    );

  if (!hasCliArgs) {
    options = await getInteractiveOptions();
  } else {
    // Apply platform config defaults for CLI mode
    if (options.platform && !options.arch) {
      const platformConfig = platformConfigs.find((config) => config.platform === options.platform);
      if (platformConfig) {
        options.arch = platformConfig.arch;
        options.standalone = platformConfig.standalone || false;
        options.zip = options.zip || platformConfig.zip || false;
      }
    }
  }

  console.log(chalk.cyan('\n🏗️  Building Touch Monorepo Deployment'));
  console.log(chalk.gray('═'.repeat(60)));
  console.log(`${chalk.bold('Platform:')} ${options.platform || 'universal'}`);
  console.log(`${chalk.bold('Architecture:')} ${options.arch || 'universal'}`);
  console.log(`${chalk.bold('Standalone:')} ${options.standalone ? 'Yes' : 'No'}`);
  console.log(`${chalk.bold('Include Node:')} ${options.includeNode ? 'Yes' : 'No'}`);
  console.log(`${chalk.bold('Create Zip:')} ${options.zip ? 'Yes' : 'No'}`);
  console.log(chalk.gray('═'.repeat(60)));

  try {
    await killPortsIfOccupied();
    await cleanDistDirectory();
    await createDistStructure();

    await buildClient();
    await buildServer();
    await copyDataFiles();
    await consolidateEnvironmentFiles(options);
    await createPortsUtility();
    await createStartupScript();
    await createClientServer();
    await createPackageJson(options);
    await createReadme();
    await createTestScript();

    if (options.standalone) {
      await createStandalonePackage(options);
    } else {
      await installDependencies();
    }

    // Add Windows-specific scripts after dependencies are installed
    await addWindowsScriptsToPackageJson(options);

    await copyEnvExample();
    await cleanPlatformArtifacts();
    await createSetupScripts(options);
    await createStartScript();
    await createPlatformSpecificScripts(options);
    await createUserDocumentation(options);

    let zipName = '';
    if (options.zip) {
      zipName = await createZipArchive(options);
    }

    // Clean up temporary build directory
    await cleanupTempDirectory();

    console.log('');
    console.log('🎉 Deployment build completed successfully!');
    console.log('📦 Deployment built in: .temp/deployment (cleaned up)');
    console.log('');

    if (options.zip && zipName) {
      console.log('📦 Zip archive created:', zipName);
      console.log('📁 Saved to: deployments/ folder');
    }

    console.log('');
    console.log('🚀 Next steps:');
    console.log('  1. Extract the deployment folder');
    console.log('  2. Run setup: ./setup.sh');
    console.log('  3. Start app: ./start');
    console.log('');
    console.log('📖 For detailed instructions, see:');
    console.log('   - USER_GUIDE_EN.md (English)');
    console.log('   - GUIA_USUARIO_ES.md (Spanish)');
    console.log('');
  } catch (error) {
    console.error('❌ Deployment build failed:', error);

    // Clean up temporary directory even on failure
    try {
      await cleanupTempDirectory();
    } catch (cleanupError) {
      console.warn('⚠️  Failed to cleanup temp directory after error:', cleanupError);
    }

    process.exit(1);
  }
}

// Run the build if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as buildProduction };
