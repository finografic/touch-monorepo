import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';

export const styles = css`
  &.table-row {
    display: grid;
    grid-template-columns: 2.5rem 1fr 1fr 1fr 1fr auto; /* Fixed width for line numbers, temp, time A, time B, time C, actions */
    gap: var(--spacing-4);
    align-items: center;
    padding: var(--spacing-2) 0; /* Remove horizontal padding to match header */
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

      button,
      button.button-delete,
      button.random-button {
        transition: opacity 0.2s ease;
        padding: 0;
        width: 36px;
        height: 36px;
        svg.icon {
          transform: scale(0.7) !important;
        }
      }

      button.random-button {
        svg {
          transform: scale(1.2) !important;
        }
      }

      /* .random-button {
        opacity: 0.8;
        padding: 4px;
        transition: opacity 0.2s ease;

        &:hover {
          opacity: 1;
        }
      } */

      /* .button-delete {
        padding: 0.5rem 0.2rem 0.5rem 0.2rem;
        opacity: 1;
        svg.icon {
          width: 18px;
          height: 18px;
        }
      } */
    }
  }
`;
