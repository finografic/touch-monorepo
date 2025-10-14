import { css } from '@emotion/react';
import { colors } from 'styles';
import { UI_COLOR_NAMES } from 'styles/colors/colors.types';

/**
 * Generate CSS class color variants for any component type
 * This function generates CSS classes for all color variants of a given component
 *
 * @param componentType - The component type name (e.g., 'button', 'alert', 'card')
 * @param variantTemplate - Template function that defines styles for each color variant
 * @returns CSS-in-JS emotion styles for all color variants
 *
 * @example
 * // Generate button color variants
 * const buttonColorVariants = generateComponentColorVariants('button', (colorName, variants) => css`
 *   &.button-${colorName} {
 *     background-color: ${variants.dark};
 *     border-color: ${variants.xdark};
 *     color: ${colors.white};
 *   }
 * `);
 *
 * @example
 * // Generate alert color variants
 * const alertColorVariants = generateComponentColorVariants('alert', (colorName, variants) => css`
 *   &.alert-${colorName} {
 *     background-color: ${variants.light};
 *     border-color: ${variants.dark};
 *     color: ${variants.dark};
 *   }
 * `);
 */
export function generateComponentColorVariants(
  componentType: string,
  variantTemplate: (
    colorName: string,
    variants: ColorVariants,
    componentType: string,
  ) => ReturnType<typeof css>,
): ReturnType<typeof css> {
  // Use the UI color names constant for component variants
  const colorNames = UI_COLOR_NAMES;

  // Generate CSS for each color variant
  const variantStyles = colorNames.map((colorName) => {
    // Create variant object with color system references
    const variants: ColorVariants = {
      base: colors[colorName],
      light: colors[`${colorName}Light` as keyof typeof colors] || colors[colorName],
      xlight: colors[`${colorName}XLight` as keyof typeof colors] || colors[colorName],
      dark: colors[`${colorName}Dark` as keyof typeof colors] || colors[colorName],
      xdark: colors[`${colorName}XDark` as keyof typeof colors] || colors[colorName],
      xxdark: colors[`${colorName}XXDark` as keyof typeof colors] || colors[colorName],
    };

    // Generate CSS using the template function with componentType
    return variantTemplate(colorName, variants, componentType);
  });

  // Combine all variant styles into a single CSS-in-JS object
  return css`
    ${variantStyles}
  `;
}

/**
 * Type definition for color variants passed to template function
 */
export interface ColorVariants {
  base: string;
  light: string;
  xlight: string;
  dark: string;
  xdark: string;
  xxdark: string;
}
