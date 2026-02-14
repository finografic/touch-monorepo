/** Package.json generation utilities. */

import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';

import type { BuildConfig, BuildOptions } from '../build-deployment.types.js';

/** Create the production package.json with server dependencies. */
export async function createPackageJson({
  config,
  options,
}: {
  config: BuildConfig;
  options: BuildOptions;
}): Promise<void> {
  console.log('📦 Creating production package.json...');

  const serverPkg = JSON.parse(await readFile(join(config.serverDir, 'package.json'), 'utf-8'));

  // Keep server deps, remove workspace packages (they're bundled)
  const serverDependencies = { ...serverPkg.dependencies };
  for (const key of Object.keys(serverDependencies)) {
    if (key.startsWith('@workspace/')) delete serverDependencies[key];
  }

  const packageJson = {
    name: 'touch-monorepo-production',
    version: '1.0.0',
    description: 'Touch Monorepo Production Distribution',
    private: true,
    type: 'module',
    scripts: {
      'start': 'run-p start:server start:client',
      'start:server': 'node start-server.js',
      'start:client': 'node start-client.js',
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
      node: '>=22.0.0',
    },
  };

  await writeFile(join(config.distDir, 'package.json'), JSON.stringify(packageJson, null, 2));
  console.log('✅ Production package.json created');
}

/** Add Windows-specific npm scripts to the existing package.json. */
export async function addWindowsScriptsToPackageJson({
  config,
  options,
}: {
  config: BuildConfig;
  options: BuildOptions;
}): Promise<void> {
  if (options.platform !== 'windows') return;

  console.log('🪟 Adding Windows-specific scripts to package.json...');

  try {
    const pkgPath = join(config.distDir, 'package.json');
    const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));

    pkg.scripts = {
      ...pkg.scripts,
      'install:windows.tools': 'npm install -g windows-build-tools && npm install',
      'preinstall':
        "node -e \"if(process.platform==='win32'){require('child_process').exec('npm run install:windows.tools')}else{console.log('Skipping Windows build tools on non-Windows platform')}\"",
    };

    await writeFile(pkgPath, JSON.stringify(pkg, null, 2));
    console.log('✅ Windows-specific scripts added to package.json');
  } catch (error) {
    console.error('❌ Failed to add Windows scripts:', error);
    throw error;
  }
}

/** Create a minimal standalone package.json (fewer deps, no server deps). */
export async function createStandalonePackage({
  config,
}: {
  config: BuildConfig;
  options: BuildOptions;
}): Promise<void> {
  console.log('📦 Creating standalone package...');

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
