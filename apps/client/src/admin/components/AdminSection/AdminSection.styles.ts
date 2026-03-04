import { colors, layout } from '@workspace/design-system/tokens';
import { min } from '@workspace/design-system/viewport';

import { css } from '@emotion/react';

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

    padding: var(--spacing-3) var(--spacing-7)!important;
    margin: var(--spacing-6) calc(-1 * var(--spacing-5)) 0;

    > .section-header {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }

    &.border-solid {
      border: ${layout.borderWidth} solid ${colors.greyXXXLight};
      padding: var(--spacing-5);
      border-radius: ${layout.borderRadius};
    }

    &.has-error {
      border: ${layout.borderWidth} solid ${colors.dangerLight};
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
      color: ${colors.textLight};
    }

    /***** NOTE: NESTED SECTIONS -- OMIT NEGATIVE MARGIN/PADDING FOR INNER SECTIONS  *****/

    > .admin-section {
      margin: 0rem 0;
      .admin-section-content {
        padding: var(--spacing-6) var(--spacing-7)!important;
        margin: var(--spacing-6) calc(-1 * var(--spacing-6)) 0;
        /* background: pink; */
        /* margin: 0.5rem 0; */
      }
    }

    /* Ensure overflow is visible for paginated tables */
    /* overflow: visible; */
    /* min-height: 0; */
  }
`;
