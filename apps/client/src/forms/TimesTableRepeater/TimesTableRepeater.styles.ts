import { css } from '@emotion/react';
import { colors } from 'styles';
import { cssFontMono } from 'styles/fonts.styles';

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
    /* background-color: ${colors.greyXXLight}AA; */
    border-radius: 6px 6px 0 0;
    border-bottom: none;
    font-weight: 500;
    font-size: 14px;
    color: var(--gray-11);

    .header-column {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 1rem 0.5rem 0.75rem;
      letter-spacing: 0.025em;
      span,
      code {
        font-size: 0.9rem;
        opacity: 0.66;
      }
      code {
        ${cssFontMono}
      }
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
    /* background-color: ${colors.greyXLight}!important; */

    &.row-editable {
      background-color: ${colors.white}; /* White background for editable rows */
    }

    &.row-disabled {
      background-color: ${colors.greyXXLight}; /* Light grey for disabled rows */
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
      border-top: 2px solid ${colors.greyXLight};
      .input-wrapper {
        padding: 0.5rem;
        padding-top: 1rem;
      }
    }

    &.last {
      border-radius: 0 0 6px 6px;
    }

    .action-button-container {
      width: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 4px;

      .random-button {
        opacity: 0.8;
        padding: 4px;
        transition: opacity 0.2s ease;

        &:hover {
          opacity: 1;
        }
      }

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
