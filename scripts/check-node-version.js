#!/usr/bin/env node
/**
 * Check Node.js version against .nvmrc
 * Exits with code 1 if version mismatch
 */

const { readFileSync } = require('node:fs');
const { join, resolve } = require('node:path');

const projectRoot = resolve(__dirname, '..');
const nvmrcPath = join(projectRoot, '.nvmrc');

try {
  const requiredVersion = readFileSync(nvmrcPath, 'utf-8').trim();
  const currentVersion = process.version.slice(1); // Remove 'v' prefix

  if (currentVersion !== requiredVersion) {
    console.error('❌ Node.js version mismatch!');
    console.error(`   Required: v${requiredVersion} (from .nvmrc)`);
    console.error(`   Current:  v${currentVersion}`);
    console.error('');
    console.error('   Please run: nvm use');
    process.exit(1);
  }
} catch (error) {
  if (error.code === 'ENOENT') {
    console.warn('⚠️  .nvmrc file not found, skipping version check');
    process.exit(0);
  } else {
    console.error('❌ Error reading .nvmrc:', error.message);
    process.exit(1);
  }
}
