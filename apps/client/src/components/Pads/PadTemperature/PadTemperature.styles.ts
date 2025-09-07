import { css } from '@emotion/react';
import { button, colors, layout } from 'styles';
import { stylesPad, stylesPadBasic } from 'components/Pads/Pad/PadBasic.styles';
import { stylesButtonBase } from 'styles/project/buttons.styles';

/**
 * Temperature pad styles extending base pad styles
 * Uses a hybrid approach:
 * - Nested CSS for component-specific styles and states
 * - Composition from stylesPadBasic for reusable parts
 */
export const styles = css`
  /* Extend base pad styles */
  padding: ${button.padding.base};
  text-align: center;

  /* Temperature-specific layout */

  gap: 1.5rem;
  padding: 1rem;

  /* Specific to temperature inputs */
  display: grid;
  /* grid-template-columns: 1fr 1fr; */
  grid-gap: 2rem;

  label {
    margin-bottom: 2rem !important;
    padding-bottom: 2rem !important;
    transform: translateY(-2rem) !important;
    /* display: none; */
  }

  /* Value display */
  .value-container {
    ${stylesPadBasic.valueContainer}
    font-size: 2.5rem;
    font-weight: ${button.fontWeight.large};
    color: ${colors.info};

    &:focus-within {
      border-color: ${colors.infoLight};
      background-color: ${colors.infoXLight25};
    }
  }

  /* Control buttons (+/-) */
  .control-button {
    ${stylesPadBasic.controlButton}

    ${stylesButtonBase}
    ${stylesPad}

    height: 56px;

    &:hover:not(:disabled) {
      background-color: ${colors.infoLight33};
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  }

  /* Temperature unit display */
  .unit {
    ${stylesPadBasic.unit}
    color: ${colors.infoLight};
    font-weight: ${button.fontWeight.large};
  }
`;
