import { css } from '@emotion/react';
import { padProps, stylesPad } from 'components/Pads/Pad/PadBasic.styles';

import { colors, layout } from '@workspace/design-system/tokens';

export const styles = css`
  .pad-special {
    width: ${padProps.pad.width};
    height: ${padProps.pad.height};
    border-radius: 50%;
    border: 2px solid ${colors.greyDark};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: ${colors.infoDark};
    transition: all 0.3s;
    background-color: transparent;
    cursor: pointer;

    &.power {
      pointer-events: none;
      border-radius: 10px;
      grid-row: span 2;
      width: ${padProps.special.width};
      height: ${padProps.special.height};
      color: ${colors.successXLight};
      border-color: ${colors.successXLight};

      &:hover {
        color: ${colors.successDark};
        border-color: ${colors.successDark};
        background-color: ${colors.successLight};
      }

      &.checked {
        color: ${colors.successDark};
        border-color: ${colors.successDark};
        background-color: ${colors.successLight};
      }
    }
  }
`;
