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
      color: var(--color-grey-xlight);
      border-color: var(--color-grey-light);
      transition: ${button.transition};

      &:hover {
        color: var(--color-grey-light);
        border-color: var(--color-grey-xlight);
        background-color: var(--color-grey-25);
        transform: scale(${button.transform.padHoverScale});
      }

      &.checked {
        color: var(--color-grey-light);
        border-color: var(--color-grey-xlight);
        background-color: var(--color-grey-light);
      }
    }

    &.item-type-B {
      color: ${colors.info};
      border-color: ${colors.infoDark};
      transition: ${button.transition};

      &:hover {
        color: ${colors.info};
        border-color: ${colors.info};
        background-color: ${colors.info25};
        transform: scale(${button.transform.padHoverScale});
      }

      &.checked {
        color: ${colors.info};
        border-color: ${colors.info};
        background-color: ${colors.infoLight};
      }
    }

    &.item-type-C {
      color: ${colors.danger};
      border-color: ${colors.danger};
      transition: ${button.transition};

      &:hover {
        color: ${colors.danger};
        border-color: ${colors.danger};
        background-color: ${colors.danger25};
        transform: scale(${button.transform.padHoverScale});
      }

      &.checked {
        color: ${colors.danger};
        border-color: ${colors.danger};
        background-color: ${colors.dangerLight};
      }
    }

    &.pad-large {
      width: ${padProps.padLG.width} !important;
      height: ${padProps.padLG.height} !important;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        border-color: inherit;
        transform: none; /* Ensure no transform */
      }
    }

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
      cursor: not-allowed;
      pointer-events: none;
      color: ${colors.warning};
      border: ${layout.borderWidth} solid ${colors.warning};
      background-color: ${colors.warning25};
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
