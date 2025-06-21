import { css } from '@emotion/react';

export const styles = css`
  .admin-nav {
    display: flex;
    gap: 0.5rem;

    /* Make tab links visible with white text */
    a {
      color: white !important;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      /* Active state - blue text */
      &[data-state='active'] {
        background-color: transparent !important;
        color: #3b82f6 !important;
        font-weight: 600 !important;
      }
    }
  }
`;
