import { css } from '@emotion/react';

import { layout } from 'styles';

export const styles = css`
  /* Footer content styling - layout handled by Layout.styles.ts */

  width: 100%;
  height: ${layout.footer.height};
  min-height: ${layout.footer.height};
  max-height: ${layout.footer.height};
  display: flex;
  align-items: center;
  justify-content: space-between; /* Ensure proper spacing between left and right toolbars */

  .col.col-left {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    padding-left: 2rem;
  }

  .col.col-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    padding-right: 2rem;
  }

  /* Navigation wrapper - takes full width for now */
  .nav-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  /* ========================================================================
   * COMPACT DISPLAY: 1024x600 and smaller (Front-End Only)
   * ======================================================================== */

  @media (max-width: 800px) and (max-height: 480px) {
    height: 40px;
    min-height: 40px;
    max-height: 40px;

    .col.col-left {
      padding-left: 1rem; /* Reduced from 2rem */
    }

    .col.col-right {
      padding-right: 1rem; /* Reduced from 2rem */
    }
  }

  @media (max-width: 1024px) and (max-height: 600px) {
    height: 40px;
    min-height: 40px;
    max-height: 40px;

    .col.col-left {
      padding-left: 1rem; /* Reduced from 2rem */
    }

    .col.col-right {
      padding-right: 1rem; /* Reduced from 2rem */
    }
  }
`;
