import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  /* Header content styling - layout handled by Layout.styles.ts */
  width: 100%;

  .app-header {
    padding: 0 2.5rem;
    width: 100%;
    height: ${layout.header.height};
    display: flex;
    align-items: center;
    justify-content: center;

    .container {
      /* border: 2px solid yellow; */
      .col {
        /* border: 2px solid cyan; */
      }
    }

    /* 3-column layout: 3:6:3 ratio */
    .row-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .col-header-left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 1rem; /* Add some padding for better visual balance */
      height: -webkit-fill-available; /* Better cross-browser full height support */
      padding-left: ${layout.padding} !important;
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
      padding-right: 0 !important;
    }

    /* Debug borders removed for production */

    h1 {
      display: flex;
      align-items: center;
      font-size: 1.4rem;
      font-weight: 700;
      /* color: ${colors.info}; */
      margin: 0 0 0 0.8rem;
      white-space: nowrap;

      span.current-language {
        font-size: 1.1rem;
        font-weight: 600;
        /* color: ${colors.info}; */
        margin: 0 0 0 0.8rem;
        opacity: 0.4;
        text-transform: none;
      }
    }

    div[role='menuitem'][data-highlighted] {
      color: ${colors.white} !important;
      background-color: transparent !important;
    }

    .current-language {
      color: ${colors.grey};
      font-size: 1.1rem;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 0.05em;
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
`;
