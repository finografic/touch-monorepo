import { css } from '@emotion/react';

import type { ButtonColor, ButtonVariant } from '../Button.types';
import { BUTTON_BASE_COLORS } from './button.utils.config';
import type { ButtonColorVariants } from './button.utils.types';
import { button, colors } from '@workspace/design-system/tokens';

type ShadeVariant = 'XXLight' | 'XLight' | 'Light' | 'Dark' | 'XDark' | 'XXDark';

// If you need a custom opacity, you could create a helper:
function withOpacity(color: string, opacity: number): string {
  // If using OKLCH (which your system supports):
  // You'd need to parse and modify the OKLCH string
  // Or use CSS color-mix() function
  return `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`;
}

/**
 * Generate variant styles for a specific color
 */
export function getVariantStyles(variant: ButtonVariant = 'solid', color: ButtonColor = 'default') {
  const baseColorKey = BUTTON_BASE_COLORS[color] as ButtonColorVariants;

  const baseName = extractBaseColorName(baseColorKey);
  const currentVariant = baseColorKey.replace(baseName, '') as ShadeVariant;

  // NEW: derive other color variants by shifting relative to the base
  const lightColor = colors[`${baseName}${shiftShadeVariant(currentVariant, -1)}` as keyof typeof colors];
  const defaultColor = colors[baseColorKey as keyof typeof colors]; // The base color itself
  const darkColor = colors[`${baseName}${shiftShadeVariant(currentVariant, +1)}` as keyof typeof colors];
  const xDarkColor = colors[`${baseName}${shiftShadeVariant(currentVariant, +2)}` as keyof typeof colors];
  const transparentColor15 = withOpacity(lightColor, 0.15);
  const transparentColor20 = withOpacity(lightColor, 0.2);
  const transparentColor40 = withOpacity(lightColor, 0.4);

  // NEW: SPECIAL COMBINATION CASE

  if (color === 'grey' && variant === 'solid') {
    return css`
      background-color: ${lightColor};
      color: ${colors.white};
      border: ${button.border.width} solid ${lightColor};

      &:disabled,
      &:disabled svg,
      &:disabled .button-text {
        cursor: not-allowed;
      }

      &:disabled {
        opacity: 0.66;
        svg {
          opacity: 1 !important;
        }
      }

      &:hover:not(:disabled):not([data-loading='true']) {
        background-color: ${colors.infoLight};
        border-color: ${colors.infoLight};
      }
    `;
  }

  switch (variant) {
    case 'solid':
      return css`
        background-color: ${defaultColor};
        color: ${color === 'default' || color === 'grey' ? colors.white : colors.white};
        border: ${button.border.width} solid ${defaultColor};

        &:disabled {
          opacity: 0.66 !important;
          filter: saturate(0.4);
          background-color: transparent;
          background-color: ${transparentColor40}!important;
          border-color: ${lightColor} !important;
          color: ${darkColor} !important;
          svg {
            opacity: 1 !important;
            color: ${lightColor} !important;
            cursor: not-allowed !important;
          }
        }
        &:hover:not(:disabled):not([data-loading='true']) {
          background-color: ${darkColor};
          border-color: ${darkColor};
        }
      `;

    case 'soft':
      return css`
        background-color: ${transparentColor20};
        color: ${darkColor};
        border: ${button.border.width} solid ${defaultColor};

        &:hover:not(:disabled):not([data-loading='true']) {
          background-color: ${transparentColor40};
          color: ${darkColor};
          border: ${button.border.width} solid ${xDarkColor};
        }

        .button-text svg {
          display: block;

          color: ${darkColor};
          stroke: ${darkColor};
          display: none;
          transform: scale(2) !important;
        }

        &:disabled {
          opacity: 0.8 !important;
          filter: saturate(0.4);
          background-color: transparent;
          /* background-color: ${transparentColor40}!important;
          border-color: ${lightColor} !important;
          color: ${darkColor} !important; */
          /* svg {
            opacity: 1 !important;
            color: ${lightColor} !important;
            cursor: not-allowed !important;
          } */
        }
      `;

    case 'outline':
      return css`
        background-color: transparent;
        color: ${defaultColor};
        /* color: ${lightColor}; */

        border: ${button.border.width} solid ${defaultColor};
        /* border: ${button.border.width} solid ${lightColor}; */

        &:disabled {
          /* opacity: 0.66; */
          svg {
            opacity: 1 !important;
          }
        }

        &:hover:not(:disabled):not([data-loading='true']) {
          background-color: ${transparentColor20};
          border-color: ${defaultColor};
          color: ${defaultColor};
          filter: brightness(0.66);
          /* filter: brightness(0.33); */
        }

        &:focus:not(:disabled):not([data-loading='true']) {
          border-color: ${defaultColor};
        }
      `;

    case 'ghost':
      return css`
        background-color: transparent;
        color: ${defaultColor};
        border: ${button.border.width} solid transparent;

        &:hover:not(:disabled):not([data-loading='true']) {
          background-color: ${transparentColor15};
          color: ${darkColor};
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
    if (colorKey && colorKey.endsWith(variant)) {
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
