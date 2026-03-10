import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: false,
  deps: {
    neverBundle: ['react', 'react-dom'],
  },
});
