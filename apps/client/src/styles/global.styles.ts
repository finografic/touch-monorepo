import 'sanitize.css/sanitize.css';
import 'sanitize.css/assets.css';
import 'sanitize.css/typography.css';
import 'sanitize.css/forms.css';

import { css } from '@emotion/react';
import { colors } from './colors.styles';
import { cssFontDefaults } from './fonts.styles';
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

  #root {
    min-height: 100vh;
  }

  html,
  body,
  * {
    ${cssFontDefaults}
  }

  body {
    width: 100vw;
    height: 100vh;

    /** SCROLLBAR HANDLING **/
    scrollbar-gutter: auto;
    overflow-x: hidden;
    overflow-y: auto;
    /** NEXT LINE ENSURES *NO* JUMP WHEN SCROLLBAR TOGGLES **/
    margin-right: calc(-1 * (100vw - 100%));

    background-color: ${colors.background};

    height: 100vh;
    overflow: hidden;
  }
`;
