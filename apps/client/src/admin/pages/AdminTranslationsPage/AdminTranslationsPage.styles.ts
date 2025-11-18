import { css } from '@emotion/react';

import { colors, layout, min, spacing } from 'styles';

export const stylesItemsGrid = css``;

export const styles = css`
  .admin-section {
    margin-bottom: 0.5rem;
    &:last-of-type {
      margin-bottom: 2rem;
    }
  }

  .validation-error {
    display: none;
  }

  input:read-only,
  input:read-only:focus {
    pointer-events: none !important;
    user-select: none !important;
    outline: none !important;
    box-shadow: none !important;
  }

  ${min.md} {
    /* max-width: 96vw !important; */
  }
  ${min.lg} {
    /* max-width: 96vw !important; */
  }
  ${min.xl} {
    /* max-width: 1240px !important; */
  }
`;
