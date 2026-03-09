import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'constants/index': 'src/constants/index.ts',
    // 'constants/temperature.config': 'src/constants/temperature.config.ts',
    'models/index': 'src/models/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  treeshake: false,
  outDir: './dist',
  bundle: false,
});
