import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'index.node': 'src/index.node.ts',
    'config/index': 'src/config/index.ts',
    'config/types': 'src/config/types.ts',
    'config/defaults': 'src/config/defaults.ts',
    'config/loader': 'src/config/loader.ts',
    'generators/index': 'src/generators/index.ts',
    'generators/generate-types': 'src/generators/generate-types.ts',
    'generators/generate-constants': 'src/generators/generate-constants.ts',
    'generators/cli': 'src/generators/cli.ts',
    'translations/index': 'src/translations/index.ts',
  },
  outDir: './dist',
  clean: true,
  experimentalDts: true,
  format: ['esm'],
  bundle: false,
  splitting: false,
  treeshake: true,
  publicDir: false,
  // Copy JSON files to dist
  loader: {
    '.json': 'copy',
  },
});
