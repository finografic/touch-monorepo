import { css } from '@emotion/react';
import { baseInputStyles } from 'styles/custom/inputs.styles';

export const styles = css`
  .time-container {
    ${baseInputStyles.container}
    p {
      min-height: 7rem;
    }
  }

  .input-container {
    ${baseInputStyles.inputContainer}
  }

  .control-button {
    ${baseInputStyles.controlButton}
  }

  .value-container {
    ${baseInputStyles.valueContainer}
    flex-direction: column;
  }

  .unit {
    ${baseInputStyles.unit}
    font-size: 1.2rem;
    margin-left: 0;
    margin-top: 0.25rem;
  }

  .total-display {
    ${baseInputStyles.totalDisplay}
  }
`;
