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
      th {
        padding: 0.5rem 2rem;
        text-align: left;
        font-size: 1.1rem;
        font-weight: 700;
        color: ${colors.white};
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
        /* padding: 0.33rem 1rem; */
        /* border: ${forms.inputs.border.width} solid ${forms.inputs.border.color}; */
        /* border-radius: ${forms.inputs.border.radius}; */
        /* font-size: 1rem; */
        /* font-weight: 600; */
        /* outline: none;
        border: 2px solid ${colors.greyXXLight}!important;
        background-color: ${colors.greyXXLight25}; */
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
        /* padding: 0.33rem 1rem; */
        /* border: ${forms.inputs.border.width} solid ${forms.inputs.border.color}; */
        /* border-radius: ${forms.inputs.border.radius}; */
        /* font-size: 1rem; */
        /* font-weight: 600; */
        /* outline: none;
        border: 2px solid ${colors.greyXXLight}!important;
        background-color: ${colors.greyXXLight25}; */
      }

      /* &:not(.col-key) input {
        font-size: 1rem;
        font-weight: 600;
        width: 100%;
        padding: 0.5rem;
        border: 1px solid transparent;
        border-radius: 4px;
        background-color: transparent;
        transition: all 0.2s ease;

        &:hover {
          outline: none;
          border: 1px solid ${colors.infoLight}!important;
          background-color: ${colors.greyXXLight25};
        }

        &:focus {
          outline: none;
          border-color: ${colors.primary};
          background-color: ${colors.greyXXLight25};
        }
      } */

      /* input:hover:not(:disabled):not(:focus) { */
      /* outline: none; */
      /* border: 1px solid ${colors.greyXXLight}!important; */
      /* background-color: ${colors.greyXXLight25}; */
      /* } */

      /* input:focus:not(:disabled) { */
      /* outline: none; */
      /* border: 1px solid ${colors.infoLight}!important; */
      /* background-color: ${colors.greyXXLight25}; */
      /* } */
    }

    tbody {
      background-color: ${colors.white};
    }

    tr {
      border-bottom: 1px solid ${colors.greyXXLight50};
      transition: background-color 0.2s ease;

      /* Row is being edited (has focus) */
      &.row-editing {
        background-color: ${colors.greyXXLight25};
        input {
          border-color: ${colors.greyXLight};
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
        /* background-color: rgba(255, 165, 0, 0.05);
      border-left: 3px solid ${colors.warning}; */
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

      /* Row is empty (new/unsaved) */
      &.row-empty {
        /* background-color: rgba(255, 165, 0, 0.02); */
      }
    }

    td.col-key,
    td.col-key:hover {
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
    padding: 0.2rem 0.6rem;
    svg {
      width: 1.4rem;
      height: 1.4rem;
      color: ${colors.warningDark};
    }
    &:hover {
      background-color: ${colors.dangerXXLight25};
      svg {
        color: ${colors.dangerDark};
      }
    }
  }
`;
