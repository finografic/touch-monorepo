import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    'main': 'src/index.ts',
    'constants/index': 'src/constants/index.ts',
    'constants/temperature.config': 'src/constants/temperature.config.ts',
  },
  format: ['esm'],
  sourcemap: false,
  unbundle: true,
  dts: true,
  clean: false,
  treeshake: false,
});
