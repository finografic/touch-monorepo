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
      color: ${colors.greyXLight}BB;
      border-color: ${colors.greyLight}BB;
      &:hover {
        color: ${colors.greyLight};
        border-color: ${colors.greyXLight}BB;
        background-color: ${colors.grey}11;
      }
      &.checked {
        color: ${colors.greyLight};
        border-color: ${colors.greyXLight};
        background-color: ${colors.greyLight}22;
      }
    }

    &.item-type-B {
      &:hover {
        border-color: ${colors.info};
        transform: scale(1.05);
      }
    }

    &.item-type-C {
      width: ${padProps.padLG.width};
      height: ${padProps.padLG.height};
      color: ${colors.danger}BB;
      border-color: ${colors.danger}BB;
      &:hover {
        color: ${colors.danger};
        border-color: ${colors.danger};
        background-color: ${colors.danger}11;
      }
      &.checked {
        color: ${colors.danger};
        border-color: ${colors.danger};
        background-color: ${colors.dangerDark}22;
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        border-color: inherit;
        transform: none; /* Ensure no transform */
      }
    }

    &.is-processing {
      cursor: wait;
      color: ${colors.warning};
      border: ${layout.borderWidth} solid ${colors.warning};
      background-color: ${colors.warning}22;

      &:hover {
        cursor: wait;
        pointer-events: none;
        color: ${colors.warning};
        border-color: ${colors.warning};
        background-color: ${colors.warning}22;
        transform: none;
      }

      &:disabled {
        cursor: wait;
        opacity: 0.5;
        &:hover {
          border-color: ${colors.greyDark};
          background-color: ${colors.warning}22;
        }
      }
    }
  }
`;
