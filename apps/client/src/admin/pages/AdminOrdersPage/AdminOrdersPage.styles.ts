import { css } from '@emotion/react';

import { colors, spacing } from 'styles';

export const styles = css`
  width: 100%;
  min-height: 100vh;
  height: 50vh;
  background-color: ${colors.white};
  color: ${colors.text};
  overflow: hidden;

  .tab-content-list {
    max-width: 66vw !important;
    margin-top: 0 !important;
  }

  div[role='searchbox'] {
    display: flex;
    justify-content: flex-end;
    .input-search {
      /* width: 300px; */
    }
    opacity: 0.5;
  }

  .col.col-form {
    display: none !important;
    /* width: 60%; */
    height: 100%;
    background-color: ${colors.white};
  }
  .col.col-table {
    /* width: 40%; */

    display: none !important;
    /* opacity: 0.3 !important; */

    table {
      /* max-width: 38vw; */

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

        &:nth-of-type(1) {
          margin-left: 0rem;
        }
        &:last-of-type {
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

    /* ⭐ admin-section > tab-content > rote=tabpanel ======================= */

    /* NOTE: SCROLL-WINDOW */

    .admin-section {
      padding: 0 !important;
      border: 0 !important;

      overflow-y: scroll;
      position: fixed;

      width: 86vw;
      height: 66vh;
      /* bottom: 33vh; */
      /* transform: translateY(50%); */

      top: 300px;
      left: auto;
      right: auto;

      /* bottom: 3rem; */
      z-index: 5000;

      position: fixed;
    }
  }
`;
