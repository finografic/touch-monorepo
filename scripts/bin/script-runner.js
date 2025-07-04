#!/usr/bin/env node

import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);

// Import and run the script runner
async function runScriptRunner() {
  try {
    const scriptPath = new URL('../src/script-runner/script-runner.ts', import.meta.url).pathname;
    const { main } = await import(pathToFileURL(scriptPath).href);
    await main();
  } catch (error) {
    console.error('Failed to run script runner:', error);
    process.exit(1);
  }
}

runScriptRunner();
