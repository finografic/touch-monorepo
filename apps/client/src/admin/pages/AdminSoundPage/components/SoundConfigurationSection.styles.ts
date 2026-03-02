import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';

export const styles = css`
  /* Container for the entire section */
  .sound-configuration-section {
    width: 100%;
  }

  /* Make Radix Select components stretch to fill their container */
  .rt-SelectTrigger {
    width: 100% !important;
    min-width: 300px;
    flex: 1;
  }

  /* Alternative targeting using role attribute */
  [role='combobox'] {
    width: 100% !important;
    min-width: 300px;
    flex: 1;
  }

  /* Ensure the Select.Root container also stretches */
  .rt-SelectRoot {
    width: 100%;
    flex: 1;
  }

  /* Style the dropdown content to match the trigger width */
  .rt-SelectContent {
    min-width: 300px;
    max-width: 600px;
  }

  /* Enhance the overall layout */
  .sound-config-row {
    align-items: center;
    gap: 1rem;
  }

  .sound-label {
    min-width: 120px;
    flex-shrink: 0;
  }

  .sound-select-container {
    flex: 1;
    min-width: 300px;
    max-width: 600px;
  }

  .test-button {
    flex-shrink: 0;
  }

  /* Hover and focus states for better UX */
  .rt-SelectTrigger:hover {
    border-color: ${colors.primaryLight};
  }

  .rt-SelectTrigger:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px ${colors.primaryLighter};
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .sound-config-row {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }

    .sound-label {
      min-width: auto;
    }

    .sound-select-container {
      min-width: auto;
    }

    .rt-SelectTrigger {
      min-width: auto;
    }
  }
`;
