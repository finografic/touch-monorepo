import { css } from '@emotion/react';

import { border, colors, layout, min, spacing } from 'styles';

export const styles = css`
  /* ⭐ page-section > tab-content > rote=tabpanel ======================= */

  /* NOTE: SCROLL-WINDOW */

  .admin-section {
    margin: 3rem;
    padding: 0;
    padding-top: 0.25rem;
    padding-bottom: 0.75rem;

    border: 0;

    &.is-loading {
      opacity: 0;
    }

    width: 100%;
    max-width: 1240px;

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

    /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); */
  }

  .admin-section-content {
    display: flex;
    flex-direction: column;
    margin: 1rem -${layout.padding};
    gap: 1;

    &.border-solid {
      border: ${layout.borderWidth} solid ${colors.greyXXLight};
      padding: ${layout.padding};
      border-radius: ${layout.borderRadius};
    }
  }
`;
