import { colors, layout } from 'styles';
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
        transform: scale(1.05);
      }
    }

    &.item-type-A {
      color: var(--color-grey-xlight);
      border-color: var(--color-grey-light);
      transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;

      &:hover {
        color: ${colors.greyLight};
        border-color: var(--color-grey-xlight);
        background-color: var(--color-grey-25);
        transform: scale(1.05);
        /* Override transition to exclude background-color */
        transition:
          transform 0.2s ease,
          border-color 0.2s ease,
          color 0.2s ease;
      }

      &.checked {
        color: var(--color-grey-light);
        border-color: var(--color-grey-xlight);
        background-color: var(--color-grey-light);
      }
    }

    &.item-type-B {
      color: var(--color-info);
      border-color: var(--color-info-dark);
      transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;

      &:hover {
        color: var(--color-info);
        border-color: var(--color-info);
        background-color: var(--color-info-25);
        transform: scale(1.05);
        /* Override transition to exclude background-color */
        transition:
          transform 0.2s ease,
          border-color 0.2s ease,
          color 0.2s ease;
      }

      &.checked {
        color: var(--color-info);
        border-color: var(--color-info);
        background-color: var(--color-info-light);
      }
    }

    &.item-type-C {
      color: var(--color-danger);
      border-color: var(--color-danger);
      transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;

      &:hover {
        color: var(--color-danger);
        border-color: var(--color-danger);
        background-color: var(--color-danger-25);
        transform: scale(1.05);
        /* Override transition to exclude background-color */
        transition:
          transform 0.2s ease,
          border-color 0.2s ease,
          color 0.2s ease;
      }

      &.checked {
        color: var(--color-danger);
        border-color: var(--color-danger);
        background-color: var(--color-danger-light);
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
