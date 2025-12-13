import { css } from '@emotion/react';
import { colors, fontFamilies } from 'styles';
import { forms } from 'styles/forms/forms.styles';

export const styles = css`
  width: 100%;

  table {
    width: 100%;
    border-collapse: collapse;

    thead {
      background-color: ${colors.info75};
      tr {
        border: 1px solid ${colors.info75};
        border-top: none;
        th {
          padding: 0.5rem 2rem 0.6rem 2.2rem;
          text-align: left;
          font-size: 1.1rem;
          font-weight: 700;
          color: ${colors.white};
        }
      }
    }

    td {
      padding: 0.5rem 1rem;

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
        background-color: ${colors.white};
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
      border: 1px solid ${colors.greyLight50};
      border-top: none;
      transition: background-color 0.2s ease;

      /* Group header row (for expandable table) */
      &.group-header {
        border: 1px solid ${colors.greyLight50};
        border-top: none;
        height: 3.5rem !important;
        background-color: ${colors.info75};
        background-color: ${colors.infoLight50};
        background-color: ${colors.greyXLight25};
        color: ${colors.white};
        font-weight: 700;
        cursor: pointer;
        svg {
          height: 1.33rem;
          width: 1.33rem;
        }
        &:hover {
          background-color: ${colors.info};
          background-color: ${colors.greyXLight50};
        }
        td {
          user-select: none;
          font-weight: 700;
          color: ${colors.textLight};
          color: ${colors.infoDark};
        }
        .group-header-content {
          padding-right: 0.2rem;
        }
      }

      /* Row is being edited (has focus) */
      &.row-editing {
        background-color: ${colors.greyXXLight50};
        input {
          border-color: ${colors.greyXXLight};
          background-color: ${colors.white};
          color: ${colors.textXLight};
          -webkit-text-fill-color: ${colors.textXLight};
          &:focus {
            border-color: ${colors.infoLight};
            color: ${colors.textXXDark};
            -webkit-text-fill-color: ${colors.textXXDark};
          }
        }
        input[readonly] {
          color: ${colors.textLight}!important;
          -webkit-text-fill-color: ${colors.textLight}!important;
        }
      }

      /* Row has unsaved changes */
      &.row-dirty input {
        ::-webkit-input-placeholder,
        ::-moz-placeholder,
        :-ms-input-placeholder,
        ::placeholder {
          text-indent: 0.5rem;
          color: ${colors.warningXDark};
          -webkit-text-fill-color: ${colors.warningXDark};
          opacity: 1;
        }
      }
    }

    td.col-key,
    td.col-key:hover {
      input {
        transform: translateX(-1rem);
      }
      input[readonly] {
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
        &.input-dirty {
          font-weight: 600;
          color: ${colors.warningXDark};
          -webkit-text-fill-color: ${colors.warningXDark};
          opacity: 1 !important;
        }
      }
    }
  }

  button.button-delete {
    transform: translateX(0.55rem);
    padding: 0rem 0.66rem;
    svg.icon {
      width: 1.5rem;
      height: 1.5rem;
      color: ${colors.warningDark};
    }
    &:hover {
      background-color: ${colors.dangerLight25};
      svg {
        color: ${colors.dangerDark};
      }
    }
  }
`;
