import { css } from '@emotion/react';
import { forms } from '../forms/forms.constants';
import { colors, layout, min, spacing } from 'styles';
import { BREAKPOINTS, BREAKPOINTS_PX } from 'styles/viewport/viewport.breakpoints';

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

  [role='tablist'] {
    margin-top: 1.2rem;
    box-shadow: inset 0 -0.12rem 0 0 ${colors.greyXXLight75};
    box-shadow: inset 0 -0.11rem 0 0 ${colors.infoLight};
    /* box-shadow: none !important; */
    border-bottom: none !important;
    padding: 0 2px;

    button[role='tab'] {
      height: 3rem;
      margin: 0.2rem 0.05rem 0;
      padding: 0;
      border: 0 !important;
      span {
        font-size: 1rem;
        font-weight: 700;
        color: ${colors.info75};
        color: ${colors.textXLight75};
        padding: 0.8em 1.25em;
        border: 2px solid ${colors.greyXXLight75};
        border-bottom: none;
        border-radius: ${layout.borderRadius};
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }

      &:hover {
        cursor: pointer;
        span {
          color: ${colors.textXLight};
          color: ${colors.info};
          border: 2px solid ${colors.greyXLight};
          border-bottom: none;
        }
      }

      &[data-state='active'] {
        span {
          color: ${colors.info};
          border: 3px solid ${colors.infoLight};
          border-bottom: none;
          margin-left: -1px;
        }

        &:before {
          background-color: ${colors.white};
        }

        box-shadow: 3px 4px 3px -3px ${colors.greyXXLight50};
      }

      &:nth-of-type(1) {
        margin-left: 0rem;
      }
      &:last-child {
        margin-right: 0rem;
      }
    }

    button[role='tab'][data-state='active'] + button[role='tab'] {
      span {
        /* border-left: 2px solid ${colors.greyXXLight25}; */
        margin-left: -1px;
      }
    }
  }
`;
