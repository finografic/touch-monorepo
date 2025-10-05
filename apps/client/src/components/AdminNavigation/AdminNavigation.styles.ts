import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  .container > div > div {
    padding: 0 !important;
  }

  .admin-nav {
    display: flex;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 600;

    .nav-button {
      color: ${colors.text};
      background-color: transparent;
      font-weight: 600;
      border: none;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: ${layout.borderRadius.lg};
      transition: all 0.2s ease;
      opacity: 1;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      &.active {
        color: ${colors.infoLight};
      }

      &.transitioning {
        cursor: wait;
        opacity: 0.7;
      }
    }
  }
`;
