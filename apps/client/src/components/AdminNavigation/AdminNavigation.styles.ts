import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  .admin-nav {
    display: flex;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 600;

    a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      &[data-state='active'] {
        background-color: transparent !important;
        color: ${colors.infoLight} !important;
        font-weight: 600 !important;
      }
    }
  }
`;
