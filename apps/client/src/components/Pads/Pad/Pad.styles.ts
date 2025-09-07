import { css } from '@emotion/react';
import { colors } from 'styles';
import { padProps, stylesPad } from 'components/Pads/Pad/PadBasic.styles';

export const padStyles = css`
  &.pad {
    ${stylesPad}

    min-height: 80px;
    border-radius: 8px;

    &.radio {
    }

    &.checkbox {
      &.checked {
        color: ${colors.infoDark};
        border-color: ${colors.infoDark};
        background-color: ${colors.infoLight66};
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
