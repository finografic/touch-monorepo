import { css } from '@emotion/react';

import { colors, layout, min, spacing } from 'styles';

export const styles = css`
  &.admin-page-container {
    margin: 0 auto;
    padding: 0 ${layout.padding};

    width: 100%;
    /* max-width: 1240px; */

    ${min.sm} {
      /* max-width: 96vw; */
    }
    ${min.md} {
      /* max-width: 96vw; */
    }
    ${min.lg} {
      /* max-width: 96vw; */
    }
    ${min.xl} {
      /* max-width: 1240px; */
    }

    .admin-page-header {
      width: 100%;
      padding: 0 0.5rem 1.5rem 0.5rem;
      border-bottom: 2px solid ${colors.greyXXLight25};

      .admin-page-header-title {
        margin: 0;
        font-weight: 600;
        color: ${colors.text};
      }

      .admin-page-header-subtitle {
        margin: 0;
        font-weight: 400;
        opacity: 0.7;
      }

      .admin-page-header-description {
        margin-top: 0.5rem;
        line-height: 1.5;
      }

      .admin-page-header-actions {
        button {
          min-width: 120px;
        }
      }

      /* Responsive: Stack on small screens */
      @media (max-width: 768px) {
        .admin-page-header-left,
        .admin-page-header-actions {
          flex: 1 1 100% !important;
        }

        .admin-page-header-actions {
          justify-content: flex-start !important;
          margin-top: 1rem;
        }
      }
    }

    .admin-page-content {
      margin: 0rem 0rem;
    }
  }

  .admin-page-message {
    padding: ${spacing.default} ${spacing.xl};
    border-radius: ${layout.borderRadius};
    margin-bottom: ${spacing.xl};
    font-weight: 500;

    &.success {
      background-color: ${colors.successLight};
      color: ${colors.successDark};
      border: 1px solid ${colors.success};
    }

    &.error {
      background-color: ${colors.dangerLight};
      color: ${colors.dangerDark};
      border: 1px solid ${colors.danger};
    }

    &.warning {
      background-color: ${colors.warningLight};
      color: ${colors.warningDark};
      border: 1px solid ${colors.warning};
    }

    &.info {
      background-color: ${colors.infoLight};
      color: ${colors.infoDark};
      border: 1px solid ${colors.info};
    }
  }
`;
