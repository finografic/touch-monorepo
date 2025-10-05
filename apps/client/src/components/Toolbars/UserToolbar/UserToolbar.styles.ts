import { css } from '@emotion/react';
import { baseToolbarStyles } from '../toolbar.styles';

/**
 * FrontEndToolbar styles - extends base toolbar styles
 * Add any frontend-specific style overrides here if needed
 */
// export const styles = baseToolbarStyles;

export const styles = css`
  ${baseToolbarStyles}

  .button-box button.btn {
    &:hover {
      cursor: pointer;
      border-color: transparent;
      background-color: transparent;
    }
  }
`;
