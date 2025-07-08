import { css } from '@emotion/react';
import { colors } from 'styles';
import { padProps, stylesPad } from 'components/Pads/Pad/PadBasic.styles';

export const padStyles = css`
  &.pad {
    ${stylesPad}

    min-height: 80px;
    border-radius: 8px;

    /* ======================================== */

    /* Specific styles for radio/checkbox types */
    &.radio {
      /* Add any radio-specific styles */
    }

    &.checkbox {
      &.checked {
        border-color: ${colors.success};
        background-color: rgba(1, 250, 20, 0.1);
        border-color: ${colors.info};
        background-color: rgba(0, 191, 255, 0.1);
      }
    }

    &.pad-circle {
      width: ${padProps.pad.width};
      height: ${padProps.pad.height};
      border-radius: 50%;
    }

    &.pad-rect {
      border-radius: 8px;
      width: 310px;
    }
  }
`;
