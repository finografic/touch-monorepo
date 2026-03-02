import { css } from '@emotion/react';

import { forms } from './forms.constants';
import { colors } from '@workspace/design-system/tokens';

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
      box-shadow: 0 0 0 3px ${colors.dangerDark25} !important;
    }
  }

  .field-warning input,
  .field-warning .rt-TextFieldInput,
  .field-warning .rt-TextFieldSlot,
  .field-warning .rt-SelectTrigger {
    border-color: ${colors.warningDark} !important;

    &:focus {
      box-shadow: 0 0 0 3px ${colors.warningDark25} !important;
    }
  }

  .field-success input,
  .field-success .rt-TextFieldInput,
  .field-success .rt-TextFieldSlot,
  .field-success .rt-SelectTrigger {
    border-color: ${colors.success} !important;

    &:focus {
      box-shadow: 0 0 0 3px ${colors.success25} !important;
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
