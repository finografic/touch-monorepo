import { css } from '@emotion/react';

import { colors, spacing } from 'styles';

export const styles = css`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.white};
  color: ${colors.text};

  div[role='tab'] {
    padding: 0.5rem 1rem;
    color: ${colors.text};
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.5;
    margin-bottom: ${spacing.xl};
  }

  /* TABS ========================================================== */

  [role='tablist'] {
    /* tab-horizontal-rule */
    box-shadow: inset 0 -2px 0 0 transparent;
    box-shadow: inset 0 -0.2rem 0 0 ${colors.defaultXXLight25};

    margin: -1rem -1.5rem 1rem;

    button[role='tab'] {
      height: 4rem;
      margin: 0.2rem 0.15rem 0;
      padding: 0;
      border: 0 !important;

      span {
        padding: 0.8em 1.25em;
        font-size: 1rem;
        font-weight: 600;
        color: ${colors.textLight75};
      }

      &:nth-of-type(1) {
        margin-left: 0rem;
      }
      &:last-child {
        margin-right: 0rem;
      }
    }

    button[role='tab'][data-state='active'] {
      /* active-tab */
      &:before {
        background-color: ${colors.infoLight};
        height: 0.2rem;
      }
      span {
        color: ${colors.infoLight};
        color: ${colors.info75};
      }

      svg.icon {
        color: ${colors.infoLight};
      }
    }
  }
`;
