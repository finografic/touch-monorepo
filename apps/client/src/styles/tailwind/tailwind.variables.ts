import twColors from 'tailwindcss/colors';
import type { TWColorName, TWColorShade, TWColorWithShades } from './tailwind.types';
import type { ShadeKey } from '../colors.types';
import { SHADES_CUSTOM_TO_TW } from './tailwind.constants';
import { camelCaseToKebab } from 'utils/string-case.utils';

/**
 * Core function to generate a CSS variable declaration
 * This is a DRY utility used by both Tailwind and custom color generators
 */
const generateCssVariable = (
  color: TWColorName | 'grey',
  shade: TWColorShade | ShadeKey | '',
  value: string,
): string => {
  const varName = shade ? `--color-${color}-${shade}` : `--color-${color}`;
  return `  ${varName}: ${value};\n`;
};

/**
 * Generate color variables with optional base alias
 */
const generateTailwindShadeVariables = (
  colorName: TWColorName,
  shade: TWColorShade | ShadeKey,
  value: string,
) => {
  let vars = generateCssVariable(colorName, shade, value);

  // Add base color alias without shade suffix if this is the base shade (500)
  if (shade === 500 || shade === 'base') {
    vars += generateCssVariable(colorName, '', `var(--color-${colorName}-${shade})`);
  }
  return vars;
};

/**
 * Generate both gray and grey variables for a given shade
 */
const generateGrayGreyVariables = (shade: TWColorShade | ShadeKey, value: string) => {
  let vars =
    generateCssVariable('gray', shade, value) +
    generateCssVariable('grey', shade, `var(--color-gray-${shade})`);

  // Add base color aliases without shade suffix if this is the base shade (500)
  if (shade === 500 || shade === 'base') {
    vars +=
      generateCssVariable('gray', '', `var(--color-gray-${shade})`) +
      generateCssVariable('grey', '', `var(--color-gray-${shade})`);
  }
  return vars;
};

/**
 * Example usage:
 * // Generate all Tailwind color variables with both numeric and custom shade names
 * generateCssColorVariablesTW();
 *
 * // Generate variables only for specific colors
 * generateCssColorVariablesTW(['blue', 'gray', 'amber']);
 */

/**
 * Generate CSS variables for Tailwind colors with both numerical and custom shade names
 */
export const generateCssColorVariablesTW = (colorNames?: TWColorName[]) => {
  let css = '';

  // Use provided colors or all colors from twColors (excluding special colors)
  const colorsToProcess =
    colorNames ||
    (Object.keys(twColors).filter(
      (key) => typeof twColors[key as keyof typeof twColors] === 'object',
    ) as TWColorName[]);

  // Generate Tailwind color variables
  css += '\n  /* Tailwind color variables */\n';

  for (const colorName of colorsToProcess) {
    const colorValue = twColors[colorName] as TWColorWithShades;
    if (typeof colorValue === 'object') {
      // Add ALL numeric shade variables available for this color
      Object.entries(colorValue).forEach(([numericShade, value]) => {
        const shade = Number.parseInt(numericShade) as TWColorShade;
        if (colorName === 'gray') {
          css += generateGrayGreyVariables(shade, value);
        } else {
          css += generateTailwindShadeVariables(colorName, shade, value);
        }
      });
      // Add custom shade name variables (as aliases)
      Object.entries(SHADES_CUSTOM_TO_TW).forEach(([customShade, numericShade]) => {
        if (colorValue[numericShade]) {
          // Convert camelCase to kebab-case for CSS variable names
          const kebabShade = camelCaseToKebab(customShade) as ShadeKey;

          if (colorName === 'gray') {
            css += generateGrayGreyVariables(kebabShade, `var(--color-gray-${numericShade})`);
          } else {
            css += generateTailwindShadeVariables(
              colorName,
              kebabShade,
              `var(--color-${colorName}-${numericShade})`,
            );
          }
        }
      });
    }
  }

  // Add special single-value colors (if no specific colors were requested)
  if (!colorNames) {
    (Object.entries(twColors) as [string, unknown][])
      .filter(([_, value]) => typeof value === 'string')
      .forEach(([name, value]) => {
        if (
          typeof value === 'string' && [
            ['inherit', 'current', 'transparent', 'black', 'white'].includes(name),
          ]
        ) {
          css += generateCssVariable(name as TWColorName, '', value);
        }
      });
  }

  return css;
};
