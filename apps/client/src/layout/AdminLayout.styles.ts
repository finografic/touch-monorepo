import { css } from '@emotion/react';
import { colors, layout, spacing, typography } from 'styles';
import { stylesAdminContent } from 'styles/custom/content.admin.styles';
import { cssForms } from 'styles/forms.styles';

export const styles = css`
  ${stylesAdminContent}

  form {
    ${cssForms}
  }

  /* ========================================
     SHARED LAYOUT STRUCTURE (from Layout.styles.ts)
     ======================================== */

  /* Layout Root Container */
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* Prevent horizontal scrollbars */

  /* Admin-specific: White background instead of dark */
  background-color: ${colors.white};
  color: ${colors.text};

  /* ========================================
     HEADER - Admin-specific styling
     ======================================== */
  > header {
    width: 100%;
    height: ${layout.header.height};
    min-height: ${layout.header.height};
    max-height: ${layout.header.height};

    display: flex;
    align-items: center;
    /* Admin-specific: Dark grey header background */
    background-color: ${colors.background};
    border-bottom: 1px solid ${colors.greyDark};
    z-index: 100;

    .header-content {
      width: 100%;
      max-width: 1200px;
      max-width: 98vw; /* Never larger than 90% viewport */
      margin: 0 auto;
      padding: 0 ${spacing[6]};
      display: flex;
      justify-content: space-between;
      align-items: center;

      height: ${layout.header.height};
      min-height: ${layout.header.height};
      max-height: ${layout.header.height};

      h1 {
        font-size: 1.5rem;
        font-weight: 600;
        color: ${colors.white};
        margin: 0;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: ${spacing[4]};

        ul {
          height: ${layout.header.height};
          min-height: ${layout.header.height};
          max-height: ${layout.header.height};
          align-items: end;
          a {
            height: ${layout.header.height};
            min-height: ${layout.header.height};
            max-height: ${layout.header.height};
            font-size: 1.1rem;
            &:before {
              background-color: var(--accent-indicator);
              height: 5px;
            }
          }
        }
      }
    }

    /* Override Header component styles for admin */
    h1 {
      color: ${colors.white} !important;
      font-size: 1.5rem !important;
      font-weight: 600 !important;
      margin: 0 !important;
    }
  }

  /* ========================================
     MAIN - Shared structure with admin customizations
     ======================================== */
  > main {
    width: 100%;
    flex: 1; /* Grows to fill remaining space */
    position: relative; /* For positioning dialogs */
    overflow-y: auto; /* Only vertical scrollbar if needed */
    overflow-x: hidden; /* Never horizontal scrollbar */

    /* Admin-specific: White background */
    background-color: ${colors.white};

    /* Main content container - from Layout.styles.ts */
    .main-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      /* Section - wrapper for entire page content area */
      section {
        display: flex;
        flex-direction: column;

        /* Admin-specific: Full width instead of constrained */
        width: 100%;
        height: 100%;
        min-width: 1100px; /* Never smaller than mobile width */
        /* max-width: none;  */
        max-width: 98vw; /* Never larger than 90% viewport */
        min-height: 600px; /* Never smaller than reasonable content height */
        max-height: none; /* Admin: No max-height constraint */

        /* Flex alignment */
        justify-content: flex-start; /* Admin: Top-aligned instead of space-between */
        align-items: stretch; /* Admin: Full width children */

        /* Page header - content header (not app header) */
        header.page-header {
          width: 100%;
          height: auto;
          min-height: auto;
          max-height: none;
          padding: 1rem 2rem;
          flex-shrink: 0; /* Don't shrink when space is tight */
          /* Add any page header specific styles here */
        }

        /* Page content - the actual route content */
        .page-content {
          flex: 1; /* Grows to fill available space */
          width: 100%; /* Full width for container */

          padding: 0rem 2rem 2rem 2rem; /* Reduced from 2rem to 1rem top/bottom */

          /* Admin-specific: Center the content with fit-content width */
          display: flex;
          justify-content: center; /* Center horizontally */
          align-items: flex-start; /* Align to top */

          /* The actual content inside will be fit-content */
          > * {
            width: fit-content;
            max-width: 100%; /* Don't exceed container width */
          }

          /* Route content goes here */
        }

        /* Page navigation - content navigation (not app footer) */
        nav.page-navigation {
          width: 100%;
          padding: 1rem 2rem;
          flex-shrink: 0; /* Don't shrink when space is tight */
          /* Navigation styles handled by Navigation component */
        }
      }
    }
  }

  /* ========================================
     ADMIN FOOTER - positioned at bottom
     ======================================== */
  > footer {
    width: 100%;
    height: ${layout.footer.height};
    min-height: ${layout.footer.height};
    max-height: ${layout.footer.height};
    display: flex;
    align-items: center;
    /* Admin-specific: Dark grey footer background */
    background-color: ${colors.background};
    border-top: 1px solid ${colors.greyDark};
    z-index: 2000;

    .footer-content {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 ${spacing[6]};
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* Override Footer component nav-wrapper for admin */
    .nav-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }

  /* ========================================
     SHARED TYPOGRAPHY STYLES (from Layout.styles.ts)
     ======================================== */

  .title {
    ${typography.h1};
    color: ${colors.text};
    margin-bottom: ${spacing[4]};
  }

  .subtitle {
    ${typography.body};
    color: ${colors.textLight};
  }

  p {
    color: ${colors.text};
    font-size: 1.2rem;
    text-align: center;
    max-width: 400px;
    line-height: 1.6;
    padding-bottom: 2rem;
  }

  /* ========================================
     SHARED BUTTON STYLES (from Layout.styles.ts)
     ======================================== */

  button.btn-logout {
    padding: 0.5rem 1rem;
    background-color: transparent;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: #f3f4f6;
    }
  }

  /* ========================================
     RESPONSIVE ADJUSTMENTS
     ======================================== */
  @media (max-width: 768px) {
    > header .header-content {
      padding: 0 ${spacing[4]};

      h1 {
        font-size: 1.25rem;
      }
    }

    > footer .footer-content {
      padding: 0 ${spacing[4]};
    }

    > main .main-content section {
      min-width: 100%; /* Mobile: Full width */

      header.page-header,
      .page-content,
      nav.page-navigation {
        padding: 1rem; /* Mobile: Reduced padding */
      }
    }
  }
`;
