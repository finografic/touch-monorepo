import { css } from '@emotion/react';

export const cssGlobal = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    /* prettier-ignore */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #111827;
  }

  #root {
    min-height: 100vh;
  }

  main {
    padding: 0 !important;
  }
`;
