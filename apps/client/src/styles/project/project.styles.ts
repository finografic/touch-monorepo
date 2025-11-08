import { css } from '@emotion/react';

import { forms } from '../forms/forms.constants';
import { colorsDirect as colors, layout, min, spacing } from 'styles';
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
    span,
    span.title-subtitle {
      opacity: 0.4 !important;
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
    box-shadow: inset 0px 0px 0px 2px ${colors.greyXLight};
  }
`;
