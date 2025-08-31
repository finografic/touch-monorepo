import { execSync } from 'child_process';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import type { BuildConfig, BuildOptions } from '../build-deployment.types.js';

/**
 * Create deployment zip archive
 */
export async function createZipArchive(config: BuildConfig, options: BuildOptions): Promise<string> {
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
