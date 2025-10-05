import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  .container > div > div {
    padding: 0 !important;
  }

  ul.admin-nav {
    display: flex;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 700;
    overflow: visible;

    .nav-button {
      color: ${colors.text};
      background-color: transparent;
      font-weight: 700;
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
        & span {
          font-weight: 700;
        }
      }

      &.transitioning {
        cursor: wait;
        opacity: 0.7;
      }
    }
  }
`;
