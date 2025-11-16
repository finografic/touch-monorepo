import { css } from '@emotion/react';

import { forms } from './forms.constants';
import { colors } from 'styles';

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
    /* Prevent layout shift from outline */
    outline: none !important;

    &:hover:not(:disabled):not(:focus) {
      border-color: ${forms.inputs.hover.border.color};
    }

    &:focus {
      /* Maintain border width to prevent layout shift */
      border-width: ${forms.inputs.border.width} !important;
      border-color: ${forms.inputs.focus.border.color};
      /* Use box-shadow for focus ring instead of outline to prevent shift */
      box-shadow: 0 0 0 3px ${colors.primaryLight25};
      outline: none !important;
      outline-offset: 0 !important;
    }

    &:disabled {
      background-color: ${forms.inputs.disabled.background}!important;
      background-color: ${colors.greyXXLight25}!important;
      border-color: ${forms.inputs.disabled.border.color};
      color: ${forms.inputs.placeholder.disabled.color};
      font-weight: ${forms.inputs.placeholder.disabled.fontWeight};
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

  /* Switch focus styles - prevent layout shift */
  .rt-SwitchRoot {
    /* Remove outline that causes layout shift */
    outline: none !important;
    /* Ensure no border changes on focus */
    border: none !important;

    /* Focus state - use transparent box-shadow to prevent layout shift */
    &:focus,
    &:focus-visible {
      outline: none !important;
      outline-offset: 0 !important;
      /* Transparent box-shadow to prevent layout shift without visible ring */
      box-shadow: 0 0 0 2px transparent !important;
      /* Ensure no border is added on focus */
      border: none !important;
      /* Prevent any transform changes */
      transform: none !important;
    }
  }

  /* Buttons - basic enhancement */
  .rt-Button .field-label,
  button[type='submit'] .field-label,
  button[type='button'] .field-label {
    font-size: ${forms.inputs.label.fontSize};
    font-weight: ${forms.inputs.label.fontWeight};
    color: ${forms.inputs.label.color};
  }
`;
