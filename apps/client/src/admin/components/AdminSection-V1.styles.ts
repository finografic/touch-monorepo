import { css } from '@emotion/react';

import { colors, min, spacing } from 'styles';

export const styles = css`
  /* Admin section styling */
  .admin-section {
    background-color: ${colors.white};
    border: 1px solid ${colors.greyLight};
    border-radius: 12px;
    padding: ${spacing[6]};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /* Admin section styling */
  .admin-section {
    background-color: ${colors.white};
    border: 1px solid ${colors.greyLight};
    border-radius: 12px;
    padding: ${spacing[8]};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    .section-content {
      display: flex;
      flex-direction: column;
      gap: ${spacing[6]};
    }
  }

  /* Admin section styling */
  .admin-section {
    background-color: ${colors.white};
    border: 1px solid ${colors.greyLight};
    border-radius: 12px;
    padding: ${spacing[6]};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .admin-section {
      padding: ${spacing[6]};
      border-radius: 8px;
    }
  }

  /* ⭐ admin-section > tab-content > rote=tabpanel ======================= */

  /* NOTE: SCROLL-WINDOW */

  .admin-section {
    padding: 0 !important;
    border: 0 !important;

    overflow-x: hidden;
    overflow-y: hidden;
    position: fixed;

    /* height: 66vh; */
    top: 380px;

    /* height: 66vh; */
    top: 380px;
    bottom: 40px;

    left: auto;
    right: auto;

    z-index: 5000;

    position: fixed;

    &.is-loading {
      opacity: 0 !important;
    }

    width: 100% !important;
    max-width: 1240px !important;

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

  /* ====================================================================== */

  .section-content {
    border: 1px solid transparent;
    &.variant-border-solid {
      border: 1px solid #e2e8f0;
      border: 1px solid red;
    }
  }
`;
