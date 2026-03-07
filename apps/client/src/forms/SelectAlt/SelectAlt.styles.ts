import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';
import { forms } from 'forms/forms.config';

/**
 * Styles for SelectAlt component using PrimeReact Dropdown
 *
 * PrimeReact uses specific class names:
 * - .p-dropdown: Main container
 * - .p-dropdown-label: The input/display area
 * - .p-dropdown-trigger: The chevron icon container
 * - .p-dropdown-panel: The dropdown panel
 * - .p-dropdown-items-wrapper: Scrollable container for options
 * - .p-dropdown-item: Individual option
 */
export const styles = css`
  &.select-alt {
    width: 100%;

    /* Main dropdown container */
    .p-dropdown {
      width: 100%;
      border: ${forms.inputs.border.width} solid ${forms.inputs.border.color};
      border-radius: ${forms.inputs.border.radius};
      background: white;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      &:hover:not(.p-disabled) {
        border-color: ${colors.default};
      }

      &:focus-within,
      &.p-focus {
        border-color: ${colors.primary};
        box-shadow: 0 0 0 2px ${colors.primaryLight}40;
      }

      &.p-disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    /* Input/display area */
    .p-dropdown-label {
      font-size: 1rem;
      font-weight: 600;
      color: ${colors.textLight};
      padding: 0.5rem 0.75rem;
      background: white;
      border: none;
      outline: none;

      &::placeholder {
        color: ${colors.greyLight};
        opacity: 0.7;
      }

      &.p-placeholder {
        color: ${colors.greyLight};
        opacity: 0.7;
      }
    }

    /* Chevron icon container */
    .p-dropdown-trigger {
      width: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: ${forms.inputs.border.width} solid ${forms.inputs.border.color};
      background: white;
      border-top-right-radius: ${forms.inputs.border.radius};
      border-bottom-right-radius: ${forms.inputs.border.radius};

      .p-dropdown-trigger-icon {
        color: ${colors.textLight};
        transition: transform 0.2s ease;
      }
    }

    /* Dropdown panel */
    .p-dropdown-panel {
      background: white;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      border-radius: var(--radii-md);
      border: 1px solid ${colors.greyLight};
      overflow: hidden;
      margin-top: 0.25rem;
    }

    /* Scrollable options container */
    .p-dropdown-items-wrapper {
      max-height: 360px;
      overflow-y: auto;
    }

    /* Individual option styling */
    .p-dropdown-item {
      padding: 0.75rem 1rem;
      cursor: pointer;
      transition: background-color 0.15s ease;
      border-bottom: 1px solid ${colors.greyXXXLight};
      font-size: 0.875rem;
      font-weight: 600;
      color: ${colors.textLight};
      line-height: 1.4;

      &:last-child {
        border-bottom: none;
      }

      &:hover:not(.p-highlight):not(.p-disabled) {
        background-color: ${colors.greyXXXLight};
      }

      &.p-highlight {
        background-color: ${colors.defaultXXLight};
        color: ${colors.textLight};
      }

      &.p-disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* Empty option styling */
      &.p-dropdown-empty-message {
        text-align: center;
        font-style: italic;
        color: ${colors.greyLight};
      }
    }

    /* Clear icon styling */
    .p-dropdown-clear-icon {
      color: ${colors.greyLight};
      margin-right: 0.5rem;
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: ${colors.textLight};
      }
    }

    /* Editable input styling */
    .p-dropdown-label.p-inputtext {
      font-size: 1rem;
      font-weight: 600;
      color: ${colors.textLight};
      padding: 0.5rem 0.75rem;
      background: white;
      border: none;
      outline: none;
      width: 100%;

      &::placeholder {
        color: ${colors.greyLight};
        opacity: 0.7;
      }
    }
  }
`;
