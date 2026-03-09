import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm'],
  dts: true,
  deps: {
    neverBundle: ['react', 'react-dom'],
  },
});
