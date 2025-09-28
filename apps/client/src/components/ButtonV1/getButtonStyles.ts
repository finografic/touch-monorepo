import type { ColorName, HexColor, ShadeKey } from 'styles/colors.types';
import type { ButtonVariant } from './Button.types';
import { css } from '@emotion/react';
import Color from 'color';
import { colors } from 'styles/colors.styles';
import { IconBaseProps } from 'types/ui.types';

/**
 * Check if a color name is a custom palette color (e.g., 'primary', 'danger')
 */
function isCustomColor(color: string): color is ColorName {
  return color in colors;
}

/**
 * Parse a color variable to get its base name and shade
 * e.g., 'primaryDark' -> { base: 'primary', shade: 'dark' }
 */
function parseColorVariable(color: string) {
  const matches = color.match(/^([a-z]+)((?:[A-Z][a-z]+)*)$/);
  if (!matches) return null;

  const [_, base, shadeSuffix] = matches;
  const shade = shadeSuffix ? shadeSuffix.charAt(0).toLowerCase() + shadeSuffix.slice(1) : 'base';

  return { base, shade };
}

/**
 * Get the next darker shade in our scale
 */
function getDarkerShade(currentShade: string) {
  const shadeOrder: ShadeKey[] = ['xxlight', 'xlight', 'light', 'base', 'dark', 'xdark', 'xxdark'];
  const currentIndex = shadeOrder.indexOf(currentShade as any);
  return currentIndex < shadeOrder.length - 1 ? shadeOrder[currentIndex + 1] : 'xxdark';
}

/**
 * Get button colors using our color scale
 */
export function getButtonColors({
  color,
  colorHover,
}: {
  color: ColorName | HexColor;
  colorHover?: ColorName | HexColor;
}) {
  // Try to parse as a custom color variable first
  if (typeof color === 'string') {
    const parsed = parseColorVariable(color);
    if (parsed && isCustomColor(parsed.base)) {
      const currentShade = parsed.shade || 'base';
      const darkerShade = getDarkerShade(currentShade);

      // Get the actual color values
      const btnColor = colors[color];
      const btnColorHover = colorHover
        ? colors[colorHover]
        : colors[`${parsed.base}${darkerShade.charAt(0).toUpperCase()}${darkerShade.slice(1)}`];

      // Use Color.js to determine text color based on luminosity
      const colorObj = Color(btnColor);
      const btnColorContent = colorObj.luminosity() <= 0.7 ? '#ffffff' : colors.text;

      return {
        btnColor,
        btnColorContent,
        btnColorHover,
      };
    }
  }

  // Fallback to Color.js for non-system colors
  try {
    const btnColor = Color(color);
    const btnColorContent = btnColor.luminosity() <= 0.7 ? '#ffffff' : colors.text;
    const btnColorHover = colorHover ? Color(colorHover) : btnColor.darken(0.075);

    return {
      btnColor: btnColor.hex(),
      btnColorContent,
      btnColorHover: btnColorHover.hex(),
    };
  } catch (err) {
    // Ultimate fallback
    return {
      btnColor: colors.default,
      btnColorContent: '#ffffff',
      btnColorHover: colors.defaultDark,
    };
  }
}

// GENERATE SMART COLOR-SCHEME - CSS, DEPENDING ON variant PROP
export function getColorsByVariant({
  color,
  colorHover,
  colorLabel,
  variant,
}: {
  color: ColorName | HexColor;
  colorHover?: ColorName | HexColor;
  colorLabel?: ColorName | HexColor;
  variant: ButtonVariant;
}) {
  const { btnColor, btnColorContent, btnColorHover } = getButtonColors({ color, colorHover });

  if (variant === 'outline') {
    return css`
      -webkit-text-fill-color: ${btnColor};
      color: ${btnColor};
      background-color: transparent;
      border-color: ${btnColor}!important;

      &:not([disabled]):hover,
      &:not([disabled]).hover {
        color: ${btnColorHover};
        background-color: color-mix(in srgb, ${btnColorHover} 10%, transparent);
        border-color: ${btnColorHover}!important;
      }
    `;
  }

  if (variant === 'clear') {
    return css`
      -webkit-text-fill-color: ${btnColor};
      color: ${btnColor};
      background-color: transparent;
      border-color: transparent;

      &:not([disabled]):hover,
      &:not([disabled]).hover {
        color: ${btnColorHover};
        background-color: color-mix(in srgb, ${btnColorHover} 10%, transparent);
        border-color: transparent;
      }
    `;
  }

  if (variant === 'icon') {
    return css`
      -webkit-text-fill-color: ${btnColor};
      color: ${btnColor};
      background-color: transparent;
      border-color: transparent;

      &:not([disabled]):hover,
      &:not([disabled]).hover {
        color: ${btnColorHover};
        background-color: transparent !important;
        border-color: transparent;
      }
    `;
  }

  // Default solid variant
  return css`
    & {
      -webkit-text-fill-color: ${btnColorContent};
      color: ${btnColorContent};
      background-color: ${btnColor};
      border-color: ${btnColor};

      &:not([disabled]):hover,
      &:not([disabled]).hover {
        color: ${btnColorContent};
        background-color: ${btnColorHover};
        border-color: ${btnColorHover};
      }
    }
    span {
      -webkit-text-fill-color: ${btnColorContent};
      color: ${btnColorContent};
      &:not([disabled]):hover,
      &:not([disabled]).hover {
        color: ${btnColorContent};
      }
    }
  `;
}

export function getStylesByIconScale({ iconScale }: { iconScale: number | string }) {
  return css`
    transform: scale(1);
    svg {
      transform: scale(${iconScale});
    }
    svg + span {
      margin-left: calc(0.6em * ${iconScale});
    }
    span + svg {
      margin-left: calc(0.6em * ${iconScale});
    }
  `;
}
