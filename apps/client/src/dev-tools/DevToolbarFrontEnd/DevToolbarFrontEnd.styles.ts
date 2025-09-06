import { css } from '@emotion/react';
import { baseToolbarStyles } from 'admin-tools/toolbar.styles';
import { colors } from 'styles';

/**
 * DevToolbarFrontEnd styles - extends base toolbar styles with grey color scheme
 */
export const styles = css`
  ${baseToolbarStyles}

  /* Override positioning to right-align icons */
  justify-content: flex-end !important;

  /* Override button colors to grey for DevTools - very specific selectors */
  .button-box button.btn {
    svg.icon {
      color: ${colors.greyDark} !important;
    }
    &:hover {
      border-color: transparent;
      background-color: ${colors.grey10} !important;
      svg.icon {
        color: ${colors.greyLight} !important;
      }
    }

    &.active {
      svg.icon {
        color: ${colors.warningDark} !important;
      }
    }
  }

  button.btn.btn-toggle-query-panel {
    svg.icon {
      transform: translate(-2px, 4px);
    }
  }
  button.btn.btn-toggle-auth {
    svg.icon {
      transform: translate(0, -1px) scale(0.9);
    }
  }
  button.btn.btn-toggle-simple-login {
    svg.icon {
      transform: translate(0, -1px) scale(0.9);
    }
  }
`;
