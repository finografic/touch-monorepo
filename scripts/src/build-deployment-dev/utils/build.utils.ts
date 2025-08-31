import { execSync } from 'child_process';
import { join, resolve } from 'path';
import { existsSync } from 'fs';
import type { BuildConfig, BuildOptions } from '../build-deployment.types.js';

/**
 * Build the client and server applications
 */
export async function buildApplications(config: BuildConfig): Promise<void> {
  console.log('🔨 Building applications...');

  // Build client
  console.log('📱 Building client...');
  execSync('pnpm build.production', {
    cwd: config.clientDir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
  });

  // Build server
  console.log('🖥️  Building server...');
  execSync('pnpm build.production', {
    cwd: config.serverDir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
  });

  console.log('✅ Applications built successfully');
}

/**
 * Install production dependencies in deployment directory
 */
export async function installDependencies(config: BuildConfig): Promise<void> {
  console.log('📦 Installing production dependencies...');

  try {
    // First attempt: Standard install
    console.log('  🔧 Attempting standard npm install...');
    execSync('npm install --production --no-audit --no-fund', {
      cwd: config.distDir,
      stdio: 'inherit',
    });
    console.log('✅ Production dependencies installed');
  } catch (error1) {
    console.log('  ⚠️  Standard install failed, trying with legacy peer deps...');
    try {
      // Second attempt: Use legacy peer deps to handle version conflicts
      execSync('npm install --production --legacy-peer-deps --no-audit --no-fund', {
        cwd: config.distDir,
        stdio: 'inherit',
      });
      console.log('✅ Production dependencies installed with legacy peer deps');
    } catch (error2) {
      console.log('  ⚠️  Legacy peer deps failed, trying with force...');
      try {
        // Third attempt: Force install to override conflicts
        execSync('npm install --production --force --no-audit --no-fund', {
          cwd: config.distDir,
          stdio: 'inherit',
        });
        console.log('✅ Production dependencies installed with force');
      } catch (error3) {
        console.log('  ⚠️  Force install failed, trying both flags...');
        try {
          // Final attempt: Use both flags
          execSync('npm install --production --legacy-peer-deps --force --no-audit --no-fund', {
            cwd: config.distDir,
            stdio: 'inherit',
          });
          console.log('✅ Production dependencies installed with all flags');
        } catch (error4) {
          console.error('❌ All dependency installation attempts failed:', error4);
          throw error4;
        }
      }
    }
  }
}
