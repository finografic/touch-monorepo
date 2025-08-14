import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    // NOTE: should match package.json exports
    'index': 'src/index.ts',
    'config/index': 'src/config/index.ts',
    'config/types': 'src/config/types.ts',
    'config/defaults': 'src/config/defaults.ts',
    'config/loader': 'src/config/loader.ts',
    'generators/index': 'src/generators/index.ts',
    'generators/types': 'src/generators/types.ts',
    'generators/cli': 'src/generators/cli.ts',
  },
  outDir: './dist',
  clean: true,
  experimentalDts: true,
  format: ['esm'],
  bundle: false,
  splitting: false,
  treeshake: true,
  publicDir: false,
} satisfies Options);
