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

      /* margin: 0 -2rem !important; */
      /* opacity: 0.5 !important; */
      /* border: 2px solid yellow; */
      .col {
        /* border: 2px solid cyan; */
        display: flex;
        align-items: center;
        /* box-shadow: inset 0 0 0 2px rgba(200, 200, 0, 0.5); */
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
      border: 2px solid red;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 1rem; /* Add some padding for better visual balance */
      height: -webkit-fill-available; /* Better cross-browser full height support */
      padding-left: ${layout.padding} !important; /* 🎯 CSS Proxy magic! */
    }

    .col-header-center {
      display: flex;
      justify-content: center;
      align-items: center;
      /* height: -webkit-fill-available; */
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
      margin: 0;

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
