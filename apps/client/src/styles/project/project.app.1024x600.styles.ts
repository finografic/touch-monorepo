import { css } from '@emotion/react';

import { spacing } from '@workspace/design-system/tokens';

const MAIN_CONTENT_HEIGHT = 450;
const SLOT_GRID_WIDTH = 350;
const SLOT_GRID_HEIGHT = 336;
const SLOT_GRID_TRANSLATE_Y = '3rem';
const UI_SCALE = 0.9;

/**
 * Compact display styles for 1024x600 screens
 * These styles optimize the front-end layout for constrained display sizes
 */
export const stylesAppContent1024x600 = css`
  /* ========================================================================
   * HEADER OPTIMIZATIONS
   * ======================================================================== */

  > header {
    height: 50px;
    min-height: 50px;
    max-height: 50px;

    h1 {
      font-size: 1.2rem !important; /* Reduced from 1.4rem */
    }
  }

  /* ========================================================================
   * FOOTER OPTIMIZATIONS
   * ======================================================================== */

  > footer {
    height: 40px;
    min-height: 40px;
    max-height: 40px;
  }

  /* ========================================================================
   * MAIN CONTENT AREA OPTIMIZATIONS
   * ======================================================================== */
  > main {
    .main-content {
      padding: 0; /* Remove all padding to eliminate top spacing */
      align-items: flex-start !important;
      justify-content: center;

      /* MAIN SECTION */
      > section {
        height: auto !important; /* Remove height: 100% constraint */
        height: ${MAIN_CONTENT_HEIGHT}px !important;
        min-height: unset; /* Remove fixed min-height constraint */
        max-height: unset; /* Remove max-height constraint (680px) */

        /* Page Header */
        header.page-header {
          padding: 0.25rem 1rem; /* Further reduced */
          flex-shrink: 0;
        }

        /* Page Content */
        .page-content {
          padding: 0.5rem 1rem !important; /* Further reduced from 1rem */
          /* align-items: flex-start !important; */

          /* PRODUCT SELECTION PADS */
          section div[role='radiogroup'] {
            transform: scale(${UI_SCALE});
            /* button.pad.radio {
              min-width: 120px;
              padding: 0.55rem 2rem !important;
              font-size: 1.2rem;
              margin: 0 0.2rem;
              max-height: 50px !important;
              height: 50px !important;
            } */
          }
        }

        /* Page Navigation (bottom) -- keep this HERE */
        nav.page-navigation {
          padding: 0.25rem 1rem; /* Further reduced */
        }
      }
    }
  }

  /* ========================================================================
   * TYPOGRAPHY OPTIMIZATIONS
   * ======================================================================== */

  .title {
    font-size: 1.5rem; /* Reduced from default h1 size */
    margin-bottom: ${spacing.sm}; /* Reduced from default */
  }

  .subtitle {
    font-size: 1rem; /* Reduced from lg */
    margin-bottom: ${spacing.xs};
  }

  p {
    font-size: 1rem; /* Reduced from 1.2rem */
    padding-bottom: 1rem; /* Reduced from 2rem */
    line-height: 1.5; /* Slightly tighter */
  }

  /* ========================================================================
   * CONTENT-SPECIFIC OPTIMIZATIONS
   * ======================================================================== */

  &.temperature-content,
  &.time-content {
    min-width: auto; /* Remove 800px constraint */
    min-height: auto; /* Remove 600px constraint */
    gap: 1rem; /* Reduced from 2rem */
  }

  .page-description {
    margin-top: -20%; /* Reduced from -33% */
    margin-bottom: -4%; /* Reduced from -8% */
  }

  /* ========================================================================
   * BUTTON OPTIMIZATIONS (No scale - using padding/font-size only)
   * ======================================================================== */

  /* Main content area spacing - ensure footer is visible */
  > main {
    .main-content {
      > section {
        gap: 0.5rem; /* Reduced spacing between header, content, nav */
        justify-content: flex-start; /* Changed from space-between to ensure footer visible */
      }
    }
  }

  /* MainPage specific optimizations */
  .main-content {
    column-gap: 2.5rem; /* Reduced from 3rem */
  }

  /* ========================================================================
   * MAIN-PAGE - SLOT/PAD GRID OPTIMIZATIONS (No scale - using actual dimensions)
   * ======================================================================== */

  /* Main slot grid container */
  .main-page-slot-grid {
    gap: 1rem; /* Reduced from 1.5rem */
    transform: translateY(${SLOT_GRID_TRANSLATE_Y});

    /* Slot grid gaps */
    .slot-grid {
      row-gap: 1.2rem !important;
      column-gap: 1.2rem !important;
      width: ${SLOT_GRID_WIDTH}px !important;
      height: ${SLOT_GRID_HEIGHT}px !important;
    }

    .pad-slot.checkbox {
      width: 90px !important;
      height: 90px !important;
    }

    /* Special column spacing */
    .slot-col-lg {
      margin-left: 1rem; /* Reduced from 1.5rem */
      row-gap: 1.2rem; /* Reduced from 1.3rem */
      column-gap: 0.6rem; /* Reduced from 1rem */
      max-width: 280px; /* Reduced from 360px */
    }

    .pad-slot.pad-large {
      width: 120px !important;
      height: 120px !important;
    }

    .pad-special {
      width: 100px !important;
      /* transform: translateY(1.5rem); */
    }
  }

  /* Pad sizes - scaled to 0.8 equivalent without transform */
  .pad-slot,
  .pad-special {
    width: 88px !important; /* Reduced from 110px (0.8 scale) */
    height: 88px !important; /* Reduced from 110px (0.8 scale) */
    font-size: 1.2rem; /* Reduced from 1.5rem */
  }

  /* Large pad sizes */
  .pad-slot.pad-lg {
    width: 120px !important; /* Reduced from 150px (0.8 scale) */
    height: 120px !important; /* Reduced from 150px (0.8 scale) */
  }

  /* Special power button */
  .pad-special.power {
    width: 120px !important; /* Reduced from 150px (0.8 scale) */
    height: 191px !important; /* Reduced from 239px (0.8 scale) */
  }

  /* Content area buttons (Programar Tiempo, Programar Producto) */
  .content-buttons {
    row-gap: 1rem; /* Static gap between buttons - keep this fixed */
    height: 330px !important; /* Fixed container height */

    button.pad-rect {
      flex: 1; /* Buttons stretch to fill available vertical space equally */
      width: 250px; /* Reduced from 300px */
      min-height: 0; /* Remove min-height so flex can work properly */
      font-size: 1.15rem; /* Reduced from 1.4rem */
      padding: 0.75rem; /* Reduced padding - flex will handle vertical spacing */
    }
  }

  /* ========================================================================
   * PAGE HEADER OPTIMIZATIONS
   * ======================================================================== */

  /* Hide page header [DEPRECATED] */
  header.page-header {
    display: none; /* Hide completely to maximize content space */
  }

  /* ========================================================================
   * PAGE NAVIGATIONN + FOOTER OPTIMIZATIONS
   * ======================================================================== */

  /* Footer navigation buttons */
  nav.page-navigation {
    .nav-list {
      gap: 0.4rem; /* Reduced from 0.66rem */
      padding: 0.25rem; /* Reduced from 0.5rem */
    }

    button.small-button {
      min-width: 150px; /* Reduced from 180px */
      padding: 0.66rem 2.5rem; /* Reduced from 0.9rem 3rem */
      font-size: 1rem; /* Reduced from base */
      margin: 0 0.2rem; /* Reduced from 0 0.33rem */

      &.has-chevron-left svg {
        transform: translateX(-1rem);
        height: 1.33rem;
      }

      &.has-chevron-right svg {
        transform: translateX(1rem);
        height: 1.33rem;
      }
    }

    div.nav-wrapper {
      position: fixed !important;
      bottom: 55px !important;
      left: 0;
      right: 0;
    }
  }

  /* ========================================================================
   * TOOLBARS
   * ======================================================================== */

  .toolbar-user {
    padding-right: 15px;
  }

  .toolbar,
  footer {
    button {
      /* ORIG SIZE: 42px x 42px */
      width: 28px !important;
      height: 28px !important;
      svg {
        /* ORIG SIZE: 24px x 24px */
        width: 24px !important;
        height: 24px !important;
      }
    }
  }

  div[role='dialog'].rt-DialogContent {
    transform: scale(0.8) !important;
  }

  /* ========================================================================
   * PATHNAME SCOPES
   * ======================================================================== */

  &[data-pathname='main'] .page-content {
    transform: translateY(-2.25rem) !important;
  }

  &[data-pathname='time'] .page-content {
    transform: translateY(0) !important;
    .time-content {
      transform: scale(${UI_SCALE});
    }
  }

  &[data-pathname='temperature'] .page-content {
    transform: translateY(3rem) !important;
    .temperature-content {
      transform: scale(${UI_SCALE});
    }
  }

  &[data-authenticated='false'] {
    header.admin-app-header {
      padding: 0 0.25rem 0 1.5rem;
    }

    header.admin-page-header {
      padding-bottom: 0;
    }

    nav .nav-button {
      font-size: 0.8rem;
      height: 34px;
    }

    .page-content {
      transform: translateY(-8%) scale(0.8) !important;
      .admin-page-content {
        transform: translateY(-1rem) !important;
        overflow-y: visible !important;
      }
    }
  }
`;
