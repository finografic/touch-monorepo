import { css } from '@emotion/react';

import { colors, spacing } from 'styles';

export const styles = css`
  width: 100%;
  background-color: ${colors.white};
  color: ${colors.text};

  .admin-page-container {
    max-width: 1600px; /* Wider to accommodate the translation fields */
    margin: 0 auto;
  }

  .admin-page-header {
    text-align: center;

    .admin-page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: ${colors.text};
      line-height: 1.2;
    }

    .admin-page-subtitle {
      font-size: 1.125rem;
      color: ${colors.greyDark};
      line-height: 1.5;
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

  /* Form styling */
  form {
    width: 100%;
  }

  /* Responsive adjustments */
  @media (max-width: 1200px) {
    .admin-page-container {
      max-width: 100%;
      padding: ${spacing[6]};
    }
  }

  @media (max-width: 768px) {
    .admin-page-container {
      padding: ${spacing[4]};
    }

    .admin-page-header {
      .admin-page-title {
        font-size: 2rem;
      }

      .admin-page-subtitle {
        font-size: 1rem;
      }
    }
  }
`;
