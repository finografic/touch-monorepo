#!/usr/bin/env tsx
/**
 * Update all dependencies to latest, excluding specified packages
 *
 * Usage:
 *   tsx scripts/update-deps-ignore.ts
 *
 * Or via npm script:
 *   pnpm update.deps.all.ignore
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Packages to ignore (not update)
const IGNORE_PACKAGES: string[] = [
  // Node types (keep stable)
  '@types/node',

  // TODO: NODE-DEPENDENT PACKAGES - MAY REQURIE REBUILDING
  // Native modules & build tools (must match Node.js version)
  // These require compilation and can break with Node version changes
  'node-gyp', // Build tool for native modules (tied to Node.js version)
  'better-sqlite3', // Native SQLite bindings (requires node-gyp)
  '@types/better-sqlite3',
  'valibot',

  // TODO: SERVER - CHECK THESE !!
  '@scalar/hono-api-reference',

  // TODO: REACT - LOCK
  'react',
  'react-dom',
  '@types/react',
  '@types/react-dom',

  // TODO: PROBLEMATIC PACKAGES - ⚠️ CAUTION REQUIRED
  'better-sqlite3',
  '@types/better-sqlite3',

  // TODO: LEAVE MY PACKAGES - ⚠️ THEY IN DEVELOPMENT
  '@finografic/project-scripts',
  '@finografic/eslint-config',
];

/**
 * Get all dependencies from package.json (both dependencies and devDependencies)
 */
async function getAllDependencies(packageJsonPath: string): Promise<string[]> {
  const content = await readFile(packageJsonPath, 'utf-8');
  const pkg = JSON.parse(content);

  const deps = Object.keys(pkg.dependencies || {});
  const devDeps = Object.keys(pkg.devDependencies || {});

  return [...deps, ...devDeps];
}

/**
 * Filter out ignored packages
 */
function filterIgnoredPackages(allPackages: string[], ignored: string[]): string[] {
  return allPackages.filter((pkg) => !ignored.includes(pkg));
}

/**
 * Update packages using pnpm
 */
function updatePackages(packages: string[], packageJsonPath: string): void {
  if (packages.length === 0) {
    console.log('✅ No packages to update (all are ignored)');
    return;
  }

  console.log(`📦 Updating ${packages.length} packages...`);
  console.log(`   Ignoring: ${IGNORE_PACKAGES.length > 0 ? IGNORE_PACKAGES.join(', ') : 'none'}`);
  console.log('');

  try {
    // cwd = package being updated (e.g. apps/server or apps/client when run via pnpm --filter)
    const packageDir = dirname(packageJsonPath);
    const packagesArg = packages.join(' ');
    execSync(`pnpm update --latest ${packagesArg}`, {
      stdio: 'inherit',
      cwd: packageDir,
    });
    console.log('\n✅ All packages updated successfully!');
  } catch (error) {
    console.error('\n❌ Error updating packages:', error);
    process.exit(1);
  }
}

/**
 * Main function
 * Uses process.cwd() so when run via pnpm --filter @workspace/server (or client),
 * it updates that package's package.json.
 */
async function main() {
  const packageJsonPath = join(process.cwd(), 'package.json');

  console.log('🔍 Reading package.json...');
  const allPackages = await getAllDependencies(packageJsonPath);

  console.log(`📋 Found ${allPackages.length} total dependencies`);

  const packagesToUpdate = filterIgnoredPackages(allPackages, IGNORE_PACKAGES);

  console.log(`📦 Will update ${packagesToUpdate.length} packages`);
  if (IGNORE_PACKAGES.length > 0) {
    console.log(`🚫 Ignoring ${IGNORE_PACKAGES.length} packages: ${IGNORE_PACKAGES.join(', ')}`);
  }
  console.log('');

  updatePackages(packagesToUpdate, packageJsonPath);
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
