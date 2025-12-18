import { css } from '@emotion/react';

import { colors, layout, min } from 'styles';

export const styles = css`
  /* position: relative; */
  /* left: 50vw; */
  /* transform: translateX(-33vw); */
  /* box-sizing: border-box; */
  /* margin: 0 auto; */
  /* width: 90vw; */
  /* max-width: 100%; */
  /* margin: 0 auto; */

  /* .container > div > div { */
  > div > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    /* max-width: 100%; */
    overflow: hidden;
    /* padding: 0 !important; */
  }

  /* background-color: pink; */
  ${min.sm} {
    /* max-width: 96vw; */
  }
  ${min.md} {
    /* max-width: 96vw; */
  }
  ${min.lg} {
    /* max-width: 96vw; */
    /* display: block !important; */

    /* width: 92vw !important;
    max-width: 100%; */
    /* margin: 0 auto; */
    /* position: absolute; */
    /* display: block !important; */
  }
  ${min.xl} {
    /* max-width: 1240px; */
  }

  /* .container {
    background-color: pink;
  } */

  /* .container > div {
    background-color: pink;
  } */

  /* .container > div > div {
    background-color: pink;
  } */

  ul.admin-nav {
    display: flex;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 700;
    overflow: visible;
    position: relative;
    width: 100%;
    max-width: 100%;
    flex-wrap: nowrap;

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

    /* caret icon */
    svg:not(.icon) {
      transform: scale(1.4);
    }
    /* route icon */
    svg.icon {
      width: 1.4rem;
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

  /* More button specific styles */
  .more-button {
    /* Add any specific styles for the More button trigger */
  }

  .more-dropdown {
    /* Add any specific styles for the More dropdown content */
  }

  /* Disable Radix TabNav's built-in responsive hamburger behavior */
  .admin-nav {
    /* Force TabNav to always show horizontal layout, never collapse to hamburger */
    @media (max-width: 768px) {
      /* Override any Radix responsive behavior */
    }
  }
`;
