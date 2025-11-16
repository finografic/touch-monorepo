import { css } from '@emotion/react';

import { border, colors, layout } from 'styles';
import { forms } from 'styles/forms/forms.styles';

export const styles = css`
  .time-input-root {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;

    .rt-TextFieldInput {
      text-align: right; /* Right align like temperature inputs */
      /* Prevent layout shift from outline */
      outline: none !important;
      box-shadow: none !important;

      &:disabled {
        background-color: ${colors.greyXXLight75}; /* Even lighter than forms default */
        border-color: ${forms.inputs.disabled.border.color};
        color: ${forms.inputs.disabled.text.color};
        font-weight: ${forms.inputs.disabled.text.fontWeight};
        opacity: ${forms.inputs.disabled.opacity};
      }

      &:focus {
        /* Maintain border width to prevent layout shift */
        border-width: ${layout.borderWidth} !important;
        border-color: ${colors.greyXXLight};
        /* Use transparent border instead of none to prevent shift */
        /* border-right-color: transparent !important; */
        outline: none !important;
        outline-offset: 0 !important;
        box-shadow: none !important;
      }
    }

    /* Style disabled slots */
    &:has(.rt-TextFieldInput:disabled) .rt-TextFieldSlot {
      background-color: ${colors.greyXXLight50}; /* Lighter background for slot */
      border-color: ${colors.greyXXLight}; /* Dimmed border */
      opacity: 0.7; /* Additional dimming */
      background-color: ${colors.greyXXLight25};

      /* Disabled buttons in left slot */
      &.time-controls-slot .rt-IconButton:disabled {
        background-color: transparent;
        border-color: ${colors.greyXLight};
        color: ${colors.greyLight};
        opacity: 0.5;
      }
      /* border: ${layout.borderWidth} solid ${colors.greyXLight}!important; */
      /* border-right: none !important; */
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

    /* Specific slot styling */
    .time-controls-slot {
      /* Left slot with step buttons */
      /* display: flex;
      align-items: stretch;
      height: 100%; */

      width: 48px;
      min-width: 40px;

      /* Wrapper div inside slot */
      > div {
        display: flex;
        flex-direction: column;
        flex: 1;
        /* height: 100%; */
        /* gap: 2px; */
        /* border: 1px solid red; */
        padding-left: 2px;
        /* height: 36px; */
        width: 40px;
        min-width: 40px;
        margin-right: 4px;
      }

      /* Icon buttons fill the wrapper */
      .rt-IconButton {
        flex: 1;
        width: 100% !important;
        min-width: 30px !important;
        /* height: auto !important; */
        height: 12px !important;
        max-height: 14px !important;
        border-radius: ${border.radius.sm};
        border-top-right-radius: ${border.radius.none};
        border-bottom-right-radius: ${border.radius.none};

        /* max-height: 16px !important; */
        /* min-height: 16px; */
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateX(1px);

        &:nth-of-type(1) {
          margin-top: 1px;
        }
        &:nth-of-type(2) {
          /* padding-bottom: 2px; */
          margin-bottom: 1px;
        }
      }
    }

    :hover:not(:has(.rt-TextFieldInput:disabled)) {
      .rt-TextFieldInput {
        border-width: ${layout.borderWidth} !important;
        border-color: ${colors.greyXXLight};
        /* border-right-color: transparent !important; */
      }
      &:has(.rt-TextFieldInput) .rt-TextFieldSlot {
        border-width: ${layout.borderWidth} !important;
        border-color: ${colors.greyXXLight};
        /* border-right-color: transparent !important; */
      }
    }

    :focus-within:not(:has(.rt-TextFieldInput:disabled)) {
      .rt-TextFieldInput {
        border-width: ${layout.borderWidth} !important;
        border-color: ${colors.greyXXLight};
        /* border-right-color: transparent !important; */
        outline: none !important;
        outline-offset: 0 !important;
      }
      &:has(.rt-TextFieldInput) .rt-TextFieldSlot {
        border-width: ${layout.borderWidth} !important;
        border-color: ${colors.greyXXLight};
        /* border-right-color: transparent !important; */
        outline: none !important;
      }
    }
  }
`;
