import type { ColorBaseName } from '../palette.types';
import { colors } from '../colors.styles';

type ShadeKey = 'xxlight' | 'xlight' | 'light' | 'base' | 'dark' | 'xdark' | 'xxdark';

/**
 * Generates CSS class strings for color variants of a component
 * @param template - Function that returns CSS string for each color variant, including the class selector
 * @returns Single CSS string with all color variants
 */
export const generateClassColorVariants = (
  template: (colorKey: ColorBaseName, variant: Record<ShadeKey, string>) => string,
): string => {
  const baseColors: ColorBaseName[] = [
    'default',
    'info',
    'success',
    'warning',
    'danger',
    // 'white',
    // 'black'
  ];

  return baseColors
    .map((colorName) => {
      // Special handling for white and black
      if (colorName === 'white' || colorName === 'black') {
        const color = `var(--color-${colorName})`;
        const variant: Record<ShadeKey, string> = {
          xxlight: color,
          xlight: color,
          light: color,
          base: color,
          dark: color,
          xdark: color,
          xxdark: color,
        };
        return /* css */ `${template(colorName, variant)}`;
      }

      // For regular colors, create shade variants
      const effectiveColor = colorName === 'default' ? 'grey' : colorName;
      const variant: Record<ShadeKey, string> = {
        xxlight: `var(--color-${effectiveColor}-xxlight)`,
        xlight: `var(--color-${effectiveColor}-xlight)`,
        light: `var(--color-${effectiveColor}-light)`,
        base: `var(--color-${effectiveColor})`,
        dark: `var(--color-${effectiveColor}-dark)`,
        xdark: `var(--color-${effectiveColor}-xdark)`,
        xxdark: `var(--color-${effectiveColor}-xxdark)`,
      };

      return /* css */ `${template(colorName, variant)}`;
    })
    .join('\n');
};
