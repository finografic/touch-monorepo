import { existsSync } from 'fs';
import { execSync } from 'child_process';
import type { BuildConfig } from '../build-deployment.types.js';

/**
 * Clean up temporary build directory
 */
export async function cleanupTempDirectory(config: BuildConfig): Promise<void> {
  console.log('🧹 Cleaning up temporary directory...');

  try {
    if (existsSync(config.distDir)) {
      const tempDir = config.distDir.includes('.temp')
        ? config.distDir.split('.temp')[0] + '.temp'
        : config.distDir;
      execSync(`rm -rf "${tempDir}"`, { stdio: 'inherit' });
      console.log('✅ Temporary directory cleaned up');
    }
  } catch (error) {
    console.warn('⚠️  Failed to cleanup temp directory:', error);
  }
}
