import type { Options } from 'tsup';
import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

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
    'utils/index': 'src/utils/index.ts',
  },
  outDir: './dist',
  clean: true,
  experimentalDts: true,
  format: ['esm'],
  bundle: false,
  splitting: false,
  treeshake: true,
  publicDir: false, // Don't use publicDir, we'll copy manually
  loader: {
    '.json': 'copy',
  },
  onSuccess: async () => {
    // Copy JSON files to maintain folder structure inside dist/translations/
    const jsonFiles = [
      { src: 'src/translations/app/ca-ES.json', dest: 'dist/translations/app/ca-ES.json' },
      { src: 'src/translations/app/en-GB.json', dest: 'dist/translations/app/en-GB.json' },
      { src: 'src/translations/app/es-ES.json', dest: 'dist/translations/app/es-ES.json' },
      { src: 'src/translations/common/ca-ES.json', dest: 'dist/translations/common/ca-ES.json' },
      { src: 'src/translations/common/en-GB.json', dest: 'dist/translations/common/en-GB.json' },
      { src: 'src/translations/common/es-ES.json', dest: 'dist/translations/common/es-ES.json' },
      { src: 'src/translations/dynamic/ca-ES.json', dest: 'dist/translations/dynamic/ca-ES.json' },
      { src: 'src/translations/dynamic/en-GB.json', dest: 'dist/translations/dynamic/en-GB.json' },
      { src: 'src/translations/dynamic/es-ES.json', dest: 'dist/translations/dynamic/es-ES.json' },
    ];

    for (const { src, dest } of jsonFiles) {
      try {
        mkdirSync(dirname(dest), { recursive: true });
        copyFileSync(src, dest);
      } catch (error) {
        console.warn(`Failed to copy ${src} to ${dest}:`, error);
      }
    }
  },
});
