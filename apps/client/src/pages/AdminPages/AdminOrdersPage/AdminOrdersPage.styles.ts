import { css } from '@emotion/react';
import { colors, spacing } from 'styles';

export const styles = css`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.white};
  color: ${colors.text};

  .admin-page-container {
    min-width: 1400px; /* Never smaller than mobile width */
    max-width: 1600px; /* Wider to accommodate the translation fields */
    margin: 0 auto;
    padding: ${spacing[8]};
  }

  .admin-page-header {
    text-align: center;
    margin-bottom: ${spacing[8]};

    .admin-page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: ${colors.text};
      margin-bottom: ${spacing[2]};
      line-height: 1.2;
    }

    .admin-page-subtitle {
      font-size: 1.125rem;
      color: ${colors.greyDark};
      line-height: 1.5;
      margin-bottom: ${spacing[6]};
    }
  }

  .admin-page-content {
    display: flex;
    flex-direction: column;
    gap: ${spacing[6]};
  }

  /* Admin section styling */
  .admin-section {
    background-color: ${colors.white};
    border: 1px solid ${colors.greyLight};
    border-radius: 12px;
    padding: ${spacing[6]};

    .section-header {
      h3 {
        color: ${colors.text};
        font-size: 1.66rem;
        font-weight: 700;
        margin-bottom: ${spacing[2]};
        padding-bottom: ${spacing[2]};
      }
    }

    .combobox-field {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
    }

    .col-form-fields {
      margin-bottom: ${spacing[6]};
    }

    .col-form-buttons {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      padding: ${spacing[0]} ${spacing[8]};

      pre {
        width: 70%;
        font-size: 0.8rem;
        color: ${colors.greyXDark};
        padding: ${spacing[6]};
        margin: 0 auto ${spacing[4]};
      }
    }

    .col-form-table {
      padding: 0 !important;
      margin-bottom: 0;
    }

    .simple-select > button {
      flex: 1;
      width: 100%;
    }
  }

  .form-section {
    margin-top: ${spacing[2]};
    min-height: 400px;
    /* margin-bottom: 100px; */
    display: block;
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
