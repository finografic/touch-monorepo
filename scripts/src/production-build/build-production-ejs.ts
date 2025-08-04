#!/usr/bin/env tsx
import { copyFile, mkdir, readFile, writeFile, cp, readdir, stat } from 'fs/promises';
import { join, resolve, dirname } from 'path';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = resolve(__dirname, '../../../dist-production');
const WORKSPACE_ROOT = resolve(__dirname, '../../..');

interface BuildConfig {
  distDir: string;
  workspaceRoot: string;
  clientDir: string;
  serverDir: string;
  dataDir: string;
  configDir: string;
}

const config: BuildConfig = {
  distDir: DIST_DIR,
  workspaceRoot: WORKSPACE_ROOT,
  clientDir: join(WORKSPACE_ROOT, 'apps/client'),
  serverDir: join(WORKSPACE_ROOT, 'apps/server'),
  dataDir: join(WORKSPACE_ROOT, 'data'),
  configDir: join(WORKSPACE_ROOT, 'config'),
};

// Simple template engine (EJS-like)
function renderTemplate(template: string, variables: Record<string, any>): string {
  return template.replace(/\<\%\=?\s*([^%>]+)\s*%\>/g, (match, variable) => {
    const value = variable.trim();
    return variables[value] || '';
  });
}

async function cleanDistDirectory(): Promise<void> {
  console.log('🧹 Cleaning distribution directory...');
  execSync(`rm -rf ${config.distDir}`, { stdio: 'inherit' });
}

