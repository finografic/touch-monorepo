import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'api/index': 'src/api/index.ts',
    'constants/index': 'src/constants/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'types/index': 'src/types/index.ts',
    'types/utils/index': 'src/types/utils/index.ts',
    'utils/index': 'src/utils/index.ts',
    'globals/index': 'src/globals/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: false,
  unbundle: true,
  logLevel: 'silent',
  deps: {
    neverBundle: [],
  },
});
