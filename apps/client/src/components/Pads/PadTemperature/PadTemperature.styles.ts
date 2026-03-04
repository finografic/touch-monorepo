import { css } from '@emotion/react';
import { stylesPad, stylesPadBasic } from 'components/Pads/Pad/PadBasic.styles';

import { button, colors, layout } from '@workspace/design-system/tokens';
import { stylesButtonBase } from 'components/Button/button-base.styles';

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

  .temperature-container {
    position: relative;
    padding-top: 4rem; /* More room for label */
    margin-top: 1rem; /* Space from top */

    label {
      position: absolute;
      top: 0.5rem; /* Slight offset from top */
      left: 50%;
      transform: translateX(-50%);
      width: 220px;
      text-align: center;
      color: ${colors.textLight};
      font-size: 1.2rem;
      font-weight: ${button.fontWeight.large};
      letter-spacing: 0.02em;
    }
  }

  /* Value display */
  .value-container {
    ${stylesPadBasic.valueContainer}
    font-size: 2.5rem;
    font-weight: ${button.fontWeight.large};
    color: ${colors.infoLight};
    border-color: ${colors.infoLighter};
    margin: 1rem 0;
    min-width: 200px;

    &:focus-within {
      border-color: ${colors.infoLight};
      background-color: ${colors.infoXXLight};
    }
  }

  /* Control buttons (+/-) */
  .control-button {
    ${stylesPadBasic.controlButton}

    ${stylesButtonBase}
    ${stylesPad}

    height: 56px;

    &:disabled {
      cursor: not-allowed;
      color: ${colors.defaultXXLight}!important;
      border-color: ${colors.defaultXLight};
    }

    &:hover:not(:disabled) {
      background-color: ${colors.infoLighter};
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
