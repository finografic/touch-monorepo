import 'sanitize.css/sanitize.css';
import 'sanitize.css/assets.css';
import 'sanitize.css/typography.css';
import 'sanitize.css/forms.css';

import { css } from '@emotion/react';
import { colors } from './colors.styles';
import { cssLayout } from './layout.styles';
import { generateColorVariables } from './utils/custom.variables';

export const cssGlobal = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :root {
    box-sizing: border-box;
    /* Custom color palette */
    ${generateColorVariables({ colors })}
  }

  ${cssLayout}

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
