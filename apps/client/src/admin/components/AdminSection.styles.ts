import { css } from '@emotion/react';

import { colors, layout, min } from 'styles';
import { baseLayout } from 'styles/constants/base.constants';

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

    /* Ensure overflow is visible for nested scrollable content */
    /* overflow: visible; */
    display: flex;
    flex-direction: column;
    /* min-height: 0;  */
  }

  .admin-section-content {
    display: flex;
    /* display: grid; */
    flex-direction: column;
    gap: 1;

    margin: 1rem -${baseLayout.padding.lg};

    > .section-header {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }

    &.border-solid {
      border: ${layout.borderWidth} solid ${colors.greyXXLight50};
      padding: ${baseLayout.padding.lg};
      border-radius: ${layout.borderRadius};
    }

    padding-bottom: 2.25rem !important;

    h2 {
      margin: 0;
      padding: 0;
    }

    /***** NOTE: NESTED SECTIONS -- OMIT NEGATIVE MARGIN/PADDING FOR INNER SECTIONS  *****/

    > .admin-section {
      margin: 0rem 0;
      .admin-section-content {
        margin: 0.5rem 0;
      }
    }

    /* Ensure overflow is visible for paginated tables */
    /* overflow: visible; */
    /* min-height: 0; */
  }
`;
