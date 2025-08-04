import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'], // ESM for better compatibility with modern modules
  dts: false, // No types needed for production bundle
  clean: true, // Clean output directory
  target: 'ES2020', // Modern Node.js target
  sourcemap: false, // No sourcemaps for production
  bundle: true, // Bundle all dependencies
  minify: true, // Minify for smaller output
  splitting: false, // Single file output
  treeshake: true, // Remove unused code
  platform: 'node', // Specify Node.js platform
  outDir: 'dist', // Ensure output goes to dist directory
  env: {
    NODE_ENV: 'production',
  },
  external: [
    // Only external modules that can't be bundled
    'better-sqlite3', // Native module - keep external
    'fsevents', // Mac-specific native module
    // Node.js built-in modules - must be external
    'node:process',
    'node:os',
    'node:tty',
    'node:path',
    'node:fs',
    'node:url',
    'node:crypto',
    'node:buffer',
    'node:stream',
    'node:http',
    'node:https',
    'node:zlib',
    'node:net',
    'node:events',
    'node:util',
    'node:querystring',
    'node:child_process',
    'node:cluster',
    'node:worker_threads',
    'node:perf_hooks',
    'node:async_hooks',
    'node:timers',
    'node:assert',
    'node:constants',
    'node:domain',
    'node:module',
    'node:punycode',
    'node:readline',
    'node:repl',
    'node:string_decoder',
    'node:tls',
    'node:dgram',
    'node:dns',
    'node:http2',
    'node:inspector',
    'node:v8',
    'node:vm',
  ],
  esbuildOptions(options) {
    // Ensure we bundle as much as possible
    options.packages = 'bundle';
    // Handle dynamic imports
    options.platform = 'node';
    options.mainFields = ['module', 'main'];
    // Allow Node.js built-ins
    options.target = 'es2020';
    // Handle dynamic requires
    options.define = {
      'process.env.NODE_ENV': '"production"',
    };
  },
  noExternal: [
    // Force bundling of these modules that are usually external
    'hono',
    '@hono/*',
    'drizzle-orm',
    'zod',
    'dotenv',
    '@dotenvx/*',
    '@scalar/*', // Bundle scalar modules
    '@workspace/config',
    '@workspace/globals',
    '@workspace/core',
    '@workspace/types',
    '@workspace/i18n',
  ],
} satisfies Options);
