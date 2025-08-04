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
  buildDir: string; // New: dist subdirectory for build artifacts
}

const config: BuildConfig = {
  distDir: DIST_DIR,
  workspaceRoot: WORKSPACE_ROOT,
  clientDir: join(WORKSPACE_ROOT, 'apps/client'),
  serverDir: join(WORKSPACE_ROOT, 'apps/server'),
  dataDir: join(WORKSPACE_ROOT, 'data'),
  configDir: join(WORKSPACE_ROOT, 'config'),
  buildDir: join(DIST_DIR, 'dist'), // Build artifacts go here
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

    // Create .env.production in dist directory (for server)
    await writeFile(join(config.buildDir, '.env.production'), envContent.join('\n'));

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

async function main(): Promise<void> {
  console.log('🏗️  Building Touch Monorepo Deployment');
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
    await installDependencies();
    await copyEnvExample();

    console.log('');
    console.log('🎉 Deployment build completed successfully!');
    console.log('📦 Deployment created at:', config.distDir);
    console.log('');
    console.log('To run the deployment:');
    console.log(`  cd ${config.distDir}`);
    console.log('  node start.js');
    console.log('');
    console.log('For full application (server + client):');
    console.log(`  cd ${config.distDir}`);
    console.log('  node start.js & node start-client.js');
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
