import { css } from '@emotion/react';
import { colors, spacing } from 'styles';

export const styles = css`
  width: 100%;
  min-height: 100vh;
  height: 50vh;
  background-color: ${colors.white};
  color: ${colors.text};
  overflow: hidden;

  div[role='searchbox'] {
    display: flex;
    justify-content: flex-end;
    .input-search {
      width: 300px;
    }
  }

  .col.col-form {
    /* width: 60%; */
    height: 100%;
    background-color: ${colors.white};
  }
  .col.col-table {
    /* width: 40%; */
    table {
      max-width: 38vw;

      .button-edit {
        svg.icon-edit {
          color: ${colors.infoXLight};
        }
      }
      .button-delete {
        svg.icon-delete {
          color: ${colors.greyXXLight};
        }
      }
    }
  }

  .admin-page-container {
    /* min-width: 1400px; */
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    /* margin: auto auto 20vh auto; */
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
    gap: 0;
  }

  /* Admin section styling */
  div[role='tabpanel'] {
    background-color: ${colors.white};
    border-radius: 12px;
    border: none;

    .admin-section {
      width: 100%;
      margin: 2rem 0 0 0 !important;
      border: none !important;
      padding: 0 !important;
      border: 1px solid red !important;
      height: 68vh;
      width: 86vw;
      overflow-x: hidden;
      overflow-y: hidden;
      /* position: fixed; */
      /* left: auto;
      right: auto;
      bottom: 3rem; */
      z-index: 5000;
      position: fixed;
    }

    .rt-ScrollAreaRoot {
      width: 100%;
      width: 86vw;
      margin: 2rem 0 0 0 !important;
      border: none;
      padding: 0 !important;
      border: 1px solid green !important;
      /* border: 1px solid red; */
      height: 70vh;
      overflow-x: hidden;
      overflow-y: scroll;
      right: -14px;
      bottom: 3rem;
    }

    /* #tab-content-form {
      border: 1px solid blue !important;
    } */

    /* &.orders-table-section {
      height: 50vh;
      opacity: 0.5;
      overflow-y: auto;
    } */

    .table-body {
      /* overflow-y: scroll;
      opacity: 0.5;
      border: 1px solid blue;
      height: 70vh;
      overflow-x: hidden;
      overflow-y: scroll;
      position: fixed;
      display: block;

      width: 86vw;
      left: auto;
      right: auto;
      bottom: 3rem;
      z-index: 5000; */
    }

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
      padding: ${spacing[4]} ${spacing[8]} ${spacing[0]};

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
    display: block;

    .admin-section.mode-edit {
      h3 {
        opacity: 0.5;
      }
    }
  }

  /* Form styling */
  form {
    width: 100%;
  }

  .search-container {
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
