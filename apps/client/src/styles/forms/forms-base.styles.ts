import { css } from '@emotion/react';

import { forms } from './forms.constants';
import { colors } from '../colors/colors.styles';

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
    /* background-color: red !important; */
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
      box-shadow: 0 0 0 3px ${colors.primaryLight25};
    }

    &:disabled {
      background-color: ${forms.inputs.disabled.background}!important;
      background-color: ${colors.greyXXLight25}!important;
      border-color: ${forms.inputs.disabled.border.color};
      color: ${forms.inputs.placeholder.disabled.color};
      font-weight: ${forms.inputs.placeholder.disabled.fontWeight};
      opacity: ${forms.inputs.placeholder.disabled.opacity};
      cursor: not-allowed;
      &::placeholder {
        opacity: 0.8;
      }
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
      box-shadow: 0 0 0 3px ${colors.primaryLight25};
    }
  }

  /* Radix UI Form Input Overrides - Remove default box-shadows */
  .rt-TextFieldInput:where(.rt-variant-surface),
  .rt-TextAreaInput:where(.rt-variant-surface),
  .rt-SelectTrigger:where(.rt-variant-surface),
  .rt-SelectValue:where(.rt-variant-surface),
  .rt-CheckboxRoot:where(.rt-variant-surface),
  .rt-RadioGroupRoot:where(.rt-variant-surface),
  .rt-SwitchRoot:where(.rt-variant-surface),
  .rt-SliderRoot:where(.rt-variant-surface) {
    &,
    & input {
      box-shadow: none !important;
    }

    &:focus {
      .rt-TextFieldRoot:where(.rt-r-size-3) :where(.rt-TextFieldSlot),
      .rt-TextFieldSlot:where([data-side='right']),
      .rt-TextFieldSlot:where(.rt-TextFieldSlot:not([data-side='left'])) {
        border: none !important;
      }
    }
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
