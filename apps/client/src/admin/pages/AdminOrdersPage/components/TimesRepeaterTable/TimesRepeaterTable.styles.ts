import { css } from '@emotion/react';

import { colors, layout, spacing } from 'styles';
import { cssFontMono } from 'styles/fonts/fonts.styles';

export const styles = css`
  width: 100%;
  display: flex;
  flex-direction: column;

  &.times-table-repeater {
    width: 100%;
  }

  /* TODO: Consider extracting to component: <RepeaterTableHeader />
   * Self-contained table header with:
   * - Grid layout configuration
   * - Header column styling
   * - Sticky positioning
   * Could accept column configs as props
   * Lines: 15-51
   */
  .table-header {
    display: grid;
    grid-template-columns: 2.8rem 1fr 1fr 1fr 1fr auto;
    gap: 8px;
    padding: 0;
    position: sticky;
    top: 0;
    z-index: 1;

    .header-column {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 1rem 0.5rem 0.75rem;
      display: flex;
      align-items: center;
      font-weight: 500;
      font-size: 14px;
      color: var(--gray-11);

      letter-spacing: 0.025em;

      span,
      code {
        font-size: 0.9rem;
        opacity: 0.66;
      }
      code {
        ${cssFontMono}
      }

      &.header-number {
      }
      &.header-actions {
        width: 64px;
      }
    }
  }

  .line-number-header {
    width: 2.5rem;
  }

  .table-rows-container {
    overflow-y: visible; /* Changed from auto to visible - no scrollbar */
    border: 1px solid transparent;
  }

  .table-header {
    border-bottom: 1px solid ${colors.greyXXLight};
  }

  .table-footer {
  }

  /* TODO: Consider extracting to component: <RepeaterTableRow />
   * Complex row component with:
   * - Grid layout matching header
   * - Multiple input wrappers (temperature, time fields)
   * - Row state management (disabled, first, validation)
   * - Action buttons (random, delete)
   * Could accept: rowData, isEditable, isFirst, handlers as props
   * Lines: 69-135
   */
  .table-row {
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

  /* TODO: Consider extracting to component: <LineNumberCell />
   * Simple presentational component displaying row number
   * Could accept: number, isActive props
   * Very reusable across different table contexts
   * Lines: 137-148
   */
  .line-number-cell {
    width: 2.5rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: ${spacing.sm};

    span {
      font-weight: 700;
      color: ${colors.greyLight}; /* Changed from greyXLight to greyLight */
    }
  }

  /* TODO: Consider extracting to component: <TableFooter />
   * Footer section with:
   * - Add row button
   * - Row counter display
   * Could accept: onAddRow, currentRows, totalRows, canAddRow props
   * Lines: 150-165
   */
  .add-row-container {
    display: flex;
    justify-content: center;
    padding: 1.5rem 1.5rem 0;
    border-top: 1px solid ${colors.greyXXLight};
  }

  .total-rows-counter {
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 14px;
    color: var(--gray-11);
    letter-spacing: 0.025em;
    padding: 0.25rem 0;
  }
`;
