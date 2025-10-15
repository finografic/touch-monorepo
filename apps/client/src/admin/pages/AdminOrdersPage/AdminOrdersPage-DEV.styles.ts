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

    /* DIALOG TABS ========================================================== */

    [role='tablist'] {
      /* tab-horizontal-rule */
      box-shadow: inset 0 -2px 0 0 transparent;
      box-shadow: inset 0 -0.2rem 0 0 ${colors.defaultXXLight25};

      button[role='tab'] {
        height: 4rem;
        margin: 0.2rem 0.15rem 0;
        padding: 0;
        border: 0 !important;

        span {
          padding: 0.8em 1.25em;
          font-size: 1rem;
          font-weight: 600;
          color: ${colors.textLight75};
        }

        svg.icon {
          /* opacity: 0.5; */
          margin-left: -0.33rem;
          margin-right: 0rem;
          transform: translate(-0.25rem, 0) scale(0.8) !important;
          color: ${colors.textXLight75};
        }

        &:first-child {
          margin-left: 0rem;
        }
        &:last-child {
          margin-right: 0rem;
        }
      }

      button[role='tab'][data-state='active'] {
        /* active-tab */
        &:before {
          background-color: ${colors.infoLight};
          height: 0.2rem;
        }
        span {
          color: ${colors.infoLight};
          color: ${colors.info75};
        }

        svg.icon {
          color: ${colors.infoLight};
        }
      }
    }

    /* DIALOG FORMS ========================================================= */
  }

  /* .rt-ScrollAreaRoot */
  .tab.content {
    margin: 2rem 0 0 0 !important;
    border: none;
    padding: 0 !important;
    border: 1px solid green !important;
    border: 1px solid red;

    /* overflow-x: hidden; */
    /* overflow-y: scroll; */

    /* z-index: 5000; */
    /* position: fixed; */
    /* opacity: 0.5; */

    /* width: 100%;
    width: 86vw;
    height: 55vh; */
    /* right: -14px; */
    /* bottom: 3rem; */

    /* Admin section styling */
    div[role='tabpanel'][data-state='active'] {
      margin: 0 !important;
      padding: 0 1rem 0 0 !important;
      border: none !important;
      background-color: ${colors.white};
      border-radius: 12px;
      border: none;
      /* margin: 2rem 0 0 0 !important;
    padding: 0 !important; */
      border: none;

      overflow-x: hidden;
      overflow-y: hidden;

      width: 86vw;
      top: 300px;
      bottom: 3rem;

      z-index: 5000;
      position: fixed;

      border: 1px solid blue !important;

      /* #tab-content-form {
      border: 1px solid blue !important;
    } */

      /* &.orders-table-section {
      height: 50vh;
      opacity: 0.5;
      overflow-y: auto;
    } */

      .admin-section {
        margin: 2rem 0 0 0 !important;
        padding: 0 !important;
        border: 0 !important;

        /* display: none !important; */
        /* width: 100%; */
        /* margin: 2rem 0 0 0 !important; */
        /* padding: 0 !important; */
        border: 1px solid red !important;
        /* height: 68vh;
      width: 86vw; */
        /* overflow-x: hidden; */
        /* overflow-y: hidden; */

        /* overflow-y: scroll;
      position: fixed; */
        /* width: 86vw; */
        /* top: 360px; */
        /* left: auto;
        right: auto; */
        bottom: 3rem;
        z-index: 5000;
        /* position: fixed; */

        /* ==================================== */

        .rt-TableHeader {
          /* position: fixed;
        width: 86vw; */
        }

        .rt-TableBody.table-body {
          /* position: fixed;
        width: 86vw !important;
        display: block; */
        }
      }

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
