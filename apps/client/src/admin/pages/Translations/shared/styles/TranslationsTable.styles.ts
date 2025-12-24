import { css } from '@emotion/react';
import { colors, fontFamilies } from 'styles';
import { forms } from 'styles/forms/forms.styles';
import {
  ROW_HEIGHT,
  TABLE_BORDER,
  TABLE_HEAD_COLOR,
  TD_FONT_WEIGHT,
  TD_FONT_SIZE,
  TD_PADDING,
  TH_FONT_SIZE,
  TH_FONT_WEIGHT,
  COL_ACTIONS_WIDTH,
} from '../constants/translations-table.config';

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
        height: calc(${ROW_HEIGHT} * 0.66);
        border: 1px solid ${TABLE_HEAD_COLOR};
        border-top: none;
        th {
          text-align: left;
          padding: ${TD_PADDING};
          font-size: ${TH_FONT_SIZE};
          font-weight: ${TH_FONT_WEIGHT};
          color: ${colors.white};
        }
      }
    }

    /* =================================================================== */

    td {
      /* padding: 0.33rem 1rem;
      padding: 0.33rem 2rem; */

      input {
        padding: 0.33rem 1rem;
        border-style: solid;
        border-width: ${forms.inputs.border.width};
        border-color: ${colors.transparent};
        border-radius: ${forms.inputs.border.radius};
        font-size: ${TD_FONT_SIZE};
        font-weight: ${TD_FONT_WEIGHT};
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

      /* =================================================================== */

      /* ⭐ ROW PREVIOUS SIBLING to Group header row */
      &:has(+ .group-header) {
        border-bottom: 1px solid ${colors.transparent};
      }

      /* Group header row (for expandable table) */
      &.group-header {
        height: calc(${ROW_HEIGHT} * 0.75);
        td {
          height: ${ROW_HEIGHT};
          height: calc(${ROW_HEIGHT} * 0.75);
          font-size: ${TD_FONT_SIZE};
          font-weight: ${TD_FONT_WEIGHT};
          color: ${colors.info};
          user-select: none;
        }

        background-color: ${colors.greyXXLight25};
        background-color: ${colors.infoXLight25};
        border-top: 1px solid ${colors.transparent};
        border-bottom: 1px solid ${colors.transparent};
        border-left: 1px solid ${colors.infoXLight25};
        border-right: 1px solid ${colors.infoXLight25};

        .group-header-content {
          padding-right: 0.2rem;
        }
        .col-divider-language {
          padding-left: 2.25rem;
          font-weight: ${TH_FONT_WEIGHT};
        }
        .label-language {
          opacity: 0.6;
        }

        svg {
          height: 1.33rem;
          width: 1.33rem;
        }

        &:hover {
          /* background-color: ${colors.greyXXLight50}; */
        }

        &.expanded {
          background-color: ${colors.greyXXLight75};
          border: ${TABLE_BORDER};
          border-bottom: none;
        }

        border-top: none;
      }

      /* Column header row within expanded group (mimics thead) */
      &.group-subheader {
        background-color: ${TABLE_HEAD_COLOR};
        border: 1px solid ${TABLE_HEAD_COLOR};
        border-top: none;
        height: ${ROW_HEIGHT};
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

    .col-actions {
      width: ${COL_ACTIONS_WIDTH};
      max-width: ${COL_ACTIONS_WIDTH};

      button.button-delete {
        transform: translateX(-0.33rem);
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
    }

    /* Expandable table specific styles (simpler styling for product translations) */
    &.expandable {
      tr.group-header {
        /* Override with simpler styling for expandable tables */
        height: auto;
        td {
          height: auto;
          font-weight: 700;
        }
        background-color: ${colors.greyXXLight25};
        border: ${TABLE_BORDER};
        border-top: none;
        cursor: pointer;

        &:hover {
          background-color: ${colors.greyXXLight50};
        }

        &.expanded {
          background-color: ${colors.greyXXLight75};
          border: ${TABLE_BORDER};
          border-bottom: none;
        }
      }

      tr.group-subheader {
        height: 2.5rem;
      }

      /* Button delete outside col-actions scope for expandable tables */
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
    }

    td {
      padding: 0.33rem 1.25rem;
    }

    /* TOGGLE VISIBILITY KEY COLUMN */

    &.is-hidden-key-column {
      .col-key {
        display: none;
      }
      .col-actions {
        display: none;
      }

      .group-header {
        height: calc(${ROW_HEIGHT} * 0.6);
        .col-divider-language {
          padding: 0.33rem 2.25rem;
          height: calc(${ROW_HEIGHT} * 0.6);
        }
        .col-divider-language {
          transform: translateY(-0.3rem);
        }
      }

      .group-header-no-key {
        height: calc(${ROW_HEIGHT} * 0.6);
        border-bottom: transparent;
        .col-divider-title {
          height: calc(${ROW_HEIGHT} * 0.6);
          padding-left: 2.25rem;
          transform: translateY(0.3rem);
        }
      }
    }
  }
`;
