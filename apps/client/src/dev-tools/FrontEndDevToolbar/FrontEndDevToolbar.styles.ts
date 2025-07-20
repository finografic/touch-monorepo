import { css } from '@emotion/react';
import { baseToolbarStyles } from '../../admin-tools/toolbar.styles';
import { colors } from 'styles';

/**
 * FrontEndDevToolbar styles - extends base toolbar styles with grey color scheme
 */
export const styles = css`
  ${baseToolbarStyles}

  /* Override button colors to grey for DevTools */
  button {
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
`;
