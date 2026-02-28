/**
 * Panda CSS config for the design-system package itself.
 *
 * This is used for:
 * 1. Running `panda codegen` to generate the styled-system utilities
 * 2. Type-checking recipe definitions against token values
 *
 * Consuming apps import the preset instead:
 *   import { designSystemPreset } from '@workspace/design-system/panda.preset';
 */
import { defineConfig } from '@pandacss/dev';

import { designSystemPreset } from './src/panda.preset';

export default defineConfig({
  presets: [designSystemPreset],
  preflight: true,
  include: ['./src/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  jsxFramework: 'react',
});
