import { css } from '@emotion/react';

import { colors, min } from 'styles';

export const styles = css`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.white};
  color: ${colors.text};

  /* ============================================================================
     PRIMEREACT DATATABLE CUSTOMIZATION
     ============================================================================ */

  .orders-datatable {
    font-size: 0.95rem;

    /* Table header styling */
    .p-datatable-header {
      background-color: ${colors.white};
      border: none;
      padding: 1rem;
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
      z-index: 1;
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
      transition: background-color 0.15s ease;

      &:hover {
        background-color: ${colors.greyXXLight25};
      }

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
     LEGACY STYLES (kept for backwards compatibility)
     ============================================================================ */

  .rt-TableHeader {
    /* position: fixed; */
    display: inline-table !important;
    background-color: ${colors.white};
    z-index: 999999;
    /* transform: translate(-1rem, -120px) !important; */
    /* top: 400px; */

    width: 100% !important;
    max-width: 1240px !important;
    max-height: 40px !important;

    ${min.sm} {
      max-width: 96vw !important;
    }
    ${min.md} {
      max-width: 96vw !important;
    }
    ${min.lg} {
      /* max-width: 96vw !important; */
    }
    ${min.xl} {
      max-width: 1240px !important;
    }

    /* Target the row inside the header */
    .rt-TableRow {
      box-shadow: none !important;
      border-bottom: none !important;
    }

    /* Target header cells */
    .rt-TableCell {
      box-shadow: none !important;
      border-bottom: none !important;
    }

    input {
      border: 2px solid ${colors.greyLight} !important;
    }
  }

  /* TABLE_HEADER_CELLS ============================ */
  .th,
  .rt-TableCell.rt-TableColumnHeaderCell.th {
    font-size: 1rem;
    font-weight: 700;
    color: ${colors.greyXLight};

    border-bottom: 1px solid transparent !important;
    transform: translate(-1rem, -0.5rem) !important;
    &:nth-of-type(1) {
      transform: translate(0.33rem, -0.5rem) !important;
    }

    &:nth-of-type(2) {
      transform: translate(0.5rem, -0.5rem) !important;
    }

    .rt-Text {
      transform: translate(0, -0.25rem) !important;
    }
  }

  .th-index,
  .th-mode,
  .th-drinkType,
  .th-subtype,
  .th-volume,
  .th-container,
  .th-temperature {
    /* width: 60px !important; */
    /* border: 1px solid red !important; */
    /* width: 100px; */
    /* display: table-cell;
    text-align: center; */
  }

  input {
    opacity: 0.5 !important;
  }

  .th-action {
    /* width: 100px; */
    display: table-cell;
    text-align: center;
  }

  .th-edit,
  .th-delete {
    width: 30px !important;
    max-width: 30px !important;
    padding: 0.75rem 0rem !important;
  }

  /* TABLE_BODY =============================== */

  .td-edit,
  .td-delete {
    width: 30px !important;
    max-width: 30px !important;
    padding: 0.75rem 0rem !important;
  }

  .rt-TableBody.table-body {
    padding-top: 2rem;
    /* transform: translate(0, 2rem) !important; */

    .rt-TableRow {
      /* display: flex;
          align-items: center;
          width: 100%; */
    }
    .td {
      vertical-align: middle;
    }

    .td-mode {
      transform: translate(1rem, 0) !important;
    }

    .button-edit {
      svg.icon-edit {
        /* color: ${colors.infoXLight}; */
      }
    }
    .button-delete {
      svg.icon-delete {
        color: ${colors.greyXXLight};
        &:hover {
          color: #aa0000;
        }
      }
    }

    .button-edit,
    .button-delete {
      transform: scale(0.8);
      padding: 0.5rem 0.5rem !important;
    }
  }

  .td {
    height: 60px;
    display: table-cell;
    vertical-align: middle;
  }

  .td-order-id {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-right: 1rem;
  }

  .td-index {
    font-weight: 900 !important;
    opacity: 0.4;
  }

  .td-action {
    /* width: 100px; */
    display: table-cell;
    text-align: center;
  }

  /* ACTIONS =============================== */

  .action-edit,
  .action-delete {
    /* width: 60px; */
  }

  .td-action button {
    opacity: 0.5 !important;
    svg.icon {
      width: 24px;
      height: 24px;
    }

    &:hover {
      cursor: pointer;
      opacity: 1;
    }
    &.active {
      opacity: 0.8;
      &:hover {
        opacity: 1;
      }
    }
  }

  .td-action.action-edit button {
    color: ${colors.infoXDark};
    background-color: transparent;

    &:hover {
      color: ${colors.successXDark};
      background-color: ${colors.success25};
    }
    &.active {
      color: ${colors.warningDark};
      background-color: transparent;
      &:hover {
        color: ${colors.warningDark};
        background-color: ${colors.warning25};
      }
    }
  }

  .td-action.action-delete button {
    opacity: 0.75;
    color: ${colors.infoXDark};
    background-color: transparent;

    &:hover {
      color: ${colors.successXDark};
      background-color: ${colors.success25};
    }
    &.active {
      color: ${colors.warningDark};
      background-color: transparent;
      &:hover {
        color: ${colors.warningDark};
        background-color: ${colors.warning25};
      }
    }
  }

  .column-search-input {
    /* ${cssInputText} */
    background-color: transparent;
    svg.icon {
      stroke: ${colors.greyXXLight50};
      transform: scale(0.75) !important;
    }
  }
`;
