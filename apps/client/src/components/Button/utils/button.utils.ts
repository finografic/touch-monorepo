import { css } from '@emotion/react';

import type { ButtonColor, ButtonVariant } from '../Button.types';
import { BUTTON_BASE_COLORS } from './button.utils.config';
import type { ButtonColorVariants } from './button.utils.types';
import { button, colorsDirect as colors } from 'styles';
import { SHADE_VARIANTS, type ShadeVariant } from 'styles/colors/colors.types';

/**
 * Generate variant styles for a specific color
 */
export function getVariantStyles(variant: ButtonVariant, color: ButtonColor) {
  const baseColorKey = BUTTON_BASE_COLORS[color] as ButtonColorVariants;

  const baseName = extractBaseColorName(baseColorKey);
  const currentVariant = baseColorKey.replace(baseName, '') as ShadeVariant;

  // NEW: derive other color variants by shifting relative to the base
  const lightColor = colors[`${baseName}${shiftShadeVariant(currentVariant, -1)}` as keyof typeof colors];
  const defaultColor = colors[baseColorKey as keyof typeof colors]; // The base color itself
  const darkColor = colors[`${baseName}${shiftShadeVariant(currentVariant, +1)}` as keyof typeof colors];
  const transparentColor = colors[`${baseName}25` as keyof typeof colors];

  switch (variant) {
    case 'solid':
      return css`
        background-color: ${lightColor};
        color: ${color === 'default' || color === 'grey' ? colors.white : colors.white};
        border: ${button.border.width} solid ${lightColor};

        &:hover:not(:disabled):not([data-loading='true']) {
          background-color: ${defaultColor};
          border-color: ${defaultColor};
        }

        &:active:not(:disabled):not([data-loading='true']) {
          transform: translateY(1px);
        }
      `;

    case 'outline':
      return css`
        background-color: transparent;
        color: ${defaultColor};
        border: ${button.border.width} solid ${defaultColor};

        &:hover:not(:disabled):not([data-loading='true']) {
          background-color: ${transparentColor};
          border-color: ${darkColor};
          color: ${darkColor};
        }

        &:active:not(:disabled):not([data-loading='true']) {
          transform: translateY(1px);
        }
      `;

    case 'ghost':
      return css`
        background-color: transparent;
        color: ${defaultColor};
        border: ${button.border.width} solid transparent;

        &:hover:not(:disabled):not([data-loading='true']) {
          background-color: ${transparentColor};
          color: ${darkColor};
        }

        &:active:not(:disabled):not([data-loading='true']) {
          transform: translateY(1px);
        }
      `;

    case 'link':
      return css`
        background-color: transparent;
        color: ${defaultColor};
        border: ${button.border.width} solid transparent;
        padding: 0;
        height: auto;
        text-decoration: underline;
        text-underline-offset: 2px;

        &:hover:not(:disabled):not([data-loading='true']) {
          color: ${darkColor};
          text-decoration-thickness: 2px;
        }

        &:active:not(:disabled):not([data-loading='true']) {
          transform: none;
        }
      `;

    default:
      return css``;
  }
}

/**
 * Extract the base color name from a color key (e.g., 'primaryLight' -> 'primary')
 */
function extractBaseColorName(colorKey: string): string {
  // Remove all shade variant suffixes to get the base name
  // Order matters: check longer variants first to avoid partial matches
  const shadeVariants = [
    'XXDark',
    'XDark',
    'Dark',
    //  '',
    'Light',
    'XLight',
    'XXLight',
  ];
  for (const variant of shadeVariants) {
    if (colorKey.endsWith(variant)) {
      return colorKey.slice(0, -variant.length);
    }
  }
  return colorKey;
}

/**
 * Shift shade variant by a relative amount
 * @param currentVariant - Current shade variant (e.g., 'Light')
 * @param shift - Relative shift amount (+1 = one step lighter, -1 = one step darker)
 */
function shiftShadeVariant(currentVariant: ShadeVariant, shift: number): string {
  // Order from lightest to darkest
  // const shadeOrder: ShadeVariant[] = [...SHADE_VARIANTS].reverse();
  const shadeOrder = [
    'XXLight',
    'XLight',
    'Light',
    // '',
    'Dark',
    'XDark',
    'XXDark',
  ];
  const currentIndex = shadeOrder.indexOf(currentVariant);

  if (currentIndex === -1) {
    return currentVariant; // If not found, return as-is
  }

  const newIndex = currentIndex + shift;
  if (newIndex < 0 || newIndex >= shadeOrder.length) {
    return currentVariant; // Out of bounds, return current
  }

  return shadeOrder[newIndex];
}
