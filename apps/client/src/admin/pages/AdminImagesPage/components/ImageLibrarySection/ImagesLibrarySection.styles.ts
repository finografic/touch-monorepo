import { css } from '@emotion/react';

export const styles = css`
  .test-library-grid {
    display: grid !important;
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    gap: 1.5rem;
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
  }
`;
