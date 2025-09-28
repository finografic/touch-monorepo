#!/usr/bin/env node

import { join } from 'path';
import { loadConfig } from '../config';
import { generateTypes } from './generate-types';
import { generateConstants } from './generate-constants';

async function main() {
  try {
    // When running with pnpm --filter, we need to go up to the monorepo root
    const monorepoRoot = join(process.cwd(), '..', '..');

    // Look for config file in monorepo root
    const configPath = join(monorepoRoot, 'config', 'i18n', 'config.ts');
    const config = await loadConfig(configPath);

    // Generate types + constants
    await generateTypes(config, monorepoRoot);
    await generateConstants(config, monorepoRoot);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as generateI18nTypes };
