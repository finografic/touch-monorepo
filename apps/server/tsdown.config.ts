import { resolve } from 'node:path';

import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'db/index': 'src/db/index.ts',
    'db/schemas/index': 'src/db/schemas/index.ts',
  },
  format: ['esm'],
  dts: false, // Using tsc for types (emitDeclarationOnly)
  clean: true,
  target: 'ES2020',
  sourcemap: true,
  treeshake: true,
  minify: false,
  unbundle: false, // Bundle each entry (matches tsup behavior)
  outDir: 'dist',
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
  env: {
    NODE_ENV: 'production',
  },
  alias: {
    'env.server': resolve(import.meta.dirname, 'env.server.ts'),
  },
  deps: {
    onlyAllowBundle: false,
  },
  onSuccess: 'tsc --emitDeclarationOnly --declaration',
});
