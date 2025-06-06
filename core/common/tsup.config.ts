import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/types/index.ts', 'src/utils/index.ts', 'src/api/index.ts'],
  format: ['esm'],
  // dts: true,
  // splitting: false,
  // sourcemap: true,
  // clean: true,
  // treeshake: true,
  // outDir: 'dist',
  // platform: 'node',
  // target: 'node20',
  outDir: './dist',
  clean: true,
  experimentalDts: true,
  bundle: true,
  splitting: true,
  sourcemap: true,
  treeshake: true,
} satisfies Options);
