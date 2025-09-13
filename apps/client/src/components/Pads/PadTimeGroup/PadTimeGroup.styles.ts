import { css } from '@emotion/react';
import { stylesPadBasic } from 'components/Pads/Pad/PadBasic.styles';
import { colors } from 'styles';

export const styles = css`
  .time-group-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem;
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
    min-width: 200px;

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
    ${stylesPadBasic.inputContainer}
    margin-bottom: 0; /* Remove bottom margin */
    gap: 0.5rem;
  }

  .control-button {
    ${stylesPadBasic.controlButton}
  }

  .value-container {
    ${stylesPadBasic.valueContainer}
    flex-direction: row; /* Horizontal layout for value and unit */
    gap: 0.5rem;
    font-size: 2.5rem;
    color: ${colors.infoLight};
    border-color: ${colors.infoLight40};
    margin: 0.66rem 0;
    /* min-width: 200px; */
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
    ${stylesPadBasic.totalDisplay}
    margin-top: 1.5rem;
  }
`;
