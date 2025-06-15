import { css } from '@emotion/react';
import { colors, layout, spacing, typography } from 'styles';

export const styles = css`
  /* Layout Root Container */
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: ${colors.background};
  overflow: hidden; /* Prevent horizontal scrollbars */

  /* ========================================
     APP HEADER - 80px height, 3:6:3 columns
     ======================================== */
  > header {
    width: 100%;
    height: ${layout.header.height};
    min-height: ${layout.header.height};
    max-height: ${layout.header.height};
    display: flex;
    align-items: center;
    background-color: transparent;
  }

  /* ========================================
     MAIN - fills remaining space
     ======================================== */
  > main {
    width: 100%;
    flex: 1; /* Grows to fill remaining space */
    position: relative; /* For positioning dialogs */
    overflow-y: auto; /* Only vertical scrollbar if needed */
    overflow-x: hidden; /* Never horizontal scrollbar */

    /* Main content container - centers the page content */
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

        /* Flexible sizing with constraints */
        width: 100%;
        height: 100%;
        min-width: 1100px; /* Never smaller than mobile width */
        max-width: 66vw; /* Never larger than 66% viewport */
        min-height: 600px; /* Never smaller than reasonable content height */
        /* max-height: 66vh; Never larger than 66% viewport */
        max-height: 800px;

        /* Flex alignment */
        justify-content: space-between; /* Vertical: header top, nav bottom, content fills middle */
        align-items: center; /* Horizontal: center all children */

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
          width: 100%; /* Override align-items: center for full width */
          padding: 2rem;

          /* Center the route content */
          display: flex;
          align-items: center; /* Vertical centering */
          justify-content: center; /* Horizontal centering */

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
     APP FOOTER - 80px height, 1:1 columns
     ======================================== */
  > footer {
    width: 100%;
    height: ${layout.footer.height};
    min-height: ${layout.footer.height};
    max-height: ${layout.footer.height};
    display: flex;
    align-items: center;
  }

  /* ========================================
     TYPOGRAPHY STYLES
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
     BUTTON STYLES
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
     DEVELOPMENT HELPERS (commented out)
     ======================================== */
  /*
  > header {
    box-shadow: inset 0 0 0 2px blue;
  }

  > main {
    box-shadow: inset 0 0 0 2px red;

    .main-content {
      border: 1px solid yellow;

      section {
        box-shadow: inset 0 0 0 2px purple;

        header.page-header {
          box-shadow: inset 0 0 0 2px orange;
        }

        .page-content {
          box-shadow: inset 0 0 0 2px cyan;
        }

        nav.page-navigation {
          box-shadow: inset 0 0 0 2px pink;
        }
      }
    }
  }

  > footer {
    box-shadow: inset 0 0 0 2px green;
  }
  */
`;
