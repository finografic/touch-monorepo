import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig([
  /*
  // Build CLI scripts to bin/
  {
    entry: ['src/db-setup/db-setup.ts'],
    outDir: './bin',
    format: ['esm'],
    target: 'node18',
    platform: 'node',
    clean: true,
    // experimentalDts: true,
    dts: false,
    bundle: true,
    splitting: false,
    treeshake: true,
    banner: {
      js: '#!/usr/bin/env node',
    },
    external: ['fs', 'path', 'child_process'],
  },
  // Build library entry points to dist/
  {
    entry: ['src/db-setup/index.ts', 'src/db-setup/config.template.ts'],
    outDir: './dist',
    format: ['esm'],
    target: 'node18',
    platform: 'node',
    shims: true,
    clean: true,
    minify: false,
    splitting: false,
    sourcemap: false,
    experimentalDts: true,
    bundle: true,
    external: ['fs', 'path'],
    treeshake: true,
  },
  */
]);
