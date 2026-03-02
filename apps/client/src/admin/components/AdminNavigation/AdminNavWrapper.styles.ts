import { css } from '@emotion/react';

import { BREAKPOINTS, button, colors, layout, min } from '@workspace/design-system/tokens';

export const stylesTypography = css`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${colors.text75};
`;

export const styles = css`
  width: 100%;
  margin: 0 auto;

  ${min.sm} {
    max-width: 94vw;
  }
  ${min.md} {
    max-width: 96vw;
  }
  ${min.lg} {
    max-width: 96vw;
  }
  ${min.xl} {
    max-width: ${BREAKPOINTS.xl}px;
    max-width: ${BREAKPOINTS.xl + 200}px;
  }

  .navbar {
    padding: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    box-sizing: content-box;
    padding: 0 3.5rem 0 3rem !important;
    margin-top: 24px;
    margin-bottom: 0.75rem;

    ${min.sm} {
      max-width: 94vw;
    }
    ${min.md} {
      max-width: 96vw;
    }
    ${min.lg} {
      max-width: 96vw;
    }
    ${min.xl} {
      max-width: ${BREAKPOINTS.xl + 200}px;
    }
  }

  .nav-items {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    position: absolute;
  }

  /* Radix TabNav overrides */
  ul.admin-nav {
    display: flex;
    gap: 0.5rem;
    ${stylesTypography}
    overflow: visible;
    position: relative;
    width: 100%;
    max-width: 100%;
    flex-wrap: nowrap;
    margin: 0 1rem !important;

    button.rt-TabNavLink.nav-button {
      ${stylesTypography}
      background-color: transparent;
      border: ${button.border.width} solid ${colors.transparent}!important;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: ${layout.borderRadius};
      transition: all 0.2s ease;
      opacity: 1;
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;

      :hover {
        color: ${colors.text};
        &,
        & span {
          background-color: transparent !important;
        }
      }

      &.active {
        color: ${colors.info};
        font-weight: 700;
        :before {
          border-bottom: 2px solid ${colors.info};
        }
        & span {
          font-weight: 700;
          background-color: transparent !important;
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

  li:first-of-type {
    padding-left: 0.5rem !important;
  }

  /* Disable Radix TabNav's built-in responsive hamburger behavior */
  .admin-nav {
    /* Force TabNav to always show horizontal layout, never collapse to hamburger */
    @media (max-width: 768px) {
      /* Override any Radix responsive behavior */
    }
  }

  /* Dropdown menu styles (for MoreButton) */
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

  /* Invisible measurement container */
  .measure {
    position: absolute;
    visibility: hidden;
    overflow: hidden;
    white-space: nowrap;
    pointer-events: none;
    height: 0;
  }
`;
