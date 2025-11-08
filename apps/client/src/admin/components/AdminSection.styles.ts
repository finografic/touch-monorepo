import { css } from '@emotion/react';

import { border, colors, layout, min, spacing } from 'styles';

export const styles = css`
  /* ⭐ page-section > tab-content > rote=tabpanel ======================= */

  /* NOTE: SCROLL-WINDOW */

  .page-section {
    padding: 0 !important;
    border: 0 !important;

    &.is-loading {
      opacity: 0 !important;
    }

    width: 100% !important;
    max-width: 1240px !important;

    /* background-color: ${colors.white}; */
    /* border: 1px solid ${colors.greyLight}; */
    /* border: ${layout.borderWidth} solid pink !important; */
    border-radius: ${layout.borderRadius};
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
    border: 1px solid ${colors.greyXLight};
    border: 2px solid ${colors.greyXXLight50};
    border-radius: ${String(layout.borderRadius)};

    /* margin: 5.5rem 0; */
    /* overflow-x: hidden !important; */

    padding: 1.5rem 2rem 2.5rem 2rem;
    padding-top: 0.25rem;
    padding-bottom: 0.75rem;
  }

  .page-section-content {
    display: flex;
    flex-direction: column;
    margin: -${layout.padding};
    gap: ${spacing[6]};
    border: ${layout.borderWidth} solid transparent;

    &.border-solid {
      border: ${layout.borderWidth} solid ${colors.greyXXLight};
      padding: ${layout.padding};
      border-radius: ${layout.borderRadius};
    }
  }
`;
