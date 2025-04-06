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
