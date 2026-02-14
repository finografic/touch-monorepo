/** File system operations for the deployment build. */

import { join } from 'path';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { copyFile, mkdir, cp } from 'fs/promises';

import type { BuildConfig } from '../build-deployment.types.js';

/** Remove previous build output (dist subdirectory only). */
export async function cleanDistDirectory({ config }: { config: BuildConfig }): Promise<void> {
  console.log('🧹 Cleaning distribution directory...');
  execSync(`rm -rf ${config.buildDir}`, { stdio: 'inherit' });
}

/** Create the deployment directory structure. */
export async function createDistStructure({ config }: { config: BuildConfig }): Promise<void> {
  console.log('📁 Creating deployment directory structure...');

  const directories = [
    config.distDir,
    config.buildDir,
    join(config.buildDir, 'client'),
    join(config.buildDir, 'server'),
    join(config.buildDir, 'data'),
    join(config.buildDir, 'data/db'),
    join(config.buildDir, 'data/uploads'),
    join(config.buildDir, 'data/logs'),
    join(config.buildDir, 'data/migrations'),
  ];

  for (const dir of directories) {
    await mkdir(dir, { recursive: true });
  }
}

/** Copy database, migrations, and uploads into the deployment. */
export async function copyDataFiles({ config }: { config: BuildConfig }): Promise<void> {
  console.log('📊 Copying data files...');

  try {
    // Copy database
    const dbSrc = join(config.dataDir, 'development.sqlite.db');
    if (existsSync(dbSrc)) {
      await copyFile(dbSrc, join(config.buildDir, 'data/db', 'production.sqlite.db'));
      console.log('✅ Database copied as production.sqlite.db');
    }

    // Copy migrations
    const migrationsDir = join(config.dataDir, 'migrations');
    if (existsSync(migrationsDir)) {
      await cp(migrationsDir, join(config.buildDir, 'data/migrations'), { recursive: true });
      console.log('✅ Database migrations copied');
    }

    // Copy uploads
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

/** Copy the .env.example file to the deployment. */
export async function copyEnvExample({ config }: { config: BuildConfig }): Promise<void> {
  console.log('📋 Copying .env.example...');

  try {
    const examplePath = join(config.workspaceRoot, '.env.example');
    if (!existsSync(examplePath)) {
      console.log('⚠️  .env.example not found, skipping');
      return;
    }
    await copyFile(examplePath, join(config.distDir, '.env.example'));
    console.log('✅ .env.example copied to deployment');
  } catch (error) {
    console.error('❌ Failed to copy .env.example:', error);
  }
}

/** Remove stale platform-specific scripts and docs from the deployment root. */
export async function cleanPlatformArtifacts({ config }: { config: BuildConfig }): Promise<void> {
  console.log('🧽 Cleaning platform-specific artifacts in deployment root...');
  try {
    const cmd = [
      `cd "${config.distDir}"`,
      'rm -f setup.bat setup-macos.sh',
      'rm -f start-*.bat start-*.sh',
      'rm -f USER_GUIDE*.md GUIA_USUARIO*.md',
    ].join(' && ');
    execSync(cmd, { stdio: 'inherit' });
  } catch {
    console.warn('⚠️  Failed to clean some platform artifacts (safe to ignore if not present).');
  }
}