async function createDistStructure(): Promise<void> {
  console.log('📁 Creating distribution directory structure...');

  const directories = [
    config.distDir,
    join(config.distDir, 'client'),
    join(config.distDir, 'server'),
    join(config.distDir, 'data'),
    join(config.distDir, 'data/db'),
    join(config.distDir, 'data/uploads'),
    join(config.distDir, 'data/migrations'),
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

    // Copy client build output
    const clientBuildDir = join(config.clientDir, 'dist');
    if (existsSync(clientBuildDir)) {
      await cp(clientBuildDir, join(config.distDir, 'client'), { recursive: true });
      console.log('✅ Client build copied to distribution');
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

    // Copy server build output
    const serverBuildDir = join(config.serverDir, 'dist');
    if (existsSync(serverBuildDir)) {
      await cp(serverBuildDir, join(config.distDir, 'server'), { recursive: true });
      console.log('✅ Server build copied to distribution');
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
    // Copy database files
    const dbFiles = ['development.sqlite.db'];
    for (const dbFile of dbFiles) {
      const srcPath = join(config.dataDir, dbFile);
      if (existsSync(srcPath)) {
        const destPath = join(config.distDir, 'data/db', 'production.sqlite.db');
        await copyFile(srcPath, destPath);
        console.log(`✅ Database ${dbFile} copied as production.sqlite.db`);
      }
    }

    // Copy migrations
    const migrationsDir = join(config.dataDir, 'migrations');
    if (existsSync(migrationsDir)) {
      await cp(migrationsDir, join(config.distDir, 'data/migrations'), { recursive: true });
      console.log('✅ Database migrations copied');
    }

    // Copy uploads directory (if it has content)
    const uploadsDir = join(config.dataDir, 'uploads');
    if (existsSync(uploadsDir)) {
      await cp(uploadsDir, join(config.distDir, 'data/uploads'), { recursive: true });
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
    const envFiles = [
      join(config.configDir, '.env.development'),
      join(config.serverDir, '.env.development'),
      join(config.workspaceRoot, '.env.development'),
    ];

    const envContent: string[] = [
      '# PRODUCTION ENVIRONMENT - AUTO-GENERATED',
      '# DO NOT EDIT MANUALLY',
      '',
      '# Application Environment',
      'NODE_ENV=production',
      '',
    ];

    // Read and merge environment files
    for (const envFile of envFiles) {
      if (existsSync(envFile)) {
        const content = await readFile(envFile, 'utf-8');
        const lines = content
          .split('\n')
          .filter((line) => line.trim() && !line.startsWith('#'))
          .filter((line) => !line.startsWith('NODE_ENV=')); // Skip NODE_ENV as we set it to production

        if (lines.length > 0) {
          envContent.push(`# From ${envFile.replace(config.workspaceRoot, '.')}`);
          envContent.push(...lines);
          envContent.push('');
        }
      }
    }

    // Override specific production values
    envContent.push('# Production Overrides');
    envContent.push('DATABASE_URL=./data/db/production.sqlite.db');
    envContent.push('DB_NAME=production.sqlite.db');
    envContent.push('API_PROTOCOL=http');
    envContent.push('API_HOST=localhost');
    envContent.push('API_PORT=4040');
    envContent.push('CLIENT_PROTOCOL=http');
    envContent.push('CLIENT_HOST=localhost');
    envContent.push('CLIENT_PORT=3000');
    envContent.push('');

    await writeFile(join(config.distDir, '.env'), envContent.join('\n'));
    // Also create .env.production for the server
    await writeFile(join(config.distDir, '.env.production'), envContent.join('\n'));
    console.log('✅ Environment files consolidated');
  } catch (error) {
    console.error('❌ Failed to consolidate environment files:', error);
    throw error;
  }
}

async function createStartupScript(): Promise<void> {
  console.log('🚀 Creating startup script from template...');

  // Read the template file
  const templatePath = join(__dirname, 'templates/start.js.ejs');
  const template = await readFile(templatePath, 'utf-8');

  // Render template with variables
  const renderedScript = renderTemplate(template, {
    envPath: '.env',
    serverPort: 4040,
    clientPort: 3000,
    serverPath: 'server/index.js',
    clientPath: 'client/index.html',
    dbPath: 'data/db/production.sqlite.db',
    databaseUrl: './data/db/production.sqlite.db',
    dbName: 'production.sqlite.db',
    uploadDir: './data/uploads',
  });

  await writeFile(join(config.distDir, 'start.js'), renderedScript);

  // Make it executable
  execSync(`chmod +x ${join(config.distDir, 'start.js')}`, { stdio: 'inherit' });

  console.log('✅ Startup script created from template');
}

async function createClientServer(): Promise<void> {
  console.log('🌐 Creating client server script from template...');

  // Read the template file
  const templatePath = join(__dirname, 'templates/start-client.js.ejs');
  const template = await readFile(templatePath, 'utf-8');

  // Render template with variables
  const renderedScript = renderTemplate(template, {
    clientPort: 3000,
    clientDir: 'client',
  });

  await writeFile(join(config.distDir, 'start-client.js'), renderedScript);

  // Make it executable
  execSync(`chmod +x ${join(config.distDir, 'start-client.js')}`, { stdio: 'inherit' });

  console.log('✅ Client server script created from template');
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
      'start:v1': 'node start.js',
      'start:server': 'node start.js',
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

  const readme = `# Touch Monorepo - Production Distribution

This is a self-contained production build of the Touch Monorepo application.

## Contents

- \`client/\` - Static client application files
- \`server/\` - Bundled server application
- \`data/\` - Database and uploads
- \`.env\` - Production environment configuration
- \`start.js\` - Main startup script
- \`start-client.js\` - Client static server
- \`package.json\` - Production dependencies

## Quick Start

### Option 1: Server Only (API)
\`\`\`bash
node start.js
\`\`\`
Server will be available at http://localhost:4040

### Option 2: Full Application (Server + Client)
\`\`\`bash
# Terminal 1 - Start server
node start.js

# Terminal 2 - Start client
node start-client.js
\`\`\`

- Server: http://localhost:4040
- Client: http://localhost:3000

### Option 3: Using npm scripts (requires npm install)
\`\`\`bash
# Install optional dependencies
npm install

# Start both server and client
npm run start:both
\`\`\`

## Alternative Client Servers

You can use any static file server for the client:

\`\`\`bash
# Using serve (install: npm install -g serve)
serve -s client -p 3000

# Using Python
python3 -m http.server 3000 --directory client

# Using Node.js http-server (install: npm install -g http-server)
http-server client -p 3000
\`\`\`

## Environment Configuration

The \`.env\` file contains all necessary configuration. Key settings:

- \`NODE_ENV=production\`
- \`API_PORT=4040\` - Server port
- \`CLIENT_PORT=3000\` - Client port
- \`DATABASE_URL=./data/db/production.sqlite.db\` - Database location

## Database

The SQLite database is located at \`data/db/production.sqlite.db\`.
Uploads are stored in \`data/uploads/\`.

## Requirements

- Node.js 20.0.0 or higher
- No other dependencies required

## Troubleshooting

1. **Port conflicts**: Edit \`.env\` to change ports
2. **Database issues**: Check that \`data/db/production.sqlite.db\` exists
3. **Permission issues**: Ensure scripts are executable (\`chmod +x start.js start-client.js\`)

## Architecture

This distribution eliminates the need for:
- \`node_modules\` (server is bundled)
- Development dependencies
- Build tools
- Complex environment setup

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

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing Touch Monorepo Production Build...');
console.log('='.repeat(50));

// Test 1: Check required files exist
console.log('\n📁 Checking required files...');
const requiredFiles = [
  'server/index.js',
  'client/index.html',
  'data/db/production.sqlite.db',
  '.env',
  'start.js',
  'start-client.js',
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
  console.error('\n❌ Some required files are missing!');
  process.exit(1);
}

console.log('\n✅ All required files found');

// Test 2: Check if servers are running
console.log('\n🌐 Testing server connectivity...');

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

console.log('\n🎉 Production build test completed!');
console.log('\n📋 Summary:');
console.log('- Server: http://localhost:4040');
console.log('- Client: http://localhost:3000');
console.log('- Database: ./data/db/production.sqlite.db');
console.log('\n🚀 To start the servers:');
console.log('  node start.js & node start-client.js');
`;

  await writeFile(join(config.distDir, 'test-production.js'), testScript);

  // Make it executable
  execSync(`chmod +x ${join(config.distDir, 'test-production.js')}`, { stdio: 'inherit' });

  console.log('✅ Test script created');
}

async function installDependencies(): Promise<void> {
  console.log('📦 Installing production dependencies...');

  try {
    // Install dependencies in the dist directory
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

async function main(): Promise<void> {
  console.log('🏗️  Building Touch Monorepo Production Distribution (EJS Template Version)');
  console.log('='.repeat(70));

  try {
    await killPortsIfOccupied();
    await cleanDistDirectory();
    await createDistStructure();
    await buildClient();
    await buildServer();
    await copyDataFiles();
    await consolidateEnvironmentFiles();
    await createStartupScript();
    await createClientServer();
    await createPackageJson();
    await createReadme();
    await createTestScript();
    await installDependencies();

    console.log('');
    console.log('🎉 Production build completed successfully!');
    console.log('📦 Distribution created at:', config.distDir);
    console.log('');
    console.log('To run the production build:');
    console.log(`  cd ${config.distDir}`);
    console.log('  node start.js');
    console.log('');
    console.log('For full application (server + client):');
    console.log(`  cd ${config.distDir}`);
    console.log('  node start.js & node start-client.js');
    console.log('');
  } catch (error) {
    console.error('❌ Production build failed:', error);
    process.exit(1);
  }
}

// Run the build if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as buildProductionEjs };
