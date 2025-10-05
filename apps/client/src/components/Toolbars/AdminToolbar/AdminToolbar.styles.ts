import { css } from '@emotion/react';
import { baseToolbarStyles } from '../toolbar.styles';
import { colors } from 'styles';

/**
 * FrontEndToolbar styles - extends base toolbar styles
 * Add any frontend-specific style overrides here if needed
 */

export const styles = css`
  ${baseToolbarStyles}

  &.theme-light {
    .button-box button.btn {
      svg.icon {
        color: ${colors.infoLight};
        border-color: ${colors.infoLight};
        background-color: transparent;
      }
      &:hover {
        cursor: pointer;
        color: ${colors.infoDark};
        border-color: ${colors.infoDark};
        background-color: ${colors.infoLight25};
      }
    }
  }

  &.theme-dark {
    .button-box button.btn {
      svg.icon {
        color: ${colors.infoLight};
        border-color: ${colors.infoLight};
        background-color: transparent;
      }
      &:hover {
        cursor: pointer;
        color: ${colors.infoDark};
        border-color: ${colors.infoDark};
        background-color: ${colors.infoLight25};
      }
    }
  }
`;
