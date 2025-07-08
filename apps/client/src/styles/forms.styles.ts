import { css } from '@emotion/react';
import { colors } from './colors.styles';

// ======================================================================== //
// FORM CONFIGURATION - Single source of truth for form styling
// ======================================================================== //

export const forms = {
  inputs: {
    fontSize: '1rem',
    fontWeight: 500,
    height: '2.5rem', // 40px - consistent with Radix default
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    borderWidth: '1px',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    // Using your color system
    colors: {
      border: colors.grey,
      borderHover: colors.greyDark,
      borderFocus: colors.primary,
      background: colors.white,
      text: colors.text,
      // placeholder: colors.greyLight,
      placeholder: colors.info,
    },
  },
  validation: {
    fontSize: '0.875rem',
    fontWeight: 600,
    colors: {
      warning: colors.warningDark,
      error: colors.dangerDark,
    },
  },
} as const;

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
    font-size: ${forms.inputs.fontSize};
    font-weight: ${forms.inputs.fontWeight};
    border: ${forms.inputs.borderWidth} solid ${forms.inputs.colors.border};
    background-color: ${forms.inputs.colors.background};
    color: ${forms.inputs.colors.text};
    transition: ${forms.inputs.transition};

    &::placeholder {
      color: ${forms.inputs.colors.placeholder};
      font-weight: 400;
    }

    &:hover:not(:disabled):not(:focus) {
      border-color: ${forms.inputs.colors.borderHover};
    }

    &:focus {
      border-color: ${forms.inputs.colors.borderFocus};
      box-shadow: 0 0 0 3px ${colors.primaryLight}20;
    }

    &:disabled {
      background-color: ${colors.greyXLight};
      color: ${colors.greyDark};
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  /* Radix TextField with slots (icons) */
  .rt-TextFieldRoot {
    &:hover:not(:has(:disabled)) .rt-TextFieldSlot {
      border-color: ${forms.inputs.colors.borderHover};
    }

    &:focus-within .rt-TextFieldSlot {
      border-color: ${forms.inputs.colors.borderFocus};
    }
  }

  .rt-TextFieldSlot {
    border: ${forms.inputs.borderWidth} solid ${forms.inputs.colors.border};
    background-color: ${forms.inputs.colors.background};
    transition: ${forms.inputs.transition};
  }

  /* Select elements */
  .rt-SelectTrigger,
  select {
    font-size: ${forms.inputs.fontSize};
    font-weight: ${forms.inputs.fontWeight};
    border: ${forms.inputs.borderWidth} solid ${forms.inputs.colors.border};
    background-color: ${forms.inputs.colors.background};
    color: ${forms.inputs.colors.text};
    transition: ${forms.inputs.transition};

    &:hover:not(:disabled) {
      border-color: ${forms.inputs.colors.borderHover};
    }

    &:focus {
      border-color: ${forms.inputs.colors.borderFocus};
      box-shadow: 0 0 0 3px ${colors.primaryLight}20;
    }
  }

  /* Labels */
  .rt-Text,
  label {
    font-weight: ${forms.inputs.fontWeight};
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
    }
  }
`;

// ======================================================================== //
// FORM VALIDATION STYLES
// ======================================================================== //

export const formsValidation = css`
  /* Validation states for inputs */
  .field-error input,
  .field-error .rt-TextFieldInput,
  .field-error .rt-TextFieldSlot,
  .field-error .rt-SelectTrigger {
    border-color: ${colors.dangerDark} !important;

    &:focus {
      box-shadow: 0 0 0 3px ${colors.dangerDark}20 !important;
    }
  }

  .field-warning input,
  .field-warning .rt-TextFieldInput,
  .field-warning .rt-TextFieldSlot,
  .field-warning .rt-SelectTrigger {
    border-color: ${colors.warningDark} !important;

    &:focus {
      box-shadow: 0 0 0 3px ${colors.warningDark}20 !important;
    }
  }

  .field-success input,
  .field-success .rt-TextFieldInput,
  .field-success .rt-TextFieldSlot,
  .field-success .rt-SelectTrigger {
    border-color: ${colors.success} !important;

    &:focus {
      box-shadow: 0 0 0 3px ${colors.success}20 !important;
    }
  }

  /* Validation messages */
  .field-validation {
    font-size: ${forms.validation.fontSize};
    font-weight: ${forms.validation.fontWeight};
    margin-top: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;

    &.validation-error {
      color: ${forms.validation.colors.error};
    }

    &.validation-warning {
      color: ${forms.validation.colors.warning};
    }
  }
`;

// ======================================================================== //
// CUSTOM COMPONENT OVERRIDES
// ======================================================================== //

export const formsCustom = css`
  /* INPUT SLOTS */
  input + .rt-TextFieldSlot,
  input + .rt-TextFieldSlot + .rt-TextFieldSlot {
    border-color: red !important;

    &:focus {
      box-shadow: 0 0 0 3px red !important;
    }
  }

  /* Custom select components */
  .select-simple,
  .select-searchable {
    .select-trigger {
      min-height: ${forms.inputs.height};
      border: ${forms.inputs.borderWidth} solid ${forms.inputs.colors.border};
      border-radius: ${forms.inputs.borderRadius};
      font-size: ${forms.inputs.fontSize};
      font-weight: ${forms.inputs.fontWeight};
      transition: ${forms.inputs.transition};

      &:hover {
        border-color: ${forms.inputs.colors.borderHover};
      }

      &:focus,
      &[data-state='open'] {
        border-color: ${forms.inputs.colors.borderFocus};
        box-shadow: 0 0 0 3px ${colors.primaryLight}20;
      }
    }
  }

  /* Temperature and Time inputs */
  .input-temperature,
  .input-time {
    .input-wrapper {
      display: flex;
      align-items: center;
      border: ${forms.inputs.borderWidth} solid ${forms.inputs.colors.border};
      border-radius: ${forms.inputs.borderRadius};
      background-color: ${forms.inputs.colors.background};
      transition: ${forms.inputs.transition};

      &:hover {
        border-color: ${forms.inputs.colors.borderHover};
      }

      &:focus-within {
        border-color: ${forms.inputs.colors.borderFocus};
        box-shadow: 0 0 0 3px ${colors.primaryLight}20;
      }

      input {
        border: none;
        background: transparent;
        outline: none;
        flex: 1;
      }

      .input-controls,
      .input-suffix {
        border-left: 1px solid ${colors.greyLight};
        padding: 0 0.5rem;
        color: ${colors.greyDark};
      }
    }
  }

  /* Times table specific styling */
  .times-table {
    .table-header {
      background-color: ${colors.greyXLight};
      border: 1px solid ${colors.greyLight};
      font-weight: 600;
      color: ${colors.text};
    }

    .table-row {
      &:nth-of-type(even) {
        background-color: ${colors.greyXLight}10;
      }

      &.incomplete {
        opacity: 0.7;
      }

      .delete-button {
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      &:hover .delete-button {
        opacity: 1;
      }
    }
  }
`;

// ======================================================================== //
// MAIN EXPORT - Combine all form styles
// ======================================================================== //

export const cssForms = css`
  ${formsReset}
  ${formsBase}
  ${formsValidation}
  ${formsCustom}
`;
