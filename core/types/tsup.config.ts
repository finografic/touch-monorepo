import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/utils/index.ts'],
  outDir: './dist',
  clean: true,
  experimentalDts: true,
  format: ['esm'],
  bundle: true,
  splitting: true,
  treeshake: true,
} satisfies Options);
