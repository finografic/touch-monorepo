import { css } from '@emotion/react';
import { colors } from 'styles';
import { stylesPad } from 'styles/custom/buttons.styles';

const props = {
  pad: {
    width: '110px',
    height: '110px',
  },
  padLG: {
    width: '150px',
    height: '150px',
  },
  special: {
    width: '150px',
    height: '239px',
  },
};

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
    /*
    &.checkbox {
      &.checked {
        border-color: ${colors.success};
        background-color: rgba(1, 250, 20, 0.1);
        border-color: ${colors.info};
        background-color: rgba(0, 191, 255, 0.1);
      }
    } */

    &.pad-menu,
    &.pad-circle {
      width: ${props.pad.width};
      height: ${props.pad.height};
      border-radius: 50%;
    }

    &.pad-rect {
      border-radius: 8px;
      width: 310px;
    }

    /* &.slot-type-C {
      border-radius: 10px;
      border-color: ${colors.success};
      color: ${colors.success};
      width: ${props.special.width};
      height: ${props.special.height};
      grid-row: span 2;
    } */
  }
`;
