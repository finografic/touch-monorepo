/**
 * CSS Themes Generator - Auto-generates index.css with proper theme selectors
 *
 * This script generates CSS theme files with proper [data-theme='light'] and [data-theme='dark'] selectors,
 * ensuring consistency with your app's theme system and eliminating manual maintenance.
 */

import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { lightColors } from '../../themes/light.colors';
import { darkColors } from '../../themes/dark.colors';
import {
  generateCssColorVariables,
  generateCssColorVariablesTransparency,
} from './generate-css-variables.utils';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate CSS theme content using your actual color palette
 */
function generateCssThemeContent(): string {
  const now = new Date();
  const timestamp = `📅 Generated: ${now
    .toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$3-$1-$2 -- $4:$5:$6')}`;

  // Generate CSS variables for light theme
  const lightCssVars = generateCssColorVariables({ colors: lightColors });
  const lightTransparencyVars = generateCssColorVariablesTransparency();

  // Generate CSS variables for dark theme
  const darkCssVars = generateCssColorVariables({ colors: darkColors });
  const darkTransparencyVars = generateCssColorVariablesTransparency();

  let content = `@import 'tailwindcss';

@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

/* 🚨 AUTO-GENERATED - DO NOT EDIT MANUALLY */
/* ${timestamp} */
/* Run: pnpm generate:css-themes to update this file */

:root {
  --radius: 0.625rem;
${lightCssVars}${lightTransparencyVars}
}

/* Light theme - explicit selector */
[data-theme='light'] {
${lightCssVars}${lightTransparencyVars}
}

/* Dark theme */
[data-theme='dark'] {
${darkCssVars}${darkTransparencyVars}
}

/* Legacy .dark class support */
.dark {
${darkCssVars}${darkTransparencyVars}
}

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--color-background);
  --color-foreground: var(--color-text);
  --color-card: var(--color-background);
  --color-card-foreground: var(--color-text);
  --color-popover: var(--color-background);
  --color-popover-foreground: var(--color-text);
  --color-primary: var(--color-primary);
  --color-primary-foreground: var(--color-white);
  --color-secondary: var(--color-grey);
  --color-secondary-foreground: var(--color-text);
  --color-muted: var(--color-grey);
  --color-muted-foreground: var(--color-grey-dark);
  --color-accent: var(--color-grey);
  --color-accent-foreground: var(--color-text);
  --color-destructive: var(--color-danger);
  --color-border: var(--color-grey);
  --color-input: var(--color-grey);
  --color-ring: var(--color-primary);
  --color-chart-1: var(--color-primary);
  --color-chart-2: var(--color-success);
  --color-chart-3: var(--color-warning);
  --color-chart-4: var(--color-danger);
  --color-chart-5: var(--color-info);
  --color-sidebar: var(--color-background);
  --color-sidebar-foreground: var(--color-text);
  --color-sidebar-primary: var(--color-primary);
  --color-sidebar-primary-foreground: var(--color-white);
  --color-sidebar-accent: var(--color-grey);
  --color-sidebar-accent-foreground: var(--color-text);
  --color-sidebar-border: var(--color-grey);
  --color-sidebar-ring: var(--color-primary);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;

  return content;
}

/**
 * Main function to generate CSS theme file
 */
function main() {
  try {
    const cssPath = join(__dirname, '../../../index.css');
    const content = generateCssThemeContent();

    writeFileSync(cssPath, content, 'utf-8');

    console.log('✅ Generated CSS theme file successfully!');
    console.log(`📄 CSS themes: ${cssPath}`);
    console.log('🎨 CSS themes updated with latest palette');
    console.log('🔧 Added proper [data-theme="light"] and [data-theme="dark"] selectors');
  } catch (error) {
    console.error('❌ Error generating CSS theme file:', error);
    process.exit(1);
  }
}

// Run if this is the main module (ES module compatible)
main();

export { main as generateCssThemes };
