import { colors, fontTokens } from '@workspace/design-system/tokens';

import { css } from '@emotion/react';

export const cssGlobal = css`
  #root {
    box-sizing: border-box;
    min-height: 100vh;
  }

  html,
  body,
  * {
    font-family: ${fontTokens.sans.value};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: 'kern' 1;
    font-kerning: normal;
  }

  body {
    width: 100vw;
    height: 100vh;
    background-color: ${colors.background};

    /** SCROLLBAR HANDLING **/
    scrollbar-gutter: auto;
    overflow-x: hidden;
    overflow-y: auto;
    /** NEXT LINE ENSURES *NO* JUMP WHEN SCROLLBAR TOGGLES **/
    /* margin-right: calc(-1 * (100vw - 100%)); */
    /* overflow: hidden; */
  }

  html {
    background-color: ${colors.background};
  }

  /* Global button-box styles for consistent icon button layout */
  .button-box {
    width: auto;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 0;
    margin: 0 1rem;
    &:first-of-type {
      margin-left: 0rem;
    }
    &:last-of-type {
      margin-right: 0rem;
    }
  }

  pre {
    font-family: ${fontTokens.mono.value} !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  label,
  label.field-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    letter-spacing: 0;
    color: ${colors.textDark};
    margin: 0.5rem 0.25rem 0.5rem 0.1rem;
    cursor: default;

    span.hint,
    span.label-hint {
      color: ${colors.text};
      opacity: 0.5;
    }

    span {
      padding: 0;
      margin: 0;
    }
  }

  /* ========================================================================
   * TINY DISPLAY: 800x480 and smaller
   * ======================================================================== */

  @media (max-width: 1024px) and (max-height: 600px) {
    /* 100dvh avoids scrollbar from 100vh overshoot on Pi/touch (browser chrome) */
    html,
    body {
      height: 100vh;
      height: 100dvh;
    }

    /* Front-end Layout only: no body scrollbar (admin needs scrollbar for tables) */
    html[data-layout='front'] body {
      overflow-y: hidden;
    }

    #root {
      min-height: 100vh;
      min-height: 100dvh;
    }
  }
`;
