import { css } from '@emotion/react';

import { colorsDirect as colors } from 'styles';
import { baseToolbarStyles } from '../toolbar.styles';

/**
 * FrontEndToolbar styles - extends base toolbar styles
 * Add any frontend-specific style overrides here if needed
 */

export const styles = css`
  ${baseToolbarStyles}

  &.theme-light {
    .button-box button.button {
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
    .button-box button.button {
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
