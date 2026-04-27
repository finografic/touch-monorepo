import { css } from '@emotion/react';
import { colors } from '@finografic/design-system/tokens';

export const styles = css`
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background-color: white;
    border: 2px solid ${colors.greyXXLight}!important;

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;

    height: 320px;

  .image-library-selection-marker {
    width: 24px;
    display: flex;
    justify-content: center;
  }

  .image-library-thumbnail {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .image-library-meta {
    flex: 1;
  }
`;
