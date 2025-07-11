import { css } from '@emotion/react';
import { colors } from './colors.styles';

// ======================================================================== //
// FORM CONFIGURATION - Single source of truth for form styling
// ======================================================================== //

export const forms = {
  inputs: {
    height: '2.5rem', // (orig: 2.5rem) 40px - consistent with Radix default
    padding: '0.5rem 0.5rem 0.5rem 0.75rem',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    background: colors.white,

    border: {
      color: colors.grey,
      width: '1px',
      radius: '6px',
    },

    text: {
      color: colors.textXDark,
      fontSize: '1rem',
      fontWeight: 600,
    },

    placeholder: {
      color: colors.grey,
      opacity: 0.66,
      fontWeight: 600,
    },

    hover: {
      border: {
        color: colors.greyDark,
        width: '1px',
        radius: '6px',
      },
      text: {
        color: colors.text,
        fontSize: '1rem',
        fontWeight: 600,
      },
    },

    focus: {
      border: {
        color: colors.primary,
        width: '1px',
        radius: '6px',
      },
      text: {
        color: colors.text,
        fontSize: '1rem',
        fontWeight: 600,
      },
    },

    disabled: {
      background: colors.greyXXLight,
      border: {
        color: colors.greyLight,
        width: '1px',
        radius: '6px',
      },
      text: {
        color: colors.greyDark,
        fontSize: '1rem',
        fontWeight: 400, // Lighter weight for disabled text
      },
      opacity: 0.6,
    },

    readOnly: {
      background: colors.greyXXLight,
      border: {
        color: colors.greyLight,
        width: '1px',
        radius: '6px',
      },
      text: {
        color: colors.greyDark,
        fontSize: '1rem',
        fontWeight: 400, // Lighter weight for readonly text
      },
      opacity: 0.8,
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
      box-shadow: 0 0 0 3px ${colors.primaryLight}20;
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
      box-shadow: 0 0 0 3px ${colors.primaryLight}20;
    }
  }

  /* Labels */
  .rt-Text,
  label {
    font-weight: ${forms.inputs.text.fontWeight};
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
  /* INPUT SLOTS - Standardized classes for consistent styling */
  .input-slot-left,
  .input-slot-right {
    /* Base slot styling */
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    padding: 0 0.5rem;
    border: ${forms.inputs.border.width} solid ${forms.inputs.border.color};
    background-color: ${forms.inputs.background};
    transition: ${forms.inputs.transition};

    /* Icon styling */
    svg {
      flex-shrink: 0;
    }

    /* Hover state for interactive slots */
    &.interactive {
      cursor: pointer;

      &:hover {
        background-color: ${colors.greyXLight};
      }
    }
  }

  .input-slot-left {
    border-right: none;
    border-top-left-radius: ${forms.inputs.border.radius};
    border-bottom-left-radius: ${forms.inputs.border.radius};
  }

  .input-slot-right {
    border-left: none;
    border-top-right-radius: ${forms.inputs.border.radius};
    border-bottom-right-radius: ${forms.inputs.border.radius};
  }

  /* Component-specific slot styling */
  .temperature-controls-slot,
  .time-controls-slot {
    /* Step buttons container */
    padding: 0.25rem 0.5rem;
  }

  .temperature-unit-slot {
    /* Temperature unit display */
    font-weight: 500;
    color: ${colors.greyDark};
    pointer-events: none;
    user-select: none;
  }

  .search-icon-slot,
  .action-icon-slot {
    /* Search and action icons */
    color: ${colors.greyDark};
  }

  .dropdown-chevron-slot {
    /* Dropdown chevron indicators */
    color: ${colors.greyDark};

    svg {
      transition: transform 0.2s ease;
    }
  }

  /* Custom select components */
  .select-simple,
  .select-searchable {
    .select-trigger {
      min-height: ${forms.inputs.height};
      border: ${forms.inputs.border.width} solid ${forms.inputs.border.color};
      border-radius: ${forms.inputs.border.radius};
      font-size: ${forms.inputs.text.fontSize};
      font-weight: ${forms.inputs.text.fontWeight};
      transition: ${forms.inputs.transition};

      &:hover {
        border-color: ${forms.inputs.hover.border.color};
      }

      &:focus,
      &[data-state='open'] {
        border-color: ${forms.inputs.focus.border.color};
        box-shadow: 0 0 0 3px ${colors.primaryLight}20;
      }
    }

    /* Dropdown content z-index fix */
    .select-content,
    .select-viewport,
    [role='listbox'],
    [data-radix-popper-content-wrapper] {
      z-index: 9999 !important;
    }
  }

  /* Radix Select specific z-index fixes */
  .rt-SelectContent,
  .rt-PopoverContent,
  [data-radix-select-content],
  [data-radix-popover-content] {
    z-index: 9999 !important;
  }

  /* Portal dropdown global styles */
  #portal-root .dropdown-portal {
    /* Ensure portal dropdowns are properly styled */
    z-index: 999999 !important;

    /* Override any global styles that might interfere */
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;

    /* Ensure proper stacking */
    position: absolute !important;
  }

  /* Temperature and Time inputs */
  .input-temperature,
  .input-time {
    .input-wrapper {
      display: flex;
      align-items: center;
      border: ${forms.inputs.border.width} solid ${forms.inputs.border.color};
      border-radius: ${forms.inputs.border.radius};
      background-color: ${forms.inputs.background};
      transition: ${forms.inputs.transition};

      &:hover {
        border-color: ${forms.inputs.hover.border.color};
      }

      &:focus-within {
        border-color: ${forms.inputs.focus.border.color};
        box-shadow: 0 0 0 3px ${colors.primaryLight}20;
      }

      input {
        border: none;
        background: transparent;
        outline: none;
        flex: 1;
        padding: ${forms.inputs.padding};
        font-size: ${forms.inputs.text.fontSize};
        font-weight: ${forms.inputs.text.fontWeight};
        color: ${forms.inputs.text.color};

        &::placeholder {
          color: ${forms.inputs.placeholder.color};
          opacity: ${forms.inputs.placeholder.opacity};
          font-weight: ${forms.inputs.placeholder.fontWeight};
        }

        &:disabled {
          background-color: ${forms.inputs.disabled.background};
          color: ${forms.inputs.disabled.text.color};
          font-weight: ${forms.inputs.disabled.text.fontWeight};
          opacity: ${forms.inputs.disabled.opacity};
        }
      }

      .input-controls,
      .input-suffix {
        border-left: 1px solid ${colors.greyLight};
        padding: 0 0.5rem;
        color: ${colors.greyDark};
      }
    }

    /* Specific styling for disabled temperature/time inputs */
    &.disabled,
    &[disabled] {
      .input-wrapper {
        background-color: ${forms.inputs.disabled.background};
        border-color: ${forms.inputs.disabled.border.color};
        opacity: ${forms.inputs.disabled.opacity};
      }
    }
  }

  /* Times table specific styling */
  /* .times-table {
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
  } */
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
