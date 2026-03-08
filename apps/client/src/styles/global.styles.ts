import { colors, fontTokens, layout } from '@workspace/design-system/tokens';

import { css } from '@emotion/react';

export const cssGlobal = css`
  #root {
    box-sizing: border-box;
    min-height: 100vh;
  }

  html {
    font-family: ${fontTokens.sans.value};
    font-feature-settings: 'kern' 1;
    font-kerning: normal;
    background-color: ${colors.background};
  }

  body {
    width: 100vw;
    height: 100vh;
    background-color: ${colors.background};
    scrollbar-gutter: auto;
    overflow-x: hidden;
    overflow-y: auto;
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

  color: ${colors.textDark};

  h1 {
    font-size: 2rem;
    font-weight: 600;
    color: ${colors.textXDark};
    margin: 1em 0 0.5em 0;
  }

  h2 {
    font-size: 1.66rem;
    color: ${colors.secondaryDark};
    color: ${colors.text};
    line-height: 1.6;
    font-weight: 600;
    margin: 1em 0 0em 0;
  }

  h3 {
    color: ${colors.textLight};
    font-weight: 500;
  }

  h4 {
    color: white;
    margin: 1.33em 0 0.33em;
    font-weight: 500;
  }

  h1,
  h2,
  h3,
  h4 {
    letter-spacing: -0.025em;
    font-weight: 700;
    span.title-subtitle {
      opacity: 0.45;
      text-indent: 0.25em;
    }
  }

  h1 + span {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${colors.text};
    padding: 0em 0 1em 0;
    display: inline-block;
  }

  h2 + span {
    font-size: 1rem;
    font-weight: 500;
    color: ${colors.text};
    padding: 0.25em 0 1em 0;
    display: inline-block;
  }

  p {
    color: ${colors.text};
    font-weight: 500;
    line-height: 1.75;
  }
  a {
    color: ${colors.primary};
    color: ${colors.secondaryXDark};
    text-decoration: none;
    &:hover {
      color: ${colors.primaryXDark};
    }
  }
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    color: ${colors.textLight};
  }
  pre {
    font-size: 0.8em;
    line-height: 1.5;
    color: ${colors.textLight};
  }

  hr {
    border: none;
    border-bottom: ${layout.borderWidth} dashed ${colors.greyLight};
    margin: calc(${layout.padding} * 1.2) 0;
    opacity: 0.5;
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
