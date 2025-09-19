import { css } from '@emotion/react';
import { colors } from 'styles';

// Main component styles (for the input and container)
export const styles = css`
  .search-container {
    position: relative;
    width: 100%;
  }

  /* SearchableSelect input styling */
  .searchable-select {
    .rt-TextFieldInput {
      &::placeholder {
        color: ${colors.grey};
        opacity: 0.7;
        font-weight: 500;
      }
    }
  }
`;

// Dropdown portal styles (for the dropdown content rendered in portal)
export const stylesDropdown = css`
  background: white; /* Use explicit white instead of CSS variable */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-radius: var(--radius-3);
  border: 1px solid var(--gray-6);
  overflow: hidden;
  max-height: 300px;
  overflow-y: auto;

  .option {
    cursor: pointer;
    transition: background-color 0.15s ease;
    border-bottom: 1px solid var(--gray-3);
    padding: 0.75rem 1rem; /* Direct padding instead of using Flex p="3" */
    background: white; /* Ensure options have white background */

    &:last-child {
      border-bottom: none;
    }

    &:hover,
    &.focused {
      background-color: ${colors.primary20};
      /* background-color: yellow; */
    }

    &:active {
      background-color: var(--gray-3);
      background-color: pink;
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
      color: ${colors.text80};
      line-height: 1.4;
    }

    .option-label {
      font-size: 0.9rem; /* size="1" equivalent */
      color: ${colors.text33};
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
    border-top: 1px solid var(--gray-6);
    background: var(--gray-2);

    font-size: 0.75rem;
    color: var(--blue-11);
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
    background: var(--gray-2);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--gray-6);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--gray-8);
  }
`;
