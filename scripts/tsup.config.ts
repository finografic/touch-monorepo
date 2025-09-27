import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig([
  // Build CLI scripts to bin/ (if they exist)
  ...['src/db-setup/db-setup.ts']
    .filter((entry) => {
      try {
        require.resolve(entry);
        return true;
      } catch {
        return false;
      }
    })
    .map((entry) => ({
      entry: [entry],
      outDir: './bin',
      format: ['esm'],
      target: 'node18',
      platform: 'node',
      clean: true,
      dts: false,
      bundle: true,
      splitting: false,
      treeshake: true,
      banner: {
        js: '#!/usr/bin/env node',
      },
      external: ['fs', 'path', 'child_process'],
    })),
  // Build library entry points to dist/ (if they exist)
  ...['src/db-setup/index.ts', 'src/db-setup/config.template.ts', 'src/build-deployment-dev/index.ts']
    .filter((entry) => {
      try {
        require.resolve(entry);
        return true;
      } catch {
        return false;
      }
    })
    .map((entry) => ({
      entry: [entry],
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
    })),
  // Build deployment templates
  {
    entry: ['src/build-deployment-dev/templates/**/*.ts'],
    outDir: './dist/build-deployment-dev/templates',
    format: ['esm'],
    target: 'node18',
    platform: 'node',
    clean: true,
    dts: true,
    bundle: false,
    splitting: false,
    treeshake: false,
  },
]);
