import { colors } from 'styles';
import type { ColorBaseName } from 'styles/colors/palette.types';

/**
 * Generate CSS class color variants for legacy Button component
 * This function takes a template function and generates CSS for all color variants
 */
export function generateClassColorVariants(
  templateFn: (colorName: string, variants: ColorVariants) => string,
): string {
  // Define the available color names that should have variants
  const colorNames: ColorBaseName[] = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
    'default',
    'grey',
  ];

  let css = '';

  colorNames.forEach((colorName) => {
    // Create variant object with color system references
    const variants: ColorVariants = {
      base: colors[colorName],
      light: colors[`${colorName}Light` as keyof typeof colors] || colors[colorName],
      xlight: colors[`${colorName}XLight` as keyof typeof colors] || colors[colorName],
      dark: colors[`${colorName}Dark` as keyof typeof colors] || colors[colorName],
      xdark: colors[`${colorName}XDark` as keyof typeof colors] || colors[colorName],
      xxdark: colors[`${colorName}XXDark` as keyof typeof colors] || colors[colorName],
    };

    // Generate CSS using the template function
    css += templateFn(colorName, variants);
  });

  return css;
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
