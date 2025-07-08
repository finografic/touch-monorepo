import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  width: 100%;

  .time-table {
    width: 100%;
  }

  .time-table-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    gap: 8px;
    padding: 12px 16px;
    background-color: ${colors.greyXXLight}AA;
    border-radius: 6px 6px 0 0;
    border: 1px solid var(--gray-6);
    border-bottom: none;
    font-weight: 500;
    font-size: 14px;
    color: var(--gray-11);
  }

  .time-table-header-column {
    /* Header column styling if needed */
  }

  .time-table-header-actions {
    width: 40px;
  }

  .time-table-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    gap: 8px;
    padding: 0.5rem 0;
    border: 1px solid var(--gray-6);
    border-top: none;

    &.even {
      background-color: var(--gray-1);
    }

    &.odd {
      background-color: var(--gray-2);
    }

    &.first {
      border-top: 1px solid var(--gray-6);
    }

    &.last {
      border-radius: 0 0 6px 6px;
    }
  }

  .time-input-wrapper {
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    padding: 0.5rem 3rem 0.5rem 0rem;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:focus-within {
      outline: 2px solid var(--blue-8);
      background: var(--gray-1);
    }
  }

  .delete-button-container {
    width: 40px;
    display: flex;
    justify-content: center;
  }

  .delete-button {
    opacity: 0.7;
    padding: 4px;
  }

  .add-row-container {
    padding: 12px 16px;
    text-align: center;
  }
`;
