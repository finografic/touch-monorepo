import { css } from '@emotion/react';
import { button, colors, layout } from 'styles';
import { stylesButtonBase } from 'styles/project/buttons.styles';

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
  font-size: ${button.fontSize.base};
  font-weight: ${button.fontWeight.base};
  padding: ${button.padding.base};
  text-align: center;

  &.pad-menu {
    border-radius: 50%;
  }

  &.checked {
    color: ${colors.infoDark};
    border-color: ${colors.infoDark};
    background-color: ${colors.infoXLight33};
  }

  &:hover {
    color: ${colors.infoDark};
    border-color: ${colors.infoDark};
    background-color: ${colors.infoLight50};
    transform: scale(${button.transform.padHoverScale});
    &.checked {
      color: ${colors.infoDark};
      border-color: ${colors.infoDark};
      background-color: ${colors.infoLight50};
    }
  }

  /* Disabled styles inherited from stylesButtonBase */
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
      color: ${colors.textLight};
      text-align: center;
      max-width: 500px;
      margin: 0;
      padding: 0;
    }

    p {
      font-size: 1.2rem;
      font-weight: 400;
      color: ${colors.text};
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
    border: ${layout.borderWidth} solid ${colors.greyXXLight};
    color: ${colors.infoLight};
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
    transition: ${button.transition};
    background: transparent;
    padding: 0;
    line-height: 1;
    border: ${layout.borderWidth} solid ${colors.infoLight};
    color: ${colors.infoLight};

    span {
      padding-bottom: 0.15em;
    }

    &:hover:not(:disabled) {
      transform: scale(${button.transform.padBasicHoverScale});
      border-color: ${colors.info};
      color: ${colors.info};
      background-color: ${colors.infoXLight50};
    }

    &:disabled {
      cursor: not-allowed;
      background-color: transparent;
      border-color: ${colors.greyXXLight66};
      color: ${colors.greyXXLight66};
    }
  `,

  unit: css`
    font-size: 1.5rem;
    color: ${colors.info};
    margin-left: 0.5rem;
  `,

  totalDisplay: css`
    font-size: 1.2rem;
    font-weight: 500;
    color: ${colors.info};
    text-align: center;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: ${colors.infoLight};
    border-radius: 4px;
    border: 1px solid ${colors.infoDark};
  `,
};
