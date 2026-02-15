import { css } from '@emotion/react';

import { colors, layout, min } from 'styles';

export const styles = css`
  /* Header content styling - layout handled by Layout.styles.ts */
  width: 100%;

  .app-header {
    padding: 0rem;
    width: 100%;
    height: ${layout.header.height};
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;

    .container {
      padding: 0 !important;
      width: 100vw !important;
      padding: 0 1rem 0 1.75rem !important;

      .col {
        display: flex;
        align-items: center;
      }
    }

    /* 3-column layout: 3:6:3 ratio */
    .row-header {
      width: 100%;
      height: ${layout.header.height};
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .col-header-left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 1rem;
      height: -webkit-fill-available;
      padding-left: ${layout.padding} !important; /* 🚧 🎯 CSS PROXY default magic! */
    }

    .col-header-center {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .col-header-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 1.5rem !important;
    }

    h1 {
      display: flex;
      align-items: center;
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0 0 0 0.8rem;
      white-space: nowrap;
      margin: 0;
    }

    div[role='menuitem'][data-highlighted] {
      color: ${colors.white} !important;
      background-color: transparent !important;
    }

    .dev-session-a,
    .dev-session-b {
      color: ${colors.greyXLight};
      font-size: 0.9rem;
      font-weight: 400;
      position: absolute;
      top: 3vw;
      text-align: center;
    }

    .dev-session-b {
      text-align: left;
      top: 5vw;
      font-size: 0.8rem;
    }
  }

  /* ========================================================================
   * COMPACT DISPLAYS: 1024x600 and 800x480
   * ======================================================================== */

  @media (max-width: 1024px) and (max-height: 600px) {
    .app-header {
      height: 50px; /* Reduced from 70px */

      .container {
        .col-header-left {
          padding-left: 0.75rem !important; /* Reduced from 1rem */
        }

        .col-header-right {
          padding-right: 1rem !important; /* Reduced from 1.5rem */
        }
      }

      h1 {
        font-size: 1.2rem; /* Reduced from 1.4rem */
        margin: 0;
      }
    }
  }
`;
