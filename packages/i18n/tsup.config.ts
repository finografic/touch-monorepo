import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    // NOTE: should match package.json exports
    'src/index.ts',
    'src/constants.ts',
    'src/utils/index.ts',
    'src/translations/index.ts',
  ],
  outDir: './dist',
  clean: true,
  experimentalDts: true,
  format: ['esm'],
  bundle: false,
  splitting: false,
  treeshake: true,
  publicDir: false,
} satisfies Options);
