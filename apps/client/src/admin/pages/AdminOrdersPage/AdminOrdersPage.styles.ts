import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  .tab-content-list {
    max-width: 60vw !important;
    min-width: 1000px !important;
    margin-top: 0 !important;
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

    top: 300px;
    left: auto;
    right: auto;

    z-index: 5000;

    position: fixed;
  }

  /* DIALOG TABS ========================================================== */

  [role='tablist'] {
    box-shadow: inset 0 -2px 0 0 transparent;
    box-shadow: inset 0 -0.2rem 0 0 ${colors.defaultXXLight25};

    button[role='tab'] {
      height: 4rem;
      margin: 0.2rem 0.15rem 0;
      padding: 0;
      border: 0 !important;

      span {
        padding: 0.8em 1.25em;
        font-size: 1.05rem;
        font-weight: 700;
        color: ${colors.textLight75};
      }

      svg.icon {
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
`;
