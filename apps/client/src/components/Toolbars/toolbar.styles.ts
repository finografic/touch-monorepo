import { css } from '@emotion/react';

import { styles as stylesButton } from 'components/ButtonControl/ButtonControl.styles';

import { colors, layout, min } from 'styles';

/**
 * Shared base styles for all admin toolbars
 * Used by both AdminToolbar and FrontEndToolbar
 */
export const baseToolbarStyles = css`
  width: 100%;
  height: ${layout.footer.height};
  min-height: ${layout.footer.height};
  max-height: ${layout.footer.height};
  background-color: transparent;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  z-index: 800;

  .button-box button.button {
    ${stylesButton}
    padding: 0.5rem;
    min-width: auto;
    width: auto;
    border-width: 0;
    transform: none;

    &:hover {
      cursor: pointer;
      transform: none;
      border-color: transparent;
      background-color: transparent;
      svg.icon {
        color: ${colors.infoLight};
        border-color: ${colors.infoLight};
      }
    }
    &.active {
      svg.icon {
        color: ${colors.warningLight};
      }
    }

    box-shadow: inset 0 0 0 2px transparent;

    ${min.sm} {
      padding: 0.2rem;
      /* box-shadow: inset 0 0 0 2px rgba(200, 200, 0, 0.2); */
    }

    ${min.md} {
      padding: 0.25rem;
      /* box-shadow: inset 0 0 0 2px rgba(200, 200, 0, 0.2); */
    }

    ${min.lg} {
      padding: 0.3rem;
      /* box-shadow: inset 0 0 0 2px rgba(0, 200, 200, 0.2); */
    }

    ${min.xl} {
      padding: 0.4rem;
      /* box-shadow: inset 0 0 0 2px rgba(0, 200, 0, 0.2); */
    }

    ${min.xxl} {
      padding: 0.4rem;
      /* box-shadow: inset 0 0 0 2px rgba(0, 200, 0, 0.2); */
    }
  }

  .timer-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-right: 20px;
    width: fit-content;
    height: auto;
    color: ${colors.warningLight};
  }
`;
