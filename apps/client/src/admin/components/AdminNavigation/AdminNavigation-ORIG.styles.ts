import { css } from '@emotion/react';

import { colors, layout } from 'styles';

export const styles = css`
  .container > div > div {
    display: flex;
    justify-content: center;
    align-items: center;
    /* width: 100%;
    padding: 0 !important; */
  }

  ul.admin-nav {
    display: flex;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 700;
    overflow: visible;
    position: relative;

    button.rt-TabNavLink.nav-button {
      color: ${colors.text75};
      background-color: transparent;
      font-weight: 700;
      border: none;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: ${layout.borderRadius};
      transition: all 0.2s ease;
      opacity: 1;
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: center;

      :hover {
        background-color: transparent !important;
        color: ${colors.text};
      }

      &.active {
        color: ${colors.info};
        font-weight: 700;
        :before {
          border-bottom: 2px solid ${colors.info};
        }
        & span {
          font-weight: 700;
          background-color: transparent;
        }
        :hover {
          color: ${colors.infoXDark};
          :before {
            border-bottom: 2px solid ${colors.infoXDark};
          }
          & span {
            font-weight: 700;
            background-color: transparent;
          }
        }
      }

      &.transitioning {
        cursor: wait;
        opacity: 0.7;
      }

      &.more-button,
      &.hamburger-button {
        font-weight: 600;
      }
    }
  }

  /* Dropdown menu styles */
  .rt-DropdownMenuContent {
    min-width: 180px;

    .rt-DropdownMenuItem {
      cursor: pointer;

      &.active {
        background-color: ${colors.primary25};
        color: ${colors.primaryDark};
        font-weight: 700;
      }
    }
  }
`;
