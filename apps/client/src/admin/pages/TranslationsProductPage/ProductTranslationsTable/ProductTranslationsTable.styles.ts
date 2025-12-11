import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  width: 100%;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  table td,
  table th {
    & input {
      font-size: 1rem;
      font-weight: 600;
      width: 100%;
      padding: 0.5rem;
      border: 1px solid transparent;
      border-radius: 4px;
      background-color: transparent;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: ${colors.primary};
        background-color: ${colors.greyXXLight25};
      }
    }
  }

  thead {
    background-color: ${colors.greyXXLight25};
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
    }

    /* Row has unsaved changes */
    &.row-dirty {
      background-color: rgba(255, 165, 0, 0.05);
      border-left: 3px solid ${colors.warning};
    }

    /* Row is empty (new/unsaved) */
    &.row-empty {
      background-color: rgba(255, 165, 0, 0.02);
    }
  }

  td {
    padding: 0.5rem 1rem;

    /* Input is dirty */
    input.input-dirty {
      color: ${colors.warning};
      font-weight: 700;
      border-color: ${colors.warning};
    }

    /* Input is empty */
    input.input-empty {
      color: ${colors.warning};

      &::placeholder {
        color: ${colors.warning};
        opacity: 1;
      }
    }

    /* Read-only name field styling */
    input[readonly] {
      background-color: ${colors.greyXXLight25};
      cursor: default;
      font-family: monospace;
      color: ${colors.greyDark};
    }
  }

  th {
    padding: 0.5rem 1rem;
    text-align: left;
    font-weight: 600;
  }

  button {
    padding: 0.25rem;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.7;
    }
  }
`;
