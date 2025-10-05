import { css } from '@emotion/react';
import { button, colors } from 'styles';
import type { ButtonColor, ButtonSize, ButtonVariant } from './Button.types';

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
 * Generate variant styles for a specific color
 */
export function getVariantStyles(variant: ButtonVariant, color: ButtonColor) {
  const baseColor = colors[color];
  const defaultColor = colors[`${color}XLight` as keyof typeof colors];
  const lightColor = colors[`${color}Light` as keyof typeof colors];
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
