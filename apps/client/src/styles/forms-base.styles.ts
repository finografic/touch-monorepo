import { colors } from '@workspace/design-system/tokens';

import { css } from '@emotion/react';
import { forms } from 'forms/forms.config';

// ======================================================================== //
// FORM RESET
// ======================================================================== //

export const formsReset = css`
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='search']::-webkit-search-cancel-button,
  input[type='search']::-webkit-search-decoration {
    -webkit-appearance: none;
  }

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
// FORM BASE STYLES
// ======================================================================== //

export const formsBase = css`
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
      box-shadow: 0 0 0 3px ${colors.primaryLighter};
      outline: none !important;
      outline-offset: 0 !important;
    }

    &:disabled {
      background-color: ${forms.inputs.disabled.background}!important;
      background-color: ${colors.greyXXXLight}!important;
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

  /* Select elements */
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
      box-shadow: 0 0 0 3px ${colors.primaryLighter};
    }
  }

  /* Buttons - basic enhancement */
  button[type='submit'] .field-label,
  button[type='button'] .field-label {
    font-size: ${forms.inputs.label.fontSize};
    font-weight: ${forms.inputs.label.fontWeight};
    color: ${forms.inputs.label.color};
  }
`;
