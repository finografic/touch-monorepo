import { css } from '@emotion/react';

import { border, colors, layout } from 'styles';
import { forms } from 'styles/forms/forms.styles';

// Main component styles (for the input and container)
export const styles = css`
  .search-container {
    position: relative;
    width: 100%;
  }

  .input-slot-left,
  .input-slot-right {
    border: ${forms.inputs.border.width} solid ${forms.inputs.border.color}!important;
  }

  .input-slot-left {
    border-right: none !important;
  }

  .input-slot-right {
    border-left: none !important;
  }

  /* Remove blue glow from root when input is focused */
  .rt-TextFieldRoot {
    &:focus-within {
      box-shadow: none !important;
      outline: none !important;
    }
  }

  .rt-TextFieldInput {
    &:focus {
      border: ${forms.inputs.border.width} solid ${forms.inputs.border.color} !important;
      /* Remove box-shadow glow from input itself */
      box-shadow: none !important;
      outline: none !important;
    }
  }
`;

// Dropdown portal styles (for the dropdown content rendered in portal)
export const stylesDropdown = css`
  background: ${colors.white};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-radius: ${border.radius.sm};
  border: ${layout.borderWidth} solid ${colors.greyXXLight};
  overflow: hidden;
  max-height: 300px;
  overflow-y: auto;

  .option {
    cursor: pointer;
    transition: background-color 0.15s ease;
    border-top: none;
    border-bottom: ${layout.borderWidth} solid ${colors.greyXXLight};
    padding: 0.75rem 1rem; /* Direct padding instead of using Flex p="3" */
    background: ${colors.white}; /* Ensure options have white background */

    &:last-child {
      border-bottom: none;
    }

    &:hover,
    &.focused {
      background-color: ${colors.greyXXLight50};
      border-color: ${colors.greyXXLight};
      border-top: none;
    }

    &:active {
      background-color: ${colors.greyXLight};
    }

    /* Text styling within options */
    .option-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .option-value {
      font-size: 0.9rem; /* size="2" equivalent */
      font-weight: 600; /* Remove bold */
      color: ${colors.text75};
      line-height: 1.4;
    }

    .option-label {
      font-size: 0.9rem; /* size="1" equivalent */
      color: ${colors.text25};
      font-weight: 600;
      line-height: 1.4;
    }
  }

  .add-new-option {
    padding: 0.5rem;
    display: flex;
    align-items: center;

    .new-option-label {
      margin-left: 0.75rem;
      font-size: 1rem;
      font-weight: 700;
      color: ${colors.successXDark};
      line-height: 1.4;
      .new-option-value {
        color: ${colors.successDark};
      }
    }

    button {
      cursor: pointer;
      padding: 0.25rem 0.75rem 0.25rem 0.25rem;
      font-weight: 700;
      svg.icon {
        width: 24px;
        height: 24px;
      }
    }
    /* .option-value {
      font-size: 1rem;
      font-weight: 700;
      color: ${colors.infoDark}!important;
      line-height: 1.4;
    } */
  }

  /* Window info styling */
  .window-info {
    padding: 0.5rem 1rem;
    text-align: center;
    border-top: ${layout.borderWidth} solid ${colors.greyLight};
    background: ${colors.greyXXLight};

    font-size: 0.75rem;
    color: ${colors.infoDark};
    line-height: 1.4;
  }

  /* Ensure flag images don't break layout */
  img {
    object-fit: cover;
    flex-shrink: 0;
  }

  /* Custom scrollbar for dropdown */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${colors.greyXXLight};
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.greyLight};
    border-radius: ${border.radius.sm};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${colors.greyDark};
  }
`;
