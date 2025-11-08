import { css } from '@emotion/react';

import { min } from 'styles';
import { colors } from 'styles';

export const styles = css`
  &.form-container {
    width: 100vw;
    max-width: 100vw !important;
    min-width: 1000px !important;

    ${min.lg} {
      max-width: 88vw !important;
    }
    ${min.xl} {
      max-width: 77vh !important;
    }

    .tab-content-new,
    .tab-content-edit {
      max-width: 100vw !important;

      ${min.lg} {
        max-width: 88vw !important;
      }
      ${min.xl} {
        max-width: 66vh !important;
      }
    }

    height: 66vh !important;
    min-height: 100vh;

    background-color: ${colors.white};
    color: ${colors.text};
    overflow: hidden;
  }

  .col-form-table {
    padding: 1rem 0 !important;
  }
`;
