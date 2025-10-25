import { css } from '@emotion/react';

import type { ButtonColor, ButtonSize, ButtonVariant } from './Button.types';
import { button, colors, generateUiColorVariants } from 'styles';
import type { ShadeVariant } from 'styles/colors/colors.types';
import { buttonColorVariants } from 'styles/project/buttons.styles';

/**
 * Base color mapping for each ButtonColor
 * Each value is the color key (e.g., 'primaryLight') that will be used as the base for variant calculations
 * Variants will be derived by shifting shades relative to this base
 */
export const BUTTON_BASE_COLORS: Record<ButtonColor, ButtonColor | `${ButtonColor}${ShadeVariant}`> = {
  primary: 'primaryLight',
  secondary: 'secondaryLight',
  success: 'successLight',
  warning: 'warningLight',
  danger: 'dangerLight',
  info: 'infoLight',
  default: 'greyXLight',
  grey: 'greyXLight',
};

const TEST = generateUiColorVariants(
  'button',
  (colorName, variants, componentType) => css`
    &.${componentType}-${colorName} {
      background-color: ${variants.dark};
      border-color: ${variants.xdark};
      color: ${colors.white};
    }
  `,
);

/**
 * Base button styles - common to all variants
 */
export const baseButtonStyles = css`
  /* Reset and base styles */
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  /* Typography */
  font-family: inherit;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;

  /* Interaction */
  cursor: pointer;
  user-select: none;

  /* Transitions */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  /* Focus styles */
  &:focus-visible {
    /* outline: 2px solid ${colors.primary}; */
    /* outline-offset: 2px; */
    outline: none;
  }

  /* Disabled styles */
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Loading styles */
  &[data-loading='true'] {
    cursor: not-allowed;
    position: relative;

    /* Hide content when loading */
    & > *:not([data-loading-spinner]) {
      opacity: 0;
    }
  }

  border-width: ${button.border.width};
  border-style: ${button.border.style};
`;

/**
 * Size variants
 */
export const sizeStyles = {
  sm: css`
    height: 2rem;
    padding: 0 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 0.375rem;
  `,
  md: css`
    height: 3rem;
    padding: 0 1rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 0.5rem;
  `,
  lg: css`
    height: 4rem;
    padding: 0 1.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    border-radius: 0.5rem;
  `,
};

/**
 * Full width styles
 */
export const fullWidthStyles = css`
  width: 100%;
`;

/**
 * Extract the base color name from a color key (e.g., 'primaryLight' -> 'primary')
 */
function extractBaseColorName(colorKey: string): string {
  // Remove all shade variant suffixes to get the base name
  // Order matters: check longer variants first to avoid partial matches
  const shadeVariants = ['XXDark', 'XDark', 'Dark', 'XXLight', 'XLight', 'Light'];
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
function shiftShadeVariant(currentVariant: string, shift: number): string {
  // Order from lightest to darkest
  const shadeOrder = ['XXLight', 'XLight', 'Light', 'Dark', 'XDark', 'XXDark'];
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

/**
 * Generate variant styles for a specific color
 */
export function getVariantStyles(variant: ButtonVariant, color: ButtonColor) {
  // Get the base color key from our mapping (e.g., 'primaryLight')
  const baseColorKey = BUTTON_BASE_COLORS[color];

  // Extract the base name and current shade variant
  const baseName = extractBaseColorName(baseColorKey);
  const currentVariant = baseColorKey.replace(baseName, '');

  // Derive other color variants by shifting relative to the base
  // Base has suffix Light (index 2), so:
  // - lightColor needs XXLight (index 0, shift -2 from base for lighter)
  // - darkColor needs Dark (index 3, shift +1 from base for darker)
  // - transparentColor uses base with 25% opacity
  const lightColor = colors[`${baseName}${shiftShadeVariant(currentVariant, -2)}` as keyof typeof colors];
  const defaultColor = colors[baseColorKey as keyof typeof colors]; // The base color itself
  const darkColor = colors[`${baseName}${shiftShadeVariant(currentVariant, +1)}` as keyof typeof colors];
  const transparentColor = colors[`${baseName}25` as keyof typeof colors];

  switch (variant) {
    case 'solid':
      return css`
        background-color: ${defaultColor};
        color: ${color === 'default' || color === 'grey' ? colors.white : colors.white};
        border: ${button.border.width} solid ${defaultColor};

        &:hover:not(:disabled):not([data-loading='true']) {
          background-color: ${darkColor};
          border-color: ${darkColor};
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
 * Loading spinner styles
 */
export const loadingSpinnerStyles = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @keyframes spin {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  animation: spin 1s linear infinite;
`;
