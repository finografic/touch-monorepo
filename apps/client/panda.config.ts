import { defineConfig } from '@pandacss/dev';

import { designSystemPreset } from '@workspace/design-system/panda.preset';

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
   * Scan client source for used class names (tree-shaking).
   */
  include: ['./src/**/*.{ts,tsx}'],
  exclude: [],

  /**
   * Output directory (gitignored).
   */
  outdir: 'styled-system',

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
});
