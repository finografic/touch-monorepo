import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';

export const styles = css`
  .languages-list {
    width: 100%;
    margin: 1.5rem 0;
    display: inline-flex;
  }


  .alert.no-selection {
    margin-top: 1.75rem;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--colors-border-info);
    background-color: var(--colors-bg-info);
    width: 100%;
    display: flex !important;
    align-items: center;
    gap: 12px;
    flex-wrap: nowrap;
    p {
      padding: 0;
    }
  }

  .language-item {
    &:before,
    &:after {
      border: none;
      inset: unset;
    }
    margin-top: 0.25rem;
    border: 2px solid ${colors.greyXLight};

    .language-item-row {
      width: 100%;
      min-height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0;
      background-color: ${colors.white};

      .col {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: auto;
        height: 100%;
        min-height: 100%;
        padding: 0 1rem;
      }

      .col-flag {
        padding: 0 0.5rem;
      }

      .col-names {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        min-width: 150px;
        width: auto;
        height: 100%;
        min-height: 100%;
        padding: 0 1rem 0 0;
      }

      .col-default {
        padding: 0 1rem 0 0;
      }

      .col-active {
        padding: 0 0.5rem;
      }

      .col-delete {
        min-width: auto;
        .button-delete {
          padding: 1.25rem;
          svg {
            width: 1.5rem;
            height: 1.5rem;
          }
          &:hover:not(:disabled) {
            cursor: pointer;
          }
          &:disabled {
            cursor: not-allowed;
          }
        }
      }
    }
  }
`;
