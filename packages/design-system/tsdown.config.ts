import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'recipes/index': 'src/recipes/index.ts',
    'components/index': 'src/components/index.ts',
    'grid/index': 'src/grid/index.ts',
    'icons/index': 'src/icons/index.ts',
    'panda.preset': 'src/panda.preset.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@ark-ui/react'],
});
