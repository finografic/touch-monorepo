import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/paths.ts', 'src/env.shared.ts'],
  outDir: './dist',
  clean: true,
  experimentalDts: true,
  format: ['esm'],
  bundle: false,
} satisfies Options);
