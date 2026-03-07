import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'recipes/index': 'src/recipes/index.ts',
    'components/index': 'src/components/index.ts',
    'grid/index': 'src/grid/index.ts',
    'forms/index': 'src/forms/index.ts',
    'forms/primitives': 'src/forms/primitives.ts',
    'viewport/index': 'src/viewport/index.ts',
    'icons/index': 'src/icons/index.ts',
    'panda.preset': 'src/panda.preset.ts',
  },
  format: ['esm'],
  dts: true,
  external: ['react', 'react-dom', '@ark-ui/react', '@workspace/icons'],
});
