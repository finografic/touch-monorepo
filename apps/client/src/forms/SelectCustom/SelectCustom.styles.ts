import { css } from '@emotion/react';
import { colors } from 'styles';

// Main component styles (for the input and container)
export const styles = css`
  .search-container {
    position: relative;
    width: 100%;
  }

  /* SelectCustom input styling - matching SelectSearchable structure */
  .searchable-select {
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

    /* Make the right slot (chevron) clickable */
    .input-slot-right {
      cursor: pointer !important;
      pointer-events: auto !important;

      svg {
        cursor: pointer !important;
      }
    }
  }
  input {
    background-color: white !important;
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
      background-color: var(--gray-2);
    }

    &:active {
      background-color: var(--gray-3);
    }

    /* Text styling within options */
    .option-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .option-value {
      font-size: 0.875rem; /* size="2" equivalent */
      font-weight: 400; /* Remove bold */
      color: var(--gray-12);
      line-height: 1.4;
    }

    .option-label {
      font-size: 0.75rem; /* size="1" equivalent */
      color: var(--gray-9);
      font-weight: 400;
      line-height: 1.4;
    }
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
