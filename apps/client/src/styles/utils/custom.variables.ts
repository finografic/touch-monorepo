import type { ColorBaseName, GeneratedPalette } from '../palette.types';
import type { ShadeKey } from '../colors.types';

// NOTE: THIS is the VERSION of the METHOD USED to GENERATE COLOR VARIABLES

/**
 * CSS variable name type for colors
 * Examples:
 * - '--color-primary'
 * - '--color-primary-light'
 * - '--color-danger-xdark'
 */
export type ColorVariable =
  | `--color-${ColorBaseName}`
  | `--color-${ColorBaseName}-${Exclude<ShadeKey, 'base'>}`;

export const generateColorVariables = ({ colors }: { colors: GeneratedPalette }) => {
  let cssVars = '';
  const processColor = (name: string, value: string) => {
    const cssName = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    cssVars += `  --color-${cssName}: ${value};\n`;
  };

  Object.entries(colors).forEach(([name, value]) => {
    if (typeof value === 'string') {
      processColor(name, value);
    }
  });

  return cssVars;
};

/**
 * Generate transparent color variants using modern CSS properties
 * Uses color-mix() with granular transparency levels (10, 20, 30...90)
 */
export const generateTransparentColorVariables = () => {
  const colorNames = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
    'text',
    'grey',
    'gray',
    'default',
  ];
  const shadeVariants = ['xxlight', 'xlight', 'light', 'dark', 'xdark', 'xxdark'];
  const transparencyLevels = [5, 10, 20, 25, 30, 33, 40, 50, 60, 66, 70, 75, 80, 90, 95];

  let cssVars = '\n  /* Base color transparency utilities using color-mix() */\n';

  // Base color transparency variants
  colorNames.forEach((colorName) => {
    transparencyLevels.forEach((level) => {
      cssVars += `  --color-${colorName}-${level}: color-mix(in srgb, var(--color-${colorName}) ${level}%, transparent);\n`;
    });
    cssVars += '\n'; // Add spacing between color groups
  });

  cssVars += '  /* Shade + transparency combination utilities */\n';

  // Combined shade + transparency variants
  colorNames.forEach((colorName) => {
    shadeVariants.forEach((shade) => {
      transparencyLevels.forEach((level) => {
        cssVars += `  --color-${colorName}-${shade}-${level}: color-mix(in srgb, var(--color-${colorName}-${shade}) ${level}%, transparent);\n`;
      });
    });
    cssVars += '\n'; // Add spacing between color groups
  });

  cssVars += `  /* Alternative: Using rgba() with CSS variables (better browser support) */
  /* Example: background-color: rgba(from var(--color-primary) r g b / 0.5); */
  /* This syntax extracts RGB values from CSS variables and applies alpha */
`;

  return cssVars;
};
