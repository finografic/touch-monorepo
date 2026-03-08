import { colors, layout } from '@workspace/design-system/tokens';
import { BREAKPOINTS, min } from '@workspace/design-system/viewport';

import { css } from '@emotion/react';

export const stylesTypography = css`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${colors.text};
`;

export const styles = css`
  width: 100%;
  margin: 0 auto;
  /*
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
  } */

  .navbar {
    padding: 0;
    overflow: visible;
    /* display: flex;
    justify-content: center;
    align-items: center; */

    box-sizing: content-box;
    /* padding: 0 3.5rem 0 3rem !important; */
    /* margin-top: 24px;
    margin-bottom: 0.75rem; */
    /*

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
    } */
  }

  .nav-items {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* position: absolute; */

    div[role='tablist'] {
      box-shadow: inset 0 -3px 0 0 ${colors.defaultXXLight};
    }
  }

  /* Tab nav row */
  .admin-nav {
    display: flex;
    gap: 0.5rem;
    ${stylesTypography}
    overflow: visible;
    position: relative;
    width: 100%;
    max-width: 100%;
    flex-wrap: nowrap;
    margin: 0 1rem !important;

    /* Bottom rule — replaces Radix TabNav's built-in indicator */
    border-bottom: 2px solid ${colors.defaultXXXLight};
    /* border-bottom: 0 !important; */

    button.nav-button {
      ${stylesTypography}
      position: relative;
      background-color: transparent;
      border: var(--border-widths-default) solid ${colors.transparent} !important;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: ${layout.borderRadius} ${layout.borderRadius} 0 0;
      transition: all 0.2s ease;
      opacity: 1;
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;

      /* Active indicator line */
      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        right: 0;
        height: 2px;
        background-color: transparent;
        transition: background-color 0.2s ease;
      }

      :hover {
        color: ${colors.text};
        background-color: transparent !important;
      }

      &.active {
        color: ${colors.info};
        font-weight: 700;

        &::after {
          background-color: ${colors.info};
        }

        :hover {
          color: ${colors.infoXDark};

          &::after {
            background-color: ${colors.infoXDark};
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
