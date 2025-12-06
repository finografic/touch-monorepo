import { css } from '@emotion/react';
import { colors } from 'styles/colors/colors-direct';
import { UI_COLOR_NAMES } from 'styles/colors/colors.types';

/**
 * Generate CSS class color variants for UI components
 * This function generates CSS classes for all color variants of a given component
 *
 * @param componentType - The component type name (e.g., 'button', 'alert', 'card')
 * @param variantTemplate - Template function that defines styles for each color variant
 * @returns CSS-in-JS emotion styles for all color variants
 *
 * @example
 * // Generate button color variants
 * const buttonColorVariants = generateUiColorVariants('button', (colorName, variants) => css`
 *   &.button-${colorName} {
 *     background-color: ${variants.dark};
 *     border-color: ${variants.xdark};
 *     color: ${colors.white};
 *   }
 * `);
 */
export function generateUiColorVariants(
  componentType: string,
  variantTemplate: (
    colorName: string,
    variants: UiColorVariants,
    componentType: string,
  ) => ReturnType<typeof css>,
): ReturnType<typeof css> {
  const variantStyles = UI_COLOR_NAMES.map((colorName) => {
    const variants: UiColorVariants = {
      xxlight: colors[`${colorName}XXLight` as keyof typeof colors] || colors[colorName],
      xlight: colors[`${colorName}XLight` as keyof typeof colors] || colors[colorName],
      light: colors[`${colorName}Light` as keyof typeof colors] || colors[colorName],
      base: colors[colorName],
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
 * Type definition for UI color variants passed to template function
 */
export interface UiColorVariants {
  xxlight: string;
  xlight: string;
  light: string;
  base: string;
  dark: string;
  xdark: string;
  xxdark: string;
}
