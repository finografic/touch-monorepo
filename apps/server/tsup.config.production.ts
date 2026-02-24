import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'], // ESM for better compatibility with modern modules
  dts: false, // No types needed for production bundle
  clean: true,
  target: 'ES2020',
  sourcemap: false,
  bundle: true, // Bundle all dependencies
  minify: true, // Minify for smaller output
  splitting: false, // Single file output
  treeshake: true,
  platform: 'node',
  outDir: 'dist',
  env: {
    NODE_ENV: 'production',
  },
  external: [
    // Only external modules that can't be bundled
    'better-sqlite3', // Native module - keep external
    'fsevents', // Mac-specific native module
    'dotenv', // Uses require('fs') which doesn't work in ESM bundles
    // Node.js built-in modules - must be external (both formats)
    'fs', // Some packages use require('fs')
    'path', // Some packages use require('path')
    'os', // Some packages use require('os')
    'crypto', // Some packages use require('crypto')
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
    options.packages = 'bundle';
    options.platform = 'node';
    options.mainFields = ['module', 'main'];
    options.target = 'es2020';
    options.define = {
      'process.env.NODE_ENV': '"production"',
    };
    // Configure esbuild to resolve env.server from the root
    // Path is relative to the entry point (src/), so we go up one level
    options.alias = {
      ...options.alias,
      'env.server': './env.server.ts',
    };
    options.resolveExtensions = ['.ts', '.tsx', '.js', '.jsx'];
  },
  noExternal: [
    // Force bundling of these modules that are usually external
    'hono',
    '@hono/*',
    'drizzle-orm',
    'zod',
    // Note: dotenv is kept external because it uses require('fs') which doesn't work in ESM bundles
    '@scalar/*', // Bundle scalar modules
    '@workspace/core',
    '@workspace/i18n',
    '@workspace/shared',
  ],
} satisfies Options);
