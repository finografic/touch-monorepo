/** Cleanup and port management utilities. */

import { join } from 'path';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

import type { BuildConfig } from '../build-deployment.types.js';

/** Remove the .temp build directory. */
export async function cleanupTempDirectory({ config }: { config: BuildConfig }): Promise<void> {
  console.log('🧹 Cleaning up temporary build directory...');

  try {
    const tempDir = join(config.workspaceRoot, '.temp');
    if (!existsSync(tempDir)) return;

    execSync(`rm -rf "${tempDir}"`, { stdio: 'inherit' });
    console.log('✅ Temporary directory cleaned up');
  } catch (error) {
    console.warn('⚠️  Failed to cleanup temp directory:', error);
  }
}

/** Kill any processes occupying ports 3000 and 4040. */
export async function killPortsIfOccupied(): Promise<void> {
  console.log('🔧 Checking for occupied ports...');

  for (const port of [3000, 4040]) {
    try {
      const result = execSync(`lsof -ti:${port}`, { stdio: 'pipe' }).toString().trim();
      if (result) {
        console.log(`⚠️  Port ${port} is occupied, killing process...`);
        execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'inherit' });
        console.log(`✅ Killed process on port ${port}`);
      } else {
        console.log(`✅ Port ${port} is available`);
      }
    } catch {
      console.log(`✅ Port ${port} is available`);
    }
  }
}
