import { css } from '@emotion/react';
import { colors } from './colors.styles';
import { twLayout } from './tailwind/tailwind.constants';

export const border = css`
  border-color: ${colors.greyXLight};
  border-style: solid;
  border-width: 2px;
`;

// LAYOUT VARIABLES
export const layout = {
  fontSize: twLayout.fontSize,
  padding: twLayout.padding,
  borderWidth: twLayout.borderWidth,
  borderRadius: twLayout.borderRadius,
  pageColor: colors.white,
  bgColor: colors.white,
} as const;

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

// LAYOUT STYLES
export const cssLayout = css`
  html {
    display: flex;
    align-items: center;
    justify-content: center;
    /** SCROLLBAR HANDLING **/
    scrollbar-gutter: auto;
    overflow-x: hidden;
    overflow-y: auto;
    /** NEXT LINE ENSURES *NO* JUMP WHEN SCROLLBAR TOGGLES **/
    margin-right: calc(-1 * (100vw - 100%));
    body {
      width: 100vw;
    }
  }

  body {
    margin: 0;
    width: 100vw;
    min-height: 100vh;
    &.sidebar-open {
      overflow-y: hidden;
      padding-right: 20px; /* TODO: GET SCROLLBAR WIDTH FOR EACH BROWSER */
    }
  }

  #root {
    display: flex;
    min-height: 100vh;
    background-color: ${layout.pageColor};

    /* NEW */
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
  }

  main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    padding-top: 0;
  }
`;
