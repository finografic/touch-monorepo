import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  width: 100%;

  .table-container {
    width: 100%;
  }

  .td-name {
    font-weight: 600;
    color: ${colors.text};
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
  }

  .button {
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }

  .button-edit {
    color: ${colors.infoDark};
  }

  .button-delete {
    color: ${colors.danger};
  }

  .icon-edit,
  .icon-delete {
    width: 1rem;
    height: 1rem;
  }

  /* PrimeReact DataTable overrides */
  .product-translations-datatable {
    .p-datatable-thead > tr > th {
      background-color: ${colors.white};
      border-bottom: 2px solid ${colors.greyLight};
      font-weight: 600;
      padding: 0.75rem;
    }

    .p-datatable-tbody > tr {
      &:hover {
        background-color: ${colors.greyXXLight};
      }

      > td {
        padding: 0.75rem;
        border-bottom: 1px solid ${colors.greyXXLight};
      }
    }

    .p-datatable-filter {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid ${colors.greyLight};
      border-radius: 4px;
      font-size: 0.875rem;
    }

    /* Row editor buttons styling */
    .p-row-editor-init,
    .p-row-editor-save,
    .p-row-editor-cancel {
      margin: 0 0.25rem;
      padding: 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }

    /* Editable cell input styling */
    .p-cell-editor input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid ${colors.greyLight};
      border-radius: 4px;
      font-size: 0.875rem;
    }
  }
`;
