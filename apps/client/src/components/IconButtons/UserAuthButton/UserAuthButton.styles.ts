import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';

/**
 * FrontEndToolbar styles - extends base toolbar styles
 * Add any frontend-specific style overrides here if needed
 */

export const styles = css`
  &.button.button-auth.logged-out,
  &.button.button-auth.logged-in {
    svg.icon {
      color: ${colors.white};
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
