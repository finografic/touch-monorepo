import { css } from '@emotion/react';
import { colors, layout } from 'styles';
import { stylesButtonBase } from 'styles/custom/buttons.styles';

/*
TRANSPARENT COLOR EXAMPLES:
You can now use these CSS variables for transparency:

// Basic transparency levels
background-color: var(--color-primary-10);   // 10% opacity
background-color: var(--color-primary-25);   // 25% opacity
background-color: var(--color-primary-50);   // 50% opacity
background-color: var(--color-primary-75);   // 75% opacity

// Available for all colors: primary, secondary, success, warning, danger, info, text, grey
// Examples:
border-color: var(--color-danger-25);
background-color: var(--color-success-50);
color: var(--color-text-75);

// These automatically work with your theme toggle!
// In light theme: --color-primary-50 will be 50% of the light theme primary color
// In dark theme: --color-primary-50 will be 50% of the dark theme primary color
*/

// Common dimensions for different button types
export const padProps = {
  pad: {
    width: '110px',
    height: '110px',
  },
  padLG: {
    width: '150px',
    height: '150px',
  },
  special: {
    width: '150px',
    height: '239px',
  },
};

// Styles specific to pads
export const stylesPad = css`
  ${stylesButtonBase}
  font-size: 1.5rem;
  padding: 1rem;
  text-align: center;
  
  /* Touch-friendly borders */
  border-width: 2px !important;
  border-style: solid;

  &.pad-menu {
    border-radius: 50%;
  }

  &.checked {
    border-color: var(--color-info-dark);
    background-color: var(--color-info-light);
    color: var(--color-info-dark);
  }

  &:disabled,
  &.disabled,
  &[data-disabled='true'] {
    border-color: var(--color-grey-light);
    color: var(--color-grey-light);
    background-color: transparent;

    &:hover {
      transform: none;
    }
  }
`;

/**
 * Shared input component styles for temperature, time, and other numeric inputs
 * Provides consistent styling patterns across input components
 */
export const stylesPadBasic = {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    min-width: 340px;
    margin: 0 auto;

    label {
      font-size: 1.5rem;
      font-weight: 500;
      color: var(--color-text-light);
      text-align: center;
      max-width: 500px;
      margin: 0;
      padding: 0;
    }

    p {
      font-size: 1.2rem;
      font-weight: 400;
      color: var(--color-text);
      text-align: center;
      max-width: 320px;
      margin: 0;
    }
  `,

  inputContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    width: 180px;
    margin-bottom: 10%;
  `,

  valueContainer: css`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    padding: 1rem 2rem;
    font-size: 2rem;
    background: transparent;
    width: 100%;
    border: ${layout.borderWidth} solid var(--color-grey-xxdark);
    color: var(--color-info);
  `,

  controlButton: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 64px;
    border-radius: 8px;
    font-size: 2.5rem;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s;
    background: transparent;
    padding: 0;
    line-height: 1;
    border: ${layout.borderWidth} solid var(--color-info);
    color: var(--color-info);

    span {
      padding-bottom: 0.15em;
    }

    &:hover:not(:disabled) {
      transform: scale(1.02);
      border-color: var(--color-info);
      color: var(--color-info);
      background-color: var(--color-info-light);
    }

    &:disabled {
      cursor: not-allowed;
      background-color: transparent;
      border-color: var(--color-grey-xdark);
      color: var(--color-grey-xdark);
    }
  `,

  unit: css`
    font-size: 1.5rem;
    color: var(--color-info);
    margin-left: 0.5rem;
  `,

  totalDisplay: css`
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--color-info);
    text-align: center;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: var(--color-info-light);
    border-radius: 4px;
    border: 1px solid var(--color-info-dark);
  `,
};
