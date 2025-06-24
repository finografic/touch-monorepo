import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    // NOTE: should match package.json exports
    'src/index.ts',
    'src/constants/index.ts',
    'src/iso-codes/index.ts',
    'src/translations/index.ts',
    'src/types/index.ts',
    'src/utils/index.ts',
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
