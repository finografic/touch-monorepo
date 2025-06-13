import { css } from '@emotion/react';
import { baseInputStyles } from 'styles/custom/inputs.styles';
import { colors } from 'styles';

export const styles = css`
  .time-group-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    margin: 0 auto;
  }

  .description {
    font-size: 1.2rem;
    font-weight: 400;
    color: ${colors.text};
    text-align: center;
    max-width: 500px;
    margin: 0;
  }

  .inputs-container {
    display: flex;
    gap: 1rem; /* Much closer spacing between inputs */
    align-items: flex-start;
  }

  .time-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    min-width: 180px;

    label {
      font-size: 1.5rem;
      font-weight: 500;
      color: ${colors.textLight};
      text-align: center;
      margin: 0;
    }

    p {
      font-size: 1rem;
      font-weight: 400;
      color: ${colors.text};
      text-align: center;
      max-width: 200px;
      margin: 0;
      min-height: auto; /* Override the min-height from base styles */
    }
  }

  .input-container {
    ${baseInputStyles.inputContainer}
    margin-bottom: 0; /* Remove bottom margin */
  }

  .control-button {
    ${baseInputStyles.controlButton}
  }

  .value-container {
    ${baseInputStyles.valueContainer}
    flex-direction: row; /* Horizontal layout for value and unit */
    gap: 0.5rem;
  }

  .value {
    font-size: 2rem;
    font-weight: 500;
  }

  .unit {
    font-size: 1.2rem;
    color: ${colors.info};
    margin: 0; /* Reset margins for horizontal layout */
  }

  .total-display {
    ${baseInputStyles.totalDisplay}
    margin-top: 1.5rem;
  }
`;
