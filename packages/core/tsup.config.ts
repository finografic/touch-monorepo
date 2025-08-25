import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig({
  entry: [
    // NOTE: should match package.json exports
    'src/index.ts',
    // API files
    'src/api/index.ts',
    'src/api/error.types.ts',
    'src/api/error.constants.ts',
    'src/api/error.schema.ts',

    'src/api/api.utils.ts',
    'src/api/api.types.ts',
    // Constants files
    'src/constants/index.ts',
    'src/constants/zod-errors.ts',
    'src/constants/misc.constants.ts',
    // React hooks files
    'src/react/hooks/index.ts',
    'src/react/hooks/useKeyPressToggle/index.ts',
    'src/react/hooks/useKeyPressToggle/useKeyPressToggle.ts',
    'src/react/hooks/useKeyPressToggle/keypress.constants.ts',
    // Types files
    'src/types/index.ts',
    'src/types/utility.types.ts',
    'src/types/language.types.ts',
    'src/types/countries.types.ts',
    'src/types/utils/casing.utils.types.ts',
    'src/types/utils/enum.utils.types.ts',
    'src/types/utils/object.utils.types.ts',
    'src/types/utils/props.utils.types.ts',
    'src/types/utils/index.ts',
    // Globals files
    'src/globals/index.ts',
    'src/globals/log.ts',
    'src/globals/types.ts',
    // Utils files
    'src/utils/index.ts',
    'src/utils/string.utils.ts',
  ],
  outDir: './dist',
  clean: true,
  experimentalDts: true,
  format: ['esm'],
  bundle: false,
  splitting: false,
  treeshake: true,
} satisfies Options);
