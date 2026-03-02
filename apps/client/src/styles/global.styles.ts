import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';
import { cssFontDefaults, cssFontMono } from './fonts/fonts.styles';
import { forms } from 'styles/forms/forms.styles';

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

  #root {
    box-sizing: border-box;
    min-height: 100vh;
  }

  html,
  body,
  * {
    /* Unset Radix UI font classes before applying our defaults */
    .rt-Heading,
    .rt-Text,
    .rt-Card,
    .rt-Button,
    .rt-TextField,
    .rt-Select {
      font-family: unset;
    }
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
    /* margin-right: calc(-1 * (100vw - 100%)); */

    /* Dynamic background color based on theme */
    background-color: var(--color-background) !important;

    height: 100vh;
    /* overflow: hidden; */
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
    background: ${colors.greyXXLight25};
    border-radius: 6px;
  }

  :not(body):not(html)::-webkit-scrollbar-thumb {
    background: var(--color-grey-light);
    background: ${colors.greyXLight50};
    border-radius: 6px;
    border: 4px solid ${colors.white50}; /* Creates inset effect */

    &:hover {
      background: ${colors.greyLight};
    }

    &:active {
      background: ${colors.grey};
    }
  }

  /* Corner styling when both scrollbars are present */
  :not(body):not(html)::-webkit-scrollbar-corner {
    background: ${colors.greyXXLight};
  }

  svg.icon {
    color: ${colors.infoXLight};
  }

  svg[width][height].icon {
    color: ${colors.infoXLight};
  }

  svg[width][height].icon {
    /* NORMALIZED sizing - forces all icon libraries to same visual size */
    /* 20px - sweet spot between 15px and 24px */
    width: 2rem;
    height: 2rem;
    display: inline-block;
    flex-shrink: 0;
    transition:
      color 200ms ease-in-out,
      border-color 200ms ease-in-out,
      background-color 200ms ease-in-out;
    color: currentColor;

    transform: none !important;
    &:hover {
      transform: none !important;
    }
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
    ${cssFontMono}
  }

  label,
  label.field-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: ${forms.inputs.label.fontSize};
    font-weight: ${forms.inputs.label.fontWeight}!important;
    letter-spacing: 0;
    color: ${colors.textDark};
    margin: 0.5rem 0.25rem 0.5rem 0.1rem;
    cursor: default;

    span.hint,
    span.label-hint {
      color: ${colors.text};
      font-weight: ${forms.inputs.label.fontWeight};
      opacity: 0.5;
    }

    span {
      padding: 0;
      margin: 0;
    }
  }

  div[data-state='open'].rt-BaseDialogOverlay.rt-DialogOverlay {
    background-color: rgba(255, 255, 255, 0.33) !important;
    position: fixed;
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

    div[role='dialog'].rt-DialogContent[data-state='open'] {
      transform: scale(0.85) !important;
    }
  }
`;
