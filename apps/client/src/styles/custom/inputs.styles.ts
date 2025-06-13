import { css } from '@emotion/react';
import { colors, layout } from 'styles';

/**
 * Shared input component styles for temperature, time, and other numeric inputs
 * Provides consistent styling patterns across input components
 */
export const baseInputStyles = {
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
    border: ${layout.borderWidth} solid ${colors.greyXXDark};
    color: ${colors.info};
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
    border: ${layout.borderWidth} solid ${colors.info};
    color: ${colors.info};

    span {
      padding-bottom: 0.15em;
    }

    &:hover:not(:disabled) {
      transform: scale(1.02);
      border-color: ${colors.info};
      color: ${colors.info};
      background-color: ${colors.info}11;
    }

    &:disabled {
      cursor: not-allowed;
      background-color: transparent;
      border-color: ${colors.greyXDark};
      color: ${colors.greyXDark};
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
    background-color: ${colors.info}11;
    border-radius: 4px;
    border: 1px solid ${colors.info}33;
  `,
};
