import { defineConfig } from 'tsdown';

const browserEntries = {
  'index': 'src/index.ts',
  'tokens/index': 'src/tokens/index.ts',
  // 'recipes/index': 'src/recipes/index.ts',
  'components/index': 'src/components/index.ts',
  'grid/index': 'src/grid/index.ts',
  'forms/index': 'src/forms/index.ts',
  'viewport/index': 'src/viewport/index.ts',
  'palette/colors': 'src/palette/colors.palette.ts',
};

// panda.preset runs in Node at panda codegen time — never in the browser
const nodeEntries = {
  'panda.preset': 'src/panda.preset.ts',
};

export default defineConfig([
  {
    entry: browserEntries,
    format: ['esm'],
    platform: 'browser',
    dts: true,
    sourcemap: true,
    unbundle: true,
    deps: {
      neverBundle: [
        'react',
        'react-dom',
        '@ark-ui/react',
        '@workspace/icons',
        '@styled-system/css',
        '@styled-system/jsx',
      ],
    },
  },
  {
    entry: nodeEntries,
    format: ['esm'],
    platform: 'node',
    dts: true,
    sourcemap: true,
    // unbundle: true,
  },
]);
