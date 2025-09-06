import 'sanitize.css/sanitize.css';
import 'sanitize.css/assets.css';
import 'sanitize.css/typography.css';
import 'sanitize.css/forms.css';

import { css } from '@emotion/react';
import { colors } from './colors.styles';
import { cssFontDefaults } from './fonts.styles';
import { generateColorVariables } from './utils/custom.variables';
import { darkColors, lightColors } from './themes';

export const cssGlobal = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :root {
    box-sizing: border-box;
    /* Default dark theme color palette */
    ${generateColorVariables({ colors: darkColors })}
  }

  /* Light theme color variables */
  [data-theme='light'] {
    ${generateColorVariables({ colors: lightColors })}
  }

  /* Dark theme color variables */
  [data-theme='dark'] {
    ${generateColorVariables({ colors: darkColors })}
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

    /* Dynamic background color based on theme */
    background-color: var(--color-background);

    height: 100vh;
    overflow: hidden;
  }

  /** CUSTOM SCROLLBARS FOR ELEMENTS (NOT BODY) **/
  /* Target all elements with scrollbars except body and html */
  :not(body):not(html)::-webkit-scrollbar {
    width: 15px;
    height: 15px;
  }

  :not(body):not(html)::-webkit-scrollbar-track {
    background: var(--color-grey-xxlight);
    border-radius: 6px;
  }

  :not(body):not(html)::-webkit-scrollbar-thumb {
    background: var(--color-grey-light);
    border-radius: 6px;
    border: 2px solid var(--color-grey-xxlight); /* Creates inset effect */

    &:hover {
      background: var(--color-grey);
    }

    &:active {
      background: var(--color-grey-dark);
    }
  }

  /* Corner styling when both scrollbars are present */
  :not(body):not(html)::-webkit-scrollbar-corner {
    background: var(--color-grey-xxlight);
  }
`;
