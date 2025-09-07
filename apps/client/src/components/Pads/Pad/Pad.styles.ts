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
        border-color: ${colors.infoDark};
        background-color: ${colors.infoLight};
        background-color: ${colors.danger};
        color: ${colors.infoDark};
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
