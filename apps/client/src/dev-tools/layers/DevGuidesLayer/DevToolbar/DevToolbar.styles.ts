import { css } from '@emotion/react';

import { colors, layout } from '@finografic/design-system/tokens';

const buttonSize = 48;
const buttonRight = 40;
const buttonBottom = 30;

export const styles = css`
  .toolbar-col {
    box-shadow: inset 0 0 0 2px ${colors.greyXLight};
  }

  .toolbar {
    position: fixed;
    z-index: 15;
    bottom: 0;
    height: ${buttonSize}px;
    right: ${buttonRight}px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${colors.white};
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); /* Custom easing for "pop" effect */

    /* Closed state */
    width: ${buttonSize}px;
    height: ${buttonSize}px; /* Added height control for circle */
    border-radius: 50%;
    transform: translate(0, calc(-${buttonBottom}px + 7px));
    border: ${layout.borderWidth} solid ${colors.greyXLight};
    box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.15);
    &:hover:not(.open) {
      border: ${layout.borderWidth} solid ${colors.primary};
    }
  }

  .toolbar.open {
    width: calc(100% + ${buttonRight}px); /* Add back the right offset */
    height: 64px;
    right: 0;
    border-radius: 0;
    transform: translate(0, 0);
    animation: toolbar-expand 0.6s cubic-bezier(0.05, 0.7, 0.1, 1); /* Slow start, fast finish */
    box-shadow: none;
  }

  .toolbar-toggle {
    position: fixed; /* Fixed instead of absolute */
    bottom: 16px;
    right: ${buttonRight}px; /* Match toolbar right */
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    pointer-events: none;
    z-index: 1001; /* Ensure it's above toolbar */
  }

  /* ICON-TOGGLE ************************************************************* */

  .icon-toggle {
    left: auto;
    right: ${buttonRight}px;
    bottom: ${buttonBottom}px;
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    transform: translate(15px, 8px);
    svg {
      color: ${colors.grey};
    }
    &:hover {
      svg {
        color: ${colors.primary};
      }
      & + .toolbar:not(.open) {
        border: ${layout.borderWidth} solid ${colors.primary};
      }
    }

    &.open {
      right: auto;
      left: calc(${buttonSize}px / 2);
      transform: translate(7px, 22px);
      svg {
        color: ${colors.primary};
      }
      animation: icon-expand 0.6s cubic-bezier(0.05, 0.7, 0.1, 1);
    }
    animation: icon-collapse 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* ANIMATION: TOOLBAR ***************************************************** */

  @keyframes toolbar-expand {
    0% {
      width: 48px; /* Match new size */
      height: 48px;
      border-radius: 50%;
      clip-path: circle(50% at calc(100% - 32px - 24px) 50%); /* Adjusted for new size */
      border-color: ${colors.greyXLight};
    }

    30% {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      clip-path: circle(60% at calc(100% - 32px - 24px) 50%);
      border-color: transparent;
    }

    100% {
      width: 100%;
      height: 64px;
      border-radius: 0;
      clip-path: inset(0 0 0 0);
      border-color: ${colors.greyXLight};
    }
  }

  /* Optional: Add a subtle "pop" animation for closing */
  @keyframes collapse {
    0% {
      clip-path: inset(0 0 0 0);
    }

    100% {
      clip-path: circle(50% at calc(100% - 32px) 50%);
    }
  }

  .toolbar:not(.open) {
    animation: collapse 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* ANIMATION: ICON ******************************************************** */

  @keyframes icon-expand {
    0% {
      opacity: 0;
    }
    30% {
      opacity: 0;
    }
    60% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes icon-collapse {
    0% {
      opacity: 0;
    }
    30% {
      opacity: 0;
    }
    60% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
