import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: {
    entry: {
      index: 'src/index.ts',
      types: 'src/types/index.ts',
    },
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: 'dist',
  platform: 'node',
  target: 'node20',
});
