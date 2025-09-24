import { css } from '@emotion/react';
import { colors } from 'styles/colors/colors.styles';
import { forms } from 'styles/forms/forms.styles';

export const styles = css`
  /* Temperature input using TextField.Root structure like InputTime */
  .temperature-input-root {
    .rt-TextFieldInput {
      text-align: right; /* Right align like time inputs */
      padding-right: 0.5rem; /* Add space for unit display */

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
      border-color: ${colors.greyXLight}; /* Dimmed border */
      opacity: 0.7; /* Additional dimming */

      /* Disabled buttons in left slot */
      &.temperature-controls-slot .rt-IconButton:disabled {
        background-color: transparent;
        border-color: ${colors.greyXLight};
        color: ${colors.greyLight};
        opacity: 0.5;
      }

      /* Disabled unit text in right slot */
      &.temperature-unit-slot span {
        color: ${colors.greyLight};
        opacity: 0.5;
      }
    }

    /* Specific slot styling */
    .temperature-controls-slot {
      /* Left slot with step buttons */
    }

    .temperature-unit-slot {
      /* Right slot with unit display */
      padding: 0 0.5rem;
      font-weight: 500;
      color: ${colors.greyDark};
      pointer-events: none;
      user-select: none;
    }
  }

  /* Error state styling */
  &.field-error .temperature-input-root {
    .rt-TextFieldInput {
      border-color: ${colors.dangerDark} !important;

      &:focus {
        box-shadow: 0 0 0 3px ${colors.dangerDark25} !important;
      }
    }

    .rt-TextFieldSlot {
      border-color: ${colors.dangerDark} !important;
    }
  }

  /* Warning state styling */
  &.field-warning .temperature-input-root {
    .rt-TextFieldInput {
      border-color: ${colors.warningDark} !important;

      &:focus {
        box-shadow: 0 0 0 3px ${colors.warningDark25} !important;
      }
    }

    .rt-TextFieldSlot {
      border-color: ${colors.warningDark} !important;
    }
  }
`;
