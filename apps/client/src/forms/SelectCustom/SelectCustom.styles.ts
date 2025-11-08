import { css } from '@emotion/react';

import { colors } from 'styles';
import { forms } from 'styles/forms/forms.constants';
import { cssForms } from 'styles/forms/forms.styles';
// import { cssPlaceholder } from 'styles/forms/forms-inputs.styles';

export const styles = css`
  &.searchable-select {
    .search-container {
      position: relative;
      width: 100%;
      .rt-TextFieldRoot {
        outline: none;
      }
    }

    .rt-TextFieldInput {
      color: var(--gray-12) !important; /* Force white text for readonly input */
      background-color: white !important;
      cursor: pointer !important; /* Make entire input clickable */

      &::placeholder {
        color: ${colors.grey};
        opacity: 0.7;
        font-weight: 500;
      }
    }

    *,
    *:focus {
      box-shadow: none !important;
      border: none !important;
    }

    input {
      font-size: 1rem !important;
      font-weight: 600 !important;
      opacity: 1 !important;
      background-color: white !important;
      box-shadow: none !important;
      &,
      &:focus {
        border: none !important;
        border-left: ${forms.inputs.border.width} solid ${forms.inputs.border.color} !important;
        border-top: ${forms.inputs.border.width} solid ${forms.inputs.border.color} !important;
        border-bottom: ${forms.inputs.border.width} solid ${forms.inputs.border.color} !important;
      }
    }
  }

  /* NOTE: SLOT-RIGHT (CHEVRON) - Override Radix TextFieldSlot sizing and spacing */
  .rt-TextFieldRoot:where(.rt-r-size-3) :where(.rt-TextFieldSlot),
  .rt-TextFieldSlot:where([data-side='right']),
  .rt-TextFieldSlot:where(.rt-TextFieldSlot:not([data-side='left'])) {
    gap: var(--space-2) !important;
    padding-left: var(--space-2) !important;
    padding-right: var(--space-2) !important;
    border-top-right-radius: ${forms.inputs.border.radius} !important;
    border-bottom-right-radius: ${forms.inputs.border.radius} !important;
    border: ${forms.inputs.border.width} solid ${forms.inputs.border.color} !important;
  }
`;

// Dropdown portal styles (for the dropdown content rendered in portal)
export const stylesDropdown = css`
  background: white; /* Use explicit white instead of CSS variable */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-radius: var(--radius-3);
  border: 1px solid var(--gray-6);
  overflow: hidden;
  max-height: 360px;
  overflow-y: auto;

  .option {
    /* font-weight: 600 !important; */
    cursor: pointer;
    transition: background-color 0.15s ease;
    border-bottom: 1px solid var(--gray-3);
    padding: 0.75rem 1rem; /* Direct padding instead of using Flex p="3" */
    background: white; /* Ensure options have white background */

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: ${colors.greyXXLight25};
    }

    &.focused,
    &:active {
      background-color: ${colors.defaultXLight25};
    }

    /* Text styling within options */
    .option-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .option-value {
      font-size: 0.875rem;
      font-weight: 400;
      color: var(--gray-12);
      line-height: 1.4;
    }

    .option-label {
      font-size: 0.75rem;
      /* color: var(--gray-9); */

      font-weight: 400;
      line-height: 1.4;
    }
  }

  /* Ensure flag images don't break layout */
  img {
    object-fit: cover;
    flex-shrink: 0;
  }

  /* ${cssForms} */

  /***** PLACEHOLDERS *****/
`;
