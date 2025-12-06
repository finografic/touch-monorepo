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
    /* box-shadow: inset 0 -0.2rem 0 0 ${colors.defaultXXLight25}; */
    margin: -1rem 0 1rem;

    button[role='tab'] {
      height: 3rem;
      margin: 0.2rem 0.05rem 0;
      padding: 0;
      border: 0 !important;

      span {
        padding: 0.8em 1.25em;
      }

      &:nth-of-type(1) {
        margin-left: 0rem;
      }
      &:last-child {
        margin-right: 0rem;
      }
    }
  }
`;
