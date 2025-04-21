import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/env.shared.ts', 'src/paths.ts'],
  outDir: './dist',
  clean: true,
  experimentalDts: true,
  format: ['esm'],
  bundle: false,
} satisfies Options);
