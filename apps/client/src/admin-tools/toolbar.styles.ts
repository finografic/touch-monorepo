import { css } from '@emotion/react';
import { styles as stylesButton } from 'components/ButtonControl/ButtonControl.styles';
import { colors, layout } from 'styles';

/**
 * Shared base styles for all admin toolbars
 * Used by both AdminToolbar and FrontEndAdminToolbar
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
  z-index: 1500;

  button {
    ${stylesButton}
    padding: 0.75rem 1rem;
    min-width: auto;
    width: auto;
    border-width: 0;
    svg.icon {
      color: ${colors.infoXLight};
      border-color: ${colors.infoXLight};
      stroke: ${colors.infoXLight};
    }
    &:hover {
      border-color: transparent;
      svg.icon {
        color: ${colors.info};
        color: ${colors.info};
        border-color: ${colors.info};
        stroke: ${colors.info};
      }
    }

    &.active {
      svg.icon {
        color: ${colors.warningDark};
      }
    }
  }

  .timer-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-right: 20px;
    width: fit-content;
    height: auto;
    color: ${colors.warningDark};
  }
`;
