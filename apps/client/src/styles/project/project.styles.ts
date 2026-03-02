import { css } from '@emotion/react';

import { forms } from '../forms/forms.constants';
import { colors, layout } from '@workspace/design-system/tokens';

export const stylesAdminContent = css`
  /* ADMIN-PAGE-LAYOUT ======================================================= */

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

  div.rt-TextFieldRoot {
    min-height: ${forms.inputs.height};
    /* box-shadow: inset 0px 0px 0px 2px ${colors.greyXLight}; */
  }

  /* TABS ========================================================== */

  [role='tablist'] {
    margin-top: 0.66rem;
    /* border-bottom: 3px solid ${colors.infoLight}; */
    box-shadow: inset 0 -0.2rem 0 0 ${colors.infoLight};
    border-bottom: none !important;
    padding: 0 2px;

    button[role='tab'] {
      height: 3rem;
      margin: 0.2rem 0.15rem 0.2rem;
      padding: 0;
      border: 0 !important;

      position: relative;
      box-sizing: border-box;

      span {
        font-size: 1rem;
        font-weight: 700;
        color: ${colors.textXLight};
        padding: 0.8em 1.25em;
        border-top-left-radius: ${layout.borderRadius};
        border-top-right-radius: ${layout.borderRadius};
        border: 2px solid ${colors.greyXXLight};
        border-bottom: none;
      }

      /*
      // NOTE: ALT SOLUTION.. NOT BAD, WITH A LITTLE WORK..
      &:not([data-state='active'])::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3px;
        background: ${colors.infoLight};
      } */

      &:hover {
        cursor: pointer;
        span {
          color: ${colors.info};
          color: ${colors.textLight};
          border: 2px solid ${colors.greyXLight};
          border-bottom: none;
        }
      }

      &[data-state='active'] {
        margin: 0rem 0.05rem 0rem;
        height: 3.4rem;
        background-color: ${colors.white};
        span {
          color: ${colors.info};
          border: 3px solid ${colors.infoLight};
          border-bottom: none;
        }
        &:before {
          background-color: ${colors.white};
        }
        &:hover {
          cursor: default;
          span {
            background-color: ${colors.white};
          }
        }
        box-shadow: 3px 4px 3px -3px ${colors.greyXXXLight};
        position: relative;
        z-index: 10;
      }

      &:nth-of-type(1) {
        margin-left: 0rem;
      }
      &:last-child {
        margin-right: 0rem;
      }
    }

    button[role='tab'][data-state='active'],
    button[role='tab'][data-state='active'] + button[role='tab'] {
      span {
        /* margin-left: -1px; */
      }
    }
  }
`;
