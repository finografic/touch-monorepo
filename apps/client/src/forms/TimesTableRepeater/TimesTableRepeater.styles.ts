import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  width: 100%;

  &.times-table-repeater {
    width: 100%;
  }

  .table-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    gap: 8px;
    padding: 0;
    background-color: ${colors.greyXXLight}AA;
    border-radius: 6px 6px 0 0;
    border-bottom: none;
    font-weight: 500;
    font-size: 14px;
    color: var(--gray-11);

    .header-column {
      padding: 0.5rem;
    }
    .header-actions {
      width: 40px;
    }
  }

  .table-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    gap: 8px;
    padding: 0;

    &.even {
      background-color: var(--gray-1);
    }
    &.odd {
      background-color: var(--gray-2);
    }

    .input-wrapper {
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      border-radius: 4px;
      transition: all 0.2s ease;
      padding: 0.5rem;

      &:focus-within {
        /* outline: 2px solid var(--blue-8);
        background: var(--gray-1); */
      }
    }

    &.first {
      border-top: 1px solid var(--gray-6);
      .input-wrapper {
        padding: 0.5rem;
        padding-top: 1rem;
      }
    }

    &.last {
      border-radius: 0 0 6px 6px;
    }

    .delete-button-container {
      width: 40px;
      display: flex;
      justify-content: center;
      .delete-button {
        opacity: 0.7;
        padding: 4px;
      }
    }
  }

  .add-row-container {
    padding: 12px 16px;
    text-align: center;
  }
`;
