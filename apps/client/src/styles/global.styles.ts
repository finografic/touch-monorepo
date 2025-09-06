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
  /* Use CSS layers to ensure our styles override Radix */
  @layer theme-override {
    html[data-theme],
    body[data-theme],
    #root[data-theme],
    html[data-theme='light'],
    body[data-theme='light'],
    #root[data-theme='light'],
    html[data-theme='dark'],
    body[data-theme='dark'],
    #root[data-theme='dark'] {
      background-color: var(--color-background) !important;
    }
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :root {
    box-sizing: border-box;
    /* Default dark theme color palette */
    ${generateColorVariables({ colors: darkColors })}

    /* Debug: Show current theme */
    --debug-theme: 'default-dark';
  }

  /* Light theme color variables */
  [data-theme='light'] {
    ${generateColorVariables({ colors: lightColors })}
    --debug-theme: 'light';
  }

  /* Dark theme color variables */
  [data-theme='dark'] {
    ${generateColorVariables({ colors: darkColors })}
    --debug-theme: 'dark';
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
    background-color: var(--color-background) !important;

    height: 100vh;
    overflow: hidden;
  }

  /* Ensure html also uses theme background */
  html {
    background-color: var(--color-background) !important;
  }

  /* Override any Radix UI background colors with maximum specificity */
  html,
  body,
  #root,
  html[data-theme],
  body[data-theme],
  #root[data-theme],
  html[data-theme='light'],
  body[data-theme='light'],
  #root[data-theme='light'],
  html[data-theme='dark'],
  body[data-theme='dark'],
  #root[data-theme='dark'] {
    background-color: var(--color-background) !important;
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

  /* Test styles removed - theme system confirmed working! */

  /* TEST: Make pad-rect button borders darker in light mode */
  [data-theme='light'] .pad-rect {
    border-color: #1f2937;
    color: #1f2937;
  }

  /* Global button-box styles for consistent icon button layout */
  .button-box {
    width: auto;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    margin-left: 0.25rem;
    &:first-of-type {
      margin-left: 2rem;
    }
  }
`;
