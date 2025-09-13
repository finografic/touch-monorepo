import { button, colors, layout } from 'styles';
import { css } from '@emotion/react';
import { padProps, stylesPad } from 'components/Pads/Pad/PadBasic.styles';

export const styles = css`
  &.pad-menu,
  &.pad {
    ${stylesPad}

    width: ${padProps.pad.width};
    height: ${padProps.pad.height};
    border-radius: 50%;

    &:not(:disabled) {
      &:hover {
        transform: scale(${button.transform.padHoverScale});
      }
    }

    &.item-type-A {
      color: ${colors.defaultLight80};
      border-color: ${colors.defaultLight80};
      transition: ${button.transition};

      &.checked {
        color: ${colors.defaultLight80};
        border-color: ${colors.defaultLight80};
        background-color: ${colors.defaultXLight33};
      }

      &:hover {
        color: ${colors.default66};
        border-color: ${colors.default66};
        background-color: ${colors.defaultXLight66};
        transform: scale(${button.transform.padHoverScale});
        &.checked {
          color: ${colors.default66};
          border-color: ${colors.default66};
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
        background-color: ${colors.infoXLight33};
      }

      &:hover {
        color: ${colors.infoDark};
        border-color: ${colors.infoDark};
        background-color: ${colors.infoLight66};
        transform: scale(${button.transform.padHoverScale});
        &.checked {
          color: ${colors.infoDark};
          border-color: ${colors.infoDark};
          background-color: ${colors.infoLight66};
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
      color: ${colors.success};
      border: ${layout.borderWidth} solid ${colors.success};
      background-color: ${colors.success25};
      &:hover {
        color: ${colors.success};
        border-color: ${colors.successLight};
        background-color: ${colors.success25};
        transform: none;
      }
      &:disabled {
        cursor: wait;
        &:hover {
          border-color: ${colors.greyDark};
          background-color: ${colors.success25};
        }
      }
      &.selected {
        color: ${colors.info};
        border-color: ${colors.info};
        background-color: ${colors.info25};
        &:hover {
          color: ${colors.info};
          border-color: ${colors.infoLight};
          background-color: ${colors.info25};
        }
      }
    }

    &.status-completed {
      /* cursor: not-allowed; */
      /* pointer-events: none; */
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
        color: ${colors.info};
        border-color: ${colors.info};
        background-color: ${colors.info25};
        &:hover {
          color: ${colors.info};
          border-color: ${colors.infoLight};
          background-color: ${colors.info25};
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
