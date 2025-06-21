import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig({
  entry: [
    // NOTE: should match package.json exports
    'src/index.ts',
    'src/db/index.ts',
    'src/db/schemas/index.ts',
  ],
  outDir: './dist',
  clean: true,
  experimentalDts: true,
  format: ['esm'],
  bundle: false,
  splitting: false,
  treeshake: true,
} satisfies Options);
