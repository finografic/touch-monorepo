import { button, colors, layout } from 'styles';
import { css } from '@emotion/react';
import { padProps, stylesPad } from 'components/Pads/Pad/PadBasic.styles';

export const styles = css`
  &.pad-slot,
  &.pad {
    ${stylesPad}

    width: ${padProps.pad.width};
    height: ${padProps.pad.height};
    border-radius: 50%;
    user-select: none;

    &:not(:disabled) {
      &:hover {
        transform: scale(${button.transform.padHoverScale});
      }
    }

    &.item-type-A {
      color: ${colors.defaultLight75};
      border-color: ${colors.defaultLight75};
      transition: ${button.transition};

      &.checked {
        color: ${colors.defaultLight75};
        border-color: ${colors.defaultLight75};
        background-color: ${colors.defaultXLight25};
      }

      &:hover {
        color: ${colors.default75};
        border-color: ${colors.default75};
        background-color: ${colors.defaultXLight75};
        transform: scale(${button.transform.padHoverScale});
        &.checked {
          color: ${colors.default75};
          border-color: ${colors.default75};
          background-color: ${colors.defaultLight50};
        }
      }
    }

    &.item-type-B {
      color: ${colors.infoLight};
      border-color: ${colors.infoLight};
      transition: ${button.transition};

      &.checked {
        color: ${colors.infoLight};
        border-color: ${colors.infoLight};
        background-color: ${colors.infoXLight25};
      }

      &:hover {
        color: ${colors.infoDark};
        border-color: ${colors.infoDark};
        background-color: ${colors.infoLight75};
        transform: scale(${button.transform.padHoverScale});
        &.checked {
          color: ${colors.infoDark};
          border-color: ${colors.infoDark};
          background-color: ${colors.infoLight75};
        }
      }
    }

    &.item-type-C {
      color: ${colors.dangerLight};
      border-color: ${colors.dangerLight};
      transition: ${button.transition};

      &.checked {
        color: ${colors.dangerLight};
        border-color: ${colors.dangerLight};
        background-color: ${colors.dangerXLight50};
      }

      &:hover {
        color: ${colors.dangerDark};
        border-color: ${colors.dangerDark};
        background-color: ${colors.dangerXLight50};
        transform: scale(${button.transform.padHoverScale});
        &.checked {
          color: ${colors.dangerDark};
          border-color: ${colors.dangerDark};
          background-color: ${colors.dangerXLight};
        }
      }
    }

    &.pad-large {
      width: ${padProps.padLG.width} !important;
      height: ${padProps.padLG.height} !important;
    }

    /* Disabled styles inherited from stylesButtonBase */

    &.status-processing {
      color: ${colors.success75};
      border: ${layout.borderWidth} solid ${colors.success75};
      /* background-color: ${colors.success25}; */
      background-color: transparent;
      &:hover {
        color: ${colors.success};
        border-color: ${colors.success};
        background-color: ${colors.success25};
      }

      &.selected {
        color: ${colors.successDark};
        border: ${layout.borderWidth} solid ${colors.successDark};
        background-color: ${colors.successDark25};
        &:hover {
          color: ${colors.success};
          border-color: ${colors.successLight};
          border: ${layout.borderWidth} solid ${colors.success};
          background-color: ${colors.success25};
        }
      }

      &.checking-blocked,
      &.checking-blocked.selected {
        cursor: not-allowed;
        pointer-events: none;
        color: ${colors.success75};
        border: ${layout.borderWidth} solid ${colors.success75};
        background-color: transparent;
      }
    }

    &.status-completed {
      /* cursor: not-allowed; */
      pointer-events: none;
      user-select: none;
      color: ${colors.warningLight};
      border: ${layout.borderWidth} solid ${colors.warningLight};
      background-color: ${colors.warningLight25};
      &:hover {
        color: ${colors.warning};
        border-color: ${colors.warning};
        background-color: ${colors.warning25};
        transform: none;
      }
      &:disabled {
        &:hover {
          border-color: ${colors.greyDark};
          background-color: ${colors.warning25};
        }
      }
      &.selected {
        color: ${colors.warningLight};
        border: ${layout.borderWidth} solid ${colors.warningLight};
        background-color: ${colors.warningLight25};
        &:hover {
          color: ${colors.warningLight};
          border: ${layout.borderWidth} solid ${colors.warningLight};
          background-color: ${colors.warningLight25};
        }
      }
    }

    &.status-error {
      cursor: default;
      pointer-events: none;
      color: ${colors.danger};
      border: ${layout.borderWidth} solid ${colors.danger};
      background-color: ${colors.danger25};
      &:hover {
        color: ${colors.danger};
        border-color: ${colors.danger};
        background-color: ${colors.danger25};
        transform: none;
      }
      &:disabled {
        &:hover {
          border-color: ${colors.greyDark};
          background-color: ${colors.danger25};
        }
      }
    }
  }
`;
