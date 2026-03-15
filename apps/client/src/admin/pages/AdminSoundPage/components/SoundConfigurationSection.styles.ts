import { css } from '@emotion/react';

import { colors } from '@finografic/design-system/tokens';

export const styles = css`
  /* Container for the entire section */
  .sound-configuration-section {
    width: 100%;
  }

  [role='combobox'] {
    width: 100% !important;
    min-width: 300px;
    flex: 1;
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

  }
`;
