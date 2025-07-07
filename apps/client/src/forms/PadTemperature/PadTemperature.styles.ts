import { css } from '@emotion/react';
import { baseInputStyles } from 'styles/custom/inputs.styles';

export const styles = css`
  .temperature-container {
    ${baseInputStyles.container}
    gap: 1rem;
  }

  .input-container {
    ${baseInputStyles.inputContainer}
  }

  .value-container {
    ${baseInputStyles.valueContainer}
  }

  .control-button {
    ${baseInputStyles.controlButton}
  }

  .unit {
    ${baseInputStyles.unit}
  }
`;
