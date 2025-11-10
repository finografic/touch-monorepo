import { css } from '@emotion/react';

import { colors, min } from 'styles';
import { cssInputText } from 'styles/forms/forms.FULL.styles';

export const styles = css`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.white};
  color: ${colors.text};

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
    ${cssInputText}
    background-color: transparent;
    svg.icon {
      stroke: ${colors.greyXXLight50};
      transform: scale(0.75) !important;
    }
  }
`;
