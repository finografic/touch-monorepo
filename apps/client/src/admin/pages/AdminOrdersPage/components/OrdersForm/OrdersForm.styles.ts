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

      /* Custom toggle icons - more prominent */
      .p-panel-icons {
        .panel-toggle-icon {
          width: 22px;
          height: 22px;
          color: ${colors.info};
          transition: all 0.2s ease;
          opacity: 0.9;

          &:hover {
            color: ${colors.infoDark};
            opacity: 1;
            transform: scale(1.1);
          }
        }
      }

      /* Style the toggle button container */
      button.p-panel-header-icon {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 6px;
        transition: all 0.2s ease;

        &:hover {
          background-color: ${colors.infoXLight25};
        }
      }
    }

    /* Panel Content - NO scrollbar, show full content */
    .p-panel-content {
      padding: 1.5rem;
      background-color: ${colors.white};
      overflow: visible !important; /* Remove any overflow restrictions */
      max-height: none !important; /* Remove any height restrictions */
    }

    /* Ensure the toggleable content wrapper also doesn't restrict height */
    .p-toggleable-content {
      overflow: visible !important;
      max-height: none !important;
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
