import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig({
  format: ['esm'], // ESM for modern Node.js
  dts: false, // Since we're using tsc for types
  clean: true,
  target: 'ES2020',
  sourcemap: true,
  splitting: false,
  treeshake: true,
  minify: false,
  env: {
    NODE_ENV: 'production',
  },
  esbuildOptions(options) {
    // Configure esbuild to resolve env.server from the root
    // Path is relative to the entry point (src/), so we go up one level
    options.alias = {
      ...options.alias,
      'env.server': './env.server.ts',
    };
    // Set resolve options to look in the project root
    options.resolveExtensions = ['.ts', '.tsx', '.js', '.jsx'];
  },
  // External env.server so esbuild doesn't try to bundle it
  // We'll handle it via the alias instead
  noExternal: [],
  onSuccess: 'tsc --emitDeclarationOnly --declaration',
} satisfies Options);
