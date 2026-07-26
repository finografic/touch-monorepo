/** Client and server build utilities. */

import { join } from 'path';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { cp } from 'fs/promises';

import type { BuildConfig } from '../build-deployment.types.js';

/**
 * `pnpm --filter <pkg> <script>` exits 0 (not an error) when the filtered
 * package has no script by that name — it just prints this message and
 * no-ops instead of building. Without this guard a renamed/typo'd script
 * silently skips the build and a stale `dist/` gets packaged instead.
 */
function runWorkspaceBuildScript({ packageName, scriptName, cwd }: {
  packageName: string;
  scriptName: string;
  cwd: string;
}): void {
  const output = execSync(`pnpm --filter ${packageName} ${scriptName}`, {
    cwd,
    encoding: 'utf8',
  });

  console.log(output);

  if (output.includes('None of the selected packages has a')) {
    throw new Error(`Script "${scriptName}" not found in ${packageName} — check package.json`);
  }
}

/** Build the client app and copy output to the deployment directory. */
export async function buildClient({ config }: { config: BuildConfig }): Promise<void> {
  console.log('🏗️  Building client application...');

  try {
    runWorkspaceBuildScript({
      packageName: '@workspace/client',
      scriptName: 'build:production',
      cwd: config.workspaceRoot,
    });

    const clientBuildDir = join(config.clientDir, 'dist');
    if (!existsSync(clientBuildDir)) throw new Error('Client build directory not found');

    await cp(clientBuildDir, join(config.buildDir, 'client'), { recursive: true });
    console.log('✅ Client build copied to deployment');
  } catch (error) {
    console.error('❌ Client build failed:', error);
    if (error && typeof error === 'object' && 'stdout' in error) console.error(String(error.stdout));
    throw error;
  }
}

/** Build the server app and copy output to the deployment directory. */
export async function buildServer({ config }: { config: BuildConfig }): Promise<void> {
  console.log('🏗️  Building server application...');

  try {
    runWorkspaceBuildScript({
      packageName: '@workspace/server',
      scriptName: 'build:production',
      cwd: config.workspaceRoot,
    });

    const serverBuildDir = join(config.serverDir, 'dist');
    if (!existsSync(serverBuildDir)) throw new Error('Server build directory not found');

    await cp(serverBuildDir, join(config.buildDir, 'server'), { recursive: true });
    console.log('✅ Server build copied to deployment');
  } catch (error) {
    console.error('❌ Server build failed:', error);
    if (error && typeof error === 'object' && 'stdout' in error) console.error(String(error.stdout));
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
