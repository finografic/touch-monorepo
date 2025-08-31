import { css } from '@emotion/react';
import { stylesPadBasic } from 'components/Pads/Pad/PadBasic.styles';

export const styles = css`
  .temperature-container {
    ${stylesPadBasic.container}
    gap: 1.5rem;
  }

  .input-container {
    ${stylesPadBasic.inputContainer}
  }

  .value-container {
    ${stylesPadBasic.valueContainer}
  }

  .control-button {
    ${stylesPadBasic.controlButton}
  }

  .unit {
    ${stylesPadBasic.unit}
  }
`;
