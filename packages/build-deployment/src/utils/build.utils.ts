/** Client and server build utilities. */

import { join } from 'path';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { cp } from 'fs/promises';

import type { BuildConfig } from '../build-deployment.types.js';

/** Build the client app and copy output to the deployment directory. */
export async function buildClient({ config }: { config: BuildConfig }): Promise<void> {
  console.log('🏗️  Building client application...');

  try {
    execSync('pnpm --filter @workspace/client build.production', {
      cwd: config.workspaceRoot,
      stdio: 'inherit',
    });

    const clientBuildDir = join(config.clientDir, 'dist');
    if (!existsSync(clientBuildDir)) throw new Error('Client build directory not found');

    await cp(clientBuildDir, join(config.buildDir, 'client'), { recursive: true });
    console.log('✅ Client build copied to deployment');
  } catch (error) {
    console.error('❌ Client build failed:', error);
    throw error;
  }
}

/** Build the server app and copy output to the deployment directory. */
export async function buildServer({ config }: { config: BuildConfig }): Promise<void> {
  console.log('🏗️  Building server application...');

  try {
    execSync('pnpm --filter @workspace/server build.production', {
      cwd: config.workspaceRoot,
      stdio: 'inherit',
    });

    const serverBuildDir = join(config.serverDir, 'dist');
    if (!existsSync(serverBuildDir)) throw new Error('Server build directory not found');

    await cp(serverBuildDir, join(config.buildDir, 'server'), { recursive: true });
    console.log('✅ Server build copied to deployment');
  } catch (error) {
    console.error('❌ Server build failed:', error);
    throw error;
  }
}

/** Install production npm dependencies with progressive fallback strategies. */
export async function installDependencies({ config }: { config: BuildConfig }): Promise<void> {
  console.log('📦 Installing production dependencies...');

  const strategies = [
    { flags: '--production --no-audit --no-fund', label: 'standard' },
    { flags: '--production --legacy-peer-deps --no-audit --no-fund', label: 'legacy peer deps' },
    { flags: '--production --force --no-audit --no-fund', label: 'force' },
    { flags: '--production --legacy-peer-deps --force --no-audit --no-fund', label: 'legacy + force' },
  ];

  for (const { flags, label } of strategies) {
    try {
      console.log(`  🔧 Attempting npm install (${label})...`);
      execSync(`npm install ${flags}`, { cwd: config.distDir, stdio: 'inherit' });
      console.log(`✅ Production dependencies installed (${label})`);
      return;
    } catch {
      console.log(`⚠️  ${label} install failed, trying next strategy...`);
    }
  }

  console.error('❌ All installation attempts failed');
  console.error('💡 Try manually running: npm install --production --legacy-peer-deps --force');
  throw new Error('Dependency installation failed');
}
