import { css } from '@emotion/react';
import { colors, layout, spacing } from 'styles';

export const styles = css`
  /* Admin Layout Root Container */
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: ${colors.backgroundDark};
  color: ${colors.white};
  overflow: hidden;

  /* ========================================
     ADMIN HEADER - 60px height, clean admin header
     ======================================== */
  .admin-header {
    width: 100%;
    height: 60px;
    min-height: 60px;
    max-height: 60px;
    display: flex;
    align-items: center;
    background-color: ${colors.background};
    border-bottom: 1px solid ${colors.greyDark};
    z-index: 100;

    .header-content {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 ${spacing[8]};
      display: flex;
      justify-content: space-between;
      align-items: center;

      h1 {
        font-size: 1.5rem;
        font-weight: 600;
        color: ${colors.white};
        margin: 0;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: ${spacing[6]};
      }
    }
  }

  /* ========================================
     ADMIN MAIN - fills remaining space
     ======================================== */
  .admin-main {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: ${colors.backgroundDark};

    /* Center content with max width */
    display: flex;
    justify-content: center;

    > * {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }
  }

  /* ========================================
     ADMIN FOOTER - minimal footer for admin tools
     ======================================== */
  .admin-footer {
    width: 100%;
    height: ${layout.footer.height};
    min-height: ${layout.footer.height};
    max-height: ${layout.footer.height};
    background-color: ${colors.background};
    border-top: 1px solid ${colors.greyDark};

    .footer-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 ${spacing[8]};
    }
  }

  /* ========================================
     RESPONSIVE ADJUSTMENTS
     ======================================== */
  @media (max-width: 768px) {
    .admin-header .header-content {
      padding: 0 ${spacing[6]};

      h1 {
        font-size: 1.25rem;
      }
    }

    .admin-footer .footer-content {
      padding: 0 ${spacing[6]};
    }
  }
`;
