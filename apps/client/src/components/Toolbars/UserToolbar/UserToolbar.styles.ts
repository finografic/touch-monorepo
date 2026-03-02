import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';
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
        color: ${colors.greyXLight};
        border-color: ${colors.greyXLight};
        stroke: ${colors.greyXLight};
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

  &.button.button-auth.logged-out,
  &.button.button-auth.logged-in {
    svg.icon {
      color: ${colors.white75};
    }
    &:hover {
      border-color: transparent;
      svg.icon {
        color: ${colors.infoLight};
      }
    }
  }

  &.button.button-auth.logged-out {
    svg.icon {
      color: ${colors.greyXXLight};
    }
  }

  &.button.button-auth.logged-in {
    svg.icon {
      color: ${colors.infoLight};
      stroke: ${colors.infoLight};
    }
  }
`;
