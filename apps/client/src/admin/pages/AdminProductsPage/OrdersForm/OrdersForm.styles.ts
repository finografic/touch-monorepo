import { css } from '@emotion/react';

import { colors, layout, min } from '@workspace/design-system/tokens';

export const styles = css`
  &.form-container {
    width: 100vw;
    max-width: 100vw !important;
    min-width: 1000px !important;

    ${min.lg} {
      /* max-width: 88vw !important; */
    }
    ${min.xl} {
      /* max-width: 77vh !important; */
    }

    .tab-content-new,
    .tab-content-edit {
      max-width: 100vw !important;

      ${min.lg} {
        /* max-width: 88vw !important; */
      }
      ${min.xl} {
        /* max-width: 66vh !important; */
      }
    }

    background-color: ${colors.white};
    color: ${colors.text};
    overflow: hidden;
  }

  .col-temperature-inputs {
    label {
      transform: translateX(-0.25rem);
    }
  }

  .col-form-table {
    padding: 1rem 0 !important;
  }

  /* TODO: Consider extracting to a styled wrapper component for PrimeReact InputNumber
   * Potential component: <StyledInputNumberStacked /> or enhance TemperatureInputField
   * This styling is specific to stacked button layout and could be encapsulated
   * Lines: 43-56
   */
  .p-inputnumber-buttons-stacked {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 0; /* Removed gap to eliminate space between buttons and input */
    padding: 0.25rem 1.5rem;
    border-radius: 0 0 ${layout.borderRadius} ${layout.borderRadius};
    .p-inputnumber-button-group {
      order: 0;
    }
    .p-inputnumber-input {
      order: 1;
    }
  }

  /* ============================================================================
     PRIMEREACT PANEL - TEMPERATURE PROFILES
     ============================================================================ */

  /* TODO: Consider extracting to a dedicated component: <ProfilesPanel />
   * This is a large, self-contained visual component with:
   * - Custom panel header styling
   * - Toggle icon behavior
   * - Footer with action buttons
   * - Collapse/expand animations
   * Could become: components/ProfilesPanel/ProfilesPanel.tsx
   * Benefits: Reusable, testable, better separation of concerns
   * Lines: 62-136
   */
  .temperature-profiles-panel {
    margin-top: 1.5rem;
    border: 2px solid ${colors.greyXXLight75};
    border-radius: ${layout.borderRadius};

    /* Panel Header */
    .p-panel-header {
      border-bottom: 2px solid ${colors.greyXXLight75};
      padding: 1rem 1.5rem;
      border-radius: ${layout.borderRadius} ${layout.borderRadius} 0 0;
      background-color: ${colors.white};

      &:hover {
        background-color: ${colors.greyXXLight25};
        cursor: pointer;
      }

      .p-panel-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: ${colors.textLight};
      }

      button.p-panel-toggler {
        border: none !important;
        outline: none !important;
        margin-right: 0.75rem;
        svg.icon {
          width: 28px;
          height: 28px;
          &.icon-is-collapsed {
            color: ${colors.greyXLight};
            stroke: ${colors.greyXLight};
            &:hover {
              color: ${colors.grey};
              stroke: ${colors.grey};
            }
          }

          &.icon-is-open {
            color: ${colors.grey};
            stroke: ${colors.grey};
            &:hover {
              color: ${colors.greyDark};
              stroke: ${colors.greyDark};
            }
          }
        }
      }

      /* Custom toggle icons - more prominent */
      .p-panel-icons {
        .panel-toggle-icon {
          width: 22px;
          height: 22px;
          color: ${colors.info};
          transition: all 0.25s ease-in-out; /* Smooth bidirectional transition */
          opacity: 0.9;

          &:hover {
            color: ${colors.infoDark};
            opacity: 1;
            transform: scale(1.1);
          }
        }
      }
    }

    /* Panel Content - NO scrollbar, show full content */
    .p-panel-content {
      padding: 1.5rem;
      background-color: ${colors.white};
    }

    /* Toggleable content wrapper - allow smooth transitions */
    .p-toggleable-content {
      /* Don't force overflow or max-height - let PrimeReact handle the animation */
      /* After animation completes, content will be visible naturally */
    }

    /* When panel is expanded, ensure content flows naturally */
    &:not(.p-panel-collapsed) {
      .p-panel-content {
        overflow: visible; /* Allow content to flow naturally when expanded */
      }
    }

    /* Panel Footer */
    .p-panel-footer {
      background-color: ${colors.white};
      border-top: 2px solid ${colors.greyXXLight75};
      padding: 0.25rem 1.5rem;
      border-radius: 0 0 ${layout.borderRadius} ${layout.borderRadius};
      transition: border-color 0.25s ease-in-out;

      button {
        min-width: 120px;
      }
    }

    /* When panel is collapsed, hide footer border */
    &[data-collapsed='true'] {
      .p-panel-footer {
        border-top-color: transparent;
      }
    }
  }
`;
