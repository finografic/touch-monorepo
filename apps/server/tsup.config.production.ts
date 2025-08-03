import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'], // CommonJS for compatibility with the startup script
  dts: false, // No types needed for production bundle
  clean: true, // Clean output directory
  target: 'ES2020', // Modern Node.js target
  sourcemap: false, // No sourcemaps for production
  bundle: true, // Bundle all dependencies
  minify: true, // Minify for smaller output
  splitting: false, // Single file output
  treeshake: true, // Remove unused code
  env: {
    NODE_ENV: 'production',
  },
  external: [
    // Only external modules that can't be bundled
    'better-sqlite3', // Native module - keep external
    'fsevents', // Mac-specific native module
  ],
  esbuildOptions(options) {
    // Ensure we bundle as much as possible
    options.packages = 'bundle';
    // Handle dynamic imports
    options.platform = 'node';
    options.mainFields = ['module', 'main'];
  },
  noExternal: [
    // Force bundling of these modules that are usually external
    'hono',
    '@hono/*',
    'drizzle-orm',
    'zod',
    'dotenv',
    '@dotenvx/*',
    '@workspace/config',
    '@workspace/globals',
    '@workspace/core',
    '@workspace/types',
    '@workspace/i18n',
  ],
} satisfies Options);
