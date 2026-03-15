import { css } from '@emotion/react';
import { padProps, stylesPad } from 'components/Pads/Pad/PadBasic.styles';

import { colors } from '@finografic/design-system/tokens';

export const padStyles = css`
  &.pad {
    ${stylesPad}

    border-radius: 8px;
    user-select: none;

    &.radio {
    }

    &.checkbox {
      &.checked {
        color: ${colors.infoDark};
        border-color: ${colors.infoDark};
        background-color: ${colors.infoLight};
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
