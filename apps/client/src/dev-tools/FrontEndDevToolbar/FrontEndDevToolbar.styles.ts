import { css } from '@emotion/react';
import { baseToolbarStyles } from '../../admin-tools/toolbar.styles';
import { colors } from 'styles';

/**
 * FrontEndDevToolbar styles - extends base toolbar styles with grey color scheme
 */
export const styles = css`
  ${baseToolbarStyles}

  /* Override positioning to right-align icons */
  justify-content: flex-end !important;

  /* Override button colors to grey for DevTools - very specific selectors */
  .button-box button.btn {
    svg.icon {
      color: ${colors.grey} !important;
    }
    &:hover {
      border-color: transparent;
      background-color: ${colors.grey}11 !important;
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
      color: ${colors.grey} !important;
    }
  }
`;
