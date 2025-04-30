import type { ColorMapping, ShadeKey } from '../colors.types';
import type { ColorBaseName } from '../palette.types';
import { COLOR_MAPPING } from '../colors.styles';
import type { Root } from 'postcss';

type ColorMappingWithVariants = Extract<ColorMapping[keyof ColorMapping], { color: string; shade: number }>;

// Helper to get the CSS variable for a color
export function generateCssColorVariables(colorName: ColorBaseName, shade: ShadeKey): string {
  const mapping = COLOR_MAPPING[colorName as keyof typeof COLOR_MAPPING];
  if (!mapping || !('color' in mapping)) return '';

  const { color, shade: baseShade } = mapping as ColorMappingWithVariants;
  const shadeOffset = {
    xxlight: -3,
    xlight: -2,
    light: -1,
    base: 0,
    dark: 1,
    xdark: 2,
    xxdark: 3,
  }[shade];

  const shadeNum = Math.max(1, Math.min(12, baseShade + shadeOffset));
  return `var(--${color}-${shadeNum})`;
}

// Export a PostCSS plugin
export default () => {
  return {
    postcssPlugin: 'postcss-color-variables' as const,
    Once(root: Root) {
      let css = ':root {\n';
      css += '  color-scheme: light;\n\n';

      const baseColors: ColorBaseName[] = ['default', 'info', 'success', 'warning', 'danger'];
      const shades: ShadeKey[] = ['xxlight', 'xlight', 'light', 'base', 'dark', 'xdark', 'xxdark'];

      baseColors.forEach((colorName) => {
        const mapping = COLOR_MAPPING[colorName as keyof typeof COLOR_MAPPING];
        if (!mapping || !('color' in mapping)) return;

        // Generate variables for each shade
        shades.forEach((shade) => {
          const cssVar = generateCssColorVariables(colorName, shade);
          if (shade === 'base') {
            css += `  --color-${colorName}: ${cssVar};\n`;
          } else {
            css += `  --color-${colorName}-${shade}: ${cssVar};\n`;
          }
        });

        css += '\n';
      });

      css += '}\n';
      root.prepend({ text: css });
    },
  };
};
