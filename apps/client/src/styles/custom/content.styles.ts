import { colors, layout, min } from 'styles';
import { css } from '@emotion/react';
import { cssFontMono } from '../fonts.styles';
import { cssInputBox, cssInputText, forms } from '../forms.styles';

// Base styles shared across all interactive buttons
export const stylesContent = css`
  section.admin-content-page {
    color: ${colors.textDark};

    h1 {
      font-size: 2.5rem;
      font-weight: 600;
      color: ${colors.textXDark};
      margin: 1em 0 0.5em 0;
    }

    h2 {
      font-size: 1.75rem;
      color: ${colors.secondaryDark};
      color: ${colors.text};
      font-weight: 600;
      margin: 1.5em 0 0.5em 0;
    }

    h3 {
      color: var(--color-text-light);
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
      span {
        opacity: 0.66;
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
      color: var(--color-text);
      font-weight: 500;
      line-height: 1.75;
    }
    a {
      color: var(--color-primary);
      color: var(--color-secondary-xdark);
      text-decoration: none;
      &:hover {
        color: var(--color-primary-x-dark);
      }
    }
    code {
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
      color: var(--color-text-light);
    }
    pre {
      font-size: 0.8em;
      line-height: 1.5;
      color: var(--color-text-light);
    }
    hr {
      border: none;
      border-bottom: ${layout.borderWidth} dashed var(--color-grey-light);
      margin: calc(${layout.padding} * 1.2) 0;
      opacity: 0.5;
    }

    div.rt-TextFieldRoot {
      min-height: ${forms.inputs.height};
      box-shadow: inset 0px 0px 0px 2px ${colors.greyXLight};
      /* ${cssInputText} */
      /* ${cssInputBox} */
    }
  }

  /* header.page-header,
  section {
    padding: calc(${layout.padding} * 1) calc(${layout.padding} * 0.75) calc(${layout.padding} * 2);
    padding-top: calc(${layout.padding} * 1) !important;
    h1 {
      font-size: 2.8em !important;
      margin-top: 0.4em !important;
      margin-bottom: 0.4em !important;
      color: var(--color-primary-dark);
      span {
        color: var(--color-primary);
        opacity: 1;
      }
    }
    h1 + h2 {
      margin-bottom: 0.4em !important;
      color: var(--color-grey-dark);
      span {
        color: var(--color-grey-light);
        opacity: 1;
      }
    }
    h1 + p,
    h1 + h2 + p {
      font-size: 1.25em;
      margin-top: 0 !important;
      margin-bottom: 2.5em;
    }
  } */

  /******************** RESPONSIVE *********************/

  /* .col-left,
  .col-right {
    display: flex;
    justify-content: center;
  }

  #content {
    padding-left: calc(${layout.padding} * 1) !important;
    padding-right: calc(${layout.padding} * 1.8) !important;
  }

  .header > div,
  .footer > nav {
    padding-left: calc(${layout.padding} * 1) !important;
    padding-right: calc(${layout.padding} * 1) !important;
  }

  ${min.md} {
    .col-left {
      justify-content: start;
    }
    .col-right {
      justify-content: end;
    }

    #content {
      padding-left: calc(${layout.padding} * 1) !important;
      padding-right: calc(${layout.padding} * 1.8) !important;
    }

    .header > div,
    .footer > nav {
      padding-left: calc(${layout.padding} * 1) !important;
      padding-right: calc(${layout.padding} * 1) !important;
    }
  }

  ${min.lg} {
    #content,
    .header > div,
    .footer > nav {
      padding-left: calc(${layout.padding} * 1.5) !important;
      padding-right: calc(${layout.padding} * 1.5) !important;
    }
  }

  ${min.xl} {
    #content,
    .header > div,
    .footer > nav {
      padding-left: calc(${layout.padding} * 2.5) !important;
      padding-right: calc(${layout.padding} * 2.5) !important;
    }
  }

  ${min.xxl} {
    #content,
    .header > div,
    .footer > nav {
      padding-left: calc(${layout.padding} * 0.5) !important;
      padding-right: calc(${layout.padding} * 0.5) !important;
    }
  } */
`;
