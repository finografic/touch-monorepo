import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/constants/index.ts',
    'src/constants/temperature.config.ts',
  ],
  outDir: './dist',
  clean: true,
  experimentalDts: true,
  format: ['esm'],
  bundle: false,
  splitting: false,
  treeshake: true,
} satisfies Options);
