import { css } from '@emotion/react';
import type { ButtonColor, ButtonVariant } from 'components/Button/Button.types';

import { button, colors } from 'styles';

/**
 * Generate variant styles for a specific color
 */
export function getVariantStyles(variant: ButtonVariant, color: ButtonColor) {
  const baseColor = colors[color];
  const defaultColor = colors[`${color}Light` as keyof typeof colors];
  const lightColor = colors[`${color}XLight` as keyof typeof colors];
  const darkColor = colors[`${color}Dark` as keyof typeof colors];
  const transparentColor = colors[`${color}25` as keyof typeof colors];

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
        color: ${baseColor};
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
        color: ${baseColor};
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
