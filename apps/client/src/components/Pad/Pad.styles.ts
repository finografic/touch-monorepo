import { css } from '@emotion/react';
import { colors } from 'styles';
import { stylesPad } from 'styles/custom/buttons.styles';

export const padStyles = css`
  &.pad {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    border-radius: 8px;
    font-size: 1.5rem;
    padding: 1rem;
    text-align: center;

    ${stylesPad}

    /* ======================================== */

    /* Specific styles for radio/checkbox types */
    &.radio {
      /* Add any radio-specific styles */
    }

    &.checkbox {
      &.checked {
        border-color: ${colors.success};
        background-color: rgba(1, 250, 20, 0.1);
      }
    }

    &.pad-rect {
      border-radius: 8px;
      width: 310px;
    }
  }
`;
