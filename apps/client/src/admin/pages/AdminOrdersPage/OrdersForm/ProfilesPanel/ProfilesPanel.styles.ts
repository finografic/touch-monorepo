import { css } from '@emotion/react';

export const styles = css`
  .temperature-profiles-panel-wrapper {
    width: 100%;
  }

  .temperature-profiles-panel {
    /* PrimeReact Panel base styling */
    &.p-panel {
      /* border-radius: 8px; */
    }

    /* Header styling */
    .p-panel-header {
      background-color: var(--color-background-panel-header, #f5f5f5);
      border-bottom: 1px solid var(--color-border-panel, #e0e0e0);
      padding: 1rem;
    }

    /* Title styling */
    .p-panel-title {
      font-weight: 600;
      font-size: 1rem;
    }

    /* Toggle button styling */
    .p-panel-header-icon {
      display: flex;
      align-items: center;
      justify-content: center;

      .panel-toggle-icon {
        width: 20px;
        height: 20px;
        transition: transform 0.3s ease-in-out;

        &.icon-is-collapsed {
          transform: rotate(-90deg);
        }

        &.icon-is-open {
          transform: rotate(0deg);
        }
      }
    }

    /* Content styling */
    .p-panel-content {
      padding: 1.5rem;
      background-color: var(--color-background-panel-content, #ffffff);
    }

    /* Footer styling */
    .p-panel-footer {
      background-color: var(--color-background-panel-footer, #fafafa);
      border-top: 1px solid var(--color-border-panel, #e0e0e0);
      padding: 1rem;
    }
  }

  /* Panel footer content */
  .panel-footer {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
  }

  /* Total rows counter styling */
  .total-rows-counter {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
    white-space: nowrap;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .panel-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .temperature-profiles-panel {
      .p-panel-content {
        padding: 1rem;
      }
    }
  }
`;
