import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    'main': 'src/index.ts',
    'constants/index': 'src/constants/index.ts',
    'constants/temperature.config': 'src/constants/temperature.config.ts',
  },
  format: ['esm'],
  dts: true,
  // clean: process.env.NODE_ENV !== 'development',
  clean: false,
  treeshake: false,
  outDir: './dist',
  unbundle: true,
});
