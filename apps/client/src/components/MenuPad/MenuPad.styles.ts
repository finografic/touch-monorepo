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
      pointer-events: none;
      color: ${colors.success};
      border: ${layout.borderWidth} solid ${colors.success};
      background-color: rgba(1, 250, 20, 0.1);

      &:hover {
        cursor: wait;
        color: ${colors.success};
        border-color: ${colors.successLight};
        background-color: rgba(1, 250, 20, 0.1);
        transform: none;
      }

      &:disabled {
        cursor: wait;
        &:hover {
          border-color: ${colors.greyDark};
          background-color: rgba(1, 250, 20, 0.1);
        }
      }
    }

    &.status-processing {
      cursor: wait;
      pointer-events: none;
      color: ${colors.success};
      border: ${layout.borderWidth} solid ${colors.success};
      background-color: ${colors.success}22;

      &:hover {
        cursor: wait;
        color: ${colors.success};
        border-color: ${colors.successLight};
        background-color: ${colors.success}22;
        transform: none;
      }

      &:disabled {
        cursor: wait;
        &:hover {
          border-color: ${colors.greyDark};
          background-color: ${colors.success}22;
        }
      }
    }

    &.status-completed {
      cursor: not-allowed;
      pointer-events: none;
      color: ${colors.warning};
      border: ${layout.borderWidth} solid ${colors.warning};
      background-color: ${colors.warning}22;

      &:hover {
        color: ${colors.warning};
        border-color: ${colors.warning};
        background-color: ${colors.warning}22;
        transform: none;
      }

      &:disabled {
        &:hover {
          border-color: ${colors.greyDark};
          background-color: ${colors.warning}22;
        }
      }
    }

    &.status-error {
      cursor: default;
      pointer-events: none;
      color: ${colors.danger};
      border: ${layout.borderWidth} solid ${colors.danger};
      background-color: ${colors.danger}22;

      &:hover {
        color: ${colors.danger};
        border-color: ${colors.danger};
        background-color: ${colors.danger}22;
        transform: none;
      }

      &:disabled {
        &:hover {
          border-color: ${colors.greyDark};
          background-color: ${colors.danger}22;
        }
      }
    }
  }
`;
