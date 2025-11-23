#!/usr/bin/env tsx
/**
 * Update all dependencies to latest, excluding specified packages
 *
 * Usage:
 *   tsx scripts/update-deps-ignore.ts
 *
 * Or via npm script:
 *   pnpm upgrade.deps.all.ignore
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Packages to ignore (not update)
// React 18 related - to avoid migrating to React 19
const IGNORE_PACKAGES: string[] = [
  // Core React (must match versions)
  'react',
  'react-dom',

  // Type definitions (must match React version)
  '@types/react',
  '@types/react-dom',

  // React Router v7 (may require React 19)
  'react-router-dom',
  '@react-router/dev',

  // React testing (may have peer deps on React version)
  '@testing-library/react',

  // React dev tools (may require specific React versions)
  '@vitejs/plugin-react',
  '@vitejs/plugin-react-swc',

  // Node types (keep stable)
  '@types/node',

  // Note: Other React-related packages that are usually safe to update:
  // - @radix-ui/* packages (check peer deps, but usually fine)
  // - @emotion/react, @emotion/styled (check peer deps)
  // - react-hook-form, react-i18next, react-error-boundary (usually fine)
  // - @tanstack/react-query* (usually fine, but check peer deps)
  // - eslint-plugin-react* (usually fine)
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
function updatePackages(packages: string[]): void {
  if (packages.length === 0) {
    console.log('✅ No packages to update (all are ignored)');
    return;
  }

  console.log(`📦 Updating ${packages.length} packages...`);
  console.log(`   Ignoring: ${IGNORE_PACKAGES.length > 0 ? IGNORE_PACKAGES.join(', ') : 'none'}`);
  console.log('');

  try {
    // Update all packages at once
    const packagesArg = packages.join(' ');
    execSync(`pnpm update --latest ${packagesArg}`, {
      stdio: 'inherit',
      cwd: join(__dirname, '..'),
    });
    console.log('\n✅ All packages updated successfully!');
  } catch (error) {
    console.error('\n❌ Error updating packages:', error);
    process.exit(1);
  }
}

/**
 * Main function
 */
async function main() {
  const packageJsonPath = join(__dirname, '..', 'package.json');

  console.log('🔍 Reading package.json...');
  const allPackages = await getAllDependencies(packageJsonPath);

  console.log(`📋 Found ${allPackages.length} total dependencies`);

  const packagesToUpdate = filterIgnoredPackages(allPackages, IGNORE_PACKAGES);

  console.log(`📦 Will update ${packagesToUpdate.length} packages`);
  if (IGNORE_PACKAGES.length > 0) {
    console.log(`🚫 Ignoring ${IGNORE_PACKAGES.length} packages: ${IGNORE_PACKAGES.join(', ')}`);
  }
  console.log('');

  updatePackages(packagesToUpdate);
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
