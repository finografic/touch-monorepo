import { cp, mkdir, readdir, stat, copyFile } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import type { BuildConfig } from '../build-deployment.types.js';

/**
 * Copy build artifacts from source to deployment directory
 */
export async function copyBuildArtifacts(config: BuildConfig): Promise<void> {
  console.log('📁 Copying build artifacts...');

  const sources = [
    {
      name: 'client build',
      src: join(config.clientDir, 'dist'),
      dest: join(config.distDir, 'dist', 'client'),
    },
    {
      name: 'server build',
      src: join(config.serverDir, 'dist'),
      dest: join(config.distDir, 'dist', 'server'),
    },
    {
      name: 'data directory',
      src: config.dataDir,
      dest: join(config.distDir, 'dist', 'data'),
    },
  ];

  for (const { name, src, dest } of sources) {
    if (existsSync(src)) {
      console.log(`  📦 Copying ${name}: ${src} → ${dest}`);
      await mkdir(dirname(dest), { recursive: true });
      await cp(src, dest, { recursive: true });
    } else {
      console.warn(`  ⚠️  ${name} not found at ${src}, skipping...`);
    }
  }

  console.log('✅ Build artifacts copied');
}

/**
 * Copy environment files to deployment directory
 */
export async function copyEnvExample(config: BuildConfig): Promise<void> {
  console.log('📄 Copying environment files...');

  const envFiles = [
    { src: 'env.example', dest: '.env.example' },
    { src: 'env.example', dest: '.env.production' },
  ];

  for (const { src, dest } of envFiles) {
    try {
      await copyFile(src, join(config.distDir, dest));
      console.log(`  ✅ ${src} → ${dest}`);
    } catch (error) {
      console.warn(`  ⚠️  Failed to copy ${src}:`, error);
    }
  }
}

/**
 * Fast copy utility using system commands when available
 */
async function fastCopy(src: string, dest: string, options: { recursive?: boolean } = {}): Promise<void> {
  // For now, use the Node.js cp method for reliability
  await cp(src, dest, { recursive: options.recursive || false });
}

/**
 * Clean platform-specific artifacts from deployment directory
 */
export async function cleanPlatformArtifacts(config: BuildConfig): Promise<void> {
  console.log('🧽 Cleaning platform-specific artifacts in deployment root...');
  try {
    const cmd = [
      `cd "${config.distDir}"`,
      // remove any previously generated platform-specific scripts/docs
      'rm -f setup.bat setup-macos.sh',
      'rm -f start-*.bat start-*.sh',
      'rm -f USER_GUIDE*.md GUIA_USUARIO*.md',
      // remove specific development files that shouldn't be in production
      'rm -f *.js.map',
      'rm -f fix-usestore-shallow.js',
      'rm -f syncpack.config.js',
    ].join(' && ');
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️  Failed to clean some platform artifacts (safe to ignore if not present).');
  }
}
