import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';
import { forms } from 'styles/forms/forms.constants';

// ======================================================================== //
// INPUT STYLES + RADIX OVERRIDES
// ======================================================================== //

export const formsInputs = css`
  input {
    text-indent: 0;
  }
  input:not(:disabled):not(:focus) {
    color: ${colors.text};
  }
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

  .search-icon-slot,
  .action-icon-slot {
    /* Search and action icons */
    color: ${colors.greyDark};
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
        box-shadow: 0 0 0 3px ${colors.primaryLighter};
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

        &:disabled {
          background-color: ${forms.inputs.disabled.background};
          color: ${forms.inputs.disabled.text.color}!important;
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

  /* .rt-TextFieldInput:where(:disabled, :read-only), */
  input:read-only {
    opacity: 0.45;
    border-color: ${colors.greyLight};
    background-color: ${colors.greyXXXLight};
    color: ${colors.textXDark};
    -webkit-text-fill-color: ${colors.textXDark};
    font-weight: ${forms.inputs.readOnly.text.fontWeight};
  }

  /***** NEW: WIP.. !!!!! *****/
  input:hover:not(:disabled):not(:focus) {
    border-color: ${forms.inputs.border.color};
  }
`;
