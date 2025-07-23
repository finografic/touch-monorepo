import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  clean: true,
  sourcemap: false,
  target: 'es2020',
});
