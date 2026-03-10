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
  /**
   * Disable Panda's built-in preflight — client already has
   * @workspace/design-system/styles/reset.css imported in theme.css.
   */
  preflight: false,

  /**
   * Base Panda utilities + our design-system preset.
   * Order matters: designSystemPreset overrides base tokens.
   */
  presets: [designSystemPreset],

  /**
   * Scan client source for used class names (tree-shaking).
   */
  include: ['./src/**/*.{ts,tsx}'],
  exclude: [],

  /**
   * Output directory (gitignored).
   */
  outdir: 'styled-system',

  /**
   * Generate React JSX components from Panda patterns.
   * Gives us <Box mx="4" py="2"> etc. with full token + responsive support.
   * Use Box for spacing/layout wrappers. Use Row/Col for flex grid layout.
   */
  jsxFramework: 'react',

  // ======================================================================== //
  // NEW: https://panda-css.com/docs/references/config

  watch: true,
  syntax: 'object-literal',
  // syntax: 'template-literal',
  shorthands: true,
});
