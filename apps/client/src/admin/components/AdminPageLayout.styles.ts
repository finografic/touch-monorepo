import { css } from '@emotion/react';

import { border, colors, layout, min, spacing } from 'styles';

export const styles = css`
  &.admin-page-container {
    margin: 0 auto;

    width: 100%;
    max-width: 1240px;

    .admin-page-content {
      margin: 0rem 0rem;
    }

    ${min.sm} {
      max-width: 96vw;
    }
    ${min.md} {
      max-width: 96vw;
    }
    ${min.lg} {
      max-width: 96vw;
    }
    ${min.xl} {
      max-width: 1240px;
    }
  }

  .admin-page-message {
    padding: ${spacing[4]} ${spacing[6]};
    border-radius: ${layout.borderRadius};
    margin-bottom: ${spacing[6]};
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
