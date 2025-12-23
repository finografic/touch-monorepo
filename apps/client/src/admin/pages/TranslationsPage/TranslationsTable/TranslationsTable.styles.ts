import { css } from '@emotion/react';
import { colors, fontFamilies } from 'styles';
import { forms } from 'styles/forms/forms.styles';
import { ROW_HEIGHT, TABLE_BORDER, TABLE_HEAD_COLOR, TD_PADDING } from './translations-table.config';

export const styles = css`
  width: 100%;

  table {
    width: 100%;
    border-collapse: collapse;
    &.expandable {
      border: ${TABLE_BORDER};
    }

    thead {
      background-color: ${TABLE_HEAD_COLOR};
      tr {
        border: 1px solid ${TABLE_HEAD_COLOR};
        border-top: none;
        th {
          padding: ${TD_PADDING};
          text-align: left;
          font-size: 1.1rem;
          font-weight: 700;
          color: ${colors.white};
        }
      }
    }

    td {
      padding: 0.33rem 1rem;

      input {
        padding: 0.33rem 1rem;
        border-width: ${forms.inputs.border.width};
        border-style: solid;
        border-color: ${colors.transparent};
        border-radius: ${forms.inputs.border.radius};
        font-size: 1rem;
        font-weight: 700 !important;
        color: ${colors.textXLight};
        -webkit-text-fill-color: ${colors.textXLight};
        background-color: ${colors.white}!important;
      }

      input:hover:not(:readonly) {
        border-color: ${colors.infoLight}!important;
        background-color: ${colors.white};
        color: ${colors.textDark};
        -webkit-text-fill-color: ${colors.textDark};
        cursor: pointer;
      }

      input.input-dirty {
        color: ${colors.warningXDark};
        -webkit-text-fill-color: ${colors.warningXDark};
      }

      input:focus {
        outline: none !important;
        box-shadow: none !important;
        border-color: ${colors.infoLight};
        background-color: ${colors.white};
        color: ${colors.textDark};
        -webkit-text-fill-color: ${colors.textDark};
        cursor: text;
      }
    }

    tbody {
      background-color: ${colors.white};
    }

    tr {
      border: ${TABLE_BORDER};
      border-top: none;
      transition: background-color 0.2s ease;
      height: ${ROW_HEIGHT};

      /* Group header row (for expandable table) */
      &.group-header {
        td {
          user-select: none;
          font-weight: 700;
          color: ${colors.info};
        }
        background-color: ${colors.greyXXLight25};
        border: ${TABLE_BORDER};
        border-top: none;
        cursor: pointer;
        svg {
          height: 1.33rem;
          width: 1.33rem;
        }
        &:hover {
          background-color: ${colors.greyXXLight50};
        }
        &.expanded {
          background-color: ${colors.greyXXLight75};
          border: ${TABLE_BORDER};
          border-bottom: none;
        }
        border-top: none;
        .group-header-content {
          padding-right: 0.2rem;
        }
        .col-divider-language {
          padding-left: 2.25rem;
        }
      }

      /* Column header row within expanded group (mimics thead) */
      &.group-subheader {
        background-color: ${TABLE_HEAD_COLOR};
        border: 1px solid ${TABLE_HEAD_COLOR};
        border-top: none;
        height: 2.5rem;
        td {
          padding: ${TD_PADDING};
          text-align: left;
          font-size: 1.1rem;
          font-weight: 700;
          color: ${colors.white};
        }
      }
      &.group-placeholder {
        border: ${TABLE_BORDER};
        border-top: none;
        height: ${ROW_HEIGHT};

        td {
          padding: ${TD_PADDING};
          text-align: center;
          text-indent: -2rem;
          font-weight: 700;
          color: ${colors.textXXLight};
        }
      }

      /* Page divider row (non-interactive section header) */
      &.page-divider-row {
        background-color: ${colors.greyXXLight25};
        border: ${TABLE_BORDER};
        border-top: 2px solid ${colors.info};
        height: auto;
        cursor: default;
        user-select: none;

        .page-divider-cell {
          padding: ${TD_PADDING};
          font-weight: 700;
          font-size: 1.1rem;
          color: ${colors.info};
          text-align: left;
          border: none;

          /* First cell (page title) */
          &:first-child {
            color: ${colors.info};
            font-weight: 700;
          }

          /* Language code cells */
          &:not(:first-child):not(:last-child) {
            color: ${colors.textXXLight};
            font-weight: 500;
            font-size: 0.9rem;
            text-align: center;
          }

          /* Last cell (empty for delete column) */
          &:last-child {
            border: none;
          }
        }

        &:hover {
          background-color: ${colors.greyXXLight50};
        }
      }

      /* Row is being edited (has focus) */
      &.row-editing {
        input {
          border-color: ${colors.greyXXLight};
          background-color: ${colors.white};
          color: ${colors.textXLight};
          -webkit-text-fill-color: ${colors.textXLight};
        }
        input[readonly] {
          color: ${colors.text}!important;
          -webkit-text-fill-color: ${colors.text}!important;
        }
      }

      /* Row has unsaved changes */
      input &.row-dirty,
      input {
        ::-webkit-input-placeholder,
        ::-moz-placeholder,
        :-ms-input-placeholder,
        ::placeholder {
          text-indent: 1rem;
          /* padding-left: 1.5rem; */
          /* transform: translateX(2rem); */
          color: ${colors.grey75};
          -webkit-text-fill-color: ${colors.grey75};
          opacity: 1;
        }
      }
    }

    td.col-key,
    td.col-key:hover {
      input[readonly] {
        transform: translateX(-1rem);
        font-family: ${fontFamilies.mono};
        font-weight: 500;
        font-size: 1rem;
        color: ${colors.textXXLight};
        -webkit-text-fill-color: ${colors.textXXLight};
        background-color: ${colors.transparent};
        border: 2px solid ${colors.transparent};
        cursor: default;
        user-select: none;
        opacity: 0.66 !important;
      }
    }
  }

  button.button-delete {
    transform: translateX(1rem);
    padding: 0rem 0.66rem;
    svg.icon {
      width: 1.5rem;
      height: 1.5rem;
      color: ${colors.danger};
      opacity: 0.66;
    }
    &:hover {
      background-color: ${colors.dangerLight25};
      svg {
        color: ${colors.dangerDark};
        opacity: 1;
      }
    }
  }
`;
