import { css } from '@emotion/react';

import { colors, layout, min, spacing } from 'styles';
import { BREAKPOINTS } from 'styles/viewport/viewport.breakpoints';

export const styles = css`
  &.admin-page-container {
    margin: 0 auto;
    padding: 0 ${layout.padding};

    width: 100%;
    max-width: 96vw;

    ${min.sm} {
      max-width: 94vw;
    }
    ${min.md} {
      max-width: 96vw;
    }
    ${min.lg} {
      max-width: 96vw;
    }
    ${min.xl} {
      max-width: ${BREAKPOINTS.xl}px;
    }

    .admin-page-header {
      width: 100%;
      padding: 0 0.5rem 1rem 0.5rem;
      margin-bottom: 0;

      .title-wrapper h1 {
        margin: 0.25rem 0 0.5rem 0;
        color: ${colors.text};
      }

      .admin-page-header-subtitle {
        margin: 0;
        font-weight: 400;
        opacity: 0.7;
      }

      .admin-page-header-description {
        font-size: 1rem;
        font-weight: 500;
        color: ${colors.textLight};
        margin-top: 0.5rem;
        line-height: 1.5;
      }

      .admin-page-header-actions {
        flex: 0 0 auto;
        button {
          min-width: 120px;
          font-size: 1.1rem;
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
      margin: 0;
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
