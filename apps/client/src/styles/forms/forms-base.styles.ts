import { css } from '@emotion/react';
import { colors } from '../colors/colors.styles';
import { forms } from './forms.constants';

// ======================================================================== //
// FORM RESET - Minimal reset that works with Radix UI
// ======================================================================== //

export const formsReset = css`
  /* Remove default styling while preserving Radix functionality */
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='search']::-webkit-search-cancel-button,
  input[type='search']::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  /* Consistent focus outline removal - Radix handles focus states */
  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
  }

  /* Consistent font inheritance */
  input,
  textarea,
  select,
  button {
    font-family: inherit;
    line-height: inherit;
  }
`;

// ======================================================================== //
// FORM BASE STYLES - Core styling that complements Radix
// ======================================================================== //

export const formsBase = css`
  /* Enhanced TextField styles - work with Radix classes */
  .rt-TextFieldInput,
  .rt-TextAreaInput,
  input[type='text'],
  input[type='email'],
  input[type='password'],
  input[type='search'],
  input[type='tel'],
  input[type='url'],
  input[type='number'],
  textarea {
    font-size: ${forms.inputs.text.fontSize};
    font-weight: ${forms.inputs.text.fontWeight};
    border: ${forms.inputs.border.width} solid ${forms.inputs.border.color};
    background-color: ${forms.inputs.background};
    color: ${forms.inputs.text.color};
    transition: ${forms.inputs.transition};
    padding: ${forms.inputs.padding};

    &::placeholder {
      color: ${forms.inputs.placeholder.color};
      opacity: ${forms.inputs.placeholder.opacity};
      font-weight: ${forms.inputs.placeholder.fontWeight};
      /* padding: ${forms.inputs.padding}; */
    }

    &:hover:not(:disabled):not(:focus) {
      border-color: ${forms.inputs.hover.border.color};
    }

    &:focus {
      border-color: ${forms.inputs.focus.border.color};
      box-shadow: 0 0 0 3px ${colors.primaryLight20};
    }

    &:disabled {
      background-color: ${forms.inputs.disabled.background};
      border-color: ${forms.inputs.disabled.border.color};
      color: ${forms.inputs.disabled.text.color};
      font-weight: ${forms.inputs.disabled.text.fontWeight};
      opacity: ${forms.inputs.disabled.opacity};
      cursor: not-allowed;
    }

    &:read-only {
      background-color: ${forms.inputs.readOnly.background};
      border-color: ${forms.inputs.readOnly.border.color};
      color: ${forms.inputs.readOnly.text.color};
      font-weight: ${forms.inputs.readOnly.text.fontWeight};
      opacity: ${forms.inputs.readOnly.opacity};
      cursor: default;
    }
  }

  /* Radix TextField with slots (icons) */
  .rt-TextFieldRoot {
    &:hover:not(:has(:disabled)) .rt-TextFieldSlot {
      border-color: ${forms.inputs.hover.border.color};
    }

    &:focus-within .rt-TextFieldSlot {
      border-color: ${forms.inputs.focus.border.color};
    }
  }

  .rt-TextFieldSlot {
    border: ${forms.inputs.border.width} solid ${forms.inputs.border.color};
    background-color: ${forms.inputs.background};
    transition: ${forms.inputs.transition};
  }

  /* Select elements */
  .rt-SelectTrigger,
  select {
    font-size: ${forms.inputs.text.fontSize};
    font-weight: ${forms.inputs.text.fontWeight};
    border: ${forms.inputs.border.width} solid ${forms.inputs.border.color};
    background-color: ${forms.inputs.background};
    color: ${forms.inputs.text.color};
    transition: ${forms.inputs.transition};

    &:hover:not(:disabled) {
      border-color: ${forms.inputs.hover.border.color};
    }

    &:focus {
      border-color: ${forms.inputs.focus.border.color};
      box-shadow: 0 0 0 3px ${colors.primaryLight20};
    }
  }

  /* Labels */

  label.field-label {
    font-weight: ${forms.inputs.label.fontWeight};
    font-size: ${forms.inputs.label.fontSize};
    color: ${colors.text};

    cursor: pointer;
  }

  /* Buttons - basic enhancement */
  .rt-Button,
  button[type='submit'],
  button[type='button'] {
    font-weight: 600;
    transition: all 0.15s ease;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;

      /* Preserve color but make it faded */
      &[data-color] {
        opacity: 0.5;
      }
    }
  }
`;
