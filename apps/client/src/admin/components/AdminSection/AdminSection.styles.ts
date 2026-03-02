import { colors, layout } from '@workspace/design-system/tokens';
import { min } from '@workspace/design-system/viewport';

import { css } from '@emotion/react';

import { padding } from 'styles/layout/base.constants';

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
    display: flex;
    flex-direction: column;
  }

  .admin-section-content {
    display: flex;
    flex-direction: column;
    gap: 1;

    padding: ${padding.md} ${padding.xxl}!important;
    margin: ${padding.xl} -${padding.lg} 0;

    > .section-header {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }

    &.border-solid {
      border: ${layout.borderWidth} solid ${colors.greyXXLight50};
      padding: ${padding.lg};
      border-radius: ${layout.borderRadius};
    }

    &.has-error {
      border: ${layout.borderWidth} solid ${colors.danger50};
    }

    &:not(.border-solid) {
      margin-top: 0;
    }

    padding-bottom: 2.25rem !important;

    h2 {
      margin: 0;
      padding: 0;
    }

    .section-header-subtitle {
    }

    .section-header-description {
      font-size: 0.95em;
      font-weight: 500;
      color: ${colors.textLight75};
    }

    /***** NOTE: NESTED SECTIONS -- OMIT NEGATIVE MARGIN/PADDING FOR INNER SECTIONS  *****/

    > .admin-section {
      margin: 0rem 0;
      .admin-section-content {
        padding: ${padding.xl} ${padding.xxl}!important;
        margin: ${padding.xl} -${padding.xl} 0;
        /* background: pink; */
        /* margin: 0.5rem 0; */
      }
    }

    /* Ensure overflow is visible for paginated tables */
    /* overflow: visible; */
    /* min-height: 0; */
  }
`;
