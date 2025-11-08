import { css } from '@emotion/react';

import { border, colors, layout, min, spacing } from 'styles';

export const styles = css`
  /* ⭐ page-section > tab-content > rote=tabpanel ======================= */

  /* NOTE: SCROLL-WINDOW */

  .admin-section {
    padding: 0;
    border: 0;

    &.is-loading {
      opacity: 0;
    }

    width: 100%;
    max-width: 1240px;

    padding: 0;
    /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); */

    ${min.sm} {
      max-width: 96vw;
    }
    ${min.md} {
      max-width: 96vw;
    }
    ${min.lg} {
      max-width: 96vw;
    }
    ${min.xl} {
      max-width: 1240px;
    }

    background-color: ${colors.white};
    border-radius: ${layout.borderRadius};

    /* padding: 1.5rem 2rem 2.5rem 2rem; */
    padding-top: 0.25rem;
    padding-bottom: 0.75rem;
    padding-left: 0;
  }

  .admin-section-content {
    /* display: flex;
    flex-direction: column;
    margin: -${layout.padding};
    gap: ${spacing[6]};
    border: ${layout.borderWidth} solid transparent; */
    border: 1px solid red;

    &.border-solid {
      border: ${layout.borderWidth} solid ${colors.greyXXLight};
      padding: ${layout.padding};
      border-radius: ${layout.borderRadius};
    }
  }
`;
