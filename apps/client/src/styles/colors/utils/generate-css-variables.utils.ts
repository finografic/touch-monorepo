import type { ColorBaseName } from '../colors.types';
import type { ColorPalette } from '../palette.types';
import {
  CSS_BASE_COLORS,
  CSS_SHADE_VARIANTS,
  CSS_TRANSPARENCY_LEVELS,
  CSS_TRANSPARENCY_ONLY_COLORS,
} from '../constants/css-vars.constants';

// NOTE: THIS is the VERSION of the METHOD USED to GENERATE COLOR VARIABLES

export const generateCssColorVariables = ({ colors }: { colors: ColorPalette }) => {
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
export const generateCssColorVariablesTransparency = () => {
  const colorNames = CSS_BASE_COLORS;
  const shadeVariants = CSS_SHADE_VARIANTS;
  const transparencyLevels = CSS_TRANSPARENCY_LEVELS;
  const transparencyOnlyColors = CSS_TRANSPARENCY_ONLY_COLORS;

  let cssVars = '\n  /* Base color transparency utilities using color-mix() */\n';

  // Base color transparency variants (for all colors including black/white)
  colorNames.forEach((colorName) => {
    transparencyLevels.forEach((level) => {
      cssVars += `  --color-${colorName}-${level}: color-mix(in srgb, var(--color-${colorName}) ${level}%, transparent);\n`;
    });
    cssVars += '\n'; // Add spacing between color groups
  });

  cssVars += '  /* Shade + transparency combination utilities */\n';

  // Combined shade + transparency variants (only for colors that have shade variants)
  colorNames.forEach((colorName) => {
    // Skip shade variants for transparency-only colors (black, white)
    if (!transparencyOnlyColors.includes(colorName as any)) {
      shadeVariants.forEach((shade) => {
        transparencyLevels.forEach((level) => {
          cssVars += `  --color-${colorName}-${shade}-${level}: color-mix(in srgb, var(--color-${colorName}-${shade}) ${level}%, transparent);\n`;
        });
      });
      cssVars += '\n'; // Add spacing between color groups
    }
  });

  cssVars += `  /* Alternative: Using rgba() with CSS variables (better browser support) */
  /* Example: background-color: rgba(from var(--color-primary) r g b / 0.5); */
  /* This syntax extracts RGB values from CSS variables and applies alpha */
`;

  return cssVars;
};
