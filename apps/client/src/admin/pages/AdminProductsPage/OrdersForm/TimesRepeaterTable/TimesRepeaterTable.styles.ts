import { css } from '@emotion/react';

import { colors, layout } from '@workspace/design-system/tokens';
import { cssFontMono } from '../../../../../styles/fonts.styles';

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
    padding-right: var(--spacing-2);

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

  .table-row.row-disabled {
    .p-inputnumber-buttons-stacked {
    }
    .p-inputnumber-button-group {
      svg {
        opacity: 0.66;
      }
    }
    .p-inputgroup-addon {
      color: ${colors.greyXLight};
    }
    .time-controls-slot {
      svg {
        color: ${colors.grey};
      }
    }
  }
`;
