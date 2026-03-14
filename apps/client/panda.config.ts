import { designSystemPreset } from '@workspace/design-system/panda.preset';

import { defineConfig } from '@pandacss/dev';

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
  presets: ['@pandacss/dev/presets', designSystemPreset],

  /**
   * Scan for Panda CSS usage (css(), Box, recipes, etc.)
   *
   * Include design-system src so Panda extracts styles used in DS component
   * files (components/, forms/, etc.). Without it, CSS for those components
   * won't be generated. With pnpm workspaces, @workspace/design-system
   * resolves to the local package.
   */
  include: ['./src/**/*.{ts,tsx}', './node_modules/@workspace/design-system/src/**/*.{ts,tsx}'],
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

  /**
   * Dark mode — match the client's existing EmotionThemeProvider which
   * sets data-theme="dark" on document.documentElement.
   *
   * This makes _dark conditions in semantic tokens and recipes generate:
   *   [data-theme="dark"] { --colors-bg: ...; }
   * instead of the default `.dark { ... }`.
   */
  conditions: {
    extend: {
      dark: '[data-theme="dark"] &',
    },
  },

  // ======================================================================== //
  // NEW: https://panda-css.com/docs/references/config

  syntax: 'object-literal',
  // syntax: 'template-literal',
  shorthands: true,
});
