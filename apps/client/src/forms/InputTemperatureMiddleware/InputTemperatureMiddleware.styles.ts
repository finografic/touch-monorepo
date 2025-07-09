import { css } from '@emotion/react';
import { colors } from 'styles/colors.styles';
import { forms } from 'styles/forms.styles';

export const styles = css`
  /* Follow the established .input-temperature pattern from forms.styles.ts */
  position: relative;
  width: 100%;

  .input-wrapper {
    display: flex;
    align-items: center;
    height: ${forms.inputs.height}; /* 2.5rem - matches other form inputs */
    border: ${forms.inputs.border.width} solid ${forms.inputs.border.color};
    border-radius: ${forms.inputs.border.radius};
    background-color: ${forms.inputs.background};
    transition: ${forms.inputs.transition};

    &:hover:not(:has(input:disabled)) {
      border-color: ${forms.inputs.hover.border.color};
    }

    &:focus-within {
      border-color: ${forms.inputs.focus.border.color};
      box-shadow: 0 0 0 3px ${colors.primaryLight}20;
    }

    /* Disabled state */
    &:has(input:disabled) {
      background-color: ${forms.inputs.disabled.background};
      border-color: ${forms.inputs.disabled.border.color};
      opacity: ${forms.inputs.disabled.opacity};
    }
  }

  .temperature-input {
    border: none;
    background: transparent;
    outline: none;
    flex: 1;
    padding: ${forms.inputs.padding};
    font-size: ${forms.inputs.text.fontSize};
    font-weight: ${forms.inputs.text.fontWeight};
    color: ${forms.inputs.text.color};
    text-align: right;
    padding-right: 0.5rem; /* Less padding on right to make room for controls */

    &::placeholder {
      color: ${forms.inputs.placeholder.color};
      opacity: ${forms.inputs.placeholder.opacity};
      font-weight: ${forms.inputs.placeholder.fontWeight};
    }

    &:disabled {
      color: ${forms.inputs.disabled.text.color};
      font-weight: ${forms.inputs.disabled.text.fontWeight};
      cursor: not-allowed;
    }
  }

  .input-controls {
    border-left: 1px solid ${colors.greyLight};
    padding: 0 0.25rem;
    color: ${colors.greyDark};
    display: flex;
    flex-direction: column;
    gap: 1px;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  .step-up,
  .step-down {
    height: 18px !important;
    width: 24px !important;
    color: ${colors.greyDark};
    transition: color 0.15s ease;

    &:hover:not(:disabled) {
      color: ${colors.text};
    }

    &:disabled {
      color: ${colors.greyLight};
      opacity: 0.5;
      cursor: not-allowed;
    }

    svg {
      height: 12px !important;
      width: 12px !important;
    }
  }

  /* Error state styling */
  &.field-error .input-wrapper {
    border-color: ${colors.dangerDark} !important;

    &:focus-within {
      box-shadow: 0 0 0 3px ${colors.dangerDark}20 !important;
    }
  }

  /* Warning state styling */
  &.field-warning .input-wrapper {
    border-color: ${colors.warningDark} !important;

    &:focus-within {
      box-shadow: 0 0 0 3px ${colors.warningDark}20 !important;
    }
  }
`;
