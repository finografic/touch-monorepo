import { css } from '@emotion/react';

import { colors, spacing } from 'styles';

export const styles = css`
  &.table-row {
    display: grid;
    grid-template-columns: 2.5rem 1fr 1fr 1fr 1fr auto; /* Fixed width for line numbers, temp, time A, time B, time C, actions */
    gap: ${spacing.default};
    align-items: center;
    padding: ${spacing.sm} 0; /* Remove horizontal padding to match header */
    border-bottom: 1px solid ${colors.greyXXLight};
    transition: background-color 0.15s ease;

    &.row-disabled {
      opacity: 0.7;
    }

    .input-wrapper {
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      border-radius: 4px;
      transition: all 0.2s ease;
      padding: 0 0.5rem;

      &:focus-within {
        /* outline: 2px solid var(--blue-8);
        background: var(--gray-1); */
      }
    }

    &.first {
      .input-wrapper {
        /* padding: 0.5rem; */
        padding-top: 0.5rem;
      }
      .rows-actions-container {
        padding-top: 0.5rem;
      }
    }

    .rows-actions-container {
      width: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 4px;
      padding-right: 1rem;

      .random-button {
        opacity: 0.8;
        padding: 4px;
        transition: opacity 0.2s ease;

        &:hover {
          opacity: 1;
        }
      }

      .delete-button {
        padding: 0.5rem 0.2rem 0.5rem 0.2rem;
        opacity: 1;
        svg.icon {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
`;
