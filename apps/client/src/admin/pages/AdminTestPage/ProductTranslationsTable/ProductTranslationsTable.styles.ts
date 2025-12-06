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
      border-bottom: 2px solid ${colors.greyXLight75};
      font-weight: 700;
      padding: 1rem 2rem;
      font-size: 1rem;
      &:first-of-type {
        opacity: 0.5;
      }
    }

    .p-datatable-thead > tr > th:last-of-type span {
      transform: translate(-1rem, 0);
    }

    .p-datatable-tbody > tr {
      > td {
        height: 4rem;
        border-bottom: 2px solid ${colors.greyXXLight50};

        &:first-of-type {
          padding-left: 2rem;
          opacity: 0.6;
          font-family: monospace;
          span {
            color: ${colors.infoDark};
          }
        }

        .button-delete {
          svg.icon-delete {
            width: 1.4rem;
            height: 1.4rem;
            color: ${colors.warningDark75};
            &:hover {
              color: ${colors.dangerDark};
            }
          }
        }
      }
    }

    /* Row editor buttons styling */
    .p-row-editor-init,
    .p-row-editor-save,
    .p-row-editor-cancel {
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      width: 32px;
      height: 32px;
      margin: 0 10px;
      transform: translateX(1rem);
      border: 2px solid transparent !important;
      svg {
        width: 1.4rem;
        height: 1.4rem;
      }
    }

    button.p-row-editor-init {
      margin-right: 44px;
      margin-right: 64px;
      color: ${colors.infoLight};
      &:hover {
        background-color: ${colors.infoXLight50};
        color: ${colors.infoDark};
      }
    }

    button.p-row-editor-save {
      color: ${colors.success};
      &:hover {
        background-color: ${colors.successXLight50};
        color: ${colors.successDark};
      }
    }

    button.p-row-editor-cancel {
      color: ${colors.warningDark75};
      &:hover {
        background-color: ${colors.dangerXLight25};
        color: ${colors.dangerDark};
      }
    }

    td.p-editable-column {
      padding: 0.75rem 2rem;
      margin: 1rem 2rem;
      span,
      input {
        padding: 0.4rem 1rem;
        border: 2px solid transparent;
        border-radius: 4px;
        font-weight: 700;
        font-size: 0.9rem;
        color: ${colors.textXLight};
      }
    }

    td:not(.p-cell-editing) {
      input {
        color: ${colors.textXLight};
        border: 2px solid ${colors.greyXXLight};
        border-radius: 4px;
      }
    }
    td.p-cell-editing {
      input,
      input:hover {
        color: ${colors.text};
        border: 2px solid ${colors.greyXXLight};
        border: 2px solid ${colors.infoXLight75}!important;
      }
    }

    /* Dirty field styling - fields that have been edited but not saved */
    .field-dirty {
      color: ${colors.warningXDark} !important;
    }

    /* Apply dirty styling to table cells containing dirty fields */
    td:has(.field-dirty) {
      background-color: ${colors.warningXLight25} !important;
      box-shadow: inset 10px 0 0 12px ${colors.white} !important;
    }

    /* Dirty field styling in editing mode */
    td.p-cell-editing:has(.field-dirty) {
      input {
        background-color: ${colors.infoXLight25} !important;
        border-color: ${colors.infoLight} !important;
        color: ${colors.infoDark} !important;
      }
    }
  }
`;
