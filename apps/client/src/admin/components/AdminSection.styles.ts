import { css } from '@emotion/react';

import { colors, spacing } from 'styles';

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

  /* ====================================================================== */
  .section-content {
    border: 1px solid transparent;
    &.variant-border-solid {
      border: 1px solid #e2e8f0;
    }
  }
`;
