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

    /* ACTIVE TIMERS - Orange/Warning styling overrides type colors */
    &.status-processing {
      color: ${colors.warningLight} !important; /* Lightened variant */
      border-color: ${colors.warningLight} !important; /* Lightened variant */
      background-color: transparent !important; /* Transparent background */

      &:hover {
        color: ${colors.warningDark} !important;
        border-color: ${colors.warningDark} !important;
        background-color: ${colors.warning50} !important;
        transform: scale(${button.transform.padHoverScale});
      }

      /* Override checked state - timer colors take precedence */
      &.checked {
        color: ${colors.warningDark} !important;
        border-color: ${colors.warningDark} !important;
        background-color: ${colors.warning50} !important;

        &:hover {
          color: ${colors.warningDark} !important;
          border-color: ${colors.warningDark} !important;
          background-color: ${colors.warning75} !important;
          transform: scale(${button.transform.padHoverScale});
        }
      }

      &.checking-blocked,
      &.checking-blocked.selected {
        cursor: not-allowed;
        pointer-events: none;
        color: ${colors.warningLight} !important; /* Lightened variant */
        border-color: ${colors.warningLight} !important; /* Lightened variant */
        background-color: transparent !important; /* Transparent background */
        transform: none;
      }
    }

    /* COMPLETED TIMERS - See-through opacity tint overrides type colors */
    &.status-completed {
      pointer-events: none;
      user-select: none;
      color: ${colors.warningLight} !important;
      border-color: ${colors.warningLight} !important;
      background-color: ${colors.warningLight25} !important;

      &:hover {
        color: ${colors.warning} !important;
        border-color: ${colors.warning} !important;
        background-color: ${colors.warning25} !important;
        transform: none;
      }

      &:disabled {
        &:hover {
          border-color: ${colors.greyDark} !important;
          background-color: ${colors.warning25} !important;
        }
      }

      /* Override checked state - timer colors take precedence */
      &.checked {
        color: ${colors.warning} !important;
        border-color: ${colors.warning} !important;
        background-color: ${colors.warning50} !important;

        &:hover {
          color: ${colors.warning} !important;
          border-color: ${colors.warning} !important;
          background-color: ${colors.warning75} !important;
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
