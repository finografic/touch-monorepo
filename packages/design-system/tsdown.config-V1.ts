import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    // 'recipes/index': 'src/recipes/index.ts',
    'components/index': 'src/components/index.ts',
    'grid/index': 'src/grid/index.ts',
    'forms/index': 'src/forms/index.ts',
    'viewport/index': 'src/viewport/index.ts',
    'palette/colors': 'src/palette/colors.palette.ts',
    'panda.preset': 'src/panda.preset.ts',
  },

  format: ['esm'],

  // safest for mixed node/browser packages
  platform: 'neutral',

  dts: true,
  sourcemap: true,

  // keeps file structure clean for libraries
  unbundle: true,

  deps: {
    neverBundle: [
      'react',
      'react-dom',
      '@ark-ui/react',
      '@workspace/icons',

      // panda runtime should stay external
      '@styled-system/css',
      '@styled-system/jsx',
      '@styled-system/tokens',
    ],
  },
});
