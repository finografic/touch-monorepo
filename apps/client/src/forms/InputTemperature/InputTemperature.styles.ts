import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  .temperature-input-root {
    .ds-input-field__input {
      text-align: right;
      padding-right: 0.5rem;

      &:disabled {
        background-color: ${colors.greyXXLight75};
        color: ${colors.greyDark};
        font-weight: 400;
        opacity: 0.6;
      }
    }

    &:has(:disabled) .ds-input-field__slot {
      background-color: ${colors.greyXXLight50};
      border-color: ${colors.greyXLight};
      opacity: 0.7;

      &.temperature-controls-slot .button:disabled {
        background-color: transparent;
        color: ${colors.greyLight};
        opacity: 0.5;
      }

      &.temperature-unit-slot span {
        color: ${colors.greyLight};
        opacity: 0.5;
      }
    }

    .temperature-unit-slot {
      padding: 0 0.5rem;
      font-weight: 500;
      color: ${colors.greyDark};
      pointer-events: none;
      user-select: none;
    }
  }

  &.field-error .temperature-input-root {
    border-color: ${colors.dangerDark} !important;
  }

  &.field-warning .temperature-input-root {
    border-color: ${colors.warningDark} !important;
  }
`;
