import { css } from '@emotion/react';

import { colors } from 'styles';
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
        color: ${colors.defaultXLight};
        border-color: ${colors.defaultXLight};
      }
      &:hover {
        cursor: pointer;
        border-color: transparent;
        background-color: transparent;
      }
    }
  }

  &.theme-dark {
    .button-box button.button {
      svg.icon {
        color: ${colors.white75};
        border-color: ${colors.white75};
      }
      &:hover {
        cursor: pointer;
        border-color: transparent;
        background-color: transparent;
      }
    }
  }
`;
