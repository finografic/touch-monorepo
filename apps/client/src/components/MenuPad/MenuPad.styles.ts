import { colors, layout } from 'styles';
import { css } from '@emotion/react';
import { padProps, stylesPad } from 'styles/custom/buttons.styles';

export const styles = css`
  &.pad-menu {
    ${stylesPad}

    width: ${padProps.pad.width};
    height: ${padProps.pad.height};
    border-radius: 50%;

    &.item-type-A {
      pointer-events: none;
      border-color: ${colors.grey};
      background-color: rgba(150, 150, 150, 0.15);
      &:hover {
        transform: none; /* Ensure no transform */
      }
    }

    &.item-type-B {
      &:hover {
        border-color: ${colors.info};
        transform: scale(1.05);
      }
    }

    &.item-type-C {
      pointer-events: none;
      border-color: ${colors.danger};
      color: ${colors.danger};
      width: ${padProps.padLG.width};
      height: ${padProps.padLG.height};
    }

    &.special {
      border-radius: 10px;
      border-color: ${colors.success};
      color: ${colors.success};
      width: ${padProps.special.width};
      height: ${padProps.special.height};
      grid-row: span 2;
    }

    &.is-processing {
      border: ${layout.borderWidth} solid ${colors.success};
      background-color: rgba(1, 250, 20, 0.1);
      color: ${colors.success};
      cursor: not-allowed;
      cursor: wait;

      &:hover {
        border-color: ${colors.successLight};
        background-color: rgba(1, 250, 20, 0.1);
        transform: none;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        &:hover {
          border-color: ${colors.greyDark};
          background-color: rgba(1, 250, 20, 0.1);
        }
      }
    }
  }
`;
