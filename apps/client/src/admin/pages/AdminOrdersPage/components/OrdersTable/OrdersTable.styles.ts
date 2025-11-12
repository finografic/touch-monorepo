import { css } from '@emotion/react';

import { colors, min } from 'styles';

export const styles = css`
  width: 100%;
  height: 100%;
  background-color: ${colors.white};
  color: ${colors.text};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* ============================================================================
     PRIMEREACT DATATABLE CUSTOMIZATION
     ============================================================================ */

  .orders-datatable {
    font-size: 0.95rem;
    height: 100%;
    display: flex;
    flex-direction: column;

    /* Table header styling */
    .p-datatable-header {
      background-color: ${colors.white};
      border: none;
      padding: 1rem;
    }

    /* Scrollable wrapper */
    .p-datatable-wrapper {
      overflow-y: auto;
      flex: 1;
    }

    /* Column headers - STICKY */
    .p-datatable-thead > tr > th {
      background-color: ${colors.greyXXLight25};
      color: ${colors.textLight};
      font-weight: 700;
      padding: 0.75rem 1rem;
      border-bottom: 2px solid ${colors.greyLight};
      font-size: 0.9rem;
      position: sticky;
      top: 0;
      z-index: 100;
      background-color: ${colors.greyXXLight25}; /* Ensure solid background */
    }

    /* Filter inputs in header */
    .p-column-filter {
      width: 100%;
      margin-top: 0.5rem;

      input {
        width: 100%;
        padding: 0.4rem 0.6rem;
        font-size: 0.85rem;
        border: 2px solid ${colors.greyLight};
        border-radius: 4px;
        background-color: ${colors.white};
        opacity: 0.7;
        transition: all 0.2s ease;

        &:focus {
          opacity: 1;
          border-color: ${colors.infoLight};
          outline: none;
        }

        &::placeholder {
          color: ${colors.greyXLight};
          opacity: 0.6;
        }
      }
    }

    /* Table body rows */
    .p-datatable-tbody > tr {
      background-color: ${colors.white};

      /* Striped rows */
      &.p-row-odd {
        background-color: ${colors.backgroundLight};
      }

      > td {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid ${colors.greyXLight};
        color: ${colors.text};
      }
    }

    /* Empty message */
    .p-datatable-emptymessage {
      text-align: center;
      padding: 3rem 1rem;
      color: ${colors.greyDark};
      font-size: 1rem;
    }
  }

  /* ============================================================================
    ACTION BUTTONS
    ============================================================================ */

  .button-edit,
  .button-delete {
    transform: scale(0.85);
    padding: 0.5rem 0.5rem !important;
    transition: all 0.2s ease;

    svg.icon-edit,
    svg.icon-delete {
      width: 18px;
      height: 18px;
    }
  }

  .button-edit {
    svg.icon-edit {
      color: ${colors.infoLight};
    }

    &:hover {
      svg.icon-edit {
        color: ${colors.info};
      }
    }
  }

  .button-delete {
    svg.icon-delete {
      color: ${colors.greyXLight};
    }

    &:hover {
      svg.icon-delete {
        color: ${colors.danger};
      }
    }
  }

  /* ============================================================================
    PAGINATOR STYLES
     ============================================================================ */

  /* Paginator styling */
  .p-paginator {
    background-color: ${colors.white};
    border-top: 2px solid ${colors.greyLight};
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .p-paginator-pages {
      display: flex;
      gap: 0.25rem;

      .p-paginator-page {
        min-width: 2.5rem;
        height: 2.5rem;
        border-radius: 4px;
        border: 1px solid ${colors.greyLight};
        color: ${colors.text};
        transition: all 0.2s ease;

        &:hover {
          background-color: ${colors.infoXLight25};
          border-color: ${colors.infoLight};
        }

        &.p-highlight {
          background-color: ${colors.infoLight};
          border-color: ${colors.info};
          color: ${colors.white};
          font-weight: 700;
        }
      }
    }

    .p-paginator-first,
    .p-paginator-prev,
    .p-paginator-next,
    .p-paginator-last {
      min-width: 2.5rem;
      height: 2.5rem;
      border-radius: 4px;
      border: 1px solid ${colors.greyLight};
      color: ${colors.text};
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background-color: ${colors.infoXLight25};
        border-color: ${colors.infoLight};
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    .p-paginator-current {
      color: ${colors.textLight};
      font-size: 0.9rem;
    }
  }

  .action-buttons {
    display: flex;
    gap: 3rem;
    justify-content: center;
    align-items: center;
    margin: -1rem 2rem -1rem 0rem;
    height: 2rem;
    padding: 0 3rem 0 0;
  }

  .button-edit,
  .button-delete {
    transform: scale(1.2);
  }
`;
