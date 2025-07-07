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
    /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); */
    /* :before,
    :after {
      border: none;
      inset: unset;
    } */

    .row {
      /* border: 1px solid yellow; */
    }
    .col {
      /* border: 1px solid lime; */
    }
    .a {
      /* border: 1px solid red; */
    }
    .b {
      /* border: 1px solid blue; */
    }

    .combobox-field {
      /* border: 1px solid hotpink; */
      flex: 1;
      position: relative;
      min-width: 180px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
    }

    .col-form-fields {
      /* padding: ${spacing[4]}; */
      /* display: flex;
      justify-content: flex-end;
      align-items: center; */
      /* flex: 1; */
      margin-bottom: ${spacing[8]};
    }

    .col-form-buttons {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: ${spacing[4]};

      pre {
        width: 70%;
        font-size: 0.8rem;
        color: ${colors.greyXDark};
        padding: ${spacing[6]};
        margin: 0 auto ${spacing[4]};
      }
    }

    .field-label {
      padding: 0.5rem 0 0.25rem;
      display: block;
      & + div {
        width: 100%;
      }
    }

    .simple-select > button {
      flex: 1;
      width: 100%;
    }
  }

  .form-section {
    margin-top: ${spacing[2]};
    min-height: 400px;
    margin-bottom: 100px;
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
