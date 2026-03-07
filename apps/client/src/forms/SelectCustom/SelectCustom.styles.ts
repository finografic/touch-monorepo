import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';
import { stylesPlaceholder } from '../../styles/forms-placeholders.styles';

export const styles = css`
  &.searchable-select {
    .search-container {
      position: relative;
      width: 100%;
    }

    .ds-input-field {
      outline: none;
      cursor: pointer;

      &:focus-within {
        box-shadow: none;
      }
    }

    .ds-input-field__input {
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      background-color: white;
    }
  }
`;

// Dropdown portal styles (for the dropdown content rendered in portal)
export const stylesDropdown = css`
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-radius: var(--radius-3);
  border: 1px solid var(--gray-6);
  overflow: hidden;
  max-height: 360px;
  overflow-y: auto;

  .option {
    cursor: pointer;
    transition: background-color 0.15s ease;
    border-bottom: 1px solid var(--gray-3);
    padding: 0.75rem 1rem;
    background: white;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: ${colors.greyXXXLight};
    }

    &.focused,
    &:active {
      background-color: ${colors.defaultXXLight};
    }

    .option-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .option-value {
      font-size: 0.875rem;
      font-weight: 600;
      color: ${colors.textLight};
      line-height: 1.4;
    }

    .option-label {
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1.4;
    }

    &.empty-option {
      ${stylesPlaceholder}
      opacity: 0.66;
      font-weight: 600;
    }
  }

  img {
    object-fit: cover;
    flex-shrink: 0;
  }
`;
