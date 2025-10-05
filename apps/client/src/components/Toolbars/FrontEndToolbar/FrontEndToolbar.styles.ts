import { css } from '@emotion/react';
import { baseToolbarStyles } from '../toolbar.styles';
import { colors } from 'styles';

/**
 * FrontEndToolbar styles - extends base toolbar styles
 * Add any frontend-specific style overrides here if needed
 */
// export const styles = baseToolbarStyles;

export const styles = css`
  ${baseToolbarStyles}

  .button-box button.btn {
    svg.icon {
      color: ${colors.greyLight}!important;
      border-color: ${colors.greyLight}!important;
    }
    &:hover {
      cursor: pointer;
      border-color: transparent;
      background-color: transparent;
    }
  }
`;
