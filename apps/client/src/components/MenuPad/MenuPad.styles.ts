import { colors, layout } from 'styles';
import { css } from '@emotion/react';
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

export const styles = css`
  &.pad-menu {
    ${stylesPad}

    width: ${props.pad.width};
    height: ${props.pad.height};
    border-radius: 50%;

    /*
    color: ${colors.info};

     &:hover {
      border-color: ${colors.info};
      transform: scale(1.05);
    }

    &.active {
      border-color: ${colors.info};
      background-color: rgba(0, 191, 255, 0.1);
    }

    &.first {
    } */

    &.slot-type-A {
      pointer-events: none;
      border-color: ${colors.grey};
      background-color: rgba(150, 150, 150, 0.15);
      &:hover {
        transform: none; /* Ensure no transform */
      }
    }

    &.slot-type-B {
      &:hover {
        border-color: ${colors.info};
        transform: scale(1.05);
      }
    }
    /*
    &.slot-type-C {
      pointer-events: none;
      border-color: ${colors.danger};
      color: ${colors.danger};
      width: ${props.padLG.width};
      height: ${props.padLG.height};
    } */

    &.special {
      border-radius: 10px;
      border-color: ${colors.success};
      color: ${colors.success};
      width: ${props.special.width};
      height: ${props.special.height};
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
