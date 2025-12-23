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
    'constants/index': 'src/constants/index.ts',
    'generators/index': 'src/generators/index.ts',
    'generators/generate-types': 'src/generators/generate-types.ts',
    'generators/generate-constants': 'src/generators/generate-constants.ts',
    'generators/cli': 'src/generators/cli.ts',
    'iso-codes/index': 'src/iso-codes/index.ts',
    'lib/locale': 'src/lib/locale.ts',
    'translations/index': 'src/translations/index.ts',
    'types/index': 'src/types/index.ts',
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
    // Copy JSON files from root translations/ folder to maintain folder structure inside dist/translations/
    const jsonFiles = [
      { src: 'translations/app/ca-ES.json', dest: 'dist/translations/app/ca-ES.json' },
      { src: 'translations/app/en-GB.json', dest: 'dist/translations/app/en-GB.json' },
      { src: 'translations/app/es-ES.json', dest: 'dist/translations/app/es-ES.json' },
      { src: 'translations/admin/ca-ES.json', dest: 'dist/translations/admin/ca-ES.json' },
      { src: 'translations/admin/en-GB.json', dest: 'dist/translations/admin/en-GB.json' },
      { src: 'translations/admin/es-ES.json', dest: 'dist/translations/admin/es-ES.json' },
      { src: 'translations/ui/ca-ES.json', dest: 'dist/translations/ui/ca-ES.json' },
      { src: 'translations/ui/en-GB.json', dest: 'dist/translations/ui/en-GB.json' },
      { src: 'translations/ui/es-ES.json', dest: 'dist/translations/ui/es-ES.json' },
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
