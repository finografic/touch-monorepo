import { css } from '@emotion/react';

import { colors } from '@finografic/design-system/tokens';

export const styles = css`
  /* Container for the entire section */
  .image-configuration-section {
    width: 100%;
  }

  [role='combobox'] {
    width: 100% !important;
    min-width: 300px;
    flex: 1;
  }

  /* Enhance the overall layout */
  .image-config-row {
    align-items: center;
    gap: 1rem;
  }

  .image-label {
    min-width: 120px;
    flex-shrink: 0;
  }

  .image-select-container {
    flex: 1;
    min-width: 300px;
    max-width: 600px;
  }

  .preview-button {
    flex-shrink: 0;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .image-config-row {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }

    .image-label {
      min-width: auto;
    }

    .image-select-container {
      min-width: auto;
    }

  }
`;
