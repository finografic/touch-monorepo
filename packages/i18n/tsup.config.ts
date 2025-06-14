import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'translations/index': 'src/translations/index.ts',
  },
  outDir: './dist',
  clean: true,
  experimentalDts: true,
  format: ['esm'],
  bundle: false,
  splitting: false,
  treeshake: true,
  publicDir: false,
} satisfies Options);
