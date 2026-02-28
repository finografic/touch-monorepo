import { css } from '@emotion/react';

import { border, colors } from 'styles';

export const styles = css`
  .time-input-root {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;

    &:focus-within {
      box-shadow: none !important;
      outline: none !important;
    }

    .ds-input-field__input {
      text-align: right;
      outline: none !important;
      box-shadow: none !important;

      &:disabled {
        background-color: ${colors.greyXXLight75};
        color: ${colors.greyDark};
        font-weight: 400;
        opacity: 0.6;
      }
    }

    &:has(:disabled) .ds-input-field__slot {
      background-color: ${colors.greyXXLight25};
      border-color: ${colors.greyXXLight};
      opacity: 0.7;

      &.time-controls-slot .button:disabled {
        background-color: transparent;
        color: ${colors.greyLight};
        opacity: 0.5;
      }
    }

    svg {
      height: 18px !important;
      width: 18px !important;

      &:nth-of-type(1) {
        padding-top: 2px !important;
      }

      &:nth-of-type(2) {
        padding-bottom: 2px !important;
      }
    }

    .time-controls-slot {
      width: 48px;
      min-width: 40px;

      > div {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding-left: 2px;
        width: 40px;
        min-width: 40px;
        margin-right: 4px;
      }

      .button {
        flex: 1;
        width: 100% !important;
        min-width: 30px !important;
        height: 12px !important;
        max-height: 14px !important;
        border-radius: ${border.radius.sm};
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateX(1px);

        &:nth-of-type(1) {
          margin-top: 1px;
        }

        &:nth-of-type(2) {
          margin-bottom: 1px;
        }
      }
    }
  }
`;
