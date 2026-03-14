import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'recipes/index': 'src/recipes/index.ts',
    'components/index': 'src/components/index.ts',
    'grid/index': 'src/grid/index.ts',
    'forms/index': 'src/forms/index.ts',
    'viewport/index': 'src/viewport/index.ts',
    'palette/colors': 'src/palette/colors.palette.ts',
    'panda.preset': 'src/panda.preset.ts',
  },
  // entry: {
  //   'index': 'src/index.ts',
  //   'tokens': 'src/tokens/index.ts',
  //   'recipes': 'src/recipes/index.ts',
  //   'components': 'src/components/index.ts',
  //   'grid': 'src/grid/index.ts',
  //   'forms': 'src/forms/index.ts',
  //   'forms/primitives': 'src/forms/primitives.ts',
  //   'viewport': 'src/viewport/index.ts',
  //   'palette/colors.base': 'src/palette/colors.palette.ts',
  //   'panda.preset': 'src/panda.preset.ts',
  // },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  unbundle: true,
  logLevel: 'silent',
  deps: {
    neverBundle: ['react', 'react-dom', '@ark-ui/react', '@workspace/icons'],
  },
});
