import { css } from '@emotion/react';

import { colors } from 'styles';
import { forms } from 'styles/forms/forms.styles';

export const styles = css`
  .time-input-root {
    .rt-TextFieldInput {
      text-align: right; /* Right align like temperature inputs */

      &:disabled {
        background-color: ${colors.greyXXLight75}; /* Even lighter than forms default */
        border-color: ${forms.inputs.disabled.border.color};
        color: ${forms.inputs.disabled.text.color};
        font-weight: ${forms.inputs.disabled.text.fontWeight};
        opacity: ${forms.inputs.disabled.opacity};
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
    }
  }
`;
