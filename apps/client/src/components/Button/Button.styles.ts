import { css } from '@emotion/react';

import { button, colors } from 'styles';

/**
 * Base button styles - common to all variants
 */
export const baseButtonStyles = css`
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;

  cursor: pointer;
  user-select: none;

  transition:
    background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);

  &,
  & span {
    font-weight: 700;
  }

  .button-text {
    font-weight: 700;
    svg {
      transform: scale(1.25);
      font-weight: 700;
    }
  }

  .button-icon {
    font-weight: 700;
    transform: scale(1.25);
  }

  &:focus-visible {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.66;
    filter: grayscale(0.75);
    /* filter: brightness(0.5) !important; */
    /* filter: contrast(0.5) !important; */
    /* filter: invert(0.5) !important; */
    /* filter: saturate(0.5) !important; */
    /* filter: sepia(0.5) !important; */
    /* filter: hue-rotate(0.5) !important; */
    /* filter: brightness(0.5) !important; */
    /* filter: contrast(0.5) !important; */
    /* filter: invert(0.5) !important; */
    /* filter: saturate(0.33) !important; */
    /* filter: sepia(0.5) !important; */
    /* filter: hue-rotate(0.5) !important; */
    /* opacity: 0.2 !important; */
  }

  &[data-loading='true'] {
    cursor: not-allowed;
    position: relative;

    & > *:not([data-loading-spinner]) {
      opacity: 0;
    }
  }

  &:active:not(:disabled):not([data-loading='true']) {
    transform: translateY(1px);
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
    padding: 0 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 0.375rem;
  `,
  md: css`
    height: 3rem;
    padding: 0 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 0.5rem;
  `,
  lg: css`
    height: 4rem;
    padding: 0 1.5rem;
    font-size: 2rem;
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
