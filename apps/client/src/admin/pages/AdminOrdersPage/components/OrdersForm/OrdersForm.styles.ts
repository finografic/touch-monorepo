import { css } from '@emotion/react';

import { min } from 'styles';
import { colors } from 'styles';

export const styles = css`
  &.form-container {
    width: 100vw;
    max-width: 100vw !important;
    min-width: 1000px !important;

    ${min.lg} {
      /* max-width: 88vw !important; */
    }
    ${min.xl} {
      /* max-width: 77vh !important; */
    }

    .tab-content-new,
    .tab-content-edit {
      max-width: 100vw !important;

      ${min.lg} {
        /* max-width: 88vw !important; */
      }
      ${min.xl} {
        /* max-width: 66vh !important; */
      }
    }

    /* height: 66vh !important; */
    /* min-height: 100vh; */

    background-color: ${colors.white};
    color: ${colors.text};
    overflow: hidden;
  }

  .col-form-table {
    padding: 1rem 0 !important;
  }

  /* ============================================================================
     PRIMEREACT PANEL - TEMPERATURE PROFILES
     ============================================================================ */

  .temperature-profiles-panel {
    margin-top: 1.5rem;
    border: 2px solid ${colors.greyXLight};
    border-radius: 8px;
    box-shadow: 0 2px 8px ${colors.greyXXLight25};

    /* Panel Header */
    .p-panel-header {
      background-color: ${colors.greyXXLight25};
      border-bottom: 2px solid ${colors.greyXLight};
      padding: 1rem 1.5rem;
      border-radius: 6px 6px 0 0;

      .p-panel-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: ${colors.text};
      }
    }

    /* Panel Content */
    .p-panel-content {
      padding: 1.5rem;
      background-color: ${colors.white};
    }

    /* Panel Footer */
    .p-panel-footer {
      background-color: ${colors.backgroundLight};
      border-top: 2px solid ${colors.greyXLight};
      padding: 1rem 1.5rem;
      border-radius: 0 0 6px 6px;

      button {
        min-width: 120px;
      }
    }
  }
`;
