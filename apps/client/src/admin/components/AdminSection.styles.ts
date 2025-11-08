import { css } from '@emotion/react';

import { border, colors, layout, min, spacing } from 'styles';

export const styles = css`
  /* ⭐ admin-section > tab-content > rote=tabpanel ======================= */

  /* NOTE: SCROLL-WINDOW */

  .admin-section {
    padding: 0 !important;
    border: 0 !important;

    &.is-loading {
      opacity: 0 !important;
    }

    width: 100% !important;
    max-width: 1240px !important;

    background-color: ${colors.white};
    border: 1px solid ${colors.greyLight};
    border-radius: 12px;
    padding: ${spacing[8]};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    ${min.sm} {
      max-width: 96vw !important;
    }
    ${min.md} {
      max-width: 96vw !important;
    }
    ${min.lg} {
      max-width: 96vw !important;
    }
    ${min.xl} {
      max-width: 1240px !important;
    }
  }

  .section-content {
    display: flex;
    flex-direction: column;
    gap: ${spacing[6]};
    border: ${layout.borderWidth} solid transparent;

    &.variant-border-solid {
      border: ${layout.borderWidth} solid #e2e8f0;
      padding: ${spacing[6]};
      border-radius: 8px;
    }
  }
`;
