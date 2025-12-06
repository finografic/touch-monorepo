import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  width: 100%;

  button {
    padding: 0.25rem;
    border-radius: 4px;
  }

  .table-container {
    width: 100%;
  }

  .action-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .p-datatable-wrapper {
    overflow-x: hidden;
    width: fit-content;
  }

  /* PrimeReact DataTable overrides */
  .product-translations-datatable {
    /* Smooth transitions for expandable row groups */
    /* Note: CSS transitions on table rows are limited - PrimeReact controls visibility directly */
    /* These transitions will work for properties that can be animated (opacity, transform, etc.) */
    .p-datatable-tbody {
      tr.p-rowgroup-header {
        transition: background-color 100ms ease-in-out;
        td {
          transition: opacity 100ms ease-in-out;
        }
      }
      tr:not(.p-rowgroup-header):not(.p-rowgroup-footer) {
        animation: fadeInRow 100ms ease-in-out;
      }
    }

    /* Keyframe animation for row appearance */
    @keyframes fadeInRow {
      from {
        opacity: 0.5;
        transform: translateY(0);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .p-datatable-thead > tr > th {
      background-color: ${colors.white};
      border-bottom: 2px solid ${colors.greyXLight75};
      font-weight: 700;
      padding: 1rem 2rem;
      font-size: 1.1rem;
    }

    span.rowgroup-header {
      padding: 0.5rem 1rem;
      display: block;
      width: 66vw;
      transform: translateY(-0.42rem);
      color: ${colors.text};
      -webkit-text-fill-color: ${colors.text};
    }

    /* TABLE HEADERS */
    .p-datatable-thead > tr > th span {
      transform: translate(0.5rem, 0);
      transform: translate(1rem, 0);
    }

    .p-datatable-thead > tr > th:first-of-type span {
      transform: translate(0.25rem, 0);
    }

    .p-datatable-thead > tr > th:last-of-type span {
      transform: translate(-1rem, 0);
    }

    .p-datatable-tbody {
      > tr > td {
        white-space: nowrap;
        padding: 0.5rem 2rem;
        height: 4rem;
        border-bottom: 2px solid ${colors.greyXXLight50};
        &:first-of-type {
          min-width: 180px;
          padding-left: 2.25rem;
          font-family: monospace;
          span {
            color: ${colors.info};
          }
        }

        .button-delete {
          transition: background-color 0.2s ease;
          background-color: ${colors.transparent};
          svg.icon-delete {
            width: 1.5rem;
            height: 1.5rem;
            color: ${colors.warningDark75};
          }
          &:hover {
            background-color: ${colors.dangerXXLight25};
            svg.icon-delete {
              color: ${colors.dangerDark};
            }
          }
        }
      }
    }

    /* ROW EDIT BUTTONS ===================================================== */

    td:has(button.p-row-editor-init, button.p-row-editor-save, button.p-row-editor-cancel) {
      padding-left: 0;
      padding-right: 0;
    }

    /* Row editor buttons styling */
    button.p-row-editor-init,
    button.p-row-editor-save,
    button.p-row-editor-cancel {
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      width: 32px;
      height: 32px;
      margin: 0 10px;
      border: 2px solid transparent !important;
      svg {
        width: 1.4rem;
        height: 1.4rem;
      }
    }

    button.p-row-editor-init {
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
        border: 2px solid transparent;
        padding: 0.4rem 1rem;
        border-radius: 4px;
        font-weight: 700;
        font-weight: 700;
        font-size: 0.9rem;
        color: ${colors.textXLight};
      }
    }

    td.p-cell-editing {
      input,
      input:hover {
        color: ${colors.text};
        border: 2px solid ${colors.infoXLight75};
        padding-top: 8px !important;
      }
    }

    /* Dirty field styling - fields that have been edited but not saved */
    .field-dirty {
      color: ${colors.warningXDark} !important;
    }

    /* Apply dirty styling to table cells containing dirty fields */
    td:not(:first-of-type):has(.field-dirty) {
      /* background-color: ${colors.warningXLight25} !important; */
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

    tr.p-rowgroup-header {
      .p-row-toggler {
        cursor: pointer;
        border: 2px solid transparent;
        position: absolute;
        transform: translate(0, -50%);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 66vw;
        height: 4rem;
        padding-left: 0.5rem;
        z-index: 100;
      }

      td {
        font-size: 1.1rem;
        font-weight: 700;
        padding-left: 0rem !important;
        span.p-rowgroup-header-name {
          color: ${colors.text};
          -webkit-text-fill-color: ${colors.text};
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          transform: translate(0, -50%);
          padding-left: 1.25rem;
          padding-top: 1rem;
          width: 66vw;
          height: 4rem;
        }
      }
    }

    tr.rowgroup-row {
      td:first-of-type {
        padding-left: 5.8rem;
      }
    }

    /* Hide placeholder rows - they're only used to create groups, not for display */
    /* Placeholder rows have a class added via rowClassName prop */
    tr.row-placeholder {
      display: none !important;
    }

    /* Hide row group footer (Total Subtypes row) */
    .p-rowgroup-footer {
      /* Footer is now visible to show count for empty groups */
      border-bottom: 2px solid ${colors.greyXXLight50};
      span {
        font-family: monospace;
        font-weight: 600;
        color: ${colors.textXXLight}!important;
        text-transform: lowercase;
        padding-left: 1.25rem;
      }
    }

    /* ====================================================================== */
  }
`;
